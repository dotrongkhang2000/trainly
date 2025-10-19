"use client";

import { useState } from "react";
import { Button, Select, SelectItem, Card, CardBody } from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function RaceConfiguration() {
  const [selectedDistance, setSelectedDistance] = useState("5K");
  const [selectedUnit, setSelectedUnit] = useState("Kilometers");
  const [selectedPeriod, setSelectedPeriod] = useState("Select Weeks");
  const [weeksUntilRace, setWeeksUntilRace] = useState("8");
  const [raceDay, setRaceDay] = useState("Sunday");

  const distances = ["5K", "10K", "Half Marathon", "Marathon"];
  const units = ["Kilometers", "Miles"];
  const periods = ["Select Weeks", "Select Race Date"];

  const weeks = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-gray-800 border-2 border-yellow-400 rounded-3xl shadow-2xl">
        <CardBody className="p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            Race Configuration
          </h1>

          {/* Race Distance Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Select Your Race Distance:
            </h2>
            <div className="flex flex-wrap gap-4">
              {distances.map((distance) => (
                <Button
                  key={distance}
                  variant={selectedDistance === distance ? "solid" : "bordered"}
                  className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                    selectedDistance === distance
                      ? "bg-green-400 text-black border-green-400 shadow-lg"
                      : "bg-transparent text-white border-2 border-yellow-400 hover:border-green-400 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedDistance(distance)}
                >
                  {distance}
                </Button>
              ))}
            </div>
          </div>

          {/* Unit Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Select Your Preferred Unit:
            </h2>
            <div className="flex gap-4">
              {units.map((unit) => (
                <Button
                  key={unit}
                  variant={selectedUnit === unit ? "solid" : "bordered"}
                  className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                    selectedUnit === unit
                      ? "bg-green-400 text-black border-green-400 shadow-lg"
                      : "bg-transparent text-white border-2 border-yellow-400 hover:border-green-400 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedUnit(unit)}
                >
                  {unit}
                </Button>
              ))}
            </div>
          </div>

          {/* Training Period Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Choose Your Training Period:
            </h2>
            <div className="flex gap-4">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "solid" : "bordered"}
                  className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                    selectedPeriod === period
                      ? "bg-green-400 text-black border-green-400 shadow-lg"
                      : "bg-transparent text-white border-2 border-yellow-400 hover:border-green-400 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weeks Until Race */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Weeks Until Race:
              </h3>
              <Select
                selectedKeys={[weeksUntilRace]}
                onSelectionChange={(keys) =>
                  setWeeksUntilRace(Array.from(keys)[0] as string)
                }
                className="w-full"
                classNames={{
                  trigger:
                    "bg-transparent border-2 border-yellow-400 text-white hover:border-green-400 rounded-lg h-14 transition-colors duration-200",
                  value: "text-white text-lg",
                  popoverContent:
                    "bg-gray-800 border-2 border-yellow-400 rounded-lg",
                  listbox: "bg-gray-800",
                }}
                placeholder="Select weeks"
                selectorIcon={
                  <ChevronDownIcon className="w-5 h-5 text-white" />
                }
              >
                {weeks.map((week) => (
                  <SelectItem
                    key={week}
                    className="text-white hover:bg-gray-700 data-[hover=true]:bg-gray-700"
                  >
                    {week} Weeks
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Race Day */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Race Day:</h3>
              <Select
                selectedKeys={[raceDay]}
                onSelectionChange={(keys) =>
                  setRaceDay(Array.from(keys)[0] as string)
                }
                className="w-full"
                classNames={{
                  trigger:
                    "bg-transparent border-2 border-yellow-400 text-white hover:border-green-400 rounded-lg h-14 transition-colors duration-200",
                  value: "text-white text-lg",
                  popoverContent:
                    "bg-gray-800 border-2 border-yellow-400 rounded-lg",
                  listbox: "bg-gray-800",
                }}
                placeholder="Select day"
                selectorIcon={
                  <ChevronDownIcon className="w-5 h-5 text-white" />
                }
              >
                {days.map((day) => (
                  <SelectItem
                    key={day}
                    className="text-white hover:bg-gray-700 data-[hover=true]:bg-gray-700"
                  >
                    {day}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
