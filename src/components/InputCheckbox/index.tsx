import React, {forwardRef, useEffect, useRef, useState} from "react";
import { Dimensions, Text, TextInputProps, View} from "react-native";
import {useField} from "@unform/core";
import {checkBoxStyles} from "../../pages/EditMyProfile/styles";
import CheckBox  from '@react-native-community/checkbox';

const window = Dimensions.get('window');


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


const Checkbox: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {
        registerField,
        fieldName,
        value
    } = useField(name);

    const inputValueRef = useRef<InputValueReference>({value: value});
    const [isChecked, setIsChecked] = useState(false);
    const inputElementRef = useRef<any>(null);

    useEffect(function () {
        inputValueRef.current.value = isChecked;
    }, [isChecked])

    useEffect(function () {
        setIsChecked(rest.value);
    }, [rest.value])

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
                inputValueRef.current.value = false;
                inputElementRef.current.clear();
            },
        });

    }, [fieldName, registerField])


    return (
        <>

            <View style={{
                flexDirection: 'row',
                backgroundColor: "white",
                borderColor: "gray",
                borderWidth: 1,
                borderStyle: "dotted",
                marginBottom: 10,
                borderRadius: 5,
                width: window.width * 0.89,
            }}>

                <View style={{width: window.width * 0.08}}>
                    <CheckBox
                        name={"a"}
                        value={isChecked}
                        style={checkBoxStyles.checkbox}
                        onValueChange={(option) => {
                            setIsChecked(option);

                            if(rest.onChange != undefined){
                                rest.onChange(option);
                            }
                        }}
                    />
                </View>

                <View style={{width: window.width }}>
                    <Text
                        multiline={true}
                        onPress={() => {
                            const newValue = !isChecked;
                            setIsChecked(newValue);
                            if(rest.onChange != undefined){
                                rest.onChange(newValue);
                            }
                        }}
                        style={checkBoxStyles.label}>
                        {rest.label}
                    </Text>
                </View>



            </View>


            {/*<ContainerCheckBox>*/}
            {/*    <View style={checkBoxStyles.checkboxContainer}>*/}
            {/*        <NativeCheckbox*/}
            {/*            value={isChecked}*/}
            {/*            style={checkBoxStyles.checkbox}*/}
            {/*            onValueChange={(option) => {*/}
            {/*                setIsChecked(option);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <Text*/}
            {/*            multiline={true}*/}
            {/*            onPress={() => setIsChecked(!isChecked)}*/}
            {/*            style={checkBoxStyles.label}>*/}
            {/*            {rest.label}*/}
            {/*        </Text>*/}
            {/*    </View>*/}


            {/*</ContainerCheckBox>*/}
        </>
    );
};

export default forwardRef(Checkbox);
