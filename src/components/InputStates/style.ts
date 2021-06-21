import {StyleSheet} from "react-native";
import styled from "styled-components/native";

export const ModalStyle = StyleSheet.create({
  style: {
    flex: 1,
    width: '20%',
    padding: 0,
    // backgroundColor: '#F00'
  },
  textInput: {
    height: 50,
    fontSize: 16,
    color: '#666360',
    lineHeight: 30
  },
  icon: {
    paddingTop: 14,
    paddingRight: 16,
    fontSize: 17
  }
});

export const ContainerState = styled.View`
          width: 100%;
          height: 60px;
          padding: 0 0;
          background: #FFF;
          border-radius: 10px;
          margin-bottom: 8px;
          borderBottomWidth: 2px;
          borderBottomColor: #666;
          flex-direction: row;
    `;

export const ContainerCity = styled.View`
          width: 100%;
          height: 60px;
          padding: 0 0;
          background: #FFF;
          border-radius: 10px;
          margin-bottom: 8px;
          borderBottomWidth: 2px;
          borderBottomColor: #666;
          flex-direction: row;
    `;

