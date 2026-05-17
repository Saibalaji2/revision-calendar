"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {

    try {

      if (isLogin) {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      } else {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      }

      router.push("/");

    } catch (error: any) {

  console.log(error);

  alert(error.message);

}
  };

  return (

    <main className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-md bg-[#1a1d26] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold mb-8 text-center">

          {isLogin
            ? "Login"
            : "Create Account"}

        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }

            className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }

            className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"
          />

          <button
            onClick={handleAuth}

            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-semibold"
          >

            {isLogin
              ? "Login"
              : "Create Account"}

          </button>

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }

            className="w-full text-gray-400"
          >

            {isLogin
              ? "Create new account"
              : "Already have account? Login"}

          </button>

        </div>

      </div>

    </main>
  );
}