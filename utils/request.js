export const parseJsonSafe = async response => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return null;
    }
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const requestJson = async (url, options = {}) => {
    //브라우저 저장소에서 액세스 토큰 꺼내는 부분
    const token =
        typeof localStorage !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;
    //요청 헤더를 만드는 부분
    const headers = {
        ...(options.headers || {}),
        //토큰이 있으면 추가
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers });
    const body = await parseJsonSafe(response);
    return {
        response,
        ok: response.ok,
        status: response.status,
        // code: body && body.data && body.data.code ? body.data.code : null,
        // 백엔드 GlobalExceptionHandler는 { success, code, message } 형태로 code를 최상위에 내려줌
        // → 최상위 code 우선, ApiResponse.data.code 형태는 폴백으로 유지
        code: body ? (body.code ?? body.data?.code ?? null) : null,
        //아직 백엔드 응답형식 변경 전 -> ApiResponse, Dto방식 둘 다 가능하게
        //body 자체를 반환할 수 있게 추가
        data: body && Object.prototype.hasOwnProperty.call(body, 'data')
            ? body.data
            : body,
        body,
    };
};
