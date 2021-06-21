import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {View, StatusBar, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppProvider from './hooks';

import Routes from './routes/index';
import {UserLoggedProvider} from "./hooks/userLoggedContext";
import {mainColor} from "./utils/Util";
import InitialPageGroup from './pages/InitialPageGroup';
import { DrawerContents } from './utils/DrawerContents';

const Drawer = createDrawerNavigator();
const App: React.FC = () => {

    useEffect(function () {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true);
    },[]);


    return (
        <UserLoggedProvider>
            <NavigationContainer>

                <StatusBar barStyle="light-content" backgroundColor={mainColor}/>
                <AppProvider>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#2493a9',

                      }}>
                      <Routes />

                    </View>
                </AppProvider>
            </NavigationContainer>
        </UserLoggedProvider>
    );
}

export default App
