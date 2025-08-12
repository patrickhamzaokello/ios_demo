import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { AntDesign, Feather } from "@expo/vector-icons";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { login: loginUser } = useAuth();

  // Reset loading states when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Login screen focused - resetting loading states');
      setIsGoogleLoading(false);
      setIsAppleLoading(false);
      setIsLoading(false);
    }, [])
  );

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      router.replace("/(auth)/social-auth");
    } catch (error) {
      Alert.alert(
        "Google Sign Up Failed",
        "An error occurred. Please try again."
      );
      setIsGoogleLoading(false);
    }
  };
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };
  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      router.replace("/(auth)/social-auth");
    } catch (error) {
      Alert.alert(
        "Apple Sign Up Failed",
        "An error occurred. Please try again."
      );
      setIsAppleLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('Login submit pressed', { formData, isLoading });
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert("Login Failed", "Please fill all the fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Registration Failed", "Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Registration Failed",
        "Password must be at least 8 characters long"
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(email, password);

      if (!res.success) {
        Alert.alert("Login Failed", res.msg);
      }
    } catch (error) {
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <BackButton iconSize={28} />
            <View style={{ gap: 5, marginTop: spacingY._20 }}>
              <Typo size={30} fontWeight={"800"}>
                Hey,
              </Typo>
              <Typo size={30} fontWeight={"800"}>
                Welcome Back,
              </Typo>
            </View>

            {/* form */}

            <View style={styles.form}>
              <Typo size={16} color={colors.text}>
                Login now into your mwonya account
              </Typo>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <Pressable
                  style={[
                    styles.socialButton,
                    isGoogleLoading && styles.socialButtonDisabled,
                  ]}
                  onPress={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Typo style={styles.socialButtonText}>Loading...</Typo>
                  ) : (
                    <>
                      <AntDesign name="google" size={18} color={colors.text} />
                      <Typo style={styles.socialButtonText}>Google</Typo>
                    </>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.socialButton,
                    isAppleLoading && styles.socialButtonDisabled,
                  ]}
                  onPress={handleAppleSignUp}
                  disabled={isAppleLoading}
                >
                  {isAppleLoading ? (
                    <Typo style={styles.socialButtonText}>Loading...</Typo>
                  ) : (
                    <>
                      <AntDesign name="apple1" size={18} color={colors.text} />
                      <Typo style={styles.socialButtonText}>Apple</Typo>
                    </>
                  )}
                </Pressable>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Typo style={styles.dividerText}>or</Typo>
                <View style={styles.dividerLine} />
              </View>

              {/* input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="mail"
                    size={20}
                    color={colors.neutral400}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email address"
                    placeholderTextColor={colors.neutral400}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={20}
                    color={colors.neutral400}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={colors.neutral400}
                    value={formData.password}
                    onChangeText={(value) =>
                      handleInputChange("password", value)
                    }
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color={colors.neutral400}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() => router.push("/(auth)/reset-password")}
              >
                <Typo
                  size={14}
                  color={colors.text}
                  style={{ alignSelf: "flex-end" }}
                >
                  Forgot password?
                </Typo>
              </Pressable>

              <Button loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight={"400"} color={colors.black} size={21}>
                  Login
                </Typo>
              </Button>
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Typo size={15}>Don't have an account?</Typo>
              <Pressable onPress={() => router.replace("/(auth)/register")}>
                <Typo
                  size={15}
                  fontWeight={"700"}
                  color={colors.primary}
                  style={{ textDecorationLine: "underline" }}
                >
                  Sign up now
                </Typo>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacingY._20,
  },
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  socialContainer: {
    flexDirection: "row",
    gap: spacingX._12,
    marginBottom: spacingY._25,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.matteBlack,
    borderRadius: 10,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral300,
  },
  dividerText: {
    fontSize: 14,
    color: colors.neutral400,
    paddingHorizontal: spacingX._16,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._16,
  },
  inputContainer: {
    marginBottom: spacingY._4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._2,
    minHeight: verticalScale(48),
  },
  inputIcon: {
    marginRight: spacingX._12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacingY._12,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
