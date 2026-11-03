import React, { useState, useEffect } from 'react';
import { AssessmentSheet, AssessmentRecord } from '../types';
import {
  FORM_2_CLASSES,
  FORM_3_CLASSES,
  CLASS_SUBJECTS_MAP,
  CLASS_FORM_TEACHERS,
  calculateGrade,
  getAllAssessmentSheets,
  saveAllAssessmentSheets,
} from '../assessmentService';
import { MANDATORY_CURRICULUM_RULE } from '../mockData';

interface Form3AssessmentManagerProps {
  isAdmin?: boolean;
}

export const Form3AssessmentManager: React.FC<Form3AssessmentManagerProps> = ({
  isAdmin = true,
}) => {
  const [sheets, setSheets] = useState<AssessmentSheet[]>(() =>
    getAllAssessmentSheets()
  );
  const [formLevel, setFormLevel] = useState<'Form 2' | 'Form 3'>('Form 2');
  const [selectedClass, setSelectedClass] = useState<string>('2 APPLIED TECH 1');
  const [selectedSubject, setSelectedSubject] = useState<string>('Design and Communication Technology');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Available classes based on form level
  const currentClasses = formLevel === 'Form 2' ? FORM_2_CLASSES : FORM_3_CLASSES;

  // When formLevel changes, ensure selectedClass belongs to currentClasses
  const handleFormLevelChange = (level: 'Form 2' | 'Form 3') => {
    setFormLevel(level);
    const firstClass = level === 'Form 2' ? FORM_2_CLASSES[0] : FORM_3_CLASSES[0];
    setSelectedClass(firstClass);
    const availableSubjects = CLASS_SUBJECTS_MAP[firstClass] || ['General Core Mathematics'];
    setSelectedSubject(availableSubjects[0]);
  };

  // Sync available subjects when selected class changes
  useEffect(() => {
    const available = CLASS_SUBJECTS_MAP[selectedClass] || ['General Core Mathematics'];
    if (!available.includes(selectedSubject)) {
      setSelectedSubject(available[0]);
    }
  }, [selectedClass]);

  // Save sheets whenever updated
  useEffect(() => {
    saveAllAssessmentSheets(sheets);
  }, [sheets]);

  // Find or create current active sheet
  let currentSheet = sheets.find(
    (s) => s.class_name === selectedClass && s.subject === selectedSubject
  );

  // If not created yet, initialize clean sheet for the class & subject
  if (!currentSheet) {
    const baseClassSheet = sheets.find((s) => s.class_name === selectedClass);
    if (baseClassSheet) {
      currentSheet = {
        id: `${formLevel === 'Form 2' ? 'F2' : 'F3'}-${selectedClass.replace(/\s+/g, '_')}-${selectedSubject.replace(/\s+/g, '_')}`,
        form_level: formLevel,
        class_name: selectedClass,
        subject: selectedSubject,
        semester: 'FIRST SEMESTER',
        academic_year: '2026/2027',
        month_year: 'NOV, 2026',
        form_teacher: CLASS_FORM_TEACHERS[selectedClass] || 'Senior Form Master',
        subject_teacher: CLASS_FORM_TEACHERS[selectedClass] || 'Senior Form Master',
        records: baseClassSheet.records.map((r) => ({
          ns: r.ns,
          student_name: r.student_name,
          student_id: r.student_id,
          individual_class_assessment: 0,
          mid_sem_exams: 0,
          portfolio_practical: 0,
          group_project: 0,
          supervised_ind_exams: 0,
          total: 0,
          grade: '-',
          remark: 'Pending Evaluation',
          position: r.ns,
        })),
        is_published: false,
      };
    } else {
      currentSheet = sheets[0];
    }
  }

  // Clear all marks on active sheet
  const handleClearCurrentSheetMarks = () => {
    if (!currentSheet) return;
    if (!window.confirm(`Reset and clear all marks for ${currentSheet.class_name} - ${currentSheet.subject}? All student scores will return to 0.`)) {
      return;
    }
    const updatedRecords = currentSheet.records.map((r) => ({
      ...r,
      individual_class_assessment: 0,
      mid_sem_exams: 0,
      portfolio_practical: 0,
      group_project: 0,
      supervised_ind_exams: 0,
      total: 0,
      grade: '-',
      remark: 'Pending Evaluation',
    }));
    const updatedSheet: AssessmentSheet = {
      ...currentSheet,
      records: updatedRecords,
    };
    setSheets((prev) =>
      prev.map((s) => (s.id === updatedSheet.id ? updatedSheet : s))
    );
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  // Update an individual component score for a student
  const handleScoreChange = (
    ns: number,
    field:
      | 'individual_class_assessment'
      | 'mid_sem_exams'
      | 'portfolio_practical'
      | 'group_project'
      | 'supervised_ind_exams',
    value: string
  ) => {
    if (!currentSheet) return;

    let num = parseFloat(value);
    if (isNaN(num)) num = 0;

    // Constrain to maximum bounds
    const maxBounds: Record<string, number> = {
      individual_class_assessment: 15,
      mid_sem_exams: 15,
      portfolio_practical: 10,
      group_project: 20,
      supervised_ind_exams: 40,
    };
    num = Math.max(0, Math.min(maxBounds[field], num));

    const updatedRecords = currentSheet.records.map((rec) => {
      if (rec.ns === ns) {
        const updated = { ...rec, [field]: num };
        const total =
          updated.individual_class_assessment +
          updated.mid_sem_exams +
          updated.portfolio_practical +
          updated.group_project +
          updated.supervised_ind_exams;
        const { grade, remark } = calculateGrade(total);
        return {
          ...updated,
          total,
          grade,
          remark,
        };
      }
      return rec;
    });

    // Re-rank positions by total
    const ranked = [...updatedRecords].sort((a, b) => b.total - a.total);
    ranked.forEach((r, idx) => {
      r.position = idx + 1;
    });

    const updatedSheet: AssessmentSheet = {
      ...currentSheet,
      records: updatedRecords,
    };

    setSheets((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.class_name === selectedClass && s.subject === selectedSubject
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedSheet;
        return copy;
      }
      return [...prev, updatedSheet];
    });

    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  // Filter records by search
  const records = currentSheet ? currentSheet.records : [];
  const filteredRecords = records.filter(
    (r) =>
      r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.ns).includes(searchTerm)
  );

  // Statistics calculation
  const totalStudents = records.length;
  const averageScore = totalStudents > 0
    ? (records.reduce((acc, r) => acc + r.total, 0) / totalStudents).toFixed(1)
    : '0';
  const highestRecord = records.reduce(
    (max, r) => (r.total > max.total ? r : max),
    records[0] || { total: 0, student_name: '-' }
  );
  const lowestRecord = records.reduce(
    (min, r) => (r.total < min.total ? r : min),
    records[0] || { total: 0 }
  );
  const passCount = records.filter((r) => r.total >= 50).length;
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  // Grade breakdown
  const gradeCounts: Record<string, number> = {};
  records.forEach((r) => {
    gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (!currentSheet) return;
    const header = [
      'N/S',
      'Name of Student',
      'Student ID',
      'Individual Class (15)',
      'Mid-Sem Exams (15)',
      'Portfolio/Practical (10)',
      'Group Project (20)',
      'Supervised Exams (40)',
      'Total Score (100)',
      'Grade',
      'Remark',
      'Position'
    ];
    const rows = currentSheet.records.map((r) => [
      r.ns,
      `"${r.student_name}"`,
      r.student_id,
      r.individual_class_assessment,
      r.mid_sem_exams,
      r.portfolio_practical,
      r.group_project,
      r.supervised_ind_exams,
      r.total,
      r.grade,
      `"${r.remark}"`,
      r.position || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `"NKROFUL AGRIC. SENIOR HIGH SCHOOL - ASSESSMENT SHEET FROM STP"`,
        `"FORM: ${currentSheet.form_level}","CLASS: ${currentSheet.class_name}","SUBJECT: ${currentSheet.subject}"`,
        `"SEMESTER: ${currentSheet.semester}","DATE: ${currentSheet.month_year}"`,
        header.join(','),
        ...rows.map((e) => e.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${currentSheet.form_level}_${currentSheet.class_name}_${currentSheet.subject}_Assessment_Sheet.csv`.replace(/\s+/g, '_')
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-[#102a56] text-white font-bold px-2.5 py-0.5 rounded">
              CONTINUOUS ASSESSMENT &amp; EXAM SHEETS (STP)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded">
              35 Classes &bull; 1,330 Candidates
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Assessment Sheet Manager (Form 2 &amp; Form 3)
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Standardized School Terminal Progress (STP) continuous assessment mark sheets for all departments.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleClearCurrentSheetMarks}
            title="Reset all student marks in this sheet back to zero"
            className="px-3 py-2 text-xs font-semibold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <i className="fa-solid fa-rotate-left text-rose-600"></i>
            <span>Clear Sheet Marks</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <i className="fa-solid fa-file-csv text-emerald-600"></i>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="custom-btn px-4 py-2 text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print STP Mark Sheet</span>
          </button>
        </div>
      </div>

      {/* Form Level Selector (Form 2 vs Form 3) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
            Select Form Level:
          </span>
          <button
            type="button"
            onClick={() => handleFormLevelChange('Form 2')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              formLevel === 'Form 2'
                ? 'bg-[#14294b] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-layer-group"></i>
            <span>Form 2 / SHS 2 (19 Classes &bull; 726 Students)</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormLevelChange('Form 3')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              formLevel === 'Form 3'
                ? 'bg-[#14294b] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fa-solid fa-graduation-cap"></i>
            <span>Form 3 / SHS 3 (16 Classes &bull; 604 Students)</span>
          </button>
        </div>

        {formLevel === 'Form 2' && (
          <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-robot text-amber-600"></i>
            <span>{MANDATORY_CURRICULUM_RULE}</span>
          </div>
        )}
      </div>

      {/* Class & Subject Selector Controls */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-users-rectangle text-blue-800"></i>
              <span>Select Class ({currentClasses.length} Classes in {formLevel})</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#14294b] bg-slate-50"
            >
              {currentClasses.map((cls) => (
                <option key={cls} value={cls}>
                  CLASS: {cls} ({CLASS_FORM_TEACHERS[cls] || 'Staff'})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-book text-amber-700"></i>
              <span>Select Subject</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#14294b] bg-slate-50"
            >
              {(CLASS_SUBJECTS_MAP[selectedClass] || ['General Core Mathematics']).map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Search Student in current class */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
              <span>Filter Candidate</span>
            </label>
            <input
              type="text"
              placeholder="Search student by name or N/S..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#14294b]"
            />
          </div>
        </div>

        {/* Quick Class Pills */}
        <div>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Quick Class Jumper ({formLevel}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  selectedClass === cls
                    ? 'bg-[#14294b] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Class Enrollment</span>
          <div className="text-xl font-bold text-gray-900 mt-0.5">{totalStudents} Candidates</div>
          <span className="text-[10px] text-gray-400">Class: {selectedClass}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase">Class Average</span>
          <div className="text-xl font-bold text-blue-900 mt-0.5">{averageScore} / 100</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{passRate}% Pass Rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">Highest Score</span>
          <div className="text-sm font-bold text-emerald-900 truncate mt-0.5">
            {highestRecord.student_name}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">{highestRecord.total} Marks (Grade {highestRecord.grade})</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">Grade Distribution</span>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
            <span className="text-emerald-700">A1: {gradeCounts['A1'] || 0}</span>
            <span className="text-blue-700">B2-B3: {(gradeCounts['B2'] || 0) + (gradeCounts['B3'] || 0)}</span>
            <span className="text-amber-700">C4-C6: {(gradeCounts['C4'] || 0) + (gradeCounts['C5'] || 0) + (gradeCounts['C6'] || 0)}</span>
          </div>
          <span className="text-[10px] text-gray-400">GES Continuous Assessment</span>
        </div>
      </div>

      {/* Auto-Save Toast */}
      {isSavedAlert && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <i className="fa-solid fa-check"></i>
          <span>Assessment scores updated &amp; recalculated!</span>
        </div>
      )}

      {/* Official Assessment Sheet Card (matches DOCX institutional format exactly) */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden" id="assessment-sheet-print">
        {/* Document Header matching DOCX */}
        <div className="p-6 sm:p-8 border-b-2 border-[#14294b] bg-slate-50 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/logo.jpg" alt="Logo" className="w-14 h-14 rounded-full border-2 border-[#14294b]" />
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#14294b] tracking-tight uppercase">
                Nkroful Agric. Senior High School
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 tracking-wider uppercase">
                Assessment Sheet From STP &bull; First Semester 2026/2027
              </h3>
              <p className="text-xs text-gray-600 font-semibold">NOV, 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-800 mt-4 pt-3 border-t border-gray-300 text-left bg-white p-3 rounded-lg border">
            <div>
              <span className="text-gray-500 font-normal">FORM TEACHER:</span>{' '}
              <span className="font-bold underline decoration-dotted">{CLASS_FORM_TEACHERS[selectedClass] || '………………………'}</span>
            </div>
            <div>
              <span className="text-gray-500 font-normal">CLASS:</span>{' '}
              <span className="text-blue-900 font-black">{selectedClass}</span>
            </div>
            <div>
              <span className="text-gray-500 font-normal">SUBJECT:</span>{' '}
              <span className="text-amber-900 font-black">{selectedSubject}</span>
            </div>
          </div>
        </div>

        {/* Assessment Mark Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14294b] text-white text-[11px] border-b border-blue-900">
                <th className="py-2.5 px-3 font-bold border-r border-blue-900 text-center w-12">N/S</th>
                <th className="py-2.5 px-3 font-bold border-r border-blue-900 min-w-[200px]">NAME OF STUDENTS</th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-28">
                  INDIVIDUAL CLASS<br />ASSESSMENT (15)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-24">
                  MID-SEM<br />EXAMS (15)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-24">
                  PORTFOLIO /<br />PRACTICAL (10)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-24">
                  GROUP<br />PROJECT (20)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-28">
                  SUPERVISED IND.<br />EXAMS (40)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-20 bg-[#0d1e38]">
                  TOTAL<br />(100)
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-blue-900 text-center w-16 bg-[#0d1e38]">
                  GRADE
                </th>
                <th className="py-2.5 px-2 font-bold text-center w-16 bg-[#0d1e38]">
                  POS.
                </th>
                <th className="py-2.5 px-3 font-bold">REMARK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {filteredRecords.map((rec, idx) => {
                return (
                  <tr
                    key={`${rec.student_id || rec.ns}-${idx}`}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-blue-50/50 transition-colors`}
                  >
                    {/* N/S */}
                    <td className="py-2 px-3 text-center font-bold text-gray-700 border-r border-gray-200">
                      {rec.ns}
                    </td>

                    {/* Student Name */}
                    <td className="py-2 px-3 font-bold text-gray-900 border-r border-gray-200 uppercase tracking-tight">
                      <div>{rec.student_name}</div>
                      <span className="text-[10px] text-gray-400 font-mono font-normal">
                        {rec.student_id}
                      </span>
                    </td>

                    {/* Component 1: Individual Class Assessment (15) */}
                    <td className="py-1 px-1 text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={rec.individual_class_assessment}
                        onChange={(e) =>
                          handleScoreChange(rec.ns, 'individual_class_assessment', e.target.value)
                        }
                        className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-600 bg-white"
                      />
                    </td>

                    {/* Component 2: Mid-Sem Exams (15) */}
                    <td className="py-1 px-1 text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={rec.mid_sem_exams}
                        onChange={(e) =>
                          handleScoreChange(rec.ns, 'mid_sem_exams', e.target.value)
                        }
                        className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-600 bg-white"
                      />
                    </td>

                    {/* Component 3: Portfolio / Practical (10) */}
                    <td className="py-1 px-1 text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={rec.portfolio_practical}
                        onChange={(e) =>
                          handleScoreChange(rec.ns, 'portfolio_practical', e.target.value)
                        }
                        className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-600 bg-white"
                      />
                    </td>

                    {/* Component 4: Group Project (20) */}
                    <td className="py-1 px-1 text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={rec.group_project}
                        onChange={(e) =>
                          handleScoreChange(rec.ns, 'group_project', e.target.value)
                        }
                        className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-600 bg-white"
                      />
                    </td>

                    {/* Component 5: Supervised Ind. Exams (40) */}
                    <td className="py-1 px-1 text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={rec.supervised_ind_exams}
                        onChange={(e) =>
                          handleScoreChange(rec.ns, 'supervised_ind_exams', e.target.value)
                        }
                        className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded p-1 text-xs focus:ring-1 focus:ring-blue-600 bg-white"
                      />
                    </td>

                    {/* Total (100) */}
                    <td className="py-2 px-2 text-center font-black text-gray-900 border-r border-gray-200 bg-slate-100">
                      {rec.total}
                    </td>

                    {/* Grade */}
                    <td className="py-2 px-2 text-center border-r border-gray-200 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          rec.grade === 'A1'
                            ? 'bg-emerald-100 text-emerald-800 font-black'
                            : ['B2', 'B3'].includes(rec.grade)
                            ? 'bg-blue-100 text-blue-800'
                            : ['C4', 'C5', 'C6'].includes(rec.grade)
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rec.grade}
                      </span>
                    </td>

                    {/* Position */}
                    <td className="py-2 px-2 text-center font-mono font-bold text-gray-600 border-r border-gray-200">
                      {rec.position ? `${rec.position}` : '-'}
                    </td>

                    {/* Remark */}
                    <td className="py-2 px-3 text-gray-700 italic text-[11px]">
                      {rec.remark}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Signature Block (Printed version) */}
        <div className="p-6 bg-slate-50 border-t border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-700">
          <div>
            <span className="block font-semibold mb-1">Subject Teacher's Signature:</span>
            <div className="h-10 border-b border-gray-400"></div>
            <span className="text-[10px] text-gray-500 mt-1 block">Date: .......................................</span>
          </div>
          <div>
            <span className="block font-semibold mb-1">Form Master / Mistress Endorsement:</span>
            <div className="h-10 border-b border-gray-400"></div>
            <span className="text-[10px] text-gray-500 mt-1 block">{CLASS_FORM_TEACHERS[selectedClass]}</span>
          </div>
          <div>
            <span className="block font-semibold mb-1">Headmaster / Academic Dean Approval:</span>
            <div className="h-10 border-b border-gray-400"></div>
            <span className="text-[10px] text-gray-500 mt-1 block">NKAS Academic Affairs Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
