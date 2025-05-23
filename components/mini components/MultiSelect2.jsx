import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Pressable
} from 'react-native';
import React, { useState } from 'react';
import { checkIcon, chevronDownIcon } from '../../constants/icons';

const MultiSelect2 = ({
    goUp = true,
    oldSelectedOptions = [],
    options = [
    {label:' Engineering',value:1},
    {label:'Medicine',value:2},
    {label:' Arts',value:3},
    {label:' Science',value:4},
    {label:' Business',value:5}
    ],
    title = 'Select ..',
    setIsMultiSelectOpen,
    isMultiSelectOpen,
    customOnChange = () => null
}) => {
    const fakeOpts = [
        {label:' Engineering',value:1},
        {label:'Medicine',value:2},
        {label:' Arts',value:3},
        {label:' Science',value:4},
        {label:' Business',value:5}
       
    ];
    
    const [selectedOptions, setSelectedOptions] = useState(oldSelectedOptions);

    function handleCheck(option) {
        setSelectedOptions(old =>
            old.some(el => el.value === option.value)
                ? old.filter(el => el.value !== option.value)
                : [...old, option]
        );
    }

    const isSelected = function (opt) {
        return selectedOptions.some(el => el.value === opt.value);
    };

    const selectedToText =
        selectedOptions.length > 0 &&
        selectedOptions
            .map(el => el.label)
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
                            {fakeOpts.map(el => (
                                <Pressable
                                    onPress={() => handleCheck(el)}
                                    className={`border flex items-center justify-between flex-row ${
                                        isSelected(el)
                                            ? 'border-green-500'
                                            : 'border-gray-300 '
                                    } px-3 rounded-lg`}
                                    key={el.value}
                                >
                                    <Text className="py-3 font-montserrat-r">
                                        {el.label}
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

export default MultiSelect2;
