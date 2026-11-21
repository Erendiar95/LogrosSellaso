import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: { id: true, name: true, avatarColor: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error en getNotifications:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      res.status(404).json({ error: 'Notificación no encontrada' });
      return;
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error en markAsRead:', error);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error en markAllAsRead:', error);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
};
