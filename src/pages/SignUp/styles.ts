import styled from 'styled-components/native';
import {Platform} from 'react-native';

export const Container = styled.View`
  flex: 1;
  padding: 20px 20px ${Platform.OS === 'android' ? 120 : 40}px;
  background-color: #FFF;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #000;
  font-family: 'RobotoSlab-Medium';
  margin: 20px 0 24px;
`;

