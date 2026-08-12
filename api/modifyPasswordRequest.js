import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const changePassword = async (userId,newPassword,newPasswordCheck) => {
    const result = requestJson(`${getServerUrl()}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify({
            newPassword: newPassword,
            newPasswordCheck: newPasswordCheck
        }),
    });
    return result;
};
