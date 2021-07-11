import React, {useCallback, useRef} from "react";
import {Alert, Image, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {mainColor} from "../../utils/Util";

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
import Footer from "../../components/Footer";

const window = Dimensions.get('window');

interface SegmentData {
    name: string;
    status: boolean;
}

const CreateSegment: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);


    const handleCreateSegment = useCallback(
        async (data: SegmentData) => {
            try {

                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().min(3, 'O nome do segmento deve possuir no mínimo 3 caracteres.')
                        .max(45, 'O nome do segmento deve possuir no máximo 45 caracteres.'),
                });

                await schema.validate(data, {
                    abortEarly: true,
                });

                data.status = true;

                await api.post('/segments', data)
                    .then((response) => {
                        Alert.alert('Sucesso', 'O segmento foi cadastrado com sucesso.')
                        navigation.navigate('ListSegments');
                    })
                    .catch((error) => {

                        let message = 'Ocorreu um erro ao tentar cadastrar o segmento.';

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
                Alert.alert(
                    'Ocorreu um erro', 'Ocorreu um erro ao tentar cadastrar o segmento.');
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
                        <Title>CRIAR SEGMENTOS</Title>
                    </View>

                    <Form ref={formRef} onSubmit={handleCreateSegment}>

                        <Input
                            ref={passwordInputRef}
                            name="name"
                            icon="tag"
                            placeholder="Nome do segmento"
                            textContentType="newPassword"
                            returnKeyType="send"
                            onSubmitEditing={() => {
                                passwordInputRef.current?.focus();
                            }}
                        />

                        <Button onPress={() => formRef.current?.submitForm()}>
                            SALVAR
                        </Button>
                    </Form>

                </ContainerForm>
            </KeyboardAwareScrollView>

            <Footer/>
        </>
    );
}

export default CreateSegment;
