import React, {useCallback, useRef} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Feather";
import {Alert, Platform, TextInput, View} from "react-native";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import {FormHandles} from "@unform/core";
import styled from "styled-components/native";
import {Subtitle} from "../../components/Subtitle/styles";
import {Title} from "../../components/Title/styles";
import {style} from "../../components/Form/style";
import * as Yup from "yup";
import api from "../../services/api";
import Footer from "../../components/Footer";
import {mainColor} from "../../utils/Util";

export const LittleLabel = styled.Text`
  font-size: 12px;
  color: #666360;
  font-family: 'RobotoSlab-Medium';
  margin: 0px 0 0 0;
  padding: 5px 0 10px;
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


const PasswordReset: React.FC = () => {

    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const emailInputRef = useRef<TextInput>(null);

    const handleLogin = useCallback(
        async (data: string) => {

            try {

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                api.post('/auth/password/reset', data)
                    .then((response) => {
                        Alert.alert('Recuperação de senha', 'Um código de confirmação foi enviado para seu e-mail');
                        navigation.navigate('NewPassword');
                    })
                    .catch((error) => {

                        let message = 'Ocorreu um erro ao solicitar o reset de senha!';

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

                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao solicitar o reset da senha, tente novamente.');
            }
        }, []
    );

    return (
        <>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
                <Container>
                    <Icon name="chevron-left" size={30} color={mainColor}
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}/>
                    <ContainerLogin>

                        <View>
                            <Title>RECUPERE SUA SENHA</Title>
                            <Subtitle style={{paddingTop: 12}}>
                                Digite seu e-mail e um código será enviado para recuperar a senha de sua conta.
                            </Subtitle>
                        </View>

                        <Form style={style.default} ref={formRef} onSubmit={handleLogin}>

                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="default"
                                name="email"
                                icon="mail"
                                placeholder="E-mail*"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                            />

                            <Button
                                onPress={() => formRef.current?.submitForm()}>
                                RECUPERAR
                            </Button>

                            <LittleLabel style={{paddingTop: 30}}
                                         onPress={() => navigation.navigate('SignUp')}>
                                Não tem conta? Cadastre-se agora
                            </LittleLabel>

                            <LittleLabel onPress={() => navigation.navigate('Login')}>
                                Já tem conta? Faça o login agora
                            </LittleLabel>

                        </Form>
                    </ContainerLogin>
                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default PasswordReset;
