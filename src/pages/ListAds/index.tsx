import React, {useEffect, useState} from "react";
import {FlatList, Image, Share, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from "../../components/Loading";

const window = Dimensions.get('window');


const ListAds: React.FC = () => {
    const navigation = useNavigation();

    const [ads, setAds] = useState([]);
    const [titlePage, setTitlePage] = useState('Carregando...');
    const [loading, setLoading] = useState(false);

    const loadPageTitle = async () => {
        const title = await AsyncStorage.getItem('adsPageTitle');
        const ads = await AsyncStorage.getItem('adsPageList');

        console.log(ads);

        setTitlePage(title);
        setAds(JSON.parse(ads));
    };

    const loadAds = async () => {
      setLoading(true);
      loadPageTitle();
      setLoading(false);
    };

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o anúncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`,
        });
    }

    const showOneAds = async (ads) => {
        await AsyncStorage.setItem('showAds', JSON.stringify(ads));
        navigation.navigate('ShowOneAds');
    }

    useEffect(function () {
        loadAds();
    }, []);


    return (
        <>

            <Loading visible={loading}  dismiss={!loading}/>
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
                          onPress={() => navigation.goBack()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <Title>{titlePage}</Title>


                    <FlatList data={ads} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      flexDirection: 'row',
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 5,
                                      marginBottom: 10
                                  }}
                                        onTouchEnd={() => showOneAds(item)}
                                  >
                                      <View style={{width: window.width * 0.2}}>
                                          <Image source={{uri: item.img}}
                                                 style={{
                                                     width: 90,
                                                     height: 80,
                                                     resizeMode: "cover",
                                                     backgroundColor: 'white'
                                                 }}/>
                                      </View>
                                      <View style={
                                          {
                                              width: window.width * 0.56,
                                              marginLeft: 30,
                                          }
                                      }>
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

        </>
    );
}

export default ListAds;
