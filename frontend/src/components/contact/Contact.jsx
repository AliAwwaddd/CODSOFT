import React, { useRef, useEffect } from "react";
import "./contact.css";
import usePostComment from "../Hooks/usePostComment";

const Contact = ({ userId, taskId, projectId, reloadComments }) => {
	const form = useRef();
	const { loading, error, data, postComment } = usePostComment();
	// console.log(`${userId} - ${taskId} - ${projectId}`);

	// console.log("contact");

	const addComment = (event) => {
		event.preventDefault();
		event.value = "";
		const formData = new FormData(form.current);
		const comment = formData.get("comment");
		if (!comment.trim()) {
			return;
		}

		// Call the postComment function with the comment data
		postComment(userId, taskId, comment, projectId);
		form.current.reset();
		// console.log(data);
	};

	useEffect(() => {
		if (data) {
			reloadComments(data);
		}
	}, [data]);

	return (
		<div className="contact__container container grid">
			<div className="contact__content">
				<form
					ref={form}
					onSubmit={addComment}
					action=""
					className="contact__form"
				>
					<div className="contact__form-div contact__form-area">
						<textarea
							name="comment"
							cols="30"
							rows="10"
							className="contact__form-input"
							placeholder="Write your comment"
						></textarea>
					</div>
					<div className="contact__button__container">
						<button
							type="submit"
							className="button button--flex"
							disabled={loading}
						>
							{loading ? "Adding comment..." : "Add comment"}
							{/* <svg
								className="button__icon"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="blue"
							></svg> */}
							<i
								key="593358"
								style={{
									marginTop: "5px",
									marginLeft: "5px",
									width: "24px",
									height: "24px",
									viewBox: "0 0 24 24",
									transform: "rotate(-40deg)",
								}}
								className="uil uil-message"
							></i>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default React.memo(Contact);
