import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

// 백엔드 GET /posts 는 현재 페이징(offset/limit) 미지원 → 전체 목록 반환
export const getPosts = (offset, limit) => {
    const result = requestJson(`${getServerUrl()}/posts`, {
        // credentials: 'include',
    });
    // [페이징 추후 구현] 백엔드가 offset/limit 지원 시 아래로 교체
    // const result = requestJson(
    //     `${getServerUrl()}/v1/posts?offset=${offset}&limit=${limit}`,
    //     {
    //         credentials: 'include',
    //     },
    // );
    return result;
};

// [미구현] 게시글 검색 - 백엔드에 /posts/search 엔드포인트 없음 (추후 구현)
// export const searchPosts = (keyword, offset = 0, limit = 5, sort = 'recent') => {
//     const query = new URLSearchParams({
//         keyword,
//         offset,
//         limit,
//         sort,
//     });
//     const result = requestJson(
//         `${getServerUrl()}/v1/posts/search?${query.toString()}`,
//         {
//             credentials: 'include',
//         },
//     );
//     return result;
// };
