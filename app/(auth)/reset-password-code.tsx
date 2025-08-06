import { Alert, Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import { Feather } from '@expo/vector-icons'

const EmailVerification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { verifyEmail, resendVerificationCode } = useAuth();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (value: string, index: number) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace to move to previous input
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      router.replace("/(auth)/set-new-password")
      // const res = await verifyEmail(email as string, verificationCode);
      
      // if (res.success) {
      //   Alert.alert("Success", "Email verified successfully!", [
      //     { text: "OK", onPress: () => router.replace("/(tabs)/(home)") }
      //   ]);
      // } else {
      //   Alert.alert("Verification Failed", res.msg || "Invalid verification code");
      // }
    } catch (error) {
      Alert.alert("Verification Failed", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const res = await resendVerificationCode(email as string);
      
      if (res.success) {
        Alert.alert("Code Sent", "A new verification code has been sent to your email");
        setCountdown(60);
        setCanResend(false);
        // Clear current code
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert("Failed to Resend", res.msg || "Could not resend verification code");
      }
    } catch (error) {
      Alert.alert("Failed to Resend", "An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
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
            
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <Feather name="mail" size={verticalScale(48)} color={colors.primary} />
              </View>
              
              <View style={styles.textContainer}>
                <Typo size={28} fontWeight={"800"} style={styles.title}>
                 Verify Password Reset Request
                </Typo>
                <Typo size={16} color={colors.text} style={styles.subtitle}>
                  We've sent a 6-digit verification code to
                </Typo>
                <Typo size={16} fontWeight={"600"} color={colors.primary}>
                  {maskEmail(email as string)}
                </Typo>
              </View>
            </View>

            {/* Verification Code Input */}
            <View style={styles.codeContainer}>
              <Typo size={16} color={colors.text} style={styles.codeLabel}>
                Enter verification code
              </Typo>
              
              <View style={styles.codeInputContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : {},
                    ]}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                ))}
              </View>
            </View>

            {/* Verify Button */}
            <Button 
              loading={isLoading} 
              onPress={handleVerify}
              style={styles.verifyButton}
            >
              <Typo fontWeight={"600"} color={colors.black} size={18}>
                Verify Email
              </Typo>
            </Button>

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Typo size={15} color={colors.text}>
                Didn't receive the code?
              </Typo>
              
              {canResend ? (
                <Pressable onPress={handleResendCode} disabled={isResending}>
                  <Typo 
                    size={15} 
                    fontWeight={"600"} 
                    color={isResending ? colors.neutral300 : colors.primary}
                    style={{ textDecorationLine: "underline" }}
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </Typo>
                </Pressable>
              ) : (
                <Typo size={15} color={colors.neutral300}>
                  Resend in {countdown}s
                </Typo>
              )}
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Typo size={14} color={colors.neutral300} style={styles.helpText}>
                Check your spam folder if you don't see the email in your inbox
              </Typo>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default EmailVerification

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacingY._20,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: spacingY._40,
    marginBottom: spacingY._40,
  },
  iconContainer: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(40),
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingY._20,
  },
  textContainer: {
    alignItems: 'center',
    gap: spacingY._8,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacingY._8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: verticalScale(22),
  },
  codeContainer: {
    marginBottom: spacingY._40,
  },
  codeLabel: {
    textAlign: 'center',
    marginBottom: spacingY._20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._10,
  },
  codeInput: {
    width: verticalScale(45),
    height: verticalScale(55),
    borderWidth: 2,
    borderColor: colors.neutral300,
    borderRadius: 12,
    fontSize: verticalScale(20),
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.matteBlack || '#FFFFFF',
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  verifyButton: {
    marginBottom: spacingY._30,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacingY._20,
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
  },
  helpText: {
    textAlign: 'center',
    lineHeight: verticalScale(20),
  },
})