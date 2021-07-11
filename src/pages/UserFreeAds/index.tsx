import {Alert, FlatList, Image, Share, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useState} from "react";
import {Label} from "../ListMyAds/styles";
import {loadFreeAdsByUserId, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";

const window = Dimensions.get('window');


const UserFreeAds: React.FC = () => {
    const navigation = useNavigation();
    const [freeAds, setFreeAds] = useState([]);

    const [profile, setProfile] = useState({});

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o classificado de ${item.user}: ${item.title} - no app Which Is`,
        });
    }

    const showOneAds = async (ads) => {
        await AsyncStorage.setItem('showFreeAds', JSON.stringify(ads));
        await AsyncStorage.setItem('showFreeAdsTitle', `CLASSIFICADO DE ${profile.name}`);
        navigation.navigate('ShowOneFreeAds');
    }


    const loadFreeAds = async () => {
        const profileAsString = await AsyncStorage.getItem('showUserFreeAds');

        if (profileAsString === null) {
            Alert.alert('Ops', 'Não conseguimos encontrar informações sobre o partipante!');
            return;
        }

        const profile = await JSON.parse(profileAsString);

        await setProfile(profile);

        const freeAds = await loadFreeAdsByUserId(profile.id);

        setFreeAds(freeAds);
    };

    useEffect(function () {
        loadFreeAds();
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
                          onPress={() => navigation.openDrawer()()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>


                <Container style={{backgroundColor: "#FFF"}}>

                    <View>
                        <Title>Classificados De {profile.name}</Title>
                    </View>

                    <FlatList data={freeAds} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      flexDirection: 'row',
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10
                                  }}
                                        onTouchEnd={() => showOneAds(item)}
                                  >
                                      <View style={{width: window.width * 0.2}}>
                                          <Image
                                              source={{uri: item.imgs.length > 0 ? item.imgs[0] : undefined}}
                                                 style={{
                                                     width: 100,
                                                     height: 80,
                                                     resizeMode: "cover",
                                                     backgroundColor: 'white'
                                                 }}/>
                                      </View>
                                      <View style={{width: window.width * 0.56, marginLeft: 30}}>
                                          <View style={{
                                              flexDirection: 'row',
                                          }}>
                                              <Label style={{
                                                  width: window.width * 0.5,
                                                  fontWeight: 'bold',
                                              }}>{item.title}</Label>

                                              <View>
                                                  <Icon name="share-2"
                                                        size={20}
                                                        color="white"
                                                        onPress={() => sharedAds(item)}
                                                  />
                                              </View>

                                          </View>
                                          <Label>{item.description}</Label>
                                      </View>
                                  </View>
                              }/>

                </Container>
                <Footer/>
            </KeyboardAwareScrollView>

            <View style={{
                backgroundColor: "white",
                paddingTop: 10,
                paddingBottom: 30,
                borderTopWidth: .5,
                borderColor: "#666",
            }}>

                <View style={{
                    flexDirection: 'row'
                }}>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreateFreeAds')}
                    >
                        <View>
                            <Image source={freeAdsImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    CRIAR CLASSIFICADOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('MyFreeAds')}
                    >
                        <View>
                            <Image source={freeAdsImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    MEUS CLASSIFICADOS
                                </Label>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

export default UserFreeAds;
