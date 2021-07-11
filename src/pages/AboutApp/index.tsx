import React, {useEffect, useState} from "react";
import {Alert, Dimensions, Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getPage, mainColor} from "../../utils/Util";
import logoImg from "../../assets/logo-dark-fonte.png";
const window = Dimensions.get('window');


const AboutApp: React.FC = () => {
    const [page, setPage] = useState({});

    const navigation = useNavigation();

    const loadPage = async (id) => {

        const page = await getPage(id);

        if (page === null) {
            Alert.alert('Ocorre um erro', 'Não foi possível encontrar o texto');
            return;
        }

        await setPage(page);
    }

    useEffect(function () {
        loadPage(1);
    }, []);


    return (
        <>
            <KeyboardAwareScrollView
                style={{flex: 1, backgroundColor: 'white'}}
            >


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


                <Container>

                    <View>
                        <Title style={{textTransform: 'uppercase'}}>{page.name}</Title>
                    </View>

                    <View>
                        <Text style={{
                            textAlign: 'justify'
                        }}>
                            {page.text}
                        </Text>
                    </View>


                </Container>
            </KeyboardAwareScrollView>
        </>
    );
}

export default AboutApp;
