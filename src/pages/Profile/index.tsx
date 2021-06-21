import React, {useContext, useEffect, useState} from "react";
import {Alert, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label, Title} from "./styles";

import {Dimensions} from 'react-native'
import {UserLoggedContext} from "../../hooks/userLoggedContext";
import {loadUserProfile, mainColor, myProfile} from "../../utils/Util";

import logoImg from "../../assets/logo-dark-fonte.png";
import logoCircle from "../../assets/logo-circle.png";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');


const Profile: React.FC = () => {
    const navigation = useNavigation();
    const [profile, setProfile] = useState({});
    const [cellphoneFormatted, setCellphoneFormatted] = useState('');

    const showMemberFreeAds = async () => {
        await AsyncStorage.setItem('showUserFreeAds', JSON.stringify(profile));
        return navigation.navigate('UserFreeAds');
    }


    const loadProfile = async () => {

        const id = await AsyncStorage.getItem('showUserProfile');

        if(id === null){
            return navigation.goBack();
        }

        const profile = await loadUserProfile(id);
        onChangeAddMaskCellphone(profile.cellphone);

        console.log(profile);

        if (profile === null) {
            return navigation.goBack();
        }

        setProfile(profile);

    };

    const getDDDFormatted = (value) => {

        if (value.length < 3) {
            return '(' + value;
        }

        const ddd = value.substr(0, 2);
        const number = value.substr(2)
        return `(${ddd})${number}`;
    }

    const getFormattedNumber = (value) => {

        if (value.length < 8) {
            return value;
        }
        const valueLength = value.length;
        let firstPart = '';
        let secondPart = '';

        if (valueLength >= 13) {
            firstPart = value.substr(0, 9);
            secondPart = value.substr(9, 4);
        }

        if (valueLength >= 9 && valueLength < 13) {
            firstPart = value.substr(0, 8);
            secondPart = value.substr(8);
        }

        return firstPart.length === 0 && secondPart.length === 0
            ? value
            : firstPart + '-' + secondPart;

    }

    const cleanLoginIdentification = (value) => {
        if (value.includes('(') && value.includes(')')) {
            value = value.replace('-', '');
        }

        return value.replace('(', '').replace(')', '');
    }

    const onChangeAddMaskCellphone = async (inputValue) => {

        let value = cleanLoginIdentification(inputValue);

        value = getDDDFormatted(value);
        value = getFormattedNumber(value);

        setCellphoneFormatted(value);
        return;
    }


    useEffect(function () {

        loadProfile();

    }, [])


    return (
        <>

            <View style={{
                flexDirection: 'row',
                backgroundColor: "white"
            }}>
                <View style={{padding: 15, width: window.width * 0.233}}>
                    <Icon name="chevron-left"
                          size={30}
                          color={mainColor}
                          onPress={() => navigation.goBack()}
                    />
                </View>
                <View>
                    <View style={{width: window.width * 0.533, height: window.height * 0.1, alignItems: "center"}}>
                        <Image source={logoImg} style={{width: "70%", height: "70%", resizeMode: "contain"}}/>
                    </View>
                </View>
                <View style={{padding: 15, width: window.width * 0.233, alignItems: "flex-end"}}>
                    <Icon name="align-justify"
                          size={30}
                          color={mainColor}
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>
            <Container>

                <View style={{
                    flexDirection: 'row',
                    paddingBottom: 20
                }}>
                    <View style={{width: window.width * 0.6, padding: 15}}>
                        <Title style={{
                            textTransform: "uppercase",
                            color: "#000",
                            fontSize: 20
                        }}
                        >
                            {profile.name}
                        </Title>

                        <View style={{
                            backgroundColor: mainColor,
                            width: "176%",
                            borderRadius: 3,
                            paddingLeft: 5,
                        }}>

                            <View style={{flexDirection: 'row', display: profile.public_email ? 'flex': 'none'}}>

                                <Title style={{lineHeight: 30}}>
                                    <Icon name="mail"
                                          size={18}
                                          color="#FFF"
                                    />

                                    <Label> E-mail:</Label> {profile.email}
                                </Title>
                            </View>

                            <View style={{flexDirection: 'row', display: profile.public_cellphone ? 'flex': 'none'}}>

                                <Title style={{lineHeight: 30}}>
                                    <Icon name="phone"
                                          size={18}
                                          color="#FFF"
                                    />

                                    <Label> E-mail:</Label> {cellphoneFormatted}
                                </Title>
                            </View>

                            <View style={{
                                paddingVertical: 10,
                                alignItems: "center",
                            }}>

                                <View style={{
                                    width: window.width * 0.3,
                                    marginLeft: 10
                                }}>
                                    <Label style={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#333',
                                        padding: 3,
                                        fontSize: 10,
                                        textAlign: "center"
                                    }}
                                           onPress={() => showMemberFreeAds()}
                                    >Ver classificados
                                    </Label>
                                </View>

                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.4, padding: 15, marginTop: -30, marginLeft: 10}}>
                        <View style={{width: 130}}>
                            <Image
                                source={profile.profile_img_url ? {uri: profile.profile_img_url} : logoCircle}
                                   style={{
                                       width: 100,
                                       height: 100,
                                       borderRadius: 50,
                                       paddingRight: -10,
                                       borderColor: '#000',
                                       borderWidth: 3
                                   }}/>
                        </View>
                    </View>
                </View>

            </Container>

        </>
    )
        ;
}

export default Profile;
