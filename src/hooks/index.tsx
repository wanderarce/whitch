import React from 'react';
import DrawerNavigator from '../navigation/DrawerNavigator';

import { AuthProvider } from './auth';

const AppProvider: React.FC = ({children}) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default AppProvider;
