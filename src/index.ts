import * as core from "@actions/core";
import * as exec from '@actions/exec';
import * as tc from "@actions/tool-cache";
import promises from "fs";
import { promisify } from "util";

const chmod = promisify(promises.chmod);
const exists = promisify(promises.exists);

const packages = core.getInput("packages").split(/\s/);
const alpine_version = core.getInput("alpine_version");
const mount = core.getInput("mount");
const arch = core.getInput("arch");
const chroot_dir = core.getInput("chroot_dir");

const chroot_exec = async (user: string = "user", cmd: string[] = []): Promise<number> => {
	if (user !== "root") {
		cmd = ["-u", user, ...cmd];
	}
	return await exec.exec(`${chroot_dir}/enter-chroot`, cmd);
};

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
	await chroot_exec("root", ["adduser", "-D", "user"]);
};

try {
	install()
} catch (error) {
	core.setFailed(error)
}
