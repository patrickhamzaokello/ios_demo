import React from "react";

import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type ModelWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type UserType = {
  uid?: string;
  phone_number?: string | null;
  email?: string | null;
  full_name?: string | null;
  user_name?: string | null;
  image?: any;
} | null;

export type AuthContextType = {
  user: UserType;
  setUser: Function;
  login_with_google_apple: (
    auth_token: string,
    provider: "google" | "apple"
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData(userId: string): Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<{ success: boolean; msg?: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    phone: string,
    name: string,
    user_name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; msg?: string }>;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export interface LoginResponse {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  signUpDate: string;
  profilePic: string;
  status: string;
  mwRole: string;
  error: boolean;
  message: string;
}
