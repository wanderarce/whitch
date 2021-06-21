import React, {forwardRef, useEffect, useRef} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {Container, ModalStyle} from "./style";
import {getMyGroupByTermAndCityId, mainColor} from "../../utils/Util";

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

const MyGroupsSelect: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {registerField, defaultValue = '', fieldName} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const defaultGroupSelectLabel = 'Selecione um grupo';
    const inputElementRef = useRef<any>(null);

    const [currentGroupLabel, setCurrentGroupLabel] = React.useState(defaultGroupSelectLabel);
    const [groups, setGroups] = React.useState([]);

    const loadMyGroups = async () => {
        const groups = await getMyGroupByTermAndCityId();
        setGroups(groups);
    };

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

        loadMyGroups();

    }, [fieldName, registerField]);

    useEffect(function () {
        if (rest.required === true) {

            const oldLabel = defaultGroupSelectLabel;

            if (currentGroupLabel === oldLabel) {
                setCurrentGroupLabel(defaultGroupSelectLabel + '*');
            }
        }
    });

    return (
        <>
            <Container>
                <Icon name="tag" size={25}
                      color={[defaultGroupSelectLabel, defaultGroupSelectLabel + '*'].includes(currentGroupLabel) ? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={groups}
                    labelExtractor={item => item.name}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentGroupLabel(option.name);
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
                        value={currentGroupLabel}/>
                </ModalSelector>
            </Container>
        </>
    );
};

export default forwardRef(MyGroupsSelect);