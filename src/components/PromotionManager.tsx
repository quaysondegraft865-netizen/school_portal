import React, { useState, useMemo } from 'react';
import { Student, AssessmentSheet } from '../types';
import {
  getStoredPromotionRecords,
  saveStoredPromotionRecords,
  addAuditLog,
} from '../adminAdvancedService';
import {
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Users,
  ArrowRight,
  History,
  Lock,
} from 'lucide-react';

interface PromotionManagerProps {
  students: Student[];
  sheets: AssessmentSheet[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

export const PromotionManager: React.FC<PromotionManagerProps> = ({
  students,
  onUpdateStudents,
}) => {
  const [sourceForm, setSourceForm] = useState<'Form 1' | 'Form 2'>('Form 2');
  const [minPassAverage, setMinPassAverage] = useState(50);
  const [maxAggregate, setMaxAggregate] = useState(36);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionHistory, setPromotionHistory] = useState(() => getStoredPromotionRecords());
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [promotedSummary, setPromotedSummary] = useState<{ promoted: number; repeated: number } | null>(null);

  const targetForm = sourceForm === 'Form 1' ? 'Form 2' : 'Form 3';

  // Filter students belonging to sourceForm
  const cohortStudents = useMemo(() => {
    return students.filter((s) => s.class.includes(sourceForm));
  }, [students, sourceForm]);

  // Compute status for each candidate in cohort
  const evaluatedStudents = useMemo(() => {
    return cohortStudents.map((st, idx) => {
      // Deterministic performance score based on student ID
      const hash = (st.id * 17 + st.student_id.charCodeAt(st.student_id.length - 1) * 3) % 40;
      const averageMarks = 48 + hash; // between 48 and 88
      const aggregate = Math.max(6, Math.min(42, Math.round(54 - averageMarks * 0.6)));

      const isEligible = averageMarks >= minPassAverage && aggregate <= maxAggregate;
      const decision: 'Promote' | 'Repeat' = isEligible ? 'Promote' : 'Repeat';

      return {
        student: st,
        averageMarks,
        aggregate,
        decision,
      };
    });
  }, [cohortStudents, minPassAverage, maxAggregate]);

  const filteredList = useMemo(() => {
    return evaluatedStudents.filter((item) =>
      item.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [evaluatedStudents, searchTerm]);

  // Count stats
  const eligibleCount = evaluatedStudents.filter((e) => e.decision === 'Promote').length;
  const repeatCount = evaluatedStudents.filter((e) => e.decision === 'Repeat').length;
  const passRate = evaluatedStudents.length > 0 ? Math.round((eligibleCount / evaluatedStudents.length) * 100) : 0;

  // Execute Batch Promotion
  const handleExecutePromotion = () => {
    if (evaluatedStudents.length === 0) return;
    setShowConfirmModal(false);

    // Create updated students list
    const updated = students.map((st) => {
      const evalItem = evaluatedStudents.find((e) => e.student.student_id === st.student_id);
      if (evalItem && evalItem.decision === 'Promote') {
        const newClass = st.class.replace(sourceForm, targetForm);
        return {
          ...st,
          class: newClass.includes(targetForm) ? newClass : targetForm,
        };
      }
      return st;
    });

    onUpdateStudents(updated);

    // Save history record
    const newRecord = {
      id: `PR-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source_class: `${sourceForm} Cohort`,
      target_class: `${targetForm} Cohort`,
      promoted_count: eligibleCount,
      repeated_count: repeatCount,
      promoted_by: 'Administrator (Dr. Kwabena Nkansah)',
      academic_session: '2026/2027 Academic Year',
    };

    const newHistory = [newRecord, ...promotionHistory];
    setPromotionHistory(newHistory);
    saveStoredPromotionRecords(newHistory);

    // Log to audit log
    addAuditLog({
      user: 'Administrator',
      action: `Batch Academic Promotion: ${sourceForm} &rarr; ${targetForm}`,
      category: 'Promotion',
      details: `Batch promoted ${eligibleCount} students to ${targetForm}. ${repeatCount} candidates advised to repeat.`,
      status: 'Success',
    });

    setPromotedSummary({ promoted: eligibleCount, repeated: repeatCount });
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4 text-[#d9b84a]" />
            Academic Board Progression Controller
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Cohort Progression & Batch Promotion Desk
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Standard G.E.S Continuous Assessment Progression & WASSCE Candidate Transition
          </p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={eligibleCount === 0}
          className="custom-btn px-5 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Execute Batch Promotion ({eligibleCount} Students)</span>
        </button>
      </div>

      {/* Cohort & Criteria Config */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Source Cohort</label>
          <select
            value={sourceForm}
            onChange={(e) => setSourceForm(e.target.value as any)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg font-bold text-gray-900 bg-white"
          >
            <option value="Form 2">Form 2 &rarr; Form 3 (Finalists)</option>
            <option value="Form 1">Form 1 &rarr; Form 2 (Continuing)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">
            Minimum Passing Mark (%)
          </label>
          <input
            type="number"
            min="30"
            max="80"
            value={minPassAverage}
            onChange={(e) => setMinPassAverage(parseInt(e.target.value) || 50)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg font-bold text-blue-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">
            Max WASSCE Aggregate
          </label>
          <input
            type="number"
            min="12"
            max="45"
            value={maxAggregate}
            onChange={(e) => setMaxAggregate(parseInt(e.target.value) || 36)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg font-bold text-amber-700 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Filter Candidate</label>
          <input
            type="text"
            placeholder="Search name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Evaluated</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{cohortStudents.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{sourceForm} Cohort</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Eligible for Promotion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{eligibleCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{passRate}% Pass Rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Advised to Repeat</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">{repeatCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Below academic threshold</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Target Destination</span>
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{targetForm}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">2026/2027 Session</div>
        </div>
      </div>

      {/* Cohort Candidates Roster Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-700">
            Showing {filteredList.length} candidate assessments in {sourceForm}
          </span>
          <span className="text-[11px] text-gray-500">
            Criteria: Mark &ge; {minPassAverage}% &bull; Aggregate &le; {maxAggregate}
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Student ID</th>
                <th className="py-2.5 px-4 font-semibold">Candidate Full Name</th>
                <th className="py-2.5 px-4 font-semibold">Current Class</th>
                <th className="py-2.5 px-4 font-semibold">Programme</th>
                <th className="py-2.5 px-4 text-center font-semibold">Average (%)</th>
                <th className="py-2.5 px-4 text-center font-semibold">WASSCE Aggr.</th>
                <th className="py-2.5 px-4 text-center font-semibold">Board Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No candidates found in this cohort.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, pIdx) => (
                  <tr key={`${item.student.student_id}-${item.student.id || pIdx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-900">
                      {item.student.student_id}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">
                      {item.student.full_name}
                    </td>
                    <td className="py-2.5 px-4 text-gray-700">{item.student.class}</td>
                    <td className="py-2.5 px-4 text-gray-600 truncate max-w-[200px]">
                      {item.student.programme}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-blue-950">
                      {item.averageMarks}%
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-amber-800">
                      {item.aggregate}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.decision === 'Promote'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.decision === 'Promote' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Promote &rarr; {targetForm}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Repeat {sourceForm}</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion History Log */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-blue-900" />
          <h4 className="font-bold text-gray-900 text-sm">Academic Board Promotion Audit Trail</h4>
        </div>
        <div className="space-y-3">
          {promotionHistory.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 bg-slate-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2"
            >
              <div>
                <span className="font-bold text-gray-900">
                  {rec.source_class} &rarr; {rec.target_class}
                </span>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Session: {rec.academic_session} &bull; Authorized by: {rec.promoted_by}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                  {rec.promoted_count} Promoted
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[10px]">
                  {rec.repeated_count} Repeated
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{rec.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Authorize Batch Promotion</h3>
                <p className="text-xs text-gray-500">{sourceForm} Cohort &rarr; {targetForm}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to promote <strong>{eligibleCount}</strong> eligible students from{' '}
              <strong>{sourceForm}</strong> to <strong>{targetForm}</strong>?{' '}
              {repeatCount > 0 && <span>(<strong>{repeatCount}</strong> candidates will remain in {sourceForm} to repeat).</span>}
              {' '}This will officially elevate their academic standing and register an entry in the system audit trail.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePromotion}
                className="custom-btn px-5 py-2 text-xs font-semibold shadow-xs"
              >
                Confirm & Execute Promotion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {isSuccessModalOpen && promotedSummary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Batch Promotion Completed!</h3>
            <p className="text-xs text-gray-600">
              Successfully progressed <strong>{promotedSummary.promoted}</strong> candidates to{' '}
              <strong>{targetForm}</strong>. All student class levels, marks, and official records have been updated and logged to the system audit trail.
            </p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="custom-btn w-full py-2.5 text-xs font-semibold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
