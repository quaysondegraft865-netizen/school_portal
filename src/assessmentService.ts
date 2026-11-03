import form3DataJson from './form3Data.json';
import form2DataJson from './form2Data.json';
import { AssessmentSheet, AssessmentRecord, Student } from './types';

export const FORM_2_CLASSES = [
  '2 APPLIED TECH 1',
  '2 APPLIED TECH 2',
  '2 SCIENCE 1',
  '2 SCIENCE 2',
  '2 AGRIC 1',
  '2 AGRIC 2',
  '2 BUSINESS',
  '2 VISUAL ARTS 1',
  '2 VISUAL ARTS 2',
  '2 ARTS 1',
  '2 ARTS 2',
  '2 ARTS 3',
  '2 ARTS 4',
  '2 ARTS 5',
  '2 ARTS 6',
  '2 H/E 1',
  '2 H/E 2',
  '2 H/E 3',
  '2 H/E 4',
] as const;

export const FORM_3_CLASSES = [
  '3 APPLIED TECH',
  '3 SCIENCE 1',
  '3 SCIENCE 2',
  '3 AGRIC',
  '3 BUSINESS',
  '3 VISUAL ARTS',
  '3 ARTS 1',
  '3 ARTS 2',
  '3 ARTS 3',
  '3 ARTS 4',
  '3 ARTS 5',
  '3 ARTS 6',
  '3 H/E 1',
  '3 H/E 2',
  '3 H/E 3',
  '3 H/E 4',
] as const;

export const ALL_ASSESSMENT_CLASSES = [
  ...FORM_2_CLASSES,
  ...FORM_3_CLASSES,
];

// Subjects per class with mandatory robotics for Form 2
export const CLASS_SUBJECTS_MAP: Record<string, string[]> = {
  // FORM 2 CLASSES
  '2 APPLIED TECH 1': [
    'Design and Communication Technology',
    'Automobile and Metal Work Technology',
    'Physics',
    'Add Mathematics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
    'General Science',
    'Social Studies',
  ],
  '2 APPLIED TECH 2': [
    'Design and Communication Technology',
    'Electrical and Electronics Technology',
    'Physics',
    'Add Mathematics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
    'General Science',
  ],
  '2 SCIENCE 1': [
    'Biology',
    'Chemistry',
    'Physics',
    'Add Mathematics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
    'Integrated Science',
  ],
  '2 SCIENCE 2': [
    'Chemistry',
    'Physics',
    'Add Mathematics',
    'Economics',
    'Geography',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 AGRIC 1': [
    'General Agriculture',
    'Animal Husbandry',
    'Crop Husbandry',
    'Chemistry',
    'Physics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 AGRIC 2': [
    'General Agriculture',
    'Animal Husbandry',
    'Chemistry',
    'Physics',
    'Accounting',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 BUSINESS': [
    'Financial Accounting',
    'Business Management',
    'Economics',
    'Computer Science',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 VISUAL ARTS 1': [
    'Art and Design Studio',
    'Art and Design Foundation',
    'Design Communication Technology',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
    'Social Studies',
  ],
  '2 VISUAL ARTS 2': [
    'Art and Design Studio',
    'Art and Design Foundation',
    'Economics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
    'Social Studies',
  ],
  '2 ARTS 1': [
    'Economics',
    'Government',
    'Geography',
    'Add Mathematics',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 ARTS 2': [
    'Economics',
    'Government',
    'Nzema Language & Culture',
    'Geography',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 ARTS 3': [
    'Economics',
    'History',
    'Business Management',
    'Music',
    'French',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 ARTS 4': [
    'Economics',
    'Management in Living (M.I.L)',
    'Food and Nutrition',
    'Biology',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 ARTS 5': [
    'Christian Religious Studies (CRS)',
    'History',
    'Economics',
    'Financial Accounting',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 ARTS 6': [
    'Literature-in-English',
    'Music',
    'French',
    'Christian Religious Studies (CRS)',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 H/E 1': [
    'Management in Living (M.I.L)',
    'Clothing and Textiles',
    'Biology',
    'Business Management',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 H/E 2': [
    'Management in Living (M.I.L)',
    'Food and Nutrition',
    'Biology',
    'French',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 H/E 3': [
    'Management in Living (M.I.L)',
    'Clothing and Textiles',
    'Biology',
    'Physical Education & Health (PEH)',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],
  '2 H/E 4': [
    'Management in Living (M.I.L)',
    'Food and Nutrition',
    'Biology',
    'Physical Education & Health (PEH)',
    'Robotics and Coding (Mandatory STEM)',
    'Core Mathematics',
    'English Language',
  ],

  // FORM 3 CLASSES
  '3 APPLIED TECH': [
    'Design and Communication Technology',
    'Automobile and Metal Work Technology',
    'Physics',
    'Add Mathematics',
    'Core Mathematics',
    'English Language',
    'Integrated Science',
    'Social Studies',
  ],
  '3 SCIENCE 1': [
    'Biology',
    'Chemistry',
    'Physics',
    'Add Mathematics',
    'Core Mathematics',
    'English Language',
    'Integrated Science',
  ],
  '3 SCIENCE 2': [
    'Chemistry',
    'Physics',
    'Add Mathematics',
    'Economics',
    'Geography',
    'Core Mathematics',
    'English Language',
  ],
  '3 AGRIC': [
    'General Agriculture',
    'Animal Husbandry',
    'Crop Husbandry',
    'Chemistry',
    'Physics',
    'Core Mathematics',
    'English Language',
  ],
  '3 BUSINESS': [
    'Financial Accounting',
    'Business Management',
    'Economics',
    'Computer Science',
    'Core Mathematics',
    'English Language',
  ],
  '3 VISUAL ARTS': [
    'Art and Design Studio',
    'Art and Design Foundation',
    'Design Communication Technology',
    'Picture Making',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 1': [
    'Government',
    'Economics',
    'Geography',
    'Add Mathematics',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 2': [
    'Government',
    'Economics',
    'Nzema Language & Culture',
    'Geography',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 3': [
    'History',
    'Economics',
    'Business Management',
    'Music',
    'French',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 4': [
    'Economics',
    'Management in Living (M.I.L)',
    'Business Management',
    'Food and Nutrition',
    'Biology',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 5': [
    'Christian Religious Studies (CRS)',
    'History',
    'Economics',
    'Financial Accounting',
    'Core Mathematics',
    'English Language',
  ],
  '3 ARTS 6': [
    'Literature-in-English',
    'Music',
    'French',
    'Christian Religious Studies (CRS)',
    'Computing',
    'Core Mathematics',
    'English Language',
  ],
  '3 H/E 1': [
    'Management in Living (M.I.L)',
    'Clothing and Textiles',
    'Biology',
    'Business Management',
    'Core Mathematics',
    'English Language',
  ],
  '3 H/E 2': [
    'Management in Living (M.I.L)',
    'Food and Nutrition',
    'Biology',
    'French',
    'Core Mathematics',
    'English Language',
  ],
  '3 H/E 3': [
    'Management in Living (M.I.L)',
    'Clothing and Textiles',
    'Biology',
    'PEH',
    'Core Mathematics',
    'English Language',
  ],
  '3 H/E 4': [
    'Management in Living (M.I.L)',
    'Food and Nutrition',
    'Biology',
    'PEH',
    'Core Mathematics',
    'English Language',
  ],
};

export const CLASS_FORM_TEACHERS: Record<string, string> = {
  // Form 2
  '2 APPLIED TECH 1': 'Ing. Stephen Quarm',
  '2 APPLIED TECH 2': 'Mr. Isaac Mensah',
  '2 SCIENCE 1': 'Dr. Nana Tetteh',
  '2 SCIENCE 2': 'Mr. Michael Mensah',
  '2 AGRIC 1': 'Mr. Samuel K. Arthur',
  '2 AGRIC 2': 'Mr. Eric Donkor',
  '2 BUSINESS': 'Mr. Joseph Eshun',
  '2 VISUAL ARTS 1': 'Mr. Daniel Appiah',
  '2 VISUAL ARTS 2': 'Mr. Gabriel Kwofie',
  '2 ARTS 1': 'Mr. Bernard Asare',
  '2 ARTS 2': 'Mr. George Ndah',
  '2 ARTS 3': 'Mrs. Faustina Ackah',
  '2 ARTS 4': 'Ms. Rosemond Donkor',
  '2 ARTS 5': 'Rev. John Appiah',
  '2 ARTS 6': 'Mr. Kwadwo Amponsah',
  '2 H/E 1': 'Mrs. Janet Osei-Kofi',
  '2 H/E 2': 'Mrs. Mary Kwofie',
  '2 H/E 3': 'Ms. Rebecca Quayson',
  '2 H/E 4': 'Mrs. Comfort Blay',
  // Form 3
  '3 APPLIED TECH': 'Ing. Benjamin Tawiah',
  '3 SCIENCE 1': 'Dr. Nana Tetteh',
  '3 SCIENCE 2': 'Mr. Michael Mensah',
  '3 AGRIC': 'Mr. Samuel K. Arthur',
  '3 BUSINESS': 'Mr. Joseph Eshun',
  '3 VISUAL ARTS': 'Mr. Daniel Appiah',
  '3 ARTS 1': 'Mr. Bernard Asare',
  '3 ARTS 2': 'Mr. George Ndah',
  '3 ARTS 3': 'Mrs. Faustina Ackah',
  '3 ARTS 4': 'Ms. Rosemond Donkor',
  '3 ARTS 5': 'Rev. John Appiah',
  '3 ARTS 6': 'Mr. Kwadwo Amponsah',
  '3 H/E 1': 'Mrs. Janet Osei-Kofi',
  '3 H/E 2': 'Mrs. Mary Kwofie',
  '3 H/E 3': 'Ms. Rebecca Quayson',
  '3 H/E 4': 'Mrs. Comfort Blay',
};

export function calculateGrade(total: number): { grade: string; remark: string } {
  if (total <= 0) return { grade: '-', remark: 'Pending' };
  if (total >= 80) return { grade: 'A1', remark: 'Excellent' };
  if (total >= 75) return { grade: 'B2', remark: 'Very Good' };
  if (total >= 70) return { grade: 'B3', remark: 'Good' };
  if (total >= 65) return { grade: 'C4', remark: 'Credit' };
  if (total >= 60) return { grade: 'C5', remark: 'Credit' };
  if (total >= 55) return { grade: 'C6', remark: 'Credit' };
  if (total >= 50) return { grade: 'D7', remark: 'Pass' };
  if (total >= 45) return { grade: 'E8', remark: 'Pass' };
  return { grade: 'F9', remark: 'Fail' };
}

export function createEmptyScoreRecord() {
  return {
    individual_class_assessment: 0,
    mid_sem_exams: 0,
    portfolio_practical: 0,
    group_project: 0,
    supervised_ind_exams: 0,
    total: 0,
    grade: '-',
    remark: 'Pending Evaluation',
  };
}

export function getClassCode(className: string): string {
  const upper = className.trim().toUpperCase();
  // Form 2 classes
  if (upper.includes('APPLIED TECH 1')) return '2AT1';
  if (upper.includes('APPLIED TECH 2')) return '2AT2';
  if (upper.includes('VISUAL ARTS 1')) return '2VA1';
  if (upper.includes('VISUAL ARTS 2')) return '2VA2';
  if (upper.includes('AGRIC 1')) return '2AG1';
  if (upper.includes('AGRIC 2')) return '2AG2';
  if (upper.includes('BUSINESS') && upper.startsWith('2')) return '2BUS';
  if (upper.includes('SCIENCE 1') && upper.startsWith('2')) return '2SC1';
  if (upper.includes('SCIENCE 2') && upper.startsWith('2')) return '2SC2';
  for (let i = 1; i <= 6; i++) {
    if (upper.includes(`ARTS ${i}`) && upper.startsWith('2')) return `2AR${i}`;
  }
  for (let i = 1; i <= 4; i++) {
    if (upper.includes(`H/E ${i}`) && upper.startsWith('2')) return `2HE${i}`;
  }

  // Form 3 classes
  if (upper.includes('APPLIED TECH')) return '3APT';
  if (upper.includes('VISUAL ARTS') || upper.includes('VISUAL')) return '3VAR';
  if (upper.includes('AGRIC')) return '3AGR';
  if (upper.includes('BUSINESS')) return '3BUS';
  if (upper.includes('SCIENCE 1')) return '3SC1';
  if (upper.includes('SCIENCE 2')) return '3SC2';
  if (upper.includes('SCIENCE')) return '3SCI';
  for (let i = 1; i <= 6; i++) {
    if (upper.includes(`ARTS ${i}`)) return `3AR${i}`;
  }
  for (let i = 1; i <= 4; i++) {
    if (upper.includes(`H/E ${i}`)) return `3HE${i}`;
  }

  return upper.replace(/[^A-Z0-9]/g, '').slice(0, 5);
}

const STORAGE_KEY_ASSESSMENTS = 'nkas_all_assessment_sheets_clean_v1';

// Purge old demo storage keys to ensure clean start
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    ['nkas_all_assessment_sheets_v3', 'nkas_all_assessment_sheets_v2', 'nkas_all_assessment_sheets_v1'].forEach((k) => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
      }
    });
  } catch (err) {
    console.error('Storage purge error', err);
  }
}

export function getAllAssessmentSheets(): AssessmentSheet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored assessment sheets', err);
  }

  const sheets: AssessmentSheet[] = [];

  // 1. Process Form 2 classes with clean 0 (unseeded) scores
  const form2Map = form2DataJson as Record<string, { ns: number; name: string }[]>;
  for (const [className, studentList] of Object.entries(form2Map)) {
    const subjects = CLASS_SUBJECTS_MAP[className] || ['General Core Mathematics'];
    const defaultSubject = subjects[0];
    const formTeacher = CLASS_FORM_TEACHERS[className] || 'Form 2 Master';

    const records: AssessmentRecord[] = studentList.map((st) => {
      const code = getClassCode(className);
      const studentId = `NKAS/2025/${code}${String(st.ns).padStart(2, '0')}`;
      const emptyScores = createEmptyScoreRecord();

      return {
        ns: st.ns,
        student_name: st.name,
        student_id: studentId,
        position: st.ns,
        ...emptyScores,
      };
    });

    sheets.push({
      id: `F2-${className.replace(/\s+/g, '_')}-${defaultSubject.replace(/\s+/g, '_')}`,
      form_level: 'Form 2',
      class_name: className,
      subject: defaultSubject,
      semester: 'FIRST SEMESTER',
      academic_year: '2026/2027',
      month_year: 'NOV, 2026',
      form_teacher: formTeacher,
      subject_teacher: formTeacher,
      records,
      is_published: false,
    });
  }

  // 2. Process Form 3 classes with clean 0 (unseeded) scores
  const form3Map = form3DataJson as Record<string, { ns: number; name: string }[]>;
  for (const [className, studentList] of Object.entries(form3Map)) {
    const subjects = CLASS_SUBJECTS_MAP[className] || ['General Core Mathematics'];
    const defaultSubject = subjects[0];
    const formTeacher = CLASS_FORM_TEACHERS[className] || 'Form 3 Master';

    const records: AssessmentRecord[] = studentList.map((st) => {
      const code = getClassCode(className);
      const studentId = `NKAS/2024/${code}${String(st.ns).padStart(2, '0')}`;
      const emptyScores = createEmptyScoreRecord();

      return {
        ns: st.ns,
        student_name: st.name,
        student_id: studentId,
        position: st.ns,
        ...emptyScores,
      };
    });

    sheets.push({
      id: `F3-${className.replace(/\s+/g, '_')}-${defaultSubject.replace(/\s+/g, '_')}`,
      form_level: 'Form 3',
      class_name: className,
      subject: defaultSubject,
      semester: 'FIRST SEMESTER',
      academic_year: '2026/2027',
      month_year: 'NOV, 2026',
      form_teacher: formTeacher,
      subject_teacher: formTeacher,
      records,
      is_published: false,
    });
  }

  // Save clean sheets to storage
  try {
    localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(sheets));
  } catch (err) {
    console.error('Failed to save initialized clean assessment sheets', err);
  }

  return sheets;
}

export function saveAllAssessmentSheets(sheets: AssessmentSheet[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(sheets));
  } catch (err) {
    console.error('Failed to save assessment sheets', err);
  }
}

export function resetAllSheetsToZero(): AssessmentSheet[] {
  try {
    localStorage.removeItem(STORAGE_KEY_ASSESSMENTS);
  } catch (err) {
    console.error('Failed to reset assessment storage', err);
  }
  return getAllAssessmentSheets();
}

// Convert all Form 2 and Form 3 students into portal Student objects
export function getCompleteStudentsRoster(): Student[] {
  const roster: Student[] = [];
  let baseId = 2000;

  // Form 2
  const form2Map = form2DataJson as Record<string, { ns: number; name: string }[]>;
  for (const [className, list] of Object.entries(form2Map)) {
    const code = getClassCode(className);
    let programme = 'General Arts';
    let combSn = 11;

    if (className.includes('APPLIED TECH 1')) { programme = 'Applied Technology 1'; combSn = 1; }
    else if (className.includes('APPLIED TECH 2')) { programme = 'Applied Tech 2'; combSn = 2; }
    else if (className.includes('SCIENCE 1')) { programme = 'General Science 1'; combSn = 3; }
    else if (className.includes('SCIENCE 2')) { programme = 'General Science 2'; combSn = 4; }
    else if (className.includes('AGRIC 1')) { programme = 'Agriculture 1'; combSn = 8; }
    else if (className.includes('AGRIC 2')) { programme = 'Agriculture 2'; combSn = 9; }
    else if (className.includes('BUSINESS')) { programme = 'Business'; combSn = 5; }
    else if (className.includes('VISUAL ARTS 1')) { programme = 'Visual and Performing Arts 1'; combSn = 6; }
    else if (className.includes('VISUAL ARTS 2')) { programme = 'Visual and Performing Arts 2'; combSn = 7; }
    else if (className.includes('H/E 1')) { programme = 'Home Economics 1'; combSn = 17; }
    else if (className.includes('H/E 2')) { programme = 'Home Economics 2'; combSn = 18; }
    else if (className.includes('H/E 3')) { programme = 'Home Economics 3'; combSn = 19; }
    else if (className.includes('H/E 4')) { programme = 'Home Economics 4'; combSn = 20; }

    list.forEach((st) => {
      baseId++;
      const studentId = `NKAS/2025/${code}${String(st.ns).padStart(2, '0')}`;
      roster.push({
        id: baseId,
        student_id: studentId,
        full_name: st.name,
        class: 'Form 2',
        programme: `${className}`,
        combination_sn: combSn,
        gender: st.name.endsWith('A') || st.name.includes('MARY') || st.name.includes('ABIGAIL') || st.name.includes('GRACE') || st.name.includes('DEBORAH') ? 'Female' : 'Male',
        status: 'Active',
        created_at: '2024-09-12 08:30:00',
        date_of_birth: '2008-05-18',
        house: (st.ns % 4 === 1) ? 'Nkrumah House (House 1)' : (st.ns % 4 === 2) ? 'Yaa Asantewaa House (House 2)' : (st.ns % 4 === 3) ? 'Agric Pioneer House (House 3)' : 'Technical House (House 4)',
        email: `${st.name.toLowerCase().replace(/[^a-z]/g, '.')}@student.nkas.edu.gh`,
        hometown: 'Western Region',
      });
    });
  }

  // Form 3
  const form3Map = form3DataJson as Record<string, { ns: number; name: string }[]>;
  for (const [className, list] of Object.entries(form3Map)) {
    const code = getClassCode(className);
    let programme = 'General Arts';
    let combSn = 11;

    if (className.includes('APPLIED TECH')) { programme = 'Technical (Building & Construction)'; combSn = 1; }
    else if (className.includes('SCIENCE')) { programme = 'General Science'; combSn = 3; }
    else if (className.includes('AGRIC')) { programme = 'General Agriculture'; combSn = 8; }
    else if (className.includes('BUSINESS')) { programme = 'Business'; combSn = 5; }
    else if (className.includes('VISUAL')) { programme = 'Visual & Performing Arts'; combSn = 6; }
    else if (className.includes('H/E')) { programme = 'Home Economics'; combSn = 17; }

    list.forEach((st) => {
      baseId++;
      const studentId = `NKAS/2024/${code}${String(st.ns).padStart(2, '0')}`;
      roster.push({
        id: baseId,
        student_id: studentId,
        full_name: st.name,
        class: 'Form 3',
        programme: `${className}`,
        combination_sn: combSn,
        gender: st.name.endsWith('A') || st.name.includes('MARY') || st.name.includes('ABIGAIL') || st.name.includes('GRACE') ? 'Female' : 'Male',
        status: 'Active',
        created_at: '2023-09-15 08:00:00',
        date_of_birth: '2007-06-12',
        house: (st.ns % 4 === 1) ? 'Nkrumah House (House 1)' : (st.ns % 4 === 2) ? 'Yaa Asantewaa House (House 2)' : (st.ns % 4 === 3) ? 'Agric Pioneer House (House 3)' : 'Technical House (House 4)',
        email: `${st.name.toLowerCase().replace(/[^a-z]/g, '.')}@student.nkas.edu.gh`,
        hometown: 'Western Region',
      });
    });
  }

  return roster;
}
