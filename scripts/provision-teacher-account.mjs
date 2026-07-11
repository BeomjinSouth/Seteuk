import { randomBytes, scrypt } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/;
const SCHOOL = (process.env.TEACHER_SCHOOL || '성호중학교').trim().replace(/\s+/g, '');
const SUBJECT = (process.env.TEACHER_SUBJECT || '담당 교과').trim();

function requireEnv(name) {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '');
}

function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$v1$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

function getSupabaseUrl() {
  const explicit = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  const projectId = (process.env.SUPABASE_PROJECT_ID || '').trim();
  return PROJECT_REF_PATTERN.test(projectId) ? `https://${projectId}.supabase.co` : '';
}

const loginId = requireEnv('TEACHER_LOGIN_ID').toLowerCase();
const teacherName = requireEnv('TEACHER_NAME');
const password = requireEnv('TEACHER_PASSWORD');
const role = requireEnv('TEACHER_ROLE');
const supabaseUrl = getSupabaseUrl();
const supabaseSecret = requireEnv('SUPABASE_SECRET_KEY');

if (!supabaseUrl) throw new Error('SUPABASE_URL or a valid SUPABASE_PROJECT_ID is required.');
if (password.length < 12) throw new Error('TEACHER_PASSWORD must be at least 12 characters.');
if (role !== 'teacher' && role !== 'admin') throw new Error('TEACHER_ROLE must be teacher or admin.');
if (!/^[가-힣]{2,10}$/.test(teacherName)) throw new Error('TEACHER_NAME must be 2-10 Hangul characters.');

const teacherKey = [slugify(SCHOOL), slugify(teacherName), slugify(SUBJECT)].join('::');
const passwordHash = await hashPassword(password);
const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from('teacher_accounts')
  .upsert({
    school: SCHOOL,
    login_id: loginId,
    teacher_key: teacherKey,
    teacher_name: teacherName,
    subject: SUBJECT,
    password_hash: passwordHash,
    role,
    active: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'school,login_id' })
  .select('id,school,login_id,teacher_key,teacher_name,subject,role,active')
  .single();

if (error) throw new Error(`Teacher account provisioning failed: ${error.message}`);

console.log(JSON.stringify({ success: true, account: data }, null, 2));
