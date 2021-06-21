import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
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

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: '#312e38'}
        }}
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
        <Auth.Screen name="CreateFreeAds" component={CreateFreeAds}/>
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
);

export default AuthRoutes;
