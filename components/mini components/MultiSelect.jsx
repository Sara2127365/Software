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
    objKey = '',
    nameNoId,
    isSingle = false
}) => {
    const [selectedOptions, setSelectedOptions] = useState(oldSelectedOptions);

    function handleCheck(option) {
        if (isSingle) {
            // For single selection, replace the entire selection
            setSelectedOptions(
                selectedOptions.some(el => el.id === option.id) ? [] : [option]
            );
        } else {
            // For multi-selection, toggle the option
            setSelectedOptions(old =>
                old.some(el => el.id === option.id)
                    ? old.filter(el => el.id !== option.id)
                    : [...old, option]
            );
        }
    }

    useEffect(() => {
        if (isSingle) {
            // For single selection, send either the single value or null
            const value =
                selectedOptions.length > 0
                    ? nameNoId
                        ? selectedOptions[0].name
                        : selectedOptions[0].id
                    : null;
            setData(old => ({ ...old, [objKey]: value }));
        } else {
            // For multi-selection, send the array as before
            setData(old => ({
                ...old,
                [objKey]: selectedOptions?.map(el =>
                    nameNoId ? el.name : el.id
                )
            }));
        }
    }, [selectedOptions]);

    const isSelected = function (opt) {
        return selectedOptions.some(el => el.id === opt.id);
    };

    const selectedToText = () => {
        if (selectedOptions.length === 0) return title;

        if (isSingle) {
            // For single selection, just show the selected name
            return selectedOptions[0].name;
        } else {
            // For multi-selection, join the names with commas
            return (
                selectedOptions
                    .map(el => el.name)
                    .join(' , ')
                    .slice(0, 30) +
                (selectedOptions[0].name.length > 30 ? ' ...' : '')
            );
        }
    };

    return (
        <View className="relative">
            <TouchableOpacity
                onPress={() => setIsMultiSelectOpen(old => !old)}
                className="border flex flex-row items-center justify-between border-gray-300 py-4 rounded-xl"
            >
                <Text className="text-lg px-3 text-gray-400 font-montserrat-r">
                    {selectedToText()}
                </Text>
                <View className="mr-3 shrink-0">{chevronDownIcon()}</View>
            </TouchableOpacity>

            {isMultiSelectOpen && (
                <ScrollView
                    nestedScrollEnabled={true}
                    className={`absolute ${
                        goUp
                            ? '-top-1 transform -translate-y-full'
                            : 'top-full mt-1'
                    } w-full bg-white rounded-xl max-h-80 border border-gray-200 shadow-md z-10`}
                >
                    <Pressable className="p-4">
                        <Text className="mb-4 font-montserrat-sb text-main-rose">
                            {isSingle ? 'Select one option' : 'Choose...'}
                        </Text>
                        <View className="flex flex-col gap-2">
                            {options.map(el => (
                                <Pressable
                                    onPress={() => {
                                        handleCheck(el);
                                        if (isSingle) {
                                            setIsMultiSelectOpen(false);
                                        }
                                    }}
                                    className={`border flex items-center justify-between flex-row ${
                                        isSelected(el)
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-300'
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
