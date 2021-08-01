import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Dimensions, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import {LittleLabel} from "../SignUp";
import {getMessageByAxiosError, getUser, mainColor} from "../../utils/Util";
import * as Yup from "yup";
import api from "../../services/api";
import logoImg from "../../assets/logo-dark-fonte.png";
const window = Dimensions.get('window');

const Contact: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const descriptionRef = useRef<TextInput>(null);
    const subjectRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const [formData, setFormData] = useState({});

    const navigation = useNavigation();


    useEffect(function () {
    }, []);

    const create = useCallback(
        async (data) => {
            try {

                setFormData(data);

                const user = await getUser();
                const accessToken = user.access_token ?? null;

                if (accessToken === null) {
                    Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
                    return;
                }

                const config = {
                    headers: {Authorization: `Bearer ${accessToken}`}
                };

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    message: Yup.string().required('A mensagem é obrigatória')
                        .min(10, 'A mensagem deve possuir no mínimo 10 caracteres!'),
                    subject: Yup.string().required('O assunto é obrigatório')
                        .min(10, 'O assunto deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });


                await api.post(`/contact`, data, config)
                    .then((response) => {
                        Alert.alert('Sucesso!', 'O e-mail foi enviado com sucesso');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar enviar o e-mail, por favor tente novamente.';

                        message = getMessageByAxiosError(error, message);

                        //console.log(message);

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

                //console.log(error)
                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao enviar o e-mail, tente novamente.');
            }
        },
        [navigation],
    );

    return (
        <>

            <View style={{
                flexDirection: 'row',
                backgroundColor: "white",
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

            <KeyboardAwareScrollView
                style={{flex: 1, backgroundColor: 'white'}}
            >


                <Container>

                    <View>
                        <Title style={{textTransform: 'uppercase'}}>
                            ENTRE EM CONTATO COM A WHICH IS
                        </Title>
                    </View>

                    <Form ref={formRef} onSubmit={create} style={{
                        marginTop: 20
                    }}>

                        <Input
                            ref={subjectRef}
                            autoCapitalize="words"
                            name="subject"
                            icon="italic"
                            placeholder="Assunto*"
                            returnKeyType="next"
                            defaultValue={formData.subject}
                            onSubmitEditing={() => {
                                subjectRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={descriptionRef}
                            icon="mail"
                            name="message"
                            placeholder="mensagem*"
                            textContentType="newPassword"
                            maxLength={255}
                            numberOfLines={5}
                            multiline={true}
                            returnKeyType="send"
                            defaultValue={formData.message}
                            style={{minHeight: 100, padding: 10}}
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
                            }}
                        />

                        <View style={{alignItems: 'center', marginTop: 70, paddingHorizontal: 60}}>
                            <Button style={{}}
                                    onPress={() => formRef.current?.submitForm()}>
                                SALVAR
                            </Button>
                        </View>
                        <LittleLabel style={{paddingTop: 20}}
                                     onPress={() => navigation.navigate('Login')}>
                        </LittleLabel>

                    </Form>

                </Container>
            </KeyboardAwareScrollView>
        </>
    );
}

export default Contact;
