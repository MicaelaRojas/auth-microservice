import { prisma } from "../../db";
import { sign } from "../../auth";
import { hasPassword } from "../../helper/password";
import axios from "axios";

const data = [];

export const index = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).json({
      ok: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const store = async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: { ...req.body },
    });

    return res.status(201).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const upsert = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { ...req.body },
    });

    return res.status(200).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      ok: true,
      data: "User deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(500).json({
        ok: false,
        data: "User not found",
      });
    }

    if ((await hasPassword(req.body.password)) === user.password) {
      user.token = sign({
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(200).json({
        ok: true,
        data: user,
      });
    } else {
      return res.status(500).json({
        ok: false,
        data: "No match",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const callback = async (req, res) => {
  const { code } = req.query;

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: "0d3ecde7f2a2da038e76",
      client_secret: "206186865edd0ea2ebc0447bf8463e40a6e629f2",
      code,
    }
  );

  const access_token = response.data.split("=");

  return res.status(200).json({
    ok: true,
    data: access_token[1].replace("&scope", ""),
  });
};
