
import React from 'react';
import PageLayout from '../components/layout/PageLayout';

const HelpPage = () => {
  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Aide</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Centre d'aide RWS</h2>
          <p className="mb-4">
            Bienvenue dans le centre d'aide de RWS. Cette section vous aidera à naviguer et utiliser efficacement notre application.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Comment utiliser le tableau de bord</h3>
              <p className="text-gray-600">
                Le tableau de bord vous offre une vue d'ensemble de vos données pharmaceutiques, 
                y compris les revenus et la production.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Gestion de l'inventaire</h3>
              <p className="text-gray-600">
                La section Inventaire vous permet de suivre tous vos produits pharmaceutiques, 
                de gérer les stocks et de surveiller les dates d'expiration.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Suivi financier</h3>
              <p className="text-gray-600">
                Utilisez la section Finances pour suivre vos revenus et dépenses, 
                et générer des rapports détaillés sur la performance financière.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Besoin d'aide supplémentaire?</h3>
              <p className="text-gray-600">
                Si vous avez des questions ou rencontrez des problèmes, n'hésitez pas à contacter notre 
                équipe de support à support@rws-pharma.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpPage;
