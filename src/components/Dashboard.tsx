
import React, { useState } from 'react';
import { 
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 1500 },
  { month: 'Fév', revenue: 2200 },
  { month: 'Mar', revenue: 2500 },
  { month: 'Avr', revenue: 2800 },
  { month: 'Mai', revenue: 3200 },
  { month: 'Juin', revenue: 3500 },
  { month: 'Juil', revenue: 4000 },
];

const Dashboard = () => {
  // State for content
  const [title, setTitle] = useState('Bonjour, Utilisateur RWS');
  const [description, setDescription] = useState('Voici un aperçu des statistiques pharmaceutiques');
  const [currentMonth, setCurrentMonth] = useState('Août 2025');
  
  // Stats cards
  const [monthlyRevenue, setMonthlyRevenue] = useState(15450);
  const [revenueGrowth, setRevenueGrowth] = useState(8.5);
  const [cultivatedArea, setCultivatedArea] = useState(35);
  const [parcelsCount, setParcelsCount] = useState(5);
  const [averageYield, setAverageYield] = useState(75);
  const [yieldGrowth, setYieldGrowth] = useState(5.2);
  
  return (
    <div className="p-6 space-y-6 animate-enter">
      <header className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
      </header>

      {/* Quick Stats Row - Updated to reflect pharma context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card-hover">
          <p className="stat-label">Revenu mensuel</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {monthlyRevenue} €
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              {revenueGrowth}%
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Production</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {cultivatedArea} K
            </p>
            <span className="text-agri-primary text-sm font-medium">
              {parcelsCount} produits
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Rendement moyen</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {averageYield} %
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              {yieldGrowth}%
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Efficacité</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">92%</p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +3.5%
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-card col-span-full card-hover">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Revenu Mensuel</h3>
          <div className="flex space-x-2">
            <button className="text-xs px-3 py-1.5 bg-muted rounded-md text-foreground">2025</button>
            <button className="text-xs px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-md">2024</button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value} €`} />
              <Tooltip formatter={(value) => [`${value} €`, 'Revenu']} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4CAF50" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 8 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
