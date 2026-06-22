import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const Admission: React.FC = () => {
  const { patients, wards, admitPatient } = useHospital();
  
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const registeredPatients = patients.filter(p => p.status === 'Registered');
  const selectedWard = wards.find(w => w.id === selectedWardId);
  const availableBeds = selectedWard?.beds.filter(b => b.status === 'Available') || [];

  const handleAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedWardId || !selectedBedId) {
      toast.error('Please fill all admission details');
      return;
    }

    admitPatient(selectedPatientId, selectedWardId, selectedBedId, diagnosis);
    toast.success('Patient Admitted Successfully');
    setSelectedPatientId('');
    setSelectedWardId('');
    setSelectedBedId('');
    setDiagnosis('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admission & Bed Allocation</h1>
        <p className="text-muted-foreground">Manage inpatient admissions and ward assignments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Admit Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdmission} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select registered patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {registeredPatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ward</Label>
                <Select onValueChange={setSelectedWardId} value={selectedWardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name} ({w.type})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bed</Label>
                <Select onValueChange={setSelectedBedId} value={selectedBedId} disabled={!selectedWardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBeds.map(b => (
                      <SelectItem key={b.id} value={b.id}>Bed {b.number}</SelectItem>
                    ))}
                    {availableBeds.length === 0 && selectedWardId && (
                      <SelectItem value="none" disabled>No beds available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admitting Diagnosis (ICD-10/11)</Label>
                <Input 
                  placeholder="e.g., J18.9 Pneumonia" 
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Confirm Admission</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Inpatients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Ward / Bed</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Admission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.filter(p => p.status === 'Admitted').map((patient) => {
                  const ward = wards.find(w => w.id === patient.currentWardId);
                  const bed = ward?.beds.find(b => b.id === patient.currentBedId);
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">{patient.hospitalId}</div>
                      </TableCell>
                      <TableCell>
                        <div>{ward?.name}</div>
                        <Badge variant="outline">Bed {bed?.number}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{patient.admittingDiagnosis}</TableCell>
                      <TableCell className="text-xs">
                        {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {patients.filter(p => p.status === 'Admitted').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No admitted patients.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admission;
