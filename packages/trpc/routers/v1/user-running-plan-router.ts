import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { parseTimeInMinutes } from "../../utils/parse-time-to-minutes";
import { gemini } from "../../vendors/gemini";

const planningDaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const userRunningPlanRouter = router({
  get: publicProcedure
    .input(
      z.object({
        distance: z.number(),
        unit: z.enum(["kilometers", "miles"]),
        totalTrainingWeeks: z.number(),
        runningLevel: z.enum(["beginner", "intermediate", "advanced", "elite"]),
        goalTime: z.object({
          hour: z.number(),
          minute: z.number(),
          second: z.number(),
        }),
        hillyType: z.enum(["flat", "rolling", "moderate", "hilly"]),
        weeklyRunningPlan: z.object({
          availableDays: z.array(planningDaySchema),
          longRunDay: planningDaySchema,
        }),
      }),
    )
    .output(
      z.record(
        z.string(),
        z.record(
          planningDaySchema,
          z.object({
            type: z.string(),
            workout: z.string().optional(),
          }),
        ),
      ),
    )
    .query(async ({ input }) => {
      const {
        distance,
        unit,
        totalTrainingWeeks,
        runningLevel,
        goalTime,
        hillyType,
        weeklyRunningPlan,
      } = input;

      const goalTimeMinutes = parseTimeInMinutes(goalTime);
      const goalPacePerKm = goalTimeMinutes / distance;

      const contents = `
You are a world-class running coach. Your task: create a progressive, personalized, and safe running plan for the athlete described below. Your response MUST be a single valid, fully minified JSON object, strictly conforming to the required schema, with absolutely no text, preambles, explanations, markdown, or extra data of any kind outside the JSON object.

Athlete profile:
- Goal distance: ${distance} km
- Goal time: ${goalTime.hour}h ${goalTime.minute}m ${goalTime.second}s (target pace: ${goalPacePerKm.toFixed(2)} min/km)
- Terrain: ${hillyType}
- Experience level: ${runningLevel}
- Available running days per week: ${weeklyRunningPlan.availableDays.length} (${weeklyRunningPlan.availableDays.join(", ")})
- Preferred long run day: ${weeklyRunningPlan.longRunDay}
- Training period: ${totalTrainingWeeks} weeks

REQUIRED JSON SCHEMA (STRICTLY FOLLOW; NO EXTRA FIELDS, FORMATTING, OR WHITESPACE):

{
  "Week 1": {
    "monday":    { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "tuesday":   { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "wednesday": { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "thursday":  { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "friday":    { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "saturday":  { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" },
    "sunday":    { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" }
  },
  "Week 2": {
    // repeat structure; always show all 7 days, lower case keys for all days (e.g. "monday"–"sunday")
  }
  // ...repeat for every week up to "${totalTrainingWeeks}"
}

OUTPUT RULES:
- Top-level keys: exactly "Week 1"..."Week ${totalTrainingWeeks}" (inclusive, counting from 1 to totalTrainingWeeks).
- Each week's object must use all seven days as keys, ordered: monday–sunday, all lowercase.
- For each day, provide only: { "type": "[Running type or 'Rest']", "workout": undefined or "[distance] km (Pace: [pace] min/km)" }
- If the day's "type" is "Rest", then the "workout" must be undefined (i.e., do not include the "workout" field at all for that day).
- For non-running days (not in available days), also set "type" as "Rest" and omit "workout" (set to undefined).
- For running days with a workout, always set both "type" and "workout" as required.
- Schedule runs ONLY on these available days: [${weeklyRunningPlan.availableDays.join(", ")}], never on other days.
- Schedule a "Long Run" on "${weeklyRunningPlan.longRunDay}" every week; it counts as a running day.
- Never schedule more than ${weeklyRunningPlan.availableDays.length} running days/week.
- Every week must list all seven days, ordered monday–sunday, no missing or extra days, all lowercase.
- NEVER add any explanations, line breaks, markdown, sample data, or extra text; ONLY the pure, fully minified JSON object for direct parsing.

Your response must be solely the fully minified, valid JSON object, nothing else.
`;

      const userPlan = await gemini.models.generateContent({
        model: "gemma-3-27b-it",
        contents,
      });

      return JSON.parse(userPlan.text || "{}");
    }),
});
