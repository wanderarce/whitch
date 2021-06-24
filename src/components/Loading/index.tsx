import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Image, ActivityIndicator, StyleSheet, Text, View, ImageProps, Modal } from "react-native";
import footerLogo from "../../assets/ic_launcher.png";
import t from 'prop-types';
import {styles} from './styles';
import { style } from '../Form/style';
interface InputProps extends ImageProps {
  loading: false
}

class Loading extends Component {

  static propTypes = {
    //children: t.node.isRequired,
    visible: t.bool.isRequired,
    dismiss: t.bool.isRequired,
    transparent: t.bool,
    animationType: t.string,
  };

  static defaultProps = {
    animationType: 'none',
    transparent: false,
  };

  render() {
    const { props } = this;
    if(!props.visible) return null;
    return (
      <View style={styles.centeredView}>
        <Modal

          visible={props.visible}
          transparent={props.transparent}
          onRequestClose={props.dismiss}
          animationType={props.animationType}
        >
        <View style={styles.modalOverlay}>
          <View style={{width: "100%",
          height:"100%"
        }}>
            <Image source={footerLogo}
                style={
                    {
                        marginLeft:"34%",
                        marginTop:"60%",
                        width: "30%",
                        height: "20%",
                        resizeMode: "cover",
                        alignContent: "center",

                    }
                }/>

            <Text style={{color: "blue",
            fontSize: 20,
            alignContent:"center",
            textAlign:"center",
            fontWeight: "bold"}} >CARREGANDO</Text>
          </View>
        </View>
               </Modal>
          </View>


    );
  }
}


export default Loading;
