#!/bin/bash

# variables
TARGET_DIR="ext/WebDriverAgent"
REPO_URL="https://github.com/AutoCodeStack/WebDriverAgent.git"

# Check if the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Directory $TARGET_DIR does not exist. Creating it..."
  mkdir -p "$TARGET_DIR"
else
  echo "Directory $TARGET_DIR already exists."
fi

# Clone the repository into the target directory
echo "Cloning the repository $REPO_URL into $TARGET_DIR..."
git clone "$REPO_URL" "$TARGET_DIR"

echo "Done!"