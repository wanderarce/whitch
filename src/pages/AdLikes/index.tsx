import React, {useEffect, useState} from "react";
import {FlatList, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getAdLikes, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import logoCircle from "../../assets/logo-circle.png";

const window = Dimensions.get('window');


const AdLikes: React.FC = () => {

    const navigation = useNavigation();
    const [likes, setLikes] = useState([]);

    const showMemberProfile = async (id: number) => {
        await AsyncStorage.setItem('showUserProfile', id.toString());
        return navigation.navigate('Profile');
    }

    const loadLikes = async (id: number) => {
        const likesString = await AsyncStorage.getItem('adsLikes');

        if (likesString === null) {
            return;
        }

        const likes = await getAdLikes(JSON.parse(likesString).id);

        setLikes(likes);
    }


    useEffect(function () {
        loadLikes();
    }, [])

    return (
        <>

            <View style={{
                flexDirection: 'row',
                backgroundColor: "white",
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

                <Container>
                    <Title>LEGAL</Title>

                    <Label style={{
                        color: "#333"
                    }}>
                        Quantidade de legais no anúncio: {likes.length}
                    </Label>

                    <Label style={{
                        color: "#333"
                    }}>
                        Quem marcou:
                    </Label>

                    <FlatList data={likes} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      marginTop: 10,
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10
                                  }}>
                                      <View style={{
                                          flexDirection: 'row'
                                      }}>


                                          <View

                                              onTouchEnd={() => {
                                                  showMemberProfile(item.user.id)
                                              }}

                                              style={{width: window.width * 0.1,}}>
                                              <Image
                                                  source={item.user.profile_img_url ? {uri: item.user.profile_img_url} : logoCircle}
                                                  style={{
                                                      width: 35,
                                                      height: 35,
                                                      borderRadius: 50,
                                                  }}/>

                                          </View>
                                          <View style={{width: window.width * 0.4, marginTop: 7,}}>
                                              <Label style={{fontWeight: "bold"}}>
                                                  {item.user.name}
                                              </Label>
                                          </View>
                                          <View style={{
                                              width: window.width * 0.3,
                                              marginLeft: 10
                                          }}>
                                              <Label style={{
                                                  fontWeight: 'bold',
                                                  backgroundColor: '#333',
                                                  padding: 3,
                                                  fontSize: 10,
                                                  textAlign: "center",
                                                  marginTop: 7,
                                              }}
                                                     onPress={() => {
                                                         showMemberProfile(item.user.id)
                                                     }}
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

export default AdLikes;
