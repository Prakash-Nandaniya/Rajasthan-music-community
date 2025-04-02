import React, { createContext, useState, useContext } from "react";

// Create context
const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("user"); // Default: No Login

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
