import React, {useEffect, useState} from "react";
import {Alert, FlatList, Image, Modal, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {changeStatusAdvertiser, getAllAdvertisers, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import addAdvertiserImg from "../../assets/menu/CLASSIFICADOS.png";
import plansImg from "../../assets/menu/SOBRE-WHICH-IS.png";
import AsyncStorage from "@react-native-community/async-storage";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";
import {styles} from "../ListMyAds/styles";

const window = Dimensions.get('window');


const ListAdvertisers: React.FC = () => {

    const navigation = useNavigation();
    const [advertisers, setAdvertisers] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);


    const loadAdvertisers = async () => {
        const advertisers = await getAllAdvertisers();
        setAdvertisers(advertisers);
    };

    const showProfile = async (advertiser) => {
        await AsyncStorage.setItem('showAdvertiser', JSON.stringify(advertiser));
        return navigation.navigate('ShowAdvertiserProfile');
    };

    const [currentAdvertiser, setCurrentAdvertiser] = useState(null);

    const showModal = async (advertiser) => {
        console.log(advertiser);
        await setCurrentAdvertiser(advertiser);
        setVisibleModal(true);
    };

    const hideModal = () => {
        setVisibleModal(false)
    };

    const updateAdvertiser = async (advertiser) => {

        const updatedProfile = await changeStatusAdvertiser(advertiser.id, advertiser.status !== true);

        if (!updatedProfile) {
            Alert.alert('Ocorreu um erro', 'Não foi possível atualizar o anunciante');
            return;
        }

        await loadAdvertisers();
    }

    useEffect(function () {
        loadAdvertisers();
    }, [])

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
                          await updateAdvertiser(currentAdvertiser);
                          hideModal();
                      }}
                >

                    <Button>
                        <Text style={styles.btnText}>
                            {currentAdvertiser?.status === true ? 'Ativar' : 'Desativar'}
                        </Text>
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
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <Title>ANUNCIANTES</Title>

                    <FlatList data={advertisers} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 5,
                                      marginBottom: 10
                                  }}>
                                      <View style={{
                                          flexDirection: 'row'
                                      }}>
                                          <View style={{width: window.width * 0.5}}>
                                              <Label style={{fontWeight: "bold"}}>
                                                  {item.trading_name}
                                              </Label>
                                          </View>
                                          <View style={{width: window.width * 0.25, marginLeft: 10, marginRight: 10}}>
                                              <Label style={{
                                                  fontWeight: 'bold',
                                                  backgroundColor: '#333',
                                                  padding: 3,
                                                  fontSize: 10,
                                                  textAlign: "center"
                                              }}
                                                     onPress={() => {showProfile(item)}}
                                              >Ver Perfil</Label>
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
                          onTouchEnd={() => navigation.navigate('CreateUserAndAdvertiser')}
                    >
                        <View>
                            <Image source={addAdvertiserImg}
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
                                    ADICIONAR ANUNCIANTE
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('ListPlansAdmin')}
                    >
                        <View>
                            <Image source={plansImg}
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
                                    PLANOS
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>

        </>
    );
}

export default ListAdvertisers;
