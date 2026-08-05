#!/bin/bash
podman run -it --rm --entrypoint bash -v ./:/mnt:z node:24-slim
