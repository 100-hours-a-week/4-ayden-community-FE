import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const createPost = boardData => {
    const result = requestJson(`${getServerUrl()}/posts`, {
        method: 'POST',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
        },
        // credentials: 'include',
    });
    return result;
};

export const updatePost = (postId, boardData) => {
    const result = requestJson(`${getServerUrl()}/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
        },
        // credentials: 'include',
    });

    return result;
};

// [미구현] 게시글 첨부파일 업로드 - 백엔드에 /posts/upload/attach-file 엔드포인트 없음 (추후 구현)
export const fileUpload = formData => {
    const result = requestJson(getServerUrl() + '/posts/upload/attach', {
        method: 'POST',
        body: formData,
    });

    return result;
};

export const getBoardItem = postId => {
    const result = requestJson(getServerUrl() + `/posts/${postId}`, {
        method: 'GET',
        // credentials: 'include',
    });

    return result;
};
