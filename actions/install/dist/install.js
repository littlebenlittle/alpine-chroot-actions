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
Object.defineProperty(exports, "__esModule", { value: true });
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const core = __importStar(require("@actions/core"));
const _1 = require(".");
const packages = core.getInput("packages").split(/\s/);
const alpine_version = core.getInput("alpine_version");
const mount = core.getInput("mount");
const arch = core.getInput("arch");
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield _1.exists(_1.chroot_dir)) {
        console.log("chroot_dir already exists; not doing anything!");
        return;
    }
    const installer = yield tc.downloadTool(`https://raw.githubusercontent.com/alpinelinux/alpine-chroot-install/v${alpine_version}/alpine-chroot-install`);
    yield _1.chmod(installer, 0o755);
    yield exec.exec("mkdir", ["-p", mount]);
    yield exec.exec("sudo", [
        installer,
        "-a", arch,
        "-d", _1.chroot_dir,
        "-i", mount,
    ]);
    yield _1.chroot_exec("root", ["apk", "add", ...packages]);
    yield _1.chroot_exec("root", ["adduser", "-D", _1.user]);
});
try {
    install();
}
catch (error) {
    core.setFailed(error);
}
