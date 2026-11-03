/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { verifyAdminCredentials } from '../authService';

interface AdminPortalLoginProps {
  onLoginSuccess: () => void;
  onNavigateToStudent: () => void;
}

export const AdminPortalLogin: React.FC<AdminPortalLoginProps> = ({
  onLoginSuccess,
  onNavigateToStudent,
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const isValid = await verifyAdminCredentials(adminId, password);
      if (isValid) {
        onLoginSuccess();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Panel */}
      <div className="left-panel-admin w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white min-h-[420px] md:min-h-screen relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-8 sm:mb-12">
            <img
              src="/logo.jpg"
              alt="NKAS Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white mr-4 object-cover shadow-lg"
            />
            <div className="font-bold text-xs sm:text-sm tracking-wider leading-tight text-white drop-shadow">
              <div>NKROFUL</div>
              <div>AGRICULTURAL</div>
              <div>SECONDARY TECHNICAL</div>
              <div>SCHOOL</div>
            </div>
          </div>
          <p className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-yellow-300 mb-2">
            AKWAABA
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-base sm:text-lg text-blue-100 font-medium">
            Knowledge &bull; Discipline &bull; Service
          </p>
        </div>

        {/* Student Image with blend mode */}
        <div className="student-image-container w-full mt-auto pt-6 flex items-end">
          <img
            src="/young-scholars-graduation.png"
            alt="NKAS Scholars"
            className="student-img w-full max-h-[300px] object-cover object-top"
          />
        </div>
      </div>

      {/* Right Panel (Admin Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Top navigation switch to student portal */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onNavigateToStudent}
              className="text-xs font-semibold text-[#153c78] hover:text-[#0d264d] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Back to Student Portal</span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Administrative Sign-In
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
              Enter your authorized administrative ID and secure password.
            </p>
          </div>

          {/* Authorized Credentials Card */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/80 rounded-xl p-3.5 mb-6 text-xs text-amber-950 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-amber-600"></i>
                <span>Authorized Admin Credentials</span>
              </div>
              <div className="mt-1 font-mono text-xs text-amber-900 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>ID: <strong className="font-bold text-gray-900 bg-white/70 px-1.5 py-0.5 rounded border border-amber-200">NASSSRC</strong></span>
                <span>Password: <strong className="font-bold text-gray-900 bg-white/70 px-1.5 py-0.5 rounded border border-amber-200">NASS@123</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAdminId('NASSSRC');
                setPassword('NASS@123');
                setError(false);
              }}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-key text-[10px]"></i>
              <span>Auto-fill</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="adminId"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Admin ID
              </label>
              <input
                type="text"
                id="adminId"
                name="adminId"
                value={adminId}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  if (error) setError(false);
                }}
                className="custom-input"
                placeholder="e.g. NASSSRC"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  className="custom-input pr-12"
                  placeholder="e.g. NASS@123"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700 p-1.5 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  ></i>
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-red-700 text-xs sm:text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2"
                role="alert"
              >
                <i className="fa-solid fa-triangle-exclamation mt-0.5 text-red-500"></i>
                <div>
                  <p className="font-semibold">Authentication Failed</p>
                  <p className="text-red-600 mt-0.5">
                    Invalid Administrator ID or password. Please verify your credentials or contact IT Support.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="custom-btn w-full mt-2 text-base font-semibold shadow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <i className="fa-solid fa-lock text-gray-400"></i>
            <span>Protected with SHA-256 cryptographic verification</span>
          </div>

          <footer className="mt-6 text-center text-gray-400 text-xs">
            <p>&copy; 2026 NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
