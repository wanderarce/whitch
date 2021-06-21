import styled from 'styled-components/native';
import {Platform} from "react-native";

export const Title = styled.Text`
  font-size: 12px;
  color: #FFF;
  font-family: 'RobotoSlab-Medium';
  margin: 10px 0 10px;
`;

export const Label = styled.Text`
  font-size: 13px;
  color: #FFF;
  border-radius: 3px;
`;

export const Container = styled.View`
  flex: 1;
  padding: 0px 20px ${Platform.OS === 'android' ? 120 : 40 }px;
  background-color: #FFF;
`;


export const AdsBox = styled.View`
  font-size: 24px;
  color: #2493a9;
  font-family: 'RobotoSlab-Medium';
  margin: 20px 0 24px;
`;
