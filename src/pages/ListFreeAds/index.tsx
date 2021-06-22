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
    addFreeAdsComment, deslikeFreeAds,
    getAllFreeAds, searchFreeAds, likeFreeAds,
    loadFreeAdsCommentsById, loadMainProfile,
    mainColor
} from "../../utils/Util";
import Footer from "../../components/Footer";
import {Form} from "@unform/mobile";
import freeAdsImg from "../../assets/menu/CLASSIFICADOS.png";
import commentHoverImg from "../../assets/adsIcones/commentAzul.png";
import commentImg from "../../assets/adsIcones/comment.png";
import whatsappImg from "../../assets/adsIcones/whatsapp.png";
import cellphoneImg from "../../assets/adsIcones/cellphone.png";
import likedImg from "../../assets/adsIcones/likedAzul.png";
import likeImg from "../../assets/adsIcones/like.png";
import logoCircle from "../../assets/logo-circle.png";
import SearchInput from "../../components/SearchInput";
import {FormHandles} from "@unform/core";
import FilterCities from "../../components/FilterCities";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from '../../components/Loading';

const window = Dimensions.get('window');

const ListFreeAds: React.FC = () => {
    const navigation = useNavigation();
    const [freeAds, setFreeAds] = useState([]);
    const [showComments, setShowComments] = useState([]);
    const [commentsLocked, setCommentsLocked] = useState([]);
    const [profile, setProfile] = useState({});
    const searchRef = useRef<TextInput>(null);
    const formRef = useRef<FormHandles>(null);
    const [termSearch, setTermSearch] = useState('');
    const [cityIdSelect, setCityIdSelected] = useState(undefined);
    const [orderSelected, setOrderSelected] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const orders = [
        {name: 'N/A', value: undefined},
        {name: 'Data', value: 'date'},
        {name: 'Preço crescente', value: 'price'},
        {name: 'Mais Legais', value: 'likes'},
    ];

    const registerLike = async (item) => {

        const result = await likeFreeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'Não conseguimos salvar seu legal.')
            return item;
        }

        return item;
    };

    const removeLike = async (item) => {

        const result = await deslikeFreeAds(item.id);

        if (result === false) {
            Alert.alert('Ops', 'Não conseguimos remover seu legal')
            return item;
        }

        return item;
    }

    const toggleLike = async (item) => {
        const isLike = profile.liked_free_ads.includes(item.id) === false;

        const result = isLike
            ? await registerLike(item)
            : await removeLike(item);

        if (!result) {
            return false;
        }

        profile.liked_free_ads = isLike
            ? [...profile.liked_free_ads, item.id]
            : profile.liked_free_ads.filter((likedAds) => likedAds !== item.id);

        const newAds = freeAds.map((adsItem) => {

            if (adsItem.id !== item.id) {
                return adsItem;
            }

            adsItem.qty_like = isLike
                ? ++adsItem.qty_like
                : --adsItem.qty_like;

            return adsItem;
        });

        await setFreeAds(newAds);
    }

    const loadProfile = async () => {
        const loadedProfile = await loadMainProfile(true);
        setProfile(loadedProfile);
    }

    const loadFreeAds = async () => {
        setLoading(true);
        const freeAds = await getAllFreeAds();
        const newAds = freeAds.map((ads) => loadInitialShowImage(ads));
        setFreeAds(newAds);
        setLoading(false);
    };

    const share = (item) => {
        Share.share({
            message: `Veja o classificado de ${item.name}: ${item.title} - no app Which Is`,
        });
    }

    const addCommentLock = (id) => {
        setCommentsLocked([...commentsLocked, id])
    }

    const removeCommentLock = async (id) => {
        const newCommentLock = commentsLocked.filter((item) => id !== item);
        setCommentsLocked(newCommentLock);
    }

    const loadAdsComment = async (id) => {

        const comments = await loadFreeAdsCommentsById(id);

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

        const result = await addFreeAdsComment(adsId, comment);

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
        console.log(currentShow);
        setShowComments(currentShow);
    }

    const toggleAdsComment = async (id) => {
        const items = await showComments;
        return items.includes(id)
            ? hiddenCommentIds(id)
            : showCommentIds(id);
    };

    const makeSearch = async () => {

        const term = termSearch;

        if (term.length < 3) {
            return;
        }

        setTermSearch('');

        const freeAds = await searchFreeAds(term, cityIdSelect, orderSelected);

        setFreeAds(freeAds);

    };


    const updateAdsList = (ads) => {

        console.log(ads.id);

        const newAds = freeAds.map((item) => {
            if (item.id === ads.id) {
                return ads;
            }
            return item;
        });


        setFreeAds(newAds);
    }

    const nextOfAds = (ads) => {
        ads.currentImageKey = ads.currentImageKey + 1 >= ads.imgs.length
            ? 0
            : ads.currentImageKey + 1;

        ads.currentImage = ads.imgs[ads.currentImageKey];

        updateAdsList(ads);
    }

    const previousOfAds = (ads) => {

        ads.currentImageKey = ads.currentImageKey - 1 >= 0
            ? ads.currentImageKey - 1
            : ads.imgs.length - 1;

        ads.currentImage = ads.imgs[ads.currentImageKey];

        updateAdsList(ads);
    }

    const showMemberProfile = async (id: number) => {
        await AsyncStorage.setItem('showUserProfile', id.toString());
        return navigation.navigate('Profile');
    }

    const loadInitialShowImage = (ads) => {
        ads.currentImage = ads.imgs.length > 0 ? ads.imgs[0] : undefined;
        ads.currentImageKey = ads.imgs.length > 0 ? 0 : undefined;
        return ads;
    }


    useEffect(function () {
        loadFreeAds();
        loadProfile();
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
                          onPress={() => navigation.navigate('MainMenu')}
                    />
                </View>

            </View>
            <View style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
                marginTop: -20,
            }}>

                <Title>CLASSIFICADOS</Title>

                <Form
                    ref={formRef}
                    onSubmit={makeSearch}
                >
                    <SearchInput
                        ref={searchRef}
                        autoCapitalize="words"
                        name="term"
                        rightIcon='search'
                        placeholder="Procurar por classificados"
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
                marginTop: -20,
            }}>

                <View style={{
                    marginVertical: 10,
                }}>
                    <FilterCities
                        orders={orders}
                        onCitySelected={(idSelected) => {
                            setCityIdSelected(idSelected);
                        }}
                        onOrderSelected={(idSelected) => {
                            setOrderSelected(idSelected);
                        }}
                    />

                </View>

            </View>

            <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#FFF"}}>
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
                                                      <View

                                                          onTouchEnd={() => {
                                                              showMemberProfile(item.user_id)
                                                          }}

                                                          style={{
                                                          width: window.width * 0.80,
                                                      }}>
                                                          <Label style={{
                                                              width: window.width * 0.55,
                                                              fontWeight: 'bold',
                                                          }}>{item.user}</Label>
                                                      </View>
                                                      <View style={{
                                                          alignItems: "flex-end"
                                                      }}>
                                                          <Icon name="share-2"
                                                                size={21}
                                                                color="white"
                                                                onPress={() => share(item)}
                                                          />
                                                      </View>
                                                  </View>

                                              </View>

                                              <View
                                                  style={{alignItems: "center", paddingTop: 10}}>
                                                  <Image source={{uri: item.currentImage}}
                                                         style={{
                                                             width: "100%",
                                                             height: 150,
                                                             resizeMode: "cover",
                                                             backgroundColor: 'white'
                                                         }}/>

                                                  <Icon name="chevron-left"
                                                        size={25}
                                                        color="gray"
                                                        style={{
                                                            fontWeight: 'bold',
                                                            textShadowColor: 'black',
                                                            textShadowRadius: 10,
                                                            color: '#333',
                                                            position: "absolute",
                                                            left: 10,
                                                            top: 65,
                                                        }}
                                                        onPress={() => {
                                                            previousOfAds(item)
                                                        }}
                                                  />

                                                  <Icon name="chevron-right"
                                                        size={25}
                                                        color="gray"
                                                        style={{
                                                            fontWeight: 'bold',
                                                            textShadowColor: 'black',
                                                            textShadowRadius: 10,
                                                            color: '#333',
                                                            position: "absolute",
                                                            right: 10,
                                                            top: 65,
                                                        }}
                                                        onPress={() => {
                                                            nextOfAds(item)
                                                        }}
                                                  />

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
                                                                Linking.openURL(`tel:${item.userInfo.cellphone}`)
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
                                                          width: window.width * 0.16,
                                                          height: 40,
                                                      }}
                                                            onTouchEnd={() => {
                                                                const message = `Veja o classificado de ${item.userInfo.name}: ${item.title} - no app Which Is`;
                                                                Linking.openURL(`http://wa.me/+55${item.userInfo.cellphone}?text=${message}`)
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
                                                          width: window.width * 0.16,
                                                          height: 40,
                                                      }}
                                                      >
                                                          <Image
                                                              source={profile.liked_free_ads?.includes(item.id) ? likedImg : likeImg}
                                                              style={{
                                                                  width: "100%",
                                                                  height: "100%",
                                                                  resizeMode: "contain"
                                                              }}
                                                              onTouchEnd={() => {
                                                                  toggleLike(item);
                                                              }}
                                                          />
                                                          <Label
                                                              style={{
                                                                  display: item.qty_like !== undefined && item.qty_like > 0 ? "flex" : "none",
                                                                  backgroundColor: mainColor,
                                                                  position: "relative",
                                                                  marginTop: -53,
                                                                  marginLeft: 15,
                                                                  width: window.width * 0.09,
                                                                  // borderWidth: 1,
                                                                  // borderColor: "#444",
                                                                  textAlign: "center"
                                                              }}
                                                          >
                                                              {item.qty_like}
                                                          </Label>
                                                      </View>

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
                                          <Footer />
                                      </>
                                  );
                              }
                              }
                    />

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
                          onTouchEnd={() => navigation.navigate('CreateFreeAds')}
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
                                    CRIAR CLASSIFICADOS
                                </Label>
                            </View>
                        </View>
                    </View>

                    <View style={{width: window.width * 0.5, height: 40}}
                          onTouchEnd={() => navigation.navigate('MyFreeAds')}
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
                                    MEUS CLASSIFICADOS
                                </Label>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </>
    );
}

export default ListFreeAds;
