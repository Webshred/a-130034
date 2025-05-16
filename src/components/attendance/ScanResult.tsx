
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface ScanResultProps {
  employee: {
    id: string;
    name: string;
    department: string;
    photo?: string;
  } | null;
  scanTime: Date | null;
  status: 'Checked In' | 'Already Checked In' | 'Invalid QR' | null;
}

const ScanResult: React.FC<ScanResultProps> = ({ employee, scanTime, status }) => {
  if (!employee) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Scan Result</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p>Please scan an employee QR code</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'Checked In':
        return <div className="bg-green-100 p-2 rounded-full">
          <Check className="h-6 w-6 text-green-600" />
        </div>;
      case 'Already Checked In':
        return <div className="bg-yellow-100 p-2 rounded-full">
          <Check className="h-6 w-6 text-yellow-600" />
        </div>;
      case 'Invalid QR':
        return <div className="bg-red-100 p-2 rounded-full">
          <X className="h-6 w-6 text-red-600" />
        </div>;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Checked In': return 'bg-green-100 text-green-800';
      case 'Already Checked In': return 'bg-yellow-100 text-yellow-800';
      case 'Invalid QR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Scan Result</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {employee.photo ? (
              <img src={employee.photo} alt={employee.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-gray-500">
                {employee.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mt-1">
              <span className="text-muted-foreground">ID:</span>
              <span>{employee.id}</span>
              
              <span className="text-muted-foreground">Department:</span>
              <span>{employee.department}</span>
              
              <span className="text-muted-foreground">Time:</span>
              <span>{scanTime?.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {getStatusIcon()}
            <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
              {status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResult;
