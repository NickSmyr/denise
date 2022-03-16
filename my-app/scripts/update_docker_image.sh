# Run the build and update the version
python scripts/update_patch_version.py && docker build . -t react 