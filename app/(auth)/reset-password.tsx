import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const ResetPassword = () => {

  const emailRef = useRef("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();

  const { forgotPassword } = useAuth();

  const handleSubmit = async () => {

    const email = emailRef.current;

    if (!email) {
      Alert.alert("Reset Password Failed", "Please fill all the fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Reset Password Failed", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email);

      if (!res.success) {
        Alert.alert("Reset Password Failed", res.msg);
      } else {
        Alert.alert("Reset Password", "Please check your email for a password reset link.");
        router.back();
      }
    } catch (error) {
      Alert.alert("Reset Password Failed", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }


  };



  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>Reset,</Typo>
          <Typo size={30} fontWeight={"800"}>Password,</Typo>
        </View>

        {/* form */}

        <View style={styles.form}>
          <Typo size={16} color={colors.text}>Please enter your email to reset your password</Typo>

          {/* input */}
          <Input
            placeholder='Enter your email'
            inputMode='email'
            enterKeyHint='done'
            onChangeText={(value) => (emailRef.current = value)}
            icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' />}

          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"400"} color={colors.black} size={21}>
              Reset Password
            </Typo>

          </Button>

        </View>

        {/* footer */}
        <View style={styles.footer}>


          <Typo size={15}>Remembered your password?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}><Typo size={15} fontWeight={"700"} color={colors.primary} style={{ textDecorationLine: "underline" }}>Sign in</Typo></Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
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
