import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          full_name: firebaseUser?.displayName,
        });

        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)/(home)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/invalid-credential")) {
        msg = "Invalid Credentials";
      }
      if (msg.includes("auth/invalid-email")) {
        msg = "Invalid Email";
      }
      return { success: false, msg };
    }
  };

  const login_with_google_apple = async (idToken: string, provider: string) => {
    try {
      // Validate provider
      if (provider !== "google" && provider !== "apple") {
        return { success: false, msg: "Invalid provider specified." };
      }
      // Check if idToken is provided
      if (!idToken) {
        return { success: false, msg: "ID Token is required." };
      }
      // Check if SecureStore is available
      const isSecureStoreAvailable = await SecureStore.isAvailableAsync();
      if (!isSecureStoreAvailable) {
        return { success: false, msg: "SecureStore is not available." };
      }
      // Check if the user is already logged in
      const currentUser = auth.currentUser;
      if (currentUser) {
        // User is already logged in, no need to proceed with social auth
        return { success: true, msg: "User already logged in." };
      }
      // If the user is not logged in, proceed with social auth    
      const backend_url = provider === "google" ? "https://backend.aeacbio.com/social_auth/google/" : "https://backend.aeacbio.com/social_auth/apple/";
      // Make the backend request
      const backendResponse = await fetch(
        backend_url,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth_token: idToken, // Pass the ID token from Google Sign-In
          }),
        }
      );

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        // Store the tokens securely
        const { tokens } = backendData;
        if (tokens?.access && tokens?.refresh) {
          await SecureStore.setItemAsync("accessToken", tokens.access);
          await SecureStore.setItemAsync("refreshToken", tokens.refresh);
        }

        // Optionally, store other user details if needed
        if (backendData.email) {
          await SecureStore.setItemAsync("email", backendData.email);
        }
        if (backendData.username) {
          await SecureStore.setItemAsync("username", backendData.username);
        }

        // Return success response
        return { success: true, msg: "Login Successful" };
      } else {
        // Handle backend errors
        const errorMsg =
          backendData?.message || "An error occurred. Please try again.";
        return { success: false, msg: errorMsg };
      }
    } catch (error: any) {
      // Handle unexpected errors
      const errorMsg =
        error?.message || "An unexpected error occurred. Please try again.";
      return { success: false, msg: errorMsg };
    }
  };

  const register = async (
    user_email: string,
    user_password: string,
    phone_number: string,
    user_fullname: string,
    username: string
  ) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        user_email,
        user_password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        user_fullname,
        username,
        phone_number,
        user_email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/email-already-in-use")) {
        msg = "This email is already in use";
      }

      return { success: false, msg };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("auth/user-not-found")) {
        msg = "This email is not registered";
      }
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data.user_email || null,
          full_name: data.user_fullname || null,
          phone_number: data.phone_number || null,
          user_name: data.username || null,
          image: data.image || null,
        };

        setUser({ ...userData });
      }
    } catch (error: any) {
      let msg = error.message;
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    login_with_google_apple,
    register,
    updateUserData,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }

  return context;
};
