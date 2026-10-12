# in the PRG32 folder, ESP-IDF active
python3 -m prg32 cartridge build examples/games/pong/c/game.c \
    --portable --entry-prefix pong_c --name pong --out pong.prg32

[OK] built pong.prg32 name=pong load=0x40800000
[INFO] code=3004 mem=3028 audio=0

# what did we build?
python3 -m prg32 cartridge summary pong.prg32
