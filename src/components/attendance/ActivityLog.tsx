
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { AttendanceRecord } from '@/types/attendance';
import { Check, X } from 'lucide-react';

interface ActivityLogProps {
  records: AttendanceRecord[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ records }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Checked In':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Already Checked In':
        return <Check className="h-4 w-4 text-yellow-600" />;
      case 'Invalid QR':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Checked In':
        return 'bg-green-100 text-green-800';
      case 'Already Checked In':
        return 'bg-yellow-100 text-yellow-800';
      case 'Invalid QR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Employee</TableHead>
              <TableHead className="w-[30%]">Department</TableHead>
              <TableHead className="w-[20%]">Time</TableHead>
              <TableHead className="w-[10%] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No activity recorded today
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.checkInTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusStyle(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="hidden sm:inline">{record.status}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
