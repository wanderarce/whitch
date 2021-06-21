import styled from 'styled-components/native';
import {mainColor} from "../../utils/Util";

export const Title = styled.Text`
  font-size: 12px;
  color: #FFF;
  font-family: 'RobotoSlab-Medium';
  margin: 10px 0 10px;
`;

export const ItemGroup = styled.View`
  background-color: ${mainColor};
  color: #FFF;
  margin: 20px 0 10px 0;
  padding: 10px 10px 10px;
  border-radius: 3px;
`;

export const ItemGroupButtons = styled.View`
    ItemGroupButtons
`;

export const ItemGroupButton = styled.View`
  font-size: 16px;
  font-family: 'RobotoSlab-Medium';
  margin: 0px 0 10px;
  background-color: #333;
`;

export const ItemGroupTitleButtons = styled.View`
    backgroundColor: ${mainColor}
`;


export const ItemGroupName = styled.Text`
  font-size: 16px;
  color: #FFF;
  font-family: 'RobotoSlab-Medium';
  margin: 0px 0 10px;
`;

export const Container = styled.View`
  flex: 1;
  padding: 0px 20px 10px;
  background-color: #FFF;
`;

