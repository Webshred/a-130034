
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from '@/types/employee';
import EmployeeQRCode from './EmployeeQRCode';
import { Plus, Trash2, QrCode } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onRemoveEmployee: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onAddEmployee,
  onRemoveEmployee
}) => {
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    department: string;
    position: string;
    workHourStart: string;
    workHourEnd: string;
  }>({
    name: '',
    department: '',
    position: '',
    workHourStart: '08:00',
    workHourEnd: '17:00'
  });
  
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = () => {
    // Generate a new unique ID
    const id = `E${String(employees.length + 1).padStart(3, '0')}`;

    const employee: Employee = {
      id,
      name: newEmployee.name,
      department: newEmployee.department,
      position: newEmployee.position,
      workHours: {
        start: newEmployee.workHourStart,
        end: newEmployee.workHourEnd
      }
    };

    onAddEmployee(employee);

    // Reset form
    setNewEmployee({
      name: '',
      department: '',
      position: '',
      workHourStart: '08:00',
      workHourEnd: '17:00'
    });
  };

  const handleShowQR = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowQRDialog(true);
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Employés</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel employé</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={newEmployee.name} 
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Département</Label>
                  <Input 
                    id="department" 
                    value={newEmployee.department} 
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    value={newEmployee.position} 
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="workHourStart">Heure début</Label>
                    <Input 
                      id="workHourStart" 
                      type="time"
                      value={newEmployee.workHourStart} 
                      onChange={(e) => setNewEmployee({...newEmployee, workHourStart: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workHourEnd">Heure fin</Label>
                    <Input 
                      id="workHourEnd" 
                      type="time"
                      value={newEmployee.workHourEnd} 
                      onChange={(e) => setNewEmployee({...newEmployee, workHourEnd: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEmployee}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Heures de travail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{`${employee.workHours.start} - ${employee.workHours.end}`}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-2"
                        onClick={() => handleShowQR(employee)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRemoveEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Aucun employé enregistré
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code de {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedEmployee && (
              <EmployeeQRCode employeeId={selectedEmployee.id} name={selectedEmployee.name} />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQRDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeList;
