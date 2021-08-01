import AsyncStorage from "@react-native-community/async-storage";
import {Alert} from "react-native";
import api from "../services/api";
import React from "react";

export const objectIsEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
};

export const isLogged = ({userLogged = undefined}: any) => {
    return undefined !== userLogged;
};

export const getUser = async () => {
    const userJson: string | null = await AsyncStorage.getItem('authUser');
    const user = userJson === null
        ? null
        : await JSON.parse(userJson);

    return user;
}

export const headerAuthorizationOrAlert = async () => {
    const user = await getUser();
    const accessToken =  user.access_token ?? null;
    if (accessToken === null || accessToken == undefined) {
        Alert.alert('Usuário não identificado!', 'Desculpe, É necessário realizar o login!');
        return null;
    }else{
      return {
        headers: {Authorization: `Bearer ${accessToken}`}
      };
    }
}

export const mainColor = '#2772ca'; // 195390

export const getAdvertiser = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    let result = await api.get(`advertisers/${id}`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return null;
        });

    return result;
}

export const resetMainProfile = async () => {
    await AsyncStorage.removeItem('mainProfile');
}


export const loadMainProfile = async (forceReload = false) => {

    console.log('call: loadMainProfile ', forceReload);

    let profile = await AsyncStorage.getItem('mainProfile');

    if (profile !== null) {
        profile = await JSON.parse(profile);
    }

    if (profile === null || forceReload) {
        profile = await myProfile();
        await AsyncStorage.setItem('mainProfile', JSON.stringify(profile));
    }

    return profile;
}

export const myProfile = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('profile', config)
        .then((response) => {
            const profile = response.data.data;

            profile.isAdmin = profile.isAdmin === undefined
                ? profile.roles.includes('admin') || profile.roles.includes('full')
                : false;

            profile.isAdvertiser = profile.isAdvertiser === undefined
                ? profile.roles.includes('advertiser')
                : false;

            profile.isActiveAdvertiser = profile.advertiser != undefined && profile.advertiser.status === true;

            return profile;
        })
        .catch((error) => {
            return null;
        });
};


export const loadUserProfile = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`users/${id}`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return null;
        });
};


export const loadFreeAdsByUserId = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`users/${id}/free-ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error, id, 34567876543);
            return null;
        });
};

export const getAdmins = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`admin/users/admin`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getUsers = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`users`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};


export const getAllAdvertisers = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('advertisers', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getFavoriteAdvertisers = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('me/favorite-advertiser', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getMyPoints = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return [];
    }

    return await api.get('me/points', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getAllActiveGroups = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    let result = await api.get('groups', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return null;
        });

    return result;
};

export const getAdsByAdvertiserId = async (id) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`advertisers/${id}/ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

export const getPointAdsByAdvertiserId = async (id) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`advertisers/${id}/point-ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

export const getAdsByGroup = async (groupIds) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null || groupIds.length < 1) {
        return [];
    }

    config.params = {groupIds: groupIds};

    return await api.get(`ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getAdsByGroupAndTerm = async (groupIds, term) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null || groupIds.length < 1) {
        return [];
    }

    config.params = {
        groupIds: groupIds,
        term: term
    };

    return await api.get(`ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}


export const getMyGroupByTermAndCityId = async (term = undefined, cityId = undefined, segmentId = undefined, orderBy = undefined) => {

    const config = await headerAuthorizationOrAlert();

    if (term !== undefined) {
        config.params = {
            term: term
        };
    }

    if (cityId !== undefined) {
        config.params.cityId = cityId;
    }

    if (orderBy !== undefined) {
        config.params.orderBy = orderBy;
    }

    if (segmentId !== undefined) {
        config.params.segmentId = segmentId;
    }


    return await api.get(`me/groups`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const getGroupByTermAndCityIdAndSegment = async (term, cityId = undefined, segmentId = undefined, orderBy = undefined) => {

    const config = await headerAuthorizationOrAlert();

    config.params = {
        term: term
    };

    if (cityId !== undefined) {
        config.params.cityId = cityId;
    }

    if (orderBy !== undefined) {
        config.params.orderBy = orderBy;
    }

    if (segmentId !== undefined) {
        config.params.segmentId = orderBy;
    }

    return await api.get(`groups`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}


export const searchFreeAds = async (term, cityId, orderBy) => {

    const config = await headerAuthorizationOrAlert();

    config.params = {
        term: term
    };

    if (cityId !== undefined) {
        config.params.cityId = cityId;
    }

    if (orderBy !== undefined) {
        config.params.orderBy = orderBy;
    }

    return await api.get(`free-ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error.response);
            return [];
        });
}

export const getAllFreeAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('free-ads', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getMyAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('me/ads', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getSponsoredAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('sponsored-ads', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
};

export const getSegments = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('segments', config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getMyFreeAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('me/free-ads', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getPointAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get('point-ads', config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
};


export const getPointAdsById = async (id: string) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`point-ads/${id}`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return null;
        });
};

export const getGroupById = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`groups/${id}`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log('Erro ao buscar grupo', error);
            return null;
        });
};

export const getMemberByGroupIds = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return [];
    }

    return await api.get(`groups/${id}/members`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const deleteMemberFromGroup = async (groupId: number, memberId: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`groups/${groupId}/members/${memberId}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};


export const deleteFreeAdsById = async ($id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`free-ads/${$id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const deleteSponsoredAdsById = async ($id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`sponsored-ads/${$id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const deletePointAdsById = async ($id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`point-ads/${$id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const deleteAdsById = async ($id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`ads/${$id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const deleteMyGroup = async ($id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`me/groups/${$id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const blockMyAccount = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete('me', config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            // console.log(3232);
            return false;
        });
};

export const createEmail = async (email) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const data = {
        email: email,
    };

    return await api.post(`admin/emails`, data, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            Alert.alert('Ocorreu um erro', getMessageByAxiosError(error, 'Não foi possível realizar o cadastro'));
            return false;
        });
}

export const deleteEmail = async (id) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`admin/emails/${id}`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const getEmails = async () => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`admin/emails`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const getPages = async () => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`admin/pages`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const getPage = async (id) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`admin/pages/${id}`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return null;
        });
}

export const getAdsByGroupId = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`groups/${id}/ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(`groups/${id}/ads`);
            console.log('Erro ao buscar grupo', error);
            return null;
        });
};

export const getLikedFreeAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`me/liked-free-ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const getLikedAds = async () => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`me/liked-ads`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
};

export const likeAds = async (adsId) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.post(`ads/${adsId}/like`, [], config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const likeFreeAds = async (adsId) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.post(`free-ads/${adsId}/like`, [], config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}


export const getAdLikes = async (adsId) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`ads/${adsId}/like`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}


export const addAdsComment = async (adsId, comment) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const data = {
        comment: comment
    }

    return await api.post(`ads/${adsId}/comments`, data, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const addPointAdsComment = async (adsId, comment) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const data = {
        comment: comment
    }

    return await api.post(`point-ads/${adsId}/comments`, data, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const addFreeAdsComment = async (adsId, comment) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const data = {
        comment: comment
    }

    return await api.post(`free-ads/${adsId}/comments`, data, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}


export const loadPointAdsCommentsById = async (adsId) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`point-ads/${adsId}/comments`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const loadFreeAdsCommentsById = async (adsId) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`free-ads/${adsId}/comments`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const loadAdsCommentsById = async (adsId) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.get(`ads/${adsId}/comments`, config)
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            return [];
        });
}

export const deslikeFreeAds = async (adsId) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`free-ads/${adsId}/like`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const deslikeAds = async (adsId) => {
    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    return await api.delete(`ads/${adsId}/like`, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const logout = async () => {
    return await AsyncStorage.removeItem('authUser');
};

export const if401ThenLogout = async (error) => {
    if (!is401(error)) {
        return false;
    }

    await AsyncStorage.removeItem('authUser');
    return false;
};

export const is401 = (error) => {
    return error.response.status === 401;
};

export const getMessageByAxiosError = (error, defaultMessage = undefined) => {

    console.log(error.response);

    let message = defaultMessage === undefined
        ? 'Não foi possível realizar a operação, por favor tente novamente.'
        : defaultMessage;

    if (401 === error.response.status) {
        if401ThenLogout(error);
        return 'Não foi possível identificar o usuário logado, por favor faça o login novamente!';
    }

    if (422 === error.response.status) {

        const messageError = error.response.data.message;

        if (messageError && messageError !== 'The given data was invalid.') {
            message = messageError;
        } else {
            const errors = error.response.data.errors;
            message = errors[Object.keys(errors)[0]][0];
        }

    }

    return message;
}

export const getAdvertiserId = async () => {
    const profile = await myProfile();
    return profile.advertiser_id;
};

export const changePlan = async (planId, advertiserId) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const body = {
        plan_id: planId
    }

    return await api.put(`advertisers/${advertiserId}/plan`, body, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const changeStatusPlan = async (planId, status) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const body = {
        status: status
    }

    return await api.patch(`plans/${planId}/status`, body, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            console.log(planId, body);
            return false;
        });
}

export const changeStatusAdvertiser = async (advertiserId, status) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const body = {
        status: status
    }

    return await api.put(`advertisers/${advertiserId}/status`, body, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

export const changeStatusSegment = async (segmentId, status) => {

    const config = await headerAuthorizationOrAlert();

    if (config === null) {
        return null;
    }

    const body = {
        status: status
    }

    return await api.patch(`segments/${segmentId}/status`, body, config)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            console.log(segmentId, body);
            return false;
        });
}
