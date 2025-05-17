
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeSummary from './EmployeeSummary';
import EmployeeList from './EmployeeList';
import EmployeeQRScanner from './EmployeeQRScanner';
import EmployeeReport from './EmployeeReport';
import { useToast } from '@/hooks/use-toast';
import { Employee, EmployeeAttendance, AttendanceStatus, ActivityType } from '@/types/employee';

// Initial demo employees
const initialEmployees: Employee[] = [
  { id: 'E001', name: 'Jean Dupont', department: 'Production', position: 'Ouvrier', workHours: { start: '08:00', end: '17:00' } },
  { id: 'E002', name: 'Marie Laurent', department: 'Administration', position: 'Assistante', workHours: { start: '09:00', end: '18:00' } },
  { id: 'E003', name: 'Thomas Bernard', department: 'Logistique', position: 'Gestionnaire', workHours: { start: '07:30', end: '16:30' } },
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [showReportModal, setShowReportModal] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    const storedAttendances = localStorage.getItem('attendances');

    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(initialEmployees);
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }

    if (storedAttendances) {
      setAttendances(JSON.parse(storedAttendances));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('attendances', JSON.stringify(attendances));
  }, [attendances]);

  const handleAddEmployee = (employee: Employee) => {
    const newEmployees = [...employees, employee];
    setEmployees(newEmployees);
    toast({
      title: "Employé ajouté",
      description: `${employee.name} a été ajouté avec succès`,
      variant: "success",
    });
  };

  const handleRemoveEmployee = (id: string) => {
    const newEmployees = employees.filter(employee => employee.id !== id);
    setEmployees(newEmployees);
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès",
      variant: "default",
    });
  };

  const handleScanAttendance = (employeeId: string, activityType: ActivityType = 'check-in') => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      toast({
        title: "Erreur",
        description: "Employé non trouvé",
        variant: "destructive",
      });
      return;
    }

    // Get current date and time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    // Special handling for activity types
    if (activityType === 'check-in') {
      // For check-in, find if employee already checked in within the past hour
      const recentCheckIn = attendances.find(
        att => att.employeeId === employeeId && 
        att.activityType === 'check-in' &&
        new Date(att.timestamp).getTime() > (now.getTime() - 1 * 60 * 60 * 1000)
      );

      if (recentCheckIn) {
        // If checked in recently, inform the user
        toast({
          title: "Entrée refusée",
          description: "Vous avez déjà pointé dans la dernière heure",
          variant: "warning",
        });
        return;
      }

      // Determine status (present/late) for check-in
      const [workHourStart] = employee.workHours.start.split(':').map(Number);
      const currentHour = now.getHours();
      
      let status: AttendanceStatus = 'present';
      if (currentHour > workHourStart) {
        status = 'late';
      }

      // Create check-in attendance record
      const newAttendance: EmployeeAttendance = {
        employeeId,
        name: employee.name,
        timestamp: now.toISOString(),
        date: today,
        status,
        activityType: 'check-in'
      };

      setAttendances(prev => [...prev, newAttendance]);
      
      toast({
        title: "Pointage enregistré",
        description: `${employee.name} - ${status === 'late' ? 'En retard' : 'À l\'heure'}`,
        variant: "success",
      });

    } else if (activityType === 'check-out') {
      // For check-out, find the most recent check-in to pair with
      const latestCheckIn = [...attendances]
        .filter(att => att.employeeId === employeeId && att.activityType === 'check-in')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      if (!latestCheckIn) {
        toast({
          title: "Erreur",
          description: "Aucun pointage d'entrée trouvé pour créer une sortie",
          variant: "warning",
        });
        return;
      }

      // Create check-out record
      const newAttendance: EmployeeAttendance = {
        employeeId,
        name: employee.name,
        timestamp: now.toISOString(),
        date: today,
        status: 'present', // Status is maintained from check-in
        activityType: 'check-out'
      };

      setAttendances(prev => [...prev, newAttendance]);
      
      toast({
        title: "Sortie enregistrée",
        description: `${employee.name} - Sortie à ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        variant: "success",
      });

    } else if (activityType === 'leave') {
      // Create leave record
      const newAttendance: EmployeeAttendance = {
        employeeId,
        name: employee.name,
        timestamp: now.toISOString(),
        date: today,
        status: 'leave',
        activityType: 'leave'
      };

      setAttendances(prev => [...prev, newAttendance]);
      
      toast({
        title: "Congé enregistré",
        description: `${employee.name} est en congé aujourd'hui`,
        variant: "success",
      });
    }
  };

  // Auto-checkout function: Check if employees have been checked in for more than 8 hours
  const checkAutoCheckout = () => {
    const now = new Date();
    
    // Get all check-ins without corresponding check-outs
    const checkIns = attendances.filter(att => att.activityType === 'check-in');
    
    for (const checkIn of checkIns) {
      // Find if there's a checkout for this check-in
      const hasCheckout = attendances.some(att => 
        att.employeeId === checkIn.employeeId && 
        att.activityType === 'check-out' && 
        new Date(att.timestamp).getTime() > new Date(checkIn.timestamp).getTime() &&
        new Date(att.timestamp).getTime() < new Date(checkIn.timestamp).getTime() + 24 * 60 * 60 * 1000 // within 24 hours
      );
      
      if (!hasCheckout) {
        // Check if the check-in is more than 1 hour ago (using 1 hour for testing, real implementation would use 8 hours)
        const checkInTime = new Date(checkIn.timestamp);
        if (now.getTime() - checkInTime.getTime() > 1 * 60 * 60 * 1000) {
          // Auto-checkout this employee
          handleScanAttendance(checkIn.employeeId, 'check-out');
        }
      }
    }
  };
  
  // Run auto-checkout check periodically
  useEffect(() => {
    const interval = setInterval(checkAutoCheckout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [attendances]);

  // Calculate summary data for today
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendances = attendances.filter(att => 
    att.date.split('T')[0] === todayDate && att.activityType === 'check-in'
  );
  
  const presentToday = todayAttendances.length;
  const absentToday = employees.length - presentToday;

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="summary" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="employees">Liste des Employés</TabsTrigger>
          <TabsTrigger value="attendance">Scanner QR</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <EmployeeSummary 
            totalEmployees={employees.length}
            presentToday={presentToday}
            absentToday={absentToday}
            recentAttendances={todayAttendances}
            onShowReport={() => setShowReportModal(true)}
          />
        </TabsContent>
        
        <TabsContent value="employees">
          <EmployeeList 
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Scanner de QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeQRScanner 
                onScan={handleScanAttendance}
                employees={employees}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showReportModal && (
        <EmployeeReport 
          employees={employees} 
          attendances={attendances}
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
