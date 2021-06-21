import React, {useCallback, useRef} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Feather";
import {Alert, Dimensions, Image, Platform, TextInput, View} from "react-native";
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
import logoImg from "../../assets/logo-dark-fonte.png";
import {headerAuthorizationOrAlert, mainColor} from "../../utils/Util";
import SimpleInput from "../../components/SimpleInput";

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
  padding: 0px 15px 0px;
  height: 100%;
  background-color: #FFF;
`;

const window = Dimensions.get('window');

const NewPassword: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const passwordInputRef = useRef<TextInput>(null);
    const passwordConfirmationInputRef = useRef<TextInput>(null);

    const handleLogin = useCallback(
        async (data: string) => {
            const getConfig = async () => await headerAuthorizationOrAlert();
            const config = await getConfig();

            console.log(config);

            if (config === null) {
                return;
            }

            try {

                const schema = Yup.object().shape({
                    password_confirmation: Yup.string()
                        .oneOf([Yup.ref('password')], 'As senhas informadas devem ser iguais'),
                    password: Yup.string().min(6, 'A senha deve possui no mínimo 6 dígitos'),
                    old_password: Yup.string().required('Necessário informar a senha atual.')
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.patch('auth/password/update', data, config)
                    .then((response) => {
                        Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        console.log(error);

                        let message = 'Não foi possível atualizada a senha, por favor tente novamente.';


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

                Alert.alert('Ecorreu um erro', 'Não foi possível atualizar sua senha.');
            }
        }, []
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
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MyProfile')}
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

            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
                <Container>
                    <ContainerLogin>

                        <View>
                            <Title>ALTERAR SENHA</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleLogin} style={style.default}>

                            <SimpleInput
                                ref={passwordInputRef}
                                name="old_password"
                                leftIcon="lock"
                                rightIcon="eye"
                                placeholder="Senha Atual*"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                rightIconChangeSecureEntry={true}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <SimpleInput
                                ref={passwordInputRef}
                                name="new_password"
                                leftIcon="lock"
                                rightIcon="eye"
                                rightIconChangeSecureEntry={true}
                                placeholder="Nova senha*"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <SimpleInput
                                ref={passwordConfirmationInputRef}
                                name="new_password_confirmation"
                                leftIcon="lock"
                                rightIcon="eye"
                                rightIconChangeSecureEntry={true}
                                placeholder="Confirmar nova senha*"
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
            </KeyboardAwareScrollView>
        </>
    );
}

export default NewPassword;
