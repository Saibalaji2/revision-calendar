"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import {

  collection,
  addDoc,

} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import Toggle147 from "@/components/Toggle147";

export default function NewNotePage() {

  const router = useRouter();

  const [date, setDate] = useState("");

  const [title, setTitle] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [revision147, setRevision147] = useState(false);

  useEffect(() => {

    if (typeof window !== "undefined") {

      const params = new URLSearchParams(
        window.location.search
      );

      const selectedDate = params.get("date") || "";

      setDate(selectedDate);

    }

  }, []);

  const create147Date = (baseDate: string) => {

    const current = new Date(baseDate);

    current.setDate(current.getDate() + 1);

    return current.toISOString().split("T")[0];

  };

  const saveNote = async () => {

    try {

      const user = auth.currentUser;

      if (!user || !date) return;

      setLoading(true);

      // MAIN EVENT

      await addDoc(

        collection(
          db,
          "users",
          user.uid,
          "events"
        ),

        {
          title,
          notes,
          date,
          completed: false,
          isRevision: false,
          createdAt: Date.now(),
        }

      );

      // 147 REVISION EVENT

      if (revision147) {

        const revisionDate = create147Date(date);

        await addDoc(

          collection(
            db,
            "users",
            user.uid,
            "events"
          ),

          {
            title: `${title} Revision`,
            notes: `Revision created from ${date}\n\n${notes}`,
            date: revisionDate,
            completed: false,
            isRevision: true,
            createdAt: Date.now(),
          }

        );

      }

      router.push("/");

    } catch (error) {

      console.log(error);

      alert("Failed to save topic");

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-[#0b1020] text-white p-4 sm:p-8">

      {/* 147 BUTTON */}

      <Toggle147
        enabled={revision147}
        setEnabled={setRevision147}
      />

      <div className="max-w-4xl mx-auto">

        {/* BACK */}

        <button
          onClick={() => router.push("/")}
          className="
            bg-blue-600
            hover:bg-blue-500
            px-5
            py-3
            rounded-2xl
            mb-6
          "
        >
          ← Back
        </button>

        {/* CARD */}

        <div className="
          bg-[#151925]
          border
          border-gray-800
          rounded-3xl
          p-6
          sm:p-8
          shadow-2xl
        ">

          <h1 className="text-3xl font-bold mb-8">

            Create New Topic

          </h1>

          {/* DATE */}

          <div className="mb-6">

            <p className="text-gray-400 mb-2">
              Selected Date
            </p>

            <div className="
              bg-[#0b1020]
              border
              border-gray-700
              rounded-2xl
              p-4
            ">
              {date}
            </div>

          </div>

          {/* TITLE */}

          <div className="mb-6">

            <label className="block text-gray-400 mb-2">

              Topic Name

            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter topic name"
              className="
                w-full
                bg-[#0b1020]
                border
                border-gray-700
                rounded-2xl
                p-4
                outline-none
              "
            />

          </div>

          {/* NOTES */}

          <div className="mb-8">

            <label className="block text-gray-400 mb-2">

              Notes

            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows={12}
              placeholder="Write notes..."
              className="
                w-full
                bg-[#0b1020]
                border
                border-gray-700
                rounded-2xl
                p-4
                outline-none
              "
            />

          </div>

          {/* SAVE */}

          <button
            onClick={saveNote}
            disabled={loading}
            className="
              w-full
              bg-green-600
              hover:bg-green-500
              py-4
              rounded-2xl
              font-bold
            "
          >

            {loading ? "Saving..." : "Save Topic"}

          </button>

        </div>

      </div>

    </main>

  );

}
