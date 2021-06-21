import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import {mainColor} from "../../utils/Util";

export const Container = styled(RectButton)`
  width: auto;
  width: 100%; 
  height: 60px;
  background: ${mainColor};
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #FFFFFF;
  font-size: 18px;
`;
