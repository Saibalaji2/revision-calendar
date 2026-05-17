interface Event {
  id: string;
  title: string;
  notes: string;
  date: string;
}

interface Props {
  day: number;
  events: Event[];
  onDateClick: () => void;
  onTopicClick: () => void;
}

export default function CalendarCell({
  day,
  events,
  onDateClick,
  onTopicClick,
}: Props) {
  return (
    <div className="bg-[#1a1d26] border border-gray-800 rounded-3xl h-40 p-4 shadow-lg hover:border-blue-500 transition overflow-hidden">

      <button
        onClick={onDateClick}
        className="text-sm font-bold text-white mb-3 hover:text-blue-400"
      >
        {day}
      </button>

      <div className="space-y-2">

        {events.length === 0 && (
          <div className="text-xs text-gray-500">
            No Events
          </div>
        )}

        {events.map((event) => (

          <button
            key={event.id}
            onClick={onTopicClick}
            className="w-full text-left bg-blue-500/20 border border-blue-500 text-xs rounded-xl px-2 py-1 text-blue-300 truncate hover:bg-blue-500/30"
          >
            {event.title}
          </button>

        ))}

      </div>

    </div>
  );
}