import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Dimensions, FlatList, Image, Platform, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import {Label} from "./styles";
import SimpleInput from "../../components/SimpleInput";
import logoImg from "../../assets/logo-dark-fonte.png";
import {
    getAllActiveGroups,
    getMessageByAxiosError,
    headerAuthorizationOrAlert,
    loadMainProfile,
    mainColor
} from "../../utils/Util";
import Footer from "../../components/Footer";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as yup from "yup";
import api from "../../services/api";
import SegmentsSelect from "../../components/InputSegments";
import Checkbox from "../../components/InputCheckbox";
import AsyncStorage from "@react-native-community/async-storage";
import DocumentPicker from "react-native-document-picker";


const window = Dimensions.get('window');
const fs = require('react-native-fs');

const CreateAds: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const voucherRef = useRef<TextInput>(null);
    const expiryDateRef = useRef<TextInput>(null);
    const pointCoinsRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const [imageLabel, setImageLabel] = useState('Selecione uma imagem*');
    const [date, setDate] = useState(new Date());
    const [isFirstShowDate, setIsFirstShowDate] = useState(true);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [formattedDate, setFormatedDate] = useState('');
    // const [selectAllGroups, setSelectAllGroup] = useState(false);
    const [groups, setGroups] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const [tempAds, setTempAds] = useState({});

    const getImageContent = async () => {

        await AsyncStorage.removeItem('imgs');

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            });

            if (res.size > 1048576) {
                Alert.alert('Aten????o', 'A imagem n??o foi carregada pois tem mais que 1 mb.');
                return;
            }

            await AsyncStorage.setItem('img', JSON.stringify(res));
            setImageLabel('Imagem selecionada');

        } catch (err) {

            let message = DocumentPicker.isCancel(err)
                ? ''
                : 'N??o foi poss??vel carregar o arquivo.';

            if (message.length > 0) {
                Alert.alert('Ocorreu um erro', 'N??o foi poss??vel carregar as imagens.');
            }

            return null;
        }
    }

    const addSelectedGroup = async (id: number) => {
        const selectedGroups = await getSelectedGroups();
        const groups = [id, ...selectedGroups];
        await AsyncStorage.setItem('ads.groups', groups.join(','));
    };

    const getSelectedGroups = async () => {
        const strGroups = await AsyncStorage.getItem('ads.groups');
        return strGroups === null
            ? []
            : strGroups.split(',').map((item) => parseInt(item));
    }

    const removeSelectedGroup = async (id: number) => {
        const selectedGroups = await getSelectedGroups();
        const groups = selectedGroups.filter((value) => value != id);
        await AsyncStorage.setItem('ads.groups', [groups].join(','));

    };

    const formatDate = (date: Date): string => {

        const day = date.getDate().toString().padStart(2, 0);
        const month = (date.getMonth() + 1).toString().padStart(2, 0);
        const year = date.getFullYear().toString();
        return day + '/' + month + '/' + year;
    }

    const loadGroups = async () => {
        const groups = await getAllActiveGroups();

        setGroups(groups);
    }

     const loadProfile = async () => {
         const profile = await loadMainProfile();
         if(profile == null || profile.isActiveAdvertiser != true){
             Alert.alert('Cadastro inativo', 'Seu cadastro de anunciante no momento est?? inativo');
             return navigation.goBack();
         }
     }

    useEffect(function () {
        loadProfile();
        loadGroups();
    }, []);


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

    // const showTimepicker = () => {
    //     showMode('time');
    // };

    const canSend = async () => {

        if (!isSending) {
            await setIsSending(true);
            return true;
        }

        return false;
    }

    const create = useCallback(
        async (data) => {
            try {

                const sending = await canSend();
                if (!sending) {
                    return;
                }
                await setIsSending(true);
                const config = await headerAuthorizationOrAlert();
                if (config === null) {
                    navigation.navigate('Login');
                    return null;
                }

                await setTempAds(data);

                const expiryDate = await AsyncStorage.getItem('ads.expiry_date');
                const imagesString = await AsyncStorage.getItem('img');
                const image = imagesString === null ? null : JSON.parse(imagesString);

                data.img = '';

                if (image !== null) {
                    const base64 = await fs.readFile(image.fileCopyUri, 'base64');
                    data.img = `data:${image.type};base64,${base64}`;
                }

                data['expiry_date'] = expiryDate === null ? '' : expiryDate;
                data['groups'] = await getSelectedGroups();
                data['point_coins'] = data['point_coins'] === '' ? undefined : data['point_coins'];
                formRef.current?.setErrors({});
                const schema = yup.object().shape({
                    groups: yup.array()
                        .min(1, '?? necess??rio escolher no m??nimo um grupo'),
                    img: yup.string().required('?? necess??rio escolher uma imagem'),
                    point_coins: yup.number()
                        .required('?? necess??rio informar a quantidade de pontos moedas')
                        .min(0, 'O valo m??nimo de pontos moedas ?? 0'),
                    voucher: yup.string().required('?? necess??rio informar um voucher')
                        .min(4, 'O voucher deve possuir no m??nimo 4 caracter!'),
                    segment_id: yup.string().required('Necess??rio escolher o segmento'),
                    expiry_date: yup.string()
                        .required('Uma data de expira????o deve ser informada'),
                    description: yup.string()
                        .required('A descri????o do an??ncio ?? obrigat??rio')
                        .min(10, 'A descri????o deve possuir no m??nimo 10 caracteres!'),
                    title: yup.string()
                        .required('O t??tulo ?? obrigat??rio')
                        .min(10, 'O nome deve possuir no m??nimo 10 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });


                await api.post('/ads', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu  an??ncio foi cadastrado com sucesso');
                        AsyncStorage.removeItem('ads.expiry_date');
                        AsyncStorage.removeItem('ads.groups');
                        AsyncStorage.removeItem('img');
                        setIsSending(false);
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = getMessageByAxiosError(error, 'N??o foi poss??vel realizar o cadastro, por favor tente novamente!')

                        Alert.alert(
                            'Ocorreu um erro!',
                            message
                        );

                        setIsSending(false);

                    });

            } catch (error) {

                setIsSending(false);
                let errorMessage = 'Ocorreu um erro ao fazer cadastro, tente novamente.';

                if (error instanceof yup.ValidationError) {
                    errorMessage = error.message;
                }

                Alert.alert('Erro no cadastro', errorMessage);
                // Alert.alert('Debug', error.toString());
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
                        <Title>CRIAR AN??NCIO</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={create}
                    >

                        <SimpleInput
                            ref={titleRef}
                            autoCapitalize="words"
                            name="title"
                            defaultValue={tempAds.title}
                            leftIcon="tag"
                            placeholder="T??tulo*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                titleRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={descriptionRef}
                            name="description"
                            defaultValue={tempAds.description}
                            leftIcon="file"
                            placeholder="Descri????o*"
                            maxLength={255}
                            numberOfLines={4}
                            multiline={true}
                            returnKeyType="send"
                            style={{minHeight: 100, padding: 10}}
                            onSubmitEditing={() => {
                                descriptionRef.current?.focus();
                            }}
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
                            value={formattedDate}
                            placeholder="Data de expira????o*"
                            returnKeyType="next"
                            keyboardType="decimal-pad"
                            onTouchEnd={showDatepicker}
                            onSubmitEditing={() => {
                                expiryDateRef.current?.focus();
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

                        <SimpleInput
                            ref={voucherRef}
                            autoCapitalize="words"
                            name="voucher"
                            leftIcon="credit-card"
                            placeholder="Voucher*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                voucherRef.current?.focus();
                            }}
                        />

                        <SimpleInput
                            ref={pointCoinsRef}
                            name="point_coins"
                            leftIcon="octagon"
                            placeholder="Pontos moedas por compra*"
                            returnKeyType="next"
                            keyboardType="number-pad"
                            onSubmitEditing={() => {
                                pointCoinsRef.current?.focus();
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
                            fontSize: 10,
                            textAlign: 'justify',
                            color: '#ccc',
                            paddingBottom: 14,
                        }}>
                            *Imagem melhor visualizado com resolu????o 880px x 340px, tamanho m??ximo para upload 1MB por
                            arquivo
                        </Text>

                        <Label>Escolher grupo*</Label>

                        {/*/!*Selecionar todos*!/*/}
                        {/*<Checkbox*/}
                        {/*    ref={checkBoxAll}*/}
                        {/*    label="Todos os grupos"*/}
                        {/*    name="public_cellphone"*/}
                        {/*    onChange={(value) => {*/}
                        {/*        setSelectAllGroup(selectAllGroups ? true : false);*/}
                        {/*    }}*/}
                        {/*/>*/}

                        <FlatList data={groups} keyExtractor={((item, index) => item.id.toString())}
                                  renderItem={({item}) =>

                                      <Checkbox
                                          label={item.name}
                                          name="public_cellphone"
                                          onChange={(value) => {
                                              value ? addSelectedGroup(item.id) : removeSelectedGroup(item.id);
                                          }}
                                      />

                                  }/>

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

export default CreateAds;
