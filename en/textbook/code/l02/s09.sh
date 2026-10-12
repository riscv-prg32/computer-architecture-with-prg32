# 1. build a portable cartridge from one assembly file
python3 -m prg32 cartridge build step1_skeleton.S --portable \
    --entry-prefix first --name step1 --out build/step1.prg32

# 2a. run it in QEMU on your laptop
python3 -m prg32 qemu upload build/step1.prg32
python3 -m prg32 qemu run

# 2b. or send it to a board, or to PRG32-QT, over the network
python3 -m prg32 esp32c6 upload-and-run build/step1.prg32 \
    --url http://192.168.4.1 --slot cart0
