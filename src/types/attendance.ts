
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkInTime: Date;
  status: 'Checked In' | 'Already Checked In' | 'Invalid QR';
  department: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}
