import React, { useState, useEffect } from "react";
import "./comments.css";
import useFetch from "../Hooks/useFetch";
import { formatDistanceToNow } from "date-fns";
import useDeleteComment from "../Hooks/useDeleteComment";

const Comments = ({
	content,
	timestamp,
	commentUserId,
	taskId,
	isCreator,
	userId,
	commentId,
	taskId2,
	DeleteCommentFc,
}) => {
	const [reload, setReload] = useState(false);
	const { data, loading, error } = useFetch(
		`http://localhost:3001/getname/${commentUserId}`
	);

	const {
		loading: deleteLoading,
		error: deleteError,
		deleteComment,
	} = useDeleteComment();

	const handleDeleteComment = async () => {
		try {
			const confirmed = window.confirm(
				"Are you sure you want to delete this comment?"
			);
			if (!confirmed) {
				return;
			}
			console.log("commentUserId:", commentUserId, "userId:", userId);
			// console.log("commentId", commentId, "taskId", taskId2);
			await deleteComment(commentId, taskId2);
			console.log("Comment deleted");
			DeleteCommentFc(commentId);
		} catch (error) {
			console.error("Error deleting comment:", error);
			// Provide user feedback about the error, e.g., display a message
		}
	};

	const formatted = timestamp
		? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
		: "";

	if (loading) return <h2>Loading...</h2>;
	const name = data ? data.name : "";
	return (
		<div className="comments__content">
			<div className="comments__info">
				<div className="comments__card">
					<h3 className="comments__card-title">{name}</h3>
					<span className="comments__card-data">{content}</span>
					<span className="comments__card-data">{formatted}</span>
				</div>
			</div>
			<div className="task__id">{taskId && <span> {taskId}</span>}</div>
			{(isCreator.isCreator || commentUserId == userId) && (
				<div className="delete__comment">
					<button onClick={handleDeleteComment}>
						<i className="uil uil-trash"></i>
					</button>
				</div>
			)}
		</div>
	);
};

export default React.memo(Comments);
