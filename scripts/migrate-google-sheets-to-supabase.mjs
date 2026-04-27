import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const SHEET_NAMES = [
  '학생',
  '반',
  '세특',
  '설정',
  '예시양식',
  '평가과제',
  '관찰메모',
  '학생데이터',
  '쿠키원장',
  '쿠키상품',
  'OCR평가',
  'EC_설정',
  'EC_문서',
  'EC_리소스',
  'EC_문항',
  'EC_문제점_요약',
  'EC_규칙',
  'EC_작업로그',
];

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const equalsIndex = trimmed.indexOf('=');
  if (equalsIndex < 0) return null;

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

async function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const parsed = parseEnvLine(line);
      if (!parsed) return;
      const [key, value] = parsed;
      if (!process.env[key]) process.env[key] = value;
    });
  } catch {
    // Env can be supplied by the caller in CI or Vercel-like shells.
  }
}

function normalizePrivateKey(raw) {
  if (!raw) return '';
  return raw
    .replace(/^["']|["']$/g, '')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .trim();
}

function getSupabaseUrl() {
  const explicitUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  if (explicitUrl) return explicitUrl.replace(/\/+$/, '');

  const projectId = (process.env.SUPABASE_PROJECT_ID || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || '').trim();
  return projectId ? `https://${projectId}.supabase.co` : '';
}

async function main() {
  await loadEnvLocal();

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ''
  ).trim();

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets environment variables are missing.');
  }
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Supabase environment variables are missing.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const sheetName of SHEET_NAMES) {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:ZZ`,
      });
      const rows = response.data.values || [];
      const { error } = await supabase.rpc('replace_sheet', {
        p_sheet_name: sheetName,
        p_rows: rows,
      });
      if (error) throw error;
      console.log(`Migrated ${sheetName}: ${rows.length} rows`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unable to parse range') || message.includes('not found')) {
        console.log(`Skipped ${sheetName}: sheet not found`);
        continue;
      }
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
