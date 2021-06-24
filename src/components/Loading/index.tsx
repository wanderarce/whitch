import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Image, ActivityIndicator, StyleSheet, Text, View, ImageProps, Modal } from "react-native";
import loadingImg from "../../assets/loading.png";
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
            <Image source={loadingImg}
                style={
                    {
                        width: "100%",
                        height: "100%",
                        resizeMode: "center",
                        alignContent: "center",

                    }
                }/>


          </View>
        </View>
               </Modal>
          </View>


    );
  }
}


export default Loading;
