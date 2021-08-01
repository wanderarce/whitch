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
import {getAdvertiser, getUser, loadMainProfile, mainColor, headerAuthorizationOrAlert, myProfile} from "../../utils/Util";
import SegmentsSelect from "../../components/InputSegments";
import PlansSelect from "../../components/InputPlans";
import Checkbox from "../../components/InputCheckbox";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import MaskedInput from 'react-text-mask';

const EditAdvertiser: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const advertiserIdRef = useRef<TextInput>(null);
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
    const [advertiser, setAdvertiser] = useState({});
    const [profile, setProfile] = useState({});
    const [id, setId] = useState(null);
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [mask, setMask] = useState("");

    const getDDDFormatted = (value: any) => {
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

    const cleanLoginIdentification = (value:any) => {
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
      return value.replace('/','').replace('-','').replace('.','').replace('.','');
    }
    const onChangeAddMaskCNPJ = async (inputValue:string) => {

      let v = cleanMask(inputValue);
      if(v.length >= 14){
        v= v.substr(0,14);
        v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
        v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
        v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
        v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
        v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
        setCpfCnpj(v);
        await AsyncStorage.setItem('cnpj', v);
      }
      return;
    }

    const loadAdvertiser = async () => {
        const profile = await myProfile();
        const advertiser = await getAdvertiser(profile?.advertiser_id);
        setProfile(profile);
        setAdvertiser(advertiser);
        onChangeAddMaskCellphone(advertiser.phone);
        onChangeAddMaskCNPJ(advertiser.registered_number);
        //planIdRef.current?.props.value = advertiser.plan_id;

    };

    useEffect(function () {
        loadAdvertiser();
    }, []);

    const create = useCallback(
        async (data) => {
            try {
                const user = await getUser();
                const accessToken = user.access_token ?? null;

                if (accessToken === null) {
                  Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
                  return navigation.goBack();
                }

              const getConfig = async () => {
                  return await headerAuthorizationOrAlert();
              };

              const config = await getConfig();



              const cellphoneFormatted = await AsyncStorage.getItem('signUpCellphone')
              data.phone = cleanLoginIdentification(cellphoneFormatted);
              const cnpjFormatted = await AsyncStorage.getItem('cnpj')
              data.registered_number = cleanMask(cnpjFormatted);
              formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                  plan_id: Yup.string().required('Necessário escolher um plano.'),
                  segment_id: Yup.string().required('Necessário escolher o segmento.'),
                  phone: Yup.string().required('Informe um telefone')
                        .min(11, 'Informe corretamente o ddd e seu número de telefone.')
                        .max(11, 'Informe corretamente o ddd e seu número de telefone.'),
                  city_id: Yup.string().required('Necessário informar um estado e uma cidade.'),
                  registered_number: Yup.string().required('Informe um CNPJ válido.')
                        .min(14, 'Informe um CNPJ válido.')
                        .max(14, 'Informe um CNPJ válido.'),
                  trading_name: Yup.string().required('Nome fantasia é obrigatório.')
                        .min(3, 'O nome fantasia deve possuir no mínimo 3 caracteres.'),
                  company_name: Yup.string().required('Razão social é obrigatório.')
                        .min(3, 'A razão social deve possuir no mínimo 3 caracteres.'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });
                delete data.term;
                delete data.conscious;
                const perfil = await myProfile();
                data.id = perfil.advertiser_id;
                await api.put(`advertisers/${perfil.advertiser_id}/update`, data,
                 config)
                    .then((response) => {
                        Alert.alert('Cadastro atualizado!', 'Seu cadastro como anunciante foi realizado com sucesso');
                        //navigation.navigate('Login');
                    })
                    .catch((error) => {
                        let message = 'Não foi possível atualizar o cadastro, por favor tente novamente.';

                        if (422 === error.response.status) {

                            const errorData = error.response.data;

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
                            defaultValue={advertiser.company_name}
                            autoCapitalize="words"
                            name="company_name"
                            icon="tag"
                            placeholder="Razão Social"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                companyNameRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={tradingNameRef}
                            defaultValue={advertiser.trading_name}
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
                          value={advertiser?.registered_number}
                          autoCorrect={false}
                          keyboardType="number-pad"
                          name="registered_number"
                          icon="sidebar"
                          placeholder="CNPJ"
                          returnKeyType="next"
                          value={cpfCnpj}
                          onChangeText={onChangeAddMaskCNPJ}
                          onSubmitEditing={() => {
                            registeredNumberRef.current?.focus();
                          }}
                        />

                        <CityInput
                            ref={cityIdRef}
                            //defaultValue={advertiser?.city_id}
                            value={advertiser?.city_id}
                            name="city_id"
                            requiredCity={true}
                            requiredState={true}
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                cityIdRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={phoneRef}
                            value={advertiser?.phone}
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
                            value={advertiser?.segment_id}
                            required={true}
                            name="segment_id"
                            icon="tag"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
                            }}
                        />

                        <PlansSelect
                          ref={planIdRef}
                          value={advertiser?.plan_id}
                          required={true}
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
                            label=" Aceito os termos & condições."
                            name="term"
                        />

                        <Checkbox
                            ref={consciousRef}
                            value={true}
                            label="Estou ciente da cobrança para cadastro caso eu não tenha escolhido o plano gratuito."
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

export default EditAdvertiser;
