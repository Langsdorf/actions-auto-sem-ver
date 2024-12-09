"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateVersion;
const utils_1 = require("../utils");
function generateVersion(commit, currentVersion, shouldReturnCommitError, versionLabelFallback) {
    const parsedNumbers = currentVersion.split(".").map(Number);
    if (parsedNumbers.some((num) => !(0, utils_1.isInteger)(num))) {
        return [undefined, new Error(`Invalid version format ${currentVersion}`)];
    }
    let [major, minor, patch] = parsedNumbers;
    const match = [utils_1.PATCH_REGEX, utils_1.MINOR_REGEX, utils_1.MAJOR_REGEX].find((regex) => regex.test(commit));
    if (!match) {
        if (shouldReturnCommitError) {
            return [undefined, new Error("Invalid commit message")];
        }
        if (!versionLabelFallback) {
            return [currentVersion];
        }
        if (versionLabelFallback === "major")
            major++;
        if (versionLabelFallback === "minor")
            minor++;
        if (versionLabelFallback === "patch")
            patch++;
        return [`${major}.${minor}.${patch}`];
    }
    if (match === utils_1.MAJOR_REGEX)
        major++;
    if (match === utils_1.MINOR_REGEX)
        minor++;
    if (match === utils_1.PATCH_REGEX)
        patch++;
    return [`${major}.${minor}.${patch}`];
}
