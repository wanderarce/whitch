import {StyleSheet} from "react-native";
import styled from "styled-components/native";

export const ModalStyle = StyleSheet.create({
  style: {
    flex: 1,
    width: '20%',
    padding: 0,
  },
  textInput: {
    height: 60,
    fontSize: 16,
    color: '#666360',
  },
  icon: {
    paddingTop: 14,
    paddingRight: 16,
    fontSize: 17
  }
});

export const Container = styled.View`
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
