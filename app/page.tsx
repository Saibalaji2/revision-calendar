"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {

  onAuthStateChanged,

  signOut,

  User,

} from "firebase/auth";

import { auth } from "@/lib/firebase";

import Header from "@/components/Header";

import Calendar from "@/components/Calendar";

export default function Home() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(

      auth,

      (currentUser) => {

        if (!currentUser) {

          router.push("/login");

        } else {

          setUser(currentUser);

        }

        setLoading(false);

      }

    );

    return () => unsubscribe();

  }, [router]);

  // LOADING SCREEN

  if (loading) {

    return (

      <main className="min-h-screen bg-[#0f1117] flex items-center justify-center text-white">

        Loading...

      </main>

    );
  }

  // BLOCK PAGE UNTIL LOGIN

  if (!user) {

    return null;

  }

  return (

    <main className="min-h-screen bg-[#0f1117] text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">

              Revision Calendar

            </h1>

            <p className="text-gray-400 mt-1">

              {user.email}

            </p>

          </div>

          <button
            onClick={() => signOut(auth)}

            className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-2xl transition"
          >
            Logout
          </button>

        </div>

        {/* HEADER */}

        <Header
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />

        {/* CALENDAR */}

        <Calendar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

      </div>

    </main>
  );
}