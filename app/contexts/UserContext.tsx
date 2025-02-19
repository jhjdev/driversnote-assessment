import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types/types';

interface UserContextProps {
  getUser: (userId: string) => User | undefined;
  setDeliveryAddress: (address: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({
  children,
  getUser,
  setDeliveryAddress,
}: UserContextProps & { children: ReactNode }) => (
  <UserContext.Provider value={{ getUser, setDeliveryAddress }}>
    {children}
  </UserContext.Provider>
);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
