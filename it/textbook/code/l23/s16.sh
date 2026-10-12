# metadata.json = manifest.json WITHOUT the "assets" and "architectures" entries

python3 -m prg32 store attach-metadata ~/verm1/verm1-esp32c6.prg32 \
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \
    --colophon ~/verm1/colophon.json --architecture esp32c6 \
    --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 store attach-metadata ~/verm1/verm1-qemu.prg32 \
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \
    --colophon ~/verm1/colophon.json --architecture qemu \
    --out ~/verm1/verm1-qemu.prg32
