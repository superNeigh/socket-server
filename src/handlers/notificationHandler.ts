import { NotificationProps, NotificationType } from "../type/NotificationProps";
import { emitNotification } from "../utils/socketEmitter";

export const notificationHandler = async (
  senderId: string,
  recipientId: string,
  conversationId: string,
  type: NotificationType,
  body?: string
) => {
  // Vérification du type de notification avant de continuer
  if (!type) {
    console.error("Le type de notification est manquant");
    throw new Error("Notification type is missing");
  }

  console.log(
    `**Nouvelle notification reçue de l'utilisateur ${senderId} à l'utilisateur ${recipientId} avec le type ${type} et le corps ${body}`
  );

  // Définir le corps de la notification selon le type si non fourni
  if (!body) {
    switch (type) {
      case NotificationType.MESSAGE:
        body = "You have a new message.";
        break;
      case NotificationType.RENTAL:
        body = "New rental request received.";
        break;
      case NotificationType.RENTALSTATUS:
        body = body || "Rental status updated.";
        break;
      case NotificationType.RENTALPAYMENT:
        body = "Rental validated and paid";
        break;
      case NotificationType.REVIEW:
        body = "You have received a new review.";
        break;
      default:
        body = body || "New notification received.";
        break;
    }
  }
  console.log(
    `>>>Envoi de la notification avant le try avec le type ${type} et le corps ${body}`
  );
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/emitNotification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          recipientId: recipientId,
          conversationId: conversationId,
          type,
          body,
        }),
      }
    );

    if (response.status === 200) {
      const notificationData = (await response.json()) as NotificationProps;
      // console.log(`***200 Notification Data:`, notificationData);
      emitNotification(recipientId, "notification", notificationData);
    } else {
      throw new Error(">>>Échec de la gestion de la notification");
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de la notification:", error);
  }
};
