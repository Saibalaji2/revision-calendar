"use client";

interface Props {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export default function Toggle147({
  enabled,
  setEnabled,
}: Props) {

  return (

    <button
      onClick={() => setEnabled(!enabled)}
      className={`
        fixed
        bottom-6
        right-6
        z-[99999]

        px-6
        py-4

        rounded-2xl

        text-white
        text-lg
        font-bold

        shadow-2xl

        transition-all

        ${
          enabled
            ? "bg-green-600 hover:bg-green-500"
            : "bg-purple-600 hover:bg-purple-500"
        }
      `}
    >

      {enabled ? "147 ON" : "147"}

    </button>

  );

}
