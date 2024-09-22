const { fetchUserDataFromAPI } = require("../src/apiClient");

jest.mock("../src/apiClient");

describe("ApiClient", () => {
  test("deve retornar dados simulados da API", async () => {
    // Simula a resposta da API para o usuário 1
    fetchUserDataFromAPI.mockResolvedValueOnce({ email: "user1@example.com" });

    const result = await fetchUserDataFromAPI(1);

    expect(result).toEqual({ email: "user1@example.com" });
  });

  test("deve lançar um erro quando a API falhar", async () => {
    // Simula uma falha de rede
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network error"));

    try {
      await fetchUserDataFromAPI(1);
    } catch (error) {
      expect(error).toEqual(new Error("Network error"));
    }
  });

  test("deve retornar null se a API não retornar dados", async () => {
    // Simula uma resposta nula da API
    fetchUserDataFromAPI.mockResolvedValueOnce(null);

    const result = await fetchUserDataFromAPI(999); // Simula um usuário inexistente
    expect(result).toBeNull();
  });

  test("deve simular uma chamada demorada da API", async () => {
    jest.useFakeTimers();

    const mockResponse = { email: "delayed@example.com" };

    // Simulação de atraso
    const delayedFetch = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResponse), 5000);
      });
    };

    fetchUserDataFromAPI.mockImplementationOnce(delayedFetch);

    const promise = fetchUserDataFromAPI(1);

    // Avanços no tempo
    jest.advanceTimersByTime(5000);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});
