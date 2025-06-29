"use server";
import { cookies } from "next/headers";
import axios from "axios";

export async function loginAction({ email, password }) {
  console.log("🔹 loginAction function is running!");

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("Sending request to API:", NEXT_PUBLIC_API_URL, { email, password });

  try {
    const response = await axios.post(
      `${NEXT_PUBLIC_API_URL}/api/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          apiKey: "1234",
        },
      }
    );

    console.log("Raw API Response:", response);

    const json_response = response.data;
    console.log("Parsed API Response:", json_response);

    if (json_response.status !== 200) {
      return {
        message: json_response.message || "Login failed",
        status: json_response.status,
      };
    }

    const token = json_response.data;

    // OPTIONAL: Store token in cookie (if you still want to support cookies)
    // cookies().set("userToken", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 7 * 24 * 60 * 60,
    //   path: "/",
    // });

    return {
      message: "Login Successfuls",
      status: 200,
      token,
    };
  } catch (error) {
    console.error("Error sending request:", error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Unexpected server error";

    return {
      message,
      status,
    };
  }
}
