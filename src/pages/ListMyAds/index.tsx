import React, {useEffect, useState} from "react";
import {Alert, Dimensions, FlatList, Image, Modal, Share, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Label, styles} from "./styles";
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {deleteAdsById, getMyAds, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import createAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
const window = Dimensions.get('window');


const ListMyAds: React.FC = () => {
    const navigation = useNavigation();

    const [ads, setAds] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [currentAds, setCurrentAds] = useState(null);
    const [loading, setLoading] = useState(false);

    const showModal = (ads) => {
        setCurrentAds(ads);
        setVisibleModal(true);
    };

    const hideModal = () => {
        setVisibleModal(false)
    };

    const loadAds = async () => {
        setLoading(true);
        const myAds = await getMyAds();
        console.log('carregou ads');
        setAds(myAds);
        setLoading(false);
    };

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o anúncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`,
        });
    }

    const deleteAds = async () => {
        return await deleteAdsById(currentAds.id);
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
                          onPress={() => navigation.navigate('MyProfile')}
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
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <Title>MEUS ANÚNCIOS</Title>


                    <FlatList data={ads} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      flexDirection: 'row',
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10
                                  }}>
                                      <View style={{width: window.width * 0.2}}>
                                          <Image source={{uri: item.img}}
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

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreateAds')}
                    >
                        <View>
                            <Image source={createAdsImg}
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
                                    CRIAR NOVO ANÚNCIO
                                </Label>
                            </View>
                        </View>
                    </View>


                </View>

            </View>


        </>
    );
}

export default ListMyAds;
