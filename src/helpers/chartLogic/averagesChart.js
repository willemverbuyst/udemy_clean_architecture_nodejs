import { getWeekNumber } from '../logDataLogic';
import { chunkArray, reduceDates } from '../utils';

// STEP LINE CHART, average travel time per week
export const getAveragePerWeekData = (logData) => {
  // Combine all the days with the same date
  const reducedDates = reduceDates(logData);
  // Get groups of 5
  const weeks = chunkArray(reducedDates, 5);
  const averages = weeks.map((week) => getAveragePerWeek(week));
  const labels = weeks.map((a) => `w${getWeekNumber(a[0].date)[1]}`);
  const maxForDisplay = Math.max(...averages) * 1.2;
  const title = `AVERAGE TRAVEL TIMES PER WEEK`;

  return {
    averages,
    labels,
    maxForDisplay,
    title,
  };
};

const getAveragePerWeek = (week) => {
  const weekWithoutDayOff = week.filter((day) => day.statusOfDay !== 'day off');
  const average =
    weekWithoutDayOff.length > 0
      ? weekWithoutDayOff
          .map((day) =>
            day.statusOfDay === 'working from home' ? 0 : day.durationTrip
          )
          .reduce((a, b) => a + b) / weekWithoutDayOff.length
      : 0;

  return average;
};
