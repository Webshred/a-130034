
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
import { useToast } from '@/hooks/use-toast';
import { Employee, EmployeeAttendance, AttendanceStatus } from '@/types/employee';

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

  const handleScanAttendance = (employeeId: string) => {
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
    
    // Check if employee already checked in today (within the past 8 hours)
    const recentAttendance = attendances.find(
      att => att.employeeId === employeeId && 
      new Date(att.timestamp).getTime() > (now.getTime() - 8 * 60 * 60 * 1000)
    );

    if (recentAttendance) {
      toast({
        title: "Entrée refusée",
        description: "Vous avez déjà pointé dans les dernières 8 heures",
        variant: "warning",
      });
      return;
    }

    // Determine status (present/late)
    const [workHourStart] = employee.workHours.start.split(':').map(Number);
    const currentHour = now.getHours();
    
    let status: AttendanceStatus = 'present';
    if (currentHour > workHourStart) {
      status = 'late';
    }

    const newAttendance: EmployeeAttendance = {
      employeeId,
      name: employee.name,
      timestamp: now.toISOString(),
      date: today,
      status
    };

    setAttendances(prev => [...prev, newAttendance]);
    
    toast({
      title: "Présence enregistrée",
      description: `${employee.name} - ${status === 'late' ? 'En retard' : 'À l\'heure'}`,
      variant: "success",
    });
  };

  // Calculate summary data for today
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendances = attendances.filter(att => 
    att.date.split('T')[0] === todayDate
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
    </div>
  );
};

export default EmployeeManagement;
