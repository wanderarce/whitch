import api from "./api";
import {headerAuthorizationOrAlert} from "../utils/Util";

export const byId = async (id: number) => {

    const config = await headerAuthorizationOrAlert();

    return api.get(`/groups/${id}`, config).then((response) => {
        return response.data.data;
    });

}