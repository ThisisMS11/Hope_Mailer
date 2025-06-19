"use client";
import React, { createContext, useState, useEffect } from "react";
import {
  useMutation,
  useQuery,
  UseMutationResult,
} from "@tanstack/react-query";
import { ResponseBody } from "@/types";
import { LoginRequest, UserInfo } from "@/features/authentication/types";
import { queryClient } from "@/lib/queryClient";
import { getUserInfoApiFunc, loginApiFunc, logoutApiFunc } from "@/api/auth";
import { useRouter } from "@/imports/Nextjs_imports";

type AuthContextType = {
  user: UserInfo | null;
  requestLogin: UseMutationResult<
    ResponseBody<UserInfo>,
    Error,
    LoginRequest,
    unknown
  >;
  loading: boolean;
  isAuthenticated: boolean;
  refetchUser: any;
  requestLogout: UseMutationResult<ResponseBody<null>, Error, void, unknown>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  // Query to fetch the current user - this handles hard reload
  const {
    data: userResponse,
    isLoading,
    refetch: refetchUser,
    isError,
    error,
  } = useQuery<ResponseBody<UserInfo>, Error>({
    queryKey: ["user"],
    queryFn: () => getUserInfoApiFunc(),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  // Update user state when query data changes
  useEffect(() => {
    if (userResponse?.data) {
      setUser(userResponse.data);
    } else if (isError) {
      console.error(error);
      setUser(null);
      router.push("/auth");
    }
  }, [userResponse, isError, error]);

  const requestLogin = useMutation<ResponseBody<UserInfo>, Error, LoginRequest>(
    {
      mutationFn: async (body) => loginApiFunc(body),
      onSuccess: (response) => {
        console.log(response);
        setUser(response?.data ?? null);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: (error) => {
        console.error("Login failed:", error);
        setUser(null);
      },
    },
  );

  const requestLogout = useMutation<ResponseBody<null>, Error>({
    mutationFn: logoutApiFunc,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout request failed:", error);
      setUser(null);
      queryClient.clear();
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        requestLogin,
        loading: isLoading,
        isAuthenticated: !!user,
        refetchUser,
        requestLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
