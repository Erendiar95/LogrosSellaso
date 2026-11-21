import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFriends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Amistades aceptadas (donde el usuario es solicitante o destinatario)
    const acceptedFriendships = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatarColor: true, bio: true },
        },
        addressee: {
          select: { id: true, name: true, email: true, avatarColor: true, bio: true },
        },
      },
    });

    // Mapear al amigo correspondiente
    const friends = acceptedFriendships.map((f) => {
      const friendUser = f.requesterId === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        since: f.updatedAt,
        ...friendUser,
      };
    });

    // Solicitudes pendientes recibidas
    const pendingReceived = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: 'PENDING',
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatarColor: true, bio: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Solicitudes pendientes enviadas
    const pendingSent = await prisma.friendship.findMany({
      where: {
        requesterId: userId,
        status: 'PENDING',
      },
      include: {
        addressee: {
          select: { id: true, name: true, email: true, avatarColor: true, bio: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      friends,
      pendingReceived,
      pendingSent,
    });
  } catch (error) {
    console.error('Error en getFriends:', error);
    res.status(500).json({ error: 'Error al obtener lista de amigos' });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const query = (req.query.q as string || '').trim().toLowerCase();

    if (!query || query.length < 2) {
      res.json({ users: [] });
      return;
    }

    // Buscar usuarios que coincidan con nombre o email
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarColor: true,
        bio: true,
      },
      take: 20,
    });

    // Obtener relaciones de amistad del usuario actual con los resultados
    const targetIds = users.map((u) => u.id);
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: { in: targetIds } },
          { requesterId: { in: targetIds }, addresseeId: currentUserId },
        ],
      },
    });

    const results = users.map((u) => {
      const friendship = friendships.find(
        (f) =>
          (f.requesterId === currentUserId && f.addresseeId === u.id) ||
          (f.addresseeId === currentUserId && f.requesterId === u.id)
      );

      let status: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' = 'NONE';
      let friendshipId: string | null = null;

      if (friendship) {
        friendshipId = friendship.id;
        if (friendship.status === 'ACCEPTED') {
          status = 'ACCEPTED';
        } else if (friendship.status === 'PENDING') {
          status =
            friendship.requesterId === currentUserId
              ? 'PENDING_SENT'
              : 'PENDING_RECEIVED';
        }
      }

      return {
        ...u,
        friendshipStatus: status,
        friendshipId,
      };
    });

    res.json({ users: results });
  } catch (error) {
    console.error('Error en searchUsers:', error);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};

export const sendFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requesterId = req.user!.id;
    const { addresseeId } = req.body;

    if (!addresseeId) {
      res.status(400).json({ error: 'addresseeId es requerido' });
      return;
    }

    if (requesterId === addresseeId) {
      res.status(400).json({ error: 'No puedes enviarte una solicitud de amistad a ti mismo' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id: addresseeId } });
    if (!targetUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si ya existe relación previa
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        res.status(400).json({ error: 'Ya sois amigos' });
        return;
      }
      if (existing.status === 'PENDING') {
        res.status(400).json({ error: 'Ya existe una solicitud pendiente' });
        return;
      }
      // Si fue rechazada previamente, reactivarla
      const updated = await prisma.friendship.update({
        where: { id: existing.id },
        data: {
          requesterId,
          addresseeId,
          status: 'PENDING',
        },
      });

      // Crear notificación
      await prisma.notification.create({
        data: {
          userId: addresseeId,
          actorId: requesterId,
          type: 'FRIEND_REQUEST',
          message: `${req.user!.name} te ha enviado una solicitud de amistad`,
        },
      });

      res.json({ message: 'Solicitud de amistad enviada', friendship: updated });
      return;
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING',
      },
    });

    // Notificación
    await prisma.notification.create({
      data: {
        userId: addresseeId,
        actorId: requesterId,
        type: 'FRIEND_REQUEST',
        message: `${req.user!.name} te ha enviado una solicitud de amistad`,
      },
    });

    res.status(201).json({ message: 'Solicitud de amistad enviada', friendship });
  } catch (error) {
    console.error('Error en sendFriendRequest:', error);
    res.status(500).json({ error: 'Error al enviar solicitud de amistad' });
  }
};

export const respondFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { action } = req.body; // 'ACCEPT' | 'REJECT'

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      res.status(400).json({ error: "La acción debe ser 'ACCEPT' o 'REJECT'" });
      return;
    }

    const friendship = await prisma.friendship.findUnique({ where: { id } });
    if (!friendship) {
      res.status(404).json({ error: 'Solicitud no encontrada' });
      return;
    }

    // Solo el destinatario puede responder a la solicitud
    if (friendship.addresseeId !== userId) {
      res.status(403).json({ error: 'No tienes permiso para responder a esta solicitud' });
      return;
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    const updated = await prisma.friendship.update({
      where: { id },
      data: { status: newStatus },
      include: {
        requester: { select: { id: true, name: true } },
      },
    });

    if (action === 'ACCEPT') {
      // Notificar al solicitante que fue aceptado
      await prisma.notification.create({
        data: {
          userId: friendship.requesterId,
          actorId: userId,
          type: 'FRIEND_ACCEPTED',
          message: `${req.user!.name} ha aceptado tu solicitud de amistad`,
        },
      });
    }

    res.json({
      message: action === 'ACCEPT' ? 'Solicitud aceptada' : 'Solicitud rechazada',
      friendship: updated,
    });
  } catch (error) {
    console.error('Error en respondFriendRequest:', error);
    res.status(500).json({ error: 'Error al responder solicitud de amistad' });
  }
};

export const removeFriend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const friendship = await prisma.friendship.findUnique({ where: { id } });
    if (!friendship) {
      res.status(404).json({ error: 'Relación de amistad no encontrada' });
      return;
    }

    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      res.status(403).json({ error: 'No tienes permiso para eliminar esta amistad' });
      return;
    }

    await prisma.friendship.delete({ where: { id } });

    res.json({ message: 'Amistad eliminada correctamente' });
  } catch (error) {
    console.error('Error en removeFriend:', error);
    res.status(500).json({ error: 'Error al eliminar amistad' });
  }
};
