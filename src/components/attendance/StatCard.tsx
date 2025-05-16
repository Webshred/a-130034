
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, Users, X } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number | string;
  type: 'total' | 'present' | 'absent';
};

const StatCard: React.FC<StatCardProps> = ({ title, value, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'total':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'present':
        return <UserRound className="h-5 w-5 text-green-600" />;
      case 'absent':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };
  
  const getCardStyle = () => {
    switch (type) {
      case 'total':
        return 'bg-blue-50 border-blue-100';
      case 'present':
        return 'bg-green-50 border-green-100';
      case 'absent':
        return 'bg-red-50 border-red-100';
      default:
        return '';
    }
  };

  return (
    <Card className={`shadow-sm ${getCardStyle()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full p-1.5 bg-white">
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
