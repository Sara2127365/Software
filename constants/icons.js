import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';


function generate(IconComponent, iconName, size = 20, color = '#8F99A3') {
    return <IconComponent name={iconName} size={size} color={color} />;
}

export const personIcon = (size, color) =>
    generate(FontAwesome, 'user-o', size, color);

export const emailIcon = (size, color) =>
    generate(MaterialCommunityIcons, 'email-outline', size, color);

export const phoneIcon = (size, color) =>
    generate(Feather, 'phone', size, color);

export const chevronDownIcon = (size, color) =>
    generate(Entypo, 'chevron-down', size, color);

export const informationIcon = (size, color) =>
    generate(Ionicons, 'information', size, color);

export const passwordIcon = (size, color) =>
    generate(MaterialIcons, 'password', size, color);

export const checkIcon = (size, color) =>
    generate(EvilIcons, 'check', size, color);
