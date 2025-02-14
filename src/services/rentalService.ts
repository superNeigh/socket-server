import { RequestStatus } from "@prisma/client";
import db from "./db";

export const updateRentalStatus = async (
  rentalId: string,
  data: any,
  messageId: string,
  room: any
) => {
  let messageContent = "Rental request has been updated";

  // Personnalisation du message en fonction du statut de la demande
  if (data.requestStatus === RequestStatus.CANCELED) {
    messageContent = "Rental request has been canceled";
  } else if (data.requestStatus === RequestStatus.DECLINED) {
    messageContent = "Rental request has been declined";
  } else if (data.requestStatus === RequestStatus.ACCEPTED) {
    messageContent = "Rental request has been accepted";
  } else if (data.requestStatus === RequestStatus.PAID) {
    messageContent = "Rental request has been paid";
  } else {
    messageContent = "Rental request has been updated";
  }

  try {
    let updatedRental;
    if (data.requestStatus === RequestStatus.CANCELED) {
      // Mise à jour pour les demandes annulées
      updatedRental = await db.rental.update({
        where: { id: rentalId },
        data: {
          ...data,
        },
      });
      await db.message.update({
        where: { id: messageId },
        data: {
          sentAt: new Date(),
          content: messageContent,
        },
      });
    } else {
      // Mise à jour pour les autres statuts
      updatedRental = await db.rental.update({
        where: { id: rentalId },
        data: {
          ...data,
        },
      });
      await db.message.update({
        where: { id: messageId },
        data: {
          sentAt: new Date(),
          content: messageContent,
          isResponse: true,
        },
      });
    }

    // Mise à jour de la conversation
    await db.conversation.update({
      where: { id: room.id },
      data: {
        messages: { connect: { id: messageId } },
        lastMessageAt: new Date(),
      },
    });

    return updatedRental;
  } catch (error) {
    console.error("Error updating rental status:", error);
    throw new Error("Failed to update rental status");
  }
};
