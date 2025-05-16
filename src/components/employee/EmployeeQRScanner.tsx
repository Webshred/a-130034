
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, CheckCircle } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeQRScannerProps {
  onScan: (employeeId: string) => void;
  employees: Employee[];
}

const EmployeeQRScanner: React.FC<EmployeeQRScannerProps> = ({ onScan, employees }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // In a real application, this would be connected to a camera feed
  // Here we simply simulate scanning by using a dropdown
  const handleSimulateQRScan = () => {
    if (!selectedEmployeeId) return;
    
    onScan(selectedEmployeeId);
    setScanSuccess(true);
    
    // Reset success message after a delay
    setTimeout(() => {
      setScanSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <QrCode size={48} className="mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Scanner de QR Code</h3>
        <p className="text-gray-500 mb-4">
          Simulez le scan d'un QR code d'employé en sélectionnant un employé dans la liste ci-dessous.
        </p>
        
        <div className="w-full max-w-md space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="employee">Employé</Label>
            <Select 
              value={selectedEmployeeId} 
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
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
          
          <Button 
            onClick={handleSimulateQRScan} 
            disabled={!selectedEmployeeId || scanSuccess}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            Simuler le scan
          </Button>
        </div>
      </div>
      
      {scanSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Scan réussi</AlertTitle>
          <AlertDescription>
            L'employé a été enregistré avec succès.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="prose max-w-none">
        <h3>En situation réelle :</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Les employés se verraient attribuer un QR Code unique</li>
          <li>Une caméra ou un scanner serait installé à l'entrée</li>
          <li>Le système enregistrerait automatiquement la présence</li>
          <li>Des règles de validation seraient appliquées (pas d'entrées multiples, retard, etc.)</li>
        </ol>
      </div>
    </div>
  );
};

export default EmployeeQRScanner;
