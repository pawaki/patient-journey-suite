import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { FlaskConical, Microscope, FileText, CheckCircle } from 'lucide-react';

const Investigations: React.FC = () => {
  const { patients, investigations, addInvestigation, updateInvestigation, addBilling } = useHospital();
  
  const [order, setOrder] = useState({
    patientId: '',
    type: 'Lab' as 'Lab' | 'Radiology',
    testName: ''
  });

  const [resultInput, setResultInput] = useState<{ [key: string]: string }>({});

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order.patientId || !order.testName) return;

    addInvestigation(order);
    
    // Auto-bill for the test
    addBilling({
      patientId: order.patientId,
      description: `${order.type} Test: ${order.testName}`,
      amount: order.type === 'Lab' ? 1500 : 4500,
      category: 'Diagnostics'
    });

    toast.success('Investigation ordered and billed');
    setOrder({ ...order, testName: '' });
  };

  const handleComplete = (id: string, patientId: string) => {
    const result = resultInput[id];
    if (!result) {
      toast.error('Please enter findings');
      return;
    }

    updateInvestigation(id, result);
    toast.success('Results transmitted to consultation record');
    setResultInput(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const activeInpatients = patients.filter(p => p.status === 'Admitted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central Investigations Hub</h1>
        <p className="text-muted-foreground">Manage laboratory and radiology orders and results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Order New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select onValueChange={v => setOrder({...order, patientId: v})} value={order.patientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inpatient" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeInpatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select onValueChange={v => setOrder({...order, type: v as 'Lab' | 'Radiology'})} value={order.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab">Laboratory</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Test Name</Label>
                <Input 
                  placeholder={order.type === 'Lab' ? 'e.g., CBC, Urea' : 'e.g., Chest X-Ray'} 
                  value={order.testName}
                  onChange={e => setOrder({...order, testName: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Place Order</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investigation Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending ({investigations.filter(i => i.status === 'Ordered').length})</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Result Entry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investigations.filter(i => i.status === 'Ordered').map((inv) => {
                      const patient = patients.find(p => p.id === inv.patientId);
                      return (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <div className="font-medium text-xs">{patient?.name}</div>
                            <div className="text-[10px] text-muted-foreground">{patient?.hospitalId}</div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold">{inv.testName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {inv.type === 'Lab' ? <Microscope className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                              {inv.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Enter findings..." 
                                className="h-8 text-xs" 
                                value={resultInput[inv.id] || ''}
                                onChange={e => setResultInput({...resultInput, [inv.id]: e.target.value})}
                              />
                              <Button size="sm" className="h-8" onClick={() => handleComplete(inv.id, inv.patientId)}>
                                Submit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {investigations.filter(i => i.status === 'Ordered').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No pending orders.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="completed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Result / Findings</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investigations.filter(i => i.status === 'Completed').map((inv) => {
                      const patient = patients.find(p => p.id === inv.patientId);
                      return (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <div className="font-medium text-xs">{patient?.name}</div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold">{inv.testName}</TableCell>
                          <TableCell className="text-xs italic text-muted-foreground">"{inv.result}"</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Returned
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investigations;
