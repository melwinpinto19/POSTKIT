"use client";
import { registerUser } from "@/api/user";
import AuthComponent from "@/components/auth/Auth";
import { AuthFormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    const response = await registerUser({
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      // set the user token :
      localStorage.setItem("access_token", response.data.token);

      // Redirect to dashboard
      router.push("/home");
    } else {
      throw new Error(response.data.message);
    }
  };

  return (
    <AuthComponent
      mode={"register"}
      onSubmit={handleAuth}
      onModeChange={() => router.push("/auth/login")}
      isLoading={isLoading}
    />
  );
}

export default Page;
