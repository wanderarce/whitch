import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Dimensions, Image, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import SimpleInput from "../../components/SimpleInput";
import logoImg from "../../assets/logo-dark-fonte.png";
import {getMessageByAxiosError, headerAuthorizationOrAlert, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import {ImagePickerResponse, launchImageLibrary} from 'react-native-image-picker';
import * as Yup from "yup";
import api from "../../services/api";
import SegmentsSelect from "../../components/InputSegments";
import AsyncStorage from "@react-native-community/async-storage";
import Input from "../../components/Input";
import CityInput from "../../components/InputStates";
import DocumentPicker from "react-native-document-picker";


const window = Dimensions.get('window');
const fs = require('react-native-fs');

const CreateSponsoredAds: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const cellphoneRef = useRef<TextInput>(null);
    const cityIfRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const [imageLabel, setImageLabel] = useState('Selecione uma imagem*');
    const [formData, setFormData] = useState({});
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


    useEffect(function () {
        AsyncStorage.removeItem('stateSelected');
    }, []);

    const chooseImgError = {
        camera_unavailable: 'Câmera não disponível no aparelho',
        permission: 'Libere a permissão para este recurso em seu aparelho',
    }

    const getImageContent = async () => {

        await AsyncStorage.removeItem('imgs');

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            });

            if (res.size > 1048576) {
                Alert.alert('Atenção', 'A imagem não foi carregada pois tem mais que 1 mb.');
                return;
            }

            await AsyncStorage.setItem('img', JSON.stringify(res));
            setImageLabel('Imagem selecionada');

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

    const chooseImageCallback = async (response: ImagePickerResponse) => {

        if (response.errorCode !== null && response.errorCode !== undefined) {
            Alert.alert('Ocorreu um erro', chooseImgError[response.errorCode] ?? 'Tente novamente');
            return;
        }

        if (response.didCancel) {
            Alert.alert('Ops', 'É necessário escolher uma imagem para cadastrar um anúncio');
            return;
        }

        const img = `data:${response.type};base64,${response.base64}`;
        await AsyncStorage.setItem('ads.img.uploaded', img);

        setImageLabel('Imagem selecionada');
    }

    const handleImgCallBack = () => {
        handleChooseImg(chooseImageCallback)
    }

    const handleChooseImg = (callback) => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
        };
        launchImageLibrary(options, callback);
    };


    const create = useCallback(
        async (data) => {
            try {

                await setFormData(data);

                data.state_abbreviation = await AsyncStorage.getItem('stateSelected');


                console.log(data);
                // return ;

                if (!data.city_id && !data.state_abbreviation) {
                    Alert.alert('Ocorre um erro', 'É necessário informar uma cidade ou um estado');
                    return;
                }


                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    navigation.navigate('Login');
                    return null;
                }

                const imagesString = await AsyncStorage.getItem('img');
                const image = imagesString === null ? null : JSON.parse(imagesString);

                data.img = '';

                if (image !== null) {
                    const base64 = await fs.readFile(image.fileCopyUri, 'base64');
                    data.img = `data:${image.type};base64,${base64}`;
                }

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.cellphone = cleanLoginIdentification(cellphoneFormatted ?? '');

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    img: Yup.string().required('É necessário escolher uma imagem'),
                    cellphone: Yup.string().required('É necessário informar um telefone')
                        .min(10, 'Necessário informar o DDD e o Telefone'),
                    segment_id: Yup.string()
                        .required('Necessário escolher o segmento'),
                    description: Yup.string()
                        .required('A descrição do anúncio é obrigatório')
                        .min(10, 'A descrição deve possuir no mínimo 10 caracteres!'),
                    title: Yup.string()
                        .required('Titulo é obrigatório')
                        .min(10, 'O Titulo deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/sponsored-ads', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Anúncio foi cadastrado com sucesso');
                        AsyncStorage.removeItem('img');
                        navigation.goBack();
                    })
                    .catch((error) => {
                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        message = getMessageByAxiosError(error, message);

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

                console.log(error);

                Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer cadastro, tente novamente.');
            }
        },
        [navigation],
    );

    const updateState = async (abbreviation) => {
        await AsyncStorage.setItem('stateSelected', abbreviation);
    }


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
                        <Title>CRIAR ANÚNCIO PATROCINADO</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={create}
                    >

                        <Input
                            ref={titleRef}
                            autoCapitalize="words"
                            name="title"
                            icon="tag"
                            defaultValue={formData.title}
                            placeholder="Título*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                titleRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={descriptionRef}
                            name="description"
                            defaultValue={formData.description}
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
                            name="cellphone"
                            defaultValue={formData.cellphone}
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
                            onSelectedState={updateState}
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

export default CreateSponsoredAds;
