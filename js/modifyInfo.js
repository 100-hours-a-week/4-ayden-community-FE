import { checkNickname } from '../api/signupRequest.js';
import Dialog from '../component/dialog/dialog.js';
import Header from '../component/header/header.js';
import {
    authCheck,
    prependChild,
    getServerUrl,
    resolveImageUrl,
    validNickname,
} from '../utils/function.js';
import { userModify, userDelete } from '../api/modifyInfoRequest.js';
import { requestJson } from '../utils/request.js';

const emailTextElement = document.querySelector('#id');
const nicknameInputElement = document.querySelector('#nickname');
const profileInputElement = document.querySelector('#profile');
const withdrawBtnElement = document.querySelector('#withdrawBtn');
const nicknameHelpElement = document.querySelector(
    '.inputBox p[name="nickname"]',
);
const resultElement = document.querySelector('.inputBox p[name="result"]');
const modifyBtnElement = document.querySelector('#signupBtn');
const profilePreview = document.querySelector('#profilePreview');
const removeProfileButton = document.querySelector('#removeProfileButton');
// const authDataReponse = await authCheck();
// const authData = await authDataReponse.json();
//dto형식 응답으로인한 변경
const authData = await authCheck();
const changeData = {
    nickName: authData.nickName,
    profileImage: authData.profileImage,
};

const DEFAULT_PROFILE_IMAGE = '../public/image/profile/default.jpg';
const HTTP_OK = 200;
const HTTP_CREATED = 201;

//응답구조 변환 후 재사용 예정
const setData = data => {
    if (
        // data.profileImageUrl === DEFAULT_PROFILE_IMAGE ||
        data.profileImage === DEFAULT_PROFILE_IMAGE
    ) {
        profilePreview.src = DEFAULT_PROFILE_IMAGE;
        if (removeProfileButton) removeProfileButton.style.display = 'none';
    } else {
        profilePreview.src = resolveImageUrl(
            data.profileImage,
            DEFAULT_PROFILE_IMAGE,
        );
        if (removeProfileButton) removeProfileButton.style.display = 'flex';

        const profileImageUrl = data.profileImage;
        const fileName = profileImageUrl.split('/').pop();
        localStorage.setItem('profileImageUrl', data.profileImage);

        const profileImage = new File(
            [resolveImageUrl(profileImageUrl)],
            fileName,
            { type: '' },
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(profileImage);
        profileInputElement.files = dataTransfer.files;
    }
    emailTextElement.textContent = data.email;
    nicknameInputElement.value = data.nickName;
};

const observeData = () => {
    const button = document.querySelector('#signupBtn');
    if (
        // authData.data.nickname !== changeData.nickname ||
        // authData.data.profileImageUrl !== changeData.profileImageUrl
        authData.nickName !== changeData.nickName ||
        authData.profileImage !== changeData.profileImage
    ) {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    } else {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    }
};

const changeEventHandler = async (event, uid) => {
    const button = document.querySelector('#signupBtn');
    //중복 체크 api 완성 후 연결예정
    // if (uid == 'nickname') {
    //     const value = event.target.value;
    //     // const isValidNickname = validNickname(value);
    //     const helperElement = nicknameHelpElement;
    //     let isComplete = false;
    //     if (value == '' || value == null) {
    //         helperElement.textContent = '*닉네임을 입력해주세요.';
    //     } else if (!isValidNickname) {
    //         helperElement.textContent =
    //             '*닉네임은 2~10자의 영문자, 한글 또는 숫자만 사용할 수 있습니다. 특수 문자와 띄어쓰기는 사용할 수 없습니다.';
    //     } else {
    //         const { status } = await checkNickname(value);
    //         if (status === HTTP_OK) {
    //             helperElement.textContent = '';
    //             isComplete = true;
    //         } else if (authData.nickName === value) {
    //             helperElement.textContent = '';
    //             button.disabled = true;
    //             button.style.backgroundColor = '#ACA0EB';
    //             return;
    //         } 
    //         else {
    //             helperElement.textContent = '*중복된 닉네임 입니다.';
    //             button.disabled = true;
    //             button.style.backgroundColor = '#ACA0EB';
    //             return;
    //         }
    //     }
    //     if (isComplete) {
    //         changeData.nickname = value;
    //     } else {
    //         changeData.nickName = authData.nickName;
    //     }
    // } 
    if (uid == 'nickname') {
    const value = event.target.value.trim();
    const helperElement = nicknameHelpElement;

    if (!value) {
        helperElement.textContent = '*닉네임을 입력해주세요.';
        changeData.nickName = authData.nickName;
    } else {
        helperElement.textContent = '';
        changeData.nickName = value;
    }
    console.log("변경된 닉네임:",changeData);
}
    else if (uid == 'profile') {
        // 사용자가 선택한 파일
        const file = event.target.files[0];
        console.log(changeData.profileImageUrl);
        if (!file) {
            localStorage.removeItem('profileImageUrl');
            profilePreview.src = DEFAULT_PROFILE_IMAGE;
            changeData.profileImageUrl = null;
            if (removeProfileButton) removeProfileButton.style.display = 'none';
        } else {
            const formData = new FormData();
            formData.append('profileImage', file);

            // 파일 업로드를 위한 POST 요청 실행
            try {
                const { ok, data } = await requestJson(
                    `${getServerUrl()}/v1/users/upload/profile-image`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );

                if (!ok) throw new Error('서버 응답 오류');
                localStorage.setItem(
                    'profileImageUrl',
                    data.profileImageUrl,
                );
                changeData.profileImageUrl = data.profileImageUrl;
                profilePreview.src = resolveImageUrl(
                    data.profileImageUrl,
                    DEFAULT_PROFILE_IMAGE,
                );
                if (removeProfileButton)
                    removeProfileButton.style.display = 'flex';
            } catch (error) {
                console.error('업로드 중 오류 발생:', error);
            }
        }
    }
    observeData();
};

//응답 구조 변경 후 수정예정
// const sendModifyData = async () => {
//     const button = document.querySelector('#signupBtn');

//     if (!button.disabled) {
//         if (changeData.nickName === '') {
//             Dialog('필수 정보 누락', '닉네임을 입력해주세요.');
//         } else {
//             const { status } = await userModify(changeData);

//             if (status === HTTP_CREATED) {
//                 localStorage.removeItem('profileImageUrl');
//                 saveToastMessage('수정완료');
//                 location.href = '/html/modifyInfo.html';
//             } else {
//                 localStorage.removeItem('profileImageUrl');
//                 saveToastMessage('수정실패');
//                 location.href = '/html/modifyInfo.html';
//             }
//         }
//     }
// };
const sendModifyData = async () => {
    const currentNickName = nicknameInputElement.value.trim();

    if (!currentNickName) {
        Dialog('필수 정보 누락', '닉네임을 입력해주세요.');
        return;
    }

    const requestData = {
        nickName: currentNickName,
        profileImage: changeData.profileImage,
    };

    try {
        console.log('수정 요청 데이터:', requestData);

        const result = await userModify(authData.userId, requestData);

        console.log('수정 응답:', result);

       
        // location.href = '/html/modifyInfo.html';
        location.href = '/html/index.html';
    } catch (error) {
        console.error('회원정보 수정 실패:', error);
    }
};
//회원 삭제(탈퇴) 관련 코드가 없어 추가
const deleteAccount = async () => {
    Dialog(
        '회원탈퇴 하시겠습니까?',
        '계정이 비활성화됩니다.',
        async () => {
            try {
                const result = await userDelete(authData.userId);
                console.log('회원 탈퇴 응답:', result);
                localStorage.clear();
                location.href = '/html/login.html';
            } catch (error) {
                console.error('회원 탈퇴 실패:', error);
                Dialog('회원 탈퇴 실패', '회원 탈퇴에 실패했습니다.');
            }
        }
    );
};
const addEvent = () => {
    nicknameInputElement.addEventListener('change', event =>
        changeEventHandler(event, 'nickname'),
    );
    profileInputElement.addEventListener('change', event =>
        changeEventHandler(event, 'profile'),
    );
    if (removeProfileButton) {
        removeProfileButton.addEventListener('click', () => {
            localStorage.removeItem('profileImageUrl');
            profilePreview.src = DEFAULT_PROFILE_IMAGE;
            changeData.profileImageUrl = null;
            profileInputElement.value = '';
            removeProfileButton.style.display = 'none';
            observeData();
        });
    }
    modifyBtnElement.addEventListener('click', async () => sendModifyData());
    withdrawBtnElement.addEventListener('click', async () => deleteAccount());
};

const showToast = (message, duration = 3000, callback = null) => {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toastMessage');
    toast.textContent = message;

    container.appendChild(toast);

    // 메시지를 보여주기
    setTimeout(() => {
        toast.style.opacity = 1;
        // 조금 더 위로 올라가는 효과를 줄 수 있음
        toast.style.bottom = '30px';
    }, 100);

    // 메시지 숨기기 및 콜백 실행
    setTimeout(() => {
        toast.style.opacity = 0;
        // 원래 위치로 돌아가며 사라지는 효과
        toast.style.bottom = '20px';
        setTimeout(() => {
            // 페이드 아웃이 끝난 후 요소 제거
            toast.remove();
            // 콜백 함수가 있으면 실행
            if (callback) callback();
        }, 500); // CSS transition 시간에 맞춰 설정
    }, duration);
};

const saveToastMessage = message => {
    sessionStorage.setItem('toastMessage', message);
};

// 토스트 메시지 표시 및 저장소에서 삭제
const displayToastFromStorage = () => {
    const message = sessionStorage.getItem('toastMessage');
    if (message) {
        showToast(message, 3000, () => {
            // 메시지 삭제
            sessionStorage.removeItem('toastMessage');
        }); // 메시지를 표시하는 기존 함수 사용
    }
};

const init = () => {
    const profileImage =
        resolveImageUrl(authData.profileImage, DEFAULT_PROFILE_IMAGE);

    prependChild(document.body, Header('커뮤니티', 2, profileImage));
    // setData(authData.data);
    setData(authData);
    observeData();
    addEvent();
    displayToastFromStorage();
};

init();
