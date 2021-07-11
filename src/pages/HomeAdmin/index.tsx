import React, {useEffect, useState} from "react";
import {Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {loadMainProfile, mainColor} from "../../utils/Util";

const window = Dimensions.get('window');

const HomeAdmin: React.FC = () => {
    const navigation = useNavigation();

    const [profile, setProfile] = useState({});

    const loadProfile = async () => {
        const p = await loadMainProfile();
        setProfile(p)
    }

    const redirect = (page) => {
        navigation.navigate(page);
    };

    useEffect(function () {
        loadProfile();
    }, []);

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
                          onPress={() => navigation.openDrawer()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <View>
                        <Title>BEM VINDO, </Title>
                        <Text
                            style={{
                                marginTop: -30,
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        >{profile?.name}</Text>
                    </View>

                    <Container style={{
                        marginTop: 40,
                    }}>
                        <Label style={{textAlign: 'center'}}
                               onPress={() => redirect('SponsoredAds')}>ANÚNCIOS</Label>
                        <Label style={{textAlign: 'center'}} onPress={() => redirect('ListGroups')}>GRUPOS</Label>
                        <Label style={{textAlign: 'center'}}
                               onPress={() => redirect('ListAdvertisers')}>ANUNCIANTES</Label>
                        <Label style={{textAlign: 'center'}} onPress={() => redirect('ListUsers')}>USUÁRIOS</Label>
                        <Label style={{textAlign: 'center'}} onPress={() => redirect('ListSegments')}>SEGMENTOS</Label>
                        <Label style={{textAlign: 'center'}} onPress={() => redirect('Emails')}>CONFIGURAÇÕES</Label>
                        <Label style={{textAlign: 'center'}} onPress={() => redirect('Pages')}>TEXTOS</Label>
                    </Container>

                </Container>
            </KeyboardAwareScrollView>

        </>
    );
}

export default HomeAdmin;
