import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {mainColor} from "../../utils/Util";

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  min-height: 60px;
  background: #FFF;
  border-radius: 10px;
  margin-bottom: 8px;
  borderBottomWidth: 2px;
  borderBottomColor: #666;
  flex-direction: row;
  align-items: center;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      borderBottomColor: ${mainColor};
    `}
    
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #666360;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
