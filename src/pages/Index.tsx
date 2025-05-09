
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userName, setUserName] = useState('Utilisateur');
  
  // Utiliser le contexte CRM
  const { lastSync } = useCRM();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Changement d'onglet vers: ${value}`);
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Tableau de Bord',
      content: <Dashboard />
    }
  ];

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord RWS</h1>
              <p className="text-gray-500">
                Bienvenue, {userName} | Dernière mise à jour: {lastSync.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
