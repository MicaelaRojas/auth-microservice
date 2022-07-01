import { prisma } from "../../db";

export const index = async (req, res) => {
  try {
    const stories = await prisma.story.findMany();

    return res.status(200).json({
      ok: true,
      data: stories,
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
    const stories = await  prisma.story.create({
      data: { ...req.body },
    });

    return res.status(201).json({
      ok: true,
      data: stories,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const stories = await prisma.story.update({
      where: { id: Number(id) },
      data: { ...req.body },
    });

    return res.status(200).json({
      ok: true,
      data: stories,
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
    await prisma.story.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      ok: true,
      data: "Story deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};