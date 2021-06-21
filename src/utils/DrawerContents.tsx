import React from "react";
import {Image, View,  StyleSheet} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';

import {
  Avatar,
  Title,
  Drawer,
  Text,
  Switch
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Container, Menu, MenuLabel} from "../pages/MainMenu/styles";
import homeImg from "./../assets/menu/HOME.png";
import myProfileImg from "../../assets/menu/MEU-PERFIL.png";
import groupsImg from "../../assets/menu/GRUPOS.png";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import pointsImg from "../../assets/menu/VALE-PONTOS.png";
import beAnAdvertiserImg from "../../assets/menu/SEJA-UM-ANUNCIANTE.png";
import createGroupImg from "../../assets/menu/CRIE-SEU-GRUPO.png";
import aboutWhichIsImg from "../../assets/menu/SOBRE-WHICH-IS.png";
import logoutImg from "../../assets/menu/SAIR.png";
import { NavigationContainer } from "@react-navigation/native";


export function DrawerContents(props) {
  return (

    <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>

                <Drawer.Section style={styles.drawerSection}>
                <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: "88%", height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('InitialPageGroup')}
                                        >
                                            Home
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: "10%", height: 30}}>
                                    <Image source={homeImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                </Drawer.Section>
                </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem

                    label="Sign Out"
                    onPress={() => {
                      navigation.navigate('Login')
                    }}
                />
            </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
