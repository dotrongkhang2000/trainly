"use client";

import { useRef, useState } from "react";
import {
  Button,
  Card,
  NumberInput,
  Radio,
  RadioGroup,
  Listbox,
  ListboxItem,
  CardHeader,
} from "@heroui/react";
import { DateInput } from "@heroui/react";
import { differenceInWeeks, formatDate, isBefore } from "date-fns";
import {
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { TrainingPlanTable } from "@/components/traning-plan-table";

const weekDayOptions = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export default function RaceConfiguration() {
  const [distance, setDistance] = useState(5);
  const [customDistance, setCustomDistance] = useState<undefined | number>(
    undefined
  );

  const [raceDate, setRaceDate] = useState<null | ZonedDateTime>(null);

  const [trainingDays, setTrainingDays] = useState(new Set<string>([]));
  const [longRunDay, setLongRunDay] = useState(new Set<string>([]));

  const [goalTime, setGoalTime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });

  const goalTimeSecond =
    goalTime.hour * 3600 + goalTime.minute * 60 + goalTime.second;
  const totalSecondsPerKm = Math.round(goalTimeSecond / distance);
  const minutes = Math.floor(totalSecondsPerKm / 60);
  const seconds = totalSecondsPerKm % 60;
  const pace = `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;

  return (
    <>
      <Card className="p-10 gap-8">
        <div className="flex gap-2 flex-col">
          <p className="text-tiny uppercase font-bold">
            Select Your Race Distance:
          </p>

          <RadioGroup
            aria-label="Race Distance"
            orientation="horizontal"
            value={distance.toString()}
            onValueChange={(value) => {
              setDistance(Number(value));

              setCustomDistance(undefined);
            }}
          >
            <Radio value="5" className="mr-4">
              5K
            </Radio>
            <Radio value="10" className="mr-4">
              10K
            </Radio>
            <Radio value="21" className="mr-4">
              21K
            </Radio>
            <Radio value="42" className="mr-4">
              42K
            </Radio>

            <NumberInput
              hideStepper
              label="Custom"
              size="sm"
              className="max-w-30"
              onValueChange={(value) => {
                setCustomDistance(value);
              }}
              value={customDistance}
            />
          </RadioGroup>
        </div>

        <div className="flex gap-2 flex-col">
          <p className="text-tiny uppercase font-bold">Race Date:</p>

          <DateInput
            aria-label="Race date"
            className="max-w-sm"
            minValue={today(getLocalTimeZone())}
            value={raceDate}
            onChange={setRaceDate}
          />

          <p className="text-tiny text-gray-500">
            {raceDate &&
              !isBefore(raceDate.toString(), new Date()) &&
              `Calculated: ${differenceInWeeks(raceDate.toString(), new Date())} weeks
          (Plan starts ${formatDate(raceDate.toString(), "dd/MM/yyyy")})`}
          </p>
        </div>

        <div className="flex gap-2 flex-col">
          <p className="text-tiny uppercase font-bold">Goal Time:</p>
          <div className="flex gap-2">
            <NumberInput
              aria-label="Goal time hours"
              placeholder="Hours"
              size="md"
              className="max-w-30"
              labelPlacement="outside"
              minValue={0}
              onValueChange={(value) =>
                setGoalTime({ ...goalTime, hour: value || 0 })
              }
            />

            <NumberInput
              aria-label="Goal time minutes"
              placeholder="Minutes"
              size="md"
              className="max-w-30"
              labelPlacement="outside"
              minValue={0}
              maxValue={60}
              onValueChange={(value) =>
                setGoalTime({ ...goalTime, minute: value || 0 })
              }
            />

            <NumberInput
              aria-label="Goal time seconds"
              placeholder="Seconds"
              size="md"
              className="max-w-30"
              labelPlacement="outside"
              minValue={0}
              maxValue={60}
              onValueChange={(value) =>
                setGoalTime({ ...goalTime, second: value || 0 })
              }
            />
          </div>
          {goalTimeSecond > 0 && <p className="text-tiny">Pace: {pace}</p>}
        </div>

        {/* add pace with goal time */}
        <div className="flex gap-4">
          <Card className="max-w-xs">
            <CardHeader className="justify-between">
              <p className="text-tiny uppercase font-bold">
                Selected Training Days: 3
              </p>
            </CardHeader>

            <Listbox
              disallowEmptySelection
              aria-label="Training Days"
              selectionMode="multiple"
              variant="flat"
              selectedKeys={trainingDays}
              onSelectionChange={(keys) => setTrainingDays(keys as Set<string>)}
            >
              {weekDayOptions.map((day) => (
                <ListboxItem key={day.key}>{day.label}</ListboxItem>
              ))}
            </Listbox>
          </Card>

          <Card className="max-w-xs">
            <CardHeader className="text-tiny uppercase font-bold">
              <p className="text-md">Select Your Long Run Day:</p>
            </CardHeader>

            <Listbox
              disallowEmptySelection
              aria-label="Long run day"
              selectionMode="single"
              variant="flat"
              selectedKeys={longRunDay}
              onSelectionChange={(keys) => setLongRunDay(keys as Set<string>)}
              disabledKeys={weekDayOptions.map(({ key }) =>
                !trainingDays.has(key) ? key : ""
              )}
            >
              {weekDayOptions.map((day) => (
                <ListboxItem key={day.key}>{day.label}</ListboxItem>
              ))}
            </Listbox>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button color="primary">Start Training Plan</Button>
          <Button>Start over</Button>
        </div>
      </Card>

      <TrainingPlanTable />
    </>
  );
}
