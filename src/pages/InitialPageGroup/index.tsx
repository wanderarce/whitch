import {Modal, Alert, Dimensions, FlatList, Image, Linking, Share, TextInput, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container} from "./styles";
import logoImg from "../../assets/logo-dark-fonte.png";
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useRef, useState} from "react";
import ModalCustom from "../../components/ModalCustom/index";
import {Label} from "../ListMyAds/styles";
import {Hr} from "../../components/Hr/styles";
import {
    addAdsComment,
    deslikeAds,
    getAdsByGroup,
    getAdsByGroupAndTerm,
    likeAds,
    loadAdsCommentsById,
    loadMainProfile,
    mainColor,
    myProfile
} from "../../utils/Util";
import Footer from "../../components/Footer";
import likeImg from "../../assets/adsIcones/like.png";
import likedImg from "../../assets/adsIcones/likedAzul.png";
import commentImg from "../../assets/adsIcones/comment.png";
import commentHoverImg from "../../assets/adsIcones/commentAzul.png";
import voucherImg from "../../assets/adsIcones/voucher.png";
import cellphoneImg from "../../assets/adsIcones/cellphone.png";
import iconePontos from "../../assets/adsIcones/iconepontos.png";
import logoCircle from "../../assets/logo-circle.png";
import AsyncStorage from "@react-native-community/async-storage";
import {Form} from "@unform/mobile";
import {FormHandles} from "@unform/core";
import SearchInput from "../../components/SearchInput";
import groupImg from "../../assets/menu/GRUPOS.png";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import pointAdsImg from "../../assets/menu/VALE-PONTOS.png";
import whatsappImg from "../../assets/adsIcones/whatsapp.png";
import {Tooltip, Text as TextTip} from "react-native-elements";
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { sub } from 'react-native-reanimated';

const window = Dimensions.get('window');


const InitialPageGroup: React.FC = () => {



    const navigation = useNavigation();
    const commentRef = useRef<TextInput>(null);
    const searchRef = useRef<TextInput>(null);
    const formRef = useRef<FormHandles>(null);

    const [ads, setAds] = useState([]);
    const [profile, setProfile] = useState({});

    const [adsShowComments, setAdsShowComment] = useState([]);
    const [commentsLocked, setCommentsLocked] = useState([]);

    const [termSearch, setTermSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const [voucher, setVoucher] = useState("");

    const [size, setSize] = useState(0);
    const [ofsset, setOffset] = useState(4);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [subList, setSublist] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const renderViewMore = (comments) => {
        let next  = comments.length - size;
        return (<View onTouchEnd={()=>{ setOffset((next < 4) ? ofsset + next : ofsset + 4 );
        renderComment(comments);}}>
          <Text>Carregar mais</Text>
        </View>);

    }
    const renderComment = (comments) => {

      if(comments.length >= ofsset){
       setShowMore(true);
      }else{
        setShowMore(false);
      }
      return comments.slice(0,ofsset).map((itemComment, index) => (
          <View style={{
            flexDirection: 'row',
            borderRadius: 3,
            backgroundColor: 'white',
            marginTop: 10,
            padding: 5,
            }} key={index}>
            <View style={{
              width: window.width * 0.1,
            }}>
              <View
                onTouchEnd={() => {
                    showMemberProfile(itemComment.user_id)
                }}

                style={{width: 130}}>
                <Image
                    source={itemComment.userInfo.profile_img_url ? {uri: itemComment.userInfo.profile_img_url} : logoCircle}
                    style={{
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                    }}/>
              </View>
            </View>
            <View style={{
              width: window.width * 0.72,
            }}>
              <Label
                style={{color: "black", textAlign: "justify"}}>
                {itemComment.comment}
              </Label>
          </View>

          </View>
          ));

          //this.setState();
        //retur item;
    }
    const addCommentLock = (id) => {
        setCommentsLocked([...commentsLocked, id])
        console.log(commentsLocked);
    }

    const removeCommentLock = async (id) => {
        const newCommentLock = commentsLocked.filter((item) => id !== item);
        setCommentsLocked(newCommentLock);
    }

    const showMemberProfile = async (id: number) => {
        await AsyncStorage.setItem('showUserProfile', id.toString());
        return navigation.navigate('Profile');
    }

    const showProfile = async (advertiser) => {
        await AsyncStorage.setItem('showAdvertiser', JSON.stringify(advertiser));
        return navigation.navigate('ShowAdvertiserProfile');
    };

    const loadAdsComment = async (id) => {

        const comments = await loadAdsCommentsById(id);

        const newAds = ads.map((item) => {

            item.comments = item.id === id
                ? comments
                : item.comments !== undefined
                    ? item.comments
                    : [];

            return item;
        });

        await setAds(newAds);
    }

    const showAdsComment = async (id) => {
        setAdsShowComment([...adsShowComments, id]);
        await loadAdsComment(id);
    };

    const hiddenAdsComment = (id) => {
        const ids = adsShowComments.filter((item) => item !== id);
        setAdsShowComment(ids);
    };

    const toggleAdsComment = async (id) => {
        const items = await adsShowComments;
        return items.includes(id)
            ? hiddenAdsComment(id)
            : showAdsComment(id);
    };

    const sendComment = async (adsId) => {

        if (commentsLocked.includes(adsId)) {
            return;
        }

        addCommentLock(adsId);

        const allAds = await ads;
        const currentAds = allAds.find((item) => item.id === adsId);

        if (!currentAds) {
            Alert.alert('Ops', 'Ocorreu um erro, tente novamente!');
            removeCommentLock(adsId);
            return false;
        }

        if (currentAds.currentComment === undefined || currentAds.currentComment.length < 3) {
            removeCommentLock(adsId);
            return false;
        }

        const comment = currentAds.currentComment;

        await storeComments(adsId, '');

        const result = await addAdsComment(adsId, comment);

        if (!result) {
            removeCommentLock(adsId);
            return false;
        }

        await loadAdsComment(adsId);
        removeCommentLock(adsId);
        return true;
    };

    const storeComments = async (adsId, comment) => {

        const allAds = await ads;

        const adsWithComment = allAds.map((ads) => {
            if (ads.id !== adsId) {
                return ads;
            }

            ads.currentComment = comment;

            return ads;
        })

        setAds(adsWithComment);
    };

    const registerLike = async (item) => {

        const result = await likeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'Não conseguimos salvar seu like.')
            return item;
        }

        return item;
    };

    const removeLike = async (item) => {

        const result = await deslikeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'Não conseguimos remover seu like')
            return item;
        }

        return item;
    }

    const toggleLike = async (item) => {


        const isLike = profile.liked_ads.includes(item.id) === false;

        const result = isLike
            ? await registerLike(item)
            : await removeLike(item);

        if (!result) {
            return false;
        }

        profile.liked_ads = isLike
            ? [...profile.liked_ads, item.id]
            : profile.liked_ads.filter((likedAds) => likedAds !== item.id);


        const newAds = ads.map((adsItem) => {

            if (adsItem.id !== item.id) {
                return adsItem;
            }

            adsItem.qty_like = isLike
                ? ++adsItem.qty_like
                : --adsItem.qty_like;

            return adsItem;
        });

        await setAds(newAds);
    }

    const loadAds = async () => {

      setLoading(true);

        const profile = await myProfile();

        if (!profile) {
            navigation.navigate('Login');
            return;
        }

        const groupIds = profile.groups ?? [];
        const adsByGroup = groupIds.length > 0
            ? await getAdsByGroup(groupIds)
            : [];

        if (adsByGroup.length < 1) {
            navigation.navigate('InitialPageFreeAds');
        }

        setAds(adsByGroup);
        setLoading(false);

    };

    const loadProfile = async () => {
        const loadedProfile = await loadMainProfile(true);
        setProfile(loadedProfile);
    }

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o anúncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`,
        });
    }

    const showAdLikes = async (ads) => {
        await AsyncStorage.setItem('adsLikes', JSON.stringify(ads));
        return navigation.navigate('AdLikes');
    }


    const makeSearch = async () => {
        //setLoading(true);
        const term = termSearch;

        if (term.length < 3) {
            return;
        }

        setTermSearch('');

        const profile = await myProfile();

        if (!profile) {
            navigation.navigate('Login');
            return;
        }

        const groupIds = profile.groups ?? [];

        const adsByGroup = groupIds.length > 0
            ? await getAdsByGroupAndTerm(groupIds, term)
            : [];

        setAds(adsByGroup);
        //setLoading(false);
    };

    useEffect(function () {

      setAdsShowComment([]);
        loadAds();
        loadProfile();

    }, []);


    return (
        <>
            <Loading visible={loading}  dismiss={!loading}/>
            <View style={{
                flexDirection: 'row',
                backgroundColor: "white"
            }}>
                <View style={{padding: 15, width: window.width * 0.233}}>

                </View>
                <View>
                    <View style={{width: window.width * 0.533, height: window.height * 0.1, alignItems: "center"}}>
                        <Image source={logoImg} style={{width: "70%", height: "70%", resizeMode: "contain"}}/>
                    </View>
                </View>

                <View style={{padding: 15, width: window.width * 0.233,

                  alignItems: "flex-end"}}>
                    <Icon name="align-justify"
                          size={30}
                          color={mainColor}
                          onPress={() => navigation.navigate('MainMenu')
                        }
                    />
                </View>

            </View>

            <View style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
            }}>


                <Form
                    ref={formRef}
                    onSubmit={makeSearch}
                >
                    <SearchInput
                        ref={searchRef}
                        autoCapitalize="words"
                        name="term"
                        rightIcon='search'
                        placeholder="Procurar por anúncios"
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

            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>

                <Container style={{backgroundColor: "#FFF"}}>

                    <FlatList data={ads}
                    keyExtractor={((item, index) => item.id.toString())}
                              renderItem={
                                ({item}) => {

                                  return (
                                      <>
                                          <View style={{
                                              backgroundColor: mainColor,
                                              paddingBottom: 5,
                                              borderRadius: 4,
                                              marginTop: 10,
                                          }}>

                                              <View style={{
                                                  flexDirection: 'row',
                                              }}>
                                                  <View style={{
                                                      width: window.width * 0.80,
                                                  }}>

                                                      <Label
                                                          onPress={() => {showProfile(item.advertiserInfo)}}
                                                          style={{
                                                          padding: 10, paddingHorizontal: 10, textTransform: "uppercase"
                                                      }}>{item.advertiserInfo.trading_name}</Label>

                                                  </View>

                                                  <View style={{
                                                      paddingVertical: 10,
                                                      paddingRight: 10,
                                                      width: window.width * 0.10,
                                                      alignItems: "flex-end"
                                                  }}>
                                                      <Icon name="share-2"
                                                            size={21}
                                                            color="white"
                                                            onPress={() => sharedAds(item)}
                                                      />
                                                  </View>
                                              </View>

                                              <View
                                                  style={{alignItems: "center", paddingTop: 10}}>
                                                  <Image source={{uri: item.img}}
                                                         style={{
                                                             position: "absolute",
                                                             width: "100%",
                                                             height: 180,
                                                             resizeMode: "contain",
                                                             backgroundColor: 'white'
                                                         }}/>

                                                  <View style={{

                                                      position: "relative",
                                                      marginTop: 160
                                                  }}>

                                                      <View style={{
                                                          flexDirection: 'row',
                                                      }}>
                                                          <View style={{
                                                              width: window.width * 0.14,
                                                              height: 40,
                                                          }}
                                                                onTouchStart={() => {
                                                                    toggleAdsComment(item.id);
                                                                }}
                                                          >
                                                              <Image
                                                                  source={adsShowComments.includes(item.id) ? commentHoverImg : commentImg}
                                                                  style={{
                                                                      width: "100%",
                                                                      height: "100%",
                                                                      resizeMode: "contain"
                                                                  }}/>

                                                              <Label
                                                                  style={{
                                                                      backgroundColor: mainColor,
                                                                      position: "relative",
                                                                       marginTop: -53,
                                                                      marginLeft: 15,
                                                                      width: window.width * 0.09,
                                                                      textAlign: "center",
                                                                      display: item.comments?.length ?? 0 > 0 ? "flex" : "none",
                                                                  }}
                                                              >
                                                                  {item.comments?.length ?? 0}
                                                              </Label>
                                                          </View>


                                                              <View style={{
                                                                  width: window.width * 0.14,
                                                                  height: 40,

                                                              }}
                                                              onTouchEnd={()=>{
                                                                setVisible(true);
                                                                setVoucher(`Apresente o voucher ${item.voucher}
                                                                e garanta essa promoção.`);
                                                              }}>
                                                                <View onTouchStart={()=>{setVisible(false);}}>
                                                                      <ModalCustom
                                                                        modalVisible={isVisible}
                                                                        value={voucher}
                                                                        children={<Button style={{position:'relative',
                                                                        bottom: 65,
                                                                        left:95,
                                                                        backgroundColor:"#000",
                                                                        height:25,
                                                                        width:25,
                                                                        borderRadius:20}}
                                                                        >X</Button>
                            }
                                                                        >
                                                                      </ModalCustom>

                                                                  </View>
                                                                  <Image source={voucherImg}
                                                                         style={{
                                                                             width: "100%",
                                                                             height: "100%",
                                                                             resizeMode: "contain"
                                                                         }}/>
                                                              </View>


                                                          <View style={{
                                                              width: window.width * 0.14,
                                                              height: 40,
                                                          }}
                                                                onTouchEnd={() => {
                                                                    Linking.openURL(`tel:${item.advertiserInfo.phone}`)
                                                                }}
                                                          >
                                                              <Image source={cellphoneImg}
                                                                     style={{
                                                                         width: "100%",
                                                                         height: "100%",
                                                                         resizeMode: "contain"
                                                                     }}/>
                                                          </View>

                                                          <View style={{
                                                              width: window.width * 0.14,
                                                              height: 40,
                                                          }}
                                                                onTouchEnd={() => {
                                                                    const message = `Veja o anúncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`;
                                                                    Linking.openURL(`http://wa.me/+55${item.advertiserInfo.phone}?text=${message}`)
                                                                }}
                                                          >
                                                              <Image source={whatsappImg}
                                                                     style={{
                                                                         width: "100%",
                                                                         height: "100%",
                                                                         resizeMode: "contain"
                                                                     }}/>
                                                          </View>


                                                          <View style={{
                                                                  width: window.width * 0.14,
                                                                  height: 40,
                                                              }}
                                                              onTouchEnd={()=>{
                                                                setVisible(true);
                                                                setVoucher(`Ganhe  ${item.point_coins} pontos \ncom esta promoção.`);
                                                            }}
                                                          >
                                                        <View onTouchStart={()=>{setVisible(false);}}>
                                                          <ModalCustom
                                                            modalVisible={isVisible}
                                                            value={voucher}
                                                            children={<Button style={{position:'relative',
                                                            bottom: 65,
                                                            left:95,
                                                            backgroundColor:"#000",
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20}}
                                                            >X</Button>
                }
                                                            >
                                                          </ModalCustom>

                                                      </View>
                                                                  <Image source={iconePontos}
                                                                         style={{
                                                                             width: "100%",
                                                                             height: "100%",
                                                                             resizeMode: "contain"
                                                                         }}

                                                                    />
                                                              </View>



                                                          <View style={{
                                                              width: window.width * 0.14,
                                                              height: 40,
                                                          }}
                                                                onTouchEnd={() => {
                                                                    toggleLike(item);
                                                                    // loadAdsComment(item.id)
                                                                }}
                                                          >
                                                              <Image
                                                                  source={profile.liked_ads.includes(item.id) ? likedImg : likeImg}
                                                                  style={{
                                                                      width: "100%",
                                                                      height: "100%",
                                                                      resizeMode: "contain"
                                                                  }}/>
                                                              <Label
                                                                  style={{
                                                                      display: item.qty_like > 0 ? 'flex' : 'none',
                                                                      backgroundColor: mainColor,
                                                                      position: "relative",
                                                                       marginTop: -53,
                                                                  marginLeft: 15,
                                                                      width: window.width * 0.09,
                                                                      textAlign: "center"
                                                                  }}
                                                                  onPress={() => {
                                                                      showAdLikes(item)
                                                                  }}
                                                              >
                                                                  {item.qty_like}
                                                              </Label>
                                                          </View>

                                                      </View>
                                                  </View>
                                              </View>

                                              <Hr style={{marginTop: 10, borderColor: 'white'}}></Hr>
                                              <View style={{padding: 10}}>
                                                  <Label style={{fontWeight: 'bold'}}>{item.title}</Label>
                                                  <Label>{item.description}</Label>
                                              </View>
                                          </View>


                                          <View style={{
                                              display: adsShowComments.includes(item.id) ? "flex" : "none",
                                              backgroundColor: "#e5e5e5",
                                              marginTop: -10,
                                              padding: 10,
                                              borderBottomLeftRadius: 3,
                                              borderBottomRightRadius: 3,
                                          }}>
                                              <View style={{
                                                  flexDirection: 'row',
                                                  backgroundColor: "white",
                                                  borderRadius: 3,
                                              }}>

                                                  <TextInput
                                                      ref={commentRef}
                                                      style={{
                                                          backgroundColor: "white",
                                                          borderRadius: 3,
                                                          width: window.width * 0.76,
                                                          padding: 2,
                                                      }}
                                                      onSubmitEditing={() => {
                                                          commentRef.current?.focus();
                                                      }}
                                                      onChangeText={(value) => {
                                                          storeComments(item.id, value)
                                                      }}
                                                      value={item.currentComment}
                                                      keyboardAppearance="dark"
                                                      placeholderTextColor="#666360"
                                                  />
                                                  <View
                                                      style={{
                                                          marginTop: 1,
                                                          width: window.width * 0.08,
                                                          paddingVertical: 5,
                                                          height: 30,
                                                          alignItems: "center",
                                                      }}
                                                      onTouchStart={() => {
                                                          sendComment(item.id)
                                                      }}
                                                  >
                                                      <Icon
                                                          name="play"
                                                          size={20}
                                                          color="black"
                                                      />

                                                  </View>
                                              </View>


                                              {item != null && item.comments !== undefined
                                               && item.comments !== null
                                               && renderComment(item.comments)
                                              }
                                               <View style={{display: (showMore == true) ? 'flex' : 'none'}}  onTouchEnd={()=>{
                                                 setOffset(ofsset+4);
                                                 renderComment(item.comments);
                                                }}
                                                ><Text >Carregar mais</Text></View>

                                          </View>
                                          <Footer />
                                      </>
                                  )
                                      ;
                              }
                              }/>

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

                    <View style={{width: window.width * 0.333, height: 40}}
                          onTouchEnd={() => navigation.navigate('ListGroups')}
                    >
                        <View>
                            <Image source={groupImg}
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
                                    GRUPOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.333, height: 40}}
                          onTouchEnd={() => navigation.navigate('ListFreeAds')}
                    >
                        <View>
                            <Image source={freeAdsImg}
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
                                    CLASSIFICADOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.333, height: 40}}
                          onTouchEnd={() => navigation.navigate('ListDebitPointAds')}
                    >
                        <View>
                            <Image source={pointAdsImg}
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
                                    TROCAR PONTOS
                                </Label>
                            </View>
                        </View>
                    </View>

                </View>

            </View>


        </>
    );
}

export default InitialPageGroup;

const styles = StyleSheet.create({
  centeredView: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30%",
    backgroundColor: "#fafafa",
    width:200,
    height:200
  },
  modalView: {
    margin: 20,
    backgroundColor: mainColor,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F197FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    color:"white",
    marginBottom: 15,
    textAlign: "center"
  }
});
