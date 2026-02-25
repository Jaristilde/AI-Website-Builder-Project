import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleConnection, Appointment, Client } from '../types/crm';

interface GoogleContextType {
  connection: GoogleConnection;
  isConnected: boolean;
  appointments: Appointment[];
  clients: Client[];
  setConnection: (connection: GoogleConnection) => void;
  disconnect: () => void;
  updateAppsScriptUrl: (url: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
}

const GoogleContext = createContext<GoogleContextType | undefined>(undefined);

const STORAGE_KEY = 'website_builder_google_connection';
const APPOINTMENTS_KEY = 'website_builder_appointments';
const CLIENTS_KEY = 'website_builder_clients';

export const GoogleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnectionState] = useState<GoogleConnection>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { connected: false };
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(APPOINTMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(CLIENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const isConnected = connection.connected && !!connection.appsScriptUrl;

  const setConnection = (newConnection: GoogleConnection) => {
    setConnectionState(newConnection);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConnection));
  };

  const disconnect = () => {
    const newConnection = { connected: false };
    setConnectionState(newConnection);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConnection));
  };

  const updateAppsScriptUrl = (url: string) => {
    const newConnection = { ...connection, appsScriptUrl: url, connected: true };
    setConnection(newConnection);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Math.random().toString(36).substr(2, 9) };
    const newAppointments = [...appointments, newAppointment];
    setAppointments(newAppointments);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(newAppointments));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Math.random().toString(36).substr(2, 9) };
    const newClients = [...clients, newClient];
    setClients(newClients);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(newClients));
  };

  return (
    <GoogleContext.Provider value={{ 
      connection, 
      isConnected, 
      appointments,
      clients,
      setConnection, 
      disconnect, 
      updateAppsScriptUrl,
      addAppointment,
      addClient
    }}>
      {children}
    </GoogleContext.Provider>
  );
};

export const useGoogle = () => {
  const context = useContext(GoogleContext);
  if (context === undefined) {
    throw new Error('useGoogle must be used within a GoogleProvider');
  }
  return context;
};
