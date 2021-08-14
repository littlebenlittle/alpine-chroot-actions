import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as cache from "@actions/cache";
import * as exec from '@actions/exec';
import promises from "fs";
import { promisify } from "util";

const chmod = promisify(promises.chmod);

const packages = core.getInput("packages");
const version = core.getInput("version");
const mount = core.getInput("mount");
const arch = core.getInput("arch");
const chroot_dir = core.getInput("chroot_dir");

const install = async () => {
	const installer = await tc.downloadTool(`https://raw.githubusercontent.com/alpinelinux/alpine-chroot-install/v${version}/alpine-chroot-install`);
	await chmod(installer, 0o755);
	exec.exec("mkdir", ["-p", mount]);
	exec.exec("sudo", [
		installer,
		"-a", arch,
		"-d", chroot_dir,
		"-i", mount,
	]);
	exec.exec(`${chroot_dir}/enter-chroot`, ["apk", "add", ...packages]);
	exec.exec(`${chroot_dir}/enter-chroot`, ["adduser", "-D", "user"]);
};

const run = async () => {
	const chroot = await cache.restoreCache([`${chroot_dir}`], `alpine-chroot: ${packages}`);
	if (!chroot) {
		await install()
	}
};

try {
	run();
} catch (error) {
	core.setFailed(error.message);
}
