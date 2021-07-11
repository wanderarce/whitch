import React, {useEffect, useState} from "react";
import {Alert, FlatList, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {changePlan, loadMainProfile, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import api from "../../services/api";
import Loading from "../../components/Loading";
const window = Dimensions.get('window');


const ListPlans: React.FC = () => {

    const navigation = useNavigation();
    const [plans, setPlans] = useState([]);
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(false);

    const updatePlan = async (planId) => {

        const updatedProfile = await changePlan(planId, profile.advertiser_id);

        if (!updatedProfile) {
            Alert.alert('Ocorreu um erro', 'Não foi possível atualizar o plano');
        }

        return navigation.navigate('MyProfile');
    }

    const loadPlans = async () => {
        setLoading(true);
        api.get('/plans?status=true').then((response) => {
            setPlans(response.data.data);
            console.log(response.data.data);
            setLoading(false);
        }).catch((error) => {
          setLoading(false);
            console.log(error);
        });
    };

    const loadProfile = async () => {
        const profile = await loadMainProfile();
        setProfile(profile);
    }

    useEffect(function () {
        loadProfile();
        loadPlans();
    }, [])

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
                          onPress={() => navigation.openDrawer()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <Title>PLANOS</Title>

                    <FlatList data={plans} keyExtractor={((item, index) => item.id.toString())}
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
                                                  {item.name} - R$ {item.amount}
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
                                              onPress={() =>  updatePlan(item.id)}
                                              >Escolher plano</Label>
                                          </View>
                                      </View>

                                      <View style={{}}>
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

export default ListPlans;
