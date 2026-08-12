export const getServerUrl = () => {
    const configUrl =
        typeof window !== 'undefined' &&
        window.__APP_CONFIG__ &&
        window.__APP_CONFIG__.API_BASE_URL
            ? String(window.__APP_CONFIG__.API_BASE_URL).trim()
            : '';

    if (configUrl) {
        return configUrl.replace(/\/+$/, '');
    }
//이 부분 하드코딩 -> 로컬은 8080 배포 후는 api
    const host = window.location.hostname;
    const isLocal =
        host ==='localhost' || host === '127.0.0.1';
    return isLocal
        ? 'http://localhost:8080'
        : 'https://api.ayden1.cloud';
};

export const resolveImageUrl = (url, fallback = null) => {
    if (!url) return fallback;
    if (/^https?:\/\//i.test(url)) return url;
    return `${getServerUrl()}${url}`;
};

// 세션 쿠키 기반 인증 확인 - 백엔드에 /auth/check 엔드포인트가 없어 현재 미사용 
// export const serverSessionCheck = async () => {
//     const res = await fetch(`${getServerUrl()}/v1/auth/check`, {
//         method: 'GET',
//         credentials: 'include',
//     });
//     return res;
// };
//
// export const authCheck = async () => {
//     const HTTP_OK = 200;
//     const response = await serverSessionCheck();
//     if (!response || response.status !== HTTP_OK)
//         location.href = '/html/login.html';
//     return response;
// };
//
// export const authCheckReverse = async () => {
//     const response = await serverSessionCheck();
//     if (response && response.ok) {
//         location.href = '/';
//     }
// };

// JWT 액세스 토큰 기반. 로그인 응답에서 저장해 둔 accessToken / user 사용.
export const getAccessToken = () =>
    typeof localStorage !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        return null;
    }
};

// 로그인 확인: 토큰/유저 없으면 로그인 페이지로, 있으면 저장된 user 객체 반환
export const authCheck = async () => {
    const token = getAccessToken();
    const user = getStoredUser();
    if (!token || !user) {
        location.href = '/html/login.html';
        return null;
    }
    return user;
};

export const authCheckReverse = async () => {
    if (getAccessToken()) {
        location.href = '/';
    }
};
// 이메일 유효성 검사
export const validEmail = email => {
    const REGEX =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return REGEX.test(email);
};

export const validPassword = password => {
    const REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return REGEX.test(password);
};

export const validNickname = nickname => {
    const REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;
    return REGEX.test(nickname);
};

export const prependChild = (parent, child) => {
    parent.insertBefore(child, parent.firstChild);
};

/**
 *
 * @param {File} file  이미지 파일
 * @param {boolean} isHigh? : true면 origin, false면  1/4 사이즈
 * @returns
 */
export const fileToBase64 = (file, isHigh) => {
    return new Promise((resolve, reject) => {
        const size = isHigh ? 1 : 4;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const width = img.width / size;
                const height = img.height / size;
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(ctx.canvas.toDataURL());
            };
            img.onerror = e => {
                reject(e);
            };
        };
        reader.onerror = e => {
            reject(e);
        };
    });
};

/**
 *
 * @param {string} param
 * @returns
 */
export const getQueryString = param => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};

export const padTo2Digits = number => {
    return number.toString().padStart(2, '0');
};
