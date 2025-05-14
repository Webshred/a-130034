
import React, { createContext, useContext, ReactNode, useState } from 'react';

// Création du contexte avec les types appropriés
export interface CRMContextType {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  updateInventory: (itemName: string, quantityChange: number) => Promise<void>;
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Props pour le provider
interface CRMProviderProps {
  children: ReactNode;
}

// Implementation du context
const useCRMImplementation = (): CRMContextType => {
  const [lastSync] = useState<Date>(new Date());
  const [isRefreshing] = useState<boolean>(false);
  const [companyName] = useState<string>("RWS Pharmacie");
  const [activeModules] = useState<string[]>(["inventory", "billing", "patients"]);

  // La fonction pour mettre à jour l'inventaire
  const updateInventory = async (itemName: string, quantityChange: number): Promise<void> => {
    console.log(`Updating inventory: ${itemName}, change: ${quantityChange}`);
    // Ici, nous simulons la mise à jour de l'inventaire
    // Dans une application réelle, cette fonction appellerait une API
    return Promise.resolve();
  };
  
  return {
    lastSync,
    isRefreshing,
    companyName,
    activeModules,
    updateInventory,
    syncDataAcrossCRM: () => {
      console.log("Syncing data across CRM...");
    },
    updateModuleData: (moduleName: string, data: any) => {
      console.log(`Updating module data: ${moduleName}`);
    },
    getModuleData: (moduleName: string) => {
      console.log(`Getting module data: ${moduleName}`);
      return null;
    },
    exportModuleData: async (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => {
      console.log(`Exporting module data: ${moduleName} in ${format} format`);
      return Promise.resolve(true);
    },
    importModuleData: async (moduleName: string, file: File) => {
      console.log(`Importing module data: ${moduleName}`);
      return Promise.resolve(true);
    },
    printModuleData: async (moduleName: string, options?: any) => {
      console.log(`Printing module data: ${moduleName}`);
      return Promise.resolve(true);
    }
  };
};

// Provider qui va envelopper notre application
export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const crmContext = useCRMImplementation();
  
  return (
    <CRMContext.Provider value={crmContext}>
      {children}
    </CRMContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCRM = () => {
  const context = useContext(CRMContext);
  
  if (context === undefined) {
    throw new Error('useCRM doit être utilisé à l\'intérieur d\'un CRMProvider');
  }
  
  return context;
};

export default CRMContext;
