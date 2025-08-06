import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PassowordResetNew = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { reset_password_complete: resetUserPassword } = useAuth();

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      Alert.alert("Registration Failed", "Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match");
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
      const res = await resetUserPassword(password, confirmPassword,confirmPassword);

      if (res.success) {
        router.replace({
          pathname: "/(auth)/login",
        });
      } else {
        Alert.alert("Password Reset Failed", res.msg);
      }
    } catch (error) {
      Alert.alert(
        "Password Reset Failed",
        "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
            <BackButton iconSize={26} />

            {/* Header */}
            <View style={styles.header}>
              <Typo size={28} fontWeight={"800"} color={colors.text}>
                Create a new Password
              </Typo>
              <Typo size={15} color={colors.neutral400} style={styles.subtitle}>
                You will have to login again after resetting your password.
              </Typo>
            </View>

            

            {/* Form */}
            <View style={styles.form}>            

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
                    placeholder="New Password"
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

              {/* Confirm Password Input */}
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
                    placeholder="Confirm password"
                    placeholderTextColor={colors.neutral400}
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color={colors.neutral400}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Button
                loading={isLoading}
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Typo fontWeight={"600"} color={colors.white} size={16}>
                  Submit
                </Typo>
              </Button>
            </View>

          
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default PassowordResetNew;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacingY._20,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._10,
  },
  header: {
    marginTop: spacingY._20,
    marginBottom: spacingY._30,
  },
  subtitle: {
    marginTop: spacingY._5,
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
  submitButton: {
    marginTop: spacingY._8,
    borderRadius: 10,
    minHeight: verticalScale(48),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacingY._30,
  },
  footerText: {
    fontSize: 15,
    color: colors.text,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
