import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY, radius, fontSize, fontWeight, shadow } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Ionicons } from '@expo/vector-icons' // Assuming you're using Expo

const Profile = () => {
    const { user,logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const profileMenuItems = [
        {
            id: 'edit',
            title: 'Edit Profile',
            icon: 'person-outline',
            onPress: () => console.log('Edit Profile')
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
            onPress: () => console.log('Settings')
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: 'notifications-outline',
            onPress: () => console.log('Notifications')
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            icon: 'shield-outline',
            onPress: () => console.log('Privacy')
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: 'help-circle-outline',
            onPress: () => console.log('Help')
        },
        {
            id: 'about',
            title: 'About',
            icon: 'information-circle-outline',
            onPress: () => console.log('About')
        }
    ]

    const MenuItem = ({ item }) => (
        <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Typo style={styles.menuItemText}>{item.title}</Typo>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textLighter} />
        </TouchableOpacity>
    )

    return (
        <ScreenWrapper>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Typo style={styles.headerTitle}>Profile</Typo>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {user?.photoURL ? (
                                <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons name="person" size={40} color={colors.textLighter} />
                            )}
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={14} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.userInfo}>
                        <Typo style={styles.userName}>
                            {user?.displayName || 'User Name'}
                        </Typo>
                        <Typo style={styles.userEmail}>
                            {user?.email || 'user@example.com'}
                        </Typo>
                    </View>

                    <TouchableOpacity style={styles.editProfileButton}>
                        <Typo style={styles.editProfileText}>Edit Profile</Typo>
                    </TouchableOpacity>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Typo style={styles.statNumber}>24</Typo>
                        <Typo style={styles.statLabel}>Posts</Typo>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Typo style={styles.statNumber}>156</Typo>
                        <Typo style={styles.statLabel}>Following</Typo>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Typo style={styles.statNumber}>892</Typo>
                        <Typo style={styles.statLabel}>Followers</Typo>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {profileMenuItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </View>

                {/* Logout Button */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={colors.error} />
                        <Typo style={styles.logoutText}>Logout</Typo>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.matteBlack,
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        paddingBottom: spacingY._15,
    },
    headerTitle: {
        fontSize: fontSize.headline,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    profileCard: {
        backgroundColor: colors.surface,
        marginHorizontal: spacingX._20,
        borderRadius: radius._16,
        padding: spacingX._20,
        alignItems: 'center',
        ...shadow.md,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacingY._15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.neutral800,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.primary,
    },
    avatarImage: {
        width: 74,
        height: 74,
        borderRadius: 37,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.matteBlack,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: spacingY._20,
    },
    userName: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.semibold,
        color: colors.text,
        marginBottom: spacingY._4,
    },
    userEmail: {
        fontSize: fontSize.md,
        color: colors.textLighter,
    },
    editProfileButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacingX._30,
        paddingVertical: spacingY._10,
        borderRadius: radius._12,
    },
    editProfileText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.white,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        marginHorizontal: spacingX._20,
        marginTop: spacingY._15,
        borderRadius: radius._16,
        padding: spacingX._20,
        alignItems: 'center',
        justifyContent: 'space-around',
        ...shadow.sm,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacingY._2,
    },
    statLabel: {
        fontSize: fontSize.sm,
        color: colors.textLighter,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.border,
    },
    menuContainer: {
        backgroundColor: colors.surface,
        marginHorizontal: spacingX._20,
        marginTop: spacingY._15,
        borderRadius: radius._16,
        ...shadow.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: radius._10,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacingX._15,
    },
    menuItemText: {
        fontSize: fontSize.md,
        color: colors.text,
        fontWeight: fontWeight.medium,
    },
    logoutContainer: {
        marginHorizontal: spacingX._20,
        marginTop: spacingY._25,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius._12,
        paddingVertical: spacingY._15,
        borderWidth: 1,
        borderColor: colors.error,
    },
    logoutText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.error,
        marginLeft: spacingX._8,
    },
    bottomSpacing: {
        height: spacingY._30,
    },
})