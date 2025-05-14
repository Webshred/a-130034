
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import FinancialTracking from '../components/FinancialTracking';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import { useToast } from "@/hooks/use-toast";
import { StatisticsProvider } from '../contexts/StatisticsContext';

const FinancePage = () => {
  const { toast: shadowToast } = useToast();
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Gestion Financière',
    defaultDescription: 'Suivez vos revenus, dépenses et la rentabilité de votre exploitation agricole'
  });

  // Keep minimal state needed
  const [timeFrame, setTimeFrame] = useState('year');
  const [reportGenerating, setReportGenerating] = useState(false);
  
  // Define handleGenerateReport to fix the TypeScript error
  const handleGenerateReport = () => {
    setReportGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setReportGenerating(false);
    }, 2000);
  };

  return (
    <PageLayout>
      <PageHeader 
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        showEditIcon={false}
      />
      
      <StatisticsProvider>
        <div className="space-y-6">
          <FinancialTracking />
        </div>
      </StatisticsProvider>
    </PageLayout>
  );
};

export default FinancePage;
