import {StyleSheet} from "react-native";
import styled from "styled-components/native";

export const ModalStyle = StyleSheet.create({
  style: {
    flex: 1,
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

export const ContainerSelect = styled.View`
          flex-direction: row;
    `;

