import React from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
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
import { Download, TrendingUp, DollarSign, Wallet } from 'lucide-react';

const Finance: React.FC = () => {
  const { billing, patients } = useHospital();

  const totalRevenue = billing.reduce((acc, item) => acc + item.amount, 0);
  
  const revenueByCategory = billing.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.keys(revenueByCategory).map(key => ({
    name: key,
    amount: revenueByCategory[key]
  }));

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
          <p className="text-muted-foreground">Revenue ledger, chart of accounts, and financial reports.</p>
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
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
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
            <div className="text-3xl font-bold">${(totalRevenue / (patients.length || 1)).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {patients.length} patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$2,450.00</div>
            <p className="text-xs text-muted-foreground mt-1">Insurance & Third-party</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Revenue Ledger</TabsTrigger>
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
                        <TableCell className="text-right font-bold">${item.amount.toFixed(2)}</TableCell>
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
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { code: '1000', name: 'General Consultation', rate: '$50.00', icon: DollarSign },
                  { code: '2000', name: 'Laboratory Services', rate: 'Variable', icon: Wallet },
                  { code: '3000', name: 'Radiology & Imaging', rate: 'Variable', icon: Wallet },
                  { code: '4000', name: 'Inpatient Ward Stay', rate: '$200/Day', icon: DollarSign },
                  { code: '5000', name: 'Pharmacy & Meds', rate: 'Cost + 15%', icon: Wallet },
                  { code: '6000', name: 'Surgical Procedures', rate: 'Tiered', icon: DollarSign },
                ].map((acc) => (
                  <div key={acc.code} className="p-4 border rounded-lg flex items-start gap-4 hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded text-primary">
                      <acc.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">{acc.code}</p>
                      <h4 className="text-sm font-semibold">{acc.name}</h4>
                      <p className="text-xs text-primary mt-1 font-bold">{acc.rate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
