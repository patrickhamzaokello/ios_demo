import apiService from '@/utils/apiService';
import * as SecureStore from 'expo-secure-store';
import { UserType } from '@/types';

interface UserProfile extends UserType {
  bio?: string;
  date_joined?: string;
  is_verified?: boolean;
  followers_count?: number;
  following_count?: number;
}

interface UpdateProfileData {
  username?: string;
  full_name?: string;
  phone_number?: string;
  bio?: string;
}

export class UserService {
  
  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await apiService.get<UserProfile>('/auth/user/');
      
      if (response.success && response.data) {
        // Update local storage with fresh data
        await SecureStore.setItemAsync('userData', JSON.stringify(response.data));
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileData): Promise<UserProfile | null> {
    try {
      const response = await apiService.patch<UserProfile>('/auth/user/', data);
      
      if (response.success && response.data) {
        // Update local storage
        const currentUserData = await SecureStore.getItemAsync('userData');
        if (currentUserData) {
          const userData = JSON.parse(currentUserData);
          const updatedUserData = { ...userData, ...response.data };
          await SecureStore.setItemAsync('userData', JSON.stringify(updatedUserData));
        }
        
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user's playlists
   */
  static async getUserPlaylists(page = 1): Promise<any> {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      
      const response = await apiService.get(`/playlists/?user_id=${userId}&page=${page}`);
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      return null;
    }
  }

  /**
   * Get user's favorite tracks
   */
  static async getFavoriteTracks(page = 1): Promise<any> {
    try {
      const response = await apiService.get(`/favorites/tracks/?page=${page}`);
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching favorite tracks:', error);
      return null;
    }
  }

  /**
   * Add track to favorites
   */
  static async addToFavorites(trackId: string): Promise<boolean> {
    try {
      const response = await apiService.post('/favorites/tracks/', {
        track_id: trackId
      });
      
      return response.success;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  /**
   * Remove track from favorites
   */
  static async removeFromFavorites(trackId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/favorites/tracks/${trackId}/`);
      
      return response.success;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  /**
   * Follow user
   */
  static async followUser(userId: string): Promise<boolean> {
    try {
      const response = await apiService.post('/social/follow/', {
        user_id: userId
      });
      
      return response.success;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  /**
   * Unfollow user
   */
  static async unfollowUser(userId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/social/follow/${userId}/`);
      
      return response.success;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }

  /**
   * Get user's listening history
   */
  static async getListeningHistory(page = 1, limit = 20): Promise<any> {
    try {
      const response = await apiService.get(`/history/tracks/?page=${page}&limit=${limit}`);
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching listening history:', error);
      return null;
    }
  }

  /**
   * Add track to listening history
   */
  static async addToHistory(trackId: string, duration?: number): Promise<boolean> {
    try {
      const response = await apiService.post('/history/tracks/', {
        track_id: trackId,
        duration_listened: duration || 0,
        timestamp: new Date().toISOString()
      });
      
      return response.success;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  }

  /**
   * Upload profile picture
   */
  static async uploadProfilePicture(imageUri: string): Promise<string | null> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('profile_image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await apiService.post('/auth/upload-profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success && response.data?.image_url) {
        // Update local user data with new image URL
        const currentUserData = await SecureStore.getItemAsync('userData');
        if (currentUserData) {
          const userData = JSON.parse(currentUserData);
          userData.image = response.data.image_url;
          await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        }
        
        return response.data.image_url;
      }
      
      return null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  }
}

export default UserService;