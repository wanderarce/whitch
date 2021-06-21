import React, {useCallback, useRef, useState} from "react";
import {Alert, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';

import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import CityInput from "../../components/InputStates";
import {LittleLabel} from "../SignUp";
import {Hr} from "../../components/Hr/styles";
import Footer from "../../components/Footer";
import {getUser, mainColor} from "../../utils/Util";
import SegmentsSelect from "../../components/InputSegments";
import PlansSelect from "../../components/InputPlans";
import Checkbox from "../../components/InputCheckbox";
import * as Yup from "yup";
import api from "../../services/api";
import SimpleInput from "../../components/SimpleInput";
import AsyncStorage from "@react-native-community/async-storage";

const CreateUserAndAdvertiser: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const companyNameRef = useRef<TextInput>(null);
    const tradingNameRef = useRef<TextInput>(null);
    const registeredNumberRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const planIdRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const PasswordConfirmationInputRef = useRef<TextInput>(null);
    const cityIdRef = useRef<TextInput>(null);
    const termRef = useRef<Checkbox>(null);
    const consciousRef = useRef<Checkbox>(null);

    const navigation = useNavigation();

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

                const user = await getUser();
                const accessToken = user.access_token ?? null;

                if (accessToken === null) {
                    Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
                    return navigation.goBack();
                }

                const config = {
                    headers: {Authorization: `Bearer ${accessToken}`}
                };

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.phone = cleanLoginIdentification(cellphoneFormatted);

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    password_confirmation: Yup.string()
                        .oneOf([Yup.ref('password')], 'As senhas informadas devem ser iguais'),
                    password: Yup.string().min(6, 'A senha deve possui no mínimo 6 dígitos'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    plan_id: Yup.string().required('Necessário escolher um plano.'),
                    segment_id: Yup.string().required('Necessário escolher o segmento.'),
                    phone: Yup.string().required('Informe um telefone')
                        .min(11, 'Informe corretamente o ddd e seu número de telefone.')
                        .max(11, 'Informe corretamente o ddd e seu número de telefone.'),
                    city_id: Yup.string().required('Necessário informar um estado e uma cidade.'),
                    registered_number: Yup.string().required('Informe um CNPJ válido.')
                        .min(14, 'Informe um CNPJ válido.')
                        .max(14, 'Informe um CNPJ válido.'),
                    trading_name: Yup.string().required('Nome fantasia é obrigatório.')
                        .min(3, 'O nome fantasia deve possuir no mínimo 3 caracteres.'),
                    company_name: Yup.string().required('Razão social é obrigatório.')
                        .min(3, 'A razão social deve possuir no mínimo 3 caracteres.'),
                });

                console.log(data);

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/advertisers', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu cadastro como anúnciante foi realizado com sucesso');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        if (422 === error.response.status) {

                            const errorData = error.response.data;

                            console.log(errorData);

                            message = errorData.length === 0
                                ? errorData.errors[Object.keys(errorData.errors)[0]][0]
                                : errorData.message;

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

                console.log(error)
                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer cadastro, tente novamente.');
            }
        },
        [navigation],
    );

    return (
        <>
            <KeyboardAwareScrollView
                style={{flex: 1}}
            >


                <Container>

                    <Icon name="chevron-left" size={30}
                          color={mainColor}
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}/>

                    <View>
                        <Title>CADASTRAR ANUNCIANTE</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={create}
                    >

                        <Input
                            ref={companyNameRef}
                            autoCapitalize="words"
                            name="company_name"
                            icon="tag"
                            placeholder="Razão Social*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                companyNameRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={tradingNameRef}
                            autoCapitalize="words"
                            name="trading_name"
                            icon="tag"
                            placeholder="Nome fantasia*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                tradingNameRef.current?.focus();
                            }}
                        />


                        <Input
                            ref={registeredNumberRef}
                            autoCorrect={false}
                            keyboardType="number-pad"
                            name="registered_number"
                            icon="sidebar"
                            placeholder="CNPJ*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                registeredNumberRef.current?.focus();
                            }}
                        />

                        <CityInput
                            ref={cityIdRef}
                            name="city_id"
                            returnKeyType="next"
                            requiredCity={true}
                            requiredState={true}
                            onSubmitEditing={() => {
                                cityIdRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={phoneRef}
                            name="phone"
                            icon="phone"
                            keyboardType="number-pad"
                            placeholder="Telefone*"
                            returnKeyType="next"
                            value={loginIdentification}
                            onChangeText={onChangeAddMaskCellphone}
                            onSubmitEditing={() => {
                                phoneRef.current?.focus();
                            }}
                        />

                        <SegmentsSelect
                            ref={segmentIdRef}
                            name="segment_id"
                            icon="tag"
                            returnKeyType="next"
                            required={true}
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
                            }}
                        />

                        <PlansSelect
                            ref={planIdRef}
                            name="plan_id"
                            icon="tag"
                            returnKeyType="next"
                            required={true}
                            onSubmitEditing={() => {
                                planIdRef.current?.focus();
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

                        <SimpleInput
                            ref={passwordInputRef}
                            name="password"
                            leftIcon="lock"
                            rightIcon="eye"
                            placeholder="Senha*"
                            secureTextEntry
                            rightIconChangeSecureEntry={true}
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                passwordInputRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={PasswordConfirmationInputRef}
                            name="password_confirmation"
                            leftIcon="lock"
                            rightIcon="eye"
                            rightIconChangeSecureEntry={true}
                            placeholder="Confirmar senha*"
                            secureTextEntry
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                formRef.current?.submitForm();
                            }}
                        />

                        <Hr/>

                        <Checkbox
                            ref={termRef}
                            value={true}
                            label=" Aceito os termos & condições."
                            name="term"
                        />

                        <Checkbox
                            ref={consciousRef}
                            value={true}
                            label="Estou ciente da cobrança para cadastro caso eu não tenha escolhido o plano gratuito."
                            name="conscious"
                        />

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            CADASTRAR
                        </Button>

                        <LittleLabel style={{paddingTop: 20}}
                                     onPress={() => navigation.navigate('Login')}>
                        </LittleLabel>

                    </Form>

                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default CreateUserAndAdvertiser;
