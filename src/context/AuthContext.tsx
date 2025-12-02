import { createContext, useContext } from "react";

export type User = {
  id: string;
  role: string;
  email: string;
  name: string;
  surname: string;
  number: string;
  status: string; //
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
