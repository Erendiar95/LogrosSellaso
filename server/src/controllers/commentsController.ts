import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id: achievementId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ error: 'El comentario no puede estar vacío' });
      return;
    }

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      res.status(404).json({ error: 'Logro no encontrado' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        achievementId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarColor: true,
          },
        },
      },
    });

    // Notificar al autor del logro si es distinto del comentador
    if (achievement.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: achievement.userId,
          actorId: userId,
          achievementId,
          type: 'COMMENT',
          message: `${req.user!.name} comentó en tu logro: "${achievement.title.slice(0, 30)}..."`,
        },
      });
    }

    res.status(201).json({
      message: 'Comentario añadido',
      comment,
    });
  } catch (error) {
    console.error('Error en addComment:', error);
    res.status(500).json({ error: 'Error al añadir el comentario' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { achievement: true },
    });

    if (!comment) {
      res.status(404).json({ error: 'Comentario no encontrado' });
      return;
    }

    // Permitir borrar si es el autor del comentario o el dueño del logro
    if (comment.userId !== userId && comment.achievement.userId !== userId) {
      res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
      return;
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteComment:', error);
    res.status(500).json({ error: 'Error al eliminar el comentario' });
  }
};
