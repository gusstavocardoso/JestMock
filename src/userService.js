const { getUserById } = require("./userRepository");
const { fetchUserDataFromAPI } = require("./apiClient");

const getUserDetails = async (id) => {
  const user = getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const apiData = await fetchUserDataFromAPI(id);
  return { ...user, ...apiData };
};

module.exports = { getUserDetails };
