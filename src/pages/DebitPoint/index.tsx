import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getMessageByAxiosError, headerAuthorizationOrAlert, loadMainProfile, mainColor} from "../../utils/Util";

import Icon from 'react-native-vector-icons/Feather';
import {ContainerForm} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import * as Yup from "yup";
import api from "../../services/api";
import Footer from "../../components/Footer";
import FreeAdsSelect from "../../components/InputFreeAds";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');


const DebitPoint: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const AdsRef = useRef<TextInput>(null);

    const [loginIdentification, setLoginIdentification] = useState('');

    const loadProfile = async () => {
        const profile = await loadMainProfile();

        console.log(profile);

        if(!profile.isActiveAdvertiser){
            Alert.alert('Cadastro inativo', 'Seu cadastro de anunciante no momento está inativo');
            return navigation.goBack();
        }
    }

    useEffect(function(){
        loadProfile();
    }, [])

    const getDDDFormatted = (value) => {

        if (value.length < 3) {
            return '(' + value;
        }

        const ddd = value.substr(0, 2);
        const number = value.substr(2)
        return `(${ddd})${number}`;
    }

    const getFormattedNumber = (value) => {

        if (value.length < 8) {
            return value;
        }
        const valueLength = value.length;
        let firstPart = '';
        let secondPart = '';

        if (valueLength >= 13) {
            firstPart = value.substr(0, 9);
            secondPart = value.substr(9, 4);
        }

        if (valueLength >= 9 && valueLength < 13) {
            firstPart = value.substr(0, 8);
            secondPart = value.substr(8);
        }

        return firstPart.length === 0 && secondPart.length === 0
            ? value
            : firstPart + '-' + secondPart;

    }

    const cleanLoginIdentification = (value) => {
        if (value.includes('(') && value.includes(')')) {
            value = value.replace('-', '');
        }

        return value.replace('(', '').replace(')', '');
    }

    const onChangeAddMaskCellphone = async (inputValue) => {

        let value = cleanLoginIdentification(inputValue);

        value = getDDDFormatted(value);
        value = getFormattedNumber(value);

        setLoginIdentification(value);
        await AsyncStorage.setItem('signUpCellphone', value);
        return;
    }


    const create = useCallback(
        async (data) => {
            try {

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.cellphone = cleanLoginIdentification(cellphoneFormatted);

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    ads_id: Yup.string().required('Necessário informar um anúncio'),
                    cellphone: Yup.string()
                        .required('Necessário informar o celular')
                        .min(10, 'Necessário informar o DDD e o Telefone'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    Alert.alert('Ocorreu um erro', 'Faça o login e tente novamente');
                    return null;
                }

                await api.post('/user-points/debit', data, config)
                    .then((response) => {
                        Alert.alert('Sucesso', 'O cadastro de pontos foi realizado com sucesso.');
                        navigation.goBack();
                    })
                    .catch((error) => {
                        let message = getMessageByAxiosError(error, 'Ocorreu um erro ao tentar cadastrar os pontos');

                        Alert.alert(
                            'Ocorreu um erro!',
                            message
                        );
                    });

            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    Alert.alert('Ocorreu um erro', error.message);
                    return;
                }

                Alert.alert(
                    'Ocorreu um erro', 'Ocorreu um erro ao tentar cadastrar os pontos!');
            }
        },
        [navigation],
    );


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
                        <Title>RESGATAR PONTOS</Title>
                    </View>

                    <Form ref={formRef} onSubmit={create}>

                        <Input
                            ref={cellphoneRef}
                            name="cellphone"
                            icon="phone"
                            keyboardType="number-pad"
                            placeholder="Telefone*"
                            textContentType="newPassword"
                            returnKeyType="send"
                            value={loginIdentification}
                            onChangeText={onChangeAddMaskCellphone}
                            onSubmitEditing={() => {
                                cellphoneRef.current?.focus();
                            }}
                        />

                        <FreeAdsSelect
                            ref={AdsRef}
                            name="ads_id"
                            icon="tag"
                            returnKeyType="send"
                            required={true}
                            onSubmitEditing={() => {
                                AdsRef.current?.focus();
                            }}
                        />

                        <Button onPress={() => formRef.current?.submitForm()}>
                            RESGATAR
                        </Button>
                    </Form>

                </ContainerForm>
            </KeyboardAwareScrollView>

            <Footer/>
        </>
    );
}

export default DebitPoint;
