# ARC12 Computer Architecture - Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop
# l01.S: a test pattern that proves the installation works
#
# On the screen: four vertical bars, red, green, blue and white, and the words PRG32
# OK.
# Build: python3 -m prg32 cartridge build l01.S --portable \
#            --entry-prefix l01 --name l01 --out l01.prg32
.option norelax

.equ BLACK, 0x0000
.equ WHITE, 0xffff

.section .text
.global l01_init
.global l01_update
.global l01_draw

l01_init:
    ret

l01_update:
    ret

l01_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   s0, 0               # bar number, 0 to 3
1:  la   t0, bars            # the table of the four colours
    slli t1, s0, 2           # 4 bytes per word
    add  t0, t0, t1
    lw   a4, 0(t0)           # a4 = colour of bar s0
    slli a0, s0, 6           # 64 * bar
    addi a0, a0, 40          # x = 40 + 64 * bar
    li   a1, 40              # y
    li   a2, 48              # width
    li   a3, 100             # height
    call prg32_gfx_rect
    addi s0, s0, 1
    li   t0, 4
    blt  s0, t0, 1b
    li   a0, 124
    li   a1, 160
    la   a2, ok
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .rodata
bars: .word 0xf800, 0x07e0, 0x001f, 0xffff     # red, green, blue, white
ok:   .asciz "PRG32 OK"
