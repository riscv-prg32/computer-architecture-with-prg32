# ARC12 Computer Architecture - Lecture 24: Beyond One Core
# l24.S: the loop that empties the map of Verm1, one byte at a time
#
# On the screen: a green square: the 960 bytes of the map, filled with ones by init,
# were all set to zero by the four-instruction loop of the lecture. A red square would
# mean that some byte survived.
# Build: python3 -m prg32 cartridge build l24.S --portable \
#            --entry-prefix l24 --name l24 --out l24.prg32
.option norelax

.equ BLACK, 0x0000
.equ GREEN, 0x07e0
.equ RED,   0xf800
.equ CELLS, 960              # 40 columns by 24 rows

.section .text
.global l24_init
.global l24_update
.global l24_draw

l24_init:                    # fill the map with ones, so that there is work to do
    la   t0, grid
    li   t1, CELLS
    li   t2, 1
1:  sb   t2, 0(t0)
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
    ret

l24_update:
    la   t0, grid            # the loop of the lecture
    li   t1, CELLS
1:  sb   zero, 0(t0)         # one byte ...
    addi t0, t0, 1           # ... the next address ...
    addi t1, t1, -1          # ... one fewer to go ...
    bnez t1, 1b              # ... 960 times: 3840 instructions

    la   t0, grid            # count the bytes that are not zero
    li   t1, CELLS
    li   t3, 0
2:  lbu  t2, 0(t0)
    add  t3, t3, t2
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 2b
    la   t0, left
    sw   t3, 0(t0)
    ret

l24_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    la   t0, left
    lw   t1, 0(t0)
    li   a4, GREEN
    beqz t1, 1f
    li   a4, RED
1:  li   a0, 136
    li   a1, 76
    li   a2, 48
    li   a3, 48
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
left: .word 1
grid: .space CELLS
