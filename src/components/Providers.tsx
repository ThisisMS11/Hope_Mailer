"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

interface Props {
  children: ReactNode;
}

const Providers = (props: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>{props.children}</ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
