import React, {useCallback, useRef, useState} from "react";
import {Alert, Dimensions, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {getMessageByAxiosError, headerAuthorizationOrAlert, mainColor} from "../../utils/Util";

import Icon from 'react-native-vector-icons/Feather';
import {ContainerForm} from "./styles";
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
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');
const fs = require('react-native-fs');


const CreateSimpleUserByList: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const myGroups = useRef<TextInput>(null);
    const nameInputRef = useRef<TextInput>(null);
    const [csvLabel, setCsvLabel] = useState('Selecione um CSV*');

    const create = useCallback(
        async (data) => {
            try {

                const csvData = await AsyncStorage.getItem('csv');

                if (!csvData) {
                    Alert.alert('Ocorreu um erro', 'Não foi possível ler o CSV');
                    return;
                }

                data.csv = csvData;

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    group_ids: Yup.number().required('É obrigatório selecionar um grupo.')
                        .min(1, 'Selecione corretamente um grupo.'),
                    list_name: Yup.string().required('O nome da lista é obrigatório')
                        .min(3, 'O nome deve possuir no mínimo 3 caracteres!'),
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

                await api.post('/groups/bulk-pre-members', data, config)
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


    const getCsvContent = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles]
            });

            if (res.type !== 'text/comma-separated-values') {
                Alert.alert('Tipo inválido', 'Somente é permitido escolher arquivos do tipo CSV');
                return null;
            }

            return await fs.readFile(res.fileCopyUri, 'base64');

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

    const getCsvFile = async () => {
        await AsyncStorage.removeItem('csv');
        setCsvLabel('Selecione um CSV*');
        const base64 = await getCsvContent();
        await AsyncStorage.setItem('csv', base64);
        setCsvLabel('CSV Selecionado');
        return true;
    }

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
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <ContainerForm>
                    <View>
                        <Title>CADASTRAR LISTA</Title>
                    </View>

                    <Form ref={formRef} onSubmit={create}>

                        <Input
                            ref={nameInputRef}
                            name="list_name"
                            icon="user"
                            placeholder="Nome da lista*"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onSubmitEditing={() => {
                                nameInputRef.current?.focus();
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

                        <SimpleInput
                            name="img"
                            leftIcon="sidebar"
                            rightIcon="file"
                            placeholder={csvLabel}
                            returnKeyType="next"
                            editable={false}
                            righticonCallable={getCsvFile}
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

export default CreateSimpleUserByList;
