import React, {forwardRef, useEffect, useRef} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {Container, ModalStyle} from "./style";
import {getAdsByAdvertiserId, getAdvertiserId, getPointAdsByAdvertiserId, mainColor} from "../../utils/Util";
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


const FreeAdsSelect: React.RefForwardingComponent<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {

    const {registerField, defaultValue = '', fieldName} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const defaultSelectLabel = 'Selecione um anúncio';
    const inputElementRef = useRef<any>(null);

    const [currentLabel, setCurrentLabel] = React.useState(defaultSelectLabel);
    const [pointAds, setPointAds] = React.useState([]);

    const loadPointAds = async () => {

        const advertiserId = await getAdvertiserId();
        const ads = await getPointAdsByAdvertiserId(advertiserId);
        setPointAds(ads);

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

        loadPointAds();

    }, [fieldName, registerField])

    useEffect(function () {
        if (rest.required === true) {

            const oldLabel = defaultSelectLabel;

            if (currentLabel === oldLabel) {
                setCurrentLabel(defaultSelectLabel + '*');
            }
        }
    });

    return (
        <>
            <Container>
                <Icon name="tag" size={25}
                      color={[defaultSelectLabel, defaultSelectLabel + '*'].includes(currentLabel)? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={pointAds}
                    labelExtractor={item => item.title}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentLabel(option.title);
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
                        value={currentLabel}/>
                </ModalSelector>
            </Container>
        </>
    );
};

export default forwardRef(FreeAdsSelect);