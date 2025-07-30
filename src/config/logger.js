import { createLogger, transports, format } from "winston";
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import 'winston-mongodb';

const { combine, timestamp, printf } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');
const logLevels = ['fatal', 'error', 'warn', 'info', 'http', 'debug', 'silly']

logLevels.forEach((level) => {
    const levelDir = path.join(logDir, level);
    if (!fs.existsSync(levelDir)) {
        fs.mkdirSync(levelDir, { recursive: true });
    }
});

const createTransport = (level) => {

    return new transports.DailyRotateFile({

        level,
        filename: path.join(logDir, level, `${level}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        maxSize: '20m',
        format: format((info) => info.level === level ? info : false)()
    });
};

const transportList = [

    // Use this to store the logs in mongodb
    // new transports.MongoDB({
    //     db: process.env.DB_URL,
    //     collection: 'logs',
    //     tryReconnect: true,

    //     capped: true,
    // }),
];

if (process.env.NODE_ENV === 'development') {
    transportList.push(new transports.Console());
} else {
    transportList.push(...logLevels.map(level => createTransport(level)));
}


const timestampFormat = 'YYYY-MM-DD HH:mm:ss';
const logger = createLogger({

    format: combine(

        timestamp({ format: timestampFormat }),

        printf(({ timestamp, level, message, ...data }) => {

            const response = {
                level,
                timestamp,
                message,
                data,
                appInfo: {
                    processId: process.pid,
                    environment: process.env.NODE_ENV
                }
            };

            return JSON.stringify(response, null, 4)
        })
    ),

    level: process.env.NODE_ENV === 'development' ? 'debug' : 'http',

    transports: transportList,
});

export default logger;
