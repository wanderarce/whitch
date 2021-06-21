import React from 'react';
import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Button from '../../components/Button';

import {
  Container,
  ButtonContainer,
  Title,
  FooterButton,
  FooterButtonText,
  LogoContainer,
  Logo
} from './styles';

import logo from '../../assets/logo.png';

const SignIn: React.FC = () => {

  const navigation = useNavigation();

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
          <LogoContainer>
            <Image source={logo} style={Logo.image}/>
          </LogoContainer>
          <ButtonContainer>
            <Title>Já é cadastrado?</Title>
            <Button  onPress={() => navigation.navigate('Login')}>FAÇA SEU LOGIN</Button>
            <Title>É sua primeira vez usando o aplicativo?</Title>
            <Button onPress={() => navigation.navigate('SignUp')}>CADASTRE-SE</Button>
            {/*<Button onPress={() => navigation.navigate('ListPlans')}>CADASTRE-SE</Button>*/}
          </ButtonContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <FooterButton>
        <FooterButtonText>Which Is © 2021</FooterButtonText>
      </FooterButton>
    </>
  );
};

export default SignIn;
