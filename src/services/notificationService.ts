import { NotificationType } from "@prisma/client";
import { NotificationProps } from "../type/NotificationProps";
import db from "./db";

export const createNotification = async (
  senderId: string,
  recipientId: string,
  conversationId: string,
  type: NotificationType,
  body?: string
): Promise<NotificationProps | null> => {
  // Vérifie le type de notification
  if (!type) {
    console.error("Le type de notification est manquant");
    throw new Error("Notification type is missing");
  }

  // Si le corps de la notification n'est pas spécifié, le définir par défaut selon le type
  if (!body) {
    switch (type) {
      case NotificationType.MESSAGE:
        body = "You have a new message.";
        break;
      case NotificationType.RENTAL:
        body = "New rental request received.";
        break;
      case NotificationType.RENTALSTATUS:
        body = "Rental status updated.";
        break;
      case NotificationType.RENTALPAYMENT:
        body = "Rental validated and paid";
        break;
      case NotificationType.REVIEW:
        body = "You have received a new review.";
        break;
      default:
        body = "New notification received.";
        break;
    }
  }

  try {
    // Créer la notification dans la base de données
    const newNotification = await db.notification.create({
      data: {
        createdAt: new Date(),
        conversationId,
        type,
        body,
        isSeen: false,
        sender: {
          connect: { id: senderId },
        },
        recipient: {
          connect: { id: recipientId },
        },
      },
      include: {
        recipient: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                image: true,
              },
            },
            settings: {
              select: {
                emailNotification: true,
                mobileNotification: true,
              },
            },
          },
        },
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    // Connecter la notification à l'utilisateur destinataire
    await db.user.update({
      where: { id: recipientId },
      data: {
        notificationsReceived: {
          connect: { id: newNotification.id },
        },
      },
    });

    console.info("Notification created successfully", {
      notification: newNotification,
    });
    return newNotification as NotificationProps;
  } catch (error) {
    console.error("Error creating new notification:", error);
    throw new Error("Internal Server Error");
  }
};
