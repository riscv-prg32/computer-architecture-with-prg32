.option norelax
.section .text
.global l11_init
.global l11_update
.global l11_draw
l11_init:
    ret
l11_update:
    ret
l11_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, 0
    call prg32_gfx_clear
    li   s0, 0
bars:
    mv   a0, s0              # a0 = selector, 0 to 3
    la   t0, palette         # four words: the data inputs
    slli t1, a0, 2           # selector * 4 bytes
    add  t0, t0, t1          # address of the selected word
    lw   a4, 0(t0)           # the selected input reaches the output
    li   a0, 20
    slli a1, s0, 5
    addi a1, a1, 20          # y = 20 + 32 * selector
    li   a2, 200
    li   a3, 16
    call prg32_gfx_rect
    addi s0, s0, 1
    li   t0, 4
    blt  s0, t0, bars
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .rodata
# red, green, blue, yellow
palette: .word 0xf800, 0x07e0, 0x001f, 0xffe0
