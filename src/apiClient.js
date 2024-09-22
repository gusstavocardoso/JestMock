const fetchUserDataFromAPI = async (id) => {
  // Simulação de uma chamada externa
  return { email: `user${id}@example.com` };
};

module.exports = { fetchUserDataFromAPI };
