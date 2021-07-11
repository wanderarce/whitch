import React, { useEffect, useRef, useState} from "react";
import {FlatList, Image, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createEmail, deleteEmail, getEmails, mainColor} from "../../utils/Util";

import Icon from 'react-native-vector-icons/Feather';
import {ContainerForm} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import Footer from "../../components/Footer";

const window = Dimensions.get('window');

const Emails: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const [newEmail, setNewEmail] = useState('');
    const [creating, setCreating] = useState(false);
    const [emails, setEmails] = useState(false);

    const handleDelete = async (id) => {

        const isDeleted = await deleteEmail(id);

        if(isDeleted){
            loadEmails();
        }

    };

    const handleCreateEmail = async () => {

        if (creating || newEmail.length < 3) {
            return;
        }

        setCreating(true);

        const email = newEmail;

        setNewEmail('');

        await createEmail(email);

        loadEmails();

        setCreating(false);
    }

    const loadEmails = async () => {
        const listEmail = await getEmails();
        setEmails(listEmail);
    }

    useEffect(function () {
        loadEmails();
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

                <ContainerForm>
                    <View>
                        <Title>CONFIGURAÇÕES</Title>
                    </View>

                    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>


                        <FlatList data={emails} keyExtractor={((item, index) => item.id.toString())}
                                  renderItem={({item}) => {
                                      return (
                                          <View style={{
                                              flexDirection: 'row',
                                              backgroundColor: mainColor,
                                              padding: 16,
                                              borderRadius: 3,
                                              marginBottom: 20,
                                          }}>
                                              <View style={{
                                                  width: window.width * 0.78,
                                              }}>
                                                  <Text style={{
                                                      color: 'white'
                                                  }}>{item.email}</Text>
                                              </View>

                                              <View style={{
                                                  width: window.width * 0.05,
                                              }}>


                                                  <Text
                                                      style={{
                                                          textAlignVertical: "center",
                                                          backgroundColor: 'black',
                                                          color: "white",
                                                          borderRadius: 3,
                                                          fontSize: 10,
                                                          padding: 3,
                                                          width: 20,
                                                          height: 20,
                                                          textAlign: 'center',
                                                          fontWeight: 'bold',
                                                      }}
                                                      onPress={() => {handleDelete(item.id)}}
                                                  >X</Text>

                                              </View>

                                          </View>
                                      )
                                  }}
                        >

                        </FlatList>

                    </KeyboardAwareScrollView>

                    <Form ref={formRef}>

                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: "white",
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: '#333',
                            padding: 5,
                        }}>

                            <TextInput
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 3,
                                    width: window.width * 0.76,
                                    padding: 2,
                                }}
                                onChangeText={(value) => {
                                    setNewEmail(value);
                                }}
                                value={newEmail}
                                keyboardAppearance="dark"
                                placeholderTextColor="#666360"
                            />

                            <View
                                style={{
                                    marginTop: 1,
                                    width: window.width * 0.12,
                                    paddingVertical: 5,
                                    height: 30,
                                    alignItems: "center",
                                }}
                                onTouchStart={() => {
                                    handleCreateEmail();
                                }}
                            >
                                <Icon
                                    name="play"
                                    size={20}
                                    color="black"
                                />

                            </View>
                        </View>

                    </Form>

                </ContainerForm>
            </KeyboardAwareScrollView>

            <Footer/>
        </>
    );
}

export default Emails;
