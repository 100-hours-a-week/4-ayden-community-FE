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

// [기존 미구현 버전] offset/limit/sort 지원 가정 - 현재 백엔드 스펙과 불일치
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

// 게시글 검색 - 백엔드 GET /posts/search 는 keyword 만 받음 (offset/limit/sort 미지원)
// 응답은 /posts 와 동일한 PostListResponseDto 목록 (현재 최대 20건)
export const searchPosts = keyword => {
    const result = requestJson(
        `${getServerUrl()}/posts/search?keyword=${encodeURIComponent(keyword)}`,
        {
            // credentials: 'include',
        },
    );
    return result;
};
