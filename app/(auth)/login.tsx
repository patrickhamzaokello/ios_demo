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
import { api_login } from '@/api/authService';

const Login = () => {

  const emailRef = useRef("")
  const passWordRef = useRef("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();


  const handleSubmit = async () => {
    if (!emailRef.current || !passWordRef.current) {
      Alert.alert("Login Failed", "Please fill all the fields");
      return;
    }

    const email = emailRef.current;
    const password = passWordRef.current;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Login Failed", "Please enter a valid email address");
      return;
    }

    // Simulate password authentication
    setIsLoading(true);
    try {
      // Replace this with your actual authentication logic
      const response = await api_login(email, password);
      if (!response.error) {
        console.log("Login successful");
        // Navigate to the next screen or perform other actions
      } else {
        Alert.alert("Login Failed", response.message);
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
          <Typo size={30} fontWeight={"800"}>Hey,</Typo>
          <Typo size={30} fontWeight={"800"}>Welcome Back,</Typo>
        </View>

        {/* form */}

        <View style={styles.form}>
          <Typo size={16} color={colors.text}>Login now to track all your expenses</Typo>

          {/* input */}
          <Input
            placeholder='Enter your email'
            inputMode='email'
              enterKeyHint='done'
            onChangeText={(value) => (emailRef.current = value)}
            icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' />}

          />

          <Input
            placeholder='Enter your password'
            secureTextEntry
            enterKeyHint='done'
            onChangeText={(value) => (passWordRef.current = value)}
            icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight='fill' />}

          />


          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>Forgot password?</Typo>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"400"} color={colors.black} size={21}>
              Login
            </Typo>

          </Button>

        </View>

        {/* footer */}
        <View style={styles.footer}>


          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.push("/(auth)/register")}><Typo size={15} fontWeight={"700"} color={colors.primary} style={{ textDecorationLine: "underline" }}>Sign up now</Typo></Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Login

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
