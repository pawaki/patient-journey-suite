import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { 
  LogOut, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const Discharge: React.FC = () => {
  const { patients, billing, dischargePatient } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const inpatients = patients.filter(p => p.status === 'Admitted');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  const patientBills = billing.filter(b => b.patientId === selectedPatientId);
  const totalBill = patientBills.reduce((acc, b) => acc + b.amount, 0);

  const handleDischarge = () => {
    if (!selectedPatientId) return;
    dischargePatient(selectedPatientId);
    toast.success('Patient discharged successfully');
    setSelectedPatientId('');
  };

  const handlePrintMOH = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discharge Management</h1>
        <p className="text-muted-foreground">Finalize patient treatment and complete clearance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Clearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inpatient" />
                </SelectTrigger>
                <SelectContent>
                  {inpatients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Bill:</span>
                  <span className="font-bold">KES {totalBill.toLocaleString()}</span>
                </div>
                
                <div className="p-3 rounded-lg bg-muted space-y-2">
                  <div className="flex items-center text-xs">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                    <span>Clinical Clearance: COMPLETED</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <AlertCircle className="h-3 w-3 text-yellow-500 mr-2" />
                    <span>Financial Clearance: PENDING PAYMENT</span>
                  </div>
                </div>

                <Button onClick={handleDischarge} className="w-full" variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Final Discharge
                </Button>

                <Button onClick={handlePrintMOH} className="w-full" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print MOH Form 102
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Discharges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.filter(p => p.status === 'Discharged').slice().reverse().map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="font-mono">{patient.hospitalId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost"><FileCheck className="h-4 w-4 mr-2" /> Summary</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.filter(p => p.status === 'Discharged').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No recent discharges.</TableCell>
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

export default Discharge;