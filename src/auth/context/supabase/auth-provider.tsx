"use client";
import { useMemo, useEffect, useCallback } from "react";
import { useSetState } from "src/hooks/use-set-state";
import axios from "src/utils/axios";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "../auth-context";
import type { AuthState } from "../../types";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setState({ user: null, loading: false });
        console.error(error);
        throw error;
      }

      if (session) {
        const accessToken = session?.access_token;

        setState({ user: { ...session, ...session?.user }, loading: false });
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        setState({ user: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
    // ... (tvoja postojeća logika za proveru sesije)
  }, [setState]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await checkUserSession(); // Osvježavanje sesije nakon logovanja
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Možda želiš dodati korisnika u svoju bazu podataka
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ user: null }); // Resetuj korisnika
  };

  // Dodaj funkcije za resetovanje lozinke i ažuriranje lozinke ako je potrebno
  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) throw error;
  };

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";
  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.id,
            accessToken: state.user?.access_token,
            displayName: `${state.user?.user_metadata.display_name}`,
            role: state.user?.role ?? "admin",
          }
        : null,
      checkUserSession,
      method: "supabase", // Postavi vrednost ili dodaj logiku
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      login,
      register,
      logout,
      forgotPassword,
      updatePassword,
    }),
    [checkUserSession, state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
