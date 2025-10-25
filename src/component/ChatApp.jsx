import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ChatApp.module.css";
import {
  FiSearch,
  FiPaperclip,
  FiMic,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiX,
  FiSun,
  FiMoon,
  FiArrowLeft,
  FiDownload,
} from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDone, IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsThreeDotsVertical, BsReply } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

// Sample chat list data (fetched from backend /api/chats - includes summary info like lastMessage, unreadCount)
const sampleChatList = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    image_data: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "online",
    lastSeen: "",
    lastMessage: {
      id: 2,
      text: "Hi! How are you?",
      sender: "me@example.com",
      timestamp: "2025-09-08T10:31:00.000Z",
      status: "unread",
    },
    unreadCount: 0,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    image_data: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "offline",
    lastSeen: "2 hours ago",
    lastMessage: {
      id: 5,
      text: "This message was deleted",
      sender: "jane@example.com",
      timestamp: "2025-09-08T09:15:00.000Z",
      status: "unread",
      deleted: true,
    },
    unreadCount: 5,
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    image_data: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "online",
    lastSeen: "",
    lastMessage: {
      id: 7,
      text: "How's the project going?",
      sender: "alex@example.com",
      timestamp: "2025-09-08T11:45:00.000Z",
      status: "read",
    },
    unreadCount: 0,
  },
];

// Flat array of all messages across chats (fetched from backend /api/messages globally, then filtered by chat)
const sampleMessages = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    text: "Hey there! How are you? Are we still on for the meeting later? Let me know if you need anything. Cheers! Let's catch up soon. What's new with you?",
    sender: "john@example.com",
    receiver: "me@example.com",
    timestamp: "2024-09-07T10:30:00.000Z",
    status: "unread",
    edited: true,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    text: "Hi! How are you?",
    sender: "me@example.com",
    receiver: "john@example.com",
    timestamp: "2025-09-07T10:31:00.000Z",
    status: "read",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    text: "Did you see the new React features?",
    sender: "jane@example.com",
    receiver: "me@example.com",
    timestamp: "2025-09-05T09:13:00.000Z",
    status: "unread",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    text: "Hi message",
    sender: "me@example.com",
    receiver: "jane@example.com",
    timestamp: "2025-09-07T09:14:00.000Z",
    status: "read",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: false,
    deletedBy: "me@example.com",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    text: "This message",
    sender: "jane@example.com",
    receiver: "me@example.com",
    timestamp: "2025-09-08T09:15:00.000Z",
    status: "unread",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: false,
    deletedBy: "jane@example.com",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    text: "How's the project going?",
    sender: "alex@example.com",
    receiver: "me@example.com",
    timestamp: "2025-09-07T11:45:00.000Z",
    status: "read",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [
      { emoji: "👍", by: "alex@example.com" },
      { emoji: "🙏", by: "me@example.com" },
    ],
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    text: "Sounds good! Let's meet at 3 PM.",
    sender: "me@example.com",
    receiver: "john@example.com",
    timestamp: "2025-09-07T10:32:00.000Z",
    status: "read",
    edited: false,
    replyTo: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      text: "Hey there! How are you? Are we still on for the meeting later? Let me know if you need anything. Cheers! Let's catch up soon. What's new with you?",
      sender: "John Doe",
    },
    file: null,
    reactions: [],
    deleted: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    text: "You deleted this message",
    sender: "me@example.com",
    receiver: "alex@example.com",
    timestamp: "2025-09-08T11:50:00.000Z",
    status: "read",
    edited: false,
    replyTo: null,
    file: null,
    reactions: [],
    deleted: true,
    deletedBy: "me@example.com",
  },
];

// Mock function to simulate fetching chat list from backend
const fetchChatList = async () => {
  // In real app: return fetch('/api/chats').then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleChatList), 100);
  });
};

// Mock function to simulate fetching messages for a specific chat (filter by emails)
const fetchMessages = async (otherUserEmail) => {
  // In real app: return fetch(`/api/messages?with=${otherUserEmail}`).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = sampleMessages.filter((msg) =>
        (msg.sender === "me@example.com" && msg.receiver === otherUserEmail) ||
        (msg.sender === otherUserEmail && msg.receiver === "me@example.com")
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      resolve(filtered);
    }, 300);
  });
};

const ChatApp = () => {
  const currentUserEmail = "me@example.com";

  // App state
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [messageMenu, setMessageMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [mobileView, setMobileView] = useState("chats"); // 'chats', 'messages', 'profile'
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Format helpers
  const formatTime = useCallback((isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const formatDateForGroup = useCallback((isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== today.getFullYear() && { year: "numeric" }),
    });
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max height: 120px
    }
  }, [inputText]);

  // Fetch chat list on mount
  useEffect(() => {
    const loadChatList = async () => {
      try {
        const data = await fetchChatList();
        setChatList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat list:", error);
        setLoading(false);
      }
    };
    loadChatList();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Adjust mobileView if necessary on resize
      if (window.innerWidth > 768 && mobileView !== "chats") {
        setMobileView("chats"); // Reset to chats on larger screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileView]);

  const isMobile = () => windowWidth <= 768;

  // Handle selecting a chat (fetch messages)
  const handleChatSelect = async (selectedChat) => {
    setMessages([]);
    setActiveChat(selectedChat);
    setReplyingTo(null);
    setEditingMessage(null);
    if (isMobile()) setMobileView("messages");

    try {
      const fetchedMessages = await fetchMessages(selectedChat.email);
      // Mark unread messages as read (for received messages)
      const updatedMessages = fetchedMessages.map((msg) =>
        msg.sender !== currentUserEmail && msg.status === "unread" ? { ...msg, status: "read" } : msg
      );
      setMessages(updatedMessages);

      // Update lastMessage and unreadCount for the selected chat only
      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                unreadCount: 0,
                lastMessage: updatedMessages.length
                  ? {
                      id: updatedMessages[updatedMessages.length - 1].id,
                      text: updatedMessages[updatedMessages.length - 1].deleted
                        ? updatedMessages[updatedMessages.length - 1].deletedBy === currentUserEmail
                          ? "You deleted this message"
                          : "This message was deleted"
                        : updatedMessages[updatedMessages.length - 1].file
                        ? `Attachment: ${updatedMessages[updatedMessages.length - 1].file.name.substring(0, 20)}`
                        : updatedMessages[updatedMessages.length - 1].text.substring(0, 30) +
                          (updatedMessages[updatedMessages.length - 1].text.length > 30 ? "..." : ""),
                      sender: updatedMessages[updatedMessages.length - 1].sender,
                      timestamp: updatedMessages[updatedMessages.length - 1].timestamp,
                      status: updatedMessages[updatedMessages.length - 1].status,
                      deleted: updatedMessages[updatedMessages.length - 1].deleted,
                    }
                  : null,
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  // Update messages when active chat changes (for marking read, but since fetched fresh, minimal)
  useEffect(() => {
    if (activeChat && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messageMenuRef.current &&
        !messageMenuRef.current.contains(event.target)
      ) {
        setMessageMenu(null);
        setShowReactionPicker(null);
      }

      // Close emoji picker when clicking outside
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.emojiButton}`)
      ) {
        setShowEmojiPicker(false);
      }

      // Close attachment menu when clicking outside
      if (
        attachmentMenu &&
        !event.target.closest(`.${styles.attachmentMenu}`)
      ) {
        setAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, attachmentMenu]);

  // Position message menu after render
  useEffect(() => {
    if (messageMenu && messageMenuRef.current) {
      const menu = messageMenuRef.current;
      const menuHeight = menu.offsetHeight;
      const menuWidth = menu.offsetWidth;
      const rect = messageMenu.rect;

      let top = rect.top;
      let left = rect.right;

      // Adjust for overflow
      if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - 10;
      }
      if (top < 10) {
        top = 10;
      }
      if (left + menuWidth > window.innerWidth) {
        left = rect.left - menuWidth - 10;
      }
      if (left < 10) {
        left = 10;
      }

      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }
  }, [messageMenu, showReactionPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper to get last message timestamp for sorting chats
  const getLastMessageTimestamp = (chat) => {
    return chat.lastMessage ? new Date(chat.lastMessage.timestamp).getTime() : 0;
  };

  // Sort chat list by last message timestamp descending
  const sortedChatList = [...chatList].sort(
    (a, b) => getLastMessageTimestamp(b) - getLastMessageTimestamp(a)
  );

  // Function to update lastMessage for the active chat
  const updateLastMessageInChatList = (currentMessages = messages) => {
    if (!activeChat) return;

    if (!currentMessages.length) {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, lastMessage: null, unreadCount: 0 }
            : chat
        )
      );
      return;
    }

    const lastMsg = currentMessages[currentMessages.length - 1];
    let previewText;

    if (lastMsg.deleted) {
      previewText = lastMsg.deletedBy === currentUserEmail ? "You deleted this message" : "This message was deleted";
    } else if (lastMsg.file) {
      previewText = `Attachment: ${lastMsg.file.name.substring(0, 20)}`;
    } else {
      previewText = lastMsg.text.substring(0, 30) + (lastMsg.text.length > 30 ? "..." : "");
    }

    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              lastMessage: {
                id: lastMsg.id,
                text: previewText,
                sender: lastMsg.sender,
                timestamp: lastMsg.timestamp,
                status: lastMsg.status,
                deleted: lastMsg.deleted,
              },
              unreadCount: 0,
            }
          : chat
      )
    );
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text === "" && !replyingTo && !editingMessage) return;

    let newMessage;
    let updatedMessages;

    if (editingMessage) {
      // Edit existing message
      newMessage = {
        ...editingMessage,
        text: text,
        edited: true,
      };

      updatedMessages = messages.map((msg) =>
        msg.id === editingMessage.id ? newMessage : msg
      );
      setEditingMessage(null);
    } else {
      // Create new message
      const now = new Date();
      const messageId = crypto.randomUUID();
      newMessage = {
        id: messageId,
        text: text,
        sender: currentUserEmail,
        receiver: activeChat.email,
        timestamp: now.toISOString(),
        status: "unread",
        reactions: [],
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              sender: replyingTo.sender === currentUserEmail ? "You" : activeChat.name,
            }
          : null,
      };

      updatedMessages = [...messages, newMessage];

      // Simulate API save/send for new message (professional: async POST to /api/messages)
      // In real app: await fetch('/api/messages', { method: 'POST', body: JSON.stringify(newMessage) });
      await new Promise((resolve) => setTimeout(resolve, 300)); // Mock delay for sending
    }

    setMessages(updatedMessages);
    updateLastMessageInChatList(updatedMessages);

    setInputText("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages) return [];

    return messages.reduce((acc, message) => {
      const msgDate = new Date(message.timestamp).toISOString().split("T")[0];
      const dateGroup = acc.find((group) => group.date === msgDate);
      if (dateGroup) {
        dateGroup.messages.push(message);
      } else {
        acc.push({
          date: msgDate,
          formattedDate: formatDateForGroup(message.timestamp),
          messages: [message],
        });
      }
      return acc;
    }, []);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const now = new Date();
      const messageId = crypto.randomUUID();
      const newMessage = {
        id: messageId,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result,
        },
        sender: currentUserEmail,
        receiver: activeChat.email,
        timestamp: now.toISOString(),
        status: "unread",
        reactions: [],
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              sender: replyingTo.sender === currentUserEmail ? "You" : activeChat.name,
            }
          : null,
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      updateLastMessageInChatList(updatedMessages);

      // Simulate API save/send
      // In real app: await fetch('/api/messages', { method: 'POST', body: JSON.stringify(newMessage) });
      await new Promise((resolve) => setTimeout(resolve, 300));

      setAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
  };

  // Toggle reaction on message - allow toggle off if same emoji
  const toggleReaction = (messageId, reaction) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        let myReaction = msg.reactions.find((r) => r.by === currentUserEmail);
        let newReactions = msg.reactions.filter((r) => r.by !== currentUserEmail);

        if (myReaction && myReaction.emoji === reaction) {
          // Toggle off if same
        } else if (reaction) {
          // Add or replace
          newReactions.push({ emoji: reaction, by: currentUserEmail });
        }

        return {
          ...msg,
          reactions: newReactions,
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setShowReactionPicker(null);
    setMessageMenu(null);
  };

  // Remove specific reaction (for clicking on displayed reaction)
  const removeReaction = (messageId, emoji) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const newReactions = msg.reactions.filter(
          (r) => !(r.by === currentUserEmail && r.emoji === emoji)
        );
        return {
          ...msg,
          reactions: newReactions,
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
  };

  // Delete message for me (remove locally)
  const deleteForMe = (messageId) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    setMessages(updatedMessages);
    updateLastMessageInChatList(updatedMessages);
    setMessageMenu(null);
  };

  // Delete message for everyone (replace with deleted placeholder)
  const deleteForEveryone = (messageId) => {
    const messageToDelete = messages.find((m) => m.id === messageId);
    if (!messageToDelete || messageToDelete.sender !== currentUserEmail) return; // Only own messages

    const deletedMessage = {
      ...messageToDelete,
      text: "You deleted this message",
      status: "read",
      deleted: true,
      deletedBy: currentUserEmail,
      edited: false,
      reactions: [],
      replyTo: null,
      file: null,
    };

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? deletedMessage : msg
    );
    setMessages(updatedMessages);
    updateLastMessageInChatList(updatedMessages);
    setMessageMenu(null);
  };

  // Start editing a message
  const startEditing = (message) => {
    if (message.sender !== currentUserEmail || message.deleted) return; // Security: only own messages, not deleted
    setEditingMessage(message);
    setReplyingTo(null);
    setInputText(message.text);
    inputRef.current.focus();
    setMessageMenu(null);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setEditingMessage(null);
    setInputText("");
  };

  // Handle emoji click
  const onEmojiClick = (emojiData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  // Handle context menu for messages
  const handleContextMenu = (e, message) => {
    if (message.deleted) return; // No menu for deleted messages
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    setMessageMenu({ id: message.id, rect });
  };

  // Handle download
  const handleDownload = (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.file) return;

    const link = document.createElement("a");
    link.href = message.file.url;
    link.download = message.file.name;
    link.click();
    setMessageMenu(null);
  };

  // Open image modal
  const openImageModal = (image) => {
    setModalImage(image);
    setShowImageModal(true);
  };

  // Common emoji reactions
  const commonReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  // Group reactions by emoji for display
  const groupReactions = (reactions) => {
    const grouped = reactions.reduce((acc, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = { count: 0, byMe: false };
      }
      acc[r.emoji].count++;
      if (r.by === currentUserEmail) acc[r.emoji].byMe = true;
      return acc;
    }, {});
    return grouped;
  };

  if (loading) {
    return <div className={styles.appContainer}>Loading chats...</div>;
  }

  return (
    <div
      className={`${styles.appContainer} ${darkMode ? styles.darkMode : ""}`}
    >
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isMobile() && mobileView !== "chats" ? styles.hidden : ""
        }`}
      >
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.advancedInput}
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                <FiX />
              </button>
            )}
          </div>
          <div className={styles.sidebarActions}>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>

        {/* Chats list */}
        <div className={styles.chatsList}>
          {sortedChatList
            .filter(
              (chat) =>
                chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.lastMessage?.text?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((chat) => {
              const unreadCount = chat.unreadCount;
              return (
                <div
                  key={chat.id}
                  className={`${styles.chatItem} ${
                    activeChat?.id === chat.id ? styles.active : ""
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className={styles.avatarContainer}>
                    <img src={chat.image_data} alt={chat.name} />
                    <span
                      className={`${styles.status} ${
                        chat.status === "online"
                          ? styles.online
                          : styles.offline
                      }`}
                    ></span>
                  </div>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatHeader}>
                      <span className={styles.chatName}>{chat.name}</span>
                      <span className={styles.chatTime}>
                        {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
                      </span>
                    </div>
                    <div className={styles.chatPreview}>
                      <p>
                        {chat.lastMessage
                          ? chat.lastMessage.deleted
                            ? chat.lastMessage.text
                            : chat.lastMessage.sender === currentUserEmail
                              ? `You: ${chat.lastMessage.text}`
                              : chat.lastMessage.text
                          : "No messages yet"}
                      </p>
                      {chat.lastMessage?.sender === currentUserEmail && !chat.lastMessage?.deleted && (
                        <IoCheckmarkDone
                          className={`${styles.readReceipt} ${
                            chat.lastMessage.status === "read" ? styles.read : ""
                          }`}
                        />
                      )}
                      {unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`${styles.chatArea} ${
          isMobile() && mobileView !== "messages" ? styles.hidden : ""
        }`}
      >
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className={styles.chatHeader}>
              {isMobile() && (
                <button
                  className={styles.backButton}
                  onClick={() => setMobileView("chats")}
                >
                  <FiArrowLeft />
                </button>
              )}
              <div
                className={styles.chatUser}
                onClick={() => {
                  setProfileUser(activeChat);
                  if (isMobile()) setMobileView("profile");
                }}
              >
                <div className={styles.avatarContainer}>
                  <img src={activeChat.image_data} alt={activeChat.name} />
                  <span
                    className={`${styles.status} ${
                      activeChat.status === "online"
                        ? styles.online
                        : styles.offline
                    }`}
                  ></span>
                </div>
                <div className={styles.userInfo}>
                  <h3>{activeChat.name}</h3>
                  <p>
                    {activeChat.status === "online"
                      ? "Online"
                      : `Last seen ${activeChat.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className={styles.chatActions}>
                <button>
                  <FiSearch />
                </button>
                <button>
                  <BsThreeDotsVertical />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className={styles.messagesContainer}>
              {groupMessagesByDate(messages).map((group, index) => (
                <div key={index} className={styles.dateGroup}>
                  <div className={styles.dateSeparator}>
                    <span>{group.formattedDate}</span>
                  </div>
                  {group.messages.map((message) => {
                    const groupedReactions = groupReactions(message.reactions);
                    const isOwnMessage = message.sender === currentUserEmail;
                    const deleted = message.deleted;
                    return (
                      <div
                        key={message.id}
                        className={`${styles.message} ${
                          isOwnMessage ? styles.sent : styles.received
                        } ${deleted ? styles.deletedMessage : ""}`}
                        onContextMenu={(e) => handleContextMenu(e, message)}
                      >
                        {/* Reply indicator */}
                        {!deleted && message.replyTo && (
                          <div className={styles.replyIndicator}>
                            <div className={styles.replyLine}></div>
                            <div className={styles.replyContent}>
                              <span className={styles.replySender}>
                                {message.replyTo.sender}
                              </span>
                              <p className={styles.replyText}>
                                {message.replyTo.text?.substring(0, 50) ||
                                  "Attachment"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Message content */}
                        {deleted ? (
                          <p>{message.text}</p>
                        ) : message.file ? (
                          (() => {
                            const isImage = message.file.type.startsWith("image/");
                            return (
                              <div className={styles.fileMessage}>
                                <div 
                                  className={styles.filePreview}
                                  {...(isImage ? { onClick: () => openImageModal({ url: message.file.url, name: message.file.name }) } : {})}
                                >
                                  {isImage ? (
                                    <img src={message.file.url} alt="" />
                                  ) : (
                                    <div className={styles.fileIcon}>
                                      📄
                                      <span>{message.file.type.split("/")[1]?.toUpperCase() || "FILE"}</span>
                                    </div>
                                  )}
                                </div>
                                {!isImage && (
                                  <div className={styles.fileInfo}>
                                    <p>
                                      <a
                                        href={message.file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {message.file.name}
                                      </a>
                                    </p>
                                    <span>{Math.round(message.file.size / 1024)} KB</span>
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          <p className={styles.textMSG}>{message.text}</p>
                        )}

                        {/* Message metadata */}
                        <div className={styles.messageMeta}>
                          <span>{formatTime(message.timestamp)}</span>
                          {!deleted && message.edited && (
                            <span className={styles.editedLabel}>(edited)</span>
                          )}
                          {!deleted && isOwnMessage && (
                            <IoCheckmarkDone
                              className={`${styles.readReceipt} ${
                                message.status === "read" ? styles.read : ""
                              }`}
                            />
                          )}
                        </div>

                        {/* Reactions */}
                        {!deleted && Object.keys(groupedReactions).length > 0 && (
                          <div
                            className={`${styles.reactions} ${
                              isOwnMessage
                                ? styles.sentReactions
                                : styles.receivedReactions
                            }`}
                          >
                            {Object.entries(groupedReactions).map(
                              ([emoji, { count, byMe }], idx) => (
                                <span
                                  key={idx}
                                  className={`${styles.reaction} ${
                                    byMe ? styles.myReaction : ""
                                  }`}
                                  onClick={() =>
                                    byMe
                                      ? removeReaction(message.id, emoji)
                                      : toggleReaction(message.id, emoji)
                                  }
                                >
                                  {emoji} {count > 1 ? count : ""}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Message menu */}
              {messageMenu && (
                <div className={styles.messageMenu} ref={messageMenuRef}>
                  <div className={styles.reactionPicker}>
                    {commonReactions.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleReaction(messageMenu.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setShowReactionPicker(
                          showReactionPicker === messageMenu.id
                            ? null
                            : messageMenu.id
                        )
                      }
                    >
                      <BsEmojiSmile />
                    </button>
                  </div>
                  {showReactionPicker === messageMenu.id && (
                    <div
                      className={styles.emojiPickerContainer}
                      ref={emojiPickerRef}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          toggleReaction(messageMenu.id, emojiData.emoji);
                        }}
                        width={300}
                        height={350}
                      />
                    </div>
                  )}
                  <div className={styles.messageActions}>
                    <button
                      onClick={() => {
                        const message = messages.find(
                          (m) => m.id === messageMenu.id
                        );
                        setReplyingTo(message);
                        setMessageMenu(null);
                        inputRef.current.focus();
                      }}
                    >
                      <BsReply /> Reply
                    </button>
                    {(() => {
                      const message = messages.find((m) => m.id === messageMenu.id);
                      const isOwn = message?.sender === currentUserEmail;
                      return (
                        <>
                          {isOwn && (
                            <button
                              onClick={() => {
                                startEditing(message);
                              }}
                            >
                              <FiEdit /> Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteForMe(messageMenu.id)}
                          >
                            <FiTrash2 /> Delete for me
                          </button>
                          {isOwn && (
                            <button
                              onClick={() => deleteForEveryone(messageMenu.id)}
                            >
                              <FiTrash2 /> Delete for everyone
                            </button>
                          )}
                          {!message.deleted && message.file && (
                            <button
                              onClick={() => handleDownload(messageMenu.id)}
                            >
                              <FiDownload /> Download
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Reply/Edit preview */}
            {(replyingTo || editingMessage) && (
              <div className={styles.replyPreview}>
                <div className={styles.replyPreviewContent}>
                  <div className={styles.replyPreviewHeader}>
                    <span>
                      {editingMessage 
                        ? "Editing message" 
                        : `Replying to ${replyingTo?.sender === currentUserEmail ? "your message" : activeChat.name}`
                      }
                    </span>
                    <button onClick={cancelReply}>
                      <FiX />
                    </button>
                  </div>
                  <p>
                    {editingMessage ? editingMessage.text : replyingTo.text}
                  </p>
                </div>
              </div>
            )}

            {/* Message input */}
            <form className={styles.messageInput} onSubmit={handleSendMessage}>
              <div className={styles.inputContainer}>
                <button
                  type="button"
                  className={styles.emojiButton}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <BsEmojiSmile />
                </button>

                {showEmojiPicker && (
                  <div
                    className={styles.emojiPickerContainer}
                    ref={emojiPickerRef}
                  >
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={350}
                    />
                  </div>
                )}

                <textarea
                  placeholder="Type a message"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  ref={inputRef}
                  className={styles.advancedInput}
                  rows={1}
                />

                <div className={styles.attachmentMenu}>
                  <button
                    type="button"
                    className={styles.attachmentButton}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiPaperclip />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!inputText.trim() && !replyingTo && !editingMessage}
              >
                {inputText.trim() || editingMessage ? <IoSend /> : <FiMic />}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noChatSelected}>
            <div className={styles.noChatContent}>
              <h2>Welcome to Chatbox</h2>
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile sidebar */}
      {profileUser && (
        <div
          className={`${styles.profileSidebar} ${
            isMobile() && mobileView !== "profile" ? styles.hidden : ""
          }`}
        >
          <div className={styles.profileHeader}>
            <div style={{ width: "24px" }}></div>
            
            <h3>Profile</h3>

            <button
              onClick={() => {
                setProfileUser(null);
                if (isMobile())
                  setMobileView(activeChat ? "messages" : "chats");
              }}
            >
              <IoMdClose/>
            </button>
            
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileAvatar}>
              <img src={profileUser.image_data} alt={profileUser.name} />
              <div className={styles.profileStatus}>
                <span
                  className={`${styles.statusIndicator} ${
                    profileUser.status === "online"
                      ? styles.online
                      : styles.offline
                  }`}
                ></span>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <h3>{profileUser.name}</h3>
              {/* <p className={styles.profileAbout}>{profileUser.about}</p> */}
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Email:</span>
                  <span className={styles.metaValue}>{profileUser.email}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status:</span>
                  <span className={styles.metaValue}>
                    {profileUser.status === "online"
                      ? "Online"
                      : `Last seen ${profileUser.lastSeen || "recently"}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && modalImage && (
        <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={modalImage.url} alt="" />
            <button className={styles.closeModal} onClick={() => setShowImageModal(false)}>
              <FiX />
            </button>
            <button
              className={styles.downloadModal}
              onClick={() => {
                const link = document.createElement("a");
                link.href = modalImage.url;
                link.download = modalImage.name;
                link.click();
              }}
            >
              <FiDownload />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;