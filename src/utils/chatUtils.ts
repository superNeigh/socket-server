// import { ConversationProps } from "../type/ConversationProps";
// import { MessageProps } from "../type/MessageProps";

// export function sortConversationsByDate(conversations: ConversationProps[]) {
//   return conversations.sort((a, b) => {
//     const dateA = new Date(a.lastMessageAt || a.createdAt).getTime();
//     const dateB = new Date(b.lastMessageAt || b.createdAt).getTime();
//     return dateB - dateA; // For descending order
//   });
// }

// // Fonction pour trier les messages d'une salle de chat par date
// export async function sortRoomMessagesByDate(roomMessages: MessageProps[]) {
//   return roomMessages.sort((a, b) => {
//     const date1 = new Date(a.id);
//     const date2 = new Date(b.id);
//     return date1.getTime() - date2.getTime();
//   });
// }

// export async function getLastMessagesFromRoom(roomId: string) {
//   // Vérifiez que roomId est une chaîne hexadécimale valide de 24 caractères
//   if (!roomId || !/^[0-9a-fA-F]{24}$/.test(roomId)) {
//     throw new Error("Invalid ObjectID: must be a 24-character hex string.");
//   }

//   try {
//     const messages = await db.message.findMany({
//       where: { conversationId: roomId },
//       orderBy: { sentAt: "desc" },
//       // take: 10,
//     });
//     return messages as MessageProps[];
//   } catch (error: unknown) {
//     // Type assertion pour accéder aux propriétés de l'erreur
//     if (error instanceof Error) {
//       console.error("Error retrieving messages:", error.message);
//       throw error;
//     } else {
//       console.error("Unknown error:", error);
//       throw new Error("An unknown error occurred while retrieving messages.");
//     }
//   }
// }
