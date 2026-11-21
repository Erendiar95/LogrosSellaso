import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

const VALID_REACTION_TYPES = ['CELEBRATE', 'CLAP', 'STRONG', 'HEART'] as const;

export const toggleReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id: achievementId } = req.params;
    const { type } = req.body;

    if (!VALID_REACTION_TYPES.includes(type)) {
      res.status(400).json({ error: 'Tipo de reacción inválido' });
      return;
    }

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      res.status(404).json({ error: 'Logro no encontrado' });
      return;
    }

    // Comprobar si ya existe la reacción de ese usuario y tipo
    const existing = await prisma.reaction.findUnique({
      where: {
        achievementId_userId_type: {
          achievementId,
          userId,
          type,
        },
      },
    });

    let action: 'ADDED' | 'REMOVED';

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      action = 'REMOVED';
    } else {
      await prisma.reaction.create({
        data: {
          achievementId,
          userId,
          type,
        },
      });
      action = 'ADDED';

      // Crear notificación para el autor del logro si no es él mismo
      if (achievement.userId !== userId) {
        const emojiMap: Record<string, string> = {
          CELEBRATE: '🎉',
          CLAP: '👏',
          STRONG: '💪',
          HEART: '❤️',
        };
        const emoji = emojiMap[type] || '';

        await prisma.notification.create({
          data: {
            userId: achievement.userId,
            actorId: userId,
            achievementId,
            type: 'REACTION',
            message: `${req.user!.name} reaccionó con ${emoji} a tu logro: "${achievement.title.slice(0, 30)}..."`,
          },
        });
      }
    }

    // Obtener lista actualizada de reacciones del logro
    const reactions = await prisma.reaction.findMany({
      where: { achievementId },
      select: {
        id: true,
        type: true,
        userId: true,
      },
    });

    res.json({
      action,
      reactions,
    });
  } catch (error) {
    console.error('Error en toggleReaction:', error);
    res.status(500).json({ error: 'Error al procesar la reacción' });
  }
};
