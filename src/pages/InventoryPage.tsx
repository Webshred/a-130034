
import React, { useState, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import Inventory from '../components/Inventory';
import { Button } from '../components/ui/button';
import { Package, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import usePageMetadata from '../hooks/use-page-metadata';
import { motion } from 'framer-motion';

const InventoryPage = () => {
  const { toast: shadowToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Gestion des Stocks',
    defaultDescription: 'Gérez votre inventaire et suivez les niveaux de stock'
  });

  const handleAddItem = () => {
    console.log(`Fonctionnalité d'ajout de stock activée`);
  };

  const renderTabActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleAddItem} 
          className="whitespace-nowrap transition-colors hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un stock
        </Button>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderTabActions()}
          icon={<Package className="h-6 w-6" />}
        />

        <Inventory />
      </div>
    </PageLayout>
  );
};

export default InventoryPage;
