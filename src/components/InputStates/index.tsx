import React, {forwardRef, useEffect, useRef, useState} from "react";
import ModalSelector from "react-native-modal-selector";
import {TextInput, TextInputProps} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {useField} from "@unform/core";
import {ContainerCity, ContainerState, ModalStyle} from "./style";
import api from "../../services/api";
import {mainColor} from "../../utils/Util";
import {CurrentRenderContext} from "@react-navigation/native";


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


const StateInput: React.RefForwardingComponent<InputRef, InputProps> = ({name, ...rest}, ref) => {

    const data = [
        {label: 'Acre', value: 'AC'},
        {label: 'Alagoas', value: 'AL'},
        {label: 'Amapá', value: 'AP'},
        {label: 'Amazonas', value: 'AM'},
        {label: 'Bahia', value: 'BA'},
        {label: 'Ceará', value: 'CE'},
        {label: 'Distrito Federal', value: 'DF'},
        {label: 'Espírito Santo', value: 'ES'},
        {label: 'Goiás', value: 'GO'},
        {label: 'Maranhão', value: 'MA'},
        {label: 'Mato Grosso', value: 'MT'},
        {label: 'Mato Grosso do Sul', value: 'MS'},
        {label: 'Minas Gerais', value: 'MG'},
        {label: 'Pará', value: 'PA'},
        {label: 'Paraíba', value: 'PB'},
        {label: 'Paraná', value: 'PR'},
        {label: 'Pernambuco', value: 'PE'},
        {label: 'Piauí', value: 'PI'},
        {label: 'Rio de Janeiro', value: 'RJ'},
        {label: 'Rio Grande do Norte', value: 'RN'},
        {label: 'Rio Grande do Sul', value: 'RS'},
        {label: 'Rondônia', value: 'RO'},
        {label: 'Roraima', value: 'RR'},
        {label: 'Santa Catarina', value: 'SC'},
        {label: 'São Paulo', value: 'SP'},
        {label: 'Sergipe', value: 'SE'},
        {label: 'Tocantins', value: 'TO'},
    ];

    const {registerField, defaultValue = '', fieldName, error} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const [defaultStateSelectLabel, setDefaultStateSelectLabel] = useState('Selecione um estado');
    const [defaultCitySelectLabel, setDefaultCitySelectLabel] = useState('Selecione uma cidade');

    const defaultStateLabels = [defaultStateSelectLabel, defaultStateSelectLabel + '*']
    const defaultCityLabels = [defaultCitySelectLabel, defaultCitySelectLabel + '*']

    const inputElementRef = useRef<any>(null);

    const [currentStateLabel, setCurrentStateLabel] = React.useState('Selecione um estado');
    const [currentCityLabel, setCurrentCityLabel] = React.useState('Selecione uma cidade');
    const [cities, setCities] = React.useState();

    const loadCities = async (abbreviationOrId: string) => {
        await api.get(`states/${abbreviationOrId}/cities`).then((result) => {
            setCities(result.data.data)
        });
    }

    const loadUserCityAndState = async (id) => {

        id = parseInt(id);

        if (isNaN(id)) {
            return null;
        }

        inputValueRef.current.value = id;

        api.get(`cities/${id}`)
            .then(async (response) => {
                const responseData = response.data.data;
                await loadCities(responseData.state_id);
                setCurrentStateLabel(data[responseData.state_id - 1].label)
                setCurrentCityLabel(responseData.name);
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

        loadUserCityAndState(rest.value);

        if (rest.requiredCity === true) {
            setDefaultCitySelectLabel(defaultCitySelectLabel + '*')
            setCurrentCityLabel(defaultCitySelectLabel + '*');
        }

        if (rest.requiredState === true) {
            setDefaultStateSelectLabel(defaultStateSelectLabel + '*')
            setCurrentStateLabel(defaultStateSelectLabel + '*');
        }

    }, [fieldName, registerField])


    useEffect(() => {
        loadUserCityAndState(rest.value);
    }, [rest.value]);


    return (
        <>
            <ContainerState>
                <Icon name="map" size={25}
                      color={defaultStateLabels.includes(currentStateLabel) ? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={data}
                    labelExtractor={item => item.label}
                    keyExtractor={item => item.value}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentStateLabel(option.label);
                        setCurrentCityLabel(defaultCitySelectLabel);
                        inputValueRef.current.value = undefined;
                        loadCities(option.value);
                        if (rest.onSelectedState !== undefined) {
                            rest.onSelectedState(option.value);
                        }
                    }}
                >
                    <TextInput
                        style={ModalStyle.textInput}
                        editable={false}
                        placeholder="Select something!"
                        value={currentStateLabel}/>
                </ModalSelector>
            </ContainerState>
            <ContainerCity>
                <Icon name="map-pin" size={25}
                      color={defaultCityLabels.includes(currentCityLabel) ? '#666360' : mainColor}
                      style={ModalStyle.icon}/>
                <ModalSelector
                    data={cities}
                    labelExtractor={item => item.name}
                    keyExtractor={item => item.id}
                    style={ModalStyle.style}
                    onChange={(option) => {
                        setCurrentCityLabel(option.name);
                        inputValueRef.current.value = option.id;
                    }}
                >
                    <TextInput
                        style={ModalStyle.textInput}
                        editable={false}
                        placeholder="Select something!"
                        value={currentCityLabel}/>
                </ModalSelector>
            </ContainerCity>
        </>
    );
};

export default forwardRef(StateInput);