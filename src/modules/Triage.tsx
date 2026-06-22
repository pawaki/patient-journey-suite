import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Stethoscope, Activity, Thermometer, Droplets, HeartPulse } from 'lucide-react';
import { TriageLevel } from '../types';

const Triage: React.FC = () => {
  const { patients, addTriage } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [triageLevel, setTriageLevel] = useState<TriageLevel>('P3 - Non-Urgent');
  const [vitals, setVitals] = useState({
    bp: '',
    temp: 36.5,
    heartRate: 75,
    respRate: 18,
    oxygenSat: 98
  });

  const registeredPatients = patients.filter(p => p.status === 'Registered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }

    addTriage(selectedPatientId, triageLevel, {
      ...vitals,
      patientId: selectedPatientId
    });

    toast.success('Triage completed successfully');
    setSelectedPatientId('');
    setVitals({
      bp: '',
      temp: 36.5,
      heartRate: 75,
      respRate: 18,
      oxygenSat: 98
    });
  };

  const getPriorityColor = (level: TriageLevel) => {
    if (level.startsWith('P1')) return 'bg-red-500 text-white';
    if (level.startsWith('P2')) return 'bg-orange-500 text-white';
    if (level.startsWith('P3')) return 'bg-yellow-500 text-black';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Triage & Vital Signs</h1>
        <p className="text-muted-foreground">Capture vitals and prioritize patient care.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Record Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {registeredPatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select onValueChange={(v) => setTriageLevel(v as TriageLevel)} value={triageLevel}>
                  <SelectTrigger className={getPriorityColor(triageLevel)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1 - Emergency">P1 - Emergency (Immediate)</SelectItem>
                    <SelectItem value="P2 - Urgent">P2 - Urgent (within 15 mins)</SelectItem>
                    <SelectItem value="P3 - Non-Urgent">P3 - Non-Urgent (within 60 mins)</SelectItem>
                    <SelectItem value="P4 - Routine">P4 - Routine (Stable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center"><HeartPulse className="h-3 w-3 mr-1" /> BP (mmHg)</Label>
                  <Input placeholder="120/80" value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center"><Thermometer className="h-3 w-3 mr-1" /> Temp (°C)</Label>
                  <Input type="number" step="0.1" value={vitals.temp} onChange={e => setVitals({...vitals, temp: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center"><Activity className="h-3 w-3 mr-1" /> Heart Rate</Label>
                  <Input type="number" value={vitals.heartRate} onChange={e => setVitals({...vitals, heartRate: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center"><Activity className="h-3 w-3 mr-1" /> Resp Rate</Label>
                  <Input type="number" value={vitals.respRate} onChange={e => setVitals({...vitals, respRate: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="flex items-center"><Droplets className="h-3 w-3 mr-1" /> SPO2 (%)</Label>
                  <Input type="number" value={vitals.oxygenSat} onChange={e => setVitals({...vitals, oxygenSat: Number(e.target.value)})} required />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Stethoscope className="h-4 w-4 mr-2" />
                Complete Triage
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Triage Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Temp/BP</TableHead>
                  <TableHead>SPO2</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.filter(p => p.status === 'Triaged').slice().reverse().map((patient) => {
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">{patient.hospitalId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(patient.triageLevel as TriageLevel)}>
                          {patient.triageLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {patient.triageDate ? new Date(patient.triageDate).toLocaleTimeString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {patients.filter(p => p.status === 'Triaged').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No triaged patients in queue.</TableCell>
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

export default Triage;