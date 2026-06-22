import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Ward, Bed, Vitals, Note, Investigation, Prescription, BillingItem, AuditLog } from '../types';
import { useAuth } from './AuthContext';

interface HospitalContextType {
  patients: Patient[];
  wards: Ward[];
  vitals: Vitals[];
  notes: Note[];
  investigations: Investigation[];
  prescriptions: Prescription[];
  billing: BillingItem[];
  auditLogs: AuditLog[];
  addPatient: (patient: Omit<Patient, 'id' | 'hospitalId'>) => void;
  admitPatient: (patientId: string, wardId: string, bedId: string, diagnosis: string) => void;
  addVitals: (vitals: Omit<Vitals, 'id' | 'timestamp' | 'recordedBy'>) => void;
  addNote: (note: Omit<Note, 'id' | 'timestamp' | 'author'>) => void;
  addInvestigation: (inv: Omit<Investigation, 'id' | 'orderDate' | 'status' | 'orderedBy'>) => void;
  updateInvestigation: (id: string, result: string) => void;
  addPrescription: (presc: Omit<Prescription, 'id' | 'startDate' | 'status' | 'prescribedBy'>) => void;
  dispensePrescription: (id: string) => void;
  addBilling: (item: Omit<BillingItem, 'id' | 'date'>) => void;
  logAction: (action: string, details?: string) => void;
  dischargePatient: (patientId: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hms_patients');
    return saved ? JSON.parse(saved) : [];
  });

  const [wards, setWards] = useState<Ward[]>(() => {
    const saved = localStorage.getItem('hms_wards');
    if (saved) return JSON.parse(saved);
    
    // Initial Seed Data
    const initialWards: Ward[] = [
      { id: 'w1', name: 'General Ward A', type: 'General', beds: Array.from({ length: 10 }, (_, i) => ({ id: `w1-b${i+1}`, wardId: 'w1', number: `${i+1}`, status: 'Available' })) },
      { id: 'w2', name: 'ICU', type: 'ICU', beds: Array.from({ length: 5 }, (_, i) => ({ id: `w2-b${i+1}`, wardId: 'w2', number: `ICU-${i+1}`, status: 'Available' })) },
      { id: 'w3', name: 'Pediatric', type: 'Pediatric', beds: Array.from({ length: 8 }, (_, i) => ({ id: `w3-b${i+1}`, wardId: 'w3', number: `P-${i+1}`, status: 'Available' })) },
    ];
    return initialWards;
  });

  const [vitals, setVitals] = useState<Vitals[]>(() => JSON.parse(localStorage.getItem('hms_vitals') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('hms_notes') || '[]'));
  const [investigations, setInvestigations] = useState<Investigation[]>(() => JSON.parse(localStorage.getItem('hms_investigations') || '[]'));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => JSON.parse(localStorage.getItem('hms_prescriptions') || '[]'));
  const [billing, setBilling] = useState<BillingItem[]>(() => JSON.parse(localStorage.getItem('hms_billing') || '[]'));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => JSON.parse(localStorage.getItem('hms_audit') || '[]'));

  useEffect(() => {
    localStorage.setItem('hms_patients', JSON.stringify(patients));
    localStorage.setItem('hms_wards', JSON.stringify(wards));
    localStorage.setItem('hms_vitals', JSON.stringify(vitals));
    localStorage.setItem('hms_notes', JSON.stringify(notes));
    localStorage.setItem('hms_investigations', JSON.stringify(investigations));
    localStorage.setItem('hms_prescriptions', JSON.stringify(prescriptions));
    localStorage.setItem('hms_billing', JSON.stringify(billing));
    localStorage.setItem('hms_audit', JSON.stringify(auditLogs));
  }, [patients, wards, vitals, notes, investigations, prescriptions, billing, auditLogs]);

  const logAction = (action: string, details?: string) => {
    if (!user) return;
    const log: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addPatient = (p: Omit<Patient, 'id' | 'hospitalId'>) => {
    const newPatient: Patient = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      hospitalId: `HOSP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Registered',
    };
    setPatients(prev => [...prev, newPatient]);
    logAction('Patient Registered', `Registered patient: ${newPatient.name}`);
  };

  const admitPatient = (patientId: string, wardId: string, bedId: string, diagnosis: string) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { 
      ...p, 
      status: 'Admitted', 
      currentWardId: wardId, 
      currentBedId: bedId, 
      admittingDiagnosis: diagnosis,
      admissionDate: new Date().toISOString()
    } : p));

    setWards(prev => prev.map(w => w.id === wardId ? {
      ...w,
      beds: w.beds.map(b => b.id === bedId ? { ...b, status: 'Occupied', patientId } : b)
    } : w));

    logAction('Patient Admitted', `Admitted patient ID: ${patientId} to Ward: ${wardId}, Bed: ${bedId}`);
  };

  const addVitals = (v: Omit<Vitals, 'id' | 'timestamp' | 'recordedBy'>) => {
    const newVitals: Vitals = {
      ...v,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      recordedBy: user?.name || 'System'
    };
    setVitals(prev => [newVitals, ...prev]);
  };

  const addNote = (n: Omit<Note, 'id' | 'timestamp' | 'author'>) => {
    const newNote: Note = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      author: user?.name || 'System'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const addInvestigation = (inv: Omit<Investigation, 'id' | 'orderDate' | 'status' | 'orderedBy'>) => {
    const newInv: Investigation = {
      ...inv,
      id: Math.random().toString(36).substr(2, 9),
      orderDate: new Date().toISOString(),
      status: 'Ordered',
      orderedBy: user?.name || 'System'
    };
    setInvestigations(prev => [newInv, ...prev]);
    logAction('Investigation Ordered', `${newInv.type} order: ${newInv.testName}`);
  };

  const updateInvestigation = (id: string, result: string) => {
    setInvestigations(prev => prev.map(inv => inv.id === id ? {
      ...inv,
      status: 'Completed',
      result,
      resultDate: new Date().toISOString()
    } : inv));
    logAction('Investigation Completed', `Result entered for investigation ID: ${id}`);
  };

  const addPrescription = (presc: Omit<Prescription, 'id' | 'startDate' | 'status' | 'prescribedBy'>) => {
    const newPresc: Prescription = {
      ...presc,
      id: Math.random().toString(36).substr(2, 9),
      startDate: new Date().toISOString(),
      status: 'Active',
      prescribedBy: user?.name || 'System'
    };
    setPrescriptions(prev => [newPresc, ...prev]);
    logAction('Prescription Added', `Prescribed: ${newPresc.medication}`);
  };

  const dispensePrescription = (id: string) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Dispensed',
      dispensedAt: new Date().toISOString()
    } : p));
    logAction('Medication Dispensed', `Dispensed prescription ID: ${id}`);
  };

  const addBilling = (item: Omit<BillingItem, 'id' | 'date'>) => {
    const newItem: BillingItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setBilling(prev => [...prev, newItem]);
  };

  const dischargePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: 'Discharged' } : p));
    
    if (patient.currentWardId && patient.currentBedId) {
      setWards(prev => prev.map(w => w.id === patient.currentWardId ? {
        ...w,
        beds: w.beds.map(b => b.id === patient.currentBedId ? { ...b, status: 'Available', patientId: undefined } : b)
      } : w));
    }
    
    logAction('Patient Discharged', `Discharged patient: ${patient.name}`);
  };

  return (
    <HospitalContext.Provider value={{ 
      patients, wards, vitals, notes, investigations, prescriptions, billing, auditLogs,
      addPatient, admitPatient, addVitals, addNote, addInvestigation, updateInvestigation,
      addPrescription, dispensePrescription, addBilling, logAction, dischargePatient
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
