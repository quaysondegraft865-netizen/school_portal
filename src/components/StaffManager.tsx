import React, { useState } from 'react';
import { StaffMember } from '../types';
import { addAuditLog } from '../adminAdvancedService';
import { Users, UserPlus, BookOpen, Phone, Mail, Award, CheckCircle, Search, Trash2 } from 'lucide-react';

interface StaffManagerProps {
  staff: StaffMember[];
  onUpdateStaff: (staff: StaffMember[]) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({ staff, onUpdateStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Form states for new staff
  const [name, setName] = useState('');
  const [role, setRole] = useState('Subject Teacher');
  const [department, setDepartment] = useState('General Agriculture');
  const [subjectsText, setSubjectsText] = useState('');
  const [phone, setPhone] = useState('+233 ');
  const [email, setEmail] = useState('');

  const departments = [
    'All',
    'Administration',
    'General Agriculture',
    'Technical',
    'Science',
    'Mathematics',
    'Languages',
    'Accounts',
    'Home Economics',
  ];

  const filteredStaff = staff.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDept = departmentFilter === 'All' || m.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department) return;

    const newStaff: StaffMember = {
      id: Date.now(),
      staff_id: `NKAS/STF/0${staff.length + 1}`,
      name,
      role,
      department,
      subjects: subjectsText.split(',').map((s) => s.trim()).filter(Boolean),
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@nkas.edu.gh`,
    };

    const updated = [...staff, newStaff];
    onUpdateStaff(updated);

    addAuditLog({
      user: 'Administrator',
      action: `New Staff Appointed: ${newStaff.name}`,
      category: 'Staff',
      details: `Registered ${newStaff.name} as ${newStaff.role} in ${newStaff.department} department.`,
      status: 'Success',
    });

    setIsAddStaffOpen(false);
    setName('');
    setSubjectsText('');
    setEmail('');
  };

  const handleConfirmDeleteStaff = () => {
    if (!staffToDelete) return;
    const { id, name } = staffToDelete;
    const updated = staff.filter((m) => m.id !== id);
    onUpdateStaff(updated);

    addAuditLog({
      user: 'Administrator',
      action: `Staff Member Removed: ${name}`,
      category: 'Staff',
      details: `Removed staff record for ${name}.`,
      status: 'Warning',
    });
    setStaffToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4 text-[#d9b84a]" />
            Faculty & Human Resources Desk
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Teaching & Administrative Staff Allocation
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Total Faculty: {staff.length} staff members &bull; Form Master Appointments & Departmental Workloads
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="custom-btn px-4 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Appoint New Staff Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Search Faculty</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Department</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-mono text-blue-900 font-semibold">{member.staff_id}</span>
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                  {member.department}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">{member.name}</h4>
              <p className="text-xs text-amber-700 font-medium mt-0.5">{member.role}</p>

              <div className="mt-3">
                <span className="text-[11px] text-gray-500 block font-medium">Subjects Assigned:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.subjects.map((sub) => (
                    <span key={sub} className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] truncate max-w-[200px]">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <button
                onClick={() => setStaffToDelete(member)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                title="Remove staff"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="bg-[#14294b] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Appoint New Staff Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-gray-300 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  placeholder="e.g., Mr. Francis Osei"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    {departments.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subjects (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Physics, Add Mathematics"
                  value={subjectsText}
                  onChange={(e) => setSubjectsText(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    placeholder="name@nkas.edu.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="custom-btn px-5 py-2 font-semibold">
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Remove Staff Record</h3>
              <button
                onClick={() => setStaffToDelete(null)}
                className="text-white hover:text-red-200 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-gray-700">
              <p>
                Are you sure you want to remove <strong className="text-gray-900">{staffToDelete.name}</strong> ({staffToDelete.role} &bull; {staffToDelete.department}) from the active staff directory?
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStaffToDelete(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteStaff}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Removal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
