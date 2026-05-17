"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { useState } from "react";

import {

  collection,
  addDoc,

} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import Toggle147 from "@/components/Toggle147";

export default function NewNotePage() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const date = searchParams.get("date");

  const [title, setTitle] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [revision147, setRevision147] = useState(false);

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

      // MAIN TOPIC

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

      // 147 REVISION TOPIC

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
            notes: `Revision for topic created on ${date}\n\n${notes}`,
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

      <div className="fixed bottom-6 right-6 z-[9999]">
        <Toggle147
          enabled={revision147}
          setEnabled={setRevision147}
        />
      </div>

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
          ← Back To Calendar
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
              placeholder="Write notes here..."
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
              transition
            "
          >

            {loading ? "Saving..." : "Save Topic"}

          </button>

        </div>

      </div>

    </main>

  );

}
