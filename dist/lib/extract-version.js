"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = extractVersion;
const core = __importStar(require("@actions/core"));
const utils_1 = require("../utils");
function extractVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = core.getInput("version", {
            trimWhitespace: true,
        });
        // biome-ignore lint/suspicious/noConfusingLabels: Break statement
        use_tag: if (!version) {
            const [, fetchError] = yield (0, utils_1.exec)("git fetch --tags");
            if (fetchError && !process.env.ACT)
                return [undefined, fetchError];
            const [ok] = yield (0, utils_1.exec)("git describe --tags `git rev-list --tags --max-count=1`");
            if (!ok)
                break use_tag;
            const tagPattern = core.getInput("tag-pattern") || utils_1.TAG_REGEX;
            const match = ok === null || ok === void 0 ? void 0 : ok.match(new RegExp(tagPattern));
            if (!match)
                break use_tag;
            const matchedVersion = match.find((v) => utils_1.VERSION_REGEX.test(v));
            if (!matchedVersion)
                return [undefined, new Error(`No version found in ${ok}`)];
            version = matchedVersion;
        }
        if (!version) {
            const initialVersion = core.getInput("initial-version", {
                trimWhitespace: true,
            });
            if (!initialVersion)
                return [undefined, new Error("No version found")];
            const matchedVersion = initialVersion.match(utils_1.VERSION_REGEX);
            if (!matchedVersion)
                return [undefined, new Error("No version found")];
            version = matchedVersion[0];
        }
        return [version];
    });
}
