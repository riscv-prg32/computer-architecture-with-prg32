# 1. build the cartridge (from your PRG32 folder, toolchain active)
python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \
    --entry-prefix verm1 --name verm1 --out ~/verm1/verm1.prg32

# 2. send it to PRG32-QT, running on the same computer
python3 -m prg32 esp32c6 upload-and-run ~/verm1/verm1.prg32 \
    --url http://localhost:8080 --slot cart0

# or: in PRG32-QT, import the file verm1.prg32 and choose Run Cartridge
