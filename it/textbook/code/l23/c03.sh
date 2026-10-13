cd ~/PRG32          # your PRG32 folder, toolchain active

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \
    --entry-prefix verm1 --name verm1 \
    --architecture esp32c6 --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \
    --entry-prefix verm1 --name verm1 \
    --architecture qemu --out ~/verm1/verm1-qemu.prg32
