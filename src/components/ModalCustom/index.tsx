import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import t from 'prop-types';
import { mainColor } from "../../utils/Util";
import Button from "../Button";

class ModalCustom extends Component {
  static propTypes =  {
    children: t.node,
    modalVisible: t.bool.isRequired,
    value: t.string,

  };
  static defaultProps = {
    modalVisible: false,
    value:"",

  };

  setModalVisible = (visible) => {
    this.modalVisible = visible;
  }

  render() {
    const { props } = this;
    if(!props.modalVisible) return null;
    return (
      <View style={styles.centeredView}>
        <Modal

          animationType="slide"
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => {
           // Alert.alert("Modal has been closed.");
            this.props.modalVisible = false;;
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{props.value}</Text>
              <View>
                {props.children}
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  modalView: {
    backgroundColor: mainColor,
    padding: 2,
    height:60,
    width:200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    borderColor:"white",
    borderWidth: 1,
    position: "absolute",
    top:"30%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    position:"relative",
  top:"0",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    color: "white",
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ModalCustom;
