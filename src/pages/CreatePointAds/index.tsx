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
import {headerAuthorizationOrAlert, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import Input from "../../components/Input";
import DocumentPicker from "react-native-document-picker";


const window = Dimensions.get('window');
const fs = require('react-native-fs');

const CreatePointAds: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const qtyPointsRef = useRef<TextInput>(null);
    const expiryDateRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const [imageLabel, setImageLabel] = useState('Selecione uma imagem*');
    const [date, setDate] = useState(new Date());
    const [isFirstShowDate, setIsFirstShowDate] = useState(true);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [formattedDate, setFormatedDate] = useState('');

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
                const imagesString = await AsyncStorage.getItem('img');
                const image = imagesString === null ? null : JSON.parse(imagesString);

                data.img = '';

                if (image !== null) {
                    const base64 = await fs.readFile(image.fileCopyUri, 'base64');
                    data.img = `data:${image.type};base64,${base64}`;
                }

                data['expiry_date'] = expiryDate === null ? '' : expiryDate;
                data['qty_point'] = data['qty_point'] === '' ? undefined : data['qty_point'];

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    expiry_date: Yup.string()
                        .required('Uma data de expiração deve ser informada'),
                    img: Yup.string().required('É necessário escolher uma imagem'),
                    qty_point: Yup.number().required('A quantida de pontos deve ser informada.')
                        .min(1, 'A quantida de pontos deve ser maior que 0.'),
                    description: Yup.string()
                        .required('A descrição do anúncio é obrigatório')
                        .min(10, 'A descrição deve possuir no mínimo 10 caracteres!'),
                    title: Yup.string()
                        .required('Nome é obrigatório')
                        .min(10, 'O nome deve possuir no mínimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });


                await api.post('/point-ads', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu  anúncio foi cadastrado com sucesso');
                        AsyncStorage.removeItem('ads.expiry_date');
                        AsyncStorage.removeItem('img');
                        AsyncStorage.removeItem('ads.groups');
                        navigation.goBack();
                    })
                    .catch((error) => {
                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        if (422 === error.response.status) {

                            const messageError = error.response.data.message;

                            if (messageError) {
                                message = messageError;
                            } else {
                                const errors = error.response.data.errors;
                                message = errors[Object.keys(errors)[0]][0];
                            }

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
                        <Title>CRIAR ANÚNCIO DE PONTOS</Title>
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
                            placeholder="Título*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                titleRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={descriptionRef}
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

                        <Input
                            style={{}}
                            ref={qtyPointsRef}
                            name="qty_point"
                            icon="tag"
                            placeholder="Quantidade pontos*"
                            keyboardType="number-pad"
                            textContentType="newPassword"
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
                            value={formattedDate}
                            placeholder="Data de expiração*"
                            returnKeyType="next"
                            keyboardType="decimal-pad"
                            onTouchEnd={showDatepicker}
                            onSubmitEditing={() => {
                                expiryDateRef.current?.focus();
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

export default CreatePointAds;
