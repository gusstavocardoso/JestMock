const { getUserDetails } = require("../src/userService");
const { getUserById } = require("../src/userRepository");
const { fetchUserDataFromAPI } = require("../src/apiClient");

jest.mock("../src/userRepository");
jest.mock("../src/apiClient");

describe("UserService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("deve retornar os detalhes do usuário com dados da API", async () => {
    getUserById.mockReturnValue({ id: 1, name: "Alice" });
    fetchUserDataFromAPI.mockResolvedValue({ email: "user1@example.com" });

    const userDetails = await getUserDetails(1);

    expect(userDetails).toEqual({
      id: 1,
      name: "Alice",
      email: "user1@example.com",
    });

    expect(getUserById).toHaveBeenCalledWith(1);
    expect(fetchUserDataFromAPI).toHaveBeenCalledWith(1);
  });

  test("deve lançar um erro se o usuário não for encontrado", async () => {
    getUserById.mockReturnValue(null);

    await expect(getUserDetails(3)).rejects.toThrow("User not found");
  });

  test("deve lançar um erro se a chamada da API falhar", async () => {
    getUserById.mockReturnValue({ id: 1, name: "Alice" });
    fetchUserDataFromAPI.mockRejectedValue(new Error("API error"));

    await expect(getUserDetails(1)).rejects.toThrow("API error");

    expect(getUserById).toHaveBeenCalledWith(1);
    expect(fetchUserDataFromAPI).toHaveBeenCalledWith(1);
  });

  test("deve retornar detalhes corretos para múltiplos usuários", async () => {
    getUserById
      .mockReturnValueOnce({ id: 1, name: "Alice" })
      .mockReturnValueOnce({ id: 2, name: "Bob" });

    fetchUserDataFromAPI
      .mockResolvedValueOnce({ email: "alice@example.com" })
      .mockResolvedValueOnce({ email: "bob@example.com" });

    const user1 = await getUserDetails(1);
    const user2 = await getUserDetails(2);

    expect(user1).toEqual({ id: 1, name: "Alice", email: "alice@example.com" });
    expect(user2).toEqual({ id: 2, name: "Bob", email: "bob@example.com" });

    expect(getUserById).toHaveBeenCalledTimes(2);
    expect(fetchUserDataFromAPI).toHaveBeenCalledTimes(2);
  });

  test("deve retornar apenas os dados do usuário se a API não retornar nada", async () => {
    getUserById.mockReturnValue({ id: 1, name: "Alice" });
    fetchUserDataFromAPI.mockResolvedValue(null);

    const userDetails = await getUserDetails(1);

    expect(userDetails).toEqual({
      id: 1,
      name: "Alice",
    });

    expect(getUserById).toHaveBeenCalledWith(1);
    expect(fetchUserDataFromAPI).toHaveBeenCalledWith(1);
  });
});
