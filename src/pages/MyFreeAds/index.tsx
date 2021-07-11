import {Alert, FlatList, Image, Modal, Share, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useState} from "react";
import {Label, styles} from "../ListMyAds/styles";
import {deleteFreeAdsById, getMyFreeAds, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import createFreeImg from "../../assets/menu/CLASSIFICADOS.png";
import AsyncStorage from "@react-native-community/async-storage";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";

const window = Dimensions.get('window');


const MyFreeAds: React.FC = () => {
    const navigation = useNavigation();
    const [freeAds, setFreeAds] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [currentAds, setCurrentAds] = useState(null);

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o classificado de ${item.user}: ${item.title} - no app Which Is`,
        });
    }

    const showOneAds = async (ads) => {
        await AsyncStorage.setItem('showFreeAds', JSON.stringify(ads));
        await AsyncStorage.setItem('showFreeAdsTitle', 'MEUS CLASSIFICADOS');
        navigation.navigate('ShowOneFreeAds');
    }

    const loadFreeAds = async () => {
        const freeAds = await getMyFreeAds();
        console.log(freeAds);

        setFreeAds(freeAds);
    };

    const deleteAds = async () => {
        return await deleteFreeAdsById(currentAds.id);
    }

    const showModal = (ads) => {
        setCurrentAds(ads);
        setVisibleModal(true);
    };


    const hideModal = () => {
        setVisibleModal(false)
    };

    useEffect(function () {
        loadFreeAds();
    }, []);

    return (
        <>

            <Modal
                animationType={"slide"}
                transparent={false}
                visible={isVisibleModal}
                onRequestClose={() => {
                    Alert.alert('Modal has now been closed.');
                }}>

                <View style={{alignItems: "center"}}>
                    <Title>Opções</Title>
                </View>

                <Hr/>
                <View style={{
                    alignItems: "center",
                    width: "80%",
                    marginLeft: "10%",
                    marginTop: 20,
                    marginBottom: 80
                }}
                      onTouchEnd={async () => {
                          await deleteAds();
                          await loadFreeAds();
                          navigation.navigate('MyFreeAds');
                          hideModal();
                      }}
                >

                    <Button>
                        <Text style={styles.btnText}>Excluir</Text>
                    </Button>

                </View>
                <Text
                    style={styles.closeText}
                    onPress={() => {
                        hideModal()
                    }}
                >Voltar
                </Text>
            </Modal>


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
                <Container style={{backgroundColor: "#FFF"}}>

                    <View>
                        <Title>Meus Classificados</Title>
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
                                      <View style={{width: window.width * 0.50, marginLeft: 30}}>
                                          <View style={{
                                              flexDirection: 'row',
                                          }}>
                                              <Label style={{
                                                  width: window.width * 0.45,
                                                  fontWeight: 'bold',
                                              }}>{item.title}</Label>

                                              <View style={{marginRight: 10}}>
                                                  <Icon name="share-2"
                                                        size={20}
                                                        color="white"
                                                        onPress={() => sharedAds(item)}
                                                  />
                                              </View>

                                              <View>
                                                  <Icon name="more-vertical"
                                                        size={20}
                                                        color="white"
                                                        onPress={() => {
                                                            showModal(item)
                                                        }}
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


                <View style={{alignItems: 'center'}}>
                    <View style={{
                        width: window.width * 0.4,
                        height: 40,
                    }}
                          onTouchEnd={() => navigation.navigate('CreateFreeAds')}
                    >
                        <View>
                            <Image source={createFreeImg}
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
                                    CRIAR CLASSIFICADO
                                </Label>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </>
    );
}

export default MyFreeAds;
