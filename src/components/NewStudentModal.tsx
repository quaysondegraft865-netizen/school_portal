import React, { useState } from 'react';
import { Student } from '../types';
import { INITIAL_SUBJECT_COMBINATIONS } from '../mockData';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  existingCount: number;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingCount,
}) => {
  const currentYear = new Date().getFullYear();
  const nextNumber = String(existingCount + 1).padStart(3, '0');
  const generatedId = `NKAS/${currentYear}/${nextNumber}`;

  const [studentId, setStudentId] = useState(generatedId);
  const [fullName, setFullName] = useState('');
  const [formClass, setFormClass] = useState('Form 1');
  const [combinationSn, setCombinationSn] = useState<number>(8); // Default Agriculture 1
  const [programme, setProgramme] = useState('General Agriculture');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('2009-05-14');
  const [house, setHouse] = useState('Nkrumah House (House 1)');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [hometown, setHometown] = useState('');

  if (!isOpen) return null;

  const handleCombinationChange = (sn: number) => {
    setCombinationSn(sn);
    const found = INITIAL_SUBJECT_COMBINATIONS.find((c) => c.sn === sn);
    if (found) {
      setProgramme(found.course);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newStudent: Student = {
      id: Date.now(),
      student_id: studentId.trim(),
      full_name: fullName.trim(),
      class: formClass,
      programme,
      combination_sn: combinationSn,
      gender,
      status: 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      date_of_birth: dob,
      house,
      guardian_name: guardianName.trim(),
      guardian_phone: guardianPhone.trim(),
      email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@student.nkas.edu.gh`,
      hometown: hometown.trim() || 'Western Region'
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-gray-200 overflow-hidden">
        <div className="bg-[#14294b] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user-plus text-yellow-400"></i>
            <h3 className="font-bold text-base">Register New Student</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Student Index Number
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
                placeholder="e.g. Yaw Baah Boateng"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Class Level
              </label>
              <select
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none bg-white"
              >
                <option>Form 1</option>
                <option>Form 2</option>
                <option>Form 3</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subject Combination Package (SHS 1 - 3)
              </label>
              <select
                value={combinationSn}
                onChange={(e) => handleCombinationChange(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none bg-white font-medium"
              >
                {INITIAL_SUBJECT_COMBINATIONS.map((comb) => (
                  <option key={comb.sn} value={comb.sn}>
                    S/N {comb.sn}: {comb.course} ({comb.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Residential House
              </label>
              <select
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none bg-white"
              >
                <option>Nkrumah House (House 1)</option>
                <option>Yaa Asantewaa House (House 2)</option>
                <option>Agric Pioneer House (House 3)</option>
                <option>Technical House (House 4)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
                placeholder="e.g. Mr. Kofi Boateng"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Guardian Phone Number
              </label>
              <input
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none font-mono"
                placeholder="+233 24 XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Hometown / Origin
            </label>
            <input
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
              placeholder="e.g. Nkroful, Ellemabelle"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-[11px] text-yellow-900">
            <i className="fa-solid fa-circle-info mr-1 text-yellow-700"></i>
            Registering a student automatically creates their Student Portal account with default password: <strong>password123</strong>.
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="custom-btn px-6 py-2 text-xs font-semibold"
            >
              Save & Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
