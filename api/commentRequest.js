import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const createComment = (postId,commentContent) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/comments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {commentText: commentContent}
            ),
        }    
    );
    return result;

}

export const deleteComment = (postId, commentId) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/comments/${commentId}`,
        {
            method: 'DELETE',
            // credentials: 'include',
        },
    );
    return result;
};

export const updateComment = (postId, commentId, commentContent) => {
    const result = requestJson(
        `${getServerUrl()}/posts/${postId}/comments/${commentId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include',
            body: JSON.stringify(commentContent),
        },
    );
    return result;
};
