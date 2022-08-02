#!/usr/bin/env bash

declare id=""
declare root=""

id="co.socketsupply.io.tests"
root="$(dirname "$(dirname "${BASH_SOURCE[0]}")")"

"$root/scripts/bootstrap-android-emulator.sh" &

echo "info: Waiting for Android Emulator to boot"
while ! adb shell getprop sys.boot_completed >/dev/null 2>&1 ; do
  sleep 0.5s
done
echo "info: Android Emulator booted"

adb uninstall "$id"

ssc compile --headless --quiet --platform=android -r -o .

"$root/scripts/poll-adb-logcat.sh"

echo "info: Shutting Android Emulator"
adb devices | grep emulator | cut -f1 | while read -r line; do
  adb -s "$line" emu kill
done