
with open("config.js", 'r') as f:
    config_lines = f.readlines()
for i,x in enumerate(config_lines):
    if "config.version" in x:
        # Format config.version = "x.y.z"
        lhs,rhs = x.split("=")
        lhs = lhs.strip()
        rhs = rhs.strip()
        major,minor,patch = rhs.split(".")
        # Increase patch number
        patch = str(int(patch[:-1]) + 1)
        # Add the missing quote at the end as well as newline
        version = ".".join([major,minor,patch]) +"\"\n"
        new_line = " = ".join([lhs,version])
        # Change the line
        config_lines[i] = new_line

with open("config.js", 'w') as f:
    f.writelines(config_lines)

