import * as core from '@actions/core';
import * as exec from '@actions/exec';

const chroot_dir = core.getInput("chroot_dir");
const user = core.getInput("user");
const raw_cmd = core.getInput("cmd");

const chroot_exec = async (user: string = "user", cmd: string[] = []): Promise<number> => {
	if (user !== "root") {
		cmd = ["-u", user, ...cmd];
	}
	return await exec.exec(`${chroot_dir}/enter-chroot`, cmd);
};

const run_cmd = async () => {
	const lines = raw_cmd.split(/\n/);
	lines.forEach( line => {
		const cmd = line.split(/\s/);
		chroot_exec(user, cmd);
	});
};

try {
	run_cmd()
} catch (error) {
	core.setFailed(error)
}
