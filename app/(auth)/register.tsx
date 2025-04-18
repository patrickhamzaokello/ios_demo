import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
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
import { api_register } from '@/api/authService'
import { useAuth } from '@/contexts/authContext'
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons'

const Register = () => {

  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const user_nameRef = useRef(generateUsername());
  const user_phoneRef = useRef("");
  const passWordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false)

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


  const handleSubmit = async () => {

    const user_fullName = fullNameRef.current;
    const user_name = user_nameRef.current;
    const user_phone = user_phoneRef.current;
    const user_email = emailRef.current;
    const user_password = passWordRef.current;

    if (!user_fullName || !user_phone || !user_name || !user_email || !user_password) {
      Alert.alert("Registeration Failed", "Please fill all the fields");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      Alert.alert("Registeration Failed", "Please enter a valid email address");
      return;
    }


    //Phone validation
    const phoneRegex = /^(?:\+256|0)?7\d{8}$/; // Validates Ugandan phone numbers
    if (!phoneRegex.test(user_phone)) {
      Alert.alert("Registration Failed", "Please enter a valid Ugandan phone number");
      return;
    }

    //Validate Password
    if (!validatePassword(user_password)) {
      Alert.alert("Registration Failed", "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }



    setIsLoading(true);
    try {
      const res = await registerUser(user_email, user_password, user_phone, user_fullName, user_name);

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
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>Let's,</Typo>
          <Typo size={30} fontWeight={"800"}>Get Started,</Typo>
        </View>

        {/* form */}

        <View style={styles.form}>
          <Typo size={16} color={colors.text}>Create a new Mwonya account</Typo>

          {/* input */}
          <Input
            placeholder='Enter your Full name'
            inputMode='text'
            enterKeyHint='next'
            onChangeText={(value) => (fullNameRef.current = value)}
            icon={<AntDesign name='user' size={verticalScale(26)} color={colors.neutral300} />}
          />

          <Input
            placeholder="Enter your phone number"
            inputMode="numeric"
            enterKeyHint='next'
            onChangeText={(value) => (user_phoneRef.current = value)}
            icon={<SimpleLineIcons name='phone' size={verticalScale(26)} color={colors.neutral300} />}
          />

          <Input
            placeholder='Enter your email'
            inputMode='email'
            enterKeyHint='done'
            onChangeText={(value) => (emailRef.current = value)}
            icon={<Feather name='mail' size={verticalScale(26)} color={colors.neutral300} />}

          />

          <Input
            placeholder='Enter your password'
            secureTextEntry
            enterKeyHint='done'
            onChangeText={(value) => (passWordRef.current = value)}
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
          <Pressable onPress={() => router.navigate("/(auth)/login")}><Typo size={15} fontWeight={"700"} color={colors.primary} style={{ textDecorationLine: "underline" }}>Sign in</Typo></Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Register

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
