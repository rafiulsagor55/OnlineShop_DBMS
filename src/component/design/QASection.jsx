import React, { useState, useEffect } from "react";
import styles from "./QASection.module.css";
import userAvatar from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (2).png";
import supportAvatar from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (4).png";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

// Simulated API data
const fetchQuestions = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userId: "user1",
          user: "Ayesha",
          isVerified: true,
          date: "2024-09-12",
          question: "Is this product waterproof?",
          helpful: 4,
          answers: [
            {
              id: 101,
              userId: "support1",
              user: "Support Team",
              isVerified: true,
              role: "admin",
              text: "Yes, it is rated IPX6 waterproof.",
              helpful: 2,
            },
            {
              id: 102,
              userId: "user2",
              user: "Kamal",
              isVerified: false,
              role: "user",
              text: "I've used it in rain, works fine!",
              helpful: 3,
            },
          ],
        },
        {
          id: 2,
          userId: "user3",
          user: "Raju",
          isVerified: true,
          date: "2024-08-01",
          question: "Does it come with a warranty?",
          helpful: 2,
          answers: [],
        },
      ]);
    }, 800);
  });

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.confirmationDialogOverlay}>
      <div className={styles.confirmationDialog}>
        <p>{message}</p>
        <div className={styles.dialogButtons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Delete
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AnswerCard = ({ answer, onHelpfulClick, onDelete, currentUserId }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(answer.helpful || 0);
  const [dislikeCount, setDislikeCount] = useState(answer.dislike || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleHelpfulClick = () => {
    if (isHelpful) {
      setIsHelpful(false);
      setHelpfulCount((prev) => prev - 1);
      onHelpfulClick(answer.id, helpfulCount - 1);
    } else {
      if (isDisliked) {
        setIsDisliked(false);
        setDislikeCount((prev) => prev - 1);
      }
      setIsHelpful(true);
      setHelpfulCount((prev) => prev + 1);
      onHelpfulClick(answer.id, helpfulCount + 1);
    }
  };

  const handleDislikeClick = () => {
    if (isDisliked) {
      setIsDisliked(false);
      setDislikeCount((prev) => prev - 1);
    } else {
      if (isHelpful) {
        setIsHelpful(false);
        setHelpfulCount((prev) => prev - 1);
        onHelpfulClick(answer.id, helpfulCount - 1);
      }
      setIsDisliked(true);
      setDislikeCount((prev) => prev + 1);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(answer.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const canDelete = answer.userId === currentUserId;

  return (
    <div className={styles.answer}>
      {showDeleteConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this answer?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <div className={styles.aMeta}>
        <img
          src={answer.role === "admin" ? supportAvatar : userAvatar}
          alt="avatar"
        />
        <div className={styles.userInfo}>
          <strong>{answer.user}</strong>
          {answer.isVerified && (
            <span className={styles.verified}>✔ Verified</span>
          )}
          {answer.role === "admin" && (
            <span className={styles.adminBadge}>Support</span>
          )}
        </div>
      </div>
      <div className={styles.aText}>{answer.text}</div>
      <div className={styles.actions}>
        <button
          onClick={handleHelpfulClick}
          className={`${styles.actionButton}`}
        >
          <span><BiSolidLike className={`${isHelpful ? styles.active : ""}`} /></span> {helpfulCount}
        </button>
        <button
          onClick={handleDislikeClick}
          className={`${styles.actionButton}`}
        >
          <span><BiSolidDislike className={`${
            isDisliked ? styles.active : ""
          }`}/></span> {dislikeCount}
        </button>
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete answer"
          >
            <RiDeleteBin6Line />
          </button>
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({ q, onHelpfulClick, onReplySubmit, onDelete, currentUserId }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(q.helpful);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleHelpfulClick = () => {
    if (!isHelpful) {
      const newCount = helpfulCount + 1;
      setHelpfulCount(newCount);
      setIsHelpful(true);
      onHelpfulClick(q.id, newCount);
    } else {
      const newCount = helpfulCount - 1;
      setHelpfulCount(newCount);
      setIsHelpful(false);
      onHelpfulClick(q.id, newCount);
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReplySubmit(q.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(q.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const canDelete = q.userId === currentUserId;

  return (
    <div className={styles.card}>
      {showDeleteConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this question?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <div className={styles.qHeader}>
        <div className={styles.qUser}>
          <img src={userAvatar} alt="user" />
          <div className={styles.userInfo}>
            <strong>{q.user}</strong>
            {q.isVerified && (
              <span className={styles.verified}>✔ Verified</span>
            )}
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.date}>
            {new Date(q.date).toLocaleDateString()}
          </span>
          {canDelete && (
            <button
              onClick={handleDeleteClick}
              className={`${styles.actionButton} ${styles.deleteButton}`}
              title="Delete question"
            >
              <RiDeleteBin6Line />
            </button>
          )}
        </div>
      </div>
      <div className={styles.qText}>{q.question}</div>

      <div className={styles.answerSection}>
        {q.answers.length > 0 ? (
          q.answers.map((ans) => (
            <AnswerCard
              key={ans.id}
              answer={ans}
              onHelpfulClick={onHelpfulClick}
              onDelete={(answerId) => onDelete(q.id, answerId)}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className={styles.noAnswer}>
            No answers yet. Be the first to answer!
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          onClick={handleHelpfulClick}
          className={`${styles.actionButton}`}
        >
          <span><BiSolidLike className={`${isHelpful ? styles.active : ""}`} /></span> {helpfulCount}
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <span>💬</span> {showReplyForm ? "Cancel" : "Reply"}
        </button>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className={styles.replyForm}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your answer..."
            rows={3}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Post Answer
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const QASection = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUserId] = useState("user1");

  useEffect(() => {
    fetchQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const question = {
      id: Date.now(),
      userId: currentUserId,
      user: "You",
      isVerified: true,
      date: new Date().toISOString(),
      question: newQuestion.trim(),
      helpful: 0,
      answers: [],
    };
    setQuestions([question, ...questions]);
    setNewQuestion("");
  };

  const handleHelpfulClick = (id, newCount) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === id) return { ...q, helpful: newCount };
        const updatedAnswers = q.answers.map((a) =>
          a.id === id ? { ...a, helpful: newCount } : a
        );
        return { ...q, answers: updatedAnswers };
      })
    );
  };

  const handleReplySubmit = (questionId, replyText) => {
    const newAnswer = {
      id: Date.now(),
      userId: currentUserId,
      user: "You",
      isVerified: true,
      role: "user",
      text: replyText,
      helpful: 0,
    };

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
  };

  const handleDelete = (questionId, answerId = null) => {
    if (answerId) {
      // Delete an answer
      setQuestions(prevQuestions =>
        prevQuestions.map(q => ({
          ...q,
          answers: q.answers.filter(a => a.id !== answerId)
        }))
      );
    } else {
      // Delete a question
      setQuestions(prevQuestions =>
        prevQuestions.filter(q => q.id !== questionId)
      );
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    return sortBy === "recent"
      ? new Date(b.date) - new Date(a.date)
      : b.helpful - a.helpful;
  });

  const filteredQuestions = sortedQuestions.filter((q) => {
    if (activeFilter === "answered") return q.answers.length > 0;
    if (activeFilter === "unanswered") return q.answers.length === 0;
    return true;
  });

  return (
    <div className={styles.qaSection}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span>{questions.length} questions</span>
          <span>
            {questions.reduce((acc, q) => acc + q.answers.length, 0)} answers
          </span>
        </div>
      </div>

      <div className={styles.askContainer}>
        <input
          type="text"
          placeholder="Ask a question about this product..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddQuestion()}
        />
        <button
          onClick={handleAddQuestion}
          disabled={!newQuestion.trim()}
          className={styles.askButton}
        >
          Ask Question
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "all" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All Questions
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "answered" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("answered")}
          >
            Answered
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "unanswered" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("unanswered")}
          >
            Unanswered
          </button>
        </div>
        <div className={styles.sortRow}>
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div style={{ height: "700px", overflowY: "auto" }}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            Loading Q&A...
          </div>
        ) : (
          <div className={styles.qaList}>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  onHelpfulClick={handleHelpfulClick}
                  onReplySubmit={handleReplySubmit}
                  onDelete={handleDelete}
                  currentUserId={currentUserId}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                No questions found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QASection;