import BoardItem from '../component/board/boardItem.js';
import Dialog from '../component/dialog/dialog.js';
import Header from '../component/header/header.js';
import { authCheck, getServerUrl, prependChild, resolveImageUrl } from '../utils/function.js';
// import { getPosts } from '../api/indexRequest.js';
// import { searchPosts } from '../api/indexRequest.js'; // [미구현] 검색 (추후 구현)
import { getPosts, searchPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '../public/image/profile/default.jpg';
// const USER_PROFILE_IMAGE = 
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;
const DEFAULT_SORT = 'recent';
let currentKeyword = '';
let currentSort = DEFAULT_SORT;
let offset = 0;
let isEnd = false;
let isProcessing = false;

const updateSortVisibility = () => {
    const sortRow = document.querySelector('#searchSortRow');
    if (!sortRow) return;
    const isSearching = currentKeyword.trim().length > 0;
    sortRow.classList.toggle('isHidden', !isSearching);
    sortRow.setAttribute('aria-hidden', String(!isSearching));
};

// getBoardItem 함수
const getBoardItem = async (offsetValue = 0, limitValue = 5) => {
    // const result = await getPosts(offsetValue, limitValue);
    // [미구현] 검색 분기 (추후 구현)
    // const result =
    //     currentKeyword.trim() === ''
    //         ? await getPosts(offsetValue, limitValue)
    //         : await searchPosts(
    //               currentKeyword,
    //               offsetValue,
    //               limitValue,
    //               currentSort,
    //           );
    // 검색 분기 - 검색 API는 keyword 만 받으므로 offset/limit/sort 는 전달하지 않음
    const result =
        currentKeyword.trim() === ''
            ? await getPosts(offsetValue, limitValue)
            : await searchPosts(currentKeyword.trim());
    if (!result.ok) {
        throw new Error('Failed to load post list.');
    }
    return result.data;
};

const setBoardItem = boardData => {
    const boardList = document.querySelector('.boardList');
    if (boardList && boardData) {
        const itemsHtml = boardData
            .map(data =>
                BoardItem(
                    data.postId,
                    data.createdAt,
                    data.postName,
                    data.postViewCount,
                    // 목록 응답에 작성자 프로필 이미지 없음 → 기본 이미지 사용
                    data.profileImage || DEFAULT_PROFILE_IMAGE,
                    data.postUser,
                    data.postCommentCount,
                    data.postLikesCount,
                ),
            )
            .join('');
        boardList.innerHTML += ` ${itemsHtml}`;
    }
};

const resetBoardList = () => {
    const boardList = document.querySelector('.boardList');
    if (boardList) {
        boardList.innerHTML = '';
    }
};

const loadBoardItems = async ({ reset = false } = {}) => {
    if (isProcessing || (!reset && isEnd)) return;
    isProcessing = true;

    try {
        if (reset) {
            offset = 0;
            isEnd = false;
            resetBoardList();
        }
        const items = await getBoardItem(offset, ITEMS_PER_LOAD);
        if (!items || items.length === 0) {
            isEnd = true;
            return;
        }
        setBoardItem(items);
        // 백엔드가 전체 목록을 한 번에 반환 → 1회 로드 후 종료 (페이징 추후 구현)
        isEnd = true;
        offset += ITEMS_PER_LOAD;
    } catch (error) {
        console.error('Error fetching items:', error);
        isEnd = true;
    } finally {
        isProcessing = false;
    }
};

const addSearchEvent = () => {
    const searchInput = document.querySelector('#searchInput');
    const searchButton = document.querySelector('.searchButton');
    if (!searchInput || !searchButton) return;

    const runSearch = async () => {
        const trimmedKeyword = searchInput.value.trim();
        if (trimmedKeyword.length > 0 && trimmedKeyword.length < 2) {
            Dialog('검색 실패', '검색어는 2글자 이상 입력해주세요.');
            return;
        }
        currentKeyword = trimmedKeyword;
        // 백엔드 검색 API가 sort 를 지원하지 않아 정렬 UI 노출은 보류 (추후 구현)
        // updateSortVisibility();
        await loadBoardItems({ reset: true });
    };

    searchButton.addEventListener('click', runSearch);
    searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            runSearch();
        }
    });
};

const addSortEvent = () => {
    const sortSelect = document.querySelector('#searchSortSelect');
    if (!sortSelect) return;
    sortSelect.value = currentSort;

    sortSelect.addEventListener('change', async () => {
        currentSort = sortSelect.value || DEFAULT_SORT;
        if (currentKeyword.trim().length === 0) return;
        await loadBoardItems({ reset: true });
    });
};

// 스크롤 이벤트 추가
const addInfinityScrollEvent = () => {
    offset = INITIAL_OFFSET;
    isEnd = false;
    isProcessing = false;

    window.addEventListener('scroll', async () => {
        const hasScrolledToThreshold =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight * SCROLL_THRESHOLD;
        if (hasScrolledToThreshold) {
            loadBoardItems();
        }
    });
};

const init = async () => {
    try {
        // authCheck()는 저장된 user 객체를 반환(없으면 로그인 페이지로 이동)
        const user = await authCheck();
        if (!user) return;

        const profileImageUrl = resolveImageUrl(
            user.profileImage,
            DEFAULT_PROFILE_IMAGE,
        );

        prependChild(
            document.body,
            Header('Community', 0, profileImageUrl),
        );

        await loadBoardItems({ reset: true });

        // [미구현] 검색 / 정렬 / 무한 스크롤 (추후 구현)
        // updateSortVisibility();
        // addSearchEvent();
        // addSortEvent();
        // addInfinityScrollEvent();

        // 검색만 활성화. 정렬(sort) / 무한 스크롤(offset,limit)은 백엔드 미지원이라 보류
        addSearchEvent();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();
