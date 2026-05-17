"use client";

export const dynamic = "force-dynamic";

import {

  useSearchParams,

  useRouter,

} from "next/navigation";

import {

  useState,

  useEffect,

} from "react";

import {

  collection,

  addDoc,

} from "firebase/firestore";

import {

  auth,

  db,

} from "@/lib/firebase";

export default function NewNotePage() {

  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const date =
    searchParams.get("date") || "";

  const [title, setTitle] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [enable147,
    setEnable147] =
      useState(false);

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "147-enabled"
      );

    if (saved === "true") {

      setEnable147(true);

    }

  }, []);

  const createRecurringEvents = (
    baseDate: string,
    title: string,
    notes: string
  ) => {

    const revisionDays =
      [1, 4, 7];

    const recurringEvents = [];

    for (const day of revisionDays) {

      const nextDate =
        new Date(baseDate);

      nextDate.setDate(
        nextDate.getDate() + day
      );

      // IMPORTANT DATE FORMAT FIX

      const formattedDate =
`${nextDate.getFullYear()}-${
nextDate.getMonth() + 1
}-${
nextDate.getDate()
}`;

      recurringEvents.push({

        title:
`${title} - Revision ${day}`,

        notes:
`Original Study Date:
${baseDate}

${notes}`,

        date: formattedDate,

        isRevision: true,

        completed: false,

        createdAt: Date.now(),

      });

    }

    return recurringEvents;
  };

  const saveEvent =
    async () => {

      try {

        const user =
          auth.currentUser;

        if (!user) {

          alert(
            "User not logged in"
          );

          return;
        }

        const eventsRef =
          collection(
            db,
            "users",
            user.uid,
            "events"
          );

        // MAIN EVENT

        const promises = [];

        promises.push(

          addDoc(eventsRef, {

            title,

            notes,

            date,

            isRevision: false,

            completed: false,

            createdAt: Date.now(),

          })

        );

        // 147 LOGIC

        if (enable147) {

          const recurringEvents =
            createRecurringEvents(
              date,
              title,
              notes
            );

          recurringEvents.forEach(
            (event) => {

              promises.push(
                addDoc(
                  eventsRef,
                  event
                )
              );

            }
          );

        }

        await Promise.all(
          promises
        );

        router.push("/");

      } catch (error) {

        console.log(error);

        alert(
          "Failed to save topic"
        );

      }

    };

  return (

    <main className="
      min-h-screen
      bg-[#0f1117]
      text-white
      p-6
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">

        {/* BACK */}

        <button

          onClick={() =>
            router.push("/")
          }

          className="
            mb-6

            bg-blue-600
            hover:bg-blue-500

            px-5
            py-3

            rounded-2xl

            transition
          "

        >

          ← Back

        </button>

        {/* CARD */}

        <div className="
          bg-[#1a1d26]

          border
          border-gray-800

          rounded-3xl

          p-8

          shadow-2xl
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <h1 className="
              text-3xl
              font-bold
            ">

              Create New Topic

            </h1>

            {/* 147 */}

            <button

              onClick={() => {

                setEnable147(
                  !enable147
                );

                localStorage.setItem(

                  "147-enabled",

                  (!enable147)
                    .toString()

                );

              }}

              className={`

                px-5
                py-2

                rounded-2xl

                font-semibold

                transition

                ${
                  enable147

                  ? `
                    bg-orange-500
                    text-black
                  `

                  : `
                    bg-blue-600
                    text-white
                  `
                }

              `}

            >

              147

            </button>

          </div>

          {/* TITLE */}

          <div className="
            space-y-6
          ">

            <div>

              <label className="
                block
                mb-2
                text-gray-400
              ">

                Topic Heading

              </label>

              <input

                value={title}

                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }

                placeholder="
                  Topic Heading
                "

                className="
                  w-full

                  bg-[#0f1117]

                  border
                  border-gray-700

                  rounded-2xl

                  p-4

                  outline-none

                  focus:border-blue-500
                "
              />

            </div>

            {/* NOTES */}

            <div>

              <label className="
                block
                mb-2
                text-gray-400
              ">

                Notes

              </label>

              <textarea

                value={notes}

                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }

                rows={18}

                placeholder="
                  Write Notes...
                "

                className="
                  w-full

                  bg-[#0f1117]

                  border
                  border-gray-700

                  rounded-2xl

                  p-4

                  outline-none

                  focus:border-blue-500
                "
              />

            </div>

            {/* SAVE */}

            <button

              onClick={saveEvent}

              className="
                w-full

                bg-green-600
                hover:bg-green-500

                py-4

                rounded-2xl

                font-semibold

                transition
              "

            >

              Save Topic

            </button>

          </div>

        </div>

      </div>

    </main>

  );

}
