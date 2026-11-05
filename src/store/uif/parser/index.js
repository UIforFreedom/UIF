import {
  Clash2UIF
} from "./clash2uif.js";

import {
  V2rayN2UIF
} from "./v2rayn2uif.js";

import {
  UIFRaw
} from "./uif_share.js";

import {
  Sing2UIF
} from "./sing2uif.js";

export default function TryParse(inputData) {
  console.log(inputData)
  try {
    var res = V2rayN2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as v2rayn", error);
  }

  try {
    var res = UIFRaw(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as uif", error);
  }

  try {
    var res = Clash2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as clash: ", error);
  }

  try {
    var res = Sing2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as sb", error);
  }
  return [];
}
