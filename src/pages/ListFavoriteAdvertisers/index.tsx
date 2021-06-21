import React, {useEffect, useState} from "react";
import {FlatList, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getFavoriteAdvertisers, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from "../../components/Loading";

const window = Dimensions.get('window');


const ListFavoriteAdvertisers: React.FC = () => {

    const navigation = useNavigation();
    const [advertisers, setAdvertisers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadAdvertisers = async () => {
      setLoading(true);
        const advertisers = await getFavoriteAdvertisers();
        setAdvertisers(advertisers);
        setLoading(false);
    };

    const showProfile = async (advertiser) => {
        await AsyncStorage.setItem('showAdvertiser', JSON.stringify(advertiser));
        return navigation.navigate('ShowAdvertiserProfile');
    };

    useEffect(function () {
        loadAdvertisers();
    }, [])

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
                    <Title>EMPRESAS FAVORITAS</Title>

                    <FlatList data={advertisers} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
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
                                          <View style={{width: window.width * 0.3, marginLeft: 10}}>
                                              <Label style={{
                                                  fontWeight: 'bold',
                                                  backgroundColor: '#333',
                                                  padding: 3,
                                                  fontSize: 10,
                                                  textAlign: "center"
                                              }}
                                                     onPress={() => showProfile(item)}
                                              >Ver Perfil</Label>
                                          </View>
                                      </View>
                                  </View>
                              }/>


                </Container>
                <Footer/>
            </KeyboardAwareScrollView>

        </>
    );
}

export default ListFavoriteAdvertisers;
