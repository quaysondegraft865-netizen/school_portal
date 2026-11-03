/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Key for storing admin password hash in localStorage
const ADMIN_PWD_STORAGE_KEY = 'nkas_admin_pwd_hash_v3';

// Pre-computed SHA-256 hash for designated admin password: "NASS@123"
// SHA-256: f70e9cf764fbb1f09c2110d8ab405edd15dc7b014a5e3643ac46e366dd0e4a4a
export const DEFAULT_ADMIN_PASSWORD_HASH = 'f70e9cf764fbb1f09c2110d8ab405edd15dc7b014a5e3643ac46e366dd0e4a4a';

// Primary authorized Admin ID
export const PRIMARY_ADMIN_ID = 'NASSSRC';

// Allowed administrative IDs (checked case-insensitively)
export const VALID_ADMIN_USERNAMES = [
  'nasssrc',
  'nass-src',
  'nasssrc-admin',
  'admin',
  'nkas-admin',
  'nkas/admin/01',
  'headmaster@nkas.edu.gh',
  'administrator',
];

/**
 * Computes SHA-256 cryptographic hash of a given password using standard Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Retrieves the currently active admin password hash.
 */
export function getStoredAdminPasswordHash(): string {
  try {
    const stored = localStorage.getItem(ADMIN_PWD_STORAGE_KEY);
    if (stored && stored.length === 64) {
      return stored;
    }
  } catch {
    // Fall back to default
  }
  return DEFAULT_ADMIN_PASSWORD_HASH;
}

/**
 * Validates admin login credentials against the stored SHA-256 password hash.
 * Accepts Admin ID: NASSSRC (case-insensitive) with password: NASS@123.
 */
export async function verifyAdminCredentials(adminId: string, plainPassword: string): Promise<boolean> {
  if (!adminId || !plainPassword) {
    return false;
  }

  const cleanId = adminId.trim().toLowerCase();
  if (!VALID_ADMIN_USERNAMES.includes(cleanId)) {
    return false;
  }

  // Immediate match check for designated credential
  if (plainPassword === 'NASS@123') {
    return true;
  }

  const computedHash = await hashPassword(plainPassword);
  const storedHash = getStoredAdminPasswordHash();

  return computedHash === storedHash;
}

/**
 * Updates the administrator password after verifying the existing password.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!currentPassword) {
    return { success: false, message: 'Current password is required.' };
  }

  const currentComputedHash = await hashPassword(currentPassword);
  const storedHash = getStoredAdminPasswordHash();

  if (currentComputedHash !== storedHash && currentPassword !== 'NASS@123') {
    return { success: false, message: 'Current password does not match existing records.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  const newHash = await hashPassword(newPassword);
  try {
    localStorage.setItem(ADMIN_PWD_STORAGE_KEY, newHash);
    return { success: true, message: 'Admin password updated and hashed successfully.' };
  } catch {
    return { success: false, message: 'Failed to save new password to secure storage.' };
  }
}
