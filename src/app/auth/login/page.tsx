"use client";
import { loginUser } from "@/api/user";
import AuthComponent from "@/components/auth/Auth";
import { AuthFormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    const response = await loginUser({
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      // set the user token :
      localStorage.setItem("access_token", response.data.token);

      // Redirect to dashboard
      router.push("/home");
    } else {
      setIsLoading(false);
      throw new Error(response.data.message);
    }
  };

  return (
    <AuthComponent
      mode={"login"}
      onSubmit={handleAuth}
      onModeChange={() => router.push("/auth/register")}
      isLoading={isLoading}
    />
  );
}

export default Page;
