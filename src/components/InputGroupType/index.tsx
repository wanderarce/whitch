import React, {forwardRef, useEffect, useRef, useState} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {Container, ModalStyle} from "./style";
import {mainColor} from "../../utils/Util";
import {data} from "./Data";


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


const GroupSelect: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {registerField, defaultValue = '', fieldName, error} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const defaultGroupTypeSelectLabel = 'Selecione um tipo';
    const inputElementRef = useRef<any>(null);

    const [currentGroupTypeLabel, setCurrentGroupTypeLabel] = React.useState('Selecione um tipo');

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

    }, [fieldName, registerField])

    useEffect(function () {
        if (rest.required === true) {

            const oldLabel = defaultGroupTypeSelectLabel;

            if (currentGroupTypeLabel === oldLabel) {
                setCurrentGroupTypeLabel(defaultGroupTypeSelectLabel + '*');
            }
        }
    }, [])

    return (
        <>
            <Container>
                <Icon name="tag" size={25}
                      color={[defaultGroupTypeSelectLabel, defaultGroupTypeSelectLabel + '*'].includes(currentGroupTypeLabel) ? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={data}
                    labelExtractor={item => item.name}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentGroupTypeLabel(option.name);
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
                        value={currentGroupTypeLabel}/>
                </ModalSelector>
            </Container>
        </>
    );
};

export default forwardRef(GroupSelect);