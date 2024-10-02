"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION_REGEX = exports.TAG_REGEX = exports.MAJOR_REGEX = exports.MINOR_REGEX = exports.PATCH_REGEX = void 0;
exports.isInteger = isInteger;
exports.exec = exec;
const node_child_process_1 = require("node:child_process");
function isInteger(value) {
    return (typeof value === "number" &&
        Number.isInteger(value) &&
        Number.isFinite(value) &&
        !Number.isNaN(value));
}
exports.PATCH_REGEX = /^(build|chore|ci|docs|fix|perf|refactor|revert|style|test)(\(.+\))?: .+$/;
exports.MINOR_REGEX = /^(feat|feature)(\(.+\))?: .+$/;
exports.MAJOR_REGEX = /^(BREAKING CHANGE|breaking)(\(.+\))?: .+$/;
exports.TAG_REGEX = /(v)?(\d+\.\d+\.\d+)/;
exports.VERSION_REGEX = /^(\d+\.\d+\.\d+)$/;
function exec(command) {
    return new Promise((resolve) => {
        (0, node_child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error)
                return resolve([undefined, new Error(stderr)]);
            resolve([stdout]);
        });
    });
}
