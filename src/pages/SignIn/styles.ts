import styled from 'styled-components/native';
import {Platform, StyleSheet} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {Dimensions} from "react-native";
import {mainColor} from "../../utils/Util";

export const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

export const ButtonContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-color: ${mainColor};
  background-color: #FFFFFF;
  padding: 0 30px ${Platform.OS === 'android' ? 160 : 40 }px;
`;

export const LogoContainer = styled.View`
  background-color: ${mainColor};
  width: 100%;
  height:35%; 
  position: relative;
  align-items: center;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Logo = StyleSheet.create({
    image:{
        width: windowWidth * 0.85,
        height: windowHeight * 0.15,
        position: "relative",
        marginTop: "15%"
    }
});

export const Title = styled.Text`
  font-size: 12px;
  color: #555;
  font-family: 'RobotoSlab-Medium';
  margin: 20px 0 0 0;
  padding-top: 10px;
`;

export const FooterButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 16px 0 ${16 + getBottomSpace()}px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const FooterButtonText = styled.Text`
  color: #333333;
  font-size: 10px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;