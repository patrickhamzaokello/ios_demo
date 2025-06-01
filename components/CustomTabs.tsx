import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Typo from './Typo';
import Octicons from '@expo/vector-icons/Octicons';


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {

    const tabbarIcons: any = {
        '(home)': (isFocused: boolean) => (
            <>
                <Octicons name='home' size={verticalScale(26)} color={isFocused ? colors.primary : colors.neutral400} />

                <Typo size={10} color={isFocused ? colors.primary : colors.neutral400}>Home</Typo>
            </>
        ),
        '(search)': (isFocused: boolean) => (
            <>
                <Octicons name='search' size={verticalScale(26)} color={isFocused ? colors.primary : colors.neutral400} />

                <Typo size={10} color={isFocused ? colors.primary : colors.neutral400}>Search</Typo>
            </>
        ),
        '(library)': (isFocused: boolean) => (
            <>

                <Octicons name='apps' size={verticalScale(26)} color={isFocused ? colors.primary : colors.neutral400} />

                <Typo size={10} color={isFocused ? colors.primary : colors.neutral400}>Library</Typo>
            </>
        ),
        '(profile)': (isFocused: boolean) => (
            <>

                <Octicons name='person' size={verticalScale(26)} color={isFocused ? colors.primary : colors.neutral400} />

                <Typo size={10} color={isFocused ? colors.primary : colors.neutral400}>Profile</Typo>
            </>
        )
    };

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label: any =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };



                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                    >
                        {
                            tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.neutral900,
        justifyContent: "space-around",
        alignItems: "center",
        borderTopColor: colors.neutral800,
        borderTopWidth: 1,
        paddingBottom: Platform.OS == 'ios' ? verticalScale(30) : verticalScale(25),
        paddingTop:10,

    },

    tabbarItem: {
        marginBottom: Platform.OS == 'ios' ? spacingY._10 : spacingY._5,
        justifyContent: 'center',
        alignItems: 'center'
    },
})