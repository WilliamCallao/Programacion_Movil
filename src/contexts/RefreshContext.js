// contexts/RefreshContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const RefreshContext = createContext();

// Crear el proveedor del contexto
export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(true);
  const resetRefresh = () => setRefresh(false);

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh, resetRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
