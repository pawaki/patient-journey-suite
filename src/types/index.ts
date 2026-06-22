export type Role = 'Director' | 'Doctor' | 'Nurse' | 'Technologist' | 'Finance';

export interface User {
  id: string;
  name: string;
  role: Role;
}

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
  status: 'Registered' | 'Admitted' | 'Discharged' | 'Deceased';
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

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: string;
}
