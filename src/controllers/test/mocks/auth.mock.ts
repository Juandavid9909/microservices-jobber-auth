import { IAuthDocument, IAuthPayload } from "@juandavid9909/jobber-shared";
import { Response } from "express";

export const authRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: IAuthPayload | null, params?: unknown) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date | string;
}

export const authUserPayload: IAuthPayload = {
  id: 1,
  username: "Manny",
  email: "manny@test.com",
  iat: 1235282483
};

export const authMock: IAuthDocument = {
  id: 1,
  profilePublicId: "123456789",
  username: "Manny",
  email: "manny@test.com",
  country: "Brazil",
  profilePicture: "",
  emailVerified: 1,
  createdAt: "2023-12-19T08:35:23.461Z",
  comparePassword: () => {},
  hashPassword: () => false
} as unknown as IAuthDocument;