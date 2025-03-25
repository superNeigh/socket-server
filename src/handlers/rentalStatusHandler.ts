import { RentalStatus, UserMatchStatus } from "@prisma/client";
import { Socket } from "socket.io";
import { updateRentalStatus } from "../services/rentalService";

export const rentalStatusHandler = async (
  socket: Socket,
  transactionId: string,
  rentalId: string,
  status: RentalStatus
) => {
  try {
    let updateRental = {};
    switch (status) {
      case "IN_PROGRESS":
        updateRental = {
          rentalStatus: RentalStatus.IN_PROGRESS,
          renterMatchStatus: UserMatchStatus.ITEM_RECEIVED,
          ownerMatchStatus: UserMatchStatus.ITEM_GIVEN,
          rentalState: {
            isItemGiven: true,
            isItemReceived: true,
            isItemInProgress: true,
          },
        };
        break;
      case "ACTION_REQUIRED":
        updateRental = {
          rentalStatus: RentalStatus.ACTION_REQUIRED,
          renterMatchStatus: UserMatchStatus.ITEM_RETURNED,
          ownerMatchStatus: UserMatchStatus.ITEM_ACCEPTED,
          rentalState: {
            isActionRequired: true,
            isItemReturned: true,
            isItemAccepted: true,
          },
        };
        break;
      case "COMPLETED":
        updateRental = {
          rentalStatus: RentalStatus.COMPLETED,
          renterMatchStatus: UserMatchStatus.COMPLETED,
          ownerMatchStatus: UserMatchStatus.COMPLETED,
          rentalState: { isActionRequired: false, isCompleted: true },
        };
        break;

      default:
        socket.emit("error", "Invalid status");
        return;
    }
    // Call the API to update the rental status
    try {
      const rental = await updateRentalStatus(rentalId, updateRental);

      if (rental) {
        console.log(
          `Rental status updated to ${status} for transaction ${rentalId}`
        );

        socket.emit("rental-status-updated", {
          transactionId: transactionId,
          newStatus: status,
          newRental: rental,
        });
        console.info(`"Rental status update", ${status}`);

        // Emit notify-status-update to all connected clients
        socket.broadcast.emit("notify-status-update", transactionId, status);
      } else {
        console.error(
          `❌ [rentalStatusHandler] ***Error while updating transaction ${rentalId} status to ${status}`
        );
        socket.emit("error", "Error while updating transaction status");
      }
      console.log(
        `✅ [rentalStatusHandler] ***Transaction ${rentalId} status updated to ${status}`
      );
    } catch (error) {
      console.error(
        "❌ [rentalStatusHandler] Error while updating transaction status:",
        error
      );
      socket.emit("error", "Error while updating transaction status");
    }
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du statut de location à ${status}:`,
      error
    );
    socket.emit("error", `Failed to update rental status to ${status}`);
  }
};
