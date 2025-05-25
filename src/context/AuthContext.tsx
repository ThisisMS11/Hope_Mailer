"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResponseBody } from "@/types";
import { LoginRequest, UserInfo } from "@/features/authentication/types";
import axios from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";

type AuthContextType = {
  user: UserInfo | null;
  requestLogin: any;
  loading: boolean;
  isAuthenticated: boolean;
  refetchUser: any;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  // Query to fetch the current user - this handles hard reload
  const {
    data: userResponse,
    isLoading,
    refetch: refetchUser,
    isError,
    error,
  } = useQuery<ResponseBody<UserInfo>, Error>({
    queryKey: ["user"],
    queryFn: () => axios.get("/user").then((res) => res.data),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  // Update user state when query data changes
  useEffect(() => {
    if (userResponse?.data) {
      setUser(userResponse.data);
    } else if (isError) {
      // If error (like 401), the user is not authenticated
      console.error(error);
      setUser(null);
    }
  }, [userResponse, isError, error]);

  const requestLogin = useMutation<ResponseBody<UserInfo>, Error, LoginRequest>(
    {
      mutationFn: (body) => {
        return axios.post("/public/login", body);
      },
      onSuccess: (response) => {
        console.log(response);
        setUser(response?.data ?? null);
        // Invalidate a user query to refetch user data
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: (error) => {
        console.error("Login failed:", error);
        setUser(null);
      },
    },
  );

  const logout = async () => {
    try {
      // Call logout endpoint to clear httpOnly cookie
      await axios.post("/public/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Clear user state regardless of API call result
      setUser(null);
      // Clear all cached data
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        requestLogin,
        loading: isLoading,
        isAuthenticated: !!user,
        refetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
