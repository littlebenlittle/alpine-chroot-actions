.PHONY: install exec

build:
	@npx tsc

package:
	@rsync dist/index.js actions/install/dist/
	@rsync dist/index.js actions/exec/dist/
	@rsync dist/install.js actions/install/dist/
	@rsync dist/exec.js actions/exec/dist/
