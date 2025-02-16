import axiosInstance from "@/utils/apiUtils";
import { LoginResponse } from "@/types";


export const api_register = async (username: string, user_fullname: string, phone_number: string, user_email: string, user_password: string): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post('/userRegister.php',
            {
                username: username,
                full_name: user_fullname,
                phone: phone_number,
                email: user_email,
                password: user_password
            });
        const response_data = response.data;
        const { error, message } = response_data;

        if (error) {
            throw new Error(message || "Registration Failed");
        }

        return response_data as LoginResponse;

    } catch (error) {
        return {
            id: "",
            username: "",
            full_name: "",
            email: "",
            phone: "",
            password: "",
            signUpDate: "",
            profilePic: "",
            status: "error",
            mwRole: "",
            error: true,
            message: (error as any).message,
        };
    }
}

export const api_login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post('/user_login.php', { username: email, password: password });
        const response_data = response.data;
        const { error, message } = response_data;

        if (error) {
            throw new Error(message || "Invalid Credentials");
        }

        return response_data as LoginResponse;

    } catch (error) {
        return {
            id: "",
            username: "",
            full_name: "",
            email: "",
            phone: "",
            password: "",
            signUpDate: "",
            profilePic: "",
            status: "error",
            mwRole: "",
            error: true,
            message: (error as any).message,
        };
    }
};