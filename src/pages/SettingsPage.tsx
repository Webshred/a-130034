
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const SettingsPage = () => {
  const { settings, updateSetting } = useAppSettings();

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Préférences de l'application</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                <p className="text-sm text-gray-600">Recevez des alertes et notifications</p>
              </div>
              <Switch 
                id="notifications" 
                checked={settings.notifications} 
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="font-medium">Analytiques</Label>
                <p className="text-sm text-gray-600">Aider à améliorer RWS avec des données d'utilisation anonymisées</p>
              </div>
              <Switch 
                id="analytics" 
                checked={settings.analytics} 
                onCheckedChange={(checked) => updateSetting('analytics', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactView" className="font-medium">Vue compacte</Label>
                <p className="text-sm text-gray-600">Réduire l'espacement pour afficher plus de contenu</p>
              </div>
              <Switch 
                id="compactView" 
                checked={settings.compactView} 
                onCheckedChange={(checked) => updateSetting('compactView', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
