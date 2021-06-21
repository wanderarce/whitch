import React, {forwardRef, useEffect, useRef, useState} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {Container, ModalStyle} from "./style";
import {mainColor} from "../../utils/Util";
import api from "../../services/api";

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


const SegmentsSelect: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {registerField, defaultValue = '', fieldName} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const startDefaultSegmentLabel = 'Selecione um segmento';
    const [defaultSegmentSelectLabel, setDefaultSegmentSelectLabel] = useState(startDefaultSegmentLabel);
    const inputElementRef = useRef<any>(null);

    const [currentSegmentTypeLabel, setCurrentSegmentLabel] = React.useState(defaultSegmentSelectLabel);
    const [segments, setSegments] = React.useState([]);

    const loadSegments = () => {
        api.get('/segments?status=true').then((response) => {
            setSegments(response.data.data);
        });
    };

    useEffect(function (){
        if(rest.required === true){

            const oldLabel = startDefaultSegmentLabel;

            setDefaultSegmentSelectLabel(startDefaultSegmentLabel + '*');

            if(currentSegmentTypeLabel === oldLabel){
                setCurrentSegmentLabel(startDefaultSegmentLabel + '*');
            }
        }
    }, [])

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

    }, [fieldName, registerField])

    return (
        <>
            <Container>
                <Icon name="tag" size={25}
                      color={currentSegmentTypeLabel !== defaultSegmentSelectLabel ? mainColor : '#666360'}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={segments}
                    labelExtractor={item => item.name}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentSegmentLabel(option.name);
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
                        value={currentSegmentTypeLabel}/>
                </ModalSelector>
            </Container>
        </>
    );
};

export default forwardRef(SegmentsSelect);