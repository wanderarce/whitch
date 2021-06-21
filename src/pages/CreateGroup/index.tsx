import React, {useCallback, useRef} from "react";
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
import {getUser, mainColor} from "../../utils/Util";
import GroupTypeSelect from "../../components/InputGroupType";
import SegmentsSelect from "../../components/InputSegments";
import * as Yup from "yup";
import api from "../../services/api";


const CreateGroup: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const nameRef = useRef<TextInput>(null);
    const responsibleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const segmentIdRef = useRef<TextInput>(null);
    const typeIdRef = useRef<TextInput>(null);
    const cityIfRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const create = useCallback(
        async (data) => {
            try {

                const user = await getUser();
                const accessToken = user.access_token ?? null;

                if (accessToken === null) {
                    Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
                    return;
                }

                const config = {
                    headers: {Authorization: `Bearer ${accessToken}`}
                };

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    city_id: Yup.string().required('Necessário informar um estado e uma cidade'),
                    type_id: Yup.string().required('Necessário escolher o tipo de grupo'),
                    segment_id: Yup.string().required('Necessário escolher o segmento'),
                    description: Yup.string().min(20, 'Uma descrição maior deve ser informada'),
                    responsible_name: Yup.string().required('Nome do responsável é obrigatório')
                        .min(5, 'Informe o nome completo do responsável!'),
                    name: Yup.string().required('Nome é obrigatório')
                        .min(3, 'O nome deve possuir no mínimo 3 caracteres!'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                await api.post('/groups', data, config)
                    .then((response) => {
                        Alert.alert('Cadastro realizado!', 'Seu grupo foi cadastrado com sucesso');
                        navigation.goBack();
                    })
                    .catch((error) => {

                        let message = 'Não foi possível realizar o cadastro, por favor tente novamente.';

                        console.log(error)

                        if (422 === error.response.status) {
                            const errors = error.response.data.errors;
                            message = errors[Object.keys(errors)[0]][0];
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

                    <Icon name="chevron-left" size={30} color={mainColor}
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}/>

                    <View>
                        <Title>CADASTRAR GRUPO</Title>
                    </View>

                    <Form ref={formRef} onSubmit={create}>

                        <Input
                            ref={nameRef}
                            autoCapitalize="words"
                            name="name"
                            icon="users"
                            placeholder="Nome do grupo*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                nameRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={responsibleRef}
                            autoCapitalize="words"
                            name="responsible_name"
                            icon="user"
                            placeholder="Nome completo do responsável*"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                responsibleRef.current?.focus();
                            }}
                        />

                        <Input
                            ref={descriptionRef}
                            name="description"
                            icon="file"
                            placeholder="Descrição*"
                            textContentType="newPassword"
                            maxLength={255}
                            numberOfLines={4}
                            multiline={true}
                            returnKeyType="send"
                            style={{minHeight: 100, padding: 10}}
                            onSubmitEditing={() => {
                                segmentIdRef.current?.focus();
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

                        <GroupTypeSelect
                            ref={typeIdRef}
                            name="type_id"
                            icon="tag"
                            required={true}
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                typeIdRef.current?.focus();
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

                        <Button
                            onPress={() => formRef.current?.submitForm()}>
                            CADASTRAR
                        </Button>

                        <LittleLabel style={{paddingTop: 20}}
                                     onPress={() => navigation.navigate('Login')}>
                        </LittleLabel>

                    </Form>

                </Container>
            </KeyboardAwareScrollView>
        </>
    );
}

export default CreateGroup;
