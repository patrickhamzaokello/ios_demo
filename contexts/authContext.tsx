import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "@/config/firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>(null);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            // console.log("firebaseuser", firebaseUser)
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    full_name: firebaseUser?.displayName
                });

                updateUserData(firebaseUser.uid)
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
            console.log("error message: ", msg);
            if (msg.includes("auth/invalid-credential")) {
                msg = "Invalid Credentials";
            }
            if (msg.includes("auth/invalid-email")) {
                msg = "Invalid Email";
            }
            return { success: false, msg };
        }
    };

    const register = async (user_email: string, user_password: string, phone_number: string, user_fullname: string, username: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, user_email, user_password);
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
            console.log("error message: ", msg);
            if (msg.includes("auth/email-already-in-use")) {
                msg = "This email is already in use";
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
                    image: data.image || null
                };

                setUser({ ...userData });

            }
        } catch (error: any) {
            let msg = error.message;
            console.log("error", error);
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be wrapped inside AuthProvider");
    }

    return context;
};