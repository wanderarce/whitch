import React, {useEffect, useState} from "react";
import {FlatList, Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getPages, mainColor} from "../../utils/Util";

import Icon from 'react-native-vector-icons/Feather';
import {ContainerForm} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');

const Pages: React.FC = () => {
    const navigation = useNavigation();
    const [pages, setPages] = useState(false);

    const loadPages = async () => {
        const listPages = await getPages();
        setPages(listPages);
    }

    const redirectToPage = async (pageId: any) => {
        await AsyncStorage.setItem('pageId', pageId.toString());
        navigation.navigate('UpdatePage');
    };

    useEffect(function () {
        loadPages();
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
                <View style={{padding: 15,
                  width: window.width * 0.233, alignItems: "flex-end"}}>
                    <Icon name="align-justify"
                          size={30}
                          color={mainColor}
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <ContainerForm>
                    <View>
                        <Title>TEXTOS</Title>
                    </View>

                    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>


                        <FlatList  data={pages} keyExtractor={((item, index) => item.id.toString())}
                                  renderItem={({item}) => {
                                      return (
                                          <View style={{
                                              flexDirection: 'row',
                                              backgroundColor: mainColor,
                                              padding: 10,
                                              borderRadius: 3,
                                              marginBottom: 20,
                                          }}
                                                onTouchEnd={() => {
                                                   redirectToPage(item.id);
                                                }}
                                          >
                                              <View style={{
                                                  width: window.width * 0.78,
                                              }}>
                                                  <Text style={{
                                                      color: 'white'
                                                  }}>{item.name}</Text>
                                              </View>

                                          </View>
                                      )
                                  }}
                        >

                        </FlatList>

                    </KeyboardAwareScrollView>

                </ContainerForm>
            </KeyboardAwareScrollView>

            <Footer/>
        </>
    );
}

export default Pages;
