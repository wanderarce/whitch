import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Alert } from "react-native";
import AppRoutes from "../../routes/app.routes";
import AuthRoutes from "../../routes/auth.routes";
import { loadMainProfile } from "../../utils/Util";

const Stack = createStackNavigator();
const Auth = createDrawerNavigator();

class DrawerCustom extends React.Component {

  constructor(props) {
    super(props);
    this.state = { profile: null };
    this.handleProfileChange = this.handleProfileChange.bind(this);
  }


  componentDidMount() {
    loadMainProfile().then(value => {
      this.props.profile = value;
      this.handleProfileChange;
    });
  }
  componentWillUnmount() {
    loadMainProfile().then(value => {
      this.props.profile = value;
      this.handleProfileChange;
    });
  }
  handleProfileChange(profile){
    this.setState({profile: profile});
  }

  render(){
      //alert(this.state.profile);
      /*if(this.state.profile === null || this.state.profile === undefined) {
        return <AppRoutes/>;
      }else{*/
        return <AuthRoutes/>
      //}
  }
}

export default DrawerCustom;
