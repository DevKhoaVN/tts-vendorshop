import _ from "lodash";
import crypto from "crypto";
import {Schema ,Types } from "mongoose";


type AnyObject = Record<string, any>;

interface FindModelExistParams<T> {
  model: { findOne: (filter: object) => { lean: () => Promise<T | null> } };
  filter: object;
}

interface GetInfoDataParams {
  fields?: string[];
  object?: AnyObject;
}

// 1. Find one document and lean
export const findModelExist = async <T>({ model, filter }: FindModelExistParams<T>): Promise<T | null> => {
  return await model.findOne(filter).lean();
};

// 2. Convert id to MongoDB ObjectId
export const convertToObjectMongodb = (id: string) => new Schema.Types.ObjectId(id);

// 3. Pick fields from object
export const getInforData = ({ fields = [], object = {} }: GetInfoDataParams): AnyObject => {
  return _.pick(object, fields);
};

// 4. Async handler for Express middleware
export const asyncHanlder = (fn: any) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 5. Generate RSA public/private key
export const generatePublicPrivateKey = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
};

// 6. Convert array to MongoDB select object
export const getSelectData = (select: string[] = []): AnyObject => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const unSelectData = (select: string[] = []): AnyObject => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

// 7. Remove undefined/null values
export const removeUndefineValueInObject = (object: AnyObject = {}): AnyObject => {
  Object.keys(object).forEach((k) => {
    if (object[k] == null) delete object[k];
  });
  return object;
};

// 8. Update nested object parser (flatten nested objects)
export const updateNestedObjectPaser = (object: AnyObject): AnyObject => {
  const final: AnyObject = {};

  const helper = (obj: AnyObject, prefix = "") => {
    Object.keys(obj).forEach((k) => {
      const value = obj[k];
      const keyName = prefix ? `${prefix}.${k}` : k;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        helper(value, keyName);
      } else {
        final[keyName] = value;
      }
    });
  };

  helper(object);
  return final;
};
