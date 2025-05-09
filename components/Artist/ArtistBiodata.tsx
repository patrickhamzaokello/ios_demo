// Optimized Artist Bio Footer
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ArtistBioFooter = ({ bioData, artist }: {bioData:any, artist: any}) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>{bioData.heading || "About"}</Text>
      </View>
      
      {/* Main bio content */}
      <View style={styles.bioContainer}>
        {/* Artist profile photo (different from cover image) */}
        <Image 
          source={{ uri: artist.coverimage }} 
          style={styles.bio_coverimage} 
        />
        
        <View style={styles.bioContent}>
          {/* Bio text with expandable functionality */}
          <Text style={styles.bioText} numberOfLines={4}>
            {artist.bio}
          </Text>
          
          {/* Read more/less toggle button */}
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.expandButtonText}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Stats section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{artist.monthly}</Text>
          <Text style={styles.statLabel}>Monthly Listeners</Text>
        </View>
        
        {artist.followers && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{artist.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        )}
      </View>
      
      <View style={styles.divider} />
      
      {/* Social links section */}
      <View style={styles.socialSection}>
        <Text style={styles.connectText}>Connect with {artist.name}</Text>
        
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="twitter" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="instagram" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.websiteButton]}>
            <FontAwesome name="globe" size={18} color="white" />
            <Text style={styles.websiteButtonText}>Official Website</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Attribution or additional info */}
      {artist.label && (
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>
            ℗ {new Date().getFullYear()} {artist.label}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  bioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  bio_coverimage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  bioContent: {
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#ddd',
    marginBottom: 12,
  },
  expandButton: {
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  socialSection: {
    marginTop: 4,
  },
  connectText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  socialButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  websiteButton: {
    width: 'auto',
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
  },
  websiteButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  additionalInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  additionalInfoText: {
    fontSize: 12,
    color: '#777',
  }
});

export default ArtistBioFooter;