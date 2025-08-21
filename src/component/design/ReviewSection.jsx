import React, { useState, useEffect, useRef } from "react";
import styles from "./ReviewSection.module.css";
import staticUserImage from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (2).png";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortOption, setSortOption] = useState("latest");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRatingDeleteConfirm, setShowRatingDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [voteTriggered, setVoteTriggered] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
    fetchRatings();
  }, [productId, sortOption]);

  useEffect(() => {
    if (ratingFilter) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews);
    }
  }, [reviews, ratingFilter]);

  useEffect(() => {
    if (voteTriggered) {
      try {
        window.scrollTo(0, scrollPositionRef.current);
        console.log("Restored scroll position to:", scrollPositionRef.current);
        setVoteTriggered(false);
      } catch (err) {
        console.error("Error restoring scroll position:", err);
      }
    }
  }, [reviews, voteTriggered]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/user-details", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ email: data.email, name: data.name });
        const ratingResponse = await fetch(`http://localhost:8080/api/products/${productId}/ratings`, {
          method: "GET",
          credentials: "include",
        });
        if (ratingResponse.ok) {
          const ratingsData = await ratingResponse.json();
          const userRating = ratingsData.find((r) => r.userEmail === data.email);
          if (userRating) {
            setUserRating(userRating.rating);
            setRating(userRating.rating);
          } else {
            setUserRating(null);
            setRating(0);
            setIsEditingRating(false);
          }
        }
      } else {
        setCurrentUser(null);
        setUserRating(null);
        setRating(0);
        setIsEditingRating(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
      setUserRating(null);
      setRating(0);
      setIsEditingRating(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/reviews?sort=${sortOption}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      } else if (response.status === 401) {
        setError("Unauthorized. Please log in.");
        setReviews([]);
      } else {
        setError("Failed to load reviews. Please try again.");
        setReviews([]);
      }
    } catch (error) {
      setError("An error occurred while loading reviews.");
      setReviews([]);
    }
    setLoading(false);
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/ratings`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRatings(data || []);
      } else {
        setRatings([]);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please log in to submit a review or rating.");
      return;
    }
    try {
      if (rating && !userRating && !isEditingRating) {
        const ratingResponse = await fetch(`http://localhost:8080/api/products/${productId}/ratings`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: rating.toString() }),
        });
        if (!ratingResponse.ok) {
          if (ratingResponse.status === 400) {
            setError("You have already rated this product.");
          } else if (ratingResponse.status === 401) {
            setError("Unauthorized. Please log in.");
          } else {
            setError("Failed to add rating. Please try again.");
          }
          return;
        }
      } else if (rating && isEditingRating) {
        const ratingResponse = await fetch(`http://localhost:8080/api/products/${productId}/ratings`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: rating.toString() }),
        });
        if (!ratingResponse.ok) {
          if (ratingResponse.status === 401) {
            setError("Unauthorized. Please log in.");
          } else {
            setError("Failed to update rating. Please try again.");
          }
          return;
        }
        setIsEditingRating(false);
      }
      if (reviewText.trim()) {
        const reviewResponse = await fetch(`http://localhost:8080/api/products/${productId}/reviews`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewText }),
        });
        if (!reviewResponse.ok) {
          setError(reviewResponse.status === 401 ? "Unauthorized. Please log in." : "Failed to add review. Please try again.");
          return;
        }
      }
      setRating(0);
      setReviewText("");
      await fetchRatings();
      await fetchCurrentUser();
      await fetchReviews();
    } catch (error) {
      setError("An error occurred while submitting.");
    }
  };

  const handleEditRating = () => {
    setIsEditingRating(true);
  };

  const handleDeleteRating = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/ratings`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUserRating(null);
        setRating(0);
        setIsEditingRating(false);
        await fetchRatings();
        await fetchCurrentUser();
      } else if (response.status === 401) {
        setError("Unauthorized. Please log in.");
      } else {
        setError("Failed to delete rating. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while deleting the rating.");
    }
    setShowRatingDeleteConfirm(false);
  };

  const handleHelpfulVote = async (reviewId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    scrollPositionRef.current = window.scrollY;
    setVoteTriggered(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews/vote`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, voteType: "like" }),
      });
      if (response.ok) {
        await fetchReviews();
      } else if (response.status === 401) {
        setError("Unauthorized. Please log in.");
      } else {
        setError("Failed to record vote. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while voting.");
      setVoteTriggered(false);
    }
  };

  const handleDislikeVote = async (reviewId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    scrollPositionRef.current = window.scrollY;
    setVoteTriggered(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews/vote`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, voteType: "dislike" }),
      });
      if (response.ok) {
        await fetchReviews();
      } else if (response.status === 401) {
        setError("Unauthorized. Please log in.");
      } else {
        setError("Failed to record vote. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while voting.");
      setVoteTriggered(false);
    }
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!currentUser || !reviewToDelete) return;
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/reviews/${reviewToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        await fetchReviews();
      } else if (response.status === 401) {
        setError("Unauthorized. Please log in.");
      } else {
        setError("Failed to delete review. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while deleting the review.");
    }
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
  };

  const cancelRatingDelete = () => {
    setShowRatingDeleteConfirm(false);
  };

  const averageRating = ratings.length ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1) : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  ratings.forEach((r) => {
    ratingDistribution[5 - r.rating]++;
  });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < fullStars
                ? styles.filledStar
                : hasHalfStar && i === fullStars
                ? styles.halfStar
                : styles.emptyStar
            }
          >
            ★
          </span>
        ))}
      </>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return (
    <div className={styles.error}>
      {error}
      <button
        onClick={() => {
          fetchReviews();
          fetchRatings();
          fetchCurrentUser();
        }}
        className={styles.retryButton}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className={styles.reviewSection}>
      {showDeleteConfirm && (
        <div className={styles.confirmationDialogOverlay}>
          <div className={styles.confirmationDialog}>
            <p>Are you sure you want to delete this review?</p>
            <div className={styles.dialogButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}>
                Delete
              </button>
              <button onClick={cancelDelete} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showRatingDeleteConfirm && (
        <div className={styles.confirmationDialogOverlay}>
          <div className={styles.confirmationDialog}>
            <p>Are you sure you want to delete your rating?</p>
            <div className={styles.dialogButtons}>
              <button onClick={handleDeleteRating} className={styles.confirmButton}>
                Delete
              </button>
              <button onClick={cancelRatingDelete} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.summaryContainer}>
        <div className={styles.averageRating}>
          <div className={styles.averageNumber}>{averageRating}</div>
          <div className={styles.stars}>{renderStars(averageRating)}</div>
          <div className={styles.totalReviews}>{ratings.length} ratings</div>
        </div>
        <div className={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((stars) => (
            <div
              key={stars}
              className={styles.ratingBar}
              onClick={() => setRatingFilter(stars)}
            >
              <span>{stars} star</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{ width: `${(ratingDistribution[5 - stars] / ratings.length) * 100 || 0}%` }}
                />
              </div>
              <span>{ratingDistribution[5 - stars]}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
        <h3>Write Your Review</h3>
        <div className={styles.ratingInput}>
          <label>Your Rating:</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.filledStar : styles.emptyStar}
                onClick={() => (!userRating || isEditingRating ? setRating(star) : null)}
              >
                ★
              </span>
            ))}
            {userRating && !isEditingRating && (
              <span className={styles.ratedMessage}>
                You rated: {userRating} star{userRating !== 1 ? "s" : ""}
                <button
                  onClick={handleEditRating}
                  className={styles.editRatingButton}
                  title="Edit rating"
                  type="button"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => setShowRatingDeleteConfirm(true)}
                  className={styles.deleteRatingButton}
                  title="Delete rating"
                  type="button"
                >
                  <RiDeleteBin6Line />
                </button>
              </span>
            )}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="reviewText">Your Review:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className={styles.reviewTextarea}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={(!rating || (userRating && !isEditingRating)) && !reviewText.trim()}
        >
          {isEditingRating ? "Update Rating" : "Submit"}
        </button>
      </form>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>
            Filter by:
            <select
              value={ratingFilter || ""}
              onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
              className={styles.filterSelect}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </label>
        </div>
        <div className={styles.sortGroup}>
          <label>
            Sort by:
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="latest">Latest</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {filteredReviews.length === 0 ? (
          <div className={styles.noReviews}>No reviews yet.</div>
        ) : (
          filteredReviews.map((review) => {
            const canDelete = review.userEmail === (currentUser ? currentUser.email : null);
            return (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.userInfo}>
                    <img src={staticUserImage} alt="User" className={styles.userAvatar} />
                    <span className={styles.userName}>{review.userName}</span>
                    <span className={styles.verifiedTag}>Verified Purchase</span>
                  </div>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteClick(review.id)}
                        className={styles.deleteButton}
                        title="Delete review"
                        type="button"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  <p>{review.reviewText}</p>
                </div>
                <div className={styles.reviewFooter}>
                  <button
                    type="button"
                    className={styles.voteButton}
                    onClick={(e) => handleHelpfulVote(review.id, e)}
                    tabIndex={-1}
                  >
                    <BiSolidLike className={`${review.userVote === "like" ? styles.active : ""}`} />
                    <span className={styles.voteCount}>{review.likeCount}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.voteButton}
                    onClick={(e) => handleDislikeVote(review.id, e)}
                    tabIndex={-1}
                  >
                    <BiSolidDislike className={`${review.userVote === "dislike" ? styles.active : ""}`} />
                    <span className={styles.voteCount}>{review.dislikeCount}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewSection;