import { Alert, Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/input'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { generateUsername } from '@/utils/usernameGenerator'
import { useAuth } from '@/contexts/authContext'
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons'

const Register = () => {

  const emailRef = useRef("");
  const user_nameRef = useRef("");
  const passWordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return password.length >= minLength;
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && !/\s/.test(username);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      // Implement Google sign up logic here
      // const result = await GoogleSignin.signIn();
      console.log('Google sign up pressed');
      Alert.alert("Coming Soon", "Google sign up will be available soon!");
    } catch (error) {
      Alert.alert("Google Sign Up Failed", "An error occurred. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      // Implement Apple sign up logic here
      // const result = await AppleAuthentication.signInAsync();
      console.log('Apple sign up pressed');
      Alert.alert("Coming Soon", "Apple sign up will be available soon!");
    } catch (error) {
      Alert.alert("Apple Sign Up Failed", "An error occurred. Please try again.");
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSubmit = async () => {

    const user_name = user_nameRef.current;
    const user_email = emailRef.current;
    const user_password = passWordRef.current;
    const confirm_password = confirmPasswordRef.current;

    if (!user_name || !user_email || !user_password || !confirm_password) {
      Alert.alert("Registration Failed", "Please fill all the fields");
      return;
    }

    // Username validation
    if (!validateUsername(user_name)) {
      Alert.alert("Registration Failed", "Username must be at least 3 characters long and contain no spaces");
      return;
    }

    // Password match validation
    if (user_password !== confirm_password) {
      Alert.alert("Registration Failed", "Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      Alert.alert("Registration Failed", "Please enter a valid email address");
      return;
    }

    //Validate Password
    if (!validatePassword(user_password)) {
      Alert.alert("Registration Failed", "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser(user_email, user_password, user_name);

      if (!res.success) {
        Alert.alert("Registration Failed", res.msg);
      }
    } catch (error) {
      Alert.alert("Registration Failed", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <BackButton iconSize={28} />
            <View style={{ gap: 5, marginTop: spacingY._20 }}>
              <Typo size={30} fontWeight={"800"}>Let's,</Typo>
              <Typo size={30} fontWeight={"800"}>Get Started,</Typo>
            </View>

            {/* form */}
            <View style={styles.form}>
              <Typo size={16} color={colors.text}>Create a new Mwonya account</Typo>

              {/* Social Sign Up Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Pressable 
                  style={[styles.socialButton, isGoogleLoading && styles.socialButtonDisabled]}
                  onPress={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                >
                  <View style={styles.socialButtonContent}>
                    {isGoogleLoading ? (
                      <Text style={styles.socialButtonText}>Loading...</Text>
                    ) : (
                      <>
                        <AntDesign name='google' size={verticalScale(20)} color={colors.text} />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                      </>
                    )}
                  </View>
                </Pressable>

                <Pressable 
                  style={[styles.socialButton, isAppleLoading && styles.socialButtonDisabled]}
                  onPress={handleAppleSignUp}
                  disabled={isAppleLoading}
                >
                  <View style={styles.socialButtonContent}>
                    {isAppleLoading ? (
                      <Text style={styles.socialButtonText}>Loading...</Text>
                    ) : (
                      <>
                        <AntDesign name='apple1' size={verticalScale(20)} color={colors.text} />
                        <Text style={styles.socialButtonText}>Continue with Apple</Text>
                      </>
                    )}
                  </View>
                </Pressable>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Typo size={14} color={colors.neutral300}>OR</Typo>
                <View style={styles.dividerLine} />
              </View>

              {/* Input Fields */}
              <Input
                placeholder='Enter your username'
                inputMode='text'
                enterKeyHint='next'
                onChangeText={(value) => (user_nameRef.current = value)}
                icon={<AntDesign name='user' size={verticalScale(26)} color={colors.neutral300} />}
              />

              <Input
                placeholder='Enter your email'
                inputMode='email'
                enterKeyHint='next'
                onChangeText={(value) => (emailRef.current = value)}
                icon={<Feather name='mail' size={verticalScale(26)} color={colors.neutral300} />}
              />

              <Input
                placeholder='Enter your password'
                secureTextEntry
                enterKeyHint='next'
                onChangeText={(value) => (passWordRef.current = value)}
                icon={<Feather name='lock' size={verticalScale(26)} color={colors.neutral300} />}
              />

              <Input
                placeholder='Confirm your password'
                secureTextEntry
                enterKeyHint='done'
                onChangeText={(value) => (confirmPasswordRef.current = value)}
                icon={<Feather name='lock' size={verticalScale(26)} color={colors.neutral300} />}
              />

              <Button loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight={"400"} color={colors.black} size={21}>
                  Create Account
                </Typo>
              </Button>
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Typo size={15}>Already have an account?</Typo>
              <Pressable onPress={() => router.navigate("/(auth)/login")}>
                <Typo size={15} fontWeight={"700"} color={colors.primary} style={{ textDecorationLine: "underline" }}>
                  Sign in
                </Typo>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacingY._20,
  },
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text
  },
  form: {
    gap: spacingY._20
  },
  socialButtonsContainer: {
    gap: spacingY._10
  },
  socialButton: {
    backgroundColor: colors.primary || '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._10,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialButtonText: {
    fontSize: verticalScale(16),
    fontWeight: '500',
    color: colors.text,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: spacingY._10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral300,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15)
  }
})