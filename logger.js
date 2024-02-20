import winston, {format} from 'winston'
import chalk from 'chalk'

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => { // skipcq: JS-0123 - Intentional
    let msg = `${timestamp} [${label}] ${level}: ${message}`;

    switch (level) {
        case 'error':
            return chalk.red.bold(msg)
        case 'warn':
            return chalk.yellow(msg)
        case 'info':
            return chalk.blue(msg)
        case 'http':
            return chalk.blue.italic(msg)
        case 'verbose':
            return chalk.green(msg)
        case 'debug':
            return chalk.green.bold(msg)
        case 'silly':
            return chalk.bgRed.bold.white(msg)
    }
});
const levels = {levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    }}

export const gatewayLogger = winston.createLogger({
    format: combine(
        label({ label: 'Gateway' }),
        timestamp(),
        myFormat
    ),

    level: "silly",
    levels: levels.levels,
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        }),
        new winston.transports.File({ filename: 'gateway.log' })
    ]
});

export const mongoLogger = winston.createLogger({
    format: combine(
        label({ label: 'MongoDB Client' }),
        timestamp(),
        myFormat
    ),

    level: "silly",
    levels: levels.levels,
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        }),
        new winston.transports.File({ filename: 'mongo.log' })
    ]
});

export const reqLogger = winston.createLogger({
    format: combine(
        label({ label: 'Requests' }),
        timestamp(),
        myFormat
    ),

    level: "silly",
    levels: levels.levels,
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        }),
        new winston.transports.File({ filename: 'req.log' })
    ]
});

export const cmdLogger = winston.createLogger({
    format: combine(
        label({ label: 'Command Creation' }),
        timestamp(),
        myFormat
    ),

    level: "silly",
    levels: levels.levels,
    transports: [
        new (winston.transports.Console)({
            colorize: 'all'
        }),
        new winston.transports.File({ filename: 'cmd.log' })
    ]
});