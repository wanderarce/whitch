import React, {useCallback, useRef, useState} from "react";
import {Alert, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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
import {mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";

const window = Dimensions.get('window');


const CreatePlan: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const nameInputRef = useRef<TextInput>(null);
    const descriptionInputRef = useRef<TextInput>(null);
    const amountInputRef = useRef<TextInput>(null);
    const qtyAdvertsInputRef = useRef<TextInput>(null);
    const qtyActiveAdverts = useRef<TextInput>(null);

    const [amountLabel, setAmountLabel] = useState('Valor*');

    const cleanAmount = (value) => {
        return value.replace(/\D/g, "");
    }

    const onChangeAddMaskMoney = async (inputValue) => {


        let realValue = cleanAmount(inputValue);

        if (realValue === '') {
            AsyncStorage.removeItem('realValue')
            return 'Valor*';
        }

        let value = Number.parseInt(realValue).toString();

        if (value.length < 4) {
            value = value.padStart(4, 0);
        }

        let firstPart = value.substr(0, value.length - 2);
        let lastPart = value.substr(value.length - 2);

        await AsyncStorage.setItem('realValue', value);
        setAmountLabel(`R$ ${firstPart},${lastPart}`);
    }

    const handleCreatePlan = useCallback(
        async (data: any) => {
            try {

                if (data.amount === undefined || data.amount === null) {
                    data.amount = 0;
                }

                let amount = await AsyncStorage.getItem('realValue');

                data.amount = amount !== null
                    ? Number.parseInt(cleanAmount(amount))
                    : 0;


                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    qty_active_adverts: Yup.number().min(0, 'A quantidade de anúncios ativos deve ser maior que 0'),
                    qty_adverts: Yup.number().min(0, 'A quantidade de anúncios deve ser maior que 0'),
                    amount: Yup.number().min(0, 'O valor deve ser maior que 0'),
                    description: Yup.string().min(3, 'O nome do plano deve possuir no mínimo 3 caracteres.')
                        .max(255, 'A descrição do plano deve possuir no máximo 255 caracteres.'),
                    name: Yup.string().min(3, 'O nome do segmento deve possuir no mínimo 3 caracteres.')
                        .max(45, 'O nome do segmento deve possuir no máximo 45 caracteres.'),
                });

                if (data.qty_adverts.length < 1 || data.qty_active_adverts.length < 1 || data.amount.length < 1) {
                    throw new Yup.ValidationError(['O valor, quantidade de anúncios e anúncios ativos devem ser maior que zero']);
                }

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/plans', data)
                    .then((response) => {
                        Alert.alert('Sucesso', 'O plano foi cadastrado com sucesso.');
                        AsyncStorage.removeItem('realValue');
                        return navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Ocorreu um erro ao tentar cadastrar o plano.';

                        if (422 === error.response.status) {
                            const errors = error.response.data.errors;
                            message = errors[Object.keys(errors)[0]][0];
                        }

                        Alert.alert(
                            'Ocorreu um erro',
                            message
                        );
                    });

            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    Alert.alert('Ocorreu um erro...', error.message);
                    return;
                }

                console.log(error)
                Alert.alert(
                    'Ocorreu um erro!', 'Ocorreu um erro ao tentar cadastrar o plano.');
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
                        <Title>CRIAR PLANO</Title>
                    </View>

                    <Form ref={formRef} onSubmit={handleCreatePlan}>

                        <Input
                            ref={nameInputRef}
                            name="name"
                            icon="tag"
                            placeholder="Nome do plano*"
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                nameInputRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={descriptionInputRef}
                            name="description"
                            icon="tag"
                            placeholder="Descrição do plano*"
                            textContentType="newPassword"
                            maxLength={255}
                            numberOfLines={4}
                            multiline={true}
                            returnKeyType="send"
                            style={{minHeight: 100, padding: 10}}
                            onSubmitEditing={() => {
                                descriptionInputRef.current?.focus();
                            }}
                        />

                        <Input
                            style={{}}
                            ref={amountInputRef}
                            name="amount"
                            icon="tag"
                            placeholder="Quantidade de anúncios*"
                            keyboardType="number-pad"
                            textContentType="newPassword"
                            returnKeyType="send"
                            defaultValue={amountLabel}
                            onChangeText={onChangeAddMaskMoney}
                            onSubmitEditing={() => {
                                amountInputRef.current?.focus();
                            }}
                        />

                        <Input
                            style={{}}
                            ref={qtyAdvertsInputRef}
                            name="qty_adverts"
                            icon="tag"
                            placeholder="Quantidade de anúncios*"
                            keyboardType="number-pad"
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                qtyAdvertsInputRef.current?.focus();
                            }}
                        />

                        <Input
                            style={{}}
                            ref={qtyActiveAdverts}
                            name="qty_active_adverts"
                            icon="tag"
                            placeholder="Quantidade de anúncios ativos*"
                            keyboardType="number-pad"
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                qtyActiveAdverts.current?.focus();
                            }}
                        />

                        <Button onPress={() => formRef.current?.submitForm()}>
                            SALVAR
                        </Button>
                    </Form>

                </ContainerForm>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default CreatePlan;
