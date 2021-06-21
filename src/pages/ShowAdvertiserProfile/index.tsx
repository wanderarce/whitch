import React, {useEffect, useState} from "react";
import {Alert, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {AdvertiserView, Container, Label, Menu, MenuLabel, Title} from "./styles";

import {Dimensions} from 'react-native'

import logoImg from "../../assets/logo-dark-fonte.png";
import logoCircle from "../../assets/logo-circle.png";
import {getAdsByAdvertiserId, getAdvertiser, mainColor} from "../../utils/Util";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');

interface AdvertiserInfo {
    company_name: string,
    trading_name: string,
    registered_number: string,
    phone: string,
    address: string,
    email: string,
    plano: string,
}

const advertiserLoading: AdvertiserInfo = () => {

    const advertiser: AdvertiserInfo = {
        company_name: 'Carregando....',
        trading_name: 'Carregando....',
        registered_number: 'Carregando....',
        phone: 'Carregando....',
        address: 'Carregando....',
        email: 'Carregando....',
        plano: 'Carregando....',
    }

    return advertiser;
};

const ShowAdvertiserProfile: React.FC = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({});
    const [advertiser, setAdvertiser] = useState({});

    const loadAndRedirectToList = async () => {


        const pageTitle = advertiser.trading_name === 'Carregando....'
            ? 'ANÚNCIOS'
            : `ANÚNCIOS DE ${advertiser.trading_name.toUpperCase()}`;

        const ads = await getAdsByAdvertiserId(advertiser.id);

        await AsyncStorage.setItem('adsPageTitle', pageTitle);
        await AsyncStorage.setItem('adsPageList', JSON.stringify(ads));

        return navigation.navigate('ListAds');
    };

    const loadAdvertiser = async (id: number) => {
        const advertiser = await getAdvertiser(id);

        if (!user) {
            Alert.alert('Error', 'Ops não conseguimos carregar informações do anunciante, por favor tente novamente')
            navigation.goBack();
        }

        setAdvertiser(advertiser);
    };

    const loadAdvertiserProfile = async () => {
        const advertiserString = await AsyncStorage.getItem('showAdvertiser');
        const advertiser = JSON.parse(advertiserString);

        setAdvertiser(advertiser);

        loadAdvertiser(advertiser.id);
    };

    useEffect(function () {
        setAdvertiser(advertiserLoading);
        loadAdvertiserProfile();
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
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}
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
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}
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
                            fontSize: 18,
                        }}
                        >
                            {advertiser.trading_name}
                        </Title>
                        <View style={{
                            backgroundColor: mainColor,
                            width: "176%",
                            borderRadius: 3,
                            paddingLeft: 5,
                            paddingBottom: 10,
                        }}>
                            <AdvertiserView>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="phone"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> TELEFONE: </Label>{advertiser.phone}
                                </Title>
                            </AdvertiserView>

                            <AdvertiserView>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="map-pin"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> ENDEREÇO: </Label> {advertiser.address}
                                </Title>
                            </AdvertiserView>

                            <AdvertiserView>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="mail"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> E-MAIL: </Label>{advertiser.email}
                                </Title>
                            </AdvertiserView>

                            <AdvertiserView>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="crosshair"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> SEGMENTO: </Label> {advertiser.segment}
                                </Title>
                            </AdvertiserView>

                            {/*<AdvertiserView>*/}

                            {/*    <Title style={{lineHeight: 23}}>*/}
                            {/*        <Icon name="sidebar"*/}
                            {/*              size={18}*/}
                            {/*              color="#FFF"*/}
                            {/*              style={{lineHeight: 20}}*/}
                            {/*        />*/}
                            {/*        <Label> CNPJ: </Label>{advertiser.registered_number}*/}
                            {/*    </Title>*/}
                            {/*</AdvertiserView>*/}

                            {/*<AdvertiserView>*/}

                            {/*    <Title style={{lineHeight: 23}}>*/}
                            {/*        <Icon name="home"*/}
                            {/*              size={20}*/}
                            {/*              color="#FFF"*/}
                            {/*              style={{lineHeight: 23}}*/}
                            {/*        />*/}
                            {/*        <Label> RAZAO SOCIAL: </Label> {advertiser.company_name}*/}
                            {/*    </Title>*/}
                            {/*</AdvertiserView>*/}


                            {/*<AdvertiserView>*/}

                            {/*    <Title style={{lineHeight: 23}}>*/}
                            {/*        <Icon name="dollar-sign"*/}
                            {/*              size={20}*/}
                            {/*              color="#FFF"*/}
                            {/*              style={{lineHeight: 23}}*/}
                            {/*        />*/}
                            {/*        <Label> MEU PLANO: </Label> {advertiser.plano}*/}
                            {/*    </Title>*/}
                            {/*</AdvertiserView>*/}


                            <View style={
                                {
                                    alignItems: "center",
                                    paddingTop: 20,
                                    paddingBottom: 5,
                                }
                            }>
                                <Label style={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#333',
                                    padding: 10,
                                    fontSize: 10,
                                    textAlign: "center"
                                }}
                                       onPress={() => {
                                           loadAndRedirectToList()
                                       }}
                                >VER ANÚNCIOS</Label>
                            </View>

                        </View>
                    </View>

                    <View style={{width: window.width * 0.4, padding: 15}}>
                        <View style={{width: 130}}>
                            <Image source={logoCircle}
                                   style={{
                                       width: 100,
                                       height: 100,
                                       borderWidth: 4,
                                       borderColor: 'black',
                                       borderRadius: 50,
                                       paddingRight: -10,
                                       marginTop: -10
                                   }}/>
                        </View>
                    </View>

                </View>

                {/*<KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>*/}

                {/*    <Container>*/}

                {/*        <Menu>*/}
                {/*            <View style={{*/}
                {/*                flexDirection: 'row',*/}
                {/*                backgroundColor: "white"*/}
                {/*            }}>*/}
                {/*                <View style={{width: window.width * 0.15, height: 30}}>*/}
                {/*                    <Image source={editProfileImg}*/}
                {/*                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                {/*                </View>*/}
                {/*                <View>*/}
                {/*                    <View style={{width: window.width * 0.85, height: 30}}>*/}
                {/*                        <MenuLabel>EDITAR</MenuLabel>*/}
                {/*                    </View>*/}
                {/*                </View>*/}
                {/*            </View>*/}
                {/*        </Menu>*/}

                {/*        <Menu>*/}
                {/*            <View style={{*/}
                {/*                flexDirection: 'row',*/}
                {/*                backgroundColor: "white"*/}
                {/*            }}>*/}
                {/*                <View style={{width: window.width * 0.15, height: 30}}>*/}
                {/*                    <Image source={tagImg}*/}
                {/*                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                {/*                </View>*/}
                {/*                <View>*/}
                {/*                    <View style={{width: window.width * 0.85, height: 30}}>*/}
                {/*                        <MenuLabel>ALTERAR PLANO</MenuLabel>*/}
                {/*                    </View>*/}
                {/*                </View>*/}
                {/*            </View>*/}
                {/*        </Menu>*/}
                {/*    </Container>*/}
                {/*</KeyboardAwareScrollView>*/}

            </Container>

        </>
    )
        ;
}

export default ShowAdvertiserProfile;
