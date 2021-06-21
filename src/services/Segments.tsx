import api from "./api";
import {useState} from "react";

const [allSegments, setAllSegments] = useState([]);

export const all = () => {
    return api.get('/segments').then((response) => {
        setAllSegments(response.data);
        return response.data;
    });
}