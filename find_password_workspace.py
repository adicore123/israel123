import subprocess
import hashlib
import re

target = '2dae8ae7c497683869fd69dce52fa6f4fa58f405cbfd5b4599c9676902eba6d2'

# Let's run a git log search to see where '2dae8ae7c497683869fd69dce52fa6f4fa58f405cbfd5b4599c9676902eba6d2' was first introduced.
try:
    print("Running git log search...")
    out = subprocess.check_output(['git', 'log', '-S', '2dae8ae7c497683869fd69dce52fa6f4fa58f405cbfd5b4599c9676902eba6d2', '-p'], stderr=subprocess.STDOUT)
    out_str = out.decode('utf-8', errors='ignore')
    print("GIT LOG OUTPUT:")
    print(out_str[:2000])
except Exception as e:
    print(f"Error running git log: {e}")

# Let's also look at git log for any other commits adding a password
try:
    print("\nRunning git log for 'password' or ' LoginForm'...")
    out = subprocess.check_output(['git', 'log', '-p', '-G', 'password|LoginForm'], stderr=subprocess.STDOUT)
    out_str = out.decode('utf-8', errors='ignore')
    print("GIT LOG PASSWORD SEARCH:")
    print(out_str[:4000])
except Exception as e:
    print(f"Error running git log search: {e}")
