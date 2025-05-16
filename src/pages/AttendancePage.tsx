import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import QRScanner from '../components/attendance/QRScanner';
import ScanResult from '../components/attendance/ScanResult';
import StatCard from '../components/attendance/StatCard';
import ActivityLog from '../components/attendance/ActivityLog';
import { Button } from '@/components/ui/button';
import { Employee, AttendanceRecord, AttendanceStats } from '@/types/attendance';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { QrCode, ListCheck } from 'lucide-react';

// Mock data for demonstration
const mockEmployees: Employee[] = [
  { 
    id: "EMP001", 
    name: "Jean Dupont", 
    department: "IT", 
    position: "Developer",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  { 
    id: "EMP002", 
    name: "Marie Martin", 
    department: "HR", 
    position: "Manager",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  { 
    id: "EMP003", 
    name: "Pierre Leroy", 
    department: "Finance", 
    position: "Accountant",
    photo: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  { 
    id: "EMP004", 
    name: "Sophie Bernard", 
    department: "Marketing", 
    position: "Specialist",
    photo: "https://randomuser.me/api/portraits/women/22.jpg"
  },
];

const AttendancePage = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedEmployee, setLastScannedEmployee] = useState<Employee | null>(null);
  const [scanTime, setScanTime] = useState<Date | null>(null);
  const [scanStatus, setScanStatus] = useState<'Checked In' | 'Already Checked In' | 'Invalid QR' | null>(null);
  const [activityRecords, setActivityRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalEmployees: mockEmployees.length,
    presentToday: 0,
    absentToday: 0
  });
  
  // Initialize some mock data on component mount
  useEffect(() => {
    // Set some initial mock attendance records
    const initialRecords: AttendanceRecord[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Jean Dupont',
        checkInTime: new Date(new Date().setHours(8, 15)),
        status: 'Checked In',
        department: 'IT'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Marie Martin',
        checkInTime: new Date(new Date().setHours(9, 5)),
        status: 'Checked In',
        department: 'HR'
      }
    ];
    
    setActivityRecords(initialRecords);
    
    // Update stats
    setStats({
      totalEmployees: mockEmployees.length,
      presentToday: 2,
      absentToday: mockEmployees.length - 2
    });
  }, []);
  
  // Function to handle a QR code scan
  const handleScan = (data: string) => {
    // In a real app, 'data' would be decoded to get the employee ID
    // For this demo, we'll simulate a random scan result
    const employeeId = mockEmployees[Math.floor(Math.random() * mockEmployees.length)].id;
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      setScanStatus('Invalid QR');
      setLastScannedEmployee(null);
      return;
    }
    
    const now = new Date();
    setScanTime(now);
    setLastScannedEmployee(employee);
    
    // Check if employee already checked in today
    const alreadyCheckedIn = activityRecords.some(
      record => record.employeeId === employee.id && 
      record.checkInTime.toDateString() === now.toDateString()
    );
    
    let status: 'Checked In' | 'Already Checked In' | 'Invalid QR';
    
    if (alreadyCheckedIn) {
      status = 'Already Checked In';
      toast({
        title: "Already Checked In",
        description: `${employee.name} has already checked in today.`,
        variant: "warning",
      });
    } else {
      status = 'Checked In';
      
      // Add to activity records
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeId: employee.id,
        employeeName: employee.name,
        checkInTime: now,
        status: 'Checked In',
        department: employee.department
      };
      
      setActivityRecords(prev => [newRecord, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        presentToday: prev.presentToday + 1,
        absentToday: prev.absentToday - 1
      }));
      
      toast({
        title: "Check-in Successful",
        description: `${employee.name} checked in at ${now.toLocaleTimeString()}`,
        variant: "success",
      });
    }
    
    setScanStatus(status);
    setIsScanning(false);
    
    // Simulate a QR code scan with the button click
    setTimeout(() => {
      const employeeId = mockEmployees[Math.floor(Math.random() * mockEmployees.length)].id;
      const employee = mockEmployees.find(emp => emp.id === employeeId);
      
      if (employee) {
        // Add to activity records if not already checked in
        const now = new Date();
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          employeeId: employee.id,
          employeeName: employee.name,
          checkInTime: now,
          status: 'Checked In',
          department: employee.department
        };
        
        setActivityRecords(prev => [newRecord, ...prev]);
      }
    }, 5000);
  };
  
  // Function to handle manual entry
  const handleManualEntry = () => {
    toast({
      title: "Manual Entry",
      description: "Manual entry form would open here.",
      variant: "default",
    });
  };
  
  // Function to view all logs
  const handleViewAllLogs = () => {
    toast({
      title: "View All Logs",
      description: "Complete attendance logs would be displayed here.",
      variant: "default",
    });
  };

  return (
    <PageLayout>
      <div className="p-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Système de Présence</h1>
            <p className="text-gray-500">Scannez les codes QR des employés pour enregistrer leur présence</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleManualEntry}
            >
              <ListCheck className="h-4 w-4" />
              Saisie Manuelle
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleViewAllLogs}
            >
              <QrCode className="h-4 w-4" />
              Tous les Logs
            </Button>
          </div>
        </header>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total des Employés" 
            value={stats.totalEmployees} 
            type="total" 
          />
          <StatCard 
            title="Présents Aujourd'hui" 
            value={stats.presentToday} 
            type="present" 
          />
          <StatCard 
            title="Absents Aujourd'hui" 
            value={stats.absentToday} 
            type="absent" 
          />
        </div>
        
        {/* Main Content: Camera and Scan Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Scanner un Code QR</h2>
            <QRScanner 
              onScan={handleScan}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Résultat du Scan</h2>
            <ScanResult 
              employee={lastScannedEmployee}
              scanTime={scanTime}
              status={scanStatus}
            />
          </div>
        </div>
        
        {/* Activity Log */}
        <Separator className="my-6" />
        
        <ActivityLog records={activityRecords} />
      </div>
    </PageLayout>
  );
};

export default AttendancePage;
