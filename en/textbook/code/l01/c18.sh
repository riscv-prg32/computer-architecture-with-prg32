# libraries for the window of the emulator
brew install libgcrypt glib pixman sdl2 libslirp                      # macOS
sudo apt install -y libgcrypt20 libglib2.0-0 libpixman-1-0 \
    libsdl2-2.0-0 libslirp0                                           # Linux

# the emulator itself (Windows: tick it in the ESP-IDF installer)
python $IDF_PATH/tools/idf_tools.py install qemu-riscv32
. $IDF_PATH/export.sh

# build the firmware for QEMU, stage a cartridge, run
python3 -m prg32 qemu build
python3 -m prg32 qemu upload pong.prg32
python3 -m prg32 qemu run
