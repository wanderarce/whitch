import styled from 'styled-components/native';
import {Platform, StyleSheet} from "react-native";

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


export const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#2AC062',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    closeButton: {
        display: 'flex',
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3974',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 10,
            width: 0
        },
        shadowRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    image: {
        marginTop: 150,
        marginBottom: 10,
        width: '100%',
        height: 350,
    },
    text: {
        fontSize: 24,
        marginBottom: 30,
        padding: 40,
    },
    closeText: {
        fontSize: 24,
        color: '#00479e',
        textAlign: 'center',
    },

    btnText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    }
});