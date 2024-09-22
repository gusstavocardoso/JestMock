const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const getUserById = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = { getUserById };
