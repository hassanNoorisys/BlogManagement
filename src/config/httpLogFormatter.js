import redactLogData from "./redectLogData.js";

const formatHTTPLog = (req, res, body = {}) => {

    return {

        request: {
            headers: redactLogData(req.headers),
            host: req.headers.host,
            baseUrl: req.baseUrl,
            url: req.url,
            method: req.method,
            body: req.body,
            params: req?.params,
            query: req?.query,
            clientIp: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress,
        },

        response: {
            headers: res.getHeaders(),
            statusCode: res.statusCode,
            body: body
        }
    };
}

export default formatHTTPLog