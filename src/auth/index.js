import jwt from "jsonwebtoken";
import { secret } from "../../config";

export const sign = (payload) => {
  return jwt.sign(payload, secret);
};

const verify = (token) => {
  return jwt.verify(token, secret);
};

const getToken = (authorization, res) => {
  if (authorization === null) {
    return res.json({
      ok: false,
      status: 403,
      data: { message: "Token not found" },
    });
  }

  if (authorization.indexOf("Bearer") === -1) {
    return res.json({
      res,
      ok: false,
      status: 403,
      data: { message: "Format token invalid" },
    });
  }
  return authorization.split(" ")[1];
};

export const checkToken = (req, res, next) => {

  const authorization = req.headers.authorization || null;

  const token = getToken(authorization, res);

  const decoded = verify(token);

  if (!decoded) {
    return res.json({
      res,
      ok: false,
      status: 403,
      data: { message: "Invalid Token" },
    });
  }

  req.decoded = decoded;
  next();
};
