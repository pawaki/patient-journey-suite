import React, { useState, useEffect } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { differenceInYears, parseISO } from 'date-fns';

const Registration: React.FC = () => {
  const { patients, addPatient } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: 0,
    gender: '',
    guardianName: '',
    guardianPhone: '',
    isChild: false
  });

  useEffect(() => {
    if (formData.dob) {
      try {
        const age = differenceInYears(new Date(), parseISO(formData.dob));
        setFormData(prev => ({ ...prev, age, isChild: age < 18 }));
      } catch (e) {
        // invalid date
      }
    }
  }, [formData.dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.isChild && !formData.guardianName) {
      toast.error('Guardian details mandatory for children');
      return;
    }

    addPatient({
      ...formData,
      status: 'Registered',
      demographics: {},
      medicalHistory: [],
    });

    toast.success('Patient Registered Successfully');
    setFormData({
      name: '',
      dob: '',
      age: 0,
      gender: '',
      guardianName: '',
      guardianPhone: '',
      isChild: false
    });
    
    // Simulate Receipt Print
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Registration</h1>
          <p className="text-muted-foreground">Register new patients and issue receipts.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>New Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    value={formData.dob} 
                    onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" value={formData.age} readOnly className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={v => setFormData(prev => ({ ...prev, gender: v }))} value={formData.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.isChild && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm font-semibold text-primary italic">Child Registration (Guardian Mandatory)</p>
                  <div className="space-y-2">
                    <Label htmlFor="gName">Guardian Name</Label>
                    <Input 
                      id="gName" 
                      value={formData.guardianName} 
                      onChange={e => setFormData(prev => ({ ...prev, guardianName: e.target.value }))} 
                      required={formData.isChild}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gPhone">Guardian Phone</Label>
                    <Input 
                      id="gPhone" 
                      value={formData.guardianPhone} 
                      onChange={e => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))} 
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">Register & Print Receipt</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Sex</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.slice().reverse().map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.hospitalId}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}y / {patient.gender}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'Registered' ? 'outline' : 'default'}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No patients registered yet.
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

export default Registration;
