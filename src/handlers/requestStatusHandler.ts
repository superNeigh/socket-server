import { Socket } from "socket.io";
import { RentalProps } from "../type/RentalProps";
import { ConversationProps } from "../type/ConversationProps";
import { RentalStatus, RequestStatus, UserMatchStatus } from "@prisma/client";
import { updateRentalStatus } from "../services/rentalService";

export const requestStatusHandler = async (
  socket: Socket,
  rentalId: string,
  status: RequestStatus,
  messageId: string,
  conversation: ConversationProps
) => {
  try {
    let updateRentalData = {};
    switch (status) {
      case "ACCEPTED":
        updateRentalData = {
          requestStatus: RequestStatus.ACCEPTED,
          ownerMatchStatus: UserMatchStatus.ACCEPTED,
          requestState: { update: { isAccepted: true, isPending: false } },
        };
        break;
      case "DECLINED":
        updateRentalData = {
          requestStatus: RequestStatus.DECLINED,
          ownerMatchStatus: UserMatchStatus.DECLINED,
          requestState: { update: { isDeclined: true, isPending: false } },
        };
        break;
      case "CANCELED":
        updateRentalData = {
          requestStatus: RequestStatus.CANCELED,
          renterMatchStatus: UserMatchStatus.CANCELED,
          requestState: { update: { isCanceled: true, isPending: false } },
        };
        break;
      case "PAID":
        updateRentalData = {
          requestStatus: RequestStatus.PAID,
          rentalStatus: RentalStatus.UPCOMING,
          renterMatchStatus: UserMatchStatus.PAID,
          requestState: { update: { isPaid: true } },
        };
        break;
      default:
        socket.emit("error", "Invalid status");
        return;
    }

    // Appel à l'API pour mettre à jour le statut de location
    try {
      const rental = (await updateRentalStatus(
        rentalId,
        updateRentalData,
        messageId,
        conversation
      )) as RentalProps;

      if (rental) {
        console.log(
          `Rental status updated to ${status} for rental ${rentalId}`
        );

        socket.to(conversation.id).emit("request-status-updated", {
          rentalId: rental.id,
          newStatus: status,
          newRental: rental,
          messageId,
        });
      } else {
        console.error(
          `Failed to update rental status to ${status} for rental ${rentalId}`
        );
        socket.emit("error", `Failed to update rental status to ${status}`);
      }
    } catch (error) {
      console.error(`Error updating rental status to ${status}:`, error);
      socket.emit("error", `Failed to update rental status to ${status}`);
      return;
    }
    console.info(`>>Rental status updated to ${status} for rental ${rentalId}`);
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du statut de location à ${status}:`,
      error
    );
    socket.emit("error", `Failed to update rental status to ${status}`);
  }
};
