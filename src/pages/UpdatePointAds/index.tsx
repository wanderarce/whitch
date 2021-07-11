import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Dimensions, Image, Platform, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import SimpleInput from "../../components/SimpleInput";
import logoImg from "../../assets/logo-dark-fonte.png";
import {
    getMessageByAxiosError,
    getPointAdsById,
    headerAuthorizationOrAlert,
    mainColor
} from "../../utils/Util";
import Footer from "../../components/Footer";
import {ImagePickerResponse, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";


const window = Dimensions.get('window');

const UpdatePointAds: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const qtyPointsRef = useRef<TextInput>(null);
    const expiryDateRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const [imageLabel, setImageLabel] = useState('Selecione uma imagem');
    const [date, setDate] = useState(new Date());
    const [isFirstShowDate, setIsFirstShowDate] = useState(true);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [formattedDate, setFormatedDate] = useState('');

    const [currentPointAds, setCurrentPointAds] = useState({});
    let pointAdsId = 0;

    const chooseImgError = {
        camera_unavailable: 'Câmera não disponível no aparelho',
        permission: 'Libere a permissão para este recurso em seu aparelho',
    }

    const getPointAdsId = () => {
        return AsyncStorage.getItem('currentPointAdsId');
    };

    const loadPointAds = async () => {
        const id = await getPointAdsId();
        pointAdsId = id;
        const pointAds = await getPointAdsById(id);

        if (pointAds === null) {
            return;
        }

        const expiry_date = new Date(pointAds.expiry_date.split(' ')[0] + 'T03:00:00');
        AsyncStorage.setItem('ads.expiry_date', expiry_date.getFullYear() + '-' + (expiry_date.getMonth() + 1) + '-' + expiry_date.getDate());
        setFormatedDate(formatDate(expiry_date))
        pointAds.qty_point = pointAds.qty_point.toString();

        setCurrentPointAds(pointAds);
    };


    useEffect(function () {
        loadPointAds();
    }, [])


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

    const formatDate = (date: Date): string => {

        const day = date.getDate().toString().padStart(2, 0);
        const month = (date.getMonth() + 1).toString().padStart(2, 0);
        const year = date.getFullYear().toString();
        return day + '/' + month + '/' + year;
    }

    useEffect(function () {

        if (isFirstShowDate) {
            setIsFirstShowDate(false);
            return;
        }

        const unformattedDate = new Date(date);
        setFormatedDate(formatDate(unformattedDate))

    }, [date]);

    const onChangeDate = async (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        AsyncStorage.setItem('ads.expiry_date', currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate());
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const create = useCallback(
        async (data) => {

            try {

                const config = await headerAuthorizationOrAlert();

                if (config === null) {
                    navigation.navigate('Login');
                    return null;
                }

                const expiryDate = await AsyncStorage.getItem('ads.expiry_date');
                const img = await AsyncStorage.getItem('ads.img.uploaded');

                data['expiry_date'] = expiryDate === null ? '' : expiryDate;
                data['qty_point'] = data['qty_point'] === '' ? undefined : data['qty_point'];
                data['img'] = img === null ? '' : img;

                if (data['img'] === '') {
                    delete data.img;
                }


                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    expiry_date: Yup.string()
                        .required('Uma data de expiração deve ser informada'),
                    qty_point: Yup.number().required('A quantida de pontos deve ser informada.')
                        .min(1, 'A quantida de pontos deve ser maior que 0.'),
                    description: Yup.string()
                        .required('A descrição do anúncio é obrigatório')
                        .min(10, 'A descrição deve possuir no mínimo 10 caracteres!'),
                    title: Yup.string()
                        .required('o título é obrigatório')
                        .min(10, 'O nome deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });


                const url = `point-ads/${pointAdsId}`;
                console.log(data, url, config);

                await api.patch(url, data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu  anúncio foi atualizado com sucesso');
                        AsyncStorage.removeItem('ads.expiry_date');
                        AsyncStorage.removeItem('ads.img.uploaded');
                        AsyncStorage.removeItem('ads.groups');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        Alert.alert(
                            'Ocorreu um erro!',
                            getMessageByAxiosError(error, 'Não foi possível realizar o cadastro, por favor tente novamente.')
                        );
                    });

            } catch (error) {

                if (error instanceof Yup.ValidationError) {
                    Alert.alert('Ocorreu um erro', error.message);
                    return;
                }

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
                          onPress={() =>  navigation.openDrawer()}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1}}>

                <Container>

                    <View>
                        <Title>ATUALIZAR ANÚNCIO DE PONTOS</Title>
                    </View>


                            <Form
                                ref={formRef}
                                onSubmit={create}
                            >

                                <SimpleInput
                                    ref={titleRef}
                                    defaultValue={currentPointAds.title}
                                    autoCapitalize="words"
                                    name="title"
                                    leftIcon="tag"
                                    placeholder="Título"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        titleRef.current?.focus();
                                    }}
                                />

                                <SimpleInput
                                    ref={descriptionRef}
                                    defaultValue={currentPointAds.description}
                                    name="description"
                                    leftIcon="file"
                                    placeholder="Descrição"
                                    maxLength={255}
                                    numberOfLines={4}
                                    multiline={true}
                                    returnKeyType="send"
                                    style={{minHeight: 100, padding: 10}}
                                    onSubmitEditing={() => {
                                        descriptionRef.current?.focus();
                                    }}
                                />


                                <SimpleInput
                                    defaultValue={currentPointAds.qty_point}
                                    ref={qtyPointsRef}
                                    name="qty_point"
                                    leftIcon="tag"
                                    placeholder="Quantidade pontos"
                                    keyboardType="number-pad"
                                    returnKeyType="send"
                                    onSubmitEditing={() => {
                                        qtyPointsRef.current?.focus();
                                    }}
                                />

                                <SimpleInput
                                    name="img"
                                    leftIcon="sidebar"
                                    rightIcon="camera"
                                    placeholder={imageLabel}
                                    returnKeyType="next"
                                    editable={false}
                                    righticonCallable={handleImgCallBack}
                                />

                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeDate}
                                    />
                                )}


                                <SimpleInput
                                    ref={expiryDateRef}
                                    autoCapitalize="words"
                                    name="expiry_date"
                                    leftIcon="tag"
                                    defaultValue={currentPointAds.expiry_date}
                                    value={formattedDate}
                                    placeholder="Data de expiração"
                                    returnKeyType="next"
                                    keyboardType="decimal-pad"
                                    onTouchEnd={showDatepicker}
                                    onSubmitEditing={() => {
                                        expiryDateRef.current?.focus();
                                    }}
                                />

                                <Button
                                    onPress={() => formRef.current?.submitForm()}>
                                    SALVAR
                                </Button>

                            </Form>


                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default UpdatePointAds;
