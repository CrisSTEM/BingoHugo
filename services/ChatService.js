import { firestore } from "../config/firebaseConfig";
import {
  collection,
  query,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  writeBatch,
} from "firebase/firestore";

export const getOrCreateChat = async (userId, otherUserId) => {
  const chatsRef = collection(firestore, "chats");
  const q = query(
    chatsRef,
    where("userIds", "array-contains-any", [
      [userId, otherUserId],
      [otherUserId, userId],
    ])
  );

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const chatData = {
        userIds: [userId, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageTimestamp: serverTimestamp(),
      };
      const chatDocRef = await addDoc(chatsRef, chatData);
      return chatDocRef.id;
    } else {
      return querySnapshot.docs[0].id;
    }
  } catch (error) {
    console.error("Error getting or creating chat: ", error);
    throw error;
  }
};

export const listenForMessages = (chatId, callback) => {
  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages.reverse());
    },
    (error) => {
      console.error("Error listening for messages: ", error);
    }
  );

  return unsubscribe;
};

export const markMessagesAsSeen = async (chatId, userId) => {
  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  const q = query(messagesRef, where("seen", "==", false), where("userId", "!=", userId));

  try {
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);

    querySnapshot.forEach((doc) => {
      const msgRef = doc.ref;
      batch.update(msgRef, { seen: true });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error marking messages as seen: ", error);
    throw error;
  }
};
