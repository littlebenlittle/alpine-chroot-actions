import * as core from '@actions/core';
import * as exec from '@actions/exec';

const chroot_dir = core.getInput("chroot_dir");
const user = core.getInput("user");
const cmd = core.getInput("cmd");

const run_cmd = async () => {
	try {
		if (user !== "root") {
			return await exec.exec(`${chroot_dir}/enter-chroot -u ${user} ${cmd}`);
		}
		return await exec.exec(`${chroot_dir}/enter-chroot ${cmd}`);
	} catch (error) {
		core.setFailed(error);
	}
};

run_cmd()
