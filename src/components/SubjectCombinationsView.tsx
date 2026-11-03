import React, { useState } from 'react';
import { SubjectCombination, Student } from '../types';
import { MANDATORY_CURRICULUM_RULE } from '../mockData';

interface SubjectCombinationsViewProps {
  combinations: SubjectCombination[];
  currentStudent?: Student;
  isAdmin?: boolean;
  students?: Student[];
}

export const SubjectCombinationsView: React.FC<SubjectCombinationsViewProps> = ({
  combinations,
  currentStudent,
  isAdmin = false,
  students = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSlipModal, setShowSlipModal] = useState(false);

  const categories = [
    'All',
    'Applied Technology',
    'General Science',
    'Business',
    'Visual & Performing Arts',
    'Agriculture',
    'General Arts',
    'Home Economics',
  ];

  // Match student's assigned combination
  const studentComb = currentStudent
    ? combinations.find((c) => c.sn === currentStudent.combination_sn) ||
      combinations.find((c) =>
        c.course.toLowerCase().includes(currentStudent.programme.toLowerCase()) ||
        currentStudent.programme.toLowerCase().includes(c.course.toLowerCase())
      )
    : null;

  const filtered = combinations.filter((c) => {
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.core_subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.elective_subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStudentCount = (sn: number) => {
    return students.filter((s) => s.combination_sn === sn).length;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-[#102a56] text-white font-bold px-2.5 py-0.5 rounded">
              GES / NKAS APPROVED CURRICULUM
            </span>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded">
              20 Course Combinations
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Official Subject Combinations (SHS 1 - 3)
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete catalogue of Core and Elective subject packages for all academic departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentStudent && studentComb && (
            <button
              onClick={() => setShowSlipModal(true)}
              className="custom-btn px-4 py-2 text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <i className="fa-solid fa-file-contract"></i>
              <span>My Combination Slip</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="no-print px-3.5 py-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-print text-gray-500"></i>
            <span>Print Guide</span>
          </button>
        </div>
      </div>

      {/* Mandatory Curriculum Rule Alert Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 sm:p-5 rounded-xl shadow-sm flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
          <i className="fa-solid fa-robot"></i>
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
            {MANDATORY_CURRICULUM_RULE}
          </div>
          <p className="text-xs sm:text-sm text-amber-50 mt-1 leading-relaxed">
            As mandated by the Ministry of Education &amp; NKAS Academic Board, all Form 2 (SHS 2) students in all departments take mandatory <strong>Robotics, Artificial Intelligence, and Coding</strong> practicals in the STEM Laboratory.
          </p>
        </div>
      </div>

      {/* Student's Personally Enrolled Package Callout (if logged in as student) */}
      {currentStudent && studentComb && (
        <div className="bg-blue-50/80 border-2 border-[#153c78] rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                Your Assigned Curriculum Package
              </span>
              <h4 className="text-lg font-bold text-[#102a56]">
                Package #{studentComb.sn}: {studentComb.course}
              </h4>
            </div>
            <span className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded-full self-start sm:self-auto">
              {studentComb.category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
            <div>
              <span className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-book-bookmark text-blue-600"></i>
                Core Subjects ({studentComb.core_subjects.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {studentComb.core_subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-2 py-1 rounded bg-white text-blue-950 border border-blue-200 font-semibold text-[11px]"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-layer-group text-amber-600"></i>
                Elective Subjects ({studentComb.elective_subjects.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {studentComb.elective_subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-2 py-1 rounded bg-amber-50 text-amber-950 border border-amber-200 font-bold text-[11px]"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by course name or subject (e.g., Biology, Chemistry, Automobile, Nzema, French, Foods)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#14294b]"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-400 text-sm"></i>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#14294b] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Combinations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((comb) => {
          const isUserCombination = currentStudent && currentStudent.combination_sn === comb.sn;
          return (
            <div
              key={comb.sn}
              className={`bg-white rounded-xl p-5 border shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                isUserCombination ? 'border-2 border-blue-800 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#14294b] text-yellow-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      #{comb.sn}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-tight">
                        {comb.course}
                      </h4>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {comb.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isUserCombination && (
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Enrolled
                      </span>
                    )}
                    {isAdmin && (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {getStudentCount(comb.sn)} students
                      </span>
                    )}
                  </div>
                </div>

                {comb.notes && (
                  <p className="text-[11px] text-gray-500 italic mb-3">
                    Pathway: {comb.notes}
                  </p>
                )}

                {/* Core Subjects Box */}
                <div className="mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Core Subjects ({comb.core_subjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {comb.core_subjects.map((cs) => (
                      <span
                        key={cs}
                        className="text-[10px] bg-white text-gray-800 border border-gray-200 px-2 py-0.5 rounded font-medium"
                      >
                        {cs}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Elective Subjects Box */}
                <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Elective Subjects ({comb.elective_subjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {comb.elective_subjects.map((es) => (
                      <span
                        key={es}
                        className="text-[10px] bg-white text-amber-950 border border-amber-300 px-2 py-0.5 rounded font-bold"
                      >
                        {es}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                <span>SHS 1 - SHS 3 WASSCE Track</span>
                <span className="text-gray-400">Total: {comb.core_subjects.length + comb.elective_subjects.length} Subjects</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
          <i className="fa-solid fa-book-open text-3xl text-gray-300 mb-2"></i>
          <p className="font-semibold text-sm">No subject combinations found</p>
          <p className="text-xs text-gray-400">Try adjusting your search query or filter category.</p>
        </div>
      )}

      {/* Official Student Combination Slip Modal */}
      {showSlipModal && currentStudent && studentComb && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden">
            <div className="no-print bg-[#14294b] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-file-contract text-yellow-400"></i>
                <h3 className="font-bold text-sm">Official Subject Combination Slip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-white text-[#14294b] text-xs font-bold rounded"
                >
                  <i className="fa-solid fa-print mr-1"></i> Print Slip
                </button>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-8 text-gray-900 font-sans" id="subject-slip-print">
              <div className="text-center pb-4 border-b-2 border-[#14294b]">
                <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-[#14294b]" />
                <h2 className="text-lg font-bold text-[#14294b] uppercase">
                  Nkroful Agricultural Secondary Technical School
                </h2>
                <p className="text-[11px] text-gray-600 font-semibold">
                  ACADEMIC AFFAIRS &bull; SUBJECT COMBINATION REGISTRATION SLIP
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-gray-200 bg-slate-50 p-4 rounded-lg my-4">
                <div>
                  <span className="text-gray-500 block">Student Name:</span>
                  <span className="font-bold text-sm">{currentStudent.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Student Index Number:</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">{currentStudent.student_id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Class &amp; Level:</span>
                  <span className="font-bold">{currentStudent.class}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Approved Combination:</span>
                  <span className="font-bold text-amber-900">Package #{studentComb.sn} - {studentComb.course}</span>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
                    Core Subjects ({studentComb.core_subjects.length}):
                  </h4>
                  <ul className="grid grid-cols-2 gap-1.5 text-xs">
                    {studentComb.core_subjects.map((sub, i) => (
                      <li key={sub} className="bg-slate-100 p-2 rounded font-medium flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2">
                    Elective Subjects ({studentComb.elective_subjects.length}):
                  </h4>
                  <ul className="grid grid-cols-2 gap-1.5 text-xs">
                    {studentComb.elective_subjects.map((sub, i) => (
                      <li key={sub} className="bg-amber-50 border border-amber-200 p-2 rounded font-bold text-amber-950 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-100/60 border border-amber-300 rounded text-xs text-amber-950 font-semibold">
                  <i className="fa-solid fa-circle-exclamation mr-1.5"></i>
                  Note: {MANDATORY_CURRICULUM_RULE} in the STEM Computing &amp; Technology Lab.
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="border-t border-gray-400 pt-2">
                  <span className="font-semibold text-gray-800">Student Signature</span>
                </div>
                <div className="border-t border-gray-400 pt-2">
                  <span className="font-semibold text-gray-800">Academic Dean / Registrar Seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
