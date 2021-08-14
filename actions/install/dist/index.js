"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const chmod = util_1.promisify(fs_1.default.chmod);
const exists = util_1.promisify(fs_1.default.exists);
const chroot_dir = core.getInput("chroot_dir");
const user = core.getInput("user");
const packages = core.getInput("packages");
const alpine_version = core.getInput("alpine_version");
const arch = core.getInput("arch");
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield exists(chroot_dir)) {
            console.log("chroot_dir already exists; not doing anything!");
            return;
        }
        const installer = yield tc.downloadTool(`https://raw.githubusercontent.com/alpinelinux/alpine-chroot-install/v${alpine_version}/alpine-chroot-install`);
        yield chmod(installer, 0o755);
        let mount = core.getInput("mount");
        if (!mount) {
            mount = (yield exec.getExecOutput("pwd")).stdout;
        }
        yield exec.exec(`mkdir -p ${mount}`);
        yield exec.exec(`sudo ${installer} -a ${arch} -d ${chroot_dir} -i ${mount}`);
        yield exec.exec(`${chroot_dir}/enter-chroot apk add ${packages}`);
        yield exec.exec(`${chroot_dir}/enter-chroot adduser -D ${user}`);
    }
    catch (error) {
        core.setFailed(error);
    }
});
install();
