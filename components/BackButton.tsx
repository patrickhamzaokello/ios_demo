import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import { verticalScale } from '@/utils/styling'
import { colors, radius } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'

const BackButton = ({
    style, iconSize = 26
}: BackButtonProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
           <Ionicons name="chevron-back" size={verticalScale(iconSize)} color={colors.white} weight="bold" />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    }
})