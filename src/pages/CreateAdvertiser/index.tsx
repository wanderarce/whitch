import React, {useCallback, useEffect, useRef, useState} from "react";
import {Alert, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';

import {Container, Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import CityInput from "../../components/InputStates";
import {LittleLabel} from "../SignUp";
import {Hr} from "../../components/Hr/styles";
import Footer from "../../components/Footer";
import {getUser, loadMainProfile, mainColor} from "../../utils/Util";
import SegmentsSelect from "../../components/InputSegments";
import PlansSelect from "../../components/InputPlans";
import Checkbox from "../../components/InputCheckbox";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";

const CreateAdvertiser: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const companyNameRef = useRef<TextInput>(null);
    const tradingNameRef = useRef<TextInput>(null);
    const registeredNumberRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const planIdRef = useRef<TextInput>(null);
    const cityIdRef = useRef<TextInput>(null);
    const termRef = useRef<Checkbox>(null);
    const consciousRef = useRef<Checkbox>(null);
    const navigation = useNavigation();

    const [loginIdentification, setLoginIdentification] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [temp, setTemp] = useState("");
    const getDDDFormatted = (value: any) => {

        if (value.length < 3) {
            return '(' + value;
        }

        const ddd = value.substr(0, 2);
        const number = value.substr(2)
        return `(${ddd})${number}`;
    }

    const getFormattedNumber = (value: any) => {

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

    const cleanLoginIdentification = (value: any) => {
        if (value.includes('(') && value.includes(')')) {
            value = value.replace('-', '');
        }

        return value.replace('(', '').replace(')', '');
    }

    const onChangeAddMaskCellphone = async (inputValue: any) => {

        let value = cleanLoginIdentification(inputValue);

        value = getDDDFormatted(value);
        value = getFormattedNumber(value);

        setLoginIdentification(value);
        await AsyncStorage.setItem('signUpCellphone', value);
        return;
    }

    const cleanMask = (value: any) => {
      if(value.includes('/') || value.includes('-') || value.includes('.') ){
        return value.replace('/','').replace('-','').replace('.','').replace('.','');
      }
      return value;
    }

    const onChangeAddMaskCNPJ = async (inputValue:string) => {

      let v = cleanMask(inputValue);
      if(v.length >= 14){
        v= v.substr(0,14);
        v=v.replace(/\D/g,"")                           //Remove tudo o que n??o ?? d??gito
        v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro d??gitos
        v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto d??gitos
        v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono d??gitos
        v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um h??fen depois do bloco de quatro d??gitos
        setCpfCnpj(v);
        await AsyncStorage.setItem('cnpj', v);
      }
      return;
    }
    const create = useCallback(
        async (data) => {
            try {

                const user = await getUser();
                const accessToken = user.access_token ?? null;

                if (accessToken === null) {
                    Alert.alert('Usu??rio n??o identificado!', 'Desculpe, ?? necess??rio realizar o login!');
                    return navigation.goBack();
                }

                const config = {
                    headers: {Authorization: `Bearer ${accessToken}`}
                };

                const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
                data.phone = cleanLoginIdentification(cellphoneFormatted);
                const cnpjFormatted = await AsyncStorage.getItem('cnpj')
                data.registered_number = cleanMask(cnpjFormatted);

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    plan_id: Yup.string().required('Necess??rio escolher um plano.'),
                    segment_id: Yup.string().required('Necess??rio escolher o segmento.'),
                    phone: Yup.string().required('Informe um telefone')
                        .min(11, 'Informe corretamente o ddd e seu n??mero de telefone.')
                        .max(11, 'Informe corretamente o ddd e seu n??mero de telefone.'),
                    city_id: Yup.string().required('Necess??rio informar um estado e uma cidade.'),
                    registered_number: Yup.string().required('Informe um CNPJ v??lido.')
                        .min(14, 'Informe um CNPJ v??lido.')
                        .max(14, 'Informe um CNPJ v??lido.'),
                    trading_name: Yup.string().required('Nome fantasia ?? obrigat??rio.')
                        .min(3, 'O nome fantasia deve possuir no m??nimo 3 caracteres.'),
                    company_name: Yup.string().required('Raz??o social ?? obrigat??rio.')
                        .min(3, 'A raz??o social deve possuir no m??nimo 3 caracteres.'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/advertisers', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu cadastro como an??nciante foi realizado com sucesso');
                        navigation.navigate('Login');
                    })
                    .catch((error) => {

                        let message = 'N??o foi poss??vel realizar o cadastro, por favor tente novamente.';

                        if (422 === error.response.status) {

                            const errorData = error.response.data;

                            console.log(errorData);

                            message = errorData.length !== 0
                                ? errorData.errors[Object.keys(errorData.errors)[0]][0]
                                : errorData.message;

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
            <KeyboardAwareScrollView
                style={{flex: 1}}
            >
                <Container>
                  <Icon name="chevron-left" size={30}
                    color={mainColor}
                    onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}/>

                    <View>
                        <Title>SEJA UM ANUNCIANTE</Title>
                    </View>

                    <Form
                        ref={formRef}
                        onSubmit={create}
                    >
                        <Input
                            ref={companyNameRef}
                            autoCapitalize="words"
                            name="company_name"
                            icon="tag"
                            placeholder="Raz??o Social"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                companyNameRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={tradingNameRef}
                            autoCapitalize="words"
                            name="trading_name"
                            icon="tag"
                            placeholder="Nome fantasia"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                tradingNameRef.current?.focus();
                            }}
                        />


                        <Input
                            ref={registeredNumberRef}
                            autoCorrect={false}
                            keyboardType="number-pad"
                            name="registered_number"
                            icon="sidebar"
                            placeholder="CNPJ"
                            returnKeyType="next"
                            onChangeText={onChangeAddMaskCNPJ}
                            value={cpfCnpj}
                            onSubmitEditing={() => {
                                registeredNumberRef.current?.focus();
                            }}
                        />

                        <CityInput
                            ref={cityIdRef}
                            name="city_id"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                cityIdRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={phoneRef}
                            name="phone"
                            icon="phone"
                            keyboardType="number-pad"
                            placeholder="Telefone"
                            returnKeyType="next"
                            value={loginIdentification}
                            onChangeText={onChangeAddMaskCellphone}
                            onSubmitEditing={() => {
                                phoneRef.current?.focus();
                            }}
                        />

                        <SegmentsSelect
                            ref={segmentIdRef}
                            name="segment_id"
                            icon="tag"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
                            }}
                        />

                        <PlansSelect
                            ref={planIdRef}
                            name="plan_id"
                            icon="tag"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                planIdRef.current?.focus();
                            }}
                        />

                        <Hr/>

                        <Checkbox
                            ref={termRef}
                            value={true}
                            label=" Aceito os termos & condi????es."
                            name="term"
                        />

                        <Checkbox
                            ref={consciousRef}
                            value={true}
                            label="Estou ciente da cobran??a para cadastro caso eu n??o tenha escolhido o plano gratuito."
                            name="conscious"
                        />

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            CADASTRAR
                        </Button>

                        <LittleLabel style={{paddingTop: 20}}
                                     onPress={() => navigation.navigate('Login')}>
                        </LittleLabel>

                    </Form>

                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default CreateAdvertiser;
