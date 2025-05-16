
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  workHours: {
    start: string; // Format: "HH:MM"
    end: string;   // Format: "HH:MM"
  };
}

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface EmployeeAttendance {
  employeeId: string;
  name: string;
  timestamp: string; // ISO string
  date: string;      // ISO date string (for grouping)
  status: AttendanceStatus;
}
