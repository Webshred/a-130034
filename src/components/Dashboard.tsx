
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EditableField } from './ui/editable-field';
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
  // State for editable content
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
  
  // Handle changes
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast.success('Titre mis à jour');
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast.success('Description mise à jour');
  };
  
  const handleMonthChange = (value: string | number) => {
    setCurrentMonth(String(value));
    toast.success('Mois mis à jour');
  };
  
  // Stat card updates
  const handleRevenueChange = (value: string | number) => {
    setMonthlyRevenue(Number(value));
    toast.success('Revenu mensuel mis à jour');
  };
  
  const handleRevenueGrowthChange = (value: string | number) => {
    setRevenueGrowth(Number(value));
    toast.success('Croissance du revenu mise à jour');
  };
  
  const handleAreaChange = (value: string | number) => {
    setCultivatedArea(Number(value));
    toast.success('Production mise à jour');
  };
  
  const handleParcelsCountChange = (value: string | number) => {
    setParcelsCount(Number(value));
    toast.success('Nombre de produits mis à jour');
  };
  
  const handleYieldChange = (value: string | number) => {
    setAverageYield(Number(value));
    toast.success('Rendement moyen mis à jour');
  };
  
  const handleYieldGrowthChange = (value: string | number) => {
    setYieldGrowth(Number(value));
    toast.success('Croissance du rendement mise à jour');
  };
  
  // Add transaction handler (placeholder for future implementation)
  const handleAddTransaction = () => {
    toast.info('Redirection vers la page de finances');
    // In a real app, this would navigate to the finance page
  };
  
  return (
    <div className="p-6 space-y-6 animate-enter">
      <header className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className="inline-block"
              showEditIcon={true}
            />
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors">
            Dashboard
          </button>
          <button 
            className="px-4 py-2 text-sm bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors"
            onClick={handleAddTransaction}
          >
            <Wallet className="h-4 w-4 inline mr-2" />
            Ajouter une transaction
          </button>
        </div>
      </header>

      {/* Quick Stats Row - Updated to reflect pharma context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card-hover">
          <p className="stat-label">Revenu mensuel</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={monthlyRevenue}
                type="number"
                onSave={handleRevenueChange}
                className="inline-block font-bold"
              /> €
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              <EditableField
                value={revenueGrowth}
                type="number"
                onSave={handleRevenueGrowthChange}
                className="inline-block"
              />%
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Production</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={cultivatedArea}
                type="number"
                onSave={handleAreaChange}
                className="inline-block font-bold"
              /> K
            </p>
            <span className="text-agri-primary text-sm font-medium">
              <EditableField
                value={parcelsCount}
                type="number"
                onSave={handleParcelsCountChange}
                className="inline-block"
              /> produits
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Rendement moyen</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={averageYield}
                type="number"
                onSave={handleYieldChange}
                className="inline-block font-bold"
              /> %
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              <EditableField
                value={yieldGrowth}
                type="number"
                onSave={handleYieldGrowthChange}
                className="inline-block"
              />%
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
