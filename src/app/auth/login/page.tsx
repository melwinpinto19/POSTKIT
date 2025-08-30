"use client";
import { loginUser } from "@/api/user";
import AuthComponent from "@/components/auth/Auth";
import { useAuth } from "@/context/AuthContext";
import { AuthFormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    const response = await loginUser({
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      // login the user in the client:
      login(data.email, response.data.token);
    } else {
      setIsLoading(false);
      throw new Error(response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  if (user) return null;

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
