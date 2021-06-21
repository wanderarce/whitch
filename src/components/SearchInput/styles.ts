import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {mainColor} from "../../utils/Util";

interface ContainerProps {
    isFocused: boolean;
    isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 40px;
  background: #FFF;
  border-radius: 4px;
  margin-bottom: 20px;
  borderWidth: 2px;
  flex-direction: row;
  align-items: center;
  borderColor: ${mainColor};  
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #333;
  font-size: 12px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 12px;
`;
