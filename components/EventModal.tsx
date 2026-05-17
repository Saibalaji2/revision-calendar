"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, notes: string) => void;
  selectedDate: string;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: Props) {

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

      <div className="bg-[#1a1d26] w-full max-w-lg rounded-3xl p-6 border border-gray-700 shadow-2xl">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-white">
            {selectedDate}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            X
          </button>

        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Topic heading"
          className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4 text-white mb-4"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write notes here..."
          rows={8}
          className="w-full bg-[#0f1117] border border-gray-700 rounded-2xl p-4 text-white mb-4"
        />

        <button
          onClick={() => {
            onSave(title, notes);
            setTitle("");
            setNotes("");
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl font-semibold"
        >
          Save Event
        </button>

      </div>

    </div>
  );
}