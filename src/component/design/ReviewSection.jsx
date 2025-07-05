import React, { useState, useEffect } from "react";
import styles from "./ReviewSection.module.css";
import staticUserImage from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (2).png";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortOption, setSortOption] = useState("latest");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [currentUserId] = useState("user1"); // In a real app, this would come from auth context
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const mockReviews = [
          {
            id: 1,
            userId: "user1",
            user: "John Doe",
            rating: 5,
            date: "2023-05-15",
            text: "Excellent product! Exceeded my expectations.",
            isVerified: true,
            helpfulCount: 12,
            dislikeCount: 1,
          },
          {
            id: 2,
            userId: "user2",
            user: "Jane Smith",
            rating: 4,
            date: "2023-05-10",
            text: "Good quality but delivery was late.",
            isVerified: true,
            helpfulCount: 5,
            dislikeCount: 0,
          },
        ];

        let filtered = [...mockReviews];
        if (ratingFilter) {
          filtered = filtered.filter((r) => r.rating === ratingFilter);
        }

        filtered.sort((a, b) => {
          if (sortOption === "latest") return new Date(b.date) - new Date(a.date);
          if (sortOption === "helpful") return b.helpfulCount - a.helpfulCount;
          if (sortOption === "highest") return b.rating - a.rating;
          return 0;
        });

        setReviews(filtered);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reviews.");
        setLoading(false);
        console.log(err);
      }
    };

    fetchReviews();
  }, [productId, ratingFilter, sortOption]);

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    ratingDistribution[5 - r.rating]++;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      userId: currentUserId,
      user: "You",
      rating,
      date: new Date().toISOString(),
      text: reviewText,
      isVerified: true,
      helpfulCount: 0,
      dislikeCount: 0,
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setReviewText("");
  };

  const handleHelpfulVote = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => {
        if (r.id !== reviewId) return r;

        const currentVote = userVotes[reviewId];
        const updatedReview = { ...r };

        if (currentVote === "like") {
          updatedReview.helpfulCount--;
          setUserVotes((prev) => ({ ...prev, [reviewId]: null }));
        } else {
          if (currentVote === "dislike") updatedReview.dislikeCount--;
          updatedReview.helpfulCount++;
          setUserVotes((prev) => ({ ...prev, [reviewId]: "like" }));
        }

        return updatedReview;
      })
    );
  };

  const handleDislikeVote = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => {
        if (r.id !== reviewId) return r;

        const currentVote = userVotes[reviewId];
        const updatedReview = { ...r };

        if (currentVote === "dislike") {
          updatedReview.dislikeCount--;
          setUserVotes((prev) => ({ ...prev, [reviewId]: null }));
        } else {
          if (currentVote === "like") updatedReview.helpfulCount--;
          updatedReview.dislikeCount++;
          setUserVotes((prev) => ({ ...prev, [reviewId]: "dislike" }));
        }

        return updatedReview;
      })
    );
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewToDelete));
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
  };

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.reviewSection}>
      {/* Confirmation Dialog */}
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

      <div className={styles.summaryContainer}>
        <div className={styles.averageRating}>
          <div className={styles.averageNumber}>{averageRating.toFixed(1)}</div>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.round(averageRating) ? styles.filledStar : styles.emptyStar}
              >
                ★
              </span>
            ))}
          </div>
          <div className={styles.totalReviews}>{reviews.length} reviews</div>
        </div>

        <div className={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className={styles.ratingBar} onClick={() => setRatingFilter(stars)}>
              <span>{stars} star</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(ratingDistribution[5 - stars] / reviews.length) * 100 || 0}%`,
                  }}
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
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewText">Your Review:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className={styles.reviewTextarea}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>Submit Review</button>
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
              <option value="highest">Highest Rating</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <div className={styles.noReviews}>No reviews match your filters.</div>
        ) : (
          reviews.map((review) => {
            const canDelete = review.userId === currentUserId;
            return (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.userInfo}>
                    <img src={staticUserImage} alt="User" className={styles.userAvatar} />
                    <span className={styles.userName}>{review.user}</span>
                    {review.isVerified && <span className={styles.verifiedTag}>Verified Purchase</span>}
                  </div>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? styles.filledStar : styles.emptyStar}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className={styles.reviewActions}>
                      <span className={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(review.id)}
                          className={styles.deleteButton}
                          title="Delete review"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.reviewContent}>
                  <p>{review.text}</p>
                </div>

                <div className={styles.reviewFooter}>
                  <button
                    className={`${styles.voteButton}`}
                    onClick={() => handleHelpfulVote(review.id)}
                  >
                    <BiSolidLike className={`${userVotes[review.id] === "like" ? styles.active : ""}`} /> {review.helpfulCount}
                  </button>
                  <button
                    className={`${styles.voteButton} `}
                    onClick={() => handleDislikeVote(review.id)}
                  >
                    <BiSolidDislike className={`${userVotes[review.id] === "dislike" ? styles.active : ""}`} /> {review.dislikeCount}
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