import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import {mainColor} from "../../utils/Util";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: '5%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#FFF"
  },
  modalOverlay: {
    width: '100%',
    height:'100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',

  },

  imagePosition: {
    position: 'relative',
    top: '31%'

  },
  textLoading: {
    width: "100%",
    height: "30px",
    color: "blue",
    position: 'relative',
    top: '30%',
    left: '30%',
    alignContent: "center",

}
});
