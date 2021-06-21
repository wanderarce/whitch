import React, {useContext, useEffect, useState} from "react";
import {Alert, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label, Menu, MenuLabel, Title} from "./styles";

import {Dimensions} from 'react-native'
import {UserLoggedContext} from "../../hooks/userLoggedContext";
import {blockMyAccount, getLikedAds, getLikedFreeAds, mainColor, myProfile} from "../../utils/Util";

import logoImg from "../../assets/logo-dark-fonte.png";
import logoCircle from "../../assets/logo-circle.png";
import editProfileImg from "../../assets/edit-profile.png";
import updatePasswordImg from "../../assets/update-password.png";
import favoritesCompanyImg from "../../assets/favorites-company.png";
import blockAccountImg from "../../assets/block-account.png";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');


const MyProfile: React.FC = () => {
    const navigation = useNavigation();
    const [userLogged, setUserLogged] = useContext(UserLoggedContext);
    const [profile, setProfile] = useState({});

    const [cellphoneFormatted, setCellphoneFormatted] = useState('');

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

    const blockAccount = async () => {
        const result = await blockMyAccount()

        if (!result) {
            return;
        }

        return navigation.navigate('SignIn');
    }

    const loadProfile = async () => {

        const profile = await myProfile();

        if (profile === null) {
            Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
            return navigation.navigate('Login');
        }

        onChangeAddMaskCellphone(profile.cellphone);
        setProfile(profile);
    };

    const loadLikedAds = async () => {

        const pageTitle = 'ANÚNCIOS MARCADOS-LEGAL'

        const ads = await getLikedAds();

        await AsyncStorage.setItem('adsPageTitle', pageTitle);
        await AsyncStorage.setItem('adsPageList', JSON.stringify(ads));

        return navigation.navigate('ListAds');

    }

    const loadLikedFreeAds = async () => {

        const pageTitle = 'CLASSIFICADOS MARCADOS-LEGAL'

        const freeAds = await getLikedFreeAds();

        await AsyncStorage.setItem('listGenericFreeAdsTitle', pageTitle);
        await AsyncStorage.setItem('listGenericFreeAds', JSON.stringify(freeAds));

        return navigation.navigate('ListGenericFreeAds');

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
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MainMenu')}
                    />
                </View>
                <View>
                    <View style={{width: window.width * 0.533, height: window.height * 0.1, alignItems: "center"}}>
                        <Image
                            source={logoImg} style={{width: "70%", height: "70%", resizeMode: "contain"}}/>
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
                            fontSize: 26
                        }}
                        >
                            {profile.name}
                        </Title>

                        <View style={{
                            backgroundColor: mainColor,
                            width: "176%",
                            borderRadius: 3,
                            paddingLeft: 5
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                borderBottomColor: '#FFF',
                            }}>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="phone"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> Telefone:</Label> {cellphoneFormatted}
                                </Title>
                            </View>

                            <View style={{flexDirection: 'row'}}>

                                <Title style={{lineHeight: 23}}>
                                    <Icon name="mail"
                                          size={20}
                                          color="#FFF"
                                          style={{lineHeight: 23}}
                                    />
                                    <Label> E-mail:</Label> {profile.email}
                                </Title>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.4, padding: 15}}>
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

                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                    <Container>

                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={editProfileImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('EditMyProfile')}>EDITAR MEU
                                            PERFIL</MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={updatePasswordImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('UpdatePassword')}>ALTERAR
                                            SENHA</MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu style={{display: profile.isAdvertiser ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('MyAdvertiserProfile')}>
                                            VER MEU PERFIL DE ANUNCIANTE
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>


                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={blockAccountImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('ListFavoriteAdvertisers')}>
                                            EMPRESAS FAVORITAS
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => {
                                            loadLikedAds()
                                        }}>ANÚNCIOS MARCADOS-LEGAL</MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>


                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => {
                                            loadLikedFreeAds()
                                        }}>CLASSIFICADOS MARCADOS-LEGAL</MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={blockAccountImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => blockAccount()}>DESATIVAR CONTA</MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('Contact')}>
                                            CONTATO
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('ListAdmins')}>
                                            ADMINISTRADORES
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('Emails')}>
                                            CONFIGURAÇÕES
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>

                        <Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: "white"
                            }}>
                                <View style={{width: window.width * 0.15, height: 30}}>
                                    <Image source={favoritesCompanyImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>
                                <View>
                                    <View style={{width: window.width * 0.85, height: 30}}>
                                        <MenuLabel onPress={() => navigation.navigate('Pages')}>
                                            TEXTOS APP
                                        </MenuLabel>
                                    </View>
                                </View>
                            </View>
                        </Menu>


                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('InitialPageGroup')}>*/}
                        {/*                    Página inicial com grupo*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateUserAndAdvertiser')}>*/}
                        {/*                    Cadastrar novo anunciante*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListAdvertisers')}>*/}
                        {/*                    Anunciantes*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateSponsoredAds')}>*/}
                        {/*                    Criar Anúncios patrocinados*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('SponsoredAds')}>*/}
                        {/*                    Anúncios patrocinados*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}


                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreditPoint')}>*/}
                        {/*                    Creditar pontos*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('DebitPoint')}>*/}
                        {/*                    Resgatar pontos*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListPointAds')}>*/}
                        {/*                    Gerenciar pontos*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreatePointAds')}>*/}
                        {/*                    criar anúncios pontos*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListFreeAds')}>*/}
                        {/*                    Classificados*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateFreeAds')}>*/}
                        {/*                    Criar Classificado*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('MyFreeAds')}>*/}
                        {/*                    Meus Classificados*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreatePlan')}>Criar*/}
                        {/*                    Plano</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateSegment')}>Criar*/}
                        {/*                    Segmento</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListSegments')}>Listar*/}
                        {/*                    Segmentos</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateGroup')}>Criar*/}
                        {/*                    grupo</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListGroups')}>Listar*/}
                        {/*                    grupo</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('MyGroups')}>Meus*/}
                        {/*                    Grupos</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('InfoGroup')}>Informações do*/}
                        {/*                    Grupo</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateAdvertiser')}>Cadastrar*/}
                        {/*                    como*/}
                        {/*                    anunciante</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('AdvertiserShowProfile')}>Ver*/}
                        {/*                    perfil do anunciante</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('CreateAds')}>criar*/}
                        {/*                    anúncio</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListMyAds')}>meus*/}
                        {/*                    anúncios</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        backgroundColor: "white"*/}
                        {/*    }}>*/}
                        {/*        <View style={{width: window.width * 0.15, height: 30}}>*/}
                        {/*            <Image source={blockAccountImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.85, height: 30}}>*/}
                        {/*                <MenuLabel onPress={() => navigation.navigate('ListPlans')}>Listar*/}
                        {/*                    Planos</MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</Menu>*/}


                    </Container>
                    <Footer/>
                </KeyboardAwareScrollView>
            </Container>

        </>
    )
        ;
}

export default MyProfile;
