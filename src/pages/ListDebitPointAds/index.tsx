import {Alert, FlatList, Image, Linking, Share, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title} from "./styles";
import {Dimensions} from 'react-native'
import logoImg from "../../assets/logo-dark-fonte.png";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import React, {useEffect, useState} from "react";
import {Label} from "../ListMyAds/styles";
import {Hr} from "../../components/Hr/styles";
import {
    mainColor, getPointAds, loadPointAdsCommentsById, addPointAdsComment
} from "../../utils/Util";
import Footer from "../../components/Footer";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import commentHoverImg from "../../assets/adsIcones/commentAzul.png";
import commentImg from "../../assets/adsIcones/comment.png";
import cellphoneImg from "../../assets/adsIcones/cellphone.png";
import moneyImg from "../../assets/adsIcones/money.png";
import moneyHoverImg from "../../assets/adsIcones/moneyHover.png";
import logoCircle from "../../assets/logo-circle.png";
import {Text as TextTip, Tooltip} from "react-native-elements";
import voucherImg from "../../assets/adsIcones/voucher.png";
import createFreeImg from "../../assets/menu/CLASSIFICADOS.png";
import groupImg from "../../assets/menu/GRUPOS.png";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from "../../components/Loading";

const window = Dimensions.get('window');

const ListSDebitPointAds: React.FC = () => {
    const navigation = useNavigation();
    const [freeAds, setFreeAds] = useState([]);
    const [showComments, setShowComments] = useState([]);
    const [commentsLocked, setCommentsLocked] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPointAds = async () => {
       setLoading(true);
        const freeAds = await getPointAds();

        setFreeAds(freeAds);
        setLoading(false);
    };

    const addCommentLock = (id) => {
        setCommentsLocked([...commentsLocked, id])
    }

    const removeCommentLock = async (id) => {
        const newCommentLock = commentsLocked.filter((item) => id !== item);
        setCommentsLocked(newCommentLock);
    }

    const showProfile = async (advertiser) => {
        await AsyncStorage.setItem('showAdvertiser', JSON.stringify(advertiser));
        return navigation.navigate('ShowAdvertiserProfile');
    };


    const loadAdsComment = async (id) => {

        const comments = await loadPointAdsCommentsById(id);

        const newAds = freeAds.map((item) => {

            item.comments = item.id === id
                ? comments
                : item.comments !== undefined
                    ? item.comments
                    : [];

            return item;
        });

        await setFreeAds(newAds);
    }

    const sendComment = async (adsId) => {

        if (commentsLocked.includes(adsId)) {
            return;
        }

        addCommentLock(adsId);

        const allAds = await freeAds;
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

        const result = await addPointAdsComment(adsId, comment);

        if (!result) {
            removeCommentLock(adsId);
            return false;
        }

        await loadAdsComment(adsId);
        removeCommentLock(adsId);
        return true;
    };

    const storeComments = async (adsId, comment) => {

        const allAds = await freeAds;

        const adsWithComment = allAds.map((ads) => {
            if (ads.id !== adsId) {
                return ads;
            }

            ads.currentComment = comment;

            return ads;
        })

        setFreeAds(adsWithComment);
    };


    const showCommentIds = (id) => {
        return setShowComments([...showComments, id]);
    }

    const hiddenCommentIds = (id) => {
        const currentShow = showComments.filter((item) => id != item);
        setShowComments(currentShow);
    }

    const toggleAdsComment = async (id) => {
        const items = await showComments;
        return items.includes(id)
            ? hiddenCommentIds(id)
            : showCommentIds(id);
    };

    useEffect(function () {
        loadPointAds();
    }, [])

    return (
        <>
        <Loading visible={loading}  dismiss={!loading}/>
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

                <Container style={{backgroundColor: "#FFF"}}>

                    <Title>RESGATAR PONTOS</Title>

                </Container>

                <Hr style={{marginBottom: 30, borderColor: '#bbb'}}></Hr>
                <Container>


                    <FlatList data={freeAds} keyExtractor={((item, index) => item.id.toString())}
                              renderItem={({item}) => {

                                  return (
                                      <>
                                          <View style={{
                                              backgroundColor: mainColor,
                                              borderRadius: 10,
                                              marginBottom: 10,
                                          }}>

                                              <View
                                                  style={{
                                                      flexDirection: 'row',
                                                      width: window.width * 0.83,
                                                      alignItems: "center",
                                                      marginLeft: 10,
                                                      marginTop: 10,
                                                  }}
                                              >

                                                  <View style={{
                                                      flexDirection: 'row',
                                                  }}>
                                                      <View style={{
                                                          width: window.width * 0.80,
                                                      }}>
                                                          <Label
                                                              onPress={() => {showProfile(item.advertiserInfo)}}
                                                              style={{
                                                              width: window.width * 0.55,
                                                              fontWeight: 'bold',
                                                          }}>{item.advertiserInfo?.trading_name}</Label>
                                                      </View>

                                                  </View>

                                              </View>

                                              <View
                                                  style={{alignItems: "center", paddingTop: 10}}>
                                                  <Image source={{uri: item.img}}
                                                         style={{
                                                             width: "100%",
                                                             height: 150,
                                                             resizeMode: "contain",
                                                             backgroundColor: 'white'
                                                         }}/>
                                              </View>

                                              <View style={{

                                                  position: "relative",
                                                  marginTop: -10,
                                                  alignItems: "center",
                                              }}>

                                                  <View style={{
                                                      flexDirection: 'row',
                                                  }}>


                                                      <View style={{
                                                          width: window.width * 0.16,
                                                          height: 40,
                                                      }}
                                                            onTouchStart={() => {
                                                                toggleAdsComment(item.id);
                                                            }}
                                                      >
                                                          <Image
                                                              source={showComments.includes(item.id) ? commentHoverImg : commentImg}
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
                                                          width: window.width * 0.16,
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


                                                      <Tooltip
                                                          backgroundColor={mainColor}
                                                          popover={<TextTip>Total de pontos: {item.qty_point}</TextTip>}>

                                                          <View style={{
                                                              width: window.width * 0.17,
                                                              height: 40,

                                                          }}>
                                                              <Image source={moneyImg}
                                                                     style={{
                                                                         width: "100%",
                                                                         height: "100%",
                                                                         resizeMode: "contain"
                                                                     }}/>
                                                          </View>
                                                      </Tooltip>

                                                  </View>
                                              </View>


                                              <Hr style={{marginTop: 10, borderColor: 'white'}}></Hr>


                                              <View
                                                  style={{
                                                      flexDirection: 'row',
                                                      width: window.width * 0.83,
                                                      alignItems: "center",
                                                      marginLeft: 10,
                                                      marginTop: 10,
                                                  }}
                                              >
                                                  <Label style={{
                                                      width: window.width * 0.65,
                                                      fontWeight: 'bold',
                                                  }}>{item.title}</Label>


                                                  <Label style={{
                                                      width: window.width * 0.20,
                                                      textAlign: "right",
                                                      fontWeight: 'bold',
                                                  }}>{item.amountBRL}</Label>

                                              </View>


                                              <View style={{padding: 10}}>
                                                  <Label>{item.description}</Label>
                                              </View>

                                              <View style={{
                                                  display: showComments.includes(item.id) ? "flex" : "none",
                                                  backgroundColor: "#e5e5e5",
                                                  marginTop: 10,
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
                                                          // ref={commentRef}
                                                          style={{
                                                              backgroundColor: "white",
                                                              borderRadius: 3,
                                                              width: window.width * 0.76,
                                                              padding: 2,
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
                                                  ))
                                                  }

                                              </View>

                                          </View>
                                      </>
                                  );
                              }
                              }
                    />

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

                <View style={{alignItems: 'center'}}>
                    <View style={{
                        width: window.width * 0.4,
                        height: 40,
                    }}
                          onTouchEnd={() => navigation.navigate('MyPoints')}
                    >
                        <View>
                            <Image source={moneyHoverImg}
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
                                    MEUS PONTOS
                                </Label>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </>
    );
}

export default ListSDebitPointAds;
