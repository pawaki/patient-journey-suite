export type Role = 'Director' | 'Doctor' | 'Nurse' | 'Technologist' | 'Finance';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export type TriageLevel = 'P1 - Emergency' | 'P2 - Urgent' | 'P3 - Non-Urgent' | 'P4 - Routine';

export interface Patient {
  id: string;
  hospitalId: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  guardianName?: string;
  guardianPhone?: string;
  isChild: boolean;
  demographics: any;
  medicalHistory: string[];
  status: 'Registered' | 'Triaged' | 'Admitted' | 'Discharged' | 'Deceased';
  triageLevel?: TriageLevel;
  triageDate?: string;
  currentWardId?: string;
  currentBedId?: string;
  admittingDiagnosis?: string;
  admissionDate?: string;
}

export interface Bed {
  id: string;
  wardId: string;
  number: string;
  status: 'Available' | 'Occupied' | 'Reserved';
  patientId?: string;
}

export interface Ward {
  id: string;
  name: string;
  type: 'General' | 'ICU' | 'Maternity' | 'Pediatric' | 'Surgical';
  beds: Bed[];
}

export interface Vitals {
  id: string;
  patientId: string;
  timestamp: string;
  bp: string;
  temp: number;
  heartRate: number;
  respRate: number;
  oxygenSat: number;
  recordedBy: string;
  isFlagged: boolean;
}

export interface Note {
  id: string;
  patientId: string;
  timestamp: string;
  content: string;
  author: string;
  type: 'Nurse' | 'Doctor';
  formType?: string; // e.g., MOH 302
}

export interface Investigation {
  id: string;
  patientId: string;
  type: 'Lab' | 'Radiology';
  orderDate: string;
  testName: string;
  status: 'Ordered' | 'In Progress' | 'Completed';
  result?: string;
  resultDate?: string;
  orderedBy: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  status: 'Active' | 'Dispensed' | 'Completed' | 'Cancelled';
  dispensedAt?: string;
}

export interface BillingItem {
  id: string;
  patientId: string;
  description: string;
  amount: number;
  date: string;
  category: string; // From Chart of Accounts
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string; // e.g., '2024-Q1' or '2024-05'
  actual: number;
}

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  method: 'Cash' | 'Insurance' | 'Mobile Money';
  date: string;
  reference?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: string;
}
