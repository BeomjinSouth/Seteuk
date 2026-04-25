export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { execFile } from 'node:child_process';
import { access, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminRequest } from '@/lib/admin-auth';
import { clearKnowledgeDatasetCache } from '@/lib/knowledge-base';

const execFileAsync = promisify(execFile);
const KNOWLEDGE_PACKAGE_DIR = process.env.KNOWLEDGE_PACKAGE_DIR
    ? path.resolve(process.env.KNOWLEDGE_PACKAGE_DIR)
    : path.resolve(process.cwd(), '..', 'student-record-knowledge');

type CrawlRequestBody = {
    year?: string;
    maxPages?: number;
    concurrency?: number;
    delayMs?: number;
    refreshCache?: boolean;
    preferFaqOnConflict?: boolean;
};

export async function POST(request: NextRequest) {
    const unauthorized = requireAdminRequest(request);
    if (unauthorized) return unauthorized;

    let body: CrawlRequestBody = {};

    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const year = body.year?.trim() || '2026';
    const args = ['run', 'build:knowledge', '--', `--year=${year}`];

    if (Number.isInteger(body.maxPages) && body.maxPages! > 0) args.push(`--maxPages=${body.maxPages}`);
    if (Number.isInteger(body.concurrency) && body.concurrency! > 0) args.push(`--concurrency=${body.concurrency}`);
    if (Number.isInteger(body.delayMs) && body.delayMs! >= 0) args.push(`--delayMs=${body.delayMs}`);
    if (body.refreshCache !== false) args.push('--refreshCache');
    if (body.preferFaqOnConflict === true) args.push('--preferFaqOnConflict');

    try {
        await access(path.join(KNOWLEDGE_PACKAGE_DIR, 'package.json'));

        const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const { stdout, stderr } = await execFileAsync(npmCommand, args, {
            cwd: KNOWLEDGE_PACKAGE_DIR,
            timeout: 30 * 60 * 1000,
            maxBuffer: 20 * 1024 * 1024,
        });
        const outputFilename = `star-moe-knowledge-${year}.json`;
        const sourceOutputPath = path.join(KNOWLEDGE_PACKAGE_DIR, 'output', outputFilename);
        const bundledOutputDir = path.join(process.cwd(), 'output');
        const bundledOutputPath = path.join(bundledOutputDir, outputFilename);
        await mkdir(bundledOutputDir, { recursive: true });
        await copyFile(sourceOutputPath, bundledOutputPath);
        clearKnowledgeDatasetCache();

        return NextResponse.json({
            success: true,
            year,
            refreshCache: body.refreshCache !== false,
            bundledOutputPath,
            stdout,
            stderr,
        });
    } catch (error) {
        console.error('Admin crawl failed:', error);
        const missingPackage =
            error instanceof Error &&
            'code' in error &&
            (error as NodeJS.ErrnoException).code === 'ENOENT';
        return NextResponse.json(
            {
                success: false,
                error: missingPackage
                    ? `Knowledge package not found at ${KNOWLEDGE_PACKAGE_DIR}. Set KNOWLEDGE_PACKAGE_DIR or run this endpoint in the full local workspace.`
                    : error instanceof Error ? error.message : 'Admin crawl failed.',
            },
            { status: missingPackage ? 503 : 500 },
        );
    }
}
