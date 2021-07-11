import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import Login from '../pages/Login';
import InitialPageGroup from '../pages/InitialPageGroup';
import SignIn from '../pages/SignIn';
const Stack = createStackNavigator();
const App = createDrawerNavigator();
const AppRoutes: React.FC = () => (


  <App.Navigator
    screenOptions={{
      headerShown: false,
      //cardStyle: { backgroundColor: '#312e38' }
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard}/>


  </App.Navigator>
);

export default AppRoutes;
