export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'admin' | 'student' | 'teacher';
  created_at: string;
}

export interface SubjectCombination {
  sn: number;
  course: string;
  category: 'Applied Technology' | 'General Science' | 'Business' | 'Visual & Performing Arts' | 'Agriculture' | 'General Arts' | 'Home Economics';
  core_subjects: string[];
  elective_subjects: string[];
  notes?: string;
}

export interface Student {
  id: number;
  student_id: string;
  full_name: string;
  class: string;
  programme: string;
  combination_sn?: number;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Suspended' | 'Alumni';
  created_at: string;
  date_of_birth?: string;
  house?: string;
  guardian_name?: string;
  guardian_phone?: string;
  email?: string;
  hometown?: string;
  ghana_card_pin?: string;
  blood_group?: string;
}

export interface Fee {
  id: number;
  student_id: string;
  amount: number;
  description: string;
  status: 'Paid' | 'Pending' | 'Partially Paid';
  recorded_by: string;
  created_at: string;
  receipt_no?: string;
  term: string;
  payment_method?: 'Mobile Money' | 'Bank Deposit' | 'Cash Receipt';
}

export interface SubjectResult {
  code: string;
  name: string;
  class_score: number; // out of 30 or 40
  exam_score: number;  // out of 70 or 60
  total: number;
  grade: string;
  remark: string;
}

export interface ExamResult {
  id: number;
  student_id: string;
  term: string;
  academic_year: string;
  class_name: string;
  subjects: SubjectResult[];
  attendance: string;
  conduct: string;
  attitude: string;
  class_teacher_remarks: string;
  headmaster_remarks: string;
  date_issued: string;
  aggregate: number;
  position: string;
  next_term_begins: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface StaffMember {
  id: number;
  staff_id: string;
  name: string;
  role: string;
  department: string;
  subjects: string[];
  phone: string;
  email: string;
}

export interface AssessmentRecord {
  ns: number;
  student_name: string;
  student_id: string;
  individual_class_assessment: number; // Max 15
  mid_sem_exams: number;               // Max 15
  portfolio_practical: number;         // Max 10
  group_project: number;               // Max 20
  supervised_ind_exams: number;        // Max 40
  total: number;                       // Max 100
  grade: string;
  remark: string;
  position?: number;
}

export interface AssessmentSheet {
  id: string;
  form_level: 'Form 2' | 'Form 3';
  class_name: string;
  subject: string;
  semester: string;
  academic_year: string;
  month_year: string;
  form_teacher: string;
  subject_teacher?: string;
  records: AssessmentRecord[];
  is_published?: boolean;
}

export type Form3AssessmentSheet = AssessmentSheet;

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Assessment' | 'Fee / Bursary' | 'Student SIS' | 'Promotion' | 'Staff' | 'Broadcast' | 'System';
  details: string;
  ip_address?: string;
  status: 'Success' | 'Warning' | 'Notice';
}

export interface BroadcastMessage {
  id: string;
  title: string;
  sender_id: string;
  target_audience: 'All Students & Parents' | 'Form 3 Finalists Only' | 'Form 2 Students Only' | 'Boarding Students' | 'Debtors / Fee Defaulters' | 'Teaching Staff';
  channel: 'SMS Gateway' | 'Student Portal Notice' | 'PTA Executive Broadcast';
  message: string;
  sent_at: string;
  recipient_count: number;
  status: 'Delivered' | 'Queued' | 'Failed';
}

export interface PromotionRecord {
  id: string;
  timestamp: string;
  source_class: string;
  target_class: string;
  promoted_count: number;
  repeated_count: number;
  promoted_by: string;
  academic_session: string;
}

