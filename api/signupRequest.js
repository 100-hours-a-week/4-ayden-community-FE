import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const userSignup = async data => {
    const result = await requestJson(`${getServerUrl()}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return result;
};

export const checkEmail = async email => {
    const result = await requestJson(
        `${getServerUrl()}/users/email/check?email=${email}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return result;
};

export const checkNickname = async nickname => {
    const result = await requestJson(
        `${getServerUrl()}/users/nickname/check?nickName=${nickname}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return result;
};

// export const fileUpload = async file => {
//     const result = await requestJson(
//         `${getServerUrl()}/v1/users/upload/profile-image`,
//         {
//             method: 'POST',
//             body: file,
//         },
//     );
//     return result;
// };
