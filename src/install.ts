import * as tc from "@actions/tool-cache";
import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { exists, chmod, chroot_exec, chroot_dir, user } from ".";

const packages = core.getInput("packages").split(/\s/);
const alpine_version = core.getInput("alpine_version");
const mount = core.getInput("mount");
const arch = core.getInput("arch");

const install = async () => {
	if (await exists(chroot_dir)) {
		console.log("chroot_dir already exists; not doing anything!")
		return
	}
	const installer = await tc.downloadTool(`https://raw.githubusercontent.com/alpinelinux/alpine-chroot-install/v${alpine_version}/alpine-chroot-install`);
	await chmod(installer, 0o755);
	await exec.exec("mkdir", ["-p", mount]);
	await exec.exec("sudo", [
		installer,
		"-a", arch,
		"-d", chroot_dir,
		"-i", mount,
	]);
	await chroot_exec("root", ["apk", "add", ...packages]);
	await chroot_exec("root", ["adduser", "-D", user]);
};

try {
	install()
} catch (error) {
	core.setFailed(error)
}
