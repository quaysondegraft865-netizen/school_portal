/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';

interface StudentPortalLoginProps {
  onLoginSuccess: (student: Student) => void;
  onNavigateToAdmin: () => void;
  students: Student[];
}

export const StudentPortalLogin: React.FC<StudentPortalLoginProps> = ({
  onLoginSuccess,
  onNavigateToAdmin,
  students,
}) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = indexNumber.trim().toUpperCase();
    
    // Find matching active student (matches exact student_id or clean alphanumeric or suffix)
    const matched = students.find(
      (s) =>
        (s.student_id.toUpperCase() === cleanId ||
         s.student_id.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '') ||
         s.student_id.endsWith(cleanId)) &&
        s.status === 'Active'
    );

    if (matched && password.length >= 1) {
      setError(false);
      onLoginSuccess(matched);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Panel */}
      <div className="left-panel-student w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white min-h-[420px] md:min-h-screen relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-8 sm:mb-12">
            <img
              src="/logo.jpg"
              alt="NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white mr-4 object-cover shadow-lg"
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
            Student Portal
          </h1>
          <p className="text-base sm:text-lg text-blue-100 font-medium">
            Knowledge &bull; Discipline &bull; Service
          </p>
        </div>

        {/* Student Image with authentic blend mode */}
        <div className="student-image-container w-full mt-auto pt-6 flex items-end">
          <img
            src="/young-scholars-graduation.png"
            alt="NKAS Students"
            className="student-img w-full max-h-[300px] object-cover object-top"
          />
        </div>
      </div>

      {/* Right Panel (Login Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Top navigation switch to admin */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onNavigateToAdmin}
              className="text-xs font-semibold text-[#153c78] hover:text-[#0d264d] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Switch to Admin Portal</span>
            </button>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Sign in
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
              Enter your student index number and password to access your academic records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="indexNumber"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Student Index Number
              </label>
              <input
                type="text"
                id="indexNumber"
                name="indexNumber"
                value={indexNumber}
                onChange={(e) => {
                  setIndexNumber(e.target.value);
                  if (error) setError(false);
                }}
                className="custom-input"
                placeholder="e.g. NKAS/2025/2APT101"
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
                  placeholder="Enter your student password"
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
                id="loginError"
                className="text-red-700 text-xs sm:text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2"
                role="alert"
              >
                <i className="fa-solid fa-triangle-exclamation mt-0.5 text-red-500"></i>
                <div>
                  <p className="font-semibold">Sign-in Failed</p>
                  <p className="text-red-600 mt-0.5">
                    Invalid student index number or password, or your account may be inactive. Please check your credentials.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="custom-btn w-full mt-2 text-base font-semibold shadow"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 space-y-2">
            <p className="flex items-center justify-center gap-1.5 text-gray-600 font-medium">
              <i className="fa-solid fa-circle-info text-blue-600"></i>
              <span>Need help accessing your student portal?</span>
            </p>
            <p className="text-gray-400 text-[11px]">
              Contact the ICT Department or Form Master with your admission slip to retrieve or reset your portal credentials.
            </p>
          </div>

          <footer className="mt-8 text-center text-gray-400 text-xs">
            <p>&copy; 2026 NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
