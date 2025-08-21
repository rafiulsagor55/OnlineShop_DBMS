import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ChatApp.module.css";
import {
  FiSearch,
  FiPaperclip,
  FiMic,
  FiMoreVertical,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiCornerUpLeft,
  FiX,
} from "react-icons/fi";
import { IoCheckmarkDone, IoEllipsisHorizontal, IoSend } from "react-icons/io5";
import {
  BsEmojiSmile,
  BsThreeDotsVertical,
  BsReply,
  BsReplyAll,
} from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

const ChatApp = () => {
  // App state
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [messageMenu, setMessageMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageMenuRef = useRef(null);

  // Sample data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      status: "online",
      lastSeen: "",
      about: "Product Designer | UI/UX Enthusiast",
      phone: "+1 234 567 890",
      messages: [
        {
          id: 1,
          text: "Hey there!",
          sender: 1,
          timestamp: "10:30 AM",
          status: "read",
          reactions: [],
          date: "2023-05-15",
        },
        {
          id: 2,
          text: "Hi! How are you?",
          sender: "me",
          timestamp: "10:31 AM",
          status: "read",
          reactions: [],
          date: "2023-05-15",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "offline",
      lastSeen: "2 hours ago",
      about: "Frontend Developer | React Specialist",
      phone: "+1 987 654 321",
      messages: [
        {
          id: 1,
          text: "Did you see the new React features?",
          sender: 2,
          timestamp: "9:15 AM",
          status: "read",
          reactions: [],
          date: "2023-05-15",
        },
      ],
    },
  ]);

  // Initialize with first chat
  useEffect(() => {
    if (users.length > 0 && !activeChat) {
      setActiveChat(users[0]);
      setMessages(users[0].messages);
    }
  }, [users, activeChat]);

  // Update messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages);
    }
  }, [activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messageMenuRef.current &&
        !messageMenuRef.current.contains(event.target)
      ) {
        setMessageMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text === "" && !replyingTo && !editingMessage) return;

    let newMessage;
    if (editingMessage) {
      // Edit existing message
      newMessage = {
        ...editingMessage,
        text: text,
        isEdited: true,
      };

      const updatedUsers = users.map((user) => {
        if (user.id === activeChat.id) {
          return {
            ...user,
            messages: user.messages.map((msg) =>
              msg.id === editingMessage.id ? newMessage : msg
            ),
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
      setEditingMessage(null);
    } else {
      // Create new message
      newMessage = {
        id: Date.now(),
        text: text,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        reactions: [],
        date: new Date().toISOString().split("T")[0],
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              sender: replyingTo.sender === "me" ? "You" : activeChat.name,
            }
          : null,
      };

      const updatedUsers = users.map((user) => {
        if (user.id === activeChat.id) {
          return {
            ...user,
            messages: [...user.messages, newMessage],
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
    }

    setInputText("");
    setReplyingTo(null);
    setShowEmojiPicker(false);

    // Simulate reply if not editing
    if (!editingMessage) {
      simulateReply(activeChat.id);
    }
  };

  // Simulate reply from other user
  const simulateReply = useCallback(
    (chatId) => {
      setIsTyping(true);

      const replyDelay = 1000 + Math.random() * 3000;

      setTimeout(() => {
        const replies = [
          "That sounds great!",
          "Interesting, tell me more.",
          "I was thinking the same thing!",
          "Let me check and get back to you.",
          "👍",
          "Can we discuss this later?",
        ];

        const replyMessage = {
          id: Date.now(),
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: chatId,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
          reactions: [],
          date: new Date().toISOString().split("T")[0],
          replyTo: replyingTo
            ? {
                id: replyingTo.id,
                text: replyingTo.text,
                sender: replyingTo.sender === "me" ? "You" : activeChat.name,
              }
            : null,
        };

        const updatedUsers = users.map((user) => {
          if (user.id === chatId) {
            return {
              ...user,
              messages: [...user.messages, replyMessage],
            };
          }
          return user;
        });

        setUsers(updatedUsers);
        setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
        setIsTyping(false);
      }, replyDelay);
    },
    [users, activeChat, replyingTo]
  );

  // Format date for display
  const formatDate = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        dateStr.split("-")[0] !== new Date().getFullYear().toString()
          ? "numeric"
          : undefined,
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages) return [];

    return messages.reduce((acc, message) => {
      const dateGroup = acc.find((group) => group.date === message.date);
      if (dateGroup) {
        dateGroup.messages.push(message);
      } else {
        acc.push({
          date: message.date,
          formattedDate: formatDate(message.date),
          messages: [message],
        });
      }
      return acc;
    }, []);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newMessage = {
        id: Date.now(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result,
        },
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        reactions: [],
        date: new Date().toISOString().split("T")[0],
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              sender: replyingTo.sender === "me" ? "You" : activeChat.name,
            }
          : null,
      };

      const updatedUsers = users.map((user) => {
        if (user.id === activeChat.id) {
          return {
            ...user,
            messages: [...user.messages, newMessage],
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
      setAttachmentMenu(false);

      // Simulate reply
      simulateReply(activeChat.id);
    };
    reader.readAsDataURL(file);
  };

  // Toggle reaction on message
  const toggleReaction = (messageId, reaction) => {
    const updatedUsers = users.map((user) => {
      if (user.id === activeChat.id) {
        const updatedMessages = user.messages.map((msg) => {
          if (msg.id === messageId) {
            const existingReactionIndex = msg.reactions.findIndex(
              (r) => r.emoji === reaction
            );
            let updatedReactions = [...msg.reactions];

            if (existingReactionIndex >= 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions.push({ emoji: reaction, by: "me" });
            }

            return {
              ...msg,
              reactions: updatedReactions,
            };
          }
          return msg;
        });

        return {
          ...user,
          messages: updatedMessages,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
    setShowReactionPicker(null);
  };

  // Delete message
  const deleteMessage = (messageId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === activeChat.id) {
        return {
          ...user,
          messages: user.messages.filter((msg) => msg.id !== messageId),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setMessages(updatedUsers.find((u) => u.id === activeChat.id).messages);
    setMessageMenu(null);
  };

  // Start editing a message
  const startEditing = (message) => {
    setEditingMessage(message);
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

  // Common emoji reactions
  const commonReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  return (
    <div
      className={`${styles.appContainer} ${darkMode ? styles.darkMode : ""}`}
    >
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div
            className={styles.userProfile}
            onClick={() =>
              setProfileUser({
                name: "Me",
                avatar: "https://randomuser.me/api/portraits/men/5.jpg",
                status: "online",
                about: "React Developer",
                phone: "+1 555 123 4567",
              })
            }
          >
            <img
              src="https://randomuser.me/api/portraits/men/5.jpg"
              alt="Profile"
            />
          </div>
          <div className={styles.sidebarActions}>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button>
              <FiMoreVertical />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chats list */}
        <div className={styles.chatsList}>
          {users
            .filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.messages.some(
                  (msg) =>
                    msg.text &&
                    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
                )
            ) // This closing parenthesis was missing
            .map((user) => (
              <div
                key={user.id}
                className={`${styles.chatItem} ${
                  activeChat?.id === user.id ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveChat(user);
                  setMessages(user.messages);
                  setReplyingTo(null);
                  setEditingMessage(null);
                }}
              >
                <div className={styles.avatarContainer}>
                  <img src={user.avatar} alt={user.name} />
                  <span
                    className={`${styles.status} ${
                      user.status === "online" ? styles.online : styles.offline
                    }`}
                  ></span>
                </div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}>
                    <span className={styles.chatName}>{user.name}</span>
                    <span className={styles.chatTime}>
                      {user.messages.length > 0
                        ? user.messages[user.messages.length - 1].timestamp
                        : ""}
                    </span>
                  </div>
                  <div className={styles.chatPreview}>
                    <p>
                      {user.messages.length > 0
                        ? user.messages[user.messages.length - 1].sender ===
                          "me"
                          ? `You: ${
                              user.messages[
                                user.messages.length - 1
                              ].text?.substring(0, 30) || "Attachment"
                            }`
                          : user.messages[
                              user.messages.length - 1
                            ].text?.substring(0, 30) || "Attachment"
                        : "No messages yet"}
                    </p>
                    {user.messages.length > 0 &&
                      user.messages[user.messages.length - 1].sender ===
                        "me" && (
                        <IoCheckmarkDone
                          className={`${styles.readReceipt} ${
                            user.messages[user.messages.length - 1].status ===
                            "read"
                              ? styles.read
                              : ""
                          }`}
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className={styles.chatHeader}>
              <div
                className={styles.chatUser}
                onClick={() => setProfileUser(activeChat)}
              >
                <div className={styles.avatarContainer}>
                  <img src={activeChat.avatar} alt={activeChat.name} />
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
                    {isTyping &&
                      activeChat.status === "online" &&
                      " • typing..."}
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
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.sender === "me" ? styles.sent : styles.received
                      } ${messageMenu === message.id ? styles.active : ""}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setMessageMenu(message.id);
                      }}
                    >
                      {/* Reply indicator */}
                      {message.replyTo && (
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
                      {message.file ? (
                        <div className={styles.fileMessage}>
                          <div className={styles.filePreview}>
                            {message.file.type.startsWith("image/") ? (
                              <img
                                src={message.file.url}
                                alt={message.file.name}
                              />
                            ) : (
                              <div className={styles.fileIcon}>
                                📄
                                <span>
                                  {message.file.type
                                    .split("/")[1]
                                    ?.toUpperCase() || "FILE"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className={styles.fileInfo}>
                            <p>{message.file.name}</p>
                            <span>
                              {Math.round(message.file.size / 1024)} KB
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p>{message.text}</p>
                      )}

                      {/* Message metadata */}
                      <div className={styles.messageMeta}>
                        <span>{message.timestamp}</span>
                        {message.isEdited && (
                          <span className={styles.editedLabel}>(edited)</span>
                        )}
                        {message.sender === "me" && (
                          <IoCheckmarkDone
                            className={`${styles.readReceipt} ${
                              message.status === "read" ? styles.read : ""
                            }`}
                          />
                        )}
                      </div>

                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div
                          className={`${styles.reactions} ${
                            message.sender === "me"
                              ? styles.sentReactions
                              : styles.receivedReactions
                          }`}
                        >
                          {message.reactions.map((reaction, idx) => (
                            <span key={idx} className={styles.reaction}>
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Message menu */}
                      {messageMenu === message.id && (
                        <div
                          className={styles.messageMenu}
                          ref={messageMenuRef}
                        >
                          <div className={styles.reactionPicker}>
                            {commonReactions.map((emoji, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  toggleReaction(message.id, emoji)
                                }
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              onClick={() =>
                                setShowReactionPicker(
                                  showReactionPicker === message.id
                                    ? null
                                    : message.id
                                )
                              }
                            >
                              <BsEmojiSmile />
                            </button>
                          </div>
                          {showReactionPicker === message.id && (
                            <div className={styles.emojiPickerContainer}>
                              <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                  toggleReaction(message.id, emojiData.emoji);
                                }}
                                width={300}
                                height={350}
                              />
                            </div>
                          )}
                          <div className={styles.messageActions}>
                            <button
                              onClick={() => {
                                setReplyingTo(message);
                                setMessageMenu(null);
                                inputRef.current.focus();
                              }}
                            >
                              <BsReply /> Reply
                            </button>
                            {message.sender === "me" && (
                              <>
                                <button
                                  onClick={() => {
                                    startEditing(message);
                                  }}
                                >
                                  <FiEdit /> Edit
                                </button>
                                <button
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <FiTrash2 /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div
                  className={`${styles.message} ${styles.received} ${styles.typingIndicator}`}
                >
                  <div className={styles.typingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
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
                      {editingMessage ? "Editing" : "Replying to"}{" "}
                      {replyingTo?.sender === "me"
                        ? "your message"
                        : activeChat.name}
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
                  <div className={styles.emojiPickerContainer}>
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={350}
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Type a message"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  ref={inputRef}
                />

                <div className={styles.attachmentMenu}>
                  <button
                    type="button"
                    className={styles.attachmentButton}
                    onClick={() => setAttachmentMenu(!attachmentMenu)}
                  >
                    <FiPaperclip />
                  </button>
                  {attachmentMenu && (
                    <div className={styles.attachmentDropdown}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <span>📷</span> Photo
                      </button>
                      <button type="button">
                        <span>📹</span> Video
                      </button>
                      <button type="button">
                        <span>📂</span> Document
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
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
              <h2>WhatsApp Web</h2>
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile sidebar */}
      {profileUser && (
        <div className={styles.profileSidebar}>
          <div className={styles.profileHeader}>
            <button onClick={() => setProfileUser(null)}>←</button>
            <h3>Profile</h3>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileAvatar}>
              <img src={profileUser.avatar} alt={profileUser.name} />
            </div>
            <div className={styles.profileDetails}>
              <h3>{profileUser.name}</h3>
              <p>{profileUser.about}</p>
              <div className={styles.profileMeta}>
                <span>Phone: {profileUser.phone}</span>
                <span>Status: {profileUser.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
