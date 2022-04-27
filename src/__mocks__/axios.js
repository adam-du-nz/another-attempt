const mockAxios = jest.createMockFromModule("axios");

jest.mock("../auth/adalConfig");
// this is the key to fix the axios.create() undefined error!
mockAxios.create = jest.fn(() => mockAxios);
// general mock axios.get, you can specify response in your test.
mockAxios.get = jest.fn().mockResolvedValue({ data: {} });

export default mockAxios;
