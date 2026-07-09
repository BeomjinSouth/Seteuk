'use server';

import crypto from 'node:crypto';
import { google, drive_v3 } from 'googleapis';

/**
 * Google Drive Service for Evaluation Checking
 *
 * Verifies access to the teacher's shared Google Drive root folder.
 *
 * Prerequisites:
 * - Service Account JSON Key (GOOGLE_SERVICE_ACCOUNT_KEY env var)
 * - Teacher must share the root folder with the service account (Editor role)
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
                'GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN 환경변수를 모두 설정해 주세요.'
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
