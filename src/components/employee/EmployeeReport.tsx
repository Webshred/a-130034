
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer, FileText, Download } from 'lucide-react';
import { Employee, EmployeeAttendance, EmployeeReport as EmployeeReportType } from '@/types/employee';

interface EmployeeReportProps {
  employees: Employee[];
  attendances: EmployeeAttendance[];
  open: boolean;
  onClose: () => void;
}

const EmployeeReport: React.FC<EmployeeReportProps> = ({
  employees,
  attendances,
  open,
  onClose
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<EmployeeReportType | null>(null);

  const months = [
    { value: '0', label: 'Janvier' },
    { value: '1', label: 'Février' },
    { value: '2', label: 'Mars' },
    { value: '3', label: 'Avril' },
    { value: '4', label: 'Mai' },
    { value: '5', label: 'Juin' },
    { value: '6', label: 'Juillet' },
    { value: '7', label: 'Août' },
    { value: '8', label: 'Septembre' },
    { value: '9', label: 'Octobre' },
    { value: '10', label: 'Novembre' },
    { value: '11', label: 'Décembre' }
  ];

  // Generate years (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const generateReport = () => {
    if (!selectedEmployeeId) return;

    const employee = employees.find(e => e.id === selectedEmployeeId);
    if (!employee) return;

    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    
    // Filter attendances for selected employee and month/year
    const filteredAttendances = attendances.filter(att => {
      const attDate = new Date(att.timestamp);
      return (
        att.employeeId === selectedEmployeeId &&
        attDate.getMonth() === month &&
        attDate.getFullYear() === year
      );
    });

    // Group attendances by date
    const attendancesByDate = filteredAttendances.reduce<Record<string, EmployeeAttendance[]>>((acc, att) => {
      const dateStr = new Date(att.timestamp).toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(att);
      return acc;
    }, {});

    // Create attendance records with check-in/check-out pairs
    const attendanceRecords = Object.entries(attendancesByDate).map(([date, atts]) => {
      // Sort by timestamp
      atts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Find check-in and check-out records
      const checkIn = atts.find(a => a.activityType === 'check-in');
      const checkOut = atts.find(a => a.activityType === 'check-out');
      
      // Determine if late
      const isLate = checkIn?.status === 'late';
      
      return {
        date,
        checkIn: checkIn ? new Date(checkIn.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        checkOut: checkOut ? new Date(checkOut.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        isLate
      };
    });

    // Count leave days
    const leaveCount = filteredAttendances.filter(a => a.activityType === 'leave').length;
    
    // Count late days
    const lateCount = attendanceRecords.filter(r => r.isLate).length;

    // Create report data
    const report: EmployeeReportType = {
      employeeId: employee.id,
      name: employee.name,
      daysPresent: attendanceRecords.filter(r => r.checkIn).length,
      attendances: attendanceRecords,
      leaveCount,
      lateCount
    };

    setReportData(report);
    setReportGenerated(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && reportData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Rapport Mensuel - ${reportData.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary { margin-bottom: 30px; }
              .summary div { margin-bottom: 10px; }
              .late { color: red; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Rapport Mensuel de Présence</h1>
              <h2>${reportData.name} - ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}</h2>
            </div>
            
            <div class="summary">
              <div><strong>Employé:</strong> ${reportData.name} (ID: ${reportData.employeeId})</div>
              <div><strong>Jours de présence:</strong> ${reportData.daysPresent}</div>
              <div><strong>Jours de congé:</strong> ${reportData.leaveCount}</div>
              <div><strong>Retards:</strong> ${reportData.lateCount}</div>
            </div>
            
            <h3>Détails des présences</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.attendances.map(att => `
                  <tr>
                    <td>${new Date(att.date).toLocaleDateString('fr-FR')}</td>
                    <td>${att.checkIn || '-'}</td>
                    <td>${att.checkOut || '-'}</td>
                    <td class="${att.isLate ? 'late' : ''}">${att.isLate ? 'En retard' : 'À l\'heure'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const resetReport = () => {
    setReportGenerated(false);
    setReportData(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rapport Mensuel de Présence</DialogTitle>
        </DialogHeader>
        
        {!reportGenerated ? (
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="employee">Employé</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="month">Mois</Label>
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Sélectionnez un mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid items-center gap-1.5">
                <Label htmlFor="year">Année</Label>
                <Select
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Sélectionnez une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button onClick={generateReport} disabled={!selectedEmployeeId}>
                <FileText className="mr-2 h-4 w-4" />
                Générer le rapport
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            {reportData && (
              <>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{reportData.name}</h2>
                    <div className="text-sm text-gray-500">
                      {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="text-sm text-gray-500">Jours présent</div>
                      <div className="text-2xl font-bold">{reportData.daysPresent}</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-md">
                      <div className="text-sm text-gray-500">Jours en retard</div>
                      <div className="text-2xl font-bold">{reportData.lateCount}</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-md">
                      <div className="text-sm text-gray-500">Jours en congé</div>
                      <div className="text-2xl font-bold">{reportData.leaveCount}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Arrivée</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Départ</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.attendances.map((att, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {new Date(att.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-2">{att.checkIn || '-'}</td>
                          <td className="px-4 py-2">{att.checkOut || '-'}</td>
                          <td className="px-4 py-2">
                            {att.isLate ? (
                              <span className="text-red-500">En retard</span>
                            ) : (
                              <span className="text-green-500">À l'heure</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {reportData.attendances.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            Aucune présence pour ce mois
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={resetReport}>
                    Retour
                  </Button>
                  <Button variant="secondary" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeReport;
