
BIN := ./node_modules/.bin
MOCHA := $(BIN)/mocha

default: test

node_modules: package.json
	@npm install

clean:
	@rm -rf test/fixtures/*/build

distclean:
	@rm -rf node_modules

test: node_modules
	@$(MOCHA)

.PHONY: clean distclean test
