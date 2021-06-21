import React, {forwardRef, useEffect} from "react";
import ModalSelector from "react-native-modal-selector";
import {Dimensions, Text, TextInputProps, View} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {ContainerSelect, ModalStyle} from "./style";
import api from "../../services/api";


interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputRef {
    focus(): void;
}


const FilterCities: React.RefForwardingComponent<InputRef, InputProps> = ({...rest}, ref) => {
    const window = Dimensions.get('window');
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

    const [currentStateLabel, setCurrentStateLabel] = React.useState('Selecione um estado');
    const [currentCityLabel, setCurrentCityLabel] = React.useState('Selecione uma cidade');
    const [currentOrderLabel, setCurrentOrderLabel] = React.useState('N/A');
    const [currentSegmentLabel, setCurrentSegmentLabel] = React.useState('TODOS');
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

        api.get(`cities/${id}`)
            .then(async (response) => {
                const responseData = response.data.data;
                await loadCities(responseData.state_id);
                setCurrentStateLabel(data[responseData.state_id - 1].label)
                setCurrentCityLabel(responseData.name);
            });
    }


    useEffect(() => {
        loadUserCityAndState(rest.value);
    }, [rest.value]);


    return (
        <>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{width: window.width * 0.40}}>
                    <ContainerSelect>
                        <ModalSelector
                            data={data}
                            labelExtractor={item => item.label}
                            keyExtractor={item => item.value}
                            style={ModalStyle.style}
                            onChange={(option) => {
                                setCurrentStateLabel(option.label);
                                setCurrentCityLabel('Selecione uma cidade');
                                loadCities(option.value);
                            }}
                        >
                            <View>
                                <Text style={{
                                    fontSize: 8,
                                    color: '#333',
                                }}>
                                    Estado: <Text style={{
                                    color: '#333',
                                    paddingLeft: 5,
                                }}>{currentStateLabel}
                                    <Icon name="chevron-down"
                                          style={{
                                              lineHeight: 20,
                                              color: "#333",
                                          }}
                                    />
                                </Text>
                                </Text>
                            </View>
                        </ModalSelector>
                    </ContainerSelect>

                    <ContainerSelect>
                        <ModalSelector
                            data={cities}
                            labelExtractor={item => item.name}
                            keyExtractor={item => item.id}
                            style={ModalStyle.style}
                            onChange={(option) => {
                                setCurrentCityLabel(option.name);
                                if (rest.onCitySelected !== undefined) {
                                    rest.onCitySelected(option.id);
                                }
                            }}
                        >
                            <View>
                                <Text style={{
                                    fontSize: 8,
                                    color: '#333',
                                }}>
                                    Cidade: <Text style={{
                                    color: '#333',
                                    paddingLeft: 5,
                                }}>{currentCityLabel}
                                    <Icon name="chevron-down"
                                          style={{
                                              lineHeight: 20,
                                              color: "#333",
                                          }}
                                    />
                                </Text>
                                </Text>
                            </View>
                        </ModalSelector>
                    </ContainerSelect>
                </View>

                <View style={{
                    width: window.width * 0.49
                }}>
                    <ModalSelector
                        data={rest.segments}
                        labelExtractor={item => item.name}
                        keyExtractor={item => item.id}
                        style={{
                            display: rest.segments !== undefined ? 'flex' : 'none',
                        }}
                        onChange={(option) => {
                            setCurrentSegmentLabel(option.name);

                            if (rest.onSegmentSelected !== undefined) {
                                rest.onSegmentSelected(option.id);
                            }

                        }}
                    >
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={{
                                fontSize: 8,
                                color: '#333',
                            }}>
                                Segmentos: <Text style={{
                                color: '#333',
                            }}>{currentSegmentLabel}
                                <Icon name="chevron-down"
                                      style={{
                                          lineHeight: 20,
                                          color: "#333",
                                      }}
                                />
                            </Text>
                            </Text>
                        </View>
                    </ModalSelector>

                    <ModalSelector
                        data={rest.orders}
                        labelExtractor={item => item.name}
                        keyExtractor={item => item.id}
                        style={{
                            display: rest.orders !== undefined ? 'flex' : 'none',
                        }}
                        onChange={(option) => {
                            setCurrentOrderLabel(option.name);

                            if (rest.onOrderSelected !== undefined) {
                                rest.onOrderSelected(option.value);
                            }

                        }}
                    >
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={{
                                fontSize: 8,
                                color: '#333',
                            }}>
                                Classificar por: <Text style={{
                                color: '#333',
                            }}>{currentOrderLabel}
                                <Icon name="chevron-down"
                                      style={{
                                          lineHeight: 20,
                                          color: "#333",
                                      }}
                                />
                            </Text>
                            </Text>
                        </View>
                    </ModalSelector>
                </View>
            </View>
        </>
    );
};

export default forwardRef(FilterCities);