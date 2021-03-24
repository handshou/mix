const baseDate = toDate("Jan 11 2021 0:00 GMT+8").getTime();

function getCurrentWeek() {
  const today = new Date();
  if (baseDate > today) return 0;
  return Math.ceil((today - baseDate) / (1000 * 60 * 60 * 24 * 7));
}

function getModules(data) {
  try {
    const weekInMilliSeconds = 1000 * 3600 * 24 * 7;
    if (data == null) return [];

    return data.map((d) => {
      const {  startTime, endTime, eventName, eventType, studentId = ""  } = d;
      return {
        id: `${startTime}-${eventName}-${eventType}-${studentId}`,
        studentId: studentId,
        week: Math.floor((startTime - baseDate) / weekInMilliSeconds) + 1,
        title: eventName,
        type: eventType,
        startTime: String(toDate(startTime).getHours())
          .padStart(2, "0")
          .concat(String(toDate(startTime).getMinutes()).padEnd(2, "0")),
        endTime: String(toDate(endTime).getHours())
          .padStart(2, "0")
          .concat(String(toDate(endTime).getMinutes()).padEnd(2, "0")),
        day: toDate(startTime).toLocaleString("en-us", { weekday: "long" }),
      };
    });
  } catch (error) {
    throw new Error(error);
  }
}

function toDate(date) {
  return new Date(date);
}

function getNextStartTime(currentTime, minutesInterval) {
  currentTime = parseInt(currentTime) + minutesInterval;
  let minutes = String(currentTime).slice(-2);
  if (parseInt(minutes) >= 60) {
    currentTime = parseInt(currentTime) - 60 + 100 + (minutes % 60);
  }
  return String(currentTime).padStart(4, "0");
}

function getStartEndTimeByWeek(allModules, weekNumber) {
  // default timings
  let startTime = "0800";
  let endTime = "1800";
  const weekModules = allModules.filter(
    (module) => parseInt(module.week) === parseInt(weekNumber)
  );
  weekModules.forEach((module) => {
    if (parseInt(module.startTime) < parseInt(startTime)) {
      startTime = module.startTime;
    }
    if (parseInt(module.endTime) > parseInt(endTime)) {
      endTime = module.endTime;
    }
  });
  return { startTime, endTime };
}

function generateRows(startTime, endTime, minutesInterval, modules) {
  let result = [];
  let modules_result = [];

  function isStartTimeSlot(currentTime, moduleStartTime) {
    return currentTime === moduleStartTime;
  }

  function isMidTimeSlot(currentTime, moduleStartTime, moduleEndTime) {
    return currentTime > moduleStartTime && currentTime < moduleEndTime;
  }

  while (parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);
    if (modules) {
      // condition to check if module should be pushed
      let suitableModules = modules.filter(
        (m) =>
          isStartTimeSlot(startTime, m.startTime) ||
          isMidTimeSlot(startTime, m.startTime, m.endTime)
      );
      modules_result.push(suitableModules);
    }
    startTime = getNextStartTime(startTime, minutesInterval);
  }
  if (modules == null)
    // [startTime, + minutesInterval, ..., endTime]
    return result;
  if (modules) return modules_result;
}

const filterModules = (data, week, day) => {
  return getModules(data)
    .filter((_data) => _data.week === week)
    .filter((_data) => _data.day.includes(day));
};

export {
  getModules,
  getStartEndTimeByWeek,
  generateRows,
  filterModules,
  getCurrentWeek,
};
