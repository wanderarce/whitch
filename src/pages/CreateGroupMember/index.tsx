import React, {useCallback, useRef} from "react";
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
import MyGroupsSelect from "../../components/InputMyGroups";
import SimpleInput from "../../components/SimpleInput";

const window = Dimensions.get('window');


const CreateGroupMember: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const myGroups = useRef<TextInput>(null);
    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);

    const create = useCallback(
        async (data) => {
            try {

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    group_ids: Yup.number().required('É obrigatório selecionar um grupo.')
                        .min(1, 'Selecione corretamente um grupo.'),
                    cellphone: Yup.string().min(10, 'Necessário informar o DDD e o Telefone'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    name: Yup.string().required('Nome obrigatório').min(3, 'O nome deve possuir no mínimo 3 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                data.group_ids = [data.group_ids];

                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    Alert.alert('Ocorreu um erro', 'Faça o login e tente novamente');
                    return null;
                }

                await api.post('/groups/pre-members', data, config)
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
                            ref={nameInputRef}
                            name="name"
                            icon="user"
                            placeholder="Nome*"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onSubmitEditing={() => {
                                nameInputRef.current?.focus();
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
                            onSubmitEditing={() => {
                                cellphoneRef.current?.focus();
                            }}
                        />

                        <MyGroupsSelect
                            ref={myGroups}
                            name="group_ids"
                            icon="tag"
                            returnKeyType="next"
                            required={true}
                            onSubmitEditing={() => {
                                myGroups.current?.focus();
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

export default CreateGroupMember;
