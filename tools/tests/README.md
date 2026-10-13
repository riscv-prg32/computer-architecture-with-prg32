# Checks for the assembly shown on the slides

Every listing of the code decks is covered by one of four levels of test, and every lecture has a program
(`../../code/lNN.S`, or a part of Verm1) that is built and run. Last run on 2026-10-13 (all passing) against PRG32 `a8669e5` (cartridge ABI, 139 entries), with
`riscv32-esp-elf-gcc` 15.2.0 and QEMU 11.1.1. One command runs them all and exits with 0 if every check passes:

```bash
export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
sh run_all.sh           # needs riscv32-esp-elf-gcc and upstream qemu-system-riscv32 on the PATH
sh run_all.sh quick     # without the scripted games of verm1_check.py, which take a few minutes
```

The levels, one by one:

1. **Encodings** - `encodings.S`, assembled with `riscv32-esp-elf-as -march=rv32imac` and
   disassembled with `objdump -d -M no-aliases`, gives the machine code quoted in lectures 02, 11 and 19.
2. **Logic** - `listings_qemu.S` holds the slide listings with 62 numbered checks (arithmetic, masks,
   adders, parity, the state machine, byte order, the trap handler with a real interrupt and a real ecall).

   ```bash
   riscv32-esp-elf-gcc -march=rv32im_zicsr -mabi=ilp32 -nostdlib -nostartfiles -T link.ld -o t.elf listings_qemu.S
   qemu-system-riscv32 -machine virt -bios none -kernel t.elf -nographic -display none; echo $?
   ```

   Exit code 0 means all checks passed; any other value is the number of the failing check.
   Use upstream QEMU: the Espressif fork aborts on the `virt` machine. The test does not stop by itself if a
   listing loops for ever: on Linux prefix the command with `timeout 60`; macOS has no `timeout`, use
   `perl -e 'alarm 60; exec @ARGV' qemu-system-riscv32 ...`.
3. **On PRG32** - the programs of the lectures, `../../code/lNN.S`: twenty complete cartridges built
   from the listings of the slides (see `../../code/README.md`). `cartridges/run.py` builds each with
   `python3 -m prg32 cartridge build --portable`, runs it in the PRG32-QT headless runner with scripted
   input and checks pixels in the final frame (exit code 0: every check passed). It writes the frames,
   as PNG, to `../assets/lab_lNN.png`: the code decks and the textbook show those pictures. It then
   builds every program for the architectures `esp32c6` and `qemu` and stages the QEMU cartridge into
   a copy of `$PRG32_HOME/build-qemu/qemu_flash.bin` (skipped, with a message, if the firmware for
   QEMU was never built), which validates the cartridge against the emulator's partition and contract.

   ```bash
   export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
   python3 cartridges/run.py        # needs riscv32-esp-elf-gcc on the PATH
   ```

   `cartridges/stuck.S` and `noirq.S` show what PRG32-QT does with an endless loop and with a write to `mstatus`.

   `vector_qemu.S` holds the RISC-V vector listings of lecture 24 (the loop that empties the map of Verm1,
   and a sum); it needs the vector extension, and the same binary must pass at every vector length:

   ```bash
   riscv32-esp-elf-gcc -march=rv32imv_zicsr -mabi=ilp32 -nostdlib -nostartfiles -T link.ld -o v.elf vector_qemu.S
   for n in 128 256 512 1024; do qemu-system-riscv32 -machine virt -cpu rv32,v=true,vlen=$n -bios none -kernel v.elf -nographic -display none; echo $?; done
   ```
4. **Verm1** - the course project (`../../verm1`, reference implementation contributed by Giuseppe Coviello), with the same environment variables as above:

   ```bash
   python3 verm1_check.py     # builds parts 1-4, plays them with a scripted player, writes the screenshots in ../assets
   python3 verm1_steps.py     # builds and runs the intermediate "Run it" checkpoints of lectures 12, 17 and 22
   python3 verm1_store.py     # builds for esp32c6 and qemu, attaches metadata, packs the bundle of lecture 23
   ```

   `verm1_check.py` takes a few minutes: every move of the scripted player replays the game from the start.
   `verm1_store.py` stops before `store publish-bundle`: nothing is uploaded.

## What each host is tested for

| Host | Covered |
| --- | --- |
| PRG32-QT | every program built, run on the headless runner, picture checked; the four parts of Verm1 played |
| QEMU (Espressif, PRG32 firmware) | every program built for `qemu` and accepted by the flash image. The firmware boots under the emulator, but what it draws is not checked: this QEMU has no screenshot command and needs its window |
| QEMU (upstream, bare metal) | the listings as numbered checks (level 2) and the vector listings (level 3) |
| the board | every program built for `esp32c6`; nothing is run: there is no board on the test machine |

The guides for QEMU and for the board in the code decks and in Appendix B of the textbook are written
from the documentation of PRG32 and from these builds; the PRG32-QT guide is the one the tests execute.

Not covered: the console output of lectures 05 and 15 (PRG32-QT sends it to its log, not to the frame: the
programs also draw the same number as lamps, which is checked), the interactive steps of the PRG32-QT
debugger described in the tutorials (written from its debugging guide), the upload to the Cartridge Store,
the CUDA and Verilog fragments of lecture 24 (no GPU and no Verilog tools here), and anything on a physical board.
