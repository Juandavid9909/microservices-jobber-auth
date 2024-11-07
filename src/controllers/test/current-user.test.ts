import { authMock, authMockRequest, authMockResponse, authUserPayload } from "@auth/controllers/test/mocks/auth.mock";
import { read } from "@auth/controllers/current-user";
import { Request, Response } from "express";
import * as auth from "@auth/services/auth.service";

jest.mock("@auth/services/auth.service");
jest.mock("@juandavid9909/jobber-shared");
jest.mock("@auth/queues/auth.producer");
jest.mock("@elastic/elasticsearch");

const USERNAME: string = "Manny";
const PASSWORD: string = "manny1";

describe("CurrentUser", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("read method", () => {
    it("should return authenticated user", async () => {
      const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload) as unknown as Request;
      const res: Response = authMockResponse();

      jest.spyOn(auth, "getAuthUserById").mockResolvedValue(authMock);

      await read(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authenticated user",
        user: authMock
      });
    });

    it("should return empty user", async () => {
      const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload) as unknown as Request;
      const res: Response = authMockResponse();

      jest.spyOn(auth, "getAuthUserById").mockResolvedValue({} as never);

      await read(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authenticated user",
        user: null
      });
    });
  });
});
