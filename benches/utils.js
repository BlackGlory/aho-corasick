"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHumanReadableRSS = exports.measure = exports.mark = void 0;
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const prelude_1 = require("@blackglory/prelude");
const iterable_operator_1 = require("iterable-operator");
const iterable_operator_2 = require("iterable-operator/lib/es2018/style/chaining/iterable-operator");
const labelToRecords = new Map();
function mark(label) {
    if (!labelToRecords.has(label)) {
        const set = new Set();
        labelToRecords.set(label, set);
    }
    const set = labelToRecords.get(label);
    set.add({ timestamp: process.hrtime.bigint() });
}
exports.mark = mark;
function measure(message, startLabel, endLabel) {
    const startRecord = labelToRecords.get(startLabel);
    const endRecord = labelToRecords.get(endLabel);
    (0, prelude_1.assert)((0, prelude_1.isntUndefined)(startRecord), 'startRecord should not be undefined');
    (0, prelude_1.assert)((0, prelude_1.isntUndefined)(endRecord), 'startRecord should not be undefined');
    const elapsedTime = new iterable_operator_2.IterableOperator((0, iterable_operator_1.zip)(startRecord, endRecord))
        .map(([startRecord, endRecord]) => endRecord.timestamp - startRecord.timestamp)
        .reduce((average, current) => (average + current) / 2n);
    console.log(`${message}: ${elapsedTime / 1000n / 1000n}ms`);
}
exports.measure = measure;
function getHumanReadableRSS() {
    global.gc();
    return (0, pretty_bytes_1.default)(process.memoryUsage().rss);
}
exports.getHumanReadableRSS = getHumanReadableRSS;
