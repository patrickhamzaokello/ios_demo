import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

interface Props {
  data: {
    heading: string;
    subheading?: string;
    profileImageUrl?: string;
    notificationsCount?: number;
  };
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
}

const { width } = Dimensions.get('window');

export function HeroSection({ data, onProfilePress, onNotificationsPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={onProfilePress} style={styles.profileContainer}>
        <Image
          source={{ uri: data.profileImageUrl }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Heading and Subheading */}
      <View style={styles.textContainer}>
        <Text style={styles.heading} numberOfLines={1}>
          {data.heading}
        </Text>
        {data.subheading && (
          <Text style={styles.subheading} numberOfLines={1}>
            {data.subheading}
          </Text>
        )}
      </View>

      {/* Notifications Icon */}
      <TouchableOpacity onPress={onNotificationsPress} style={styles.notificationsContainer}>
        <Feather name="bell" size={24} color="white" />
        {data.notificationsCount && data.notificationsCount > 0 && (
          <View style={styles.notificationsBadge}>
            <Text style={styles.notificationsCount}>{data.notificationsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1d1d1d',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#666'
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subheading: {
    fontSize: 14,
    color: 'gray',
  },
  notificationsContainer: {
    position: 'relative',
  },
  notificationsBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});