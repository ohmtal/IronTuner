#!/bin/sh
# flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo
#  flatpak install --user flathub org.freedesktop.Platform//23.08
flatpak-builder --user --install --force-clean build-dir com.ohmtal.irontuner.yml
