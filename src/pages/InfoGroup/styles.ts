import styled from 'styled-components/native';
import {mainColor} from "../../utils/Util";

export const Container = styled.View`
  flex: 1;
  padding: 0px 20px 10px;
  background-color: #FFF;
`;


export const Title = styled.Text`
  font-size: 24px;
  color: #000;
  font-family: 'RobotoSlab-Medium';
  margin: 20px 0 24px;
`;

export const InfoGroupBox = styled.View`
    background-color: ${mainColor};
    padding: 10px;
`;

export const InfoGroupLabel = styled.Text`
    color: #FFF;
    font-weight: bold;
    padding: 10px
`;

export const InfoGroupInfo = styled.Text`
    color: #FFF;
    font-weight: normal;
`;




