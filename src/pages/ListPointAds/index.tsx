import {Alert, FlatList, Image, Modal, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useState} from "react";
import {Label, styles} from "../ListMyAds/styles";
import {deletePointAdsById, getPointAds, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import createPointAdsImg from "../../assets/menu/SEJA-UM-ANUNCIANTE.png";
import moneyImg from "../../assets/menu/VALE-PONTOS.png";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";
import Loading from '../../components/Loading';
const window = Dimensions.get('window');


const ListPointAds: React.FC = () => {
    const navigation = useNavigation();
    const [ads, setAds] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [currentAds, setCurrentAds] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadAds = async () => {
       setLoading(true);
        const freeAds = await getPointAds();
        console.log(freeAds);

        setAds(freeAds);
        setLoading(false);
    };



    const deleteAds = async () => {
        return await deletePointAdsById(currentAds.id);
    }

    const showModal = (ads) => {
        setCurrentAds(ads);
        setVisibleModal(true);
    };

    const hideModal = () => {
        setVisibleModal(false)
    };


    const loadPointAds = async (id: string) => {
        await AsyncStorage.setItem('currentPointAdsId', id);
        navigation.navigate('UpdatePointAds');
    }

    useEffect(function () {
        loadAds();
    }, []);

    return (
        <>

            <Loading visible={loading}  dismiss={!loading}/>

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
                          await loadAds();
                          navigation.navigate('ListPointAds');
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
                        <Title>GERENCIAR PONTOS</Title>
                    </View>


                    <FlatList data={ads} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      flexDirection: 'row',
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10
                                  }}

                                        onTouchStart={() => {
                                            loadPointAds(item.id.toString())
                                        }
                                        }

                                  >
                                      <View style={{width: window.width * 0.2}}>
                                          <Image source={{uri: item.img}}
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
                                                  width: window.width * 0.52,
                                                  fontWeight: 'bold',
                                              }}>{item.title}</Label>

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

                <View style={{
                    flexDirection: 'row'
                }}>

                    <View style={{width: window.width * 0.333, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreatePointAds')}
                    >
                        <View>
                            <Image source={createPointAdsImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    CRIA ANÚNCIOS PONTOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.333, height: 40}}
                        onTouchEnd={() => navigation.navigate('CreditPoint')}
                    >
                        <View>
                            <Image source={moneyImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    CADASTRAR PONTOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.333, height: 40}}
                        onTouchEnd={() => navigation.navigate('DebitPoint')}
                    >
                        <View>
                            <Image source={moneyImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    RESGATAR PONTOS
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>

        </>
    );
}

export default ListPointAds;
