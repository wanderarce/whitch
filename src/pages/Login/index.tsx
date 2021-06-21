import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Title} from "../SignUp/styles";
import Icon from "react-native-vector-icons/Feather";
import {Alert, Platform, TextInput, View, ActivityIndicator} from "react-native";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import {FormHandles} from "@unform/core";
import styled from "styled-components/native";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import SimpleInput from "../../components/SimpleInput";
import {mainColor, resetMainProfile} from "../../utils/Util";
import Loading from "../../components/Loading";


export const LittleLabel = styled.Text`
  font-size: 12px;
  color: #666360;
  font-family: 'RobotoSlab-Medium';
  margin: 0px 0 0 0;
  padding: 5px 0 20px;
  text-align: center;
`;

export const Container = styled.View`
  flex: 1;
  padding: 20px 20px ${Platform.OS === 'android' ? 120 : 40}px;
  background-color: #FFF;
`;

export const ContainerLogin = styled.View`
  flex: 1;
  padding: 60px 15px 0px;
  height: 100%;
  background-color: #FFF;
`;

interface SignInFormData {
    identifier: string;
    password: string;
}

type Props = {};
const Login: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const IdentificationRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const [defaultUserPass, setDefaultUserPass] = useState({
        login: '',
        password: '',
    });

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

        if (valueLength === 13) {
            firstPart = value.substr(0, 9);
              secondPart = value.substr(9);
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

    const onChangeAddMaskCellphoneOrEmail = async (inputValue) => {

        let value = cleanLoginIdentification(inputValue);

        // it's not an telephone
        if (Number.parseInt(value) != value || value.length > 11) {
            setLoginIdentification(value);
            await AsyncStorage.setItem('loginIdentification', value);
            return;
        }

        value = getDDDFormatted(value);
        value = getFormattedNumber(value);

        setLoginIdentification(value);
        await AsyncStorage.setItem('loginIdentification', value);
        return;
    }

    useEffect(function () {
        setDefaultUserPass({
            login: '',
            password: '',
        });
    }, [])

    const validEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    }

    const validCellphone = (cellphone) => /^\(\d{2}\)\d{4,5}-\d{4}$/.test(cellphone);

    const handleLogin = useCallback(
        async (data: SignInFormData) => {

            try {

                const loginIdentifier = await AsyncStorage.getItem('loginIdentification');

                const isValidEmail = validEmail(loginIdentifier);
                const isValidCellphone = validCellphone(loginIdentifier);

                if (!isValidEmail && !isValidCellphone) {
                    Alert.alert('Ocorreu um erro', 'Informe um e-mail ou telefone válido!');
                    return;
                } else {

                    formRef.current?.setErrors({});
                    const schema = Yup.object().shape({
                        password: Yup.string().min(3, 'A senha deve ser informada corretamente.'),
                    });

                    await schema.validate(data, {
                        abortEarly: true,
                    });
                }


                const dataLogin = {
                    password: data.password
                }

                if (isValidCellphone) {
                    dataLogin.cellphone = cleanLoginIdentification(loginIdentifier);
                } else {
                    dataLogin.email = loginIdentifier;
                }
                setLoading(true);
                await api.post('/auth/login', dataLogin)
                    .then(async (response) => {
                        await AsyncStorage.setItem('authUser', JSON.stringify(response.data.data));
                        await resetMainProfile();
                        setLoading(false);
                        navigation.navigate('InitialPageGroup')
                    })
                    .catch((error) => {

                        let message = 'Telefone ou senha informado incorretamente!';
                        setLoading(false);
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
              setLoading(false);
                if (error instanceof Yup.ValidationError) {
                    Alert.alert('Ocorreu um erro', error.message);
                    return;
                }
                Alert.alert(
                    'Ocorreu um erro', 'Ocorreu um erro ao tentar realizar o login, tente novamente.');
            }
        },
        [navigation],
    );

    return (
        <>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#FFF'}}>


                <Container visible={loading}>
                    <Icon name="chevron-left" size={30} color={mainColor}
                          onPress={() => navigation.navigate('SignIn')}/>

                    <Loading visible={loading}  dismiss={!loading}/>
                    <ContainerLogin style={{height: loading? "0%": "100%"}}>

                          <View >
                            <Title>FAÇA SEU LOGIN</Title>
                        </View>

                        <Form  ref={formRef} onSubmit={handleLogin}>

                            <Input
                                ref={IdentificationRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="identifier"
                                icon="phone"
                                placeholder="Telefone ou e-mail*"
                                returnKeyType="next"
                                defaultValue={defaultUserPass.login}
                                value={loginIdentification}
                                onChangeText={onChangeAddMaskCellphoneOrEmail}
                                onSubmitEditing={() => {
                                    IdentificationRef.current?.focus();
                                }}
                            />

                            <SimpleInput
                                ref={passwordInputRef}
                                name="password"
                                leftIcon="lock"
                                rightIcon="eye"
                                placeholder="Senha*"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                defaultValue={defaultUserPass.password}
                                rightIconChangeSecureEntry={true}
                                onSubmitEditing={() => {
                                    IdentificationRef.current?.focus();
                                }}
                                style={{
                                    flex: 1,
                                    color: "#666360",
                                    fontFamily: 'RobotoSlab-Regular'
                                }}
                            />

                            <LittleLabel
                                onPress={() => navigation.navigate('PasswordReset')}
                            >Esqueceu sua senha?</LittleLabel>

                            <Button
                                onPress={() => formRef.current?.submitForm()}>
                                ENTRAR
                            </Button>

                            <LittleLabel style={{paddingTop: 100}}
                                         onPress={() => navigation.navigate('SignUp')}>
                                Não tem conta? Cadastre-se agora
                            </LittleLabel>

                        </Form>
                    </ContainerLogin>
                </Container>
            </KeyboardAwareScrollView>
        </>
    );
}

export default Login;
