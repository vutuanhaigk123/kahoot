import axios from "axios";

export const handlePost = async (api, data) => {
  try {
    const resp = await axios.post(api, data);
    return resp.data;
  } catch (error) {
    console.log("🚀 ~ file: fetch.js:8 ~ handlePost ~ error", error);
  }
};

export const handleGet = async (api) => {
  try {
    const resp = await axios.get(api);
    return resp.data;
  } catch (error) {
    console.log("🚀 ~ file: fetch.js ~ line 16 ~ handleGet ~ error", error);
  }
};
