import React, { useEffect, useState } from 'react';
import {Image, View, StyleSheet, Text } from 'react-native';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Login from "../pages/Login";
import PasswordReset from "../pages/PasswordReset";
import NewPassword from "../pages/PasswordReset/newPassword";
import MyProfile from "../pages/MyProfile";
import EditMyProfile from "../pages/EditMyProfile";
import UpdatePassWord from "../pages/UpdatePassword";
import CreatePlan from "../pages/CreatePlan";
import CreateSegment from "../pages/CreateSegment";
import ListSegments from "../pages/ListSegments";
import CreateGroup from "../pages/CreateGroup";
import ListGroups from "../pages/ListGroups";
import MyGroups from "../pages/MyGroups";
import InfoGroup from "../pages/InfoGroup";
import CreateAdvertiser from "../pages/CreateAdvertiser";
import AdvertiserShowProfile from "../pages/ShowAdvertiserProfile";
import CreateAds from "../pages/CreateAds";
import ListMyAds from "../pages/ListMyAds";
import AdsByGroup from "../pages/AdsByGroup";
import ListPlans from "../pages/ListPlans";
import ListFreeAds from "../pages/ListFreeAds";
import CreateFreeAds from "../pages/CreateFreeAds";
import MyFreeAds from "../pages/MyFreeAds";
import ListPointAds from "../pages/ListPointAds";
import CreatePointAds from "../pages/CreatePointAds";
import UpdatePointAds from "../pages/UpdatePointAds";
import CreditPoint from "../pages/CreditPoint";
import DebitPoint from "../pages/DebitPoint";
import SponsoredAds from "../pages/SponsoredAds";
import CreateSponsoredAds from "../pages/CreateSponsoredAds";
import ListAdvertisers from "../pages/ListAdvertisers";
import CreateUserAndAdvertiser from "../pages/CreateUserAndAdvertiser";
import ListAds from "../pages/ListAds";
import InitialPageGroup from "../pages/InitialPageGroup";
import MainMenu from "../pages/MainMenu";
import ListFavoriteAdvertisers from "../pages/ListFavoriteAdvertisers";
import ListGroupMembers from "../pages/ListGroupMembers";
import Profile from "../pages/Profile";
import UserFreeAds from "../pages/UserFreeAds";
import AdLikes from "../pages/AdLikes";
import MyPoints from "../pages/MyPoints";
import ShowAdvertiserProfile from "../pages/ShowAdvertiserProfile";
import ShowOneAds from "../pages/ShowOneAds";
import InitialPageFreeAds from "../pages/InitialPageFreeAds";
import ShowOneFreeAds from "../pages/ShowOneFreeAds";
import ListGenericFreeAds from "../pages/ListGenericFreeAds";
import ListDebitPointAds from "../pages/ListDebitPointAds";
import MyAdvertiserProfile from "../pages/MyAdvertiserProfile";
import HomeAdmin from "../pages/HomeAdmin";
import CreateAdmin from "../pages/CreateAdmin";
import ListAdmins from "../pages/ListAdmins";
import ListPlansAdmin from "../pages/ListPlansAdmin";
import ListUsers from "../pages/ListUsers";
import CreateGroupMember from "../pages/CreateGroupMember";
import CreateSimpleUserByList from "../pages/CreateSimpleUserByList";
import CreateSimpleUser from "../pages/CreateSimpleUser";
import Emails from "../pages/Emails";
import Pages from "../pages/Pages";
import UpdatePage from "../pages/UpdatePage";
import Contact from "../pages/Contact";
import AboutWhichIs from "../pages/AboutWhichIs";
import AboutApp from "../pages/AboutApp";
import { createDrawerNavigator, useIsDrawerOpen } from '@react-navigation/drawer';
import homeImg from "../assets/menu/HOME.png";
import myProfileImg from "../assets/menu/MEU-PERFIL.png";
import groupsImg from "../assets/menu/GRUPOS.png";
import freeAdsImg from "../assets/menu/CLASSIFICADOS.png";
import pointsImg from "../assets/menu/VALE-PONTOS.png";
import beAnAdvertiserImg from "../assets/menu/SEJA-UM-ANUNCIANTE.png";
import createGroupImg from "../assets/menu/CRIE-SEU-GRUPO.png";
import aboutWhichIsImg from "../assets/menu/SOBRE-WHICH-IS.png";
import logoutImg from "../assets/menu/SAIR.png";
import legalImg from "../assets/menu/LEGAL.png";
import pointImg from "../assets/menu/PONTOS.png";
import blockAccountImg from "../assets/menu/BLOCK-ACCOUNT.png";
import footerLogo from "../assets/footer-logo.png";
import cellphone from "../assets/phone.png";
import emailImg from "../assets/email.png";
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Drawer,
  Divider,
} from 'react-native-paper';
import {loadMainProfile, logout, blockMyAccount, getLikedAds, getLikedFreeAds, mainColor, myProfile} from "../utils/Util";
import AsyncStorage from "@react-native-community/async-storage";
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/auth';

const Stack = createStackNavigator();
const Auth = createDrawerNavigator();
const AuthRoutes: React.FC = () => {

    //alert(profile);
  return <Auth.Navigator
        drawerType={'front' }
        drawerStyle={{ width: '80%' }}
        drawerPosition="left"
        drawerContent={(props) =>  <DrawerContent {...props}  /> }
    >
        <Auth.Screen name="SignIn" component={SignIn}/>
        <Auth.Screen name="Login" component={Login}/>
        <Auth.Screen name="SignUp" component={SignUp}/>
        <Auth.Screen name="PasswordReset" component={PasswordReset}/>
        <Auth.Screen name="NewPassword" component={NewPassword}/>
        <Auth.Screen name="MyProfile" component={MyProfile}/>
        <Auth.Screen name="EditMyProfile" component={EditMyProfile}/>
        <Auth.Screen name="UpdatePassword" component={UpdatePassWord}/>
        <Auth.Screen name="CreatePlan" component={CreatePlan}/>
        <Auth.Screen name="CreateSegment" component={CreateSegment}/>
        <Auth.Screen name="ListSegments" component={ListSegments}/>
        <Auth.Screen name="CreateGroup" component={CreateGroup}/>
        <Auth.Screen name="ListGroups" component={ListGroups}/>
        <Auth.Screen name="MyGroups" component={MyGroups}/>
        <Auth.Screen name="InfoGroup" component={InfoGroup}/>
        <Auth.Screen name="CreateAdvertiser" component={CreateAdvertiser}/>
        <Auth.Screen name="AdvertiserShowProfile" component={AdvertiserShowProfile}/>
        <Auth.Screen name="CreateAds" component={CreateAds}/>
        <Auth.Screen name="ListMyAds" component={ListMyAds}/>
        <Auth.Screen name="AdsByGroup" component={AdsByGroup}/>
        <Auth.Screen name="ListPlans" component={ListPlans}/>
        <Auth.Screen name="ListFreeAds" component={ListFreeAds}/>
        <Auth.Screen name="MyFreeAds" component={MyFreeAds}/>
        <Auth.Screen name="ListPointAds" component={ListPointAds}/>
        <Auth.Screen name="CreatePointAds" component={CreatePointAds}/>
        <Auth.Screen name="UpdatePointAds" component={UpdatePointAds}/>
        <Auth.Screen name="CreditPoint" component={CreditPoint}/>
        <Auth.Screen name="DebitPoint" component={DebitPoint}/>
        <Auth.Screen name="SponsoredAds" component={SponsoredAds}/>
        <Auth.Screen name="CreateSponsoredAds" component={CreateSponsoredAds}/>
        <Auth.Screen name="ListAdvertisers" component={ListAdvertisers}/>
        <Auth.Screen name="CreateUserAndAdvertiser" component={CreateUserAndAdvertiser}/>
        <Auth.Screen name="ListAds" component={ListAds}/>
        <Auth.Screen name="InitialPageGroup" component={InitialPageGroup}/>
        <Auth.Screen name="MainMenu" component={MainMenu}/>
        <Auth.Screen name="ListFavoriteAdvertisers" component={ListFavoriteAdvertisers}/>
        <Auth.Screen name="ListGroupMembers" component={ListGroupMembers}/>
        <Auth.Screen name="Profile" component={Profile}/>
        <Auth.Screen name="UserFreeAds" component={UserFreeAds}/>
        <Auth.Screen name="AdLikes" component={AdLikes}/>
        <Auth.Screen name="MyPoints" component={MyPoints}/>
        <Auth.Screen name="ShowAdvertiserProfile" component={ShowAdvertiserProfile}/>
        <Auth.Screen name="ShowOneAds" component={ShowOneAds}/>
        <Auth.Screen name="ShowOneFreeAds" component={ShowOneFreeAds}/>
        <Auth.Screen name="InitialPageFreeAds" component={InitialPageFreeAds}/>
        <Auth.Screen name="ListGenericFreeAds" component={ListGenericFreeAds}/>
        <Auth.Screen name="ListDebitPointAds" component={ListDebitPointAds}/>
        <Auth.Screen name="MyAdvertiserProfile" component={MyAdvertiserProfile}/>
        <Auth.Screen name="HomeAdmin" component={HomeAdmin}/>
        <Auth.Screen name="CreateAdmin" component={CreateAdmin}/>
        <Auth.Screen name="ListAdmins" component={ListAdmins}/>
        <Auth.Screen name="ListPlansAdmin" component={ListPlansAdmin}/>
        <Auth.Screen name="ListUsers" component={ListUsers}/>
        <Auth.Screen name="CreateGroupMember" component={CreateGroupMember}/>
        <Auth.Screen name="CreateSimpleUserByList" component={CreateSimpleUserByList}/>
        <Auth.Screen name="CreateSimpleUser" component={CreateSimpleUser}/>
        <Auth.Screen name="Emails" component={Emails}/>
        <Auth.Screen name="Pages" component={Pages}/>
        <Auth.Screen name="UpdatePage" component={UpdatePage}/>
        <Auth.Screen name="Contact" component={Contact}/>
        <Auth.Screen name="AboutWhichIs" component={AboutWhichIs}/>
        <Auth.Screen name="AboutApp" component={AboutApp}/>

    </Auth.Navigator>
};

function DrawerContent(props) {


  const [profile, setProfile] = useState({});
  const { user} = useAuth();
  const loadProfile = async () => {
    const loadedProfile = await loadMainProfile(false);
    setProfile(loadedProfile);
  }

  useEffect(function(){
    loadProfile();
  });

  const loadLikedFreeAds = async () => {

    const pageTitle = 'CLASSIFICADOS MARCADOS-LEGAL'

    const freeAds = await getLikedFreeAds();

    await AsyncStorage.setItem('listGenericFreeAdsTitle', pageTitle);
    await AsyncStorage.setItem('listGenericFreeAds', JSON.stringify(freeAds));

    return props.navigation.navigate('ListGenericFreeAds');

  }

  const blockAccount = async () => {
    const result = await blockMyAccount()

    if (!result) {
        return;
    }
    return props.navigation.navigate('SignIn');
  }

  const runLogout = () => {
    logout();
    return props.navigation.navigate('SignIn');
  };

  const loadLikedAds = async () => {
    const pageTitle = 'ANÚNCIOS MARCADOS-LEGAL'
    const ads = await getLikedAds();
    await AsyncStorage.setItem('adsPageTitle', pageTitle);
    await AsyncStorage.setItem('adsPageList', JSON.stringify(ads));

    return props.navigation.navigate('ListAds');
}

if(profile == null || profile == undefined){
  return <View></View>
}else {
    return (

      <DrawerContentScrollView {...props}
      style={{display: profile != null && profile != undefined ? 'flex' : 'none'}}
      >
      <View
        style={
          styles.drawerContent
        }
      >

        <View style={styles.row}>
          <View style={styles.userInfoSection}>
            <Title style={styles.title}>{profile?.name}</Title>
          </View>
          <View style ={styles.avatar} >
            <View style={{borderColor:"black", borderWidth:5, borderRadius: 45}}>
            <Avatar.Image
            source={profile?.profile_img_url != null ? {uri: profile.profile_img_url}  :aboutWhichIsImg}
            size={75}
            style={{height:76, width:76, }}
          />
            </View>
          </View>
        </View>
        <View style={styles.profileData} >

          <Text style={styles.details}>
            <Image  source={cellphone} style={{height: 18, width:18,
            resizeMode: "cover",
            tintColor: "white",marginLeft: 2, padding: 10}}></Image>
            {" "}{ profile?.cellphone}
          </Text>
          <Divider style={styles.divider}></Divider>
          <Text style={styles.details}>
          <Image  source={emailImg} style={{height: 18, width:18,
            resizeMode: "contain",
            tintColor: "white",marginLeft: 2, padding: 10}}></Image>
            {" "}{profile?.email}
          </Text>
        </View>
        <Drawer.Section title="PERFIL USUÁRIO" >
        <Drawer.Item
          label="HOME"
          onPress = {()=>{props.navigation.navigate('InitialPageGroup')}}
          style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={homeImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }

          />

        <Drawer.Item
          label="GRUPOS"
          onPress = {()=>{props.navigation.navigate('ListGroups')}}
          style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={groupsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }

          />
          <Drawer.Item
          label="CLASSIFICADOS"
          onPress = {()=>{props.navigation.navigate('ListFreeAds')}}
          style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={freeAdsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />
          <Drawer.Item
            label="MEUS PONTOS"
            onPress = {()=>{props.navigation.navigate("MyPoints")}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={pointImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

          <Drawer.Item
            label="EDITAR PERFIL"
            onPress = {()=>{props.navigation.navigate('EditMyProfile')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />
        <Drawer.Item
            label="ALTERAR SENHA"
            onPress = {()=>{props.navigation.navigate('UpdatePassword')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

        <Drawer.Item
          label="EMPRESAS FAVORITAS"
          onPress = {()=>{
            props.navigation.navigate('ListFavoriteAdvertisers')
          }}
          style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={aboutWhichIsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }

          />
          <Drawer.Item
            label="SEJA UM ANUNCIANTE"
            onPress={() => props.navigation.navigate('CreateAdvertiser')}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={freeAdsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
            />


          <Drawer.Item
            label="ANÚNCIOS MARCADOS LEGAL"
            onPress = {()=>{loadLikedAds()}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={freeAdsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
            />
          <Drawer.Item
              label="CLASSIFICADOS MARCADO LEGAL"
              onPress = {()=>{loadLikedFreeAds()}}
              style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={legalImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
            />
          <Drawer.Item
            label="DESATIVAR CONTA"
            onPress = {()=>{blockAccount()}}
            style={styles.labelStyle }
            icon={({color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={blockAccountImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />
          <Drawer.Item
            label="CONTATO"
            onPress = {()=>{props.navigation.navigate('Contact')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />
        <Drawer.Item
            label="SOBRE A WHICH IS"
            onPress = {()=>{props.navigation.navigate('AboutWhichIs')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

        <Drawer.Item
            label="SOBRE APP"
            onPress = {()=>{props.navigation.navigate('AboutApp')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />


        </Drawer.Section>


        <Drawer.Section title="PERFIL ANUNCIANTE"
        style={{display: profile.isAdvertiser ? 'flex' : 'none'}}
        >
          <Drawer.Item
            label="MINHA CONTA"
            onPress = {()=>{props.navigation.navigate('MyAdvertiserProfile')}}
            style={styles.labelStyle }

            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={myProfileImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

          <Drawer.Item
            label="MEUS ANÚNCIOS"
            onPress = {()=>{props.navigation.navigate("ListMyAds")}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={aboutWhichIsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

          <Drawer.Item
            label="GERENCIAR PONTOS"
            onPress = {()=>{props.navigation.navigate("ListPointAds")}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={pointImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

          <Drawer.Item
            label="ALTERAR PLANO"
            onPress = {()=>{props.navigation.navigate('ListPlans')}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={pointImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          />

          {/* <Drawer.Item
            label="SEGUIDORES"
            onPress = {()=>{}}
            style={styles.labelStyle }
            icon={({  color, size }) =>
              <Image
              height={size}
              width={size}
              resizeMethod="auto"
              source={groupsImg}
              style={{height: 25, width:25, resizeMode:'contain',
             marginRight: -20}}
            />
          }
          /> */}
        </Drawer.Section>
        <Drawer.Section  style={{display: profile.isAdmin ? 'flex' : 'none'}} title="ADMINSTRADOR" >
            <Drawer.Item
              label="ANÚNCIOS"
              onPress = {()=>{props.navigation.navigate("SponsoredAds")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="GRUPOS"
              onPress = {()=>{props.navigation.navigate("ListGroups")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="ANUNCIANTES"
              onPress = {()=>{props.navigation.navigate("ListAdvertisers")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="USUÁRIOS"
              onPress = {()=>{props.navigation.navigate("ListUsers")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="SEGMENTOS"
              onPress = {()=>{props.navigation.navigate("ListSegments")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="CONFIGURAÇÕES"
              onPress = {()=>{props.navigation.navigate("Emails")}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />
            <Drawer.Item
              label="TEXTOS"
              onPress = {()=>{props.navigation.navigate('Pages')}}
              style={styles.labelStyle }
              icon={({  color, size }) =>
                <Image
                height={size}
                width={size}
                resizeMethod="auto"
                source={pointImg}
                style={{height: 25, width:25, resizeMode:'contain',
              marginRight: -20}}
              />
            }
            />

        </Drawer.Section>
        <Image source={footerLogo} style={{width: "100%", height:100, resizeMode: "center"}}/>

      </View>

    </DrawerContentScrollView>
  );
  }
}

function StackLogin(props) {
  return (<Stack.Screen name="Login"  component={Login} />);
}
function StackSignIn(props) {
  return (<Stack.Screen name="SignIn"  component={SignIn} />);

}

const styles = StyleSheet.create({
  drawerContent: {
     flex: 1,
     position:"relative",
     top: 10
   },
  userInfoSection: {
    width:"50%",
    marginTop:10,
    paddingLeft: 20,
  },
  avatar: {
    position:"relative",
    top: 20,
    right:20,
    zIndex:1000,
    width: "60%",
    marginTop:0,
    alignItems:"center",
    alignContent:"space-around",
    justifyContent:"space-around"
  },
  title: {
    marginTop: 30,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 5,
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
    //marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
    flex:1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  labelStyle : {
    width:"100%",
    overflow:"visible",
    flex:1,
    //flexDirection: 'row',
    justifyContent: 'flex-start',
    //marginRight:0
  },
  profileData: {
    paddingLeft: 20,
    padding:5,
    width: "95%",

  },
  details: {
    height: 35,
    alignItems:"center",
    alignContent:"center",
    backgroundColor:mainColor,
    padding:5,
    color: "white"

  },
  divider: {
     borderColor: "white",
     borderWidth:0.5
  }
});

export default AuthRoutes;
