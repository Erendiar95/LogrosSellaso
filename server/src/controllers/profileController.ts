import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { userId } = req.params;

    const isOwnProfile = currentUserId === userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarColor: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Comprobar si son amigos si no es su propio perfil
    let isFriend = false;
    if (!isOwnProfile) {
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            { requesterId: currentUserId, addresseeId: userId },
            { requesterId: userId, addresseeId: currentUserId },
          ],
        },
      });
      isFriend = !!friendship;
    }

    // Condición de visibilidad:
    // Si es su propio perfil -> ve todo (FRIENDS + PRIVATE)
    // Si es amigo -> ve FRIENDS
    // Si no es amigo -> no ve nada (o solo perfil público)
    const visibilityCondition = isOwnProfile
      ? {}
      : isFriend
      ? { visibility: 'FRIENDS' }
      : { id: 'impossible_id' }; // no amigos no ven logros privados ni de amigos

    const achievements = await prisma.achievement.findMany({
      where: {
        userId,
        ...visibilityCondition,
      },
      include: {
        reactions: true,
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatarColor: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Estadísticas
    const totalAchievements = achievements.length;

    // Desglose por categorías
    const categoryCounts: Record<string, number> = {};
    achievements.forEach((a) => {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    const favoriteCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Cálculo de racha semanal:
    // Agrupar logros por semana (ISO week o domingo a sábado)
    const calculateWeeklyStreak = (dates: Date[]): number => {
      if (dates.length === 0) return 0;

      // Obtener año y semana clave para cada fecha
      const getWeekKey = (d: Date): string => {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        // Jueves de la semana actual determina el año de la semana
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        const week1 = new Date(date.getFullYear(), 0, 4);
        const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
        return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
      };

      const now = new Date();
      const currentWeekKey = getWeekKey(now);
      const prevWeekDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevWeekKey = getWeekKey(prevWeekDate);

      const weekSet = new Set(dates.map((d) => getWeekKey(new Date(d))));

      // Si no hay logros esta semana ni la anterior, la racha activa es 0
      if (!weekSet.has(currentWeekKey) && !weekSet.has(prevWeekKey)) {
        return 0;
      }

      // Contar semanas hacia atrás
      let streak = 0;
      let checkDate = weekSet.has(currentWeekKey) ? new Date(now) : prevWeekDate;

      while (true) {
        const key = getWeekKey(checkDate);
        if (weekSet.has(key)) {
          streak++;
          // Retroceder 7 días
          checkDate = new Date(checkDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      }

      return streak;
    };

    const achievementDates = achievements.map((a) => new Date(a.date));
    const weeklyStreak = calculateWeeklyStreak(achievementDates);

    res.json({
      user,
      isOwnProfile,
      isFriend,
      stats: {
        totalAchievements,
        weeklyStreak,
        favoriteCategories,
      },
      achievements,
    });
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
