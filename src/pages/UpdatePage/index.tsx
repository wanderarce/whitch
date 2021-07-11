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
import {getPage, getUser, mainColor} from "../../utils/Util";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import logoImg from "../../assets/logo-dark-fonte.png";
const window = Dimensions.get('window');

const UpdatePage: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const descriptionRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const [page, setPage] = useState({});

    const navigation = useNavigation();

    const getPageId = async () => {
        return await AsyncStorage.getItem('pageId');
    };


    const loadPage = async () => {

        const id = await getPageId();
        const page = await getPage(id);

        if (page === null) {
            Alert.alert('Ocorre um erro', 'Não foi possível encontrar o texto');
            return;
        }

        await setPage(page);
    }

    useEffect(function () {
        loadPage();
    }, []);

    const create = useCallback(
        async (data) => {
            try {

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
                    text: Yup.string().required('O texto é obrigatório')
                        .min(10, 'O texto deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                const id = await getPageId();

                console.log(id);

                if (id === undefined) {
                    Alert.alert('Erro!', 'Desculpe, não foi possível atualizar o texto!');
                    return;
                }


                await api.patch(`/admin/pages/${id}`, data, config)
                    .then((response) => {
                        Alert.alert('Sucesso!', 'O texto foi atualizado com sucesso');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        console.log(error.response)

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

                console.log(error)
                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer cadastro, tente novamente.');
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

            <KeyboardAwareScrollView
                style={{flex: 1, backgroundColor: 'white'}}
            >


                <Container>

                    <View>
                        <Title style={{textTransform: 'uppercase'}}>{page.name}</Title>
                    </View>

                    <Form ref={formRef} onSubmit={create} style={{
                        borderTopWidth: 2,
                        borderColor: '#888'
                    }}>

                        <Input
                            ref={descriptionRef}
                            name="text"
                            placeholder="Texto"
                            textContentType="newPassword"
                            maxLength={255}
                            numberOfLines={15}
                            multiline={true}
                            returnKeyType="send"
                            defaultValue={page.text}
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

export default UpdatePage;
