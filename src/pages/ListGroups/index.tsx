import React, {useEffect, useRef, useState} from "react";
import {Alert, FlatList, Image, Modal, Share, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, ItemGroup, ItemGroupButton, ItemGroupButtons, ItemGroupName, ItemGroupTitleButtons} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {Form} from "@unform/mobile";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {FormHandles} from "@unform/core";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import {
    getGroupByTermAndCityIdAndSegment,
    getMessageByAxiosError, getSegments,
    headerAuthorizationOrAlert, if401ThenLogout,
    mainColor,
    myProfile
} from "../../utils/Util";
import SearchInput from "../../components/SearchInput";
import {Label} from "../ListMyAds/styles";
import groupsImg from "../../assets/menu/GRUPOS.png";
import createGroupImg from "../../assets/menu/CRIE-SEU-GRUPO.png";
import FilterCities from "../../components/FilterCities";
import Loading from "../../components/Loading";

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#2AC062',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    closeButton: {
        display: 'flex',
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3974',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    image: {
        marginTop: 150,
        marginBottom: 10,
        width: '100%',
        height: 350,
    },
    text: {
        fontSize: 24,
        marginBottom: 30,
        padding: 40,
    },
    closeText: {
        fontSize: 24,
        color: '#00479e',
        textAlign: 'center',
    },

    btnText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    }
});


const ListGroups: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const [isVisibleModal, setVisibleModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [groupModal, setGroupModal] = useState({});
    const [profile, setProfile] = useState({});
    const [termSearch, setTermSearch] = useState('');
    const [cityIdSelect, setCityIdSelected] = useState(undefined);
    const [profileGroups, setProfileGroups] = useState([]);
    const [segments, setSegments] = useState([]);
    const [orderSelected, setOrderSelected] = useState(undefined);
    const [segmentSelected, setSegmentSelected] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const orders = [
        {name: 'N/A', value: undefined},
        {name: 'Data', value: 'date'},
    ];

    const loadSegments = async () => {
        let segments = await getSegments();
        segments.unshift({
            name: 'TODOS',
            value: undefined
        });
        await setSegments(segments);
    }

    const makeSearch = async () => {

        const term = termSearch;

        if (term.length < 3) {
            return;
        }

        setTermSearch('');

        const groupsByTerms = await getGroupByTermAndCityIdAndSegment(term, cityIdSelect, segmentSelected, orderSelected);

        setGroups(groupsByTerms);

    };

    const showMembers = async (group) => {
        await AsyncStorage.setItem('groupMembers', JSON.stringify(group))
        hideModal();
        return navigation.navigate('ListGroupMembers');
    }

    const showGroupAds = (id: number) => {
        AsyncStorage.setItem('adsByGroup.current.group.id', id.toString())
        return navigation.navigate('AdsByGroup');
    };

    const loadProfile = async () => {
        const profile = await myProfile();
        setProfile(profile);
        setProfileGroups(profile.groups);
    };

    const showModal = (group) => {
        console.log(group);
        setGroupModal(group);
        setVisibleModal(true)
    };

    const hideModal = () => {
        setVisibleModal(false)
    };

    const getUser = async () => {
        const userJson = await AsyncStorage.getItem('authUser');
        return JSON.parse(userJson);
    }

    const subscribe = async (groupId: bigint) => {

        const configs = await headerAuthorizationOrAlert();

        if (configs === null) {
            Alert.alert('Ocorreu um erro', 'Não foi possível identificar seu usuário!');
            return;
        }

        const url = `/groups/${groupId}/subscription`;

        api.post(url, [], configs).then((response) => {
            loadProfile();
            loadGroups();
            Alert.alert('Sucesso!', 'Agora você é um membro do grupo!');
        }).catch((error) => {
            Alert.alert('Ocorreu um erro', getMessageByAxiosError(error, 'Não foi possível se tornar membro do grupo'));
        });

    }

    const unsubscribe = async (groupId: bigint) => {

        const configs = await headerAuthorizationOrAlert();

        if (configs === null) {
            Alert.alert('Ocorreu um erro', 'Não foi possível identificar seu usuário!');
            return;
        }

        const url = `/groups/${groupId}/subscription`;

        api.delete(url, configs).then((response) => {
            loadProfile();
            loadGroups();
            Alert.alert('Sucesso!', 'Agora você não é mais um membro do grupo!');
        }).catch((error) => {
            Alert.alert('Ocorreu um erro', getMessageByAxiosError(error, 'Não foi possível sair do grupo'));
        });

    }

    const disable = async (groupId: bigint) => {
        const configs = await headerAuthorizationOrAlert();

        if (configs === null) {
            Alert.alert('Ocorreu um erro', 'Não foi possível identificar seu usuário!');
            return;
        }

        const url = `/admin/groups/${groupId}/block`;

        api.put(url, [], configs).then((response) => {
            Alert.alert('Sucesso!', 'Grupo desativado com sucesso!');
            redirectToGroups();
        }).catch((error) => {
            Alert.alert('Ocorreu um erro', getMessageByAxiosError(error));
        });
    }

    const redirectToGroups = () => {
        loadGroups();
        navigation.navigate('ListGroups');
        hideModal();
    };

    const enable = async (groupId: bigint) => {

        const configs = await headerAuthorizationOrAlert();

        if (configs === null) {
            Alert.alert('Ocorreu um erro', 'Não foi possível identificar seu usuário!');
            return;
        }

        const url = `/admin/groups/${groupId}/approve`;

        api.get(url, configs).then((response) => {
            Alert.alert('Sucesso!', 'Grupo aprovado com sucesso!');
            redirectToGroups();
        }).catch((error) => {
            Alert.alert('Ocorreu um erro', getMessageByAxiosError(error));
        });
    }

    const loadGroups = async () => {
        setLoading(true);
        const user = await getUser();
        const config = {
            headers: {Authorization: `Bearer ${user.access_token}`}
        };

        api.get('/groups', config).then((response) => {
            setGroups(response.data.data);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            if (if401ThenLogout(error)) {
                return navigation.navigate('Login');
            }

            console.log(error);
        });
    };


    const loadGroupInfo = async (id: number) => {
        await AsyncStorage.setItem('currentGroupView', String(id));
        navigation.navigate('InfoGroup');
    }

    const shared = (item) => {
        Share.share({
            message: `Participe do grupo de ${item.name} no app Which Is`,
        });
    }

    useEffect(function () {
        loadGroups();
        loadProfile();
        loadSegments();
    }, [])

    return (
        <>

            <Loading visible={loading}  dismiss={!loading}/>
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={isVisibleModal}
                    onRequestClose={() => {
                        Alert.alert('Modal has now been closed.');
                    }}>

                    <View style={{alignItems: "center"}}>
                        <Title>Opções do grupo</Title>
                    </View>

                    <Hr/>
                    <View style={{
                        alignItems: "center",
                        width: "80%",
                        marginLeft: "10%",
                        marginTop: 20,
                        marginBottom: 80
                    }}>

                        <Button>
                            <Text
                                style={styles.btnText}
                                onPress={() => {
                                    showMembers(groupModal)
                                }}
                            >Participantes
                            </Text>
                        </Button>

                        <Button
                            style={{
                                display: groupModal.status === false && profile.isAdmin ? 'flex' : 'none'
                            }}
                        >
                            <Text
                                style={styles.btnText}
                                onPress={() => {
                                    enable(groupModal.id)
                                }}
                            >Ativar grupo
                            </Text>
                        </Button>

                        <Button style={{
                            display: groupModal.status === true && profile.isAdmin ? 'flex' : 'none'
                        }}
                        >
                            <Text
                                style={styles.btnText}
                                onPress={() => {
                                    disable(groupModal.id)
                                }}
                            >
                                Desativar grupo
                            </Text>

                        </Button>
                    </View>
                    <Text
                        style={styles.closeText}
                        onPress={() => {
                            hideModal()
                        }}
                    >Voltar
                    </Text>
                </Modal>

            </View>


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
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>

            <View style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
            }}>

                <View style={{
                    marginTop: -25
                }}>
                    <Title>GRUPOS</Title>
                </View>

                <Form
                    ref={formRef}
                    onSubmit={makeSearch}
                >
                    <SearchInput
                        autoCapitalize="words"
                        name="term"
                        rightIcon='search'
                        placeholder="Procurar por grupos"
                        returnKeyType="next"
                        value={termSearch}
                        onChangeText={(value) => {
                            setTermSearch(value)
                        }}
                        righticonCallable={() => {
                            formRef.current.submitForm()
                        }}
                    />
                </Form>

            </View>

            <Hr style={{borderColor: "#999"}}/>

            <View style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
            }}>

                <View style={{
                    marginTop: 10,
                }}>
                    <FilterCities
                        orders={orders}
                        segments={segments}
                        onCitySelected={(idSelected) => {
                            setCityIdSelected(idSelected);
                        }}
                        onOrderSelected={(idSelected) => {
                            setOrderSelected(idSelected);
                        }}
                        onSegmentSelected={(idSelected) => {
                            setSegmentSelected(idSelected);
                        }}
                    />

                </View>

            </View>

            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>

                    <FlatList data={groups} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) => <ItemGroup>
                                  <View style={{
                                      flexDirection: 'row',
                                      width: window.width * 0.83,
                                      alignItems: "center"
                                  }}>
                                      <ItemGroupName
                                          onPress={() => {
                                              loadGroupInfo(item.id.toString());
                                          }}

                                          style={{width: window.width * 0.66}}>{item.name}</ItemGroupName>
                                      <ItemGroupTitleButtons>
                                          <Text style={{
                                              width: window.width * 0.1,
                                              color: "#FFF",
                                              marginTop: -7,
                                              textAlign: "right"
                                          }}
                                                onPress={() => {
                                                    shared(item);
                                                }}
                                          >

                                              <Icon name="share-2"
                                                    style={{
                                                        fontSize: 22,
                                                        color: "white",
                                                    }}
                                              />

                                          </Text>
                                      </ItemGroupTitleButtons>
                                      <ItemGroupTitleButtons>
                                          <Text style={{
                                              width: window.width * 0.1,
                                              color: "#FFF",
                                              marginTop: -7,
                                              textAlign: "right"
                                          }}
                                                onPress={() => {
                                                    loadGroupInfo(item.id.toString());
                                                    showModal(item)
                                                }}
                                          >

                                              <Icon name="more-vertical"
                                                    style={{
                                                        fontSize: 28,
                                                        color: "white",
                                                    }}
                                              />

                                          </Text>
                                      </ItemGroupTitleButtons>
                                  </View>

                                  <Text style={{
                                      fontWeight: "bold",
                                      color: "white",
                                      marginTop: -10,
                                      marginBottom: 15,
                                  }}>Participantes: <Text>{item.qty_members}</Text></Text>


                                  <Hr style={{
                                      borderWidth: 1,
                                      borderColor: "#FFF",
                                      backgroundColor: "#FFF",
                                      width: "99%",
                                  }}/>
                                  <ItemGroupButtons
                                      style={{
                                          flexDirection: 'row',
                                      }}>
                                      <ItemGroupButton style={{
                                          padding: 5,
                                          marginRight: 10,
                                          marginTop: 10,
                                          height: 30,
                                          alignItems: "center",
                                          borderRadius: 5,
                                          width: window.width * 0.40
                                      }}>
                                          <Text
                                              onPress={() => showGroupAds(item.id)}
                                              style={{color: "#FFF"}}>ACESSAR</Text>
                                      </ItemGroupButton>
                                      <ItemGroupButton onTouchEnd={() => {

                                          profileGroups.indexOf(item.id) >= 0
                                              ? unsubscribe(item.id)
                                              : subscribe(item.id);

                                      }} style={{
                                          padding: 5,
                                          marginRight: 10,
                                          marginTop: 10,
                                          height: 30,
                                          alignItems: "center",
                                          borderRadius: 5,
                                          width: window.width * 0.40
                                      }}>
                                          <Text style={{color: "#FFF"}}

                                                onPress={() => {
                                                    console.log(1111);
                                                }}
                                          >

                                              {profile.groups.indexOf(item.id) >= 0 ? 'SAIR' : 'PARTICIPAR'}

                                          </Text>
                                      </ItemGroupButton>
                                  </ItemGroupButtons>
                              </ItemGroup>}
                    >

                    </FlatList>

                </Container>

            </KeyboardAwareScrollView>

            <View style={{
                backgroundColor: "white",
                paddingTop: 10,
                paddingBottom: 30,
                borderTopWidth: .5,
                borderColor: "#666",
            }}>

                <View style={{
                    flexDirection: 'row'
                }}>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreateGroup')}
                    >
                        <View>
                            <Image source={createGroupImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    CRIAR GRUPO
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('MyGroups')}
                    >
                        <View>
                            <Image source={groupsImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    MEUS GRUPOS
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>

        </>
    );
}

export default ListGroups;
