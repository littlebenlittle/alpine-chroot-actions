import * as tc from "@actions/tool-cache";
import * as exec from '@actions/exec';
import * as core from '@actions/core';

import promises from "fs";
import { promisify } from "util";

const chmod = promisify(promises.chmod);
const exists = promisify(promises.exists);
const chroot_dir = core.getInput("chroot_dir");
const user = core.getInput("user");

const chroot_exec = async (user: string = "user", cmd: string[] = []): Promise<number> => {
	if (user !== "root") {
		cmd = ["-u", user, ...cmd];
	}
	return await exec.exec(`${chroot_dir}/enter-chroot`, cmd);
};

const packages = core.getInput("packages");
const alpine_version = core.getInput("alpine_version");
const arch = core.getInput("arch");

const install = async () => {
	try {
		if (await exists(chroot_dir)) {
			console.log("chroot_dir already exists; not doing anything!")
			return
		}
		const installer = await tc.downloadTool(`https://raw.githubusercontent.com/alpinelinux/alpine-chroot-install/v${alpine_version}/alpine-chroot-install`);
		await chmod(installer, 0o755);
		let mount = core.getInput("mount");
		if (!mount) {
			mount = (await exec.getExecOutput("pwd")).stdout;
		}
		await exec.exec(`mkdir -p ${mount}`);
		await exec.exec(`${installer} -a ${arch} -d ${chroot_dir} -i ${mount}`);
		await exec.exec(`${chroot_dir}/enter-chroot apk add ${packages}`);
		await exec.exec(`${chroot_dir}/enter-chroot adduser -D ${user}`);
	} catch (error) {
		core.setFailed(error)
	}
};

install()
