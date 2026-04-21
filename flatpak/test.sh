#!/bin/sh
# flatpak remotes --show-details
# flatpak remote-delete flathub
# flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo

flatpak-builder --force-clean --user --install-deps-from=flathub --repo=repo --install builddir /opt/IronTuner/flatpak/com.ohmtal.irontuner.yml

