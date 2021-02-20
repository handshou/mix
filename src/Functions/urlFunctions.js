// converts valid NUSMODS timetable into a 2d array of mods and slots
export const convertURLtoArray = (URL) => {
  // very basic validation for URL to ensure its the right URL
  if (
    URL.includes("https://nusmods.com/timetable/") &&
    URL.includes("/share?")
  ) {
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
      return mod.split(/=|\,/);
    });
  } else {
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
      if (semesterData.semester == semester) {
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
        // idk about lab
        if (
          JSON.stringify(classTimeTable.lessonType)
            .substring(1, 4)
            .toLowerCase() ==
            JSON.stringify(typeAndSlot[0]).substring(1, 4).toLowerCase() &&
          classTimeTable.classNo == typeAndSlot[1]
        ) {
          console.log(classTimeTable);
          correctTimeSlot = {
            moduleCode: modAndClass[0],
            lessonType: classTimeTable.lessonType,
            startTime: classTimeTable.startTime,
            endTime: classTimeTable.endTime,
            weeks: classTimeTable.weeks,
            day: classTimeTable.day,
          };
        }
      });
    }
    return correctTimeSlot;
  });
  return correctTimeSlots;
};

export const convertWeekDayTimeToTimestamp = (weekNumber, day, time) => {

}