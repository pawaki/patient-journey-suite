import React from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { History, User, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const AuditLog: React.FC = () => {
  const { auditLogs } = useHospital();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Audit Log</h1>
        <p className="text-muted-foreground">Traceability and transparency of user actions & role changes.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Active session logs
          </CardTitle>
          <Badge variant="outline" className="font-mono">{auditLogs.length} events</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Security</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="group">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 opacity-50" />
                      <span className="text-xs font-semibold">{log.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-[300px] truncate group-hover:whitespace-normal transition-all">
                    {log.details || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-[10px] font-bold">VERIFIED</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {auditLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No system events recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
