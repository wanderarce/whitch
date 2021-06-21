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
import {Title} from "../../components/Title/styles";
import {style} from "../../components/Form/style"
import * as Yup from "yup";
import api from "../../services/api";
import {mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";

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


const NewPassword: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const codeRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const passwordConfirmationInputRef = useRef<TextInput>(null);

    const handleLogin = useCallback(
        async (data: string) => {

            try {

                const schema = Yup.object().shape({
                    password_confirmation: Yup.string()
                        .oneOf([Yup.ref('password')], 'As senhas informadas devem ser iguais'),
                    password: Yup.string().min(6, 'A senha deve possui no mínimo 6 dígitos'),
                    code: Yup.string().required('Necessário informar um código')
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/auth/password', data)
                    .then((response) => {
                        Alert.alert('Senha resetada com sucesso!', 'Você já pode fazer login na aplicação!');
                        navigation.navigate('SignIn');
                    })
                    .catch((error) => {

                        let message = 'Não foi possível resetar a senha, por favor tente novamente.';

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

                Alert.alert('Erro ao resetar a senha', 'Ocorreu um ao tentar resetar a senha,tente novamente.');
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
                            <Title>RESETE SUA SENHA</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleLogin} style={style.default}>

                            <Input
                                ref={codeRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="default"
                                name="code"
                                icon="key"
                                placeholder="Código de verificação"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    codeRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Nova senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={passwordConfirmationInputRef}
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmar nova senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    passwordConfirmationInputRef.current?.focus();
                                }}
                            />

                            <Button
                                onPress={() => formRef.current?.submitForm()}>
                                SALVAR
                            </Button>


                        </Form>
                    </ContainerLogin>
                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default NewPassword;
