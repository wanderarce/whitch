import React, {useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import {TextInputProps, View} from 'react-native';
import {useField} from '@unform/core';

import {Container, TextInput, Icon} from './styles';
import {mainColor} from "../../utils/Util";

interface InputProps extends TextInputProps {
    name: string;
    leftIcon: string;
    rightIcon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const SearchInput: React.RefForwardingComponent<InputRef, InputProps> = ({
                                                                             name,
                                                                             leftIcon,
                                                                             rightIcon,
                                                                             onPressRightIcon,
                                                                             ...rest
                                                                         },
                                                                         ref) => {
    const inputElementRef = useRef<any>(null);

    const {registerField, defaultValue = '', fieldName, error} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [isSecurity, setIsSecurity] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputValueRef.current.value);
    }, []);

    const toggleSecurity = () => {
        const isActive = !isSecurity;
        if (rest.rightIconChangeSecureEntry) {
            setIsSecurity(isActive);
        }
    };

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        }
    }))

    if(!isFilled && rest.defaultValue !== ''){
        inputValueRef.current.value = rest.defaultValue;
    }

    useEffect(() => {
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

        if (rest.secureTextEntry) {
            setIsSecurity(true);
        }

    }, [fieldName, registerField])

    return (
        <Container isFocused={isFocused} isErrored={!!error}>

            <Icon name={leftIcon} size={20} color={isFocused || isFilled ? mainColor : '#666360'}/>

            <TextInput
                ref={inputElementRef}
                keyboardAppearance="dark"
                placeholderTextColor="#666360"
                defaultValue={defaultValue}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={(value) => {
                    inputValueRef.current.value = value;
                }}
                {...rest}
                secureTextEntry={isSecurity}
            />

            <View onTouchStart={rest.righticonCallable ?? toggleSecurity}>
                <Icon
                    name={rightIcon}
                    size={20}
                    color={isFocused || isFilled ? mainColor : '#666360'}
                />
            </View>

        </Container>
    );
};

export default forwardRef(SearchInput);




