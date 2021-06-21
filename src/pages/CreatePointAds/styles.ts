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
  font-size: 18px;
  color: #333;
  padding-bottom: 10px;
`;

export const ContainerForm = styled.View`
  flex: 1;
  padding: 0px 20px ${Platform.OS === 'android' ? 120 : 40 }px;
  background-color: #FFF;
`;


export const checkBoxStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
});