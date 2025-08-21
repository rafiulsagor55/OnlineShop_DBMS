import React, { useState, useEffect } from "react";
import styles from "./QASection.module.css";
import userAvatar from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (2).png";
import supportAvatar from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (4).png";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

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

const AnswerCard = ({ answer, onVote, onDelete, currentUserEmail }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleVote = (voteType) => {
    onVote("answer", answer.id, voteType);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete("answer", answer.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const canDelete = answer.userEmail === currentUserEmail;
  const isLiked = answer.userVote === "like";
  const isDisliked = answer.userVote === "dislike";

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
          <strong>{answer.userName}</strong>
          <span className={styles.verified}>✔ Verified</span>
        </div>
      </div>
      <div className={styles.aText}>{answer.answer}</div>
      <div className={styles.actions}>
        <button
          onClick={() => handleVote("like")}
          className={`${styles.actionButton}`}
        >
          <BiSolidLike className={`${isLiked ? styles.active : ""}`} />{" "}
          {answer.likeCount}
        </button>
        <button
          onClick={() => handleVote("dislike")}
          className={`${styles.actionButton}`}
        >
          <BiSolidDislike className={`${isDisliked ? styles.active : ""}`} />{" "}
          {answer.dislikeCount}
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

const QuestionCard = ({ q, onVote, onReplySubmit, onDelete, currentUserEmail }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleVote = (voteType) => {
    onVote("question", q.id, voteType);
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
    onDelete("question", q.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const canDelete = q.userEmail === currentUserEmail;
  const isLiked = q.userVote === "like";
  const isDisliked = q.userVote === "dislike";

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
            <strong>{q.userName}</strong>
            <span className={styles.verified}>✔ Verified</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.date}>
            {new Date(q.createdAt).toLocaleDateString()}
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
              onVote={onVote}
              onDelete={onDelete}
              currentUserEmail={currentUserEmail}
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
          onClick={() => handleVote("like")}
          className={`${styles.actionButton}`}
        >
          <BiSolidLike className={`${isLiked ? styles.active : ""}`} />{" "}
          {q.likeCount}
        </button>
        <button
          onClick={() => handleVote("dislike")}
          className={`${styles.actionButton}`}
        >
          <BiSolidDislike className={`${isDisliked ? styles.active : ""}`} />{" "}
          {q.dislikeCount}
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

const QASection = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]); // New state for filtered questions
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchQuestions();
  }, [productId, sortBy]);

  useEffect(() => {
    // Apply local filtering based on activeFilter
    if (activeFilter === "all") {
      setFilteredQuestions(questions);
    } else if (activeFilter === "answered") {
      setFilteredQuestions(questions.filter((q) => q.answers.length > 0));
    } else if (activeFilter === "unanswered") {
      setFilteredQuestions(questions.filter((q) => q.answers.length === 0));
    }
  }, [questions, activeFilter]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/user-details", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ email: data.email, name: data.name });
      } else {
        console.error("Failed to fetch user details:", response.status);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `Fetching questions with productId: ${productId}, sort: ${sortBy}, filter: all`
      );
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/questions?sort=${sortBy}&filter=all`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Questions fetched:", data);
        setQuestions(data || []);
      } else {
        console.error("Failed to fetch questions:", response.status, response.statusText);
        setError("Failed to load questions. Please try again.");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("An error occurred while loading questions.");
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !currentUser) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/questions`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: newQuestion }),
        }
      );
      if (response.ok) {
        setNewQuestion("");
        fetchQuestions();
      } else {
        console.error("Failed to add question:", response.status);
        setError("Failed to add question. Please try again.");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      setError("An error occurred while adding the question.");
    }
  };

  const handleReplySubmit = async (questionId, replyText) => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/questions/${questionId}/answers`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: replyText }),
        }
      );
      if (response.ok) {
        fetchQuestions();
      } else {
        console.error("Failed to add answer:", response.status);
        setError("Failed to add answer. Please try again.");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
      setError("An error occurred while adding the answer.");
    }
  };

  const handleDelete = async (entityType, id) => {
    if (!currentUser) return;
    try {
      const url =
        entityType === "question"
          ? `http://localhost:8080/api/products/${productId}/questions/${id}`
          : `http://localhost:8080/api/products/${productId}/answers/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchQuestions();
      } else {
        console.error(`Failed to delete ${entityType}:`, response.status);
        setError(`Failed to delete ${entityType}. Please try again.`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setError(`An error occurred while deleting the ${entityType}.`);
    }
  };

  const handleVote = async (entityType, entityId, voteType) => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/vote`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType, entityId, voteType }),
        }
      );
      if (response.ok) {
        fetchQuestions();
      } else {
        console.error("Failed to vote:", response.status);
        setError("Failed to record vote. Please try again.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      setError("An error occurred while voting.");
    }
  };

  const totalQuestions = filteredQuestions.length;
  const totalAnswers = filteredQuestions.reduce((acc, q) => acc + q.answers.length, 0);

  return (
    <div className={styles.qaSection}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span>{totalQuestions} questions</span>
          <span>{totalAnswers} answers</span>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button
            onClick={fetchQuestions}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      <div className={styles.askContainer}>
        <input
          type="text"
          placeholder="Ask a question about this product..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddQuestion()}
          disabled={!currentUser}
        />
        <button
          onClick={handleAddQuestion}
          disabled={!newQuestion.trim() || !currentUser}
          className={styles.askButton}
        >
          Ask Question
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${activeFilter === "all" ? styles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Questions
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === "answered" ? styles.active : ""}`}
            onClick={() => setActiveFilter("answered")}
          >
            Answered
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === "unanswered" ? styles.active : ""}`}
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
                  onVote={handleVote}
                  onReplySubmit={handleReplySubmit}
                  onDelete={handleDelete}
                  currentUserEmail={currentUser ? currentUser.email : null}
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