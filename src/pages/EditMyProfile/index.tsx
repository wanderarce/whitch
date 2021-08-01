import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, CheckBox, Dimensions, Image, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {ContainerForm} from "./styles";
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import CityInput from "../../components/InputStates";
import Checkbox from "../../components/InputCheckbox";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import * as Yup from "yup";
import api from "../../services/api";
import {headerAuthorizationOrAlert, mainColor, myProfile} from "../../utils/Util";
import SimpleInput from "../../components/SimpleInput";
import AsyncStorage from "@react-native-community/async-storage";
import DocumentPicker from "react-native-document-picker";

const window = Dimensions.get('window');


const EditMyProfile: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const showMyCellphoneRef = useRef<CheckBox>(null);
    const showMyEmailRef = useRef<CheckBox>(null);
    const [user, setUser] = useState({});
    const [imgLabel, setImgLabel] = useState('Selecione uma imagem');
    const fs = require('react-native-fs');



    const [loginIdentification, setLoginIdentification] = useState('');

    const getDDDFormatted = (value: any) => {

        if (value.length < 3) {
            return '(' + value;
        }

        const ddd = value.substr(0, 2);
        const number = value.substr(2)
        return `(${ddd})${number}`;
    }

    const getFormattedNumber = (value: any) => {

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

    const cleanLoginIdentification = (value: any) => {
        if (value.includes('(') && value.includes(')')) {
            value = value.replace('-', '');
        }

        return value.replace('(', '').replace(')', '');
    }

    const onChangeAddMaskCellphone = async (inputValue:string) => {

        let value = cleanLoginIdentification(inputValue);

        value = getDDDFormatted(value);
        value = getFormattedNumber(value);

        setLoginIdentification(value);
        await AsyncStorage.setItem('signUpCellphone', value);
        return;
    }


    const getImageContent = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            });

            if (res.size > 3145728){
                Alert.alert('Ocorreu um erro', 'Não foi possível carregar o arquivo, pois ele tem mais que 3 mb.');
                return null;
            }

            const base64 = await fs.readFile(res.fileCopyUri, 'base64');

            return  `data:${res.type};base64,${base64}`;

        } catch (err) {

            let message = DocumentPicker.isCancel(err)
                ? ''
                : 'Não foi possível carregar o arquivo.';


            if (message.length > 0) {
                Alert.alert('Ocorreu um erro', 'Não foi possível carregar o arquivo.');
            }

            return null;

        }
    }

    const getImgFile = async () => {
        await AsyncStorage.removeItem('img');
        setImgLabel('Selecione uma imagem');
        const base64 = await getImageContent();
        await AsyncStorage.setItem('img', base64);
        setImgLabel('Imagem Selecionada');
        return true;
    }

    const getProfile = async () => {
        return await myProfile();
    };

    const start = async () => {
        const profile = await getProfile();
        onChangeAddMaskCellphone(profile.cellphone)
        setUser(profile);
    };

    useEffect(function () {
        start();
    }, [])

    const handleStoreBtn = useCallback(
        async (data) => {
            try {

                const imgData = await AsyncStorage.getItem('img');

                if(imgData !== null){
                    data.img = imgData;
                }

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.cellphone = cleanLoginIdentification(cellphoneFormatted);

                const schema = Yup.object().shape({
                    city_id: Yup.string().required('Necessário informar um estado e uma cidade'),
                    cellphone: Yup.string().min(10, 'Necessário informar o DDD e o Telefone'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    name: Yup.string().required('Nome obrigatório').min(3, 'O nome deve possuir no mínimo 3 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                const getConfig = async () => {
                    return await headerAuthorizationOrAlert();
                };

                const config = await getConfig();

                await api.patch('/profile', data, config)
                    .then((response) => {
                        Alert.alert('Sucesso!', 'Cadastro atualizado com sucesso!');
                        navigation.goBack();
                    })
                    .catch((error) => {
                        let message = 'Não foi possível atualizar seu cadastro, por favor tente novamente.';

                        if (422 === error.response.status) {
                            const errors = error.response.data.errors;
                            message = errors[Object.keys(errors)[0]][0];
                        }

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

                Alert.alert('Erro um erro!', 'Ocorreu um erro ao atualizar seu cadastro, tente novamente.');
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

                <ContainerForm>
                    <View>
                        <Title>EDITAR PERFIL</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={handleStoreBtn}
                    >

                        <Input
                            ref={nameInputRef}
                            defaultValue={user.name}
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
                            defaultValue={user.email}
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
                            defaultValue={user.cellphone}
                            icon="phone"
                            placeholder="Telefone*"
                            returnKeyType="next"
                            value={loginIdentification}
                            onChangeText={onChangeAddMaskCellphone}
                            onSubmitEditing={() => {
                                cellphoneRef.current?.focus();
                            }}
                        />

                        <CityInput
                            ref={stateRef}
                            name="city_id"
                            icon="lock"
                            placeholder="Senha"
                            secureTextEntry
                            textContentType="newPassword"
                            returnKeyType="send"
                            requiredCity={true}
                            requiredState={true}
                            value={user.city_id}
                            onSubmitEditing={() => {
                                stateRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            name="img"
                            leftIcon="sidebar"
                            rightIcon="camera"
                            placeholder={imgLabel}
                            returnKeyType="next"
                            editable={false}
                            righticonCallable={getImgFile}
                        />

                        <Checkbox
                            ref={showMyEmailRef}
                            value={user.public_email}
                            label="Não mostrar meu e-mail para outros usuários!"
                            name="public_email"
                        />

                        <Checkbox
                            ref={showMyCellphoneRef}
                            value={user.public_cellphone}
                            label="Não mostrar meu telefone para outros usuários!"
                            name="public_cellphone"
                        />

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            SALVAR
                        </Button>
                    </Form>

                </ContainerForm>
            </KeyboardAwareScrollView>
        </>
    );
}

export default EditMyProfile;
