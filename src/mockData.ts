import { User, Student, Fee, ExamResult, TimetableSlot, StaffMember, SubjectCombination } from './types';
import { getCompleteStudentsRoster } from './assessmentService';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    student_id: 'NKAS/2024/001',
    full_name: 'Kwesi Mensah',
    class: 'Form 2',
    programme: 'General Agriculture',
    combination_sn: 8,
    gender: 'Male',
    status: 'Active',
    created_at: '2024-09-12 10:30:00',
    date_of_birth: '2008-04-15',
    house: 'Nkrumah House (House 1)',
    guardian_name: 'Emmanuel Mensah',
    guardian_phone: '+233 24 456 7890',
    email: 'k.mensah@student.nkas.edu.gh',
    hometown: 'Axim, Western Region'
  },
  {
    id: 2,
    student_id: 'NKAS/2024/042',
    full_name: 'Abena Osei Poku',
    class: 'Form 3',
    programme: 'Technical (Building & Construction)',
    combination_sn: 1,
    gender: 'Female',
    status: 'Active',
    created_at: '2023-09-15 08:20:00',
    date_of_birth: '2007-08-22',
    house: 'Yaa Asantewaa House (House 2)',
    guardian_name: 'Mrs. Janet Osei',
    guardian_phone: '+233 20 890 1234',
    email: 'a.osei@student.nkas.edu.gh',
    hometown: 'Takoradi, Western Region'
  },
  {
    id: 3,
    student_id: 'NKAS/2025/108',
    full_name: 'Kofi Boakye',
    class: 'Form 1',
    programme: 'General Science',
    gender: 'Male',
    status: 'Active',
    created_at: '2025-01-10 11:15:00',
    date_of_birth: '2009-02-18',
    house: 'Agric Pioneer House (House 3)',
    guardian_name: 'Dr. Kwame Boakye',
    guardian_phone: '+233 26 123 4567',
    email: 'k.boakye@student.nkas.edu.gh',
    hometown: 'Nkroful, Western Region'
  },
  {
    id: 4,
    student_id: 'NKAS/2024/077',
    full_name: 'Ama Serwaa',
    class: 'Form 2',
    programme: 'Home Economics',
    gender: 'Female',
    status: 'Active',
    created_at: '2024-09-14 09:40:00',
    date_of_birth: '2008-11-05',
    house: 'Yaa Asantewaa House (House 2)',
    guardian_name: 'Grace Serwaa',
    guardian_phone: '+233 54 321 0987',
    email: 'a.serwaa@student.nkas.edu.gh',
    hometown: 'Tarkwa, Western Region'
  },
  {
    id: 5,
    student_id: 'NKAS/2023/015',
    full_name: 'Emmanuel Nkrumah',
    class: 'Form 3',
    programme: 'General Agriculture',
    gender: 'Male',
    status: 'Active',
    created_at: '2023-09-12 14:00:00',
    date_of_birth: '2007-03-09',
    house: 'Nkrumah House (House 1)',
    guardian_name: 'Patrick Nkrumah',
    guardian_phone: '+233 24 999 1122',
    email: 'e.nkrumah@student.nkas.edu.gh',
    hometown: 'Nkroful, Western Region'
  },
  {
    id: 6,
    student_id: 'NKAS/2025/089',
    full_name: 'Grace Addo',
    class: 'Form 1',
    programme: 'Business',
    gender: 'Female',
    status: 'Active',
    created_at: '2025-01-11 10:00:00',
    date_of_birth: '2009-06-30',
    house: 'Agric Pioneer House (House 3)',
    guardian_name: 'Charles Addo',
    guardian_phone: '+233 55 777 8899',
    email: 'g.addo@student.nkas.edu.gh',
    hometown: 'Elubo, Western Region'
  }
];

export const INITIAL_FEES: Fee[] = [
  {
    id: 1,
    student_id: 'NKAS/2024/001',
    amount: 850.00,
    description: 'First Term Tuition & Boarding Fees',
    status: 'Paid',
    recorded_by: 'Accountant (Mr. F. Mensah)',
    created_at: '2026-10-02 11:20:00',
    receipt_no: 'RCP-2026-8801',
    term: '2026/2027 Term 1',
    payment_method: 'Mobile Money'
  },
  {
    id: 2,
    student_id: 'NKAS/2024/001',
    amount: 150.00,
    description: 'PTA Development Levy & ICT Lab Maintenance',
    status: 'Paid',
    recorded_by: 'Bursar (Mrs. E. Kwofie)',
    created_at: '2026-10-15 14:45:00',
    receipt_no: 'RCP-2026-9104',
    term: '2026/2027 Term 1',
    payment_method: 'Cash Receipt'
  },
  {
    id: 3,
    student_id: 'NKAS/2024/001',
    amount: 120.00,
    description: 'Agricultural Practical Consumables & Farm Tools Fee',
    status: 'Pending',
    recorded_by: 'Bursar (Mrs. E. Kwofie)',
    created_at: '2026-10-25 09:30:00',
    term: '2026/2027 Term 1'
  },
  {
    id: 4,
    student_id: 'NKAS/2024/042',
    amount: 1050.00,
    description: 'Technical Workshop & Examination Registration',
    status: 'Paid',
    recorded_by: 'Accountant (Mr. F. Mensah)',
    created_at: '2026-09-29 10:15:00',
    receipt_no: 'RCP-2026-7840',
    term: '2026/2027 Term 1',
    payment_method: 'Bank Deposit'
  },
  {
    id: 5,
    student_id: 'NKAS/2025/108',
    amount: 750.00,
    description: 'Freshman Admission Package & Science Laboratory Deposit',
    status: 'Partially Paid',
    recorded_by: 'Bursar (Mrs. E. Kwofie)',
    created_at: '2026-10-08 16:00:00',
    receipt_no: 'RCP-2026-8211',
    term: '2026/2027 Term 1',
    payment_method: 'Mobile Money'
  }
];

export const INITIAL_EXAM_RESULTS: Record<string, ExamResult> = {};


export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: '1', day: 'Monday', period: 1, time: '07:30 - 08:15', subject: 'General Agriculture', teacher: 'Mr. S. K. Arthur', room: 'Agric Lab 1' },
  { id: '2', day: 'Monday', period: 2, time: '08:15 - 09:00', subject: 'General Agriculture', teacher: 'Mr. S. K. Arthur', room: 'Agric Lab 1' },
  { id: '3', day: 'Monday', period: 3, time: '09:00 - 09:45', subject: 'Core Mathematics', teacher: 'Mrs. D. Quaye', room: 'Room 2B' },
  { id: '4', day: 'Monday', period: 4, time: '10:15 - 11:00', subject: 'English Language', teacher: 'Mr. K. Amponsah', room: 'Room 2B' },
  { id: '5', day: 'Monday', period: 5, time: '11:00 - 11:45', subject: 'Integrated Science', teacher: 'Dr. N. Tetteh', room: 'Science Lab' },
  { id: '6', day: 'Monday', period: 6, time: '12:30 - 01:15', subject: 'Animal Husbandry', teacher: 'Mr. E. Donkor', room: 'Livestock Unit' },
  
  { id: '7', day: 'Tuesday', period: 1, time: '07:30 - 08:15', subject: 'Crop Husbandry', teacher: 'Ms. R. Adjei', room: 'Demonstration Farm' },
  { id: '8', day: 'Tuesday', period: 2, time: '08:15 - 09:00', subject: 'Crop Husbandry', teacher: 'Ms. R. Adjei', room: 'Demonstration Farm' },
  { id: '9', day: 'Tuesday', period: 3, time: '09:00 - 09:45', subject: 'English Language', teacher: 'Mr. K. Amponsah', room: 'Room 2B' },
  { id: '10', day: 'Tuesday', period: 4, time: '10:15 - 11:00', subject: 'Core Mathematics', teacher: 'Mrs. D. Quaye', room: 'Room 2B' },
  { id: '11', day: 'Tuesday', period: 5, time: '11:00 - 11:45', subject: 'Social Studies', teacher: 'Mr. B. Asare', room: 'Room 2B' },
  { id: '12', day: 'Tuesday', period: 6, time: '12:30 - 01:15', subject: 'Agricultural Chemistry', teacher: 'Mr. O. Boateng', room: 'Chem Lab' },

  { id: '13', day: 'Wednesday', period: 1, time: '07:30 - 08:15', subject: 'Core Mathematics', teacher: 'Mrs. D. Quaye', room: 'Room 2B' },
  { id: '14', day: 'Wednesday', period: 2, time: '08:15 - 09:00', subject: 'Animal Husbandry', teacher: 'Mr. E. Donkor', room: 'Room 2B' },
  { id: '15', day: 'Wednesday', period: 3, time: '09:00 - 09:45', subject: 'Integrated Science', teacher: 'Dr. N. Tetteh', room: 'Science Lab' },
  { id: '16', day: 'Wednesday', period: 4, time: '10:15 - 11:00', subject: 'ICT Practical', teacher: 'Mr. P. Cudjoe', room: 'ICT Center' },
  { id: '17', day: 'Wednesday', period: 5, time: '11:00 - 11:45', subject: 'ICT Practical', teacher: 'Mr. P. Cudjoe', room: 'ICT Center' },
  { id: '18', day: 'Wednesday', period: 6, time: '12:30 - 01:15', subject: 'Physical Education / Sports', teacher: 'Coach G. Mensah', room: 'School Field' },

  { id: '19', day: 'Thursday', period: 1, time: '07:30 - 08:15', subject: 'Farm Practicals & Fieldwork', teacher: 'Mr. S. K. Arthur', room: 'School Farm' },
  { id: '20', day: 'Thursday', period: 2, time: '08:15 - 09:00', subject: 'Farm Practicals & Fieldwork', teacher: 'Mr. S. K. Arthur', room: 'School Farm' },
  { id: '21', day: 'Thursday', period: 3, time: '09:00 - 09:45', subject: 'General Agriculture', teacher: 'Mr. S. K. Arthur', room: 'Room 2B' },
  { id: '22', day: 'Thursday', period: 4, time: '10:15 - 11:00', subject: 'English Language', teacher: 'Mr. K. Amponsah', room: 'Room 2B' },
  { id: '23', day: 'Thursday', period: 5, time: '11:00 - 11:45', subject: 'Agricultural Chemistry', teacher: 'Mr. O. Boateng', room: 'Chem Lab' },
  { id: '24', day: 'Thursday', period: 6, time: '12:30 - 01:15', subject: 'Library / Independent Study', teacher: 'Librarian', room: 'Library' },

  { id: '25', day: 'Friday', period: 1, time: '07:30 - 08:15', subject: 'Integrated Science', teacher: 'Dr. N. Tetteh', room: 'Science Lab' },
  { id: '26', day: 'Friday', period: 2, time: '08:15 - 09:00', subject: 'Social Studies', teacher: 'Mr. B. Asare', room: 'Room 2B' },
  { id: '27', day: 'Friday', period: 3, time: '09:00 - 09:45', subject: 'Crop Husbandry', teacher: 'Ms. R. Adjei', room: 'Room 2B' },
  { id: '28', day: 'Friday', period: 4, time: '10:15 - 11:00', subject: 'Moral & Religious Studies', teacher: 'Rev. J. Appiah', room: 'Assembly Hall' },
  { id: '29', day: 'Friday', period: 5, time: '11:00 - 11:45', subject: 'Club & Society Activities', teacher: 'Staff Patron', room: 'Various Rooms' },
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 1, staff_id: 'NKAS/STF/001', name: 'Dr. Kwabena Nkansah', role: 'Headmaster', department: 'Administration', subjects: ['Administration'], phone: '+233 24 333 4455', email: 'headmaster@nkas.edu.gh' },
  { id: 2, staff_id: 'NKAS/STF/002', name: 'Mr. Samuel K. Arthur', role: 'Head of Department (Agric)', department: 'General Agriculture', subjects: ['General Agriculture', 'Crop Husbandry'], phone: '+233 20 444 5566', email: 's.arthur@nkas.edu.gh' },
  { id: 3, staff_id: 'NKAS/STF/003', name: 'Mrs. Dorothy Quaye', role: 'Senior Mathematics Teacher', department: 'Mathematics', subjects: ['Core Mathematics', 'Elective Mathematics'], phone: '+233 24 555 6677', email: 'd.quaye@nkas.edu.gh' },
  { id: 4, staff_id: 'NKAS/STF/004', name: 'Mr. Kwadwo Amponsah', role: 'Head of Languages', department: 'Languages', subjects: ['English Language', 'Literature-in-English'], phone: '+233 27 666 7788', email: 'k.amponsah@nkas.edu.gh' },
  { id: 5, staff_id: 'NKAS/STF/005', name: 'Dr. Nana Tetteh', role: 'Science Department Head', department: 'Science', subjects: ['Integrated Science', 'Biology'], phone: '+233 24 777 8899', email: 'n.tetteh@nkas.edu.gh' },
  { id: 6, staff_id: 'NKAS/STF/006', name: 'Ing. Benjamin Tawiah', role: 'Technical Department Head', department: 'Technical', subjects: ['Building Construction', 'Technical Drawing'], phone: '+233 50 888 9900', email: 'b.tawiah@nkas.edu.gh' },
  { id: 7, staff_id: 'NKAS/STF/007', name: 'Mrs. Evelyn Kwofie', role: 'Bursar & Finance Officer', department: 'Accounts', subjects: ['Finance'], phone: '+233 24 999 0011', email: 'bursar@nkas.edu.gh' }
];

export const MANDATORY_CURRICULUM_RULE = 'SHS 2 ROBOTICS AND CODING ARE MANDATORY';

export const INITIAL_SUBJECT_COMBINATIONS: SubjectCombination[] = [
  {
    sn: 1,
    course: 'APPLIED TECHNOLOGY 1',
    category: 'Applied Technology',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['DESIGN AND COMMUNICATION TECHNOLOGY', 'AUTOMOBILE AND METAL WORK TECHNOLOGY', 'PHYSICS', 'ADD MATHEMATICS', 'I.C.T / ACCOUNTING'],
    notes: 'Automotive & mechanical design engineering pathway'
  },
  {
    sn: 2,
    course: 'APPLIED TECH 2',
    category: 'Applied Technology',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE', 'ICT'],
    elective_subjects: ['DESIGN AND COMMUNICATION TECHNOLOGY', 'ELECTRICAL AND ELECTRONICS TECHNOLOGY', 'PHYSICS', 'ADD MATHEMATICS', 'I.C.T / ACCOUNTING'],
    notes: 'Electrical & electronics technology pathway'
  },
  {
    sn: 3,
    course: 'GENERAL SCIENCE 1',
    category: 'General Science',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'PEH', 'AGRICULTURAL SCIENCE', 'ICT'],
    elective_subjects: ['BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'ADD MATHEMATICS', 'ECONOMICS'],
    notes: 'Biological, pharmaceutical & health sciences'
  },
  {
    sn: 4,
    course: 'GENERAL SCIENCE 2',
    category: 'General Science',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'PEH', 'AGRICULTURAL SCIENCE', 'ICT'],
    elective_subjects: ['CHEMISTRY', 'PHYSICS', 'ADD MATHEMATICS', 'ECONOMICS', 'ICT / GEOGRAPHY'],
    notes: 'Physical sciences, earth & computer engineering'
  },
  {
    sn: 5,
    course: 'BUSINESS',
    category: 'Business',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE', 'ICT'],
    elective_subjects: ['BUSINESS MANAGEMENT', 'ACCOUNTING', 'ECONOMICS', 'COMPUTER SCIENCE', 'ADD MATHEMATICS'],
    notes: 'Banking, accounting & business analytics'
  },
  {
    sn: 6,
    course: 'VISUAL AND PERFORMING ARTS 1',
    category: 'Visual & Performing Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ART AND DESIGN FOUNDATION', 'ARTS AND DESIGN STUDIO', 'DESIGN COMMUNICATION TECHNOLOGY', 'ICT', 'ADD MATHEMATICS', 'ECONS / MUSIC / PERFORMING ARTS / FRENCH'],
    notes: 'Fine arts, graphic media & performance'
  },
  {
    sn: 7,
    course: 'VISUAL AND PERFORMING ARTS 2',
    category: 'Visual & Performing Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ART AND DESIGN FOUNDATION', 'ARTS AND DESIGN STUDIO', 'DESIGN COMMUNICATION TECHNOLOGY', 'ICT', 'ECONOMICS'],
    notes: 'Creative studio arts & economic enterprise'
  },
  {
    sn: 8,
    course: 'AGRICULTURE 1',
    category: 'Agriculture',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH'],
    elective_subjects: ['AGRICULTURE', 'CHEMISTRY', 'PHYSICS', 'ADD MATHEMATICS', 'I.C.T', 'BM'],
    notes: 'Agribusiness, agrochemicals & mechanization'
  },
  {
    sn: 9,
    course: 'AGRICULTURE 2',
    category: 'Agriculture',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'ICT'],
    elective_subjects: ['AGRICULTURE', 'CHEMISTRY', 'PHYSICS', 'ADD MATHEMATICS', 'ACCOUNTING'],
    notes: 'Agricultural enterprise & agro-accounting'
  },
  {
    sn: 10,
    course: 'ARTS 7',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'ICT', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['NZEMA', 'FRENCH', 'LIT – IN – ENGLISH', 'MUSIC', 'PEH'],
    notes: 'Languages, indigenous Nzema language & musical heritage'
  },
  {
    sn: 11,
    course: 'ARTS 1',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ECONOMICS', 'GOVERNMENT', 'GEOGRAPHY', 'ADD MATHEMATICS', 'E- I.C.T'],
    notes: 'Public policy, economics & geospatial analysis'
  },
  {
    sn: 12,
    course: 'ARTS 2',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ECONOMICS', 'GOVERNMENT', 'NZEMA', 'GEOGRAPHY', 'PERFORMING ARTS'],
    notes: 'Governance, regional Nzema culture & theater arts'
  },
  {
    sn: 13,
    course: 'ARTS 3',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ECONOMICS', 'HISTORY', 'BM', 'MUSIC', 'FRENCH'],
    notes: 'Diplomatic relations, history & international trade'
  },
  {
    sn: 14,
    course: 'ARTS 4',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ECONOMICS', 'M.I.L', 'B.M', 'F.A.N', 'BIOLOGY'],
    notes: 'Social economics, family life management & nutrition'
  },
  {
    sn: 15,
    course: 'ARTS 5',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['ECONOMICS', 'ACCOUNTING', 'HISTORY', 'CRS', 'ART AND DESIGN STU'],
    notes: 'Christian religious studies, history & studio design'
  },
  {
    sn: 16,
    course: 'ARTS 6',
    category: 'General Arts',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['MUSIC', 'LIT – IN – ENGLISH', 'FRENCH', 'CRS', 'COMPUTING'],
    notes: 'Literature, computing technologies & religious ethics'
  },
  {
    sn: 17,
    course: 'HOME ECONOMICS 1',
    category: 'Home Economics',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['MIL', 'CLOTHING / TEXTILES', 'BIOLOGY', 'ICT', 'BM'],
    notes: 'Textile arts, clothing production & business management'
  },
  {
    sn: 18,
    course: 'HOME ECONOMICS 2',
    category: 'Home Economics',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'PEH', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['MIL', 'FOOD AND NUTRITION', 'BIOLOGY', 'FRENCH', 'ICT'],
    notes: 'Culinary science, food nutrition & institutional catering'
  },
  {
    sn: 19,
    course: 'HOME ECONOMICS 3',
    category: 'Home Economics',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['MIL', 'CLOTHING / TEXTILES', 'BIOLOGY', 'ICT', 'PEH'],
    notes: 'Garment construction, biological studies & health'
  },
  {
    sn: 20,
    course: 'HOME ECONOMICS 4',
    category: 'Home Economics',
    core_subjects: ['MATHEMATICS', 'SOCIAL STUDIES', 'ENGLISH LANGUAGE', 'GENERAL SCIENCE', 'AGRICULTURAL SCIENCE'],
    elective_subjects: ['MIL', 'FOOD AND NUTRITION', 'BIOLOGY', 'ICT', 'PEH'],
    notes: 'Food science, dietetics & physical health education'
  }
];

// Helper functions for LocalStorage persistence
const STORAGE_KEYS = {
  STUDENTS: 'nkas_students_v3',
  FEES: 'nkas_fees_v1',
  RESULTS: 'nkas_results_v1',
  TIMETABLE: 'nkas_timetable_v1',
  STAFF: 'nkas_staff_v1',
  SUBJECT_COMBINATIONS: 'nkas_subject_combinations_v1',
  CURRENT_USER: 'nkas_auth_user_v1',
};

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) {
      const parsed: Student[] = JSON.parse(raw);
      const seen = new Set<string>();
      let hasDuplicates = false;
      for (const s of parsed) {
        if (seen.has(s.student_id) || s.student_id?.includes('2APP')) {
          hasDuplicates = true;
          break;
        }
        seen.add(s.student_id);
      }
      if (!hasDuplicates && parsed.length >= 1000) {
        return parsed;
      }
    }
    const roster = getCompleteStudentsRoster();
    const merged = [...INITIAL_STUDENTS, ...roster];
    const uniqueMap = new Map<string, Student>();
    merged.forEach((s) => {
      if (!uniqueMap.has(s.student_id)) {
        uniqueMap.set(s.student_id, s);
      }
    });
    const finalStudents = Array.from(uniqueMap.values());
    saveStoredStudents(finalStudents);
    return finalStudents;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function getStoredFees(): Fee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEES);
    return raw ? JSON.parse(raw) : INITIAL_FEES;
  } catch {
    return INITIAL_FEES;
  }
}

export function saveStoredFees(fees: Fee[]): void {
  localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
}

export function getStoredResults(): Record<string, ExamResult> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If legacy demo data is detected, clean it out
      if (parsed['NKAS/2024/001']?.subjects?.some((s: any) => s.code === 'AGR201')) {
        localStorage.removeItem(STORAGE_KEYS.RESULTS);
        return {};
      }
      return parsed;
    }
    return INITIAL_EXAM_RESULTS;
  } catch {
    return INITIAL_EXAM_RESULTS;
  }
}

export function saveStoredResults(results: Record<string, ExamResult>): void {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

export function getStoredTimetable(): TimetableSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return raw ? JSON.parse(raw) : INITIAL_TIMETABLE;
  } catch {
    return INITIAL_TIMETABLE;
  }
}

export function getStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    return raw ? JSON.parse(raw) : INITIAL_STAFF;
  } catch {
    return INITIAL_STAFF;
  }
}

export function saveStoredStaff(staff: StaffMember[]): void {
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
}

export function getStoredSubjectCombinations(): SubjectCombination[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECT_COMBINATIONS);
    return raw ? JSON.parse(raw) : INITIAL_SUBJECT_COMBINATIONS;
  } catch {
    return INITIAL_SUBJECT_COMBINATIONS;
  }
}

export function saveStoredSubjectCombinations(combinations: SubjectCombination[]): void {
  localStorage.setItem(STORAGE_KEYS.SUBJECT_COMBINATIONS, JSON.stringify(combinations));
}
