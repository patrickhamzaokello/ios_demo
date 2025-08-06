import { Alert, Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import { AntDesign, Feather } from '@expo/vector-icons'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && !/\s/.test(username);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      router.replace("/(auth)/social-auth");
    } catch (error) {
      Alert.alert("Google Sign Up Failed", "An error occurred. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      router.replace("/(auth)/social-auth");
    } catch (error) {
      Alert.alert("Apple Sign Up Failed", "An error occurred. Please try again.");
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Registration Failed", "Please fill all the fields");
      return;
    }

    if (!validateUsername(username)) {
      Alert.alert("Registration Failed", "Username must be at least 3 characters long and contain no spaces");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Registration Failed", "Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Registration Failed", "Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser(email, password, username);

      if (res.success) {
        router.push({
          pathname: "/(auth)/verify_email",
          params: { email }
        });
      } else {
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
            <BackButton iconSize={26} />
            
            {/* Header */}
            <View style={styles.header}>
              <Typo size={28} fontWeight={"800"} color={colors.text}>
                Create Account
              </Typo>
              <Typo size={15} color={colors.neutral400} style={styles.subtitle}>
                Join Mwonya today
              </Typo>
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <Pressable 
                style={[styles.socialButton, isGoogleLoading && styles.socialButtonDisabled]}
                onPress={handleGoogleSignUp}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Text style={styles.socialButtonText}>Loading...</Text>
                ) : (
                  <>
                    <AntDesign name='google' size={18} color={colors.text} />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </>
                )}
              </Pressable>

              <Pressable 
                style={[styles.socialButton, isAppleLoading && styles.socialButtonDisabled]}
                onPress={handleAppleSignUp}
                disabled={isAppleLoading}
              >
                {isAppleLoading ? (
                  <Text style={styles.socialButtonText}>Loading...</Text>
                ) : (
                  <>
                    <AntDesign name='apple1' size={18} color={colors.text} />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <AntDesign name='user' size={20} color={colors.neutral400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor={colors.neutral400}
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather name='mail' size={20} color={colors.neutral400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email address"
                    placeholderTextColor={colors.neutral400}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather name='lock' size={20} color={colors.neutral400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={colors.neutral400}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather 
                      name={showPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color={colors.neutral400} 
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather name='lock' size={20} color={colors.neutral400} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm password"
                    placeholderTextColor={colors.neutral400}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Pressable 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather 
                      name={showConfirmPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color={colors.neutral400} 
                    />
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Button loading={isLoading} onPress={handleSubmit} style={styles.submitButton}>
                <Typo fontWeight={"600"} color={colors.white} size={16}>
                  Create Account
                </Typo>
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => router.navigate("/(auth)/login")}>
                <Text style={styles.footerLink}>Sign in</Text>
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
    flexDirection: 'row',
    gap: spacingX._12,
    marginBottom: spacingY._25,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
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
  submitButton: {
    marginTop: spacingY._8,
    borderRadius: 10,
    minHeight: verticalScale(48),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacingY._30,
  },
  footerText: {
    fontSize: 15,
    color: colors.text,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
})