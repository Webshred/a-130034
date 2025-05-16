
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { User, UserCheck, UserX, Clock } from 'lucide-react';
import { EmployeeAttendance } from '@/types/employee';

interface EmployeeSummaryProps {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  recentAttendances: EmployeeAttendance[];
}

const EmployeeSummary: React.FC<EmployeeSummaryProps> = ({
  totalEmployees,
  presentToday,
  absentToday,
  recentAttendances
}) => {
  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présent Aujourd'hui</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Aujourd'hui</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentToday}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Heure d'arrivée</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendances.length > 0 ? (
                recentAttendances
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((attendance) => (
                    <TableRow key={attendance.employeeId + attendance.timestamp}>
                      <TableCell>{attendance.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-500" />
                          {formatTime(attendance.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span 
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            attendance.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : attendance.status === 'late' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {attendance.status === 'present' 
                            ? 'À l\'heure' 
                            : attendance.status === 'late' 
                            ? 'En retard' 
                            : 'Absent'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    Aucune activité enregistrée aujourd'hui
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeeSummary;
