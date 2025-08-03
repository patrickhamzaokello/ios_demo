import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const index = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("@/assets/images/mwonya_new_logo.png")}
        />
        <Text style={{ color: "white", fontSize: 20 }}>Mwonya</Text>
      </View>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
