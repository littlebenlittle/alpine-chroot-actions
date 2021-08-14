build:
	@npx tsc

package:
	@rsync dist/install.js actions/install/dist/index.js
	@rsync dist/exec.js    actions/exec/dist/index.js
