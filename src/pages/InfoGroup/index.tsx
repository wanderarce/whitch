import {Dimensions, Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, InfoGroupBox, InfoGroupInfo, InfoGroupLabel, Title} from "./styles";
import logoImg from "../../assets/logo-dark-fonte.png";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import React, {useEffect, useState} from "react";
import {mainColor} from "../../utils/Util";
import AsyncStorage from "@react-native-community/async-storage";
import {byId} from "../../services/Groups";

const window = Dimensions.get('window');

interface IGroup {
    name: string,
    responsible_name: string,
    cellphone_reponsible: string,
    segment: string,
    address: string,
    email: string,
    type: string,
}

const groupWhenForLoadingPage: IGroup = () => {

    const group: IGroup = {
        name: 'Carregando...',
        description: 'Carregando...',
        responsible_name: 'Carregando...',
        type: 'Carregando...',
        segment: 'Carregando...',
        address: 'Carregando...',
        email: 'Carregando...'
    };

    return group;
}

const transformGroupResponse: IGroup = (groupData: object) => {

    const group: IGroup = {
        name: groupData.name,
        description: groupData.description,
        responsible_name: groupData.responsible_name,
        type: groupData.type,
        segment: groupData.segment,
        address: groupData.address,
        email: groupData.email
    }

    return group;
}


const InfoGroup: React.FC = () => {
    const navigation = useNavigation();
    const [group, setGroup] = useState<IGroup>(groupWhenForLoadingPage);


    const loadGroupInfo = async () => {
        const groupId = await getGroupId();
        const group = await byId(Number.parseInt(groupId));
        setGroup(transformGroupResponse(group));
    };

    const getGroupId = () => {
        return AsyncStorage.getItem('currentGroupView');
    };

    useEffect(function () {
        setGroup(groupWhenForLoadingPage)
        loadGroupInfo();
    }, []);


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
                          onPress={() => {
                              navigation.canGoBack()
                                  ? navigation.goBack()
                                  : navigation.navigate('MyProfile');
                          }}
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
                          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SignIn')}
                    />
                </View>

            </View>
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container style={{backgroundColor: "#FFF"}}>

                    <View>
                        <Title>{group.name}</Title>
                        <Text style={{color: "#555", marginBottom: 30}}>{group.description}</Text>
                    </View>

                    <InfoGroupBox>

                        <InfoGroupLabel>
                            RESPONSÁVEL:
                            <InfoGroupInfo>
                                {' '} {group.responsible_name}
                            </InfoGroupInfo>
                        </InfoGroupLabel>

                        {/*<InfoGroupLabel>*/}
                        {/*    TELEFONE RESPONSÁVEL:*/}
                        {/*    <InfoGroupInfo>*/}
                        {/*        {' '} {group.cellphone_reponsible}*/}
                        {/*    </InfoGroupInfo>*/}
                        {/*</InfoGroupLabel>*/}

                        <InfoGroupLabel>
                            SEGMENTO:
                            <InfoGroupInfo>
                                {' '} {group.segment}
                            </InfoGroupInfo>
                        </InfoGroupLabel>

                        <InfoGroupLabel>
                            TIPO DE GRUPO:
                            <InfoGroupInfo>
                                {' '} {group.type}
                            </InfoGroupInfo>
                        </InfoGroupLabel>

                        <InfoGroupLabel>
                            ENDEREÇO:
                            <InfoGroupInfo>
                                {' '} {group.address}
                            </InfoGroupInfo>
                        </InfoGroupLabel>


                        {/*<InfoGroupLabel>*/}
                        {/*    EMAIL:*/}
                        {/*    <InfoGroupInfo>*/}
                        {/*        {' '} {group.email}*/}
                        {/*    </InfoGroupInfo>*/}
                        {/*</InfoGroupLabel>*/}

                    </InfoGroupBox>

                </Container>

            </KeyboardAwareScrollView>
        </>
    );
}

export default InfoGroup;
