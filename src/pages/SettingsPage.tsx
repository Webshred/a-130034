
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppSettings } from '@/contexts/AppSettingsContext';

const SettingsPage = () => {
  const { settings, updateSetting } = useAppSettings();

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
            <p className="text-gray-500">
              Configurez votre application selon vos préférences
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer automatiquement les modifications
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytique</Label>
                    <p className="text-sm text-muted-foreground">
                      Collecte de données pour améliorer l'application
                    </p>
                  </div>
                  <Switch 
                    id="analytics" 
                    checked={settings.analytics} 
                    onCheckedChange={(checked) => updateSetting('analytics', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Gérez les paramètres de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifs">Notifications par e-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par e-mail
                    </p>
                  </div>
                  <Switch id="email-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifs">Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications push
                    </p>
                  </div>
                  <Switch 
                    id="push-notifs" 
                    checked={settings.notifications} 
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer le mode sombre
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view">Vue compacte</Label>
                    <p className="text-sm text-muted-foreground">
                      Réduire l'espacement pour afficher plus de contenu
                    </p>
                  </div>
                  <Switch 
                    id="compact-view" 
                    checked={settings.compactView}
                    onCheckedChange={(checked) => updateSetting('compactView', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
