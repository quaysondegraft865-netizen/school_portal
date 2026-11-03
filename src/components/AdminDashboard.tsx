import React, { useState, useMemo } from 'react';
import { Student, Fee, ExamResult, StaffMember, SubjectCombination } from '../types';
import { NewStudentModal } from './NewStudentModal';
import { SubjectCombinationsView } from './SubjectCombinationsView';
import { Form3AssessmentManager } from './Form3AssessmentManager';
import { OfficialReceiptModal } from './OfficialReceiptModal';
import { StudentIdCardModal } from './StudentIdCardModal';
import { TestimonialModal } from './TestimonialModal';
import { PromotionManager } from './PromotionManager';
import { BroadcastCenter } from './BroadcastCenter';
import { StaffManager } from './StaffManager';
import { AuditLogViewer } from './AuditLogViewer';
import { getAllAssessmentSheets } from '../assessmentService';
import { addAuditLog } from '../adminAdvancedService';
import { changeAdminPassword } from '../authService';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  TrendingUp,
  Receipt,
  Radio,
  BookOpen,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  PlusCircle,
  Search,
  Filter,
  CreditCard,
  FileText,
  Award,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Phone,
  Mail,
  UserCheck,
  Building,
  Lock,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  fees: Fee[];
  results: Record<string, ExamResult>;
  staff: StaffMember[];
  combinations: SubjectCombination[];
  onLogout: () => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onToggleStudentStatus: (studentId: string) => void;
  onRecordFee: (fee: Fee) => void;
  onUpdateStudents?: (students: Student[]) => void;
  onUpdateStaff?: (staff: StaffMember[]) => void;
  onRestoreData?: (backup: any) => void;
}

export type AdminTab =
  | 'dashboard'
  | 'students'
  | 'assessments'
  | 'promotions'
  | 'staff'
  | 'fees'
  | 'broadcast'
  | 'combinations'
  | 'reports'
  | 'audit'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  fees,
  results,
  staff,
  combinations,
  onLogout,
  onAddStudent,
  onDeleteStudent,
  onToggleStudentStatus,
  onRecordFee,
  onUpdateStudents = () => {},
  onUpdateStaff = () => {},
  onRestoreData = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Modals state
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<Student | null>(null);
  const [selectedStudentForTestimonial, setSelectedStudentForTestimonial] = useState<Student | null>(null);
  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState<Fee | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Student search & filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedProgramme, setSelectedProgramme] = useState('All');

  // Fee search & recording state
  const [feeSearch, setFeeSearch] = useState('');
  const [showFeeRecordModal, setShowFeeRecordModal] = useState(false);
  const [feeStudentId, setFeeStudentId] = useState(students[0]?.student_id || '');
  const [feeAmount, setFeeAmount] = useState(200);
  const [feeDescription, setFeeDescription] = useState('Tuition & Facility Maintenance');
  const [feeMethod, setFeeMethod] = useState<'Mobile Money' | 'Bank Deposit' | 'Cash Receipt'>('Cash Receipt');

  // Admin Security & Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdStatus, setPwdStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwdStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    setIsChangingPwd(true);
    setPwdStatus({ type: '', message: '' });
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setPwdStatus({ type: 'success', message: 'Administrator password changed and hashed with SHA-256 successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        addAuditLog({
          user: 'Administrator',
          action: 'Admin Password Security Key Rotated',
          category: 'System',
          details: 'Updated administrative credential hash via Web Crypto SHA-256.',
          status: 'Success',
        });
      } else {
        setPwdStatus({ type: 'error', message: res.message });
      }
    } catch {
      setPwdStatus({ type: 'error', message: 'An unexpected error occurred while updating password.' });
    } finally {
      setIsChangingPwd(false);
    }
  };

  // Load continuous assessment sheets
  const [sheets] = useState(() => getAllAssessmentSheets());

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.student_id.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesClass = selectedClass === 'All' || s.class === selectedClass;
      const matchesProgramme = selectedProgramme === 'All' || s.programme === selectedProgramme;
      return matchesSearch && matchesClass && matchesProgramme;
    });
  }, [students, studentSearch, selectedClass, selectedProgramme]);

  // Financial calculations
  const totalFeesCollected = fees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalPendingFees = fees
    .filter((f) => f.status !== 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentId || feeAmount <= 0) return;

    const receiptNo = `NKAS-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFee: Fee = {
      id: Date.now(),
      student_id: feeStudentId,
      amount: feeAmount,
      description: feeDescription,
      status: 'Paid',
      recorded_by: 'Bursary Desk (Mrs. E. Kwofie)',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      receipt_no: receiptNo,
      term: '2026/2027 Term 1',
      payment_method: feeMethod,
    };

    onRecordFee(newFee);

    addAuditLog({
      user: 'Bursary Desk (Mrs. E. Kwofie)',
      action: `Official Receipt Issued: ${receiptNo}`,
      category: 'Fee / Bursary',
      details: `Collected GHS ${feeAmount.toFixed(2)} (${feeMethod}) for student ${feeStudentId}.`,
      status: 'Success',
    });

    setShowFeeRecordModal(false);
    setSelectedFeeForReceipt(newFee);
  };

  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'students', label: 'Student SIS Roster', icon: <Users className="w-4 h-4" />, badge: `${students.length}` },
    { tab: 'assessments', label: 'Continuous Assessment', icon: <GraduationCap className="w-4 h-4" /> },
    { tab: 'promotions', label: 'Batch Promotions', icon: <TrendingUp className="w-4 h-4" /> },
    { tab: 'staff', label: 'Faculty & Workload', icon: <Building className="w-4 h-4" />, badge: `${staff.length}` },
    { tab: 'fees', label: 'Fees & Cashier Desk', icon: <Receipt className="w-4 h-4" /> },
    { tab: 'broadcast', label: 'SMS & Notice Broadcaster', icon: <Radio className="w-4 h-4" /> },
    { tab: 'combinations', label: 'Subject Combinations', icon: <BookOpen className="w-4 h-4" />, badge: '16' },
    { tab: 'reports', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { tab: 'audit', label: 'Audit Trail & Backup', icon: <ShieldAlert className="w-4 h-4" /> },
    { tab: 'settings', label: 'School Configuration', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] text-[#111827]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 bottom-0 left-0 w-[260px] bg-[#14294b] text-white flex flex-col z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="brand p-5 flex items-center gap-3 border-b border-white/10">
          <img src="/logo.jpg" alt="NKAS Logo" className="w-10 h-10 rounded-full object-cover shadow" />
          <div className="brand-text text-[10px] font-semibold tracking-wider leading-tight">
            NKROFUL AGRICULTURAL<br />SECONDARY TECHNICAL SCHOOL
          </div>
        </div>

        <div className="portal-label text-[#d9b84a] text-[10px] font-bold tracking-widest uppercase px-6 pt-4 pb-2">
          G.E.S Enterprise Admin Portal
        </div>

        <nav className="nav flex-1 overflow-y-auto px-3 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === item.tab
                  ? 'bg-[#2b4c7e] text-white shadow-[inset_3px_0_0_#d9b84a]'
                  : 'text-[#a4b4cc] hover:bg-[#1e3a66] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-white/80">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-black/30 text-amber-300">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar User Card */}
        <div className="sidebar-user p-4 bg-black/20 m-3 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Administrator</h4>
              <p className="text-[10px] text-[#a4b4cc]">Dr. Kwabena Nkansah</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#d9b84a] text-[#14294b] flex items-center justify-center font-bold text-xs">
              KN
            </div>
          </div>
          <button
            onClick={onLogout}
            className="sign-out w-full flex items-center justify-center gap-1.5 text-white/80 hover:text-white text-xs font-medium py-1.5 rounded bg-white/10 hover:bg-white/15 transition-colors mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper flex-1 md:ml-[260px] flex flex-col min-w-0">
        {/* Topbar */}
        <header className="topbar h-[65px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 p-1.5 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
              <span>{navItems.find((n) => n.tab === activeTab)?.label || 'Admin Portal'}</span>
            </h2>
          </div>

          <div className="topbar-right flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Academic Year 2026/2027</span>
            </span>
            <div className="avatar-small w-8 h-8 rounded-full bg-[#14294b] text-[#d9b84a] flex items-center justify-center text-xs font-bold shadow-xs">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content p-6 sm:p-8 max-w-[1440px] w-full mx-auto">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="bg-gradient-to-r from-[#14294b] via-[#1a3664] to-[#20437d] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-blue-900/40">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 bg-[#d9b84a]/20 text-[#d9b84a] border border-[#d9b84a]/40 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    G.E.S Continuous Assessment & Administrative Console
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome, Administrator
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                    Nkroful Agricultural Secondary Technical School Management System. Oversee 35 assessment classes, 1,330 enrolled candidates, continuous assessment sheets, fee bursary, and batch student promotions.
                  </p>
                </div>
              </div>

              {/* Mandatory Curriculum Notification */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Mandatory Curriculum Directive Enforced
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5 font-medium">
                      &bull; SHS 2 ROBOTICS AND CODING ARE MANDATORY across all 19 Form 2 classes in technical, science, agricultural, and vocational streams.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('combinations')}
                  className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold text-xs rounded-lg whitespace-nowrap transition-colors"
                >
                  View Curricula &rarr;
                </button>
              </div>

              {/* KPI Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>Total Students</span>
                    <Users className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#14294b] mt-2">
                    {students.length}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Form 1, Form 2 & Form 3</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>Classes Managed</span>
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">35</div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">
                    19 Form 2 + 16 Form 3
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>Faculty & Staff</span>
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-2">
                    {staff.length}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Teaching & Admin Faculty</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>Revenue Collected</span>
                    <Receipt className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
                    GHS {totalFeesCollected.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">First Term Bursary</div>
                </div>
              </div>

              {/* Enterprise Quick Action Modules Grid */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Advanced Administrative Management Modules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* Continuous Assessment Card */}
                  <div
                    onClick={() => setActiveTab('assessments')}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Continuous Assessment (STP)</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        5-component mark sheets (Class /15, Mid-Sem /15, Portfolio /10, Project /20, Exam /40) for all 35 streams.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:translate-x-1 transition-transform">
                      <span>Manage Mark Sheets &rarr;</span>
                    </div>
                  </div>

                  {/* Batch Promotion Card */}
                  <div
                    onClick={() => setActiveTab('promotions')}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Batch Progression & Promotion</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Form 2 to Form 3 academic promotion controller. Configurable pass mark thresholds and audit confirmation.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
                      <span>Launch Promotion Desk &rarr;</span>
                    </div>
                  </div>

                  {/* Fees & Cashier Desk */}
                  <div
                    onClick={() => setActiveTab('fees')}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3 group-hover:bg-[#14294b] group-hover:text-[#d9b84a] transition-colors">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Cashier Desk & G.E.S. Receipts</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Issue serialized security receipts with barcode, student House allocation, cashier stamp, and duplicate archive copies.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-blue-900 group-hover:translate-x-1 transition-transform">
                      <span>Open Cashier Desk &rarr;</span>
                    </div>
                  </div>

                  {/* SMS Broadcaster */}
                  <div
                    onClick={() => setActiveTab('broadcast')}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-900 flex items-center justify-center mb-3 group-hover:bg-purple-900 group-hover:text-white transition-colors">
                        <Radio className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">SMS & Notice Broadcaster</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Dispatch official circulars to 1,330+ guardians via SMS Gateway or student portal with preset templates.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-purple-900 group-hover:translate-x-1 transition-transform">
                      <span>Dispatch Broadcast &rarr;</span>
                    </div>
                  </div>

                  {/* Audit Trail & Backup */}
                  <div
                    onClick={() => setActiveTab('audit')}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Audit Trail & Data Backup</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Compliance logs of all admin operations and one-click full JSON system backup & restore.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-slate-800 group-hover:translate-x-1 transition-transform">
                      <span>View Audit Log &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Student Information Management (SIS)</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Total Enrolled: {students.length} students &bull; Generate PVC ID Cards, Testimonials & Conduct Dossiers
                  </p>
                </div>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="custom-btn px-4 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register New Student</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Search Student</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or student ID..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Filter by Class Level</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="All">All Classes (Form 1, 2, 3)</option>
                    <option value="Form 1">Form 1 (Freshmen)</option>
                    <option value="Form 2">Form 2 (Continuing)</option>
                    <option value="Form 3">Form 3 (Finalists)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Filter by Programme</label>
                  <select
                    value={selectedProgramme}
                    onChange={(e) => setSelectedProgramme(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="All">All Programmes</option>
                    <option value="General Agriculture">General Agriculture</option>
                    <option value="Technical (Building & Construction)">Technical</option>
                    <option value="General Science">General Science</option>
                    <option value="Home Economics">Home Economics</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              {/* Students Data Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs">
                        <th className="py-3 px-4 font-semibold">Student ID</th>
                        <th className="py-3 px-4 font-semibold">Full Name & House</th>
                        <th className="py-3 px-4 font-semibold">Class Level</th>
                        <th className="py-3 px-4 font-semibold">Programme</th>
                        <th className="py-3 px-4 font-semibold">Gender</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 text-right font-semibold">Identity & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
                            No students found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.slice(0, 50).map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-blue-900">{s.student_id}</td>
                            <td className="py-3 px-4 font-semibold text-gray-900">
                              <div>{s.full_name}</div>
                              <span className="text-[11px] text-gray-400 font-normal">
                                {s.house || 'Nkrumah House (House 1)'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{s.class}</td>
                            <td className="py-3 px-4 text-gray-700">{s.programme}</td>
                            <td className="py-3 px-4 text-gray-700">{s.gender}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  s.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              {/* ID Card Badge Button */}
                              <button
                                onClick={() => setSelectedStudentForBadge(s)}
                                className="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
                                title="Print PVC Student ID Card"
                              >
                                🪪 ID Badge
                              </button>

                              {/* Testimonial Button */}
                              <button
                                onClick={() => setSelectedStudentForTestimonial(s)}
                                className="px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                                title="Generate Certified Testimonial"
                              >
                                📜 Testimonial
                              </button>

                              {/* Status Toggle */}
                              <button
                                onClick={() => onToggleStudentStatus(s.student_id)}
                                title={s.status === 'Active' ? 'Deactivate student' : 'Activate student'}
                                className={`px-2 py-1 rounded text-xs font-medium border ${
                                  s.status === 'Active'
                                    ? 'text-amber-700 border-amber-300 hover:bg-amber-50'
                                    : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                                }`}
                              >
                                {s.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setStudentToDelete(s)}
                                className="px-2 py-1 rounded text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50"
                                title="Delete student"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length > 50 && (
                  <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-200">
                    Showing first 50 of {filteredStudents.length} matching students. Use filters or search to narrow down.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CONTINUOUS ASSESSMENT */}
          {activeTab === 'assessments' && (
            <Form3AssessmentManager isAdmin={true} />
          )}

          {/* TAB: BATCH PROMOTION */}
          {activeTab === 'promotions' && (
            <PromotionManager
              students={students}
              sheets={sheets}
              onUpdateStudents={onUpdateStudents}
            />
          )}

          {/* TAB: FACULTY & STAFF */}
          {activeTab === 'staff' && (
            <StaffManager staff={staff} onUpdateStaff={onUpdateStaff} />
          )}

          {/* TAB: FEES & CASHIER DESK */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Bursary & Cashier Ledger</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage institutional billing, PTA dues, issue official printable G.E.S security receipts
                  </p>
                </div>
                <button
                  onClick={() => setShowFeeRecordModal(true)}
                  className="custom-btn px-4 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Record Fee & Issue Receipt</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Total Revenue Collected</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    GHS {totalFeesCollected.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Processed transactions</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Outstanding / Pending</div>
                  <div className="text-2xl font-bold text-red-600 mt-1">
                    GHS {totalPendingFees.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Awaiting settlement</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Total Transaction Records</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{fees.length}</div>
                  <div className="text-[11px] text-blue-600 font-medium mt-1">First Term 2026/27</div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search by student ID or receipt number..."
                    value={feeSearch}
                    onChange={(e) => setFeeSearch(e.target.value)}
                    className="w-full sm:w-80 text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs">
                        <th className="py-3 px-4 font-semibold">Receipt No</th>
                        <th className="py-3 px-4 font-semibold">Student ID</th>
                        <th className="py-3 px-4 font-semibold">Description</th>
                        <th className="py-3 px-4 font-semibold">Term</th>
                        <th className="py-3 px-4 text-right font-semibold">Amount</th>
                        <th className="py-3 px-4 text-center font-semibold">Status</th>
                        <th className="py-3 px-4 text-right font-semibold">Security Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {fees
                        .filter(
                          (f) =>
                            f.student_id.toLowerCase().includes(feeSearch.toLowerCase()) ||
                            (f.receipt_no && f.receipt_no.toLowerCase().includes(feeSearch.toLowerCase()))
                        )
                        .map((fee) => (
                          <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-blue-900">
                              {fee.receipt_no || `INV-00${fee.id}`}
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-gray-700">{fee.student_id}</td>
                            <td className="py-3 px-4 text-gray-900">
                              <div>{fee.description}</div>
                              {fee.payment_method && (
                                <span className="text-[11px] text-gray-500">Method: {fee.payment_method}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{fee.term}</td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900 font-mono">
                              GHS {fee.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  fee.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {fee.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedFeeForReceipt(fee)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded border border-amber-300 transition-colors"
                              >
                                🖨 View G.E.S Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SMS & NOTICE BROADCASTER */}
          {activeTab === 'broadcast' && <BroadcastCenter />}

          {/* TAB: SUBJECT COMBINATIONS */}
          {activeTab === 'combinations' && (
            <SubjectCombinationsView
              combinations={combinations}
              isAdmin={true}
              students={students}
            />
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
                <h3 className="text-xl font-bold text-gray-900">Institutional Performance & Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Summary statistics for First Term 2026/2027 Academic Year
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Enrollment by Programme */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-4">Enrollment Distribution by Programme</h4>
                  <div className="space-y-3 text-xs">
                    {[
                      { name: 'General Agriculture', count: students.filter((s) => s.programme.includes('Agric')).length, color: 'bg-emerald-600' },
                      { name: 'Technical (Building & Const.)', count: students.filter((s) => s.programme.includes('Technical')).length, color: 'bg-blue-600' },
                      { name: 'General Science', count: students.filter((s) => s.programme.includes('Science')).length, color: 'bg-purple-600' },
                      { name: 'Home Economics', count: students.filter((s) => s.programme.includes('Home')).length, color: 'bg-pink-600' },
                      { name: 'Business', count: students.filter((s) => s.programme.includes('Business')).length, color: 'bg-amber-600' },
                    ].map((item) => {
                      const pct = Math.round((item.count / Math.max(1, students.length)) * 100);
                      return (
                        <div key={item.name}>
                          <div className="flex justify-between font-semibold text-gray-700 mb-1">
                            <span>{item.name}</span>
                            <span>{item.count} students ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Class Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-4">Class Year Level Representation</h4>
                  <div className="space-y-3 text-xs">
                    {[
                      { name: 'Form 1 (Freshmen)', count: students.filter((s) => s.class === 'Form 1').length, color: 'bg-teal-600' },
                      { name: 'Form 2 (Continuing)', count: students.filter((s) => s.class === 'Form 2').length, color: 'bg-blue-600' },
                      { name: 'Form 3 (Graduating Finalists)', count: students.filter((s) => s.class === 'Form 3').length, color: 'bg-amber-600' },
                    ].map((c) => {
                      const pct = Math.round((c.count / Math.max(1, students.length)) * 100);
                      return (
                        <div key={c.name}>
                          <div className="flex justify-between font-semibold text-gray-700 mb-1">
                            <span>{c.name}</span>
                            <span>{c.count} students ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className={`${c.color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-500">Male Students</div>
                      <div className="text-lg font-bold text-blue-900">
                        {students.filter((s) => s.gender === 'Male').length}
                      </div>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <div className="text-xs text-gray-500">Female Students</div>
                      <div className="text-lg font-bold text-pink-900">
                        {students.filter((s) => s.gender === 'Female').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOG & BACKUP */}
          {activeTab === 'audit' && (
            <AuditLogViewer
              students={students}
              fees={fees}
              sheets={sheets}
              staff={staff}
              onRestoreData={onRestoreData}
            />
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
              {/* School Portal Configuration Card */}
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">School Portal Configuration</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage institutional parameters, academic calendar, and legal school identities.
                  </p>
                </div>

                {settingsSavedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>School settings and academic configuration saved successfully!</span>
                  </div>
                )}

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
                    <input type="text" defaultValue="2026 / 2027" className="custom-input font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Term</label>
                    <select defaultValue="First Term" className="custom-input font-bold bg-white">
                      <option>First Term</option>
                      <option>Second Term</option>
                      <option>Third Term</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">School Full Legal Name</label>
                    <input
                      type="text"
                      defaultValue="NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL"
                      className="custom-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Motto</label>
                    <input
                      type="text"
                      defaultValue="Knowledge • Discipline • Service"
                      className="custom-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Address</label>
                    <input
                      type="text"
                      defaultValue="P.O. Box 15, Nkroful, Ellemabelle District, Western Region, Ghana"
                      className="custom-input"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        addAuditLog({
                          user: 'Administrator',
                          action: 'School Configuration Updated',
                          category: 'System',
                          details: 'Updated school portal settings and academic session parameters.',
                          status: 'Success',
                        });
                        setSettingsSavedSuccess(true);
                        setTimeout(() => setSettingsSavedSuccess(false), 4000);
                      }}
                      className="custom-btn px-6 py-2.5 text-xs font-semibold"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* Administrator Security & Password Card */}
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-900" />
                      <span>Admin Account Security</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage administrator access key and SHA-256 cryptographic hash.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SHA-256 Active
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs space-y-1.5 text-gray-600">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Cryptographic Protection</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Passwords are never stored in plaintext. Passwords are transformed into one-way cryptographic SHA-256 digests via the Web Crypto API.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current admin password"
                      className="custom-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="custom-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="custom-input"
                      required
                    />
                  </div>

                  {pwdStatus.message && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium border flex items-start gap-2 ${
                        pwdStatus.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {pwdStatus.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>{pwdStatus.message}</div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPwd}
                      className="custom-btn px-6 py-2.5 text-xs font-semibold shadow disabled:opacity-60 flex items-center gap-2"
                    >
                      {isChangingPwd ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                          <span>Hashing & Saving...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Update & Hash Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Register New Student Modal */}
      <NewStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={onAddStudent}
        existingCount={students.length}
      />

      {/* Student PVC ID Card Badge Modal */}
      <StudentIdCardModal
        isOpen={Boolean(selectedStudentForBadge)}
        onClose={() => setSelectedStudentForBadge(null)}
        student={selectedStudentForBadge}
      />

      {/* Certified Testimonial Modal */}
      <TestimonialModal
        isOpen={Boolean(selectedStudentForTestimonial)}
        onClose={() => setSelectedStudentForTestimonial(null)}
        student={selectedStudentForTestimonial}
      />

      {/* Official G.E.S. Security Receipt Modal */}
      <OfficialReceiptModal
        isOpen={Boolean(selectedFeeForReceipt)}
        onClose={() => setSelectedFeeForReceipt(null)}
        fee={selectedFeeForReceipt}
        student={students.find((s) => s.student_id === selectedFeeForReceipt?.student_id)}
      />

      {/* Record Fee Payment Modal */}
      {showFeeRecordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="bg-[#14294b] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Student Fee Payment & Issue Receipt</h3>
              <button
                onClick={() => setShowFeeRecordModal(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateFee} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Student</label>
                <select
                  value={feeStudentId}
                  onChange={(e) => setFeeStudentId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                  required
                >
                  {students.map((st, sIdx) => (
                    <option key={`${st.student_id}-${st.id || sIdx}`} value={st.student_id}>
                      {st.full_name} ({st.student_id}) - {st.class} {st.programme}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (GHS)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={feeMethod}
                  onChange={(e) => setFeeMethod(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Cash Receipt">Cash Receipt (Bursary)</option>
                  <option value="Mobile Money">Mobile Money (MTN / Telecel)</option>
                  <option value="Bank Deposit">Bank Deposit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fee Description</label>
                <input
                  type="text"
                  value={feeDescription}
                  onChange={(e) => setFeeDescription(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeeRecordModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="custom-btn px-5 py-2 font-semibold"
                >
                  Save & Issue G.E.S Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <span>Confirm Student Record Deletion</span>
              </h3>
              <button
                onClick={() => setStudentToDelete(null)}
                className="text-white hover:text-red-200 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-gray-700">
              <p>
                Are you sure you want to permanently remove student{' '}
                <strong className="text-gray-900">{studentToDelete.full_name}</strong> (ID:{' '}
                <span className="font-mono font-semibold">{studentToDelete.student_id}</span>)?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-[11px] leading-relaxed">
                This action is logged to the system audit trail. All associated enrollment records, class affiliations, and continuous assessment references will be deactivated.
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStudentToDelete(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteStudent(studentToDelete.student_id);
                    setStudentToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm & Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
