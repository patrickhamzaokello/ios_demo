import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const userData = await SecureStore.getItemAsync("userData");
      
      if (accessToken ) {
        // const parsedUser = JSON.parse(userData);
        // setUser(parsedUser);
        router.replace("/(tabs)/(home)");
      } else {
        router.replace("/(auth)/welcome");
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      router.replace("/(auth)/welcome");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("https://backend.aeacbio.com/auth/login/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user data
        const { tokens, user: userData } = data;
        
        if (tokens?.access && tokens?.refresh) {
          await SecureStore.setItemAsync("accessToken", tokens.access);
          await SecureStore.setItemAsync("refreshToken", tokens.refresh);
        }

        if (userData) {
          await SecureStore.setItemAsync("userData", JSON.stringify(userData));
          setUser(userData);
        }

        router.replace("/(tabs)/(home)");
        return { success: true };
      } else {
        let msg = data?.message || "Login failed";
        if (msg.includes("invalid-credential") || msg.includes("Invalid credentials")) {
          msg = "Invalid Credentials";
        }
        if (msg.includes("invalid-email")) {
          msg = "Invalid Email";
        }
        return { success: false, msg };
      }
    } catch (error: any) {
      return { 
        success: false, 
        msg: error?.message || "Network error. Please try again." 
      };
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
      const currentAccessToken = await SecureStore.getItemAsync("accessToken");
      if (currentAccessToken) {
        return { success: true, msg: "User already logged in." };
      }
      
      const backend_url = provider === "google" 
        ? "https://backend.aeacbio.com/social_auth/google/" 
        : "https://backend.aeacbio.com/social_auth/apple/";
      
      // Make the backend request
      const backendResponse = await fetch(backend_url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_token: idToken,
        }),
      });

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        // Store the tokens securely
        const { tokens, user: userData } = backendData;
        if (tokens?.access && tokens?.refresh) {
          await SecureStore.setItemAsync("accessToken", tokens.access);
          await SecureStore.setItemAsync("refreshToken", tokens.refresh);
        }

        // Store user data
        if (userData) {
          await SecureStore.setItemAsync("userData", JSON.stringify(userData));
          setUser(userData);
        } else {
          // Fallback to individual fields if user object not provided
          const fallbackUser = {
            uid: backendData.uid || null,
            email: backendData.email || null,
            full_name: backendData.full_name || backendData.username || null,
            phone_number: backendData.phone_number || null,
            user_name: backendData.username || null,
            image: backendData.image || null,
          };
          await SecureStore.setItemAsync("userData", JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }

        router.replace("/(tabs)/(home)");
        return { success: true, msg: "Login Successful" };
      } else {
        const errorMsg = "An error occurred. Please try again.";
        return { success: false, msg: errorMsg };
      }
    } catch (error: any) {
      const errorMsg =  "An unexpected error occurred. Please try again.";
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
      const response = await fetch("https://backend.aeacbio.com/auth/register/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user_email,
          password: user_password,
          phone_number,
          full_name: user_fullname,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user data after successful registration
        const { tokens, user: userData } = data;
        
        if (tokens?.access && tokens?.refresh) {
          await SecureStore.setItemAsync("accessToken", tokens.access);
          await SecureStore.setItemAsync("refreshToken", tokens.refresh);
        }

        if (userData) {
          await SecureStore.setItemAsync("userData", JSON.stringify(userData));
          setUser(userData);
        }

        router.replace("/(tabs)/(home)");
        return { success: true };
      } else {
        let msg = data?.message || "Registration failed";
        if (msg.includes("email-already-in-use") || msg.includes("already exists")) {
          msg = "This email is already in use";
        }
        return { success: false, msg };
      }
    } catch (error: any) {
      return { 
        success: false, 
        msg: error?.message || "Network error. Please try again." 
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch("https://backend.aeacbio.com/auth/forgot-password/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        let msg = data?.message || "Failed to send reset email";
        if (msg.includes("user-not-found") || msg.includes("not found")) {
          msg = "This email is not registered";
        }
        return { success: false, msg };
      }
    } catch (error: any) {
      return { 
        success: false, 
        msg: error?.message || "Network error. Please try again." 
      };
    }
  };

  const updateUserData = async (uid?: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        return { success: false, msg: "No access token found" };
      }

      const response = await fetch("https://backend.aeacbio.com/auth/user/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const userData: UserType = {
          uid: data?.uid || data?.id,
          email: data?.email,
          full_name: data?.full_name || data?.user_fullname,
          phone_number: data?.phone_number,
          user_name: data?.username || data?.user_name,
          image: data?.image || data?.profile_image,
        };

        await SecureStore.setItemAsync("userData", JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, msg: data?.message || "Failed to update user data" };
      }
    } catch (error: any) {
      return { 
        success: false, 
        msg: error?.message || "Network error. Please try again." 
      };
    }
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userData");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("username");

      // Clear user state
      setUser(null);
      
      // Navigate to welcome screen
      router.replace("/(auth)/welcome");
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        msg: error?.message || "Logout failed" 
      };
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch("https://backend.aeacbio.com/auth/refresh/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access } = data;
        if (access) {
          await SecureStore.setItemAsync("accessToken", access);
          return { success: true, accessToken: access };
        }
      }
      
      throw new Error("Failed to refresh token");
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      return { success: false, msg: "Session expired. Please login again." };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    logout,
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