import React, {useEffect, useState} from "react";
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Menu, MenuLabel} from "./styles";

import {Dimensions} from 'react-native'
import {loadMainProfile, logout, mainColor} from "../../utils/Util";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import homeImg from "../../assets/menu/HOME.png";
import myProfileImg from "../../assets/menu/MEU-PERFIL.png";
import groupsImg from "../../assets/menu/GRUPOS.png";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import pointsImg from "../../assets/menu/VALE-PONTOS.png";
import beAnAdvertiserImg from "../../assets/menu/SEJA-UM-ANUNCIANTE.png";
import createGroupImg from "../../assets/menu/CRIE-SEU-GRUPO.png";
import aboutWhichIsImg from "../../assets/menu/SOBRE-WHICH-IS.png";
import logoutImg from "../../assets/menu/SAIR.png";


const window = Dimensions.get('window');

const MainMenu: React.FC = () => {
    const navigation = useNavigation();

    const [profile, setProfile] = useState({});

    const loadProfile = async () => {
        let profile = await loadMainProfile();
        await setProfile(profile);
        return profile;
    }

    const runLogout = () => {
        logout();
        return navigation.navigate('SignIn');
    };

    useEffect(function () {
        loadProfile();
    }, []);

    return (
        <>

            <View style={{
                flexDirection: 'row',
                backgroundColor: "white",

            }}>
                <View style={{padding: 15, width: window.width * 0.233}}>

                </View>
                <View>
                    <View style={{width: window.width * 0.533, height: window.height * 0.1, alignItems: "flex-end"}}>

                    </View>
                </View>
                <View style={{padding: 15, width: window.width * 0.233, alignItems: "flex-end"}}>
                    <Icon name="align-justify"
                          size={30}
                          color={mainColor}
                          onPress={() => navigation.goBack()}
                    />
                </View>

            </View>
            <Container>


                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                    <Container>

                        <Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('HomeAdmin')}
                                        >
                                            Admin
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={aboutWhichIsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        {/*<Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row'*/}
                        {/*    }}>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>*/}
                        {/*                <MenuLabel*/}
                        {/*                    onPress={() => navigation.navigate('InitialPageFreeAds')}*/}
                        {/*                >*/}
                        {/*                    Home Classificados*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}

                        {/*        <View style={{width: window.width * 0.10, height: 30}}>*/}
                        {/*            <Image source={aboutWhichIsImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}

                        {/*    </View>*/}
                        {/*</Menu>*/}

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('InitialPageGroup')}
                                        >
                                            Home
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={homeImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('MyProfile')}
                                        >
                                            Meu perfil
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={myProfileImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('ListGroups')}
                                        >
                                            Grupos
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={groupsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('ListFreeAds')}
                                        >
                                            Classificados
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={freeAdsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        {/*<Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row'*/}
                        {/*    }}>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>*/}
                        {/*                <MenuLabel*/}
                        {/*                    onPress={() => navigation.navigate('ListSegments')}*/}
                        {/*                >*/}
                        {/*                    Segmentos*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}

                        {/*        <View style={{width: window.width * 0.10, height: 30}}>*/}
                        {/*            <Image source={freeAdsImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}

                        {/*    </View>*/}
                        {/*</Menu>*/}

                        {/*<Menu style={{display: profile.isAdmin ? 'flex' : 'none'}}>*/}
                        {/*    <View style={{*/}
                        {/*        flexDirection: 'row'*/}
                        {/*    }}>*/}
                        {/*        <View>*/}
                        {/*            <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>*/}
                        {/*                <MenuLabel*/}
                        {/*                    onPress={() => navigation.navigate('ListSegments')}*/}
                        {/*                >*/}
                        {/*                    Usuários*/}
                        {/*                </MenuLabel>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}

                        {/*        <View style={{width: window.width * 0.10, height: 30}}>*/}
                        {/*            <Image source={groupsImg}*/}
                        {/*                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>*/}
                        {/*        </View>*/}

                        {/*    </View>*/}
                        {/*</Menu>*/}

                        <Menu style={{display: profile.isAdvertiser ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('ListMyAds')}
                                        >
                                            Meus Anúncios
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={freeAdsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu style={{display: profile.isAdvertiser ? 'flex' : 'none'}}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('ListPointAds')}
                                        >
                                            Gerenciar pontos
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={freeAdsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 35, alignItems: "flex-end", }}>
                                        <TouchableOpacity >
                                        <MenuLabel

                                            onPress={() =>{
                                              navigation.navigate('MyPoints');}}
                                        >
                                            {profile.isAdvertiser ? 'Meus pontos' : ' Vales Pontos'}
                                        </MenuLabel>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={pointsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu style={{
                            display: profile === null || profile.advertiser_id !== null
                                ? "none"
                                : "flex",

                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('CreateAdvertiser')}
                                        >
                                            Seja um Anunciante
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={beAnAdvertiserImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('CreateGroup')}
                                        >
                                            Crie seu grupo
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={createGroupImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('AboutWhichIs')}
                                        >
                                            Sobre Which Is
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={aboutWhichIsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => navigation.navigate('AboutApp')}
                                        >
                                            Sobre App
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={aboutWhichIsImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>

                        <Menu>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <View style={{width: window.width * 0.88, height: 30, alignItems: "flex-end"}}>
                                        <MenuLabel
                                            onPress={() => runLogout()}
                                        >
                                            Sair
                                        </MenuLabel>
                                    </View>
                                </View>

                                <View style={{width: window.width * 0.10, height: 30}}>
                                    <Image source={logoutImg}
                                           style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                                </View>

                            </View>
                        </Menu>


                    </Container>
                </KeyboardAwareScrollView>
            </Container>

        </>
    )
        ;
}

export default MainMenu;
