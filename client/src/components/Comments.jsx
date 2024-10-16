import React, {useState} from 'react';
import Comment from './Comment';

const Comments = ({comments, onDeleteComment}) => {
	const [showMore, setShowMore] = useState(2);

	const handleShowMore = () => {
		setShowMore((prev) => {
			const newShowMore = prev + 10;
			return newShowMore > comments.length ? comments.length : newShowMore;
		});
	};
	return (
		<div className='p-2 text-gray-600'>
			{comments.length > 2 && showMore < comments.length && (
				<button className='text-sm font-bold mb-3' onClick={handleShowMore}>
					View more comments
				</button>
			)}
			<div className='flex flex-col gap-y-3'>
				{comments.slice(-showMore).map((comment) => {
					return (
						<Comment
							key={comment._id}
							comment={comment}
							onDelete={onDeleteComment}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Comments;
