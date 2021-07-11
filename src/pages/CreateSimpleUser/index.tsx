import React, {useCallback, useRef, useState} from "react";
import {Alert, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getMessageByAxiosError, headerAuthorizationOrAlert, mainColor} from "../../utils/Util";

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
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');


const CreateSimpleUser: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const [loginIdentification, setLoginIdentification] = useState('');

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
                    cellphone: Yup.string().min(10, 'Necessário informar o DDD e o Telefone'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    name: Yup.string().required('Nome obrigatório').min(3, 'O nome deve possuir no mínimo 3 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    Alert.alert('Ocorreu um erro', 'Faça o login e tente novamente');
                    return null;
                }

                await api.post('/admin/users', data, config)
                    .then((response) => {
                        Alert.alert('Sucesso', 'O cadastro foi realizado com sucesso.');
                        navigation.goBack();
                    })
                    .catch((error) => {
                        let message = getMessageByAxiosError(error, 'Ocorreu um erro ao tentar cadastrar');

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
                    'Ocorreu um erro', 'Ocorreu um erro ao tentar cadastrar.');
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
                        <Title>CADASTRAR USUÁRIO</Title>
                    </View>

                    <Form ref={formRef} onSubmit={create}>

                        <Input
                            ref={nameInputRef}
                            autoCapitalize="words"
                            name="name"
                            icon="user"
                            placeholder="Nome*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                nameInputRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={emailInputRef}
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            name="email"
                            icon="mail"
                            placeholder="E-mail*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                emailInputRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={cellphoneRef}
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            name="cellphone"
                            icon="phone"
                            placeholder="Telefone*"
                            returnKeyType="next"
                            value={loginIdentification}
                            onChangeText={onChangeAddMaskCellphone}
                            onSubmitEditing={() => {
                                cellphoneRef.current?.focus();
                            }}
                        />

                        <Button onPress={() => formRef.current?.submitForm()}>
                            Cadastrar
                        </Button>
                    </Form>

                </ContainerForm>
            </KeyboardAwareScrollView>

            <Footer/>
        </>
    );
}

export default CreateSimpleUser;
