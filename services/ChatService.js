import { firestore } from "../config/firebaseConfig";
import { collection, query, doc, addDoc, orderBy, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

export const getOrCreateChat = async (userId, otherUserId) => {
  const chatsRef = collection(firestore, "chats");
  const q = query(
    chatsRef,
    where("userIds", "array-contains-any", [
      [userId, otherUserId],
      [otherUserId, userId],
    ])
  );

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
};

export const sendMessage = async (chatId, userId, text, adminId) => {
  if (userId !== adminId) {
    console.error("Solo el administrador puede enviar mensajes.");
    return;
  }

  try {
    const chatRef = doc(firestore, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    await addDoc(messagesRef, {
      text,
      userId,
      timestamp: serverTimestamp(),
    });

    await setDoc(chatRef, { lastMessage: text, lastMessageTimestamp: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};
export const loadMessages = (chatId, limit = 20) => {
  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "desc"), limitToLast(limit));

  return getDocs(q).then((querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return messages.reverse();
  });
};
export const listenForMessages = (chatId, callback) => {
  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages.reverse());
  });

  return unsubscribe;
};
