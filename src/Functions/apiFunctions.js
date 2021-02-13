import axios from "axios";

// obtained from https://api.nusmods.com/v2/
const apiEndPoint = "https://api.nusmods.com/v2";

// will have to implement some way of updating this information
const acadYear = "2020-2021";

// converts valid NUSMODS modulecode into api
// /{acadYear}/modules/{moduleCode}.json
export const getModDetails = async (moduleCode) => {
  let url = apiEndPoint + "/" + acadYear + "/modules/" + moduleCode + ".json";

  const response = await axios.get(url).then((res) => {
    return res.data;
  });
  return await response;
};
