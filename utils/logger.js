const { createLogger, format, transports } = require("winston");
const { v4: uuidv4 } = require('uuid');

// Define a custom format to include the traceid
const customFormat = format.printf(({ level, message, timestamp, traceid }) => {
    return `${timestamp} | ${traceid} | [${level.toUpperCase()}] | ${message}`;
});

// Function to generate a traceid
const generateTraceId = () => {
    return uuidv4();
};

const logger = createLogger({
    transports: [
        new transports.Console()
    ],
    format: format.combine(
        format.timestamp(),
        format.metadata({ fillExcept: ['timestamp', 'level', 'message', 'label', 'traceid'] }), 
        format.prettyPrint(),
        format.splat(), 
        format(function dynamicMeta(info, opts) {
            if (!info.traceid) {
                info.traceid = generateTraceId();
            }
            return info;
        })(),
        customFormat
    )
});

module.exports = logger;
