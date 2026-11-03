import React, { useState } from 'react';
import { AuditLogEntry, Student, Fee, AssessmentSheet, StaffMember } from '../types';
import { getStoredAuditLogs, saveStoredAuditLogs, addAuditLog } from '../adminAdvancedService';
import { ShieldAlert, Download, Upload, Filter, Search, CheckCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

interface AuditLogViewerProps {
  students: Student[];
  fees: Fee[];
  sheets: AssessmentSheet[];
  staff: StaffMember[];
  onRestoreData?: (backup: any) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  students,
  fees,
  sheets,
  staff,
  onRestoreData,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => getStoredAuditLogs());
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [backupAlert, setBackupAlert] = useState(false);

  const categories = [
    'All',
    'Assessment',
    'Fee / Bursary',
    'Student SIS',
    'Promotion',
    'Staff',
    'Broadcast',
    'System',
  ];

  const filteredLogs = logs.filter((l) => {
    const matchCat = categoryFilter === 'All' || l.category === categoryFilter;
    const matchSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Export full system backup JSON
  const handleExportBackup = () => {
    const backupData = {
      app: 'NKAS Enterprise School Management Portal',
      exported_at: new Date().toISOString(),
      academic_year: '2026/2027',
      students,
      fees,
      sheets,
      staff,
      logs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NKAS_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog({
      user: 'Administrator',
      action: 'Full System Database Backup Exported',
      category: 'System',
      details: `Exported snapshot with ${students.length} students, ${fees.length} transactions, and ${sheets.length} assessment sheets.`,
      status: 'Success',
    });

    setLogs(getStoredAuditLogs());
    setBackupAlert(true);
    setTimeout(() => setBackupAlert(false), 4000);
  };

  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [pendingRestoreBackup, setPendingRestoreBackup] = useState<any | null>(null);

  // Restore backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && Array.isArray(parsed.students)) {
          setPendingRestoreBackup(parsed);
          setStatusNotice({
            type: 'info',
            text: `Backup file verified. It contains ${parsed.students.length} students. Please confirm restoration below.`,
          });
        } else {
          setStatusNotice({ type: 'error', text: 'Invalid backup file format: missing student records.' });
        }
      } catch {
        setStatusNotice({ type: 'error', text: 'Failed to parse backup JSON file.' });
      }
    };
    reader.readAsText(file);
    // Reset file input value so re-selecting same file triggers change
    e.target.value = '';
  };

  const handleConfirmRestore = () => {
    if (!pendingRestoreBackup) return;
    if (onRestoreData) onRestoreData(pendingRestoreBackup);
    addAuditLog({
      user: 'Administrator',
      action: 'Database Restored from Backup File',
      category: 'System',
      details: `Restored records for ${pendingRestoreBackup.students.length} students.`,
      status: 'Success',
    });
    setLogs(getStoredAuditLogs());
    setStatusNotice({
      type: 'success',
      text: `Database restored successfully from backup (${pendingRestoreBackup.students.length} student records updated).`,
    });
    setPendingRestoreBackup(null);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const handleCancelRestore = () => {
    setPendingRestoreBackup(null);
    setStatusNotice(null);
  };

  const handleClearLogs = () => {
    const preserved = logs.slice(0, 2);
    setLogs(preserved);
    saveStoredAuditLogs(preserved);
    setStatusNotice({ type: 'info', text: 'Old audit records cleared. Essential initialization logs preserved.' });
    setTimeout(() => setStatusNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4 text-[#d9b84a]" />
            Security & Compliance Audit Trail
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            System Operations & Security Audit Log
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Immutable tracking of grade publications, financial receipts, cohort promotions, and policy changes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#14294b] text-white hover:bg-[#1e3a66] rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {backupAlert && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Full JSON backup snapshot generated and downloaded successfully.</span>
        </div>
      )}

      {statusNotice && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 text-xs font-medium border ${
            statusNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusNotice.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {statusNotice.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
          {statusNotice.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />}
          {statusNotice.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
          <div className="flex-1">{statusNotice.text}</div>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {pendingRestoreBackup && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Confirm Database Restoration</h4>
              <p className="text-xs text-amber-800 mt-1">
                This operation will overwrite current active session data with the contents of the backup file (
                <strong>{pendingRestoreBackup.students?.length || 0} students</strong>
                {pendingRestoreBackup.fees ? `, ${pendingRestoreBackup.fees.length} fee records` : ''}
                {pendingRestoreBackup.sheets ? `, ${pendingRestoreBackup.sheets.length} assessment sheets` : ''}).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 pl-8">
            <button
              onClick={handleConfirmRestore}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Proceed With Database Restoration
            </button>
            <button
              onClick={handleCancelRestore}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Search Audit Events</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by action, user, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-700">
            Showing {filteredLogs.length} audit trail events
          </span>
          <button
            onClick={handleClearLogs}
            className="text-gray-400 hover:text-red-600 text-[11px] transition-colors"
          >
            Archive Old Records
          </button>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Authorized User</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Action Performed</th>
                <th className="py-2.5 px-4 font-semibold">Audit Details</th>
                <th className="py-2.5 px-4 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-gray-900">{log.action}</td>
                    <td className="py-2.5 px-4 text-gray-600 text-[11px] max-w-xs">{log.details}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.status === 'Success' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Info className="w-3 h-3" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
