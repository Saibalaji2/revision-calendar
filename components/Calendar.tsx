"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

interface CalendarEvent {

  id: string;

  date: string;

  title: string;

  notes: string;

  isRevision?: boolean;

  completed?: boolean;

}

interface Props {

  selectedMonth: number;

  selectedYear: number;

}

export default function Calendar({

  selectedMonth,

  selectedYear,

}: Props) {

  const router = useRouter();

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  useEffect(() => {

    const user =
      auth.currentUser;

    if (!user) return;

    const q = query(

      collection(
        db,
        "users",
        user.uid,
        "events"
      )

    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const loadedEvents:
          CalendarEvent[] = [];

        snapshot.forEach((doc) => {

          loadedEvents.push({

            id: doc.id,

            ...doc.data(),

          } as CalendarEvent);

        });

        setEvents(loadedEvents);

      });

    return () => unsubscribe();

  }, []);

  const daysOfWeek = [

    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",

  ];

  const firstDay = new Date(

    selectedYear,

    selectedMonth,

    1

  ).getDay();

  const totalDays = new Date(

    selectedYear,

    selectedMonth + 1,

    0

  ).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {

    calendarDays.push(null);

  }

  for (let day = 1; day <= totalDays; day++) {

    calendarDays.push(day);

  }

  return (

    <div>

      {/* DAYS */}

      <div className="
        grid
        grid-cols-7
        gap-4
        mb-4
      ">

        {daysOfWeek.map((day) => (

          <div
            key={day}
            className="
              text-center
              text-gray-400
              font-semibold
            "
          >

            {day}

          </div>

        ))}

      </div>

      {/* CALENDAR */}

      <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        lg:grid-cols-7
        gap-4
      ">

        {calendarDays.map((day, index) => {

          if (!day) {

            return (
              <div key={index}></div>
            );

          }

          // IMPORTANT DATE FORMAT

          const currentDate =
`${selectedYear}-${selectedMonth + 1}-${day}`;

          const dayEvents =
            events.filter(

              (event) =>
                event.date === currentDate

            );

          return (

            <div

              key={index}

              className="
                bg-[#1a1d26]

                border
                border-gray-800

                rounded-3xl

                h-44

                p-4

                shadow-lg

                hover:border-blue-500

                transition

                overflow-hidden
              "

            >

              {/* HEADER */}

              <div className="
                flex
                items-center
                justify-between
                mb-3
              ">

                <div className="
                  text-sm
                  font-bold
                  text-white
                ">

                  {day}

                </div>

                {/* CREATE */}

                <button

                  onClick={() =>

                    router.push(
`/note/new?date=${currentDate}`
                    )

                  }

                  className="
                    bg-blue-600
                    hover:bg-blue-500

                    text-xs

                    px-2
                    py-1

                    rounded-lg

                    transition
                  "

                >

                  +

                </button>

              </div>

              {/* EVENTS */}

              <div className="
                space-y-2
                overflow-y-auto
                max-h-28
              ">

                {dayEvents.length === 0 && (

                  <div className="
                    text-xs
                    text-gray-500
                  ">

                    No Topics

                  </div>

                )}

                {dayEvents.map((event) => (

                  <button

                    key={event.id}

                    onClick={() =>

                      router.push(
`/note/${event.id}`
                      )

                    }

                    className={`
                      w-full

                      text-left
                      text-xs

                      rounded-xl

                      px-2
                      py-1

                      truncate

                      transition

                      ${
                        event.isRevision

                        ? `
                          bg-orange-500/20
                          border
                          border-orange-500
                          text-orange-300
                          hover:bg-orange-500/30
                        `

                        : `
                          bg-blue-500/20
                          border
                          border-blue-500
                          text-blue-300
                          hover:bg-blue-500/30
                        `
                      }

                    `}

                  >

                    {event.title}

                  </button>

                ))}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}
