.PHONY: all help build logs loc up stop down

# make all - Default Target. Does nothing.
all:
	@echo "Project helper commands."
	@echo "For more information try 'make help'."

# target: help - Display callable targets.
help:
	@egrep "^# target:" [Mm]akefile

help_win:
	Select-String "^# target:" Makefile

# target: env = generate env files
env:
	cp ./client/etc/env.dist ./client/.env
	cp ./controller/etc/env.dist ./controller/.env
	cp ./gophish/etc/env.dist ./gophish/.env

# target: build = build all containers
build:
	docker-compose -f ./client/docker-compose.yml build
	docker-compose -f ./gophish/docker-compose.yml build
	docker-compose -f ./controller/docker-compose.yml build
	docker-compose -f ./aws/docker-compose.yml build

# target: up - Run GoPhish.
up:
	docker-compose -f ./client/docker-compose.yml up -d
	docker-compose -f ./controller/docker-compose.yml up -d
	docker-compose -f ./gophish/docker-compose.yml up -d
	docker-compose -f ./aws/docker-compose.yml up -d

# target: local - Run all containers required for a local environment
local:
	docker-compose -f ./client/docker-compose.yml up -d
	docker-compose -f ./controller/docker-compose.yml up -d
	docker-compose -f ./gophish/docker-compose.yml up -d

# target: stop - Stop all docker containers
stop:
	docker-compose -f ./client/docker-compose.yml stop
	docker-compose -f ./gophish/docker-compose.yml stop
	docker-compose -f ./controller/docker-compose.yml stop
	docker-compose -f ./aws/docker-compose.yml stop

# target: down - Remove all docker containers
down:
	docker-compose -f ./client/docker-compose.yml down
	docker-compose -f ./gophish/docker-compose.yml down
	docker-compose -f ./controller/docker-compose.yml down
	docker-compose -f ./aws/docker-compose.yml down

# target: venv_win - creates a python venv and installs requirements for windows powershell
venv_win:
	python -m venv .venv
	.venv/Scripts/activate.ps1
	pip install -r controller/requirements.txt
	pip install -r controller/requirements_test.txt

# target: venv_lin - creates a python venv and installs requirements for linux
venv_lin:
	python -m venv .venv
	source .venv/bin/activate
	pip install -r controller/requirements.txt
	pip install -r controller/requirements_test.txt

controller_tests:
	coverage run --omit *.venv* -m pytest ./controller/src/ --disable-warnings
	coverage html

controller_cc:
	radon cc ./controller/src/ -e "*.venv*" -s -o SCORE
