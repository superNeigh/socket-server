import { Socket } from "socket.io";
import {
  RentalProps,
  RentalStatus,
  RequestStatus,
  UserMatchStatus,
} from "../type/RentalProps";
import { ConversationProps } from "../type/ConversationProps";

export const requestStatusHandler = async (
  socket: Socket,
  rentalId: string,
  status: RequestStatus,
  messageId: string,
  conversation: ConversationProps
) => {
  try {
    let updateReantalData = {};
    switch (status) {
      case "ACCEPTED":
        updateReantalData = {
          requestStatus: RequestStatus.ACCEPTED,
          ownerMatchStatus: UserMatchStatus.ACCEPTED,
          requestState: { update: { isAccepted: true, isPending: false } },
        };
        break;
      case "DECLINED":
        updateReantalData = {
          requestStatus: RequestStatus.DECLINED,
          ownerMatchStatus: UserMatchStatus.DECLINED,
          requestState: { update: { isDeclined: true, isPending: false } },
        };
        break;
      case "CANCELED":
        updateReantalData = {
          requestStatus: RequestStatus.CANCELED,
          renterMatchStatus: UserMatchStatus.CANCELED,
          requestState: { update: { isCanceled: true, isPending: false } },
        };
        break;
      case "PAID":
        updateReantalData = {
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
    // Update rental status and message sentAt
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/updateRentalStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rentalId,
            data: updateReantalData,
            messageId,
            room: conversation,
          }),
        }
      );
      if (response.status === 200) {
        console.log(
          `Rental status updated to ${status} for rental ${rentalId}`
        );
        const updatedRental = (await response.json()) as RentalProps;
        socket.to(conversation.id).emit("request-status-updated", {
          rentalId: updatedRental.id,
          newStatus: status,
          newRental: updatedRental,
          messageId,
        });
      } else {
        console.error(
          `Error updating rental status to ${status}:`,
          response.statusText
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
