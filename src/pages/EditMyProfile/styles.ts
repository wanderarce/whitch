import styled from 'styled-components/native';
import {Platform, StyleSheet} from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: #FFF;
  box
`;

export const Title = styled.Text`
  font-size: 12px;
  color: #FFF;
  font-family: 'RobotoSlab-Medium';
  margin: 10px 0 10px;
`;

export const Label = styled.Text`
  font-size: 13px;
  color: #FFF;
`;

export const ContainerForm = styled.View`
  flex: 1;
  padding: 0px 20px ${Platform.OS === 'android' ? 120 : 40}px;
  background-color: #FFF;
`;


export const checkBoxStyles = StyleSheet.create({
    container: {},
    checkboxContainer: {},
    checkbox: {},
    label: {
        width: "81%",
        paddingTop: 6,
    },
});