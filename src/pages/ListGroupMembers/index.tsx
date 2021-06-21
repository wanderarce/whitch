import React, {useEffect, useState} from "react";
import {Alert, FlatList, Image, Modal, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import {Container, Label, styles} from "./styles";

import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";
import {Title} from "../SignUp/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {deleteMemberFromGroup, getMemberByGroupIds, loadMainProfile, mainColor} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import {Hr} from "../../components/Hr/styles";
import Button from "../../components/Button";
import userImg from "../../assets/menu/MEU-PERFIL.png";
import Loading from "../../components/Loading";
const window = Dimensions.get('window');


const ListGroupMembers: React.FC = () => {

    const navigation = useNavigation();
    const [members, setMembers] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [group, setGroup] = useState({});
    const [profile, setProfile] = useState({});
    const [canSeeOptionGroup, setCanSeeOptionGroup] = useState(false);
    const [modalMember, setModalMember] = useState();
    const [loading, setLoading] = useState(false);

    const hideModal = async () => {
        await setModalMember({});
        setVisibleModal(false)
    };

    const showModal = async (member) => {
        await setModalMember(member);
        setVisibleModal(true)
    };

    const remove = async (memberId) => {

        const result = await deleteMemberFromGroup(group.id, memberId);

        if (!result) {
            Alert.alert('Ops!', 'Não foi possível remover o participante do grupo');
            return;
        }

        await loadMembers(group.id);
        hideModal();
    }

    const loadMembers = async (gp) => {

        const id = gp !== undefined
            ? gp.id
            : await group.id;

        const members = await getMemberByGroupIds(id);

        setMembers(members);

    }

    const showMemberProfile = async (id: number) => {
        await AsyncStorage.setItem('showUserProfile', id.toString());
        return navigation.navigate('Profile');
    }

    const start = async () => {
      setLoading(true);
      const groupString = await AsyncStorage.getItem('groupMembers');
      const gp = JSON.parse(groupString);
      const groupId = gp.id
      await setGroup(gp);

      const canSeeOptions = profile.isAdmin || gp.user_id == profile.id;
      await setCanSeeOptionGroup(canSeeOptions);
      setLoading(false);
      if (!groupId) {
        return navigation.goBack();
      }
      return await loadMembers(gp);
    };

    const loadProfile = async () => {
        const profile = await loadMainProfile();
        await setProfile(profile);
    }

    useEffect(function () {
        loadProfile().then(start)
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
                        <Title>Opções do Participante</Title>
                    </View>

                    <Hr/>
                    <View style={{
                        alignItems: "center",
                        width: "80%",
                        marginLeft: "10%",
                        marginTop: 20,
                        marginBottom: 80
                    }}>

                        <Button style={{
                            display: canSeeOptionGroup === true ? "flex" : "none"
                        }}>
                            <Text
                                style={styles.btnText}
                                onPress={() => {
                                    remove(modalMember.id)
                                }}
                            >Remover
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
            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container>
                    <Title>PARTICIPANTES</Title>

                    <FlatList data={members} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) =>

                                  <View style={{
                                      backgroundColor: mainColor,
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10
                                  }}>
                                      <View style={{
                                          flexDirection: 'row'
                                      }}>
                                          <View style={{width: window.width * 0.5}}>
                                              <Label style={{fontWeight: "bold"}}>
                                                  {item.name}
                                              </Label>
                                          </View>
                                          <View style={{
                                              width: window.width * (profile.isAdmin || group.user_id == profile.id ? 0.2 : 0.3),
                                              marginLeft: 10
                                          }}>
                                              <Label style={{
                                                  fontWeight: 'bold',
                                                  backgroundColor: '#333',
                                                  padding: 3,
                                                  fontSize: 10,
                                                  textAlign: "center"
                                              }}
                                                     onPress={() => {
                                                         showMemberProfile(item.id)
                                                     }}
                                              >Ver Perfil</Label>
                                          </View>
                                          <View style={{
                                              width: window.width * 0.10,
                                              alignItems: "center",
                                              display: profile.isAdmin || group.user_id == profile.id ? 'flex' : "none",
                                              marginLeft: 10
                                          }}
                                                onTouchEnd={() => showModal(item)}
                                          >
                                              <Icon name="more-vertical"
                                                    style={{
                                                        fontSize: 18,
                                                        color: "white",
                                                    }}
                                              />
                                          </View>

                                      </View>
                                  </View>
                              }/>


                </Container>
                <Footer/>
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
                          onTouchEnd={() => navigation.navigate('CreateGroupMember')}
                    >
                        <View>
                            <Image source={userImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    ADICIONAR USUÁRIO
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('CreateSimpleUserByList')}
                    >
                        <View>
                            <Image source={userImg}
                                   style={{width: "100%", height: "110%", resizeMode: "contain"}}/>
                        </View>
                        <View>
                            <View>
                                <Label style={{
                                    fontSize: 10,
                                    color: "black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    paddingTop: 8,
                                    fontSize: 10,
                                }}
                                >
                                    CADASTRAR LISTA
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>

        </>
    );
}

export default ListGroupMembers;
