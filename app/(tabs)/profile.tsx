import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ScreenWrapper'

const Profile = () => {

    // const {user} = useAuth();
    const handlelogout = async () => {
        await signOut(auth)
    }
    return (
        <ScreenWrapper>
            <Typo>Home</Typo>
            

            <Button onPress={handlelogout}>
                <Typo color={colors.black}>Logout</Typo>
            </Button>
        </ScreenWrapper>
    )
}

export default Profile

const styles = StyleSheet.create({})

