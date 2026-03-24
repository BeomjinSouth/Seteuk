'use server';

import { createCanvas } from 'canvas';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// PDF.js (v4+) Node.js environment DOM API polyfill
// Must be set before loading pdf-parse or pdfjs-dist
try {
    const canvasModule = require('canvas');
    if (!global.DOMMatrix) global.DOMMatrix = canvasModule.DOMMatrix;
    if (!global.ImageData) global.ImageData = canvasModule.ImageData;
    if (!global.Path2D) global.Path2D = canvasModule.Path2D;
    // Optional polyfills:
    // if (!global.DOMPoint) global.DOMPoint = canvasModule.DOMPoint;
} catch (e) {
    console.warn('Canvas polyfill loading failed:', e);
}

// Extract PDF text using pdf-parse (to avoid pdfjs-dist worker issues)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfJsLib = any;

let pdfjsLibPromise: Promise<PdfJsLib> | null = null;

/**
 * Dynamically loads the ESM build of PDF.js for Node.js usage.
 */
async function loadPdfJs(): Promise<any> {
    // pdfjs-dist v5.x does not have legacy/build/pdf.js(CJS), so we use ESM (.mjs) only
    return import('pdfjs-dist/legacy/build/pdf.mjs');
}

/**
 * Gets the PDF.js library instance with worker disabled for server-side use.
 */
async function getPdfJs(): Promise<PdfJsLib> {
    if (!pdfjsLibPromise) {
        pdfjsLibPromise = (async () => {
            const pdfjs = await loadPdfJs();

            // Disable worker completely
            try {
                if (pdfjs?.GlobalWorkerOptions) {
                    pdfjs.GlobalWorkerOptions.workerSrc = '';
                }
            } catch (e) {
                console.warn('Failed to configure pdf.js workerSrc:', e);
            }

            return pdfjs;
        })();
    }
    return pdfjsLibPromise;
}

/**
 * Extracts text from a PDF buffer using pdf-parse.
 * This is used to avoid issues with pdfjs-dist's worker in server environments.
 * 
 * @param buffer - The PDF file buffer.
 * @returns An object containing the full text and page-separated text (currently just full text).
 */
export async function extractPdfText(buffer: Buffer): Promise<{ text: string; pageTexts: string[] }> {
    try {
        const data = await pdfParse(buffer);

        // pdf-parse provides only full text. Since there's no reliable page delimiter,
        // we treat the entire text as a single page for now using heuristics.
        const text = data.text?.trim() || '';
        const pageTexts = text ? [text] : [];

        return { text, pageTexts };
    } catch (error) {
        console.error('PDF text extraction failed:', error);
        // Return empty result on failure
        return { text: '', pageTexts: [] };
    }
}

/**
 * Converts a PDF buffer to an array of images (Server-side) using pdfjs-dist and canvas.
 * Note: If client-side conversion is used, this may not be needed.
 * 
 * @param buffer - The PDF file buffer.
 * @param scale - Rendering scale (default: 2.0).
 * @returns An object containing page images (as data URLs) and total page count.
 */
export async function convertPdfToImages(
    buffer: Buffer,
    scale: number = 2.0
): Promise<{ pageImages: string[]; pageCount: number }> {
    try {
        const pdfjs = await getPdfJs();

        const pdfDoc = await pdfjs.getDocument({
            data: new Uint8Array(buffer),
            disableWorker: true,
            useSystemFonts: true,
            isEvalSupported: false,
        }).promise;

        const pageImages: string[] = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            if (!context) throw new Error('Failed to get 2D canvas context for PDF rendering.');

            await page.render({
                canvas: canvas as unknown as HTMLCanvasElement,
                canvasContext: context as unknown as CanvasRenderingContext2D,
                viewport,
            }).promise;

            const bufferData = canvas.toBuffer('image/png');
            const base64 = bufferData.toString('base64');
            pageImages.push(`data:image/png;base64,${base64}`);
        }

        return { pageImages, pageCount: pdfDoc.numPages };
    } catch (error) {
        console.error('PDF image conversion conversion failed:', error);
        // Return empty result on failure
        return { pageImages: [], pageCount: 0 };
    }
}
