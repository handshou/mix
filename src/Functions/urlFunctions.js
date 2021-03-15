// converts valid NUSMODS timetable into a 2d array of mods and slots
// throws error message --> Should catch in parent
export const convertURLtoArray = (URL) => {
  // very basic validation for URL to ensure its the right URL
  if (
    URL.includes("https://nusmods.com/timetable/") &&
    URL.includes("/share?") &&
    URL.split("?")[1] !== undefined
  ) {
    let split = URL.split("?")[1];
    if (!split) {
      return [];
    }
    let mods = URL.split("?")[1];

    // formats url into array of module codes and slots into a single string
    // ["ACC3619=SEC:A3", "GES1041=TUT:D6,LEC:1", "IS4100=TUT:2,LEC:1", "IS4234=TUT:2,LEC:1", "IS4261=LEC:1"]
    let modsArray = mods.split("&");

    // breaks previous array into sub arrays where each array has [0] being module code, [>0] being slots taken
    // 00: (2) ["ACC3619", "SEC:A3"]
    // 01: (3) ["GES1041", "TUT:D6", "LEC:1"]
    // 02: (3) ["IS4100", "TUT:2", "LEC:1"]
    // 03: (3) ["IS4234", "TUT:2", "LEC:1"]
    // 04: (2) ["IS4261", "LEC:1"]
    return modsArray.map((mod) => {
      return mod.split(/=|,/);
    });
  } else {
    console.log("Invalid URL entered");
    throw "Invalid URL entered";
  }
};

// uses  arry of modandclasses: ["ACC3619", "SEC:A3"]
// and correct specific class details from nusmods to find the correct time slot
// returns [{moduleCode, lessonType, startTime, endTime, weeks, day}]
export const findCorrectTimeslot = (
  modAndClass,
  specificClassDetails,
  semester
) => {
  // removes module code
  let correctTimeSlots = modAndClass.slice(1).map((classSlot, index) => {
    // obtain "SEC" "A3" from mod and class array
    let typeAndSlot = classSlot.split(":");
    let semesterSpecificTimetable;

    specificClassDetails.semesterData.forEach((semesterData) => {
      // check data for correct semester information
      if (semesterData.semester === semester) {
        semesterSpecificTimetable = semesterData.timetable;
      }
    });

    // console.log(typeAndSlot);
    // console.log(semesterSpecificTimetable);

    let correctTimeSlot;
    if (semesterSpecificTimetable === undefined) {
      correctTimeSlot = [];
    } else {
      semesterSpecificTimetable.forEach((classTimeTable) => {
        // compares LEC with lecture
        // compares SEC with sectional
        // compares TUT with tutorial
        // compares LAB with laboratory
        if (
          JSON.stringify(classTimeTable.lessonType)
            .substring(1, 4)
            .toLowerCase() ===
            JSON.stringify(typeAndSlot[0]).substring(1, 4).toLowerCase() &&
          classTimeTable.classNo === typeAndSlot[1]
        ) {
          if (
            classTimeTable.lessonType !== undefined &&
            classTimeTable.startTime !== undefined &&
            classTimeTable.endTime !== undefined &&
            classTimeTable.weeks !== undefined &&
            classTimeTable.day !== undefined
          ) {
            correctTimeSlot = {
              moduleCode: modAndClass[0],
              lessonType: classTimeTable.lessonType,
              startTime: classTimeTable.startTime,
              endTime: classTimeTable.endTime,
              weeks: classTimeTable.weeks,
              day: classTimeTable.day,
            };
          }
        }
      });
    }
    return correctTimeSlot;
  });
  //console.log(correctTimeSlots)
  return correctTimeSlots;
};

// week 1 day 1: Mon 11 Jan 2021
export const convertWeekDayTimeToTimestamp = (weekNumber, day, time) => {
  let basedate = new Date("Jan 11 2021 0:00 GMT+8");
  // map accomodate for lowercase first letter as well incase of formatting issue on NUSMODs api
  let dayMap = {
    Monday: 0,
    monday: 0,
    Tuesday: 1,
    tuesday: 1,
    Wednesday: 2,
    wednesday: 2,
    Thursday: 3,
    thursday: 3,
    Friday: 4,
    friday: 4,
    Saturday: 5,
    saturday: 5,
    Sunday: 6,
    sunday: 6,
  };
  // setting days, accounting for recess week
  if (weekNumber > 6) {
    basedate.setDate(basedate.getDate() + 7 * weekNumber + dayMap[day]);
  } else {
    basedate.setDate(basedate.getDate() + 7 * (weekNumber - 1) + dayMap[day]);
  }

  let hoursOffset = time.substring(0, 2);
  let minutesOffset = time.substring(2, 4);
  // convert time into minutes then find number of milliseconds total (60,000 ms/min)
  let timeoffset =
    (parseInt(hoursOffset) * 60 + parseInt(minutesOffset)) * 60000;
  var calculatedDate = new Date(basedate.getTime() + timeoffset);

  // console.log(calculatedDate);
  return calculatedDate.getTime();
};
