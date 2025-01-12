# Define base path with a default
BASE_PATH = email

# Define derived paths
TYPES_DIR := toolbox/tools/local/$(BASE_PATH)/types
OUTPUT_DIR := toolbox/tools/local/$(BASE_PATH)/$(BASE_PATH)-server/models
TEMP_DIR := .temp_schemas

# Create necessary directories
$(shell mkdir -p $(OUTPUT_DIR) $(TEMP_DIR))

# Find all TypeScript files in draft directory
TS_FILES := $(wildcard $(TYPES_DIR)/*.ts)
# Generate corresponding JSON Schema paths
JSON_FILES := $(patsubst $(TYPES_DIR)/%.ts,$(TEMP_DIR)/%.json,$(TS_FILES))
# Generate corresponding Pydantic model paths
PY_FILES := $(patsubst $(TEMP_DIR)/%.json,$(OUTPUT_DIR)/%.py,$(JSON_FILES))

# Default target
all: $(PY_FILES)
	rm -rf $(TEMP_DIR)

# Install dependencies
install:
	pip install datamodel-code-generator

# Convert Zod schema to JSON Schema
$(TEMP_DIR)/%.json: $(TYPES_DIR)/%.ts
	node types/convert-zod-to-json.js $< $@

# Convert JSON Schema to Pydantic model
$(OUTPUT_DIR)/%.py: $(TEMP_DIR)/%.json
	datamodel-codegen --input $< --output $@ --output-model-type pydantic_v2.BaseModel --class-name $(basename $(notdir $@)) --input-file-type jsonschema

# Makefile
SHELL = /bin/bash

.PHONY: help
help:             ## Show the help.
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@fgrep "##" Makefile | fgrep -v fgrep


# Styling
.PHONY: style
style:
	black .
	flake8
	python3 -m isort .

.PHONY: clean clean-pyc clean-build clean-pytest
clean: clean-build clean-pyc clean-pytest ## remove all build, test, coverage, and Python artifacts

clean-build: ## remove build artifacts
	rm -fr build/
	rm -fr dist/
	rm -fr .eggs/
	find . -name '*.egg-info' -exec rm -fr {} +
	find . -name '*.egg' -exec rm -f {} +

clean-pyc: ## remove Python file artifacts
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	find . -name '__pycache__' -exec rm -fr {} +

clean-pytest: ## remove pytest artifacts
	rm -fr .pytest_cache
	rm -f .coverage

# dev
.PHONY: dev
dev:
	python3 -m venv .venv
	source .venv/bin/activate && pip install -e ".[dev]"

.PHONY: git-init
git-init:
	git init -b main
	pre-commit install

.PHONY: pre-commit
pre-commit:
	pre-commit run --all-files
