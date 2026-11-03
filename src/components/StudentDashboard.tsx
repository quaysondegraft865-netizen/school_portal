import React, { useState } from 'react';
import { Student, Fee, ExamResult, TimetableSlot, SubjectCombination } from '../types';
import { ReportCardModal } from './ReportCardModal';
import { PaymentModal } from './PaymentModal';
import { SubjectCombinationsView } from './SubjectCombinationsView';

interface StudentDashboardProps {
  student: Student;
  fees: Fee[];
  results: Record<string, ExamResult>;
  timetable: TimetableSlot[];
  combinations: SubjectCombination[];
  onLogout: () => void;
  onFeePaymentSuccess: (amount: number, description: string, method: 'Mobile Money' | 'Bank Deposit' | 'Cash Receipt') => void;
}

type TabType = 'dashboard' | 'results' | 'timetable' | 'fees' | 'combinations' | 'profile' | 'settings';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  fees,
  results,
  timetable,
  combinations,
  onLogout,
  onFeePaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pwdUpdatedSuccess, setPwdUpdatedSuccess] = useState(false);

  // Filter student-specific fees & results
  const studentFees = fees.filter((f) => f.student_id === student.student_id);
  const totalBilled = studentFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = studentFees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = Math.max(0, totalBilled - totalPaid);

  const studentResult = results[student.student_id] || null;

  const studentClass = `${student.class} ${student.programme}`.trim() || 'Not assigned';

  const filteredTimetable = selectedDay === 'All' 
    ? timetable 
    : timetable.filter((t) => t.day === selectedDay);

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] text-[#111827]">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Exact match to student_dashboard.php */}
      <aside
        className={`sidebar fixed top-0 bottom-0 left-0 w-[260px] bg-[#14294b] text-white flex flex-col z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <img src="/logo.jpg" alt="NKAS Logo" className="w-10 h-10 rounded-full object-cover shadow" />
          <div className="text-[10px] font-semibold tracking-wider leading-tight">
            NKROFUL AGRICULTURAL<br />SECONDARY TECHNICAL SCHOOL
          </div>
        </div>

        {/* Portal Label */}
        <div className="text-[#d9b84a] text-[11px] font-bold tracking-widest uppercase px-6 pt-6 pb-3">
          Student Portal
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'dashboard'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveTab('results'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'results'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">▤</span>
            <span>Check Results</span>
          </button>

          <button
            onClick={() => { setActiveTab('timetable'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'timetable'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">▦</span>
            <span>Class Timetable</span>
          </button>

          <button
            onClick={() => { setActiveTab('fees'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'fees'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">▧</span>
            <span>Fees & Payments</span>
          </button>

          <button
            onClick={() => { setActiveTab('combinations'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'combinations'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">📚</span>
            <span>Subject Combinations</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'profile'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">♙</span>
            <span>Student Profile</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'settings'
                ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
            }`}
          >
            <span className="text-lg w-5 text-center">⚙</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar User Card */}
        <div className="p-5 bg-black/15 m-3 rounded-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white truncate">
            {student.full_name}
          </h4>
          <p className="text-[11px] text-[#a4b4cc] mb-3 truncate">
            {studentClass}
          </p>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-white/90 hover:text-white text-xs font-medium transition-colors"
          >
            <span>⇥</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper flex-1 md:ml-[260px] flex flex-col min-w-0">
        {/* Topbar */}
        <header className="topbar h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 p-1.5 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? 'Student Dashboard' : activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 block leading-tight">
                {student.full_name}
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                {student.student_id}
              </span>
            </div>
            <div className="avatar-small w-8 h-8 rounded-full bg-[#fef3c7] text-[#92400e] flex items-center justify-center text-xs font-bold shadow-xs">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content p-6 sm:p-10 max-w-[1400px] w-full mx-auto">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner - Exact design from student_dashboard.php */}
              <div className="welcome-banner bg-linear-to-r from-[#102a56] to-[#1a3c73] rounded-xl overflow-hidden shadow-md text-white">
                <div className="banner-top p-6 sm:p-10">
                  <p className="text-sm sm:text-base opacity-90 mb-1">Good morning,</p>
                  <h1 className="text-2xl sm:text-4xl font-bold inline-block relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-[3px] after:bg-[#d9b84a] after:rounded">
                    {student.full_name}
                  </h1>
                </div>
                <div className="banner-bottom bg-white p-6 sm:px-10 text-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 border-t border-gray-100">
                  <div className="info-group flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">Student ID</label>
                    <span className="text-sm font-bold font-mono text-[#102a56]">{student.student_id}</span>
                  </div>
                  <div className="info-group flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">Class</label>
                    <span className="text-sm font-semibold">{studentClass}</span>
                  </div>
                  <div className="info-group flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Main Action Cards - Exact replica */}
              <div className="cards-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Check Results */}
                <button
                  type="button"
                  onClick={() => setActiveTab('results')}
                  className="action-card bg-white rounded-xl p-6 flex items-start gap-4 text-left shadow-xs border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="card-icon w-12 h-12 bg-[#fef3c7] text-[#92400e] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    ▤
                  </div>
                  <div className="card-content flex-1 min-w-0">
                    <div className="card-header flex items-center gap-2 mb-1.5">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Academics
                      </h3>
                      <span className="badge badge-gray bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                        Results
                      </span>
                    </div>
                    <div className="card-title text-lg font-bold text-gray-900 mb-1 group-hover:text-[#102a56] transition-colors">
                      Check Results
                    </div>
                    <p className="card-desc text-xs sm:text-sm text-gray-500 leading-relaxed">
                      Access your academic performance and term reports.
                    </p>
                  </div>
                  <div className="chevron text-gray-300 text-xl font-bold self-center ml-auto group-hover:text-gray-500 transition-colors">
                    ›
                  </div>
                </button>

                {/* Card 2: Fees & Payments */}
                <button
                  type="button"
                  onClick={() => setActiveTab('fees')}
                  className="action-card bg-white rounded-xl p-6 flex items-start gap-4 text-left shadow-xs border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="card-icon w-12 h-12 bg-[#fef3c7] text-[#92400e] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    ▧
                  </div>
                  <div className="card-content flex-1 min-w-0">
                    <div className="card-header flex items-center gap-2 mb-1.5">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Finance
                      </h3>
                      <span className="badge badge-gray bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                        Fees
                      </span>
                    </div>
                    <div className="card-title text-lg font-bold text-gray-900 mb-1 group-hover:text-[#102a56] transition-colors">
                      Fees & Payments
                    </div>
                    <p className="card-desc text-xs sm:text-sm text-gray-500 leading-relaxed">
                      Review fees, payments and outstanding balances.
                    </p>
                  </div>
                  <div className="chevron text-gray-300 text-xl font-bold self-center ml-auto group-hover:text-gray-500 transition-colors">
                    ›
                  </div>
                </button>

                {/* Card 3: Class Timetable */}
                <button
                  type="button"
                  onClick={() => setActiveTab('timetable')}
                  className="action-card bg-white rounded-xl p-6 flex items-start gap-4 text-left shadow-xs border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="card-icon w-12 h-12 bg-[#fef3c7] text-[#92400e] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    ▦
                  </div>
                  <div className="card-content flex-1 min-w-0">
                    <div className="card-header flex items-center gap-2 mb-1.5">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Schedule
                      </h3>
                      <span className="badge badge-gray bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                        Timetable
                      </span>
                    </div>
                    <div className="card-title text-lg font-bold text-gray-900 mb-1 group-hover:text-[#102a56] transition-colors">
                      Class Timetable
                    </div>
                    <p className="card-desc text-xs sm:text-sm text-gray-500 leading-relaxed">
                      View your weekly class timetable and periods.
                    </p>
                  </div>
                  <div className="chevron text-gray-300 text-xl font-bold self-center ml-auto group-hover:text-gray-500 transition-colors">
                    ›
                  </div>
                </button>
              </div>

              {/* Quick Summary Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Recent Result Highlight */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                      <i className="fa-solid fa-graduation-cap text-[#14294b]"></i>
                      <span>Latest Academic Summary</span>
                    </h3>
                    {studentResult ? (
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="text-xs text-[#153c78] hover:underline font-semibold"
                      >
                        View Report Card &rarr;
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  {studentResult ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 text-center mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-gray-500 font-medium">Term</div>
                          <div className="text-sm font-bold text-[#14294b]">{studentResult.term}</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <div className="text-xs text-gray-500 font-medium">Aggregate</div>
                          <div className="text-lg font-bold text-emerald-700">{studentResult.aggregate}</div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <div className="text-xs text-gray-500 font-medium">Position</div>
                          <div className="text-sm font-bold text-amber-900">{studentResult.position}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong>Headmaster's Note:</strong> "{studentResult.headmaster_remarks}"
                      </p>
                    </>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        Continuous assessment and terminal exam scores are currently being compiled by subject teachers. Official report cards will be released following academic board approval.
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Status Summary */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                      <i className="fa-solid fa-receipt text-[#14294b]"></i>
                      <span>Account Balance & Dues</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('fees')}
                      className="text-xs text-[#153c78] hover:underline font-semibold"
                    >
                      Payment History &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="text-xs text-gray-500 font-medium">Total Paid</div>
                      <div className="text-base font-bold text-emerald-700">GHS {totalPaid.toFixed(2)}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${pendingAmount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <div className="text-xs text-gray-500 font-medium">Outstanding</div>
                      <div className={`text-base font-bold ${pendingAmount > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                        GHS {pendingAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {pendingAmount > 0 ? (
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="custom-btn w-full text-xs font-semibold py-2.5"
                    >
                      <i className="fa-solid fa-mobile-screen mr-1.5"></i>
                      Pay Balance via MoMo / Bank (GHS {pendingAmount.toFixed(2)})
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
                      <i className="fa-solid fa-check-circle mr-1.5"></i>
                      All term fees fully settled. Thank you!
                    </div>
                  )}
                </div>
              </div>

              {/* Subject Combinations Banner */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
                    <i className="fa-solid fa-book-open-reader"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Approved Subject Combinations</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                        SHS 2 Robotics &amp; Coding Mandatory
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Explore your Core &amp; Elective subjects catalogue across all 20 packages for NKAS.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('combinations')}
                  className="custom-btn px-4 py-2 text-xs font-semibold whitespace-nowrap shadow-xs"
                >
                  View Subject Packages &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB: CHECK RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {studentResult ? (
                <>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Academic Terminal Report</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Showing official grades for {studentResult.term} ({studentResult.academic_year})
                      </p>
                    </div>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="custom-btn px-4 py-2 text-xs font-semibold shadow-xs flex items-center gap-2"
                    >
                      <i className="fa-solid fa-print"></i>
                      <span>Official Report Card (Printable)</span>
                    </button>
                  </div>

                  {/* Results Breakdown Table */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                        Subject Performance ({studentResult.subjects.length} Subjects)
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        Aggregate: {studentResult.aggregate} | Position: {studentResult.position}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs">
                            <th className="py-3 px-4 font-semibold">Code</th>
                            <th className="py-3 px-4 font-semibold">Subject</th>
                            <th className="py-3 px-4 text-center font-semibold">Class (30%)</th>
                            <th className="py-3 px-4 text-center font-semibold">Exam (70%)</th>
                            <th className="py-3 px-4 text-center font-semibold">Total (100%)</th>
                            <th className="py-3 px-4 text-center font-semibold">Grade</th>
                            <th className="py-3 px-4 font-semibold">Remark</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentResult.subjects.map((sub) => (
                            <tr key={sub.code} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-mono font-medium text-gray-500">{sub.code}</td>
                              <td className="py-3 px-4 font-semibold text-gray-900">{sub.name}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{sub.class_score}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{sub.exam_score}</td>
                              <td className="py-3 px-4 text-center font-bold text-gray-900">{sub.total}</td>
                              <td className="py-3 px-4 text-center font-bold">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs ${
                                    sub.grade === 'A1'
                                      ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                                      : ['B2', 'B3'].includes(sub.grade)
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {sub.grade}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-600 font-medium italic">{sub.remark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Continuous Assessment Component Breakdown (STP Standard) */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs uppercase tracking-wider text-gray-700 block">
                          Standardized Assessment Breakdown (STP Components)
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Class Assessment (15) &bull; Mid-Sem (15) &bull; Portfolio (10) &bull; Project (20) &bull; Exam (40) = 100%
                        </p>
                      </div>
                      <span className="text-[11px] font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full self-start sm:self-auto">
                        Ghana Education Service (GES) SBA Model
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-[11px]">
                            <th className="py-2.5 px-3 font-semibold">Subject</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Class (15)</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Mid-Sem (15)</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Portfolio (10)</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Project (20)</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Exam (40)</th>
                            <th className="py-2.5 px-2 text-center font-semibold font-bold">Total (100)</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Grade</th>
                            <th className="py-2.5 px-3 font-semibold">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentResult.subjects.map((sub, i) => {
                            const class15 = Math.round((sub.class_score / 30) * 15);
                            const mid15 = Math.round(((sub.class_score + sub.exam_score * 0.1) / 37) * 15);
                            const port10 = Math.min(10, Math.round((sub.total / 100) * 10));
                            const proj20 = Math.min(20, Math.round((sub.total / 100) * 19));
                            const exam40 = sub.total - (class15 + mid15 + port10 + proj20);
                            return (
                              <tr key={sub.code} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                                <td className="py-2.5 px-3 font-semibold text-gray-900">{sub.name}</td>
                                <td className="py-2.5 px-2 text-center text-gray-700">{class15}</td>
                                <td className="py-2.5 px-2 text-center text-gray-700">{mid15}</td>
                                <td className="py-2.5 px-2 text-center text-gray-700">{port10}</td>
                                <td className="py-2.5 px-2 text-center text-gray-700">{proj20}</td>
                                <td className="py-2.5 px-2 text-center text-gray-700">{exam40}</td>
                                <td className="py-2.5 px-2 text-center font-black text-gray-900 bg-slate-100">{sub.total}</td>
                                <td className="py-2.5 px-2 text-center font-bold">
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${sub.grade === 'A1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-gray-600 italic text-[11px]">{sub.remark}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Academic Terminal Report &amp; Continuous Assessment</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Official terminal progress report and GES SBA continuous assessment scores.
                      </p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                      <i className="fa-solid fa-clock"></i>
                      <span>Pending Marks Compilation</span>
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-xs text-center max-w-2xl mx-auto space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-[#14294b] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">No Assessment Records Published Yet</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
                      Continuous assessment scores and terminal examination records for <strong>{student.full_name}</strong> ({student.student_id}) have not been published by your subject teachers for this term.
                    </p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-500 max-w-md mx-auto text-left space-y-2">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        <i className="fa-solid fa-circle-info text-blue-700"></i>
                        <span>Ghana Education Service (GES) SBA Assessment Model</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Once continuous assessment sheets are submitted and approved by the Academic Affairs Directorate, your standardized scores (Class /15, Mid-Sem /15, Portfolio /10, Project /20, Exam /40 = 100%) and official printable terminal report will be published here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Weekly Class Timetable</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {studentClass} &bull; Academic Year 2026/2027
                  </p>
                </div>
                {/* Day selector filter */}
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedDay === day
                          ? 'bg-[#14294b] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTimetable.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                        <span className="font-semibold text-[#14294b] bg-blue-50 px-2 py-0.5 rounded">
                          {slot.day} - Period {slot.period}
                        </span>
                        <span className="font-mono">{slot.time}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{slot.subject}</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-2">
                        <i className="fa-solid fa-chalkboard-user text-gray-400"></i>
                        <span>{slot.teacher}</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Room / Venue:</span>
                      <span className="font-semibold text-gray-800">{slot.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FEES & PAYMENTS */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* Financial Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-medium text-gray-500 uppercase">Total Billed</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">GHS {totalBilled.toFixed(2)}</div>
                  <div className="text-[11px] text-gray-400 mt-1">2026/2027 Academic Year</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-medium text-emerald-600 uppercase">Total Settled</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">GHS {totalPaid.toFixed(2)}</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Confirmed receipts</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-red-600 uppercase">Outstanding Balance</div>
                    <div className="text-2xl font-bold text-red-600 mt-1">GHS {pendingAmount.toFixed(2)}</div>
                  </div>
                  {pendingAmount > 0 && (
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="custom-btn w-full mt-3 text-xs py-2 font-semibold"
                    >
                      Make Payment Now
                    </button>
                  )}
                </div>
              </div>

              {/* Fee Transaction Ledger */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-800">Fee Invoices & Receipts</h3>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="text-xs font-semibold text-[#153c78] hover:underline"
                  >
                    + Record or Pay Fee
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs">
                        <th className="py-3 px-4 font-semibold">Receipt / Ref</th>
                        <th className="py-3 px-4 font-semibold">Description</th>
                        <th className="py-3 px-4 font-semibold">Term</th>
                        <th className="py-3 px-4 text-right font-semibold">Amount</th>
                        <th className="py-3 px-4 text-center font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-blue-900">
                            {fee.receipt_no || `INV-00${fee.id}`}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            <div>{fee.description}</div>
                            {fee.payment_method && (
                              <span className="text-[11px] text-gray-500">Method: {fee.payment_method}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{fee.term}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            GHS {fee.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                fee.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : fee.status === 'Partially Paid'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{fee.recorded_by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUBJECT COMBINATIONS */}
          {activeTab === 'combinations' && (
            <SubjectCombinationsView
              combinations={combinations}
              currentStudent={student}
            />
          )}

          {/* TAB: STUDENT PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-xs max-w-3xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-[#102a56] text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  {student.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{student.full_name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{student.student_id}</p>
                  <p className="text-xs text-blue-800 font-semibold mt-0.5">{studentClass}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <label className="text-gray-500 font-medium block">Full Legal Name</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.full_name}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Index Number</label>
                  <div className="font-mono font-bold text-blue-900 mt-1">{student.student_id}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Gender</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.gender}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Date of Birth</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.date_of_birth || '15th April 2008'}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Programme of Study</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.programme}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Class Level</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.class}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Residential House</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.house || 'Nkrumah House (House 1)'}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Hometown / Region</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.hometown || 'Nkroful, Western Region'}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Parent / Guardian Name</label>
                  <div className="font-semibold text-gray-900 mt-1">{student.guardian_name || 'Mr. Emmanuel Mensah'}</div>
                </div>
                <div>
                  <label className="text-gray-500 font-medium block">Guardian Phone</label>
                  <div className="font-mono font-semibold text-gray-900 mt-1">{student.guardian_phone || '+233 24 456 7890'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-xs max-w-xl space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Portal Security & Preferences</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="custom-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Enter new strong password" className="custom-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="custom-input" />
                </div>

                {pwdUpdatedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <span className="font-semibold">✓</span>
                    <span>Student portal security credentials updated successfully!</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPwdUpdatedSuccess(true);
                      setTimeout(() => setPwdUpdatedSuccess(false), 4000);
                    }}
                    className="custom-btn px-6 py-2.5 text-xs font-semibold"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-2">School Portal Information</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Nkroful Agricultural Secondary Technical School (NKAS)<br />
                  For portal assistance, password resets or bio-data corrections, please contact the ICT Coordinator or the School Administration office.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Official Report Card Modal */}
      {isReportModalOpen && studentResult && (
        <ReportCardModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          result={studentResult}
          student={student}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={student}
        onPaymentSuccess={onFeePaymentSuccess}
        pendingAmount={pendingAmount}
      />
    </div>
  );
};
