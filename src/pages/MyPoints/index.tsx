import React, {useEffect, useState} from "react";
import {FlatList, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getMyPoints, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import moneyHoverImg from "../../assets/adsIcones/iconepontosHover.png";
import Loading from "../../components/Loading";
const window = Dimensions.get('window');


const MyPoints: React.FC = () => {

    const navigation = useNavigation();
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPoints = async () => {
       setLoading(true);
        const points = await getMyPoints();
        console.log(points);
        await setPoints(points);
        setLoading(false);
    };

    useEffect(function () {
        loadPoints();
    }, []);

    return (
        <>
            <View style={{
                flexDirection: 'row',
                backgroundColor: "white"
            }}>
              <Loading visible={loading}  dismiss={!loading}/>
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
                    <Title style={{
                        marginBottom: 60,
                    }}>VALES PONTOS</Title>

                    <FlatList data={points} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      backgroundColor: mainColor,
                                      padding: 15,
                                      borderRadius: 10,
                                      marginBottom: 20
                                  }}>
                                      <View style={{
                                          flexDirection: 'row'
                                      }}>
                                          <View style={{width: window.width * 0.5}}>
                                              <Label style={{fontWeight: "bold"}}>
                                                  {item.advertiser}
                                              </Label>
                                          </View>

                                          <Label style={{
                                              fontWeight: 'bold',
                                              textAlign: "center",
                                              width: window.width * 0.3,
                                              marginLeft: 20
                                          }}
                                          >MOEDAS: {item.qty_points}</Label>

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
                          onTouchEnd={() => navigation.navigate('ListDebitPointAds')}
                    >
                        <View>
                            <Image source={moneyHoverImg}
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

export default MyPoints;
