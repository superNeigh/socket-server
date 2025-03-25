import db from "./db";

export const updateRentalStatus = async (rentalId: string, data: any) => {
  try {
    let updateRental;

    updateRental = await db.rental.update({
      where: { id: rentalId },
      data: {
        ...data,
      },
    });
    return updateRental;
  } catch (error) {
    console.error("€rror updating rental status", error);
    throw new Error("failed to update rental status");
  }
};
