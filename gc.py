#!/usr/bin/python3
import sys
import subprocess

if len(sys.argv) > 1:
    commitMessage = sys.argv[1]
else:
    print("Please provide commit message!")
    sys.exit()

commitCommand = "git commit -m" + commitMessage
subprocess.run(commitCommand.split())
with open ("commitID.txt", "w") as file:
    file.write()
 