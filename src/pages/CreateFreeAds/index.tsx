import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Dimensions, FlatList, Image, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import SimpleInput from "../../components/SimpleInput";
import logoImg from "../../assets/logo-dark-fonte.png";
import {getMessageByAxiosError, headerAuthorizationOrAlert, is401, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import * as Yup from "yup";
import api from "../../services/api";
import SegmentsSelect from "../../components/InputSegments";
import AsyncStorage from "@react-native-community/async-storage";
import Input from "../../components/Input";
import CityInput from "../../components/InputStates";
import DocumentPicker from "react-native-document-picker";

const fs = require('react-native-fs');
const window = Dimensions.get('window');

const CreateFreeAds: () => void = () => {
    const formRef = useRef<FormHandles>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const cityIfRef = useRef<TextInput>(null);
    const qtyActiveAdverts = useRef<TextInput>(null);
    const navigation = useNavigation();
    const [imageLabel, setImageLabel] = useState('Selecione uma ou mais imagens');
    const [freeAdsTemp, setFreeAdsTemp] = useState({});
    const [amountLabel, setAmountLabel] = useState('Valor*');

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

    const getImageContent = async () => {

        await AsyncStorage.removeItem('imgs');

        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images]
            });

            let images = [];
            let hasBigSize = false;
            let limitExceed = false;
            let totalSize = 0;
            let maxSize = 4194304;

            for (const image of res) {

                if ((totalSize + image.size) > maxSize) {
                    limitExceed = true;
                    continue;
                }

                totalSize += image.size;

                if (image.size > 1048576) {
                    hasBigSize = true;
                    continue;
                }

                // base64 = await fs.readFile(image.fileCopyUri, 'base64');
                // images.push(`data:${image.type};base64,${base64}`);
                images.push(image);
            }

            console.log('Total size: ', totalSize);

            if (images.length > 0) {
                await AsyncStorage.setItem('imgs', JSON.stringify(images));
                setImageLabel('Imagen(s) selecionada(s)');
            }

            if (hasBigSize) {
                Alert.alert('Atenção', 'Uma ou mais imagens não foram carregadas pois tem mais que 3 mb.');
            }

            if (limitExceed) {
                Alert.alert('Atenção', 'Uma ou mais imagens não foram carregadas pois  a soma das imagens atingiu o tamanho máximo de 4 mb.');
            }

        } catch (err) {


            let message = DocumentPicker.isCancel(err)
                ? ''
                : 'Não foi possível carregar o arquivo.';


            if (message.length > 0) {
                Alert.alert('Ocorreu um erro', 'Não foi possível carregar as imagens.');
            }

            return null;
        }
    }

    useEffect(function () {
        setLoginIdentification('');
        // AsyncStorage.removeItem('imgs');
        // setImageLabel('Selecione uma ou mais imagens');
    }, []);

    const create = useCallback(
        async (data) => {
            try {
                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    navigation.navigate('Login');
                    return null;
                }

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.cellphone = cleanLoginIdentification(cellphoneFormatted);

                setFreeAdsTemp(data);

                const imagesString = await AsyncStorage.getItem('imgs');
                const images = imagesString === null ? [] : JSON.parse(imagesString);

                data.imgs = []

                for (const image of images) {
                    const base64 = await fs.readFile(image.fileCopyUri, 'base64');
                    data.imgs.push(`data:${image.type};base64,${base64}`);
                }

                if (data.amount === undefined || data.amount === null) {
                    data.amount = 0;
                }

                let amount = await AsyncStorage.getItem('realValue');

                data.amount = amount !== null
                    ? Number.parseInt(cleanAmount(amount))
                    : 0;

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    amount: Yup.number()
                        .required('É necessário informar o valor do produto')
                        .min(0, 'O valor deve ser maior que 0'),
                    imgs: Yup.array().of(Yup.string()).min(1, 'É necessário escolher no mínimo uma imagem'),
                    city_id: Yup.string().required('Necessário informar um estado e uma cidade'),
                    cellphone: Yup.string().min(10, 'Necessário informar o DDD e o Telefone'),
                    segment_id: Yup.string()
                        .required('Necessário escolher o segmento'),
                    description: Yup.string()
                        .required('A descrição do anúncio é obrigatório')
                        .min(10, 'A descrição deve possuir no mínimo 10 caracteres!'),
                    title: Yup.string()
                        .required('O nome do produto é obrigatório')
                        .min(10, 'O nome deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/free-ads', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu classificado foi cadastrado com sucesso');
                        AsyncStorage.removeItem('imgs');
                        AsyncStorage.removeItem('realValue');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        message = getMessageByAxiosError(error, message);


                        Alert.alert(
                            'Ocorreu um erro!',
                            message
                        );

                        if (is401(error)) {
                            navigation.navigate('Login');
                        }
                    });

            } catch (error) {

                if (error instanceof Yup.ValidationError) {
                    Alert.alert('Ocorreu um erro', error.message);
                    return;
                }
                console.log(error);
                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer cadastro, tente novamente.');
            }
        },
        [navigation],
    );


    // @ts-ignore
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
            <KeyboardAwareScrollView style={{flex: 1}}>

                <Container>

                    <View>
                        <Title>CRIAR CLASSIFICADOS</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={create}
                    >

                        <SimpleInput
                            ref={titleRef}
                            autoCapitalize="words"
                            name="title"
                            leftIcon="tag"
                            placeholder="Produto*"
                            returnKeyType="next"
                            defaultValue={freeAdsTemp.title}
                            onSubmitEditing={() => {
                                titleRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={descriptionRef}
                            defaultValue={freeAdsTemp.description}
                            name="description"
                            leftIcon="file"
                            placeholder="Descrição*"
                            maxLength={255}
                            numberOfLines={4}
                            multiline={true}
                            returnKeyType="send"
                            style={{minHeight: 100, padding: 10}}
                            onSubmitEditing={() => {
                                descriptionRef.current?.focus();
                            }}
                        />

                        <SegmentsSelect
                            ref={segmentIdRef}
                            name="segment_id"
                            icon="tag"
                            returnKeyType="send"
                            required={true}
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={cellphoneRef}
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            defaultValue={loginIdentification}
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
                            ref={cityIfRef}
                            name="city_id"
                            icon="lock"
                            placeholder="Senha"
                            secureTextEntry
                            textContentType="newPassword"
                            returnKeyType="send"
                            requiredCity={true}
                            requiredState={true}
                            onSubmitEditing={() => {
                                cityIfRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            name="img"
                            leftIcon="sidebar"
                            rightIcon="camera"
                            placeholder={imageLabel}
                            returnKeyType="next"
                            editable={false}
                            righticonCallable={getImageContent}
                        />

                        <Text style={{
                            fontSize:10,
                            textAlign: 'justify',
                            color: '#ccc',
                            paddingBottom: 14,
                        }}>
                            *Imagem melhor visualizado com resolução 880px x 340px, tamanho máximo para upload 1MB por arquivo
                        </Text>

                        <Input
                            style={{}}
                            ref={qtyActiveAdverts}
                            name="amount"
                            defaultValue={amountLabel}
                            icon="tag"
                            placeholder="Valor*"
                            keyboardType="number-pad"
                            textContentType="newPassword"
                            returnKeyType="send"
                            onChangeText={onChangeAddMaskMoney}
                            onSubmitEditing={() => {
                                qtyActiveAdverts.current?.focus();
                            }}
                        />

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            CADASTRAR
                        </Button>

                    </Form>

                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default CreateFreeAds;
