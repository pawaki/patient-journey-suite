import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { 
  FileText, 
  Microscope, 
  Pill, 
  History, 
  User, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

const Consultation: React.FC = () => {
  const { 
    patients, 
    vitals, 
    notes, 
    addNote, 
    addInvestigation, 
    addPrescription 
  } = useHospital();
  
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  const [labOrder, setLabOrder] = useState('');
  const [medOrder, setMedOrder] = useState({ medication: '', dosage: '', frequency: '', endDate: '' });

  const activePatients = patients.filter(p => p.status === 'Triaged' || p.status === 'Admitted');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientVitals = vitals.filter(v => v.patientId === selectedPatientId).slice(0, 1)[0];
  const patientNotes = notes.filter(n => n.patientId === selectedPatientId);

  const handleSaveNote = () => {
    if (!selectedPatientId || !noteContent) return;
    addNote({
      patientId: selectedPatientId,
      content: noteContent,
      type: 'Doctor'
    });
    setNoteContent('');
    toast.success('Clinical note saved');
  };

  const handleLabOrder = () => {
    if (!selectedPatientId || !labOrder) return;
    addInvestigation({
      patientId: selectedPatientId,
      type: 'Lab',
      testName: labOrder
    });
    setLabOrder('');
    toast.success('Laboratory investigation ordered');
  };

  const handlePrescribe = () => {
    if (!selectedPatientId || !medOrder.medication) return;
    addPrescription({
      patientId: selectedPatientId,
      ...medOrder
    });
    setMedOrder({ medication: '', dosage: '', frequency: '', endDate: '' });
    toast.success('Medication prescribed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Consultation</h1>
          <p className="text-muted-foreground">Review triaged patients and provide clinical care.</p>
        </div>
        <div className="w-72">
          <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient to consult" />
            </SelectTrigger>
            <SelectContent>
              {activePatients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPatient ? (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center"><User className="h-4 w-4 mr-2" /> Patient Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{selectedPatient.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Age/Sex</p>
                    <p className="text-sm">{selectedPatient.age}y / {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital ID</p>
                    <p className="text-sm font-mono">{selectedPatient.hospitalId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge>{selectedPatient.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center"><Activity className="h-4 w-4 mr-2" /> Latest Vitals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patientVitals ? (
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">BP:</span> <span className="font-bold">{patientVitals.bp}</span>
                    <span className="text-muted-foreground">Temp:</span> <span className="font-bold">{patientVitals.temp}°C</span>
                    <span className="text-muted-foreground">HR:</span> <span className="font-bold">{patientVitals.heartRate} bpm</span>
                    <span className="text-muted-foreground">SPO2:</span> <span className="font-bold">{patientVitals.oxygenSat}%</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No vitals recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="clinical">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clinical"><FileText className="h-4 w-4 mr-2" /> Clinical Notes</TabsTrigger>
                <TabsTrigger value="investigations"><Microscope className="h-4 w-4 mr-2" /> Investigations</TabsTrigger>
                <TabsTrigger value="pharmacy"><Pill className="h-4 w-4 mr-2" /> Pharmacy</TabsTrigger>
                <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> History</TabsTrigger>
              </TabsList>

              <TabsContent value="clinical" className="pt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Examination & Findings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Diagnosis / Impression</Label>
                      <Input 
                        placeholder="Search ICD-10/11 codes..." 
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor's Notes</Label>
                      <Textarea 
                        placeholder="Enter clinical findings, symptoms, and plan..." 
                        className="min-h-[200px]"
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSaveNote}>Save Clinical Entry</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investigations" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Lab & Radiology</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>Investigation Name</Label>
                        <Input 
                          placeholder="e.g., CBC, Chest X-Ray, LFT" 
                          value={labOrder}
                          onChange={e => setLabOrder(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleLabOrder} variant="outline"><ChevronRight className="h-4 w-4" /> Order</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pharmacy" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prescribe Medications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Medication</Label>
                        <Input value={medOrder.medication} onChange={e => setMedOrder({...medOrder, medication: e.target.value})} placeholder="e.g., Amoxicillin" />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input value={medOrder.dosage} onChange={e => setMedOrder({...medOrder, dosage: e.target.value})} placeholder="500mg" />
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input value={medOrder.frequency} onChange={e => setMedOrder({...medOrder, frequency: e.target.value})} placeholder="TDS" />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (End Date)</Label>
                        <Input type="date" value={medOrder.endDate} onChange={e => setMedOrder({...medOrder, endDate: e.target.value})} />
                      </div>
                    </div>
                    <Button onClick={handlePrescribe} className="w-full">Add to Prescription</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  {patientNotes.map(n => (
                    <Card key={n.id}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold">{n.author} ({n.type})</span>
                          <span className="text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{n.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {patientNotes.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No previous history found.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <Card className="py-20">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>Select a patient from the list above to start consultation</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Consultation;