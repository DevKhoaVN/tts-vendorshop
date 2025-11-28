import JWT, { VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncHanlder } from "./index";
import { BadRequestError } from "../core/error.response";
import KeyTokenService, { findUserById } from "../service/keyToken.service";

// Interface payload
interface JwtPayload {
  userId: string;
  [key: string]: any;
}

// Extend Request để lưu user/keyStore
export interface RequestExt extends Request {
  keyStore?: any;
  user?: JwtPayload;
}

// Tạo accessToken + refreshToken
export const createTokenPair = async (
  payload: JwtPayload,
  publicKey: string,
  privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    // verify thử
    JWT.verify(accessToken, publicKey, (error: VerifyErrors | null, decode?: object) => {
      if (error) {
        console.error("Error verify:", error);
      } else {
        console.log("Decode verify:", decode);
      }
    });

    console.log("Tokens:", { accessToken, refreshToken });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Middleware authentication
export const authentication = asyncHanlder(
  async (req: RequestExt, res: Response, next: NextFunction) => {
    const userId = req.headers["x-client-id"] as string;
    if (!userId) throw new BadRequestError("Invalid request UserId");

    const keyStore = await KeyTokenService.findUserById(userId);
    if (!keyStore) throw new BadRequestError("Not found key store");

    const accessToken = req.headers["x-access-token"] as string;
    if (!accessToken) throw new BadRequestError("Invalid request AccessToken");

    try {
      const decode = JWT.verify(accessToken, keyStore.publicKey) as JwtPayload;
      if (userId !== decode.userId) throw new BadRequestError("Invalid user");

      req.keyStore = keyStore;
      req.user = decode;

      return next();
    } catch (error) {
      throw error;
    }
  }
);
