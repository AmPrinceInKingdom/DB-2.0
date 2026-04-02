"use client";

import { createClient } from "./client";

export const signup = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

export const login = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const logout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};