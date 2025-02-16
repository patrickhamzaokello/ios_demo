import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import React, { useEffect } from "react"
import { CustomButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";

const Button = ({
    style, onPress, loading = false, children
}: CustomButtonProps) => {



    return (
        <TouchableOpacity
            onPress={!loading ? onPress : undefined}
            style={[styles.button, style, loading && styles.disabledButton]}
            disabled={loading}
        >
            {loading ? <ActivityIndicator size="small" color={colors.white} /> : children}
        </TouchableOpacity>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        height: verticalScale(52),
        justifyContent: 'center',
        alignItems: 'center'

    },
    disabledButton: {
        backgroundColor: colors.primaryDark,
    }
})