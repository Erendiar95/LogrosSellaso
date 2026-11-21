import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
} from '../config/cloudinary.js';

const VALID_CATEGORIES = ['HEALTH', 'STUDIES', 'WORK', 'PERSONAL', 'CREATIVITY', 'OTHER'] as const;

const achievementSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  date: z.string().optional(),
  visibility: z.enum(['FRIENDS', 'PRIVATE']).default('FRIENDS'),
  imageUrl: z.string().optional().nullable(),
});

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { category } = req.query;

    // 1. Obtener lista de IDs de amigos aceptados
    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
    });

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 2. Condición de visibilidad:
    // - Logros propios (cualquier visibilidad: FRIENDS o PRIVATE)
    // - Logros de amigos (SOLO visibilidad FRIENDS)
    const visibilityCondition = {
      OR: [
        { userId }, // Propios
        {
          userId: { in: friendIds },
          visibility: 'FRIENDS', // Amigos solo si no es privado
        },
      ],
    };

    // 3. Filtro opcional por categoría
    const categoryCondition =
      category && category !== 'ALL' && typeof category === 'string'
        ? { category }
        : {};

    const achievements = await prisma.achievement.findMany({
      where: {
        ...visibilityCondition,
        ...categoryCondition,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarColor: true,
          },
        },
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarColor: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ achievements });
  } catch (error) {
    console.error('Error en getFeed:', error);
    res.status(500).json({ error: 'Error al obtener el feed de logros' });
  }
};

export const createAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    let uploadedImageUrl: string | null = null;

    // Si se subió un archivo, procesarlo a través de Cloudinary
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        res.status(400).json({
          error:
            'El almacenamiento en Cloudinary no está configurado. Por favor, define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en el archivo .env',
        });
        return;
      }

      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'logros/achievements');
        uploadedImageUrl = uploadResult.secure_url;
      } catch (uploadError: any) {
        console.error('Error al subir imagen a Cloudinary:', uploadError);
        res.status(500).json({
          error: `Error al subir la imagen a Cloudinary: ${uploadError.message || 'Fallo de subida'}`,
        });
        return;
      }
    }

    // Procesar datos del logro
    const bodyData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      visibility: req.body.visibility,
      imageUrl: uploadedImageUrl || req.body.imageUrl || null,
    };

    const parseResult = achievementSchema.safeParse(bodyData);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { title, description, category, date, visibility, imageUrl } = parseResult.data;

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        title,
        description,
        category,
        date: date ? new Date(date) : new Date(),
        visibility,
        imageUrl: imageUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarColor: true,
          },
        },
        reactions: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarColor: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Logro publicado con éxito',
      achievement,
    });
  } catch (error) {
    console.error('Error en createAchievement:', error);
    res.status(500).json({ error: 'Error al crear logro' });
  }
};

export const getAchievementById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarColor: true,
          },
        },
        reactions: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarColor: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!achievement) {
      res.status(404).json({ error: 'Logro no encontrado' });
      return;
    }

    // Comprobar privacidad: si es privado, solo el autor puede verlo
    if (achievement.visibility === 'PRIVATE' && achievement.userId !== userId) {
      res.status(403).json({ error: 'Este logro es privado' });
      return;
    }

    res.json({ achievement });
  } catch (error) {
    console.error('Error en getAchievementById:', error);
    res.status(500).json({ error: 'Error al obtener el logro' });
  }
};

export const deleteAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      res.status(404).json({ error: 'Logro no encontrado' });
      return;
    }

    if (achievement.userId !== userId) {
      res.status(403).json({ error: 'Solo el creador puede eliminar este logro' });
      return;
    }

    // Si tiene imagen almacenada en Cloudinary, eliminarla también de Cloudinary
    if (achievement.imageUrl) {
      await deleteFromCloudinary(achievement.imageUrl);
    }

    await prisma.achievement.delete({ where: { id } });

    res.json({ message: 'Logro eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteAchievement:', error);
    res.status(500).json({ error: 'Error al eliminar logro' });
  }
};
