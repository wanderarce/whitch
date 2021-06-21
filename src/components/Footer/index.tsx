import React from 'react';
import {Dimensions, Image, View} from "react-native";
import footerLogo from "../../assets/footer-logo.png";

const window = Dimensions.get('window');

const Footer: React.FC<any> = () => (
    <View style={
        {
            backgroundColor: "white",
            height: window.height * 0.080,
            alignItems: "center"
        }
    }>
        <Image source={footerLogo}
               style={
                   {
                       width: "70%",
                       height: "55%",
                       resizeMode: "cover",
                       alignContent: "center"
                   }
               }/>
    </View>
);

export default Footer;
