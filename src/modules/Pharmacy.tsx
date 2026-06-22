import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Pill, Search, Clock, CheckCircle2 } from 'lucide-react';

const Pharmacy: React.FC = () => {
  const { patients, prescriptions, addPrescription, dispensePrescription, addBilling } = useHospital();
  
  const [form, setForm] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    endDate: ''
  });

  const handlePrescribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.medication) return;

    addPrescription(form);
    toast.success('Prescription recorded');
    setForm({
      patientId: '',
      medication: '',
      dosage: '',
      frequency: '',
      endDate: ''
    });
  };

  const handleDispense = (pId: string, medication: string, id: string) => {
    dispensePrescription(id);
    
    // Auto-bill for medication
    addBilling({
      patientId: pId,
      description: `Medication: ${medication}`,
      amount: 450,
      category: 'Pharmacy'
    });

    toast.success(`${medication} dispensed and billed`);
  };

  const activeInpatients = patients.filter(p => p.status === 'Admitted');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Management</h1>
          <p className="text-muted-foreground">Handle prescriptions and medication dispensing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Write Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePrescribe} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select onValueChange={v => setForm({...form, patientId: v})} value={form.patientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeInpatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Medication</Label>
                <Input 
                  placeholder="e.g., Amoxicillin" 
                  value={form.medication}
                  onChange={e => setForm({...form, medication: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input placeholder="500mg" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Input placeholder="TDS" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required />
              </div>

              <Button type="submit" className="w-full">
                <Pill className="h-4 w-4 mr-2" />
                Prescribe
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Dispensing Queue</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search patient..." className="pl-8 h-9 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage/Freq</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((p) => {
                  const patient = patients.find(pat => pat.id === p.patientId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium text-xs">{patient?.name}</div>
                        <div className="text-[10px] text-muted-foreground">{patient?.hospitalId}</div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold">{p.medication}</TableCell>
                      <TableCell className="text-[10px]">{p.dosage} — {p.frequency}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'Active' ? 'secondary' : 'default'} className="text-[10px]">
                          {p.status === 'Active' ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.status === 'Active' && (
                          <Button size="sm" variant="outline" className="h-8" onClick={() => handleDispense(p.patientId, p.medication, p.id)}>
                            Dispense
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {prescriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No prescriptions recorded.</TableCell>
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

export default Pharmacy;
