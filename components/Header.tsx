interface Props {

  selectedMonth: number;

  selectedYear: number;

  setSelectedMonth: React.Dispatch<
    React.SetStateAction<number>
  >;

  setSelectedYear: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function Header({

  selectedMonth,

  selectedYear,

  setSelectedMonth,

  setSelectedYear,

}: Props) {

  const months = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",

  ];

  const years = [];

  for (let year = 2020; year <= 2035; year++) {

    years.push(year);

  }

  return (

    <div className="flex items-center gap-4 mb-8">

      {/* MONTH */}

      <select

        value={selectedMonth}

        onChange={(e) =>
          setSelectedMonth(
            Number(e.target.value)
          )
        }

        className="bg-[#1a1d26] border border-gray-700 px-5 py-3 rounded-2xl text-white outline-none"
      >

        {months.map((month, index) => (

          <option
            key={month}
            value={index}
          >
            {month}
          </option>

        ))}

      </select>

      {/* YEAR */}

      <select

        value={selectedYear}

        onChange={(e) =>
          setSelectedYear(
            Number(e.target.value)
          )
        }

        className="bg-[#1a1d26] border border-gray-700 px-5 py-3 rounded-2xl text-white outline-none"
      >

        {years.map((year) => (

          <option
            key={year}
            value={year}
          >
            {year}
          </option>

        ))}

      </select>

    </div>
  );
}