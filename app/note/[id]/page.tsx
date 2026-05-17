"use client";

import { useEffect, useState } from "react";

import {

  doc,

  getDoc,

  updateDoc,

  deleteDoc,

} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import {

  useParams,

  useRouter,

} from "next/navigation";

export default function NotePage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");

  const [notes, setNotes] = useState("");

  const [completed, setCompleted] =
    useState(false);

  const [isRevision, setIsRevision] =
    useState(false);

  // LOAD EVENT

  useEffect(() => {

    const loadEvent = async () => {

      try {

        const user = auth.currentUser;

        if (!user) {

          router.push("/login");

          return;
        }

        const docRef = doc(

          db,

          "users",

          user.uid,

          "events",

          id

        );

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {

          const data = snapshot.data();

          setTitle(data.title || "");

          setNotes(data.notes || "");

          setCompleted(
            data.completed || false
          );

          setIsRevision(
            data.isRevision || false
          );

        }

      } catch (error) {

        console.log(error);

      }

      setLoading(false);
    };

    loadEvent();

  }, [id, router]);

  // SAVE CHANGES

  const saveChanges = async () => {

    try {

      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(

        db,

        "users",

        user.uid,

        "events",

        id

      );

      await updateDoc(docRef, {

        title,

        notes,

        completed,

      });

      alert("Updated Successfully");

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE EVENT

  const deleteEvent = async () => {

    const confirmDelete = confirm(
      "Delete this topic?"
    );

    if (!confirmDelete) return;

    try {

      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(

        db,

        "users",

        user.uid,

        "events",

        id

      );

      await deleteDoc(docRef);

      router.push("/");

    } catch (error) {

      console.log(error);

    }
  };

  // TOGGLE COMPLETE

  const toggleCompleted = async () => {

    try {

      const user = auth.currentUser;

      if (!user) return;

      const updatedValue = !completed;

      setCompleted(updatedValue);

      const docRef = doc(

        db,

        "users",

        user.uid,

        "events",

        id

      );

      await updateDoc(docRef, {

        completed: updatedValue,

      });

    } catch (error) {

      console.log(error);

    }
  };

  // LOADING

  if (loading) {

    return (

      <main className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">

        Loading...

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-[#0f1117] text-white p-6">

      <div className="max-w-5xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => router.push("/")}

            className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl"
          >

            ← Back

          </button>

          <button
            onClick={deleteEvent}

            className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-2xl"
          >

            Delete

          </button>

        </div>

        {/* MAIN CARD */}

        <div className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-8 shadow-2xl">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <h1 className="text-3xl font-bold">

              {isRevision
                ? "Revision Topic"
                : "Study Topic"}

            </h1>

            {/* COMPLETE BUTTON */}

            <button

              onClick={toggleCompleted}

              className={`px-5 py-3 rounded-2xl transition

              ${completed
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"}

              `}
            >

              {completed
                ? "Completed ✅"
                : "Mark Complete"}

            </button>

          </div>

          {/* TITLE */}

          <div className="mb-6">

            <label className="block mb-2 text-gray-400">

              Topic Heading

            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }

              className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"
            />

          </div>

          {/* NOTES */}

          <div className="mb-6">

            <label className="block mb-2 text-gray-400">

              Notes

            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }

              rows={18}

              className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4"
            />

          </div>

          {/* SAVE */}

          <button
            onClick={saveChanges}

            className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-semibold transition"
          >

            Save Changes

          </button>

        </div>

      </div>

    </main>
  );
}