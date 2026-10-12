.section .rodata            # part of the cartridge file
title: .asciz "HIGH SCORE"  # stored in flash: it survives

.section .data              # copied into RAM at start
best:  .word 0              # lives in RAM: it is lost

game_update:
    ...
    la   t0, best
    lw   t1, 0(t0)
    ble  a0, t1, 1f         # new score not better: skip
    sw   a0, 0(t0)          # remember the best score ... in RAM
1:  ...
