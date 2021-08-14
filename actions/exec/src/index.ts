import * as core from '@actions/core';
import * as exec from '@actions/exec';

const chroot_dir = core.getInput("chroot_dir");
const user = core.getInput("user");
const raw_cmd = core.getInput("cmd");

const run_cmd = async () => {
	try {
		const lines = raw_cmd.split(/\n/);
		await Promise.all(lines.map(line => {
			return exec.exec(`${chroot_dir}/enter-chroot -u ${user} ${line}`)
		}));
	} catch (error) {
		core.setFailed(error);
	}
};

run_cmd()
