#!/bin/sh
# Runs every check of this folder, in the order of the README.  Needs riscv32-esp-elf-gcc and an upstream
# qemu-system-riscv32 on the PATH, PRG32_HOME and PRG32QT_HEADLESS in the environment (see the README).
#   sh run_all.sh           # everything
#   sh run_all.sh quick     # without verm1_check.py, which takes a few minutes
cd "$(dirname "$0")" || exit 1
: "${PRG32_HOME:?set PRG32_HOME to the PRG32 folder}" "${PRG32QT_HEADLESS:?set PRG32QT_HEADLESS to the prg32qt-headless binary}"
TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT
BAD=""
step() { name=$1; shift; echo "== $name"; "$@" || BAD="$BAD $name"; }
qemu() { perl -e 'alarm 60; exec @ARGV' qemu-system-riscv32 -machine virt "$@" -bios none -nographic -display none; }

encodings() {
  riscv32-esp-elf-as -march=rv32imac -o "$TMP/enc.o" encodings.S || return 1
  # lw, addi, sw, jalr, add, addi, sub, sub, sw: the machine code quoted in lectures 02, 11 and 19
  got=$(riscv32-esp-elf-objdump -d -M no-aliases "$TMP/enc.o" | awk '/^ +[0-9a-f]+:/ { printf "%s ", $2 }')
  want="0002a303 00130313 0062a023 00008067 006283b3 00a28293 40628333 407302b3 00a12423 "
  [ "$got" = "$want" ] || { echo "encodings differ: $got"; return 1; }
}
listings() {
  riscv32-esp-elf-gcc -march=rv32im_zicsr -mabi=ilp32 -nostdlib -nostartfiles -T link.ld -o "$TMP/t.elf" listings_qemu.S 2>/dev/null || return 1
  qemu -kernel "$TMP/t.elf" || { echo "listings_qemu.S: check $? failed"; return 1; }
}
vectors() {
  riscv32-esp-elf-gcc -march=rv32imv_zicsr -mabi=ilp32 -nostdlib -nostartfiles -T link.ld -o "$TMP/v.elf" vector_qemu.S 2>/dev/null || return 1
  for n in 128 256 512 1024; do
    qemu -cpu rv32,v=true,vlen=$n -kernel "$TMP/v.elf" || { echo "vector_qemu.S: check $? failed at vlen=$n"; return 1; }
  done
}

step encodings encodings
step listings listings
step vectors vectors
step cartridges python3 cartridges/run.py
step verm1_steps python3 verm1_steps.py
step verm1_store python3 verm1_store.py "$TMP/store"
[ "$1" = quick ] || step verm1_check python3 verm1_check.py
if [ -n "$BAD" ]; then echo "FAILED:$BAD"; exit 1; fi
echo "all checks passed"
