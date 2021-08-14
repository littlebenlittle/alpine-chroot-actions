import * as core from '@actions/core';
import { chroot_exec, user } from ".";

const raw_cmd = core.getInput("cmd");

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
