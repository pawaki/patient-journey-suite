import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, TrendingUp, Search, Filter, ArrowUpRight, ArrowDownRight, Printer, Edit, CreditCard, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const Finance: React.FC = () => {
  const { billing, patients, budgets, setBudget, payments, addPayment } = useHospital();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<{ category: string, amount: number, period: string } | null>(null);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Insurance' | 'Mobile Money'>('Cash');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientBills = billing.filter(b => b.patientId === selectedPatientId);
  const patientPayments = payments.filter(p => p.patientId === selectedPatientId);
  const totalBilled = patientBills.reduce((acc, b) => acc + b.amount, 0);
  const totalPaid = patientPayments.reduce((acc, p) => acc + p.amount, 0);
  const balance = totalBilled - totalPaid;

  const handleRecordPayment = () => {
    if (!selectedPatientId || paymentAmount <= 0) {
      toast.error('Please select a patient and enter a valid amount');
      return;
    }
    addPayment({
      patientId: selectedPatientId,
      amount: paymentAmount,
      method: paymentMethod
    });
    toast.success('Payment recorded successfully');
    setPaymentAmount(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditBudget = (category: string, amount: number, period: string) => {
    setEditingBudget({ category, amount, period });
    setIsEditDialogOpen(true);
  };

  const saveBudget = () => {
    if (editingBudget) {
      setBudget(editingBudget.category, editingBudget.amount, editingBudget.period);
      setIsEditDialogOpen(false);
      toast.success(`Budget updated for ${editingBudget.category}`);
    }
  };

  const totalRevenue = billing.reduce((acc, item) => acc + item.amount, 0);
  
  const revenueByCategory = billing.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.keys(revenueByCategory).map(key => ({
    name: key,
    amount: revenueByCategory[key]
  }));

  const budgetActualData = budgets.map(b => {
    const actual = billing
      .filter(item => item.category === b.category)
      .reduce((sum, item) => sum + item.amount, 0);
    return {
      ...b,
      actual,
      variance: b.amount - actual,
      percent: (actual / b.amount) * 100
    };
  });

  const dailyData = [
    { day: 'Mon', revenue: 400 },
    { day: 'Tue', revenue: 700 },
    { day: 'Wed', revenue: 500 },
    { day: 'Thu', revenue: 900 },
    { day: 'Fri', revenue: 1100 },
    { day: 'Sat', revenue: 300 },
    { day: 'Sun', revenue: 200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Revenue ledger, budgeting, and financial reports.</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (IPD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1 opacity-80">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Bill per Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {(totalRevenue / (patients.length || 1)).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {patients.length} patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${budgetActualData.reduce((s, b) => s + b.variance, 0) >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              KES {budgetActualData.reduce((s, b) => s + b.variance, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall budget surplus/deficit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Revenue Ledger</TabsTrigger>
          <TabsTrigger value="cashier">Cashier & Payments</TabsTrigger>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
          <TabsTrigger value="reports">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Billing Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing.slice().reverse().map((item) => {
                    const patient = patients.find(p => p.id === item.patientId);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs">{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="font-medium text-xs">{patient?.name}</div>
                        </TableCell>
                        <TableCell className="text-xs">{item.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">KES {item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                  {billing.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No financial records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashier" className="pt-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="h-5 w-5 mr-2" /> Receive Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.hospitalId})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPatient && (
                  <div className="p-3 rounded-lg bg-muted space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Total Billed:</span>
                      <span className="font-bold">KES {totalBilled.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Paid:</span>
                      <span className="font-bold text-green-600">KES {totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2 mt-2">
                      <span className="font-bold">Balance Due:</span>
                      <span className="font-bold text-destructive">KES {balance.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Amount to Pay (KES)</Label>
                  <Input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={e => setPaymentAmount(Number(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select onValueChange={(v: any) => setPaymentMethod(v)} value={paymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money (M-PESA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRecordPayment} disabled={!selectedPatientId || paymentAmount <= 0}>
                  Process Payment
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice().reverse().map((p) => {
                      const patient = patients.find(pat => pat.id === p.patientId);
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs">{new Date(p.date).toLocaleString()}</TableCell>
                          <TableCell>{patient?.name}</TableCell>
                          <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                          <TableCell className="text-right font-bold">KES {p.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No transactions recorded.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="pt-4 space-y-4 print:space-y-8">
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="print:border-none print:shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {budgetActualData.map((b) => (
                  <div key={b.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{b.category}</span>
                      <span className="text-muted-foreground">
                        KES {b.actual.toLocaleString()} / KES {b.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${b.percent > 90 ? 'bg-destructive' : b.percent > 70 ? 'bg-yellow-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(b.percent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-tighter font-bold">
                      <span className={b.variance >= 0 ? 'text-green-600' : 'text-destructive'}>
                        {b.variance >= 0 ? <ArrowDownRight className="inline h-3 w-3" /> : <ArrowUpRight className="inline h-3 w-3" />}
                        Variance: KES {Math.abs(b.variance).toLocaleString()}
                      </span>
                      <span>{b.percent.toFixed(1)}% Used</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="print:hidden">
              <CardHeader>
                <CardTitle className="text-lg">Budget Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetActualData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--muted))" name="Budgeted" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="hsl(var(--primary))" name="Actual" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 print:border-none print:shadow-none">
              <CardHeader>
                <CardTitle>Financial Summary Table</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Budget (KES)</TableHead>
                      <TableHead className="text-right">Actual (KES)</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Utilization</TableHead>
                      <TableHead className="text-right print:hidden w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetActualData.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.category}</TableCell>
                        <TableCell className="text-right">{b.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{b.actual.toLocaleString()}</TableCell>
                        <TableCell className={`text-right ${b.variance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {b.variance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={b.percent > 100 ? 'destructive' : 'outline'}>
                            {b.percent.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right print:hidden">
                          <Button variant="ghost" size="icon" onClick={() => handleEditBudget(b.category, b.amount, b.period)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="pt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weekly Trend</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="pt-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input className="w-full pl-8 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Search services or codes..." />
              </div>
              <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Standard Tariff</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { code: '1001', name: 'General Consultation (OPD)', cat: 'Clinical', rate: '5,000' },
                      { code: '1002', name: 'Specialist Consultation', cat: 'Clinical', rate: '12,000' },
                      { code: '2101', name: 'Complete Blood Count (CBC)', cat: 'Laboratory', rate: '3,500' },
                      { code: '2102', name: 'Liver Function Test (LFT)', cat: 'Laboratory', rate: '7,500' },
                      { code: '2103', name: 'Kidney Function Test (KFT)', cat: 'Laboratory', rate: '8,000' },
                      { code: '3101', name: 'Chest X-Ray (Digital)', cat: 'Radiology', rate: '11,000' },
                      { code: '3102', name: 'Ultrasound Abdomen', cat: 'Radiology', rate: '18,000' },
                      { code: '3103', name: 'CT Scan (Brain)', cat: 'Radiology', rate: '45,000' },
                      { code: '4101', name: 'General Ward Bed (Per Day)', cat: 'Inpatient', rate: '20,000' },
                      { code: '4102', name: 'ICU Bed (Per Day)', cat: 'Inpatient', rate: '85,000' },
                      { code: '4103', name: 'Maternity Wing (Standard)', cat: 'Inpatient', rate: '35,000' },
                      { code: '6101', name: 'Minor Surgery Package', cat: 'Surgical', rate: '120,000' },
                      { code: '6102', name: 'Major Surgery (Category A)', cat: 'Surgical', rate: '550,000' },
                      { code: '8001', name: 'Ambulance Service (Base)', cat: 'Logistics', rate: '7,500' },
                    ].map((acc) => (
                      <TableRow key={acc.code}>
                        <TableCell className="font-mono font-bold">{acc.code}</TableCell>
                        <TableCell className="font-medium">{acc.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{acc.cat}</Badge></TableCell>
                        <TableCell className="text-right font-mono">KES {acc.rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget: {editingBudget?.category}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (KES)
              </Label>
              <Input
                id="amount"
                type="number"
                value={editingBudget?.amount || 0}
                onChange={(e) => setEditingBudget(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBudget}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;