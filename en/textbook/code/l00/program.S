# ARC12 Computer Architecture - Lecture 00: Course Introduction
# l00.S: the first program of the course, to read before you can write it
#
# On the screen: the word ARC12 in white on a blue screen, and under it HELLO, RISC-V.
# Build: python3 -m prg32 cartridge build l00.S --portable \
#            --entry-prefix l00 --name l00 --out l00.prg32
.option norelax

.equ BLUE,  0x001f           # a colour is a 16-bit number (Lecture 04)
.equ WHITE, 0xffff

.section .text
.global l00_init
.global l00_update
.global l00_draw

l00_init:                    # called once, when the cartridge starts
    ret

l00_update:                  # called once per frame: nothing changes here
    ret

l00_draw:                    # called once per frame: paint the screen
    addi sp, sp, -16         # a function that calls others saves ra
    sw   ra, 12(sp)
    li   a0, BLUE
    call prg32_gfx_clear     # fill the screen with one colour
    li   a0, 140             # x, in pixels
    li   a1, 88              # y
    la   a2, line1           # the ADDRESS of the text
    li   a3, WHITE           # foreground
    li   a4, BLUE            # background
    call prg32_gfx_text8
    li   a0, 104
    li   a1, 104
    la   a2, line2
    li   a3, WHITE
    li   a4, BLUE
    call prg32_gfx_text8
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .rodata             # constants: two strings, each ending with a zero byte
line1: .asciz "ARC12"
line2: .asciz "HELLO, RISC-V"
