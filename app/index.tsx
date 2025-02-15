import { Image, StyleSheet, Text, View } from "react-native"
import React, { useEffect } from "react"
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";

const index = () => {

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/(auth)/welcome')
        }, 2000);
    }, [])

    return (
        <View style={sytles.container}>
            <Image style={sytles.logo} resizeMode="contain" source={require("../assets/images/splashImage.png")} />
        </View>
    )
}

export default index;

const sytles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: colors.neutral900
    },

    logo: {
        height: "10%",
        aspectRatio: 1,
    }
})