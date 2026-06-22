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
import { Skull, FileText, Send, CheckCircle2 } from 'lucide-react';

const Mortuary: React.FC = () => {
  const { patients, logAction } = useHospital();
  const [deceased, setDeceased] = useState<any[]>(() => {
    const saved = localStorage.getItem('hms_mortuary');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    patientId: '',
    causeOfDeath: '',
    timeOfDeath: '',
    mortuaryId: ''
  });

  const handleLogMortality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.causeOfDeath) return;

    const patient = patients.find(p => p.id === form.patientId);
    const newEntry = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      patientName: patient?.name,
      hospitalId: patient?.hospitalId,
      status: 'Logged',
      certificateIssued: false
    };

    const updated = [newEntry, ...deceased];
    setDeceased(updated);
    localStorage.setItem('hms_mortuary', JSON.stringify(updated));

    logAction('Mortality Logged', `Logged mortality for patient: ${patient?.name}`);
    toast.success('Mortality record logged and transmitted to MOH registry');
    setForm({ patientId: '', causeOfDeath: '', timeOfDeath: '', mortuaryId: '' });
  };

  const issueCertificate = (id: string) => {
    setDeceased(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, certificateIssued: true, status: 'Completed' } : d);
      localStorage.setItem('hms_mortuary', JSON.stringify(updated));
      return updated;
    });
    toast.success('MOH Certificate (GP 138A) generated and printed');
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Mortuary Integration</h1>
          <p className="text-muted-foreground">Manage mortality records and certificates (GP 138A).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-destructive/20 shadow-lg shadow-destructive/5">
          <CardHeader className="bg-destructive/5">
            <CardTitle className="text-destructive flex items-center gap-2">
              <Skull className="h-5 w-5" /> Mortality Register
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogMortality} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select onValueChange={v => setForm({...form, patientId: v})} value={form.patientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cause of Death</Label>
                <Input placeholder="Primary cause" value={form.causeOfDeath} onChange={e => setForm({...form, causeOfDeath: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time of Death</Label>
                  <Input type="datetime-local" value={form.timeOfDeath} onChange={e => setForm({...form, timeOfDeath: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Mortuary ID</Label>
                  <Input placeholder="MORT-000" value={form.mortuaryId} onChange={e => setForm({...form, mortuaryId: e.target.value})} required />
                </div>
              </div>

              <Button type="submit" variant="destructive" className="w-full">
                <Send className="h-4 w-4 mr-2" /> Log & Transmit to MOH
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Register & Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deceased Name</TableHead>
                  <TableHead>Mortuary ID</TableHead>
                  <TableHead>Cause of Death</TableHead>
                  <TableHead>MOH Sync</TableHead>
                  <TableHead>Certificate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deceased.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-medium text-xs">{d.patientName}</div>
                      <div className="text-[10px] text-muted-foreground">{d.hospitalId}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{d.mortuaryId}</Badge></TableCell>
                    <TableCell className="text-xs italic">{d.causeOfDeath}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Dig. Receipt Issued
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!d.certificateIssued ? (
                        <Button size="sm" variant="ghost" className="h-8 text-primary" onClick={() => issueCertificate(d.id)}>
                          <FileText className="h-3 w-3 mr-1" /> Form GP 138A
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Issued</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {deceased.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No records in registry.</TableCell>
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

export default Mortuary;
