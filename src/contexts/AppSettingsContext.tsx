
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettings {
  darkMode: boolean;
  locale: string;
  notifications: boolean;
  analytics: boolean;
  compactView: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: any) => void;
  updateNestedSetting: (section: string, key: string, value: any) => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  locale: 'fr-FR',
  notifications: true,
  analytics: true,
  compactView: false,
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  updateNestedSetting: () => {},
});

export const useAppSettings = () => useContext(AppSettingsContext);

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  // Try to load settings from localStorage
  const loadSettings = (): AppSettings => {
    try {
      const storedSettings = localStorage.getItem('appSettings');
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error('Error loading settings from localStorage', error);
    }
    return defaultSettings;
  };

  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  const updateSetting = (key: string, value: any) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        [key]: value,
      };
      
      // Save to localStorage
      try {
        localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Error saving settings to localStorage', error);
      }
      
      return updatedSettings;
    });
  };

  // Fix the updateNestedSetting function with proper typing
  const updateNestedSetting = (section: string, key: string, value: any) => {
    setSettings((prevSettings) => {
      // Create a copy of the current settings
      const updatedSettings = { ...prevSettings };
      
      // Safely handle the nested section
      const sectionData = updatedSettings[section] as Record<string, any>;
      
      // If the section exists, update it
      if (sectionData) {
        // Create a new object for the section to avoid direct mutation
        updatedSettings[section] = {
          ...sectionData,
          [key]: value
        };
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Error saving settings to localStorage', error);
      }
      
      return updatedSettings;
    });
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, updateNestedSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
