import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Activity } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();

  const roles: Role[] = ['Director', 'Doctor', 'Nurse', 'Technologist', 'Finance'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <Activity className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Hospital Management System</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Select a role to enter the dashboard</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {roles.map((role) => (
            <Button 
              key={role} 
              variant="outline" 
              className="w-full h-12 text-lg justify-start px-6"
              onClick={() => login(role)}
            >
              <span className="flex-1 text-left">{role}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Login</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
