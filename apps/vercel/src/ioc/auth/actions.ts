"use server";
import { container } from "../index";
import type { SignInInput, SignUpInput } from "./types";

export const loginAction = async (params: SignInInput) => {
  const { auth } = container.cradle;

  return await auth.signIn(params);
};

export const signupAction = async (params: SignUpInput) => {
  const { auth } = container.cradle;

  return await auth.signUp(params);
};
