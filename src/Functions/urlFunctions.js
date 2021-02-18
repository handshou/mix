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
