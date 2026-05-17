"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {

  collection,

  onSnapshot,

  query,

} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

interface EventType {

  id: string;

  title: string;

  notes: string;

  date: string;

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

  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const q = query(

      collection(
        db,
        "users",
        user.uid,
        "events"
      )

    );

    const unsubscribe = onSnapshot(

      q,

      (snapshot) => {

        const loadedEvents: EventType[] = [];

        snapshot.forEach((doc) => {

          loadedEvents.push({

            id: doc.id,

            ...doc.data(),

          } as EventType);

        });

        setEvents(loadedEvents);

      }

    );

    return () => unsubscribe();

  }, []);

  const daysInMonth = new Date(

    selectedYear,

    selectedMonth + 1,

    0

  ).getDate();

  const firstDay = new Date(

    selectedYear,

    selectedMonth,

    1

  ).getDay();

  const dayNames = [

    "Sunday",

    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday",

    "Saturday",

  ];

  const cells = [];

  // EMPTY CELLS

  for (let i = 0; i < firstDay; i++) {

    cells.push(

      <div key={`empty-${i}`} />

    );
  }

  // DAYS

  for (let day = 1; day <= daysInMonth; day++) {

    const formattedDate = `${selectedYear}-${selectedMonth + 1}-${day}`;

    const dayEvents = events.filter(

      (event) => event.date === formattedDate

    );

    cells.push(

      <div

        key={day}

        className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-4 min-h-[170px] hover:border-blue-500 transition"

      >

        {/* DAY */}

        <div className="flex items-center justify-between mb-3">

          <div>

            <p className="text-sm text-gray-400">

              {

                dayNames[
                  new Date(
                    selectedYear,
                    selectedMonth,
                    day
                  ).getDay()
                ]

              }

            </p>

            <h2 className="text-2xl font-bold">

              {day}

            </h2>

          </div>

          {/* ADD BUTTON */}

          <Link

            href={`/note/new?date=${formattedDate}`}

            className="bg-blue-600 hover:bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center"

          >

            +

          </Link>

        </div>

        {/* EVENTS */}

        <div className="space-y-2">

          {dayEvents.length === 0 && (

            <p className="text-gray-500 text-sm">

              No Topics

            </p>

          )}

          {dayEvents.map((event) => (

            <Link

              key={event.id}

              href={`/note/${event.id}`}

              className={`block p-3 rounded-2xl text-sm border transition

                ${event.completed

                ? "bg-green-600/30 border-green-500"

                : event.isRevision

                    ? "bg-purple-600/20 border-purple-500"

                    : "bg-blue-600/20 border-blue-500"

                }
                `}

            >

              <div className="flex items-center justify-between">

                <span className="font-medium">

                    {event.title}

                </span>

                {event.completed && (

                    <span className="text-green-400 text-lg">

                    ✅

                    </span>

                )}

                </div>

            </Link>

          ))}

        </div>

      </div>

    );
  }

  return (

    <div>

      {/* DAY HEADERS */}

      <div className="grid grid-cols-7 gap-4 mb-4">

        {dayNames.map((day) => (

          <div

            key={day}

            className="text-center text-gray-400 font-semibold"

          >

            {day}

          </div>

        ))}

      </div>

      {/* CALENDAR */}

      <div className="grid grid-cols-7 gap-4">

        {cells}

      </div>

    </div>
  );
}