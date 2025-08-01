import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

const Login = () => {
  const emailRef = useRef("");
  const passWordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { login: loginUser, login_with_google } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        if (idToken) {
          const res = await login_with_google(idToken);
          if (res.success) {
            Alert.alert("Login Successful", res.msg);
          } else {
            Alert.alert("Login Failed", res.msg);
          }
        } else {
          Alert.alert("Google Sign-In Failed", "ID Token is missing.");
        }
      } else {
        Alert.alert("Google Sign-In Failed", "Please try again.");
      }
      setIsSubmitting(false);
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.error("Google Sign-In Error:", error);
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert(
              "Google Sign-In Cancelled",
              "You cancelled the sign-in process."
            );
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert(
              "Google Sign-In In Progress",
              "Sign-in is already in progress."
            );
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              "Google Sign-In Error",
              "Google Play Services are not available on this device."
            );
            break;

          default:
            Alert.alert("Google Sign-In Error", error.code);

            break;
        }
      } else {
        // an error not related to google sign in
        Alert.alert(
          "Sign-In Error",
          "An unexpected error occurred. Please try again."
        );
      }
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const email = emailRef.current;
    const password = passWordRef.current;

    if (!email || !password) {
      Alert.alert("Login Failed", "Please fill all the fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Login Failed", "Please enter a valid email address");
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

  return (
    <ScreenWrapper>
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

          {/* input */}
          <Input
            placeholder="Enter your email"
            inputMode="email"
            enterKeyHint="done"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <AntDesign
                name="user"
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Input
            placeholder="Enter your password"
            secureTextEntry
            enterKeyHint="done"
            onChangeText={(value) => (passWordRef.current = value)}
            icon={
              <Feather
                name="lock"
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Pressable onPress={() => router.navigate("/(auth)/reset-password")}>
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

          {/* Google Sign In Button */}
          <Button
            loading={isSubmitting}
            onPress={handleGoogleSignIn}
            style={styles.social_button}
          >
            <Image
              source={require("@/assets/images/google.png")}
              style={{ width: 30, height: 30 }}
            />

            {!isSubmitting && (
              <Typo fontWeight={"400"} color={colors.black} size={21}>
                Login with Google
              </Typo>
            )}

            {isSubmitting && (
              <Typo fontWeight={"400"} color={colors.black} size={21}>
                Login with Google
              </Typo>
            )}
          </Button>

{/* apple sign in  */}

<AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={17}
        style={styles.apple_special_button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            console.log("Apple Sign-In Credential:", credential);
            // signed in
          } catch (e) {
            if ((e as { code: string }).code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
{/* apple sign in */}


        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
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
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  social_button:{
    backgroundColor: colors.neutral100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacingX._10,
  },
  apple_special_button: {
    height: verticalScale(52),
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: "400",
    fontSize: 21
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
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
