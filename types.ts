import { Firestore, Timestamp } from "firebase/firestore";
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";

import { ActivityIndicator, ActivityIndicatorProps, ImageStyle, PressableProps, TextInput, TextInputProps, TextProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";

export type ScreenWrapperProps = {
     style?: ViewStyle;
     children: React.ReactNode;
}

export type ModelWrapperProps = {
     style?: ViewStyle;
     children: React.ReactNode;
     bg?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
     style?: ViewStyle,
     onPress?: () => void;
     loading?: boolean;
     children: React.ReactNode;
}

export type TypoProps ={
     size?: number,
     color?: string,
     fontWeight?: TextStyle["fontWeight"];
     children: any | null;
     style?: TextStyle;
     textProps?: TextProps;
}

export type accountOptionType = {
     title: string;
     icon: React.ReactNode;
     bgColor: string;
     routeName?: any;
}