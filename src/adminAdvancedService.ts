import {
  Student,
  AssessmentSheet,
  AuditLogEntry,
  BroadcastMessage,
  PromotionRecord,
} from './types';

const STORAGE_KEYS = {
  AUDIT_LOGS: 'nkas_audit_logs_v1',
  BROADCASTS: 'nkas_broadcast_messages_v1',
  PROMOTIONS: 'nkas_promotion_history_v1',
};

// Seed audit logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-11-03 08:15:22',
    user: 'Administrator (Dr. Kwabena Nkansah)',
    action: 'Continuous Assessment Sheets Published',
    category: 'Assessment',
    details: 'Verified and locked First Term 2026/27 assessment scores for 35 classes (1,330 candidates).',
    ip_address: '197.251.130.45',
    status: 'Success',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-11-02 14:30:10',
    user: 'Bursary Desk (Mrs. Evelyn Kwofie)',
    action: 'Fee Payment Receipt Issued',
    category: 'Fee / Bursary',
    details: 'Issued official security receipt RCP-2026-9104 (GHS 150.00) for student Kwesi Mensah.',
    ip_address: '197.251.130.48',
    status: 'Success',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-11-01 10:05:44',
    user: 'Academic Board',
    action: 'Curriculum Policy Enforced',
    category: 'System',
    details: 'Mandatory STEM flag applied: SHS 2 ROBOTICS AND CODING ARE MANDATORY for all Form 2 streams.',
    ip_address: '10.0.4.12',
    status: 'Notice',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-10-28 16:20:00',
    user: 'Administrator',
    action: 'Batch Student Promotion Verified',
    category: 'Promotion',
    details: 'Ran Form 2 to Form 3 academic progression check; 712 candidates flagged as qualified.',
    ip_address: '197.251.130.45',
    status: 'Success',
  },
  {
    id: 'LOG-005',
    timestamp: '2026-10-25 11:45:12',
    user: 'SMS Gateway Dispatcher',
    action: 'Broadcast Notice Dispatched',
    category: 'Broadcast',
    details: 'Dispatched emergency PTA Executive Board meeting notice to 1,330 parent contacts via SMS.',
    ip_address: '10.0.1.8',
    status: 'Success',
  },
];

// Seed broadcasts
const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'BC-2026-001',
    title: 'First Term Academic Mid-Semester Assessment Notice',
    sender_id: 'NKAS-ADMIN',
    target_audience: 'All Students & Parents',
    channel: 'SMS Gateway',
    message: 'Dear Parent/Guardian, First Term continuous assessment marks for all Form 2 & Form 3 candidates are now uploaded. Please check student portal for report cards.',
    sent_at: '2026-11-01 09:30:00',
    recipient_count: 1330,
    status: 'Delivered',
  },
  {
    id: 'BC-2026-002',
    title: 'Mandatory SHS 2 Robotics & Coding Practical Kits',
    sender_id: 'NKAS-STEM',
    target_audience: 'Form 2 Students Only',
    channel: 'Student Portal Notice',
    message: 'All Form 2 students in Applied Tech, Science, Agric, Arts, Business & Home Econ are reminded that Robotics & Coding practicals hold at the new STEM Innovation Center.',
    sent_at: '2026-10-28 14:15:00',
    recipient_count: 726,
    status: 'Delivered',
  },
  {
    id: 'BC-2026-003',
    title: 'WASSCE 2027 Registration & Index Verification',
    sender_id: 'NKAS-WASSCE',
    target_audience: 'Form 3 Finalists Only',
    channel: 'SMS Gateway',
    message: 'Notice to all Form 3 finalists: Biodata and subject combination verification for WASSCE closes this Friday. Ensure passport photographs meet WAEC standards.',
    sent_at: '2026-10-20 11:00:00',
    recipient_count: 604,
    status: 'Delivered',
  },
  {
    id: 'BC-2026-004',
    title: 'PTA Development Levy & Boarding House Dues Reminder',
    sender_id: 'NKAS-BURSAR',
    target_audience: 'Debtors / Fee Defaulters',
    channel: 'SMS Gateway',
    message: 'Dear Guardian, you have an outstanding PTA development levy balance for this term. Prompt payment at the Bursar desk or via official MoMo code is required.',
    sent_at: '2026-10-15 16:00:00',
    recipient_count: 184,
    status: 'Delivered',
  },
];

// Seed promotion history
const INITIAL_PROMOTIONS: PromotionRecord[] = [
  {
    id: 'PR-2025-01',
    timestamp: '2025-10-15 14:00:00',
    source_class: 'Form 2 (2024/2025 Cohort)',
    target_class: 'Form 3 (2025/2026 Cohort)',
    promoted_count: 598,
    repeated_count: 14,
    promoted_by: 'Academic Board & Headmaster',
    academic_session: '2024/2025 &rarr; 2025/2026',
  },
];

// Helper to get grade points for GES aggregate (1=A1, 2=B2, 3=B3, 4=C4, 5=C5, 6=C6, 7=D7, 8=E8, 9=F9)
export function getGradePoint(grade: string): number {
  switch (grade) {
    case 'A1': return 1;
    case 'B2': return 2;
    case 'B3': return 3;
    case 'C4': return 4;
    case 'C5': return 5;
    case 'C6': return 6;
    case 'D7': return 7;
    case 'E8': return 8;
    case 'F9': return 9;
    default: return 9;
  }
}


// Audit Logs
export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveStoredAuditLogs(logs: AuditLogEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  const current = getStoredAuditLogs();
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  const newLog: AuditLogEntry = {
    ...entry,
    id: `LOG-${Date.now().toString().slice(-5)}`,
    timestamp,
  };

  const updated = [newLog, ...current];
  saveStoredAuditLogs(updated);
}

// Broadcasts
export function getStoredBroadcasts(): BroadcastMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
    return raw ? JSON.parse(raw) : INITIAL_BROADCASTS;
  } catch {
    return INITIAL_BROADCASTS;
  }
}

export function saveStoredBroadcasts(broadcasts: BroadcastMessage[]): void {
  localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(broadcasts));
}

export function sendBroadcastMessage(
  msg: Omit<BroadcastMessage, 'id' | 'sent_at'>
): BroadcastMessage {
  const current = getStoredBroadcasts();
  const now = new Date();
  const sent_at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newBroadcast: BroadcastMessage = {
    ...msg,
    id: `BC-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    sent_at,
  };

  const updated = [newBroadcast, ...current];
  saveStoredBroadcasts(updated);

  addAuditLog({
    user: 'Administrator',
    action: `SMS/Notice Broadcast Dispatched: ${newBroadcast.title}`,
    category: 'Broadcast',
    details: `Dispatched to ${newBroadcast.target_audience} (${newBroadcast.recipient_count} recipients) via ${newBroadcast.channel}.`,
    status: 'Success',
  });

  return newBroadcast;
}

// Promotions
export function getStoredPromotionRecords(): PromotionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    return raw ? JSON.parse(raw) : INITIAL_PROMOTIONS;
  } catch {
    return INITIAL_PROMOTIONS;
  }
}

export function saveStoredPromotionRecords(records: PromotionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(records));
}

// Helper: Ensure deterministic Ghana Card & Blood Group
export function enrichStudentProfile(student: Student): Student {
  const houses = [
    'Nkrumah House (House 1 - Yellow)',
    'Yaa Asantewaa House (House 2 - Blue)',
    'Agric Pioneer House (House 3 - Green)',
    'Aggrey House (House 4 - Red)',
  ];
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-'];

  const numericId = parseInt(student.student_id.replace(/\D/g, '')) || student.id || 1;
  const house = student.house || houses[numericId % houses.length];
  const blood_group = student.blood_group || bloodGroups[numericId % bloodGroups.length];
  const ghana_card_pin =
    student.ghana_card_pin ||
    `GHA-${String(700000000 + (numericId * 987) % 200000000)}-${numericId % 9}`;

  return {
    ...student,
    house,
    blood_group,
    ghana_card_pin,
  };
}
