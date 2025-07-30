const SensitiveKeys = {

    PASSWORD: 'password',
    TOKEN: 'token',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    AUTHORIZATION: 'authorization',
};

const sensitiveKeysList = Object.values(SensitiveKeys);

const redactLogData = (data) => {
    if (typeof data === 'object' && data !== null && !(data.constructor && data.constructor.name.startsWith('model'))
    ) {
        if (Array.isArray(data)) {
            return data.map(item => redactLogData(item));
        }

        const redactedData = {};

        for (const key in data) {

            if (sensitiveKeysList.includes(key.toLowerCase())) {
                redactedData[key] = '*****';
            } else {
                redactedData[key] = redactLogData(data[key]);
            }
        }

        return redactedData;
    }

    return data;
};

export default redactLogData;
