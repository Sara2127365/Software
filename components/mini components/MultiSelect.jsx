import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Pressable
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { checkIcon, chevronDownIcon } from '../../constants/icons';

const MultiSelect = ({
    goUp = true,
    oldSelectedOptions = [],
    options = [],
    title = 'Select ..',
    setIsMultiSelectOpen,
    isMultiSelectOpen,
    customOnChange = () => null,
    setData,
    objKey = ''
}) => {

    const [selectedOptions, setSelectedOptions] = useState(oldSelectedOptions);

    console.log('selectedOptions' , selectedOptions);
    

    function handleCheck(option) {
        setSelectedOptions(old =>
            old.some(el => el.id === option.id)
                ? old.filter(el => el.id !== option.id)
                : [...old, option]
        );
    }

    useEffect(() => {
        setData(old=>({...old,[objKey] : selectedOptions?.map(el=>el.id)}))
    }, [selectedOptions]);

    const isSelected = function (opt) {
        return selectedOptions.some(el => el.id === opt.id);
    };

    const selectedToText =
        selectedOptions.length > 0 &&
        selectedOptions
            .map(el => el.name)
            .join(' , ')
            .slice(0, 30) + ' ...';

    return (
        <View className="relative">
            <TouchableOpacity
                onPress={() => setIsMultiSelectOpen(old => !old)}
                className="border  flex flex-row items-center justify-between border-gray-300  py-4 rounded-xl"
            >
                <Text className="text-lg px-3  text-gray-400 font-montserrat-r">
                    {selectedOptions.length === 0 ? title : selectedToText}
                </Text>
                <View className="mr-3 shrink-0">{chevronDownIcon()}</View>
            </TouchableOpacity>
            {isMultiSelectOpen && (
                <ScrollView
                    nestedScrollEnabled={true}
                    className="absolute -top-1 transform -translate-y-full w-full bg-white rounded-xl max-h-80"
                >
                    <Pressable className="p-4">
                        <Text className="mb-4 font-montserrat-sb text-main-rose">
                            Choose ...
                        </Text>
                        <View className="flex flex-col gap-2">
                            {options.map(el => (
                                <Pressable
                                    onPress={() => handleCheck(el)}
                                    className={`border flex items-center justify-between flex-row ${
                                        isSelected(el)
                                            ? 'border-green-500'
                                            : 'border-gray-300 '
                                    } px-3 rounded-lg`}
                                    key={el.id}
                                >
                                    <Text className="py-3 font-montserrat-r">
                                        {el.name}
                                    </Text>
                                    {isSelected(el) && checkIcon(24, 'green')}
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </ScrollView>
            )}
        </View>
    );
};

export default MultiSelect;
