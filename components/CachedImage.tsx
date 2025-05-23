import { getCachedImage } from "@/helpers/imagecachemanagement";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

interface CachedImageProps {
  source: { uri: string };
  style?: object;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  [key: string]: any;
}

const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  resizeMode = "cover",
  ...props
}) => {
  const [imageSource, setImageSource] = useState<{ uri: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!source?.uri) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        // Try to get cached image first
        const cachedPath = await getCachedImage(source.uri);

        if (isMounted) {
          if (cachedPath) {
            // Use cached image
            setImageSource({ uri: cachedPath });
          } else {
            // Use original URL as fallback
            setImageSource(source);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading cached image:", err);
        if (isMounted) {
          // Fallback to original source
          setImageSource(source);
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [source?.uri]);

  const handleError = () => {
    setError(true);
    setLoading(false);

    // If cached image failed, try original URL
    if (imageSource?.uri?.startsWith("file://")) {
      setImageSource(source);
    }
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  if (loading) {
    return (
      <View style={[style, styles.loadingContainer]}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  if (error || !imageSource) {
    return (
      <View style={[style, styles.errorContainer]}>
        {/* You can customize this placeholder */}
      </View>
    );
  }

  return (
    <Image
      source={imageSource}
      style={style}
      resizeMode={resizeMode}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  errorContainer: {
    backgroundColor: "#e0e0e0",
  },
});

export default CachedImage;
