import { db } from "@/config/db";
import { generateId, UIMessage } from "ai";
import { WithId } from "mongodb";
import "server-only";

type ChatDocument = {
  userId: string;
  chatId: string;
  title: string;
  messages: unknown[];
  createdAt: Date;
  updatedAt: Date;
};

const chatsCollection = db.collection<ChatDocument>("chats");

export const createChat = async (userId: string) => {
  const chatId = generateId();
  await chatsCollection.insertOne({
    userId,
    chatId,
    title: "New Chat",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return chatId;
};

export const saveChat = async (chatId: string, messages: UIMessage[]) => {
  await chatsCollection.updateOne(
    { chatId },
    {
      $set: {
        messages,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
};

export const getChat = async (chatId: string) => {
  const chat = await chatsCollection.findOne({ chatId });
  return chat;
};

export const deleteChat = async (chatId: string, userId: string) => {
  const result = await chatsCollection.deleteOne({ chatId, userId });
  return result.deletedCount > 0;
};

export const getAllchats = async (
  userId: string,
): Promise<WithId<ChatDocument>[]> => {
  const chats = await chatsCollection
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();
  return chats;
};
