import { createLogger, transports, format } from "winston";
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const { combine, json, timestamp, printf, colorize, simple } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');
const logLevels = ['fatal', 'error', 'warn', 'info', 'http'];
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    }
};


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

    ...logLevels.map((level) => createTransport(level)),
    new transports.Console({

        format: combine(
            colorize(),
            simple()
        ),
    })
];

const timestampFormat = 'YYYY-MM-DD HH:mm:ss';
const logger = createLogger({

    levels: customLevels.levels,
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
    level: process.env.NODE_ENV === 'development' ? 'error' : 'http',
    transports: transportList,
});

export default logger;
