import React, {useEffect, useState} from "react";
import {Alert, FlatList, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import api from "../../services/api";
import {changeStatusSegment, mainColor} from "../../utils/Util";
import newPlanImg from "../../assets/menu/VALE-PONTOS.png";
import {Label} from "../ListPlansAdmin/styles";
import Loading from "../../components/Loading";
const window = Dimensions.get('window');


const ListSegments: React.FC = () => {
    const navigation = useNavigation();

    const [segments, setSegments] = useState({});
    const [loading, setLoading] = useState(false);

    const updateSegment = async (plan) => {

        const updatedProfile = await changeStatusSegment(plan.id, plan.status !== true);

        if (!updatedProfile) {
            Alert.alert('Ocorreu um erro', 'Não foi possível atualizar o plano');
            return;
        }

        await loadSegments();
    }


    const loadSegments = () => {
      setLoading(true);
        api.get('/segments').then((response) => {
            setSegments(response.data.data);
            setLoading(false);
        }).catch((error) => {
          setLoading(false);
            console.log(4423432);
        });
    };

    useEffect(function () {
        loadSegments();
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
                          onPress={() => navigation.openDrawer()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <View>
                        <Title>SEGMENTOS</Title>
                    </View>

                        <FlatList data={segments} keyExtractor={((item, index) => item.id.toString())}
                                  renderItem={({item}) =>

                                      <View style={{
                                          backgroundColor: mainColor,
                                          paddingHorizontal: 12,
                                          // paddingTop: 4,
                                          borderRadius: 5,
                                          marginBottom: 10
                                      }}>
                                          <View style={{
                                              flexDirection: 'row',
                                              marginTop: 15,
                                          }}>
                                              <View style={{width: window.width * 0.65}}>
                                                  <Label style={{fontWeight: "bold"}}>
                                                      {item.name}
                                                  </Label>
                                              </View>
                                              <View style={{width: window.width * 0.2}}>
                                                  <Label style={{
                                                      fontWeight: 'bold',
                                                      backgroundColor: '#333',
                                                      padding: 3,
                                                      fontSize: 10,
                                                      textAlign: "center"

                                                  }}
                                                         onPress={() =>  updateSegment(item)}
                                                  >{item.status === true ? 'Desativar' : 'Ativar'}</Label>
                                              </View>
                                          </View>

                                          <View style={{}}>
                                              <Label>{item.description}</Label>
                                          </View>
                                      </View>
                                  }/>


                    {/*</FlatList>*/}

                </Container>
            </KeyboardAwareScrollView>

            <View style={{
                backgroundColor: "white",
                paddingTop: 10,
                paddingBottom: 30,
                borderTopWidth: .5,
                borderColor: "#666",
            }}>

                <View style={{
                    alignItems: 'center'
                }}>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreateSegment')}
                    >
                        <View>
                            <Image source={newPlanImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 5,
                                }}
                                >
                                    ADICIONAR NOVO SEGMENTO
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>

        </>
    );
}

export default ListSegments;
