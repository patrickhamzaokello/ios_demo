// ImageCacheManager.js - Handle image caching and loading
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHash } from 'crypto';

const IMAGE_CACHE_DIRECTORY = 
  Platform.OS === 'ios' 
    ? `${RNFS.DocumentDirectoryPath}/image_cache` 
    : `${RNFS.ExternalDirectoryPath}/image_cache`;

const IMAGE_CACHE_INDEX_KEY = 'imageCacheIndex';
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB limit
const CACHE_EXPIRY_DAYS = 7;

// Create directory if it doesn't exist
const ensureCacheDirectoryExists = async () => {
  const exists = await RNFS.exists(IMAGE_CACHE_DIRECTORY);
  if (!exists) {
    await RNFS.mkdir(IMAGE_CACHE_DIRECTORY);
  }
};

// Generate a hash for the image URL
const generateImageHash = (url: string): string => {
  return createHash('md5').update(url).digest('hex');
};

// Get cached image index
const getCacheIndex = async () => {
  try {
    const indexString = await AsyncStorage.getItem(IMAGE_CACHE_INDEX_KEY);
    return indexString ? JSON.parse(indexString) : {};
  } catch (error) {
    console.error('Error getting cache index:', error);
    return {};
  }
};

// Update cached image index
interface CacheIndex {
  [key: string]: CacheEntry;
}

interface CacheEntry {
  url: string;
  filePath: string;
  cachedAt: string;
  size: number;
}

const updateCacheIndex = async (index: CacheIndex): Promise<void> => {
  try {
    await AsyncStorage.setItem(IMAGE_CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('Error updating cache index:', error);
  }
};

// Check if image is cached and not expired
const isImageCached = async (url: string): Promise<string | null> => {
  try {
    const hash: string = generateImageHash(url);
    const cacheIndex: CacheIndex = await getCacheIndex();
    
    if (!cacheIndex[hash]) return null;
    
    const cachedInfo: CacheEntry = cacheIndex[hash];
    const now: number = new Date().getTime();
    const cacheTime: number = new Date(cachedInfo.cachedAt).getTime();
    const expiryTime: number = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    // Check if cache is expired
    if (now - cacheTime > expiryTime) {
      // Remove expired cache entry
      delete cacheIndex[hash];
      await updateCacheIndex(cacheIndex);
      
      // Delete the file
      const filePath: string = `${IMAGE_CACHE_DIRECTORY}/${hash}`;
      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath);
      }
      
      return null;
    }
    
    // Check if file still exists
    const filePath: string = `${IMAGE_CACHE_DIRECTORY}/${hash}`;
    const fileExists: boolean = await RNFS.exists(filePath);
    
    if (!fileExists) {
      // File was deleted, remove from index
      delete cacheIndex[hash];
      await updateCacheIndex(cacheIndex);
      return null;
    }
    
    return `file://${filePath}`;
  } catch (error) {
    console.error('Error checking image cache:', error);
    return null;
  }
};

// Download and cache image
const downloadAndCacheImage = async  (url: string): Promise<string | null>  => {
  try {
    await ensureCacheDirectoryExists();
    
    const hash = generateImageHash(url);
    const filePath = `${IMAGE_CACHE_DIRECTORY}/${hash}`;
    
    // Download the image
    const downloadResult = await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true,
      discretionary: true,
    }).promise;
    
    if (downloadResult.statusCode === 200) {
      // Update cache index
      const cacheIndex = await getCacheIndex();
      cacheIndex[hash] = {
        url: url,
        filePath: filePath,
        cachedAt: new Date().toISOString(),
        size: downloadResult.bytesWritten || 0,
      };
      
      await updateCacheIndex(cacheIndex);
      
      // Clean up cache if it's getting too large
      await cleanupCache();
      
      return `file://${filePath}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error downloading and caching image:', error);
    return null;
  }
};

// Clean up old cache files to stay within size limit
const cleanupCache = async () => {
  try {
    const cacheIndex = await getCacheIndex();
    const entries = Object.values(cacheIndex) as CacheEntry[];
    
    // Calculate total cache size
    const totalSize = entries.reduce((sum: number, entry) => sum + (entry.size || 0), 0);
    
    if (totalSize > MAX_CACHE_SIZE) {
      // Sort by cache time (oldest first)
      entries.sort((a, b) => 
        new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime()
      );
      
      let currentSize = totalSize;
      let index = 0;
      
      // Remove oldest files until we're under the limit
      while (currentSize > MAX_CACHE_SIZE * 0.8 && index < entries.length) {
        const entry = entries[index];
        const hash = generateImageHash(entry.url);
        
        // Delete file
        if (await RNFS.exists(entry.filePath)) {
          await RNFS.unlink(entry.filePath);
        }
        
        // Remove from index
        delete cacheIndex[hash];
        currentSize -= entry.size || 0;
        index++;
      }
      
      await updateCacheIndex(cacheIndex);
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
};

// Main function to get cached image or download if needed
export const getCachedImage = async  (url: string): Promise<string | null>  => {
  if (!url) return null;
  
  try {
    // First check if we have it cached
    const cachedPath = await isImageCached(url);
    if (cachedPath) {
      return cachedPath;
    }
    
    // If not cached, download and cache it
    return await downloadAndCacheImage(url);
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null; // Return null to fall back to original URL
  }
};

// Get cache statistics
export const getCacheStats = async () => {
  try {
    const cacheIndex = await getCacheIndex();
    const entries = Object.values(cacheIndex) as CacheEntry[];
    
    const totalSize = entries.reduce((sum, entry) => sum + (entry.size || 0), 0);
    const totalFiles = entries.length;
    
    return {
      totalSize,
      totalFiles,
      formattedSize: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalSize: 0, totalFiles: 0, formattedSize: '0 MB' };
  }
};

// Clear all cached images
export const clearImageCache = async () => {
  try {
    // Delete all files in cache directory
    if (await RNFS.exists(IMAGE_CACHE_DIRECTORY)) {
      await RNFS.unlink(IMAGE_CACHE_DIRECTORY);
    }
    
    // Clear cache index
    await AsyncStorage.removeItem(IMAGE_CACHE_INDEX_KEY);
    
    // Recreate directory
    await ensureCacheDirectoryExists();
    
    return true;
  } catch (error) {
    console.error('Error clearing image cache:', error);
    return false;
  }
};