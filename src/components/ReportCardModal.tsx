import React from 'react';
import { ExamResult, Student } from '../types';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult;
  student: Student;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  result,
  student,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-200">
        {/* Modal Header Controls (hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              Terminal Examination Report Card
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
              Official Record
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#153c78] hover:bg-[#0d264d] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <i className="fa-solid fa-print"></i>
              <span>Print Report Card</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Official Report Card Document */}
        <div className="p-6 sm:p-10 font-sans text-gray-900 bg-white" id="report-card-print">
          {/* Institutional Header */}
          <div className="text-center pb-6 border-b-2 border-[#14294b]">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img
                src="/logo.jpg"
                alt="NKAS Logo"
                className="w-20 h-20 rounded-full border-2 border-[#14294b] object-cover shadow-xs"
              />
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14294b] uppercase">
                  Nkroful Agricultural Secondary Technical School
                </h1>
                <p className="text-xs text-gray-600 font-semibold tracking-wide">
                  P.O. BOX 15, NKROFUL, ELLEMABELLE DISTRICT, WESTERN REGION, GHANA
                </p>
                <p className="text-xs font-bold text-amber-700 tracking-wider">
                  MOTTO: KNOWLEDGE &bull; DISCIPLINE &bull; SERVICE
                </p>
              </div>
            </div>
            <div className="mt-4 bg-[#14294b] text-white py-1.5 px-4 rounded inline-block text-xs sm:text-sm font-bold tracking-wider uppercase">
              Student's Terminal Academic Report - {result.term.toUpperCase()} ({result.academic_year})
            </div>
          </div>

          {/* Student Biodata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs border-b border-gray-200 bg-slate-50 p-4 rounded-lg my-4">
            <div>
              <span className="text-gray-500 block font-medium">Student Name:</span>
              <span className="font-bold text-gray-900 text-sm">{student.full_name}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Index / Student ID:</span>
              <span className="font-bold text-blue-900 font-mono text-sm">{student.student_id}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Class & Programme:</span>
              <span className="font-bold text-gray-900">{student.class} {student.programme}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Residential House:</span>
              <span className="font-bold text-gray-900">{student.house || 'Nkrumah House'}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Term Aggregate:</span>
              <span className="font-bold text-emerald-700 text-sm">{result.aggregate} (Best 6)</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Position in Class:</span>
              <span className="font-bold text-indigo-700">{result.position}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Attendance:</span>
              <span className="font-bold text-gray-900">{result.attendance}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Date Issued:</span>
              <span className="font-bold text-gray-900">{result.date_issued}</span>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="overflow-x-auto my-4 border border-gray-300 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#14294b] text-white">
                  <th className="py-2.5 px-3 font-semibold border-r border-blue-900">Code</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-blue-900">Subject Title</th>
                  <th className="py-2.5 px-3 text-center font-semibold border-r border-blue-900">Class (30%)</th>
                  <th className="py-2.5 px-3 text-center font-semibold border-r border-blue-900">Exam (70%)</th>
                  <th className="py-2.5 px-3 text-center font-semibold border-r border-blue-900">Total (100%)</th>
                  <th className="py-2.5 px-3 text-center font-semibold border-r border-blue-900">Grade</th>
                  <th className="py-2.5 px-3 font-semibold">Teacher's Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.subjects.map((sub, idx) => {
                  const isDistinction = sub.grade === 'A1';
                  const isCredit = ['B2', 'B3', 'C4', 'C5', 'C6'].includes(sub.grade);
                  return (
                    <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-2 px-3 font-mono text-gray-500 border-r border-gray-200">{sub.code}</td>
                      <td className="py-2 px-3 font-medium text-gray-900 border-r border-gray-200">{sub.name}</td>
                      <td className="py-2 px-3 text-center border-r border-gray-200">{sub.class_score}</td>
                      <td className="py-2 px-3 text-center border-r border-gray-200">{sub.exam_score}</td>
                      <td className="py-2 px-3 text-center font-bold border-r border-gray-200">{sub.total}</td>
                      <td className="py-2 px-3 text-center font-bold border-r border-gray-200">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            isDistinction
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCredit
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-700 italic">{sub.remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Grading Key */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 text-[10px] text-gray-600 mb-6 flex flex-wrap justify-between gap-1">
            <span><strong>WAEC / GES Grading Scale:</strong></span>
            <span>A1 (80-100) Excellent</span>
            <span>B2 (75-79) Very Good</span>
            <span>B3 (70-74) Good</span>
            <span>C4 (65-69) Credit</span>
            <span>C5 (60-64) Credit</span>
            <span>C6 (55-59) Credit</span>
            <span>D7 (50-54) Pass</span>
            <span>E8 (45-49) Pass</span>
            <span>F9 (0-44) Fail</span>
          </div>

          {/* Remarks & Character Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-gray-800 block mb-0.5">Conduct:</span>
                <p className="text-gray-700 italic">{result.conduct}</p>
              </div>
              <div>
                <span className="font-bold text-gray-800 block mb-0.5">Attitude Towards Work:</span>
                <p className="text-gray-700 italic">{result.attitude}</p>
              </div>
              <div>
                <span className="font-bold text-gray-800 block mb-0.5">Class Teacher's Remarks:</span>
                <p className="text-gray-700 italic">"{result.class_teacher_remarks}"</p>
              </div>
            </div>

            <div className="space-y-3 bg-blue-50/50 p-4 rounded-lg border border-blue-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-blue-950 block mb-0.5">Headmaster's Endorsement & Remarks:</span>
                <p className="text-blue-900 italic font-medium">"{result.headmaster_remarks}"</p>
                <div className="mt-3 text-[11px] text-gray-600">
                  <span>Next Academic Term Begins: </span>
                  <span className="font-bold text-gray-900">{result.next_term_begins}</span>
                </div>
              </div>

              {/* Official Stamp & Signature Block */}
              <div className="pt-4 border-t border-blue-200 flex items-end justify-between">
                <div>
                  <div className="font-serif italic font-bold text-blue-900 text-sm">Dr. K. Nkansah</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Headmaster / Principal</div>
                </div>
                <div className="border border-blue-700 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest text-center opacity-85 rotate-[-3deg]">
                  NKAS OFFICIAL<br/>ACADEMIC SEAL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold bg-[#153c78] hover:bg-[#0d264d] text-white rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
