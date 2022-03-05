# Run the build and update the version
docker build . -t react && python ./update_patch_version.py