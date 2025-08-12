import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Input from "@/components/input";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { AntDesign, Feather } from "@expo/vector-icons";
const ResetPassword = () => {
 const [formData, setFormData] = useState({
     email: "",
     password: "",
   });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { forgotPassword } = useAuth();

  const handleSubmit = async () => {
   const { email } = formData;
   
       if (!email) {
         Alert.alert("Password Reset failed", "Please provide an email address");
         return;
       }
   
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
         Alert.alert("Registration Failed", "Please enter a valid email address");
         return;
       }

    setIsLoading(true);
    try {

      router.push({
        pathname: "/(auth)/reset-password-code",
        params: { email }
      });

      // const res = await forgotPassword(email);

      // if (!res.success) {
      //   Alert.alert("Reset Password Failed", res.msg);
      // } else {
      //   Alert.alert(
      //     "Reset Password",
      //     "Please check your email for a password reset code."
      //   );
      //   router.push({
      //     pathname: "/(auth)/reset-password-code",
      //     params: { email }
      //   });
      // }
    } catch (error) {
      Alert.alert(
        "Reset Password Failed",
        "An error occurred. Please try again."
      );
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
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.container}>
            <BackButton iconSize={28} />
            <View style={{ gap: 5, marginTop: spacingY._20 }}>
              <Typo size={30} fontWeight={"800"}>
                Reset,
              </Typo>
              <Typo size={30} fontWeight={"800"}>
                Password,
              </Typo>
            </View>

            {/* form */}

            <View style={styles.form}>
              <Typo size={16} color={colors.text}>
                Please enter your email to reset your password
              </Typo>

              {/* input */}
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

              <Button loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight={"400"} color={colors.black} size={21}>
                  Reset Password
                </Typo>
              </Button>
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Typo size={15}>Remembered your password?</Typo>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Typo
                  size={15}
                  fontWeight={"700"}
                  color={colors.primary}
                  style={{ textDecorationLine: "underline" }}
                >
                  Sign in
                </Typo>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
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
    flexDirection: 'row',
    alignItems: 'center',
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
