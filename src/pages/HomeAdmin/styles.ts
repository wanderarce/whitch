import styled from 'styled-components/native';
import {Platform} from "react-native";
import {mainColor} from "../../utils/Util";

export const Title = styled.Text`
  font-size: 12px;
  color: #FFF;
  font-family: 'RobotoSlab-Medium';
  margin: 10px 0 10px;
`;

export const Label = styled.Text`
  font-size: 13px;
  background-color: ${mainColor};
  color: #FFF;
  margin: 0 0 10px 0;
  padding: 7px 0 10px 5px;
  border-radius: 3px;
`;

export const Container = styled.View`
  flex: 1;
  padding: 0px 20px ${Platform.OS === 'android' ? 120 : 40 }px;
  background-color: #FFF;
`;

