import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Activity, Bed, Thermometer, Heart, Wind, Droplets, ClipboardList, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Patient, Vitals } from '../types';

const WardManagement: React.FC = () => {
  const { wards, patients, vitals, notes, prescriptions, billing, addVitals, addNote, dischargePatient } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [vitalForm, setVitalForm] = useState({
    bp: '',
    temp: 36.5,
    heartRate: 75,
    respRate: 18,
    oxygenSat: 98
  });

  const [noteContent, setNoteContent] = useState('');

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const isFlagged = vitalForm.temp > 38 || vitalForm.oxygenSat < 94 || vitalForm.heartRate > 120;
    
    addVitals({
      patientId: selectedPatient.id,
      ...vitalForm,
      isFlagged
    });

    if (isFlagged) {
      toast.warning('Abnormal vitals flagged!');
    } else {
      toast.success('Vitals recorded');
    }

    setVitalForm({ bp: '', temp: 36.5, heartRate: 75, respRate: 18, oxygenSat: 98 });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !noteContent) return;

    addNote({
      patientId: selectedPatient.id,
      content: noteContent,
      type: 'Nurse', // Simulating nurse view
      formType: 'MOH 302'
    });

    toast.success('Clinical note added');
    setNoteContent('');
  };

  const handleDischarge = () => {
    if (!selectedPatient) return;
    
    const pendingMeds = prescriptions.filter(p => p.patientId === selectedPatient.id && p.status === 'Active');
    if (pendingMeds.length > 0) {
      toast.error('Pharmacy reconciliation required: ' + pendingMeds.length + ' pending meds');
      return;
    }

    dischargePatient(selectedPatient.id);
    toast.success('Patient Discharged Successfully (MOH 102 Generated)');
    setSelectedPatient(null);
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Census Board</h1>
          <p className="text-muted-foreground">Monitor ward occupancy and patient vitals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Census Board */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ward Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {wards.map(ward => (
                  <div key={ward.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{ward.name}</h3>
                      <Badge variant="outline">{ward.type}</Badge>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {ward.beds.map(bed => {
                        const patient = patients.find(p => p.id === bed.patientId);
                        const isSelected = selectedPatient?.id === patient?.id;
                        return (
                          <div 
                            key={bed.id}
                            onClick={() => patient && setSelectedPatient(patient)}
                            className={cn(
                              "relative h-20 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all",
                              bed.status === 'Available' ? "border-dashed border-muted bg-muted/20" : 
                              isSelected ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2" : "border-primary/40 bg-card hover:border-primary",
                            )}
                          >
                            <Bed className={cn("h-5 w-5 mb-1", bed.status === 'Available' ? "text-muted-foreground" : "text-primary")} />
                            <span className="text-[10px] font-bold">BED {bed.number}</span>
                            {patient && (
                              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Clinical View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient ? (
            <>
              <Card className="border-primary">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.hospitalId} • {selectedPatient.gender} • {selectedPatient.age}y
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>Close</Button>
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    <Badge variant="secondary">Admitting: {selectedPatient.admittingDiagnosis}</Badge>
                    <Badge variant="outline">Ward: {wards.find(w => w.id === selectedPatient.currentWardId)?.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="vitals">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="vitals">Vitals (MOH 214)</TabsTrigger>
                      <TabsTrigger value="notes">Clinical Records</TabsTrigger>
                      <TabsTrigger value="discharge">Discharge (MOH 102)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="vitals" className="space-y-6 pt-4">
                      <form onSubmit={handleAddVitals} className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
                        <div className="space-y-2">
                          <Label>BP (mmHg)</Label>
                          <Input placeholder="120/80" value={vitalForm.bp} onChange={e => setVitalForm({...vitalForm, bp: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Temp (°C)</Label>
                          <Input type="number" step="0.1" value={vitalForm.temp} onChange={e => setVitalForm({...vitalForm, temp: parseFloat(e.target.value)})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Heart Rate (bpm)</Label>
                          <Input type="number" value={vitalForm.heartRate} onChange={e => setVitalForm({...vitalForm, heartRate: parseInt(e.target.value)})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>SpO2 (%)</Label>
                          <Input type="number" value={vitalForm.oxygenSat} onChange={e => setVitalForm({...vitalForm, oxygenSat: parseInt(e.target.value)})} required />
                        </div>
                        <Button type="submit" className="col-span-2 mt-2">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Record Vitals
                        </Button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Recent Readings</h4>
                        <ScrollArea className="h-40">
                          <div className="space-y-2">
                            {vitals.filter(v => v.patientId === selectedPatient.id).map(v => (
                              <div key={v.id} className={cn(
                                "p-3 rounded-lg text-xs flex justify-between items-center border",
                                v.isFlagged ? "bg-destructive/10 border-destructive text-destructive" : "bg-card border-border"
                              )}>
                                <div className="grid grid-cols-4 gap-4 flex-1">
                                  <div className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {v.bp}</div>
                                  <div className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {v.temp}°C</div>
                                  <div className="flex items-center gap-1"><Heart className="h-3 w-3" /> {v.heartRate}</div>
                                  <div className="flex items-center gap-1"><Wind className="h-3 w-3" /> {v.oxygenSat}%</div>
                                </div>
                                <span className="text-[10px] opacity-70 ml-2">
                                  {new Date(v.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4 pt-4">
                      <form onSubmit={handleAddNote} className="space-y-3">
                        <Label>New Note (MOH 302)</Label>
                        <Textarea 
                          placeholder="Record daily progress or observations..." 
                          value={noteContent}
                          onChange={e => setNoteContent(e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                        <Button type="submit" className="w-full">Save Note</Button>
                      </form>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Notes History</h4>
                        <ScrollArea className="h-48">
                          <div className="space-y-3">
                            {notes.filter(n => n.patientId === selectedPatient.id).map(n => (
                              <div key={n.id} className="p-3 bg-muted/40 rounded-lg text-sm border">
                                <div className="flex justify-between mb-1">
                                  <span className="font-bold text-xs">{n.author}</span>
                                  <span className="text-[10px] text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-xs leading-relaxed">{n.content}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="discharge" className="space-y-6 pt-4">
                      <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" /> Pre-Discharge Checklist
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm p-2 border-b">
                            <span>Billing Clearance</span>
                            <Badge className="bg-green-100 text-green-700">PAID / CLEARED</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm p-2 border-b">
                            <span>Pharmacy Reconciliation</span>
                            {prescriptions.filter(p => p.patientId === selectedPatient.id && p.status === 'Active').length === 0 ? (
                              <Badge className="bg-green-100 text-green-700">ALL DISPENSED</Badge>
                            ) : (
                              <Badge variant="destructive">PENDING MEDS</Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center text-sm p-2">
                            <span>MOH Form 102 Preparation</span>
                            <Badge variant="outline">READY</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Final Summary / Referral Info</Label>
                        <Textarea placeholder="Condition on discharge, follow-up instructions..." />
                      </div>

                      <Button className="w-full h-12 text-lg" variant="default" onClick={handleDischarge}>
                        Generate Summary & Discharge
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border-2 border-dashed p-12 text-center">
              <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No Patient Selected</h3>
              <p className="max-w-xs mt-2">Select a patient from the Live Census Board to record vitals or view progress notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardManagement;
