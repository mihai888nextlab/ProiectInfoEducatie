"use server";

import connectDB from "@/conf/mongodb";
import userModel from "@/app/models/userModel";
import {
  clearSessionData,
  getSessionData,
  setSessionData,
} from "@/session/actions";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
//import { signIn } from "@/auth";

export async function authentificate(
  _currentState: unknown,
  formData: FormData
) {
  try {
    //await signIn("credentials", formData);
    connectDB();

    const users = await userModel.find({ email: formData.get("email") });
    if (users.length === 0) {
      throw { type: "CredentialsSignin" };
    }

    const user = users[0];
    if (
      bcrypt.compareSync(formData.get("password") as string, user.password) ===
      false
    ) {
      throw { type: "CredentialsSignin" };
    }

    await setSessionData(user._id);
  } catch (error: any) {
    switch (error?.type) {
      case "CredentialsSignin":
        return "Invalid credentials.";
      default:
        "Something went wrong.";
    }

    throw error;
  }
  redirect("/dashboard");
}

export async function register(_currentState: unknown, formData: FormData) {
  if (formData.get("password") !== formData.get("rep-password")) {
    return "Passwords do not match.";
  }

  if (
    formData.get("password") == "" ||
    formData.get("rep-password") == "" ||
    formData.get("email") == "" ||
    formData.get("username") == "" ||
    formData.get("fullName") == ""
  ) {
    return "Please fill in all fields.";
  }

  if ((formData.get("password")?.toString() ?? "").length < 8) {
    return "Password must be at least 8 characters long.";
  }

  try {
    connectDB();

    const hashedPassword = bcrypt.hashSync(
      formData.get("password") as string,
      10
    );
    let user = new userModel({
      email: formData.get("email"),
      username: formData.get("username"),
      fullName: formData.get("fullName"),
      password: hashedPassword,
    });

    await user.save();
    setSessionData(user._id);
    redirect("/login");
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  await clearSessionData();
  redirect("/login");
}

export async function checkSession() {
  const sessionData = await getSessionData();
  if (!sessionData) {
    redirect("/login");
  }

  try {
    //await signIn("credentials", formData);
    connectDB();

    const users = await userModel.find({ _id: sessionData });
    if (users.length === 0) {
      throw { type: "CredentialsSignin" };
    }

    const user = users[0];
    return JSON.stringify(user);
  } catch (error: any) {
    clearSessionData();
  }

  redirect("/login");
}
