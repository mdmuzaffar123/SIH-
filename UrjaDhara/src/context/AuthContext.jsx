import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const signup = (data) => {
    if (users.find(u => u.email === data.email)) return { error: 'Email already exists' };
    if (users.find(u => u.mobile === data.mobile)) return { error: 'Mobile number already registered' };
    const newUser = { ...data };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password' };
    setUser(found);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    setUsers(prev => prev.map(u => u.email === user.email ? { ...u, ...updates } : u));
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
