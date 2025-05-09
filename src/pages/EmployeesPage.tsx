
import React from 'react';
import PageLayout from '../components/layout/PageLayout';

const EmployeesPage = () => {
  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Employés</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Gestion des employés</h2>
          <p className="text-gray-600 mb-6">
            Cette section vous permet de gérer vos employés et leurs accès à l'application RWS.
          </p>
          
          <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">
              Module en cours de développement. Disponible prochainement.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EmployeesPage;
