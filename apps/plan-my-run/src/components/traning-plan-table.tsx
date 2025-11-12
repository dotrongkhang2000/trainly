"use client";

import { useTRPC } from "@/vendors/trpc/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  cn,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export interface DayPlan {
  type: string;
  workout?: string | null;
}

const columns = [
  { key: "week", label: "Week & Total Weekly Distance" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const renderDay = (day: DayPlan) => {
  return (
    <div>
      <p className="font-medium">{day?.type}</p>
      {day?.workout && <p className="text-xs text-gray-500">{day?.workout}</p>}
    </div>
  );
};

export const TrainingPlanTable = () => {
  const trpc = useTRPC();

  const { data: plan } = useQuery(
    trpc.v1.userRunningPlan.get.queryOptions({
      distance: 10,
      unit: "kilometers",
      hillyType: "flat",
      runningLevel: "intermediate",
      weeklyRunningPlan: {
        longRunDay: "sunday",
        availableDays: ["monday", "wednesday", "friday", "sunday"],
      },
      totalTrainingWeeks: 7,
      goalTime: { hour: 0, minute: 60, second: 0 },
    })
  );

  const rows = Object.values(plan || {}).map((week, order) => ({
    key: order,
    week: <div>Week {order + 1}</div>,
    monday: renderDay({ type: week.monday.type, workout: week.monday.workout }),
    tuesday: renderDay({
      type: week.tuesday.type,
      workout: week.tuesday.workout,
    }),
    wednesday: renderDay({
      type: week.wednesday.type,
      workout: week.wednesday.workout,
    }),
    thursday: renderDay({
      type: week.thursday.type,
      workout: week.thursday.workout,
    }),
    friday: renderDay({ type: week.friday.type, workout: week.friday.workout }),
    saturday: renderDay({
      type: week.saturday.type,
      workout: week.saturday.workout,
    }),
    sunday: renderDay({
      type: week.sunday.type,
      workout: week.sunday.workout,
    }),
  }));

  return (
    <Table aria-label="Training plan">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
