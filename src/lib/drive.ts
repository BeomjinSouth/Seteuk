'use server';

import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { google, drive_v3 } from 'googleapis';

/**
 * Google Drive Service for Evaluation Checking
 * 
 * Stores evaluation check results in the teacher's personal Google Drive.
 * 
 * Prerequisites:
 * - Service Account JSON Key (GOOGLE_SERVICE_ACCOUNT_KEY env var)
 * - Teacher must share the root folder with the service account (Editor role)
 * 
 * Folder Structure:
 * /EvaluationCheck/
 *   /2026-01-17_Assessment_Math2_DOC_A1B2C3D4/
 *     original.pdf
 *     /pages/ (Page images)
 *     /extract/ (OCR/Layout/Question Structure JSON)
 *     /analysis/ (Question Analysis JSON)
 *     /overrides/ (Teacher override logs for images)
 *     manifest.json (Document index)
 */

// ============ Google Drive API 초기화 ============

let driveClient: drive_v3.Drive | null = null;

function getServiceAccountAuth() {
    // Option 1: JSON 형식의 전체 키 (GOOGLE_SERVICE_ACCOUNT_KEY)
    const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (keyJson) {
        const key = JSON.parse(keyJson);
        return new google.auth.GoogleAuth({
            credentials: key,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
    }

    // Option 2: 개별 환경변수 (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY)
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !privateKey) {
        throw new Error(
            'Google 서비스 계정 설정이 필요합니다. GOOGLE_SERVICE_ACCOUNT_KEY 또는 GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY 환경변수를 설정해 주세요.'
        );
    }

    return new google.auth.GoogleAuth({
        credentials: {
            client_email: email,
            private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive'],
    });
}

function getDriveAuth() {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost';

    if (clientId || clientSecret || refreshToken) {
        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error(
                'GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN ?섍꼍蹂?섎? 紐⑤몢 ?ㅼ젙??二쇱꽭요.'
            );
        }
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        return oauth2Client;
    }

    return getServiceAccountAuth();
}

function getDriveClient(): drive_v3.Drive {
    if (!driveClient) {
        const auth = getDriveAuth();
        driveClient = google.drive({ version: 'v3', auth });
    }
    return driveClient;
}

const sharedDriveOptions = {
    supportsAllDrives: true,
};

const sharedDriveListOptions = {
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: 'allDrives',
};

// ============ 폴더 관련 함수 ============

/**
 * Verifies access to the root folder.
 * 
 * @param rootFolderId - The ID of the root folder shared by the teacher.
 * @returns An object containing success status, folder name (if successful), or error message.
 */
export async function verifyRootFolder(rootFolderId: string): Promise<{
    success: boolean;
    folderName?: string;
    error?: string;
}> {
    try {
        const drive = getDriveClient();
        const response = await drive.files.get({
            fileId: rootFolderId,
            fields: 'id, name, mimeType',
            ...sharedDriveOptions,
        });

        if (response.data.mimeType !== 'application/vnd.google-apps.folder') {
            return { success: false, error: '지정된 ID가 폴더가 아닙니다.' };
        }

        return { success: true, folderName: response.data.name || undefined };
    } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류';
        if (message.includes('404') || message.includes('notFound')) {
            return { success: false, error: '폴더를 찾을 수 없습니다. 폴더 ID를 확인하거나 서비스 계정에 공유되었는지 확인하세요.' };
        }
        if (message.includes('403') || message.includes('forbidden')) {
            return { success: false, error: '폴더에 대한 접근 권한이 없습니다. 서비스 계정에 편집자 권한을 부여하세요.' };
        }
        return { success: false, error: message };
    }
}

/**
 * Creates a subfolder for a specific document.
 * 
 * @param parentFolderId - The ID of the parent (root) folder.
 * @param folderName - The name of the folder to create.
 * @returns The ID of the created folder.
 */
export async function createDocumentFolder(
    parentFolderId: string,
    folderName: string
): Promise<string> {
    const drive = getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        },
        fields: 'id',
        ...sharedDriveOptions,
    });

    if (!response.data.id) {
        throw new Error('폴더 생성에 실패했습니다.');
    }

    return response.data.id;
}

/**
 * Creates the standard subfolder structure for a document.
 * Creates 'pages', 'extract', 'analysis', and 'overrides' folders.
 * 
 * @param documentFolderId - The ID of the document folder.
 * @returns A map of created folder names to their IDs.
 */
export async function createSubfolders(documentFolderId: string): Promise<{
    pages: string;
    extract: string;
    analysis: string;
    overrides: string;
}> {
    const subfolders = ['pages', 'extract', 'analysis', 'overrides'];
    const result: Record<string, string> = {};

    for (const name of subfolders) {
        const folderId = await createDocumentFolder(documentFolderId, name);
        result[name] = folderId;
    }

    return result as { pages: string; extract: string; analysis: string; overrides: string };
}

// ============ 파일 업로드/다운로드 ============

interface UploadFileOptions {
    folderId: string;
    fileName: string;
    content: Buffer | string;
    mimeType: string;
}

/**
 * Uploads a file to Google Drive.
 * 
 * @param options - Upload options including folder ID, file name, content, and MIME type.
 * @returns The ID of the uploaded file.
 */
export async function uploadFile({
    folderId,
    fileName,
    content,
    mimeType,
}: UploadFileOptions): Promise<string> {
    const drive = getDriveClient();

    // Buffer가 아닌 경우 Buffer로 변환
    const buffer = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            mimeType,
            body: Readable.from(buffer),
        },
        fields: 'id',
        ...sharedDriveOptions,
    });

    if (!response.data.id) {
        throw new Error('파일 업로드에 실패했습니다.');
    }

    return response.data.id;
}

/**
 * Helper function to upload a JSON file.
 * Automatically adds .json extension if missing and sets correct MIME type.
 * 
 * @param folderId - Target folder ID.
 * @param fileName - File name.
 * @param data - The data object to stringify and upload.
 * @returns The uploaded file ID.
 */
export async function uploadJsonFile(
    folderId: string,
    fileName: string,
    data: unknown
): Promise<string> {
    const jsonString = JSON.stringify(data, null, 2);
    return uploadFile({
        folderId,
        fileName: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
        content: jsonString,
        mimeType: 'application/json',
    });
}

/**
 * Helper function to upload an image file from base64 string.
 * 
 * @param folderId - Target folder ID.
 * @param fileName - File name.
 * @param base64Data - Base64 encoded image data.
 * @param imageType - Image type ('png' or 'jpeg'). Defaults to 'png'.
 * @returns The uploaded file ID.
 */
export async function uploadImageFile(
    folderId: string,
    fileName: string,
    base64Data: string,
    imageType: 'png' | 'jpeg' = 'png'
): Promise<string> {
    // base64 헤더 제거 (있는 경우)
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    return uploadFile({
        folderId,
        fileName,
        content: buffer,
        mimeType: `image/${imageType}`,
    });
}

/**
 * Downloads a file from Google Drive.
 * 
 * @param fileId - The ID of the file to download.
 * @returns The file content as a Buffer.
 */
export async function downloadFile(fileId: string): Promise<Buffer> {
    const drive = getDriveClient();

    const response = await drive.files.get(
        { fileId, alt: 'media', ...sharedDriveOptions },
        { responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data as ArrayBuffer);
}

/**
 * Downloads and parses a JSON file.
 * 
 * @param fileId - The ID of the JSON file.
 * @returns The parsed JSON object.
 */
export async function downloadJsonFile<T = unknown>(fileId: string): Promise<T> {
    const buffer = await downloadFile(fileId);
    const jsonString = buffer.toString('utf-8');
    return JSON.parse(jsonString);
}

// ============ File List / Search ============

interface FileInfo {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    createdTime?: string;
    modifiedTime?: string;
}

/**
 * Lists files in a folder.
 * 
 * @param folderId - The ID of the folder to list files from.
 * @returns An array of file information objects.
 */
export async function listFiles(folderId: string): Promise<FileInfo[]> {
    const drive = getDriveClient();

    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        orderBy: 'name',
        ...sharedDriveListOptions,
    });

    return (response.data.files || []).map(file => ({
        id: file.id || '',
        name: file.name || '',
        mimeType: file.mimeType || '',
        size: file.size || undefined,
        createdTime: file.createdTime || undefined,
        modifiedTime: file.modifiedTime || undefined,
    }));
}

/**
 * Finds a specific file in a folder by name.
 * 
 * @param folderId - The folder ID to search in.
 * @param fileName - The name of the file to find.
 * @returns The file info if found, or null otherwise.
 */
export async function findFile(folderId: string, fileName: string): Promise<FileInfo | null> {
    const drive = getDriveClient();

    const response = await drive.files.list({
        q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        ...sharedDriveListOptions,
    });

    const files = response.data.files || [];
    if (files.length === 0) return null;

    const file = files[0];
    return {
        id: file.id || '',
        name: file.name || '',
        mimeType: file.mimeType || '',
        size: file.size || undefined,
        createdTime: file.createdTime || undefined,
        modifiedTime: file.modifiedTime || undefined,
    };
}

// ============ File Update / Delete ============

/**
 * Updates the content of an existing file.
 * 
 * @param fileId - The ID of the file to update.
 * @param content - The new content (Buffer or string).
 * @param mimeType - The new MIME type.
 */
export async function updateFile(
    fileId: string,
    content: Buffer | string,
    mimeType: string
): Promise<void> {
    const drive = getDriveClient();
    const buffer = typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;

    await drive.files.update({
        fileId,
        media: {
            mimeType,
            body: Readable.from(buffer),
        },
        ...sharedDriveOptions,
    });
}

/**
 * Updates a JSON file with new data.
 * 
 * @param fileId - The ID of the JSON file to update.
 * @param data - The new data object.
 */
export async function updateJsonFile(fileId: string, data: unknown): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    await updateFile(fileId, jsonString, 'application/json');
}

/**
 * Moves a file to the trash.
 * 
 * @param fileId - The ID of the file to trash.
 */
export async function trashFile(fileId: string): Promise<void> {
    const drive = getDriveClient();
    await drive.files.update({
        fileId,
        requestBody: { trashed: true },
        ...sharedDriveOptions,
    });
}

// ============ Utility Functions ============

/**
 * Generates a standardized folder name for a document.
 * Format: date_description_DOC_hashPrefix
 * 
 * @param uploadDate - The date of upload.
 * @param fileDescription - The description of the file.
 * @param fileHash - The SHA-256 hash of the file.
 * @returns The generated folder name string.
 */
export async function generateDocumentFolderName(
    uploadDate: Date,
    fileDescription: string,
    fileHash: string
): Promise<string> {
    const dateStr = uploadDate.toISOString().split('T')[0]; // 2026-01-17
    const hashPrefix = fileHash.substring(0, 8).toUpperCase();
    const cleanDescription = fileDescription
        .replace(/[\\/:*?"<>|]/g, '_') // Remove invalid chars
        .substring(0, 50); // Limit length

    return `${dateStr}_${cleanDescription}_DOC_${hashPrefix}`;
}

/**
 * Generates a SHA-256 hash for the given content.
 * 
 * @param content - The content to hash (ArrayBuffer).
 * @returns The hex string of the hash.
 */
export async function generateFileHash(content: ArrayBuffer): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(content));
    return hash.digest('hex');
}

// ============ High-level Convenience Functions ============

interface DocumentFolderStructure {
    /** The ID of the root folder. */
    rootId: string;
    /** The ID of the document specific folder. */
    documentFolderId: string;
    /** IDs of the subfolders. */
    subfolders: {
        pages: string;
        extract: string;
        analysis: string;
        overrides: string;
    };
}

/**
 * Initializes the full folder structure for a document analysis.
 * Checks for existing folders to allow re-runs.
 * 
 * @param rootFolderId - The ID of the shared root folder.
 * @param uploadDate - The date of upload.
 * @param fileDescription - Check file description.
 * @param fileHash - SHA-256 hash of the file.
 * @returns The structure containing all relevant folder IDs.
 */
export async function initializeDocumentFolder(
    rootFolderId: string,
    uploadDate: Date,
    fileDescription: string,
    fileHash: string
): Promise<DocumentFolderStructure> {
    // 1. Check if same hash folder exists (Reuse policy)
    const folderName = await generateDocumentFolderName(uploadDate, fileDescription, fileHash);
    const existingFolder = await findFile(rootFolderId, folderName);

    if (existingFolder) {
        // Reuse existing folder - Retrieve subfolder IDs
        const subfolderList = await listFiles(existingFolder.id);
        const subfolders: Record<string, string> = {};

        for (const item of subfolderList) {
            if (item.mimeType === 'application/vnd.google-apps.folder') {
                subfolders[item.name] = item.id;
            }
        }

        return {
            rootId: rootFolderId,
            documentFolderId: existingFolder.id,
            subfolders: {
                pages: subfolders['pages'] || '',
                extract: subfolders['extract'] || '',
                analysis: subfolders['analysis'] || '',
                overrides: subfolders['overrides'] || '',
            },
        };
    }

    // 2. Create new folder structure
    const documentFolderId = await createDocumentFolder(rootFolderId, folderName);
    const subfolders = await createSubfolders(documentFolderId);

    return {
        rootId: rootFolderId,
        documentFolderId,
        subfolders,
    };
}
