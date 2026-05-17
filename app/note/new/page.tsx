"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";

import { useState } from "react";

import {

  collection,

  addDoc,

} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function NewNotePage() {

  const router = useRouter();

  const [title, setTitle] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] =
    useState(false);

  const createTopic = async () => {

    try {

      setLoading(true);

      const user = auth.currentUser;

      if (!user) {

        router.push("/login");

        return;
      }

      const today = new Date();

      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

      const docRef = await addDoc(

        collection(
          db,
          "users",
          user.uid,
          "events"
        ),

        {

          title,

          notes,

          date: dateString,

          completed: false,

          isRevision: false,

          createdAt: Date.now(),

        }

      );

      router.push(`/note/${docRef.id}`);

    } catch (error) {

      console.log(error);

      alert("Failed to create topic");

    }

    setLoading(false);
  };

  return (

    <main className="min-h-screen bg-[#0f1117] text-white p-6">

      <div className="max-w-4xl mx-auto">

        <button

          onClick={() => router.push("/")}

          className="mb-6 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl"

        >

          ← Back

        </button>

        <div className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-8">

          <h1 className="text-3xl font-bold mb-8">

            Create New Topic

          </h1>

          <div className="space-y-6">

            <div>

              <label className="block mb-2 text-gray-400">

                Topic Title

              </label>

              <input

                value={title}

                onChange={(e) =>
                  setTitle(e.target.value)
                }

                placeholder="Enter topic"

                className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"

              />

            </div>

            <div>

              <label className="block mb-2 text-gray-400">

                Notes

              </label>

              <textarea

                value={notes}

                onChange={(e) =>
                  setNotes(e.target.value)
                }

                rows={14}

                placeholder="Write notes..."

                className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"

              />

            </div>

            <button

              onClick={createTopic}

              disabled={loading}

              className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-semibold"

            >

              {loading
                ? "Creating..."
                : "Create Topic"}

            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
