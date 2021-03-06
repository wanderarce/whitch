import {Alert, FlatList, Image, Linking, Share, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useRef, useState} from "react";
import {Label} from "../ListMyAds/styles";
import {Hr} from "../../components/Hr/styles";
import {
    addAdsComment,
    deslikeAds,
    getAdsByGroupId,
    getGroupById, likeAds,
    loadAdsCommentsById,
    loadMainProfile,
    mainColor,
    objectIsEmpty
} from "../../utils/Util";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-community/async-storage";
import commentHoverImg from "../../assets/adsIcones/commentAzul.png";
import commentImg from "../../assets/adsIcones/comment.png";
import {Text as TextTip, Tooltip} from "react-native-elements";
import voucherImg from "../../assets/adsIcones/voucher.png";
import cellphoneImg from "../../assets/adsIcones/cellphone.png";
import likedImg from "../../assets/adsIcones/likedAzul.png";
import likeImg from "../../assets/adsIcones/like.png";
import logoCircle from "../../assets/logo-circle.png";
import whatsappImg from "../../assets/adsIcones/whatsapp.png";
import iconePontos from "../../assets/adsIcones/iconepontos.png";

const window = Dimensions.get('window');


const AdsByGroup: React.FC = () => {
    const navigation = useNavigation();
    const commentRef = useRef<TextInput>(null);
    const [group, setGroup] = useState({});
    const [ads, setAds] = useState({});
    const [adsShowComments, setAdsShowComment] = useState([]);
    const [showVoucherImg, setShowVoucherImg] = useState(false);
    const [profile, setProfile] = useState({});
    const [commentsLocked, setCommentsLocked] = useState([]);

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

    const showProfile = async (advertiser) => {
        await AsyncStorage.setItem('showAdvertiser', JSON.stringify(advertiser));
        return navigation.navigate('ShowAdvertiserProfile');
    };

    const addCommentLock = (id) => {
        setCommentsLocked([...commentsLocked, id])
        //console.log(commentsLocked);
    }

    const removeCommentLock = async (id) => {
        const newCommentLock = commentsLocked.filter((item) => id !== item);
        setCommentsLocked(newCommentLock);
    }

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

    const showAdLikes = async (ads) => {
        await AsyncStorage.setItem('adsLikes', JSON.stringify(ads));
        return navigation.navigate('AdLikes');
    }

    const sharedAds = (item) => {
        Share.share({
            message: `Veja o an??ncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`,
        });
    }

    const registerLike = async (item) => {

        const result = await likeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'N??o conseguimos salvar seu like.')
            return item;
        }

        return item;
    };

    const removeLike = async (item) => {

        const result = await deslikeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'N??o conseguimos remover seu like')
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

    const hiddenAdsComment = (id) => {
        const ids = adsShowComments.filter((item) => item !== id);
        setAdsShowComment(ids);
    };

    const showAdsComment = async (id) => {
        setAdsShowComment([...adsShowComments, id]);
        await loadAdsComment(id);
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

    const toggleAdsComment = async (id) => {
        const items = await adsShowComments;
        return items.includes(id)
            ? hiddenAdsComment(id)
            : showAdsComment(id);
    };

    const loadGroupInfo = async () => {
        const groupId = await AsyncStorage.getItem('adsByGroup.current.group.id');
        const group = await getGroupById(parseInt(groupId));

        if (group === null) {
            Alert.alert('Ocorreu um erro!', 'N??o conseguimos buscar informa????es do grupo.')
            return null;
        }

        setGroup(group);

        return groupId;
    };

    const loadAds = async () => {

        let groupId = null;

        groupId = objectIsEmpty(group) !== true ? group.id : null;

        if (groupId === null) {
            groupId = await loadGroupInfo();
        }

        if (groupId == null) {
            Alert.alert('Ops, erro!', 'N??o conseguimos encontrar dados grupo.')
            return;
        }

        const ads = await getAdsByGroupId(groupId);

        if (ads === null) {
            Alert.alert('Ops, erro!', 'N??o conseguimos buscar os an??ncios do grupo.')
            return;
        }

        setAds(ads);
    };

    const loadProfile = async () => {
        const loadedProfile = await loadMainProfile(true);
        setProfile(loadedProfile);
    }

    useEffect(function () {
        loadAds();
        loadProfile();
        //console.log(ads);
    }, []);


    return (
        <>


            <View style={{
                flexDirection: 'row',
                backgroundColor: "white",
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


                <Container style={{backgroundColor: "white", marginTop: -20}}>

                    <View>
                        <Title>{group.name || 'carregando...'}</Title>
                    </View>


                    <View style={{
                        flexDirection: 'row',
                        marginTop: -20
                    }}>
                        <Label style={{
                            width: window.width * 0.30,
                            color: '#333',
                            fontSize: 10,
                            fontWeight: '800'
                        }}>
                            Participantes: <Label style={{color: '#333', fontSize: 10,}}>{group.qty_members}</Label>
                        </Label>

                        <Label style={{
                            width: window.width * 0.6,
                            color: '#333',
                            fontSize: 10,
                            fontWeight: '800'
                        }}>
                            Administrador do grupo: <Label
                            style={{color: '#333', fontSize: 10,}}>{group.responsible_name}</Label>
                        </Label>
                    </View>

                </Container>

                <Hr style={{marginTop: 10, borderColor: 'gray'}}></Hr>

                <Container style={{backgroundColor: "white", marginTop: 20}}>



                    <FlatList data={ads} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) => {
                                  return (
                                      <>
                                          <View style={{
                                              backgroundColor: mainColor,
                                              borderRadius: 10,
                                              marginBottom: 10
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

                                                          <Tooltip
                                                              onOpen={() => {
                                                                  setShowVoucherImg(true)
                                                              }}
                                                              onClose={() => {
                                                                  setShowVoucherImg(false)
                                                              }}
                                                              backgroundColor={mainColor}
                                                              popover={<TextTip>{item.voucher}</TextTip>}>

                                                              <View style={{
                                                                  width: window.width * 0.14,
                                                                  height: 40,

                                                              }}>
                                                                  <Image source={voucherImg}
                                                                         style={{
                                                                             width: "100%",
                                                                             height: "100%",
                                                                             resizeMode: "contain"
                                                                         }}/>
                                                              </View>
                                                          </Tooltip>

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
                                                                    const message = `Veja o an??ncio de ${item.advertiserInfo.trading_name}: ${item.title} - no app Which Is`;
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

                                                          <Tooltip
                                                              backgroundColor={mainColor}
                                                              popover={<TextTip>{item.point_coins}</TextTip>}>

                                                              <View style={{
                                                                  width: window.width * 0.14,
                                                                  height: 40,

                                                              }}>
                                                                  <Image source={iconePontos}
                                                                         style={{
                                                                             width: "100%",
                                                                             height: "100%",
                                                                             resizeMode: "contain"
                                                                         }}/>
                                                              </View>
                                                          </Tooltip>

                                                          <View style={{
                                                              width: window.width * 0.14,
                                                              height: 40,
                                                          }}
                                                                onTouchEnd={() => {
                                                                    toggleLike(item);
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


                                              {item.comments !== undefined && item.comments.map((itemComment) => (
                                                  <View style={{
                                                      flexDirection: 'row',
                                                      borderRadius: 3,
                                                      backgroundColor: 'white',
                                                      marginTop: 10,
                                                      padding: 5,
                                                  }}>

                                                      <View style={{
                                                          width: window.width * 0.1,
                                                      }}>
                                                          <View style={{width: 130}}>
                                                              <Image source={logoCircle}
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
                                              ))
                                              }

                                          </View>

                                      </>
                                  )
                              }
                              }/>

                </Container>
                <Footer/>
            </KeyboardAwareScrollView>
        </>
    );
}

export default AdsByGroup;
