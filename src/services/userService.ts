import db from "./db";

export const updateUserAverageResponseTime = async (senderId: string) => {
  if (!senderId) {
    throw new Error("senderId manquant");
  }

  try {
    const existingUser = await db.user.findUnique({ where: { id: senderId } });

    if (!existingUser) {
      throw new Error(`Utilisateur avec id ${senderId} non trouvé`);
    }

    const userMessages = await db.message.findMany({
      where: { senderId, responseTime: { not: 0 } },
    });

    if (userMessages.length === 0) {
      return { message: "Aucun message avec responseTime" };
    }

    const totalResponseTime = userMessages.reduce(
      (sum: number, msg: any) => sum + msg.responseTime,
      0
    );
    const averageResponseTime = totalResponseTime / userMessages.length;

    await db.user.update({
      where: { id: senderId },
      data: { metrics: { responseTime: averageResponseTime } },
    });

    return { message: "Temps de réponse moyen mis à jour" };
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du temps de réponse moyen de l'utilisateur ${senderId}:`,
      error
    );
    throw new Error("Erreur interne du serveur");
  }
};
