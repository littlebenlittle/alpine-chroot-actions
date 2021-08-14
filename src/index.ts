import * as core from "@actions/core";
import * as exec from '@actions/exec';
import promises from "fs";
import { promisify } from "util";

export const chmod = promisify(promises.chmod);
export const exists = promisify(promises.exists);
export const chroot_dir = core.getInput("chroot_dir");
export const user = core.getInput("user");

export const chroot_exec = async (user: string = "user", cmd: string[] = []): Promise<number> => {
	if (user !== "root") {
		cmd = ["-u", user, ...cmd];
	}
	return await exec.exec(`${chroot_dir}/enter-chroot`, cmd);
};
