import React, {useRef, useCallback, useState} from 'react';
import {
    TextInput,
    View,
    Alert
}
    from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';

import Input from './../../components/Input';
import Button from '../../components/Button';


import {
    Container,
    Title,
} from './styles';

import CityInput from "../../components/InputStates";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import api from "../../services/api";
import SimpleInput from "../../components/SimpleInput";
import {mainColor} from "../../utils/Util";
import AsyncStorage from "@react-native-community/async-storage";

export const LittleLabel = styled.Text`
  font-size: 12px;
  color: #666360;
  font-family: 'RobotoSlab-Medium';
  text-align: center;
`;

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}


const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const PasswordConfirmationInputRef = useRef<TextInput>(null);

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

    const handleSignUp = useCallback(
        async (data: SignUpFormData) => {
            try {

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.cellphone = cleanLoginIdentification(cellphoneFormatted);

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    password_confirmation: Yup.string()
                        .oneOf([Yup.ref('password')], 'As senhas informadas devem ser iguais'),
                    password: Yup.string().min(6, 'A senha deve possui no mínimo 6 dígitos'),
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

                await api.post('/users', data)
                    .then((response) => {
                        Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação!');
                        navigation.navigate('SignIn');
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar seu cadastro, por favor tente novamente.';

                        console.log(error)

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
                    // const errors = getValidationErrors(error);
                    // formRef.current?.setErrors(errors);
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

                    <Icon name="chevron-left" size={30} color={mainColor}
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}/>

                    <View>
                        <Title>CADASTRE-SE</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={handleSignUp}
                    >

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

                        <CityInput
                            ref={stateRef}
                            name="city_id"
                            icon="lock"
                            secureTextEntry
                            textContentType="newPassword"
                            requiredCity={true}
                            requiredState={true}
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                stateRef.current?.focus();
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
                                cellphoneRef.current?.focus();
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

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            CADASTRAR
                        </Button>

                        <LittleLabel style={{paddingTop: 20}}
                                     onPress={() => navigation.navigate('Login')}>
                            Ja possui um cadastro? Faça seu login
                        </LittleLabel>

                    </Form>

                </Container>
            </KeyboardAwareScrollView>
        </>
    );
}

export default SignUp;
