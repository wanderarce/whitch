import React, {forwardRef, useEffect, useRef} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {Container, ModalStyle} from "./style";
import {mainColor} from "../../utils/Util";
import api from "../../services/api";
import { Alert } from "react-native";

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}


const PlansSelect: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {registerField, defaultValue = '', fieldName} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const defaultSelectLabel = 'Selecione um plano';
    const inputElementRef = useRef<any>(null);

    const [currentPlanTypeLabel, setCurrentLabel] = React.useState(defaultSelectLabel);
    const [plans, setPlans] = React.useState([]);

    const loadSegments = () => {
        api.get('/plans?status=true').then((response) => {
            setPlans(response.data.data);
        });
    };

    const loadPlan = async (id: any) => {

      id = parseInt(id);
      if (isNaN(id)) {
          return null;
      }
      inputValueRef.current.value = id;
      plans.forEach(element => {
        if(element.id == id){
          setCurrentLabel(element.name);
        }
      });
  }

    useEffect(function () {

        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({text: value});
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            },
        });

        loadSegments();
        // if(rest.value != null && rest.value != undefined)
        //   loadPlan(rest.value);

    }, [fieldName, registerField])

    useEffect(function () {
      //Alert.alert('p', JSON.stringify(rest));
      if (rest.required === true) {
            const oldLabel = defaultSelectLabel;

            if (currentPlanTypeLabel === oldLabel) {
                setCurrentLabel(defaultSelectLabel + '*');
            }
        }
    });

    useEffect(() => {
      loadPlan(rest.value);
    }, [rest.value]);


    return (
        <>
            <Container>
                <Icon name="tag" size={25}
                      color={[defaultSelectLabel, defaultSelectLabel + '*'].includes(currentPlanTypeLabel) ? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={plans}
                    labelExtractor={item => `${item?.name} - ${item?.description}`}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentLabel(option.name);
                        inputValueRef.current.value = option.id;
                    }}
                >
                    <TextInput
                        style={ModalStyle.textInput}
                        editable={false}
                        maxLength={255}
                        numberOfLines={4}
                        multiline={true}
                        placeholder="Select something!"
                        value={currentPlanTypeLabel}/>
                </ModalSelector>
            </Container>
        </>
    );
};

export default forwardRef(PlansSelect);
