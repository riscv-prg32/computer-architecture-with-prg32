.option norelax
.section .text
.global l20_init
.global l20_update
.global l20_draw
l20_init:
    ret
l20_update:
    ret
l20_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0
    call prg32_gfx_clear
    li   a0, 100             # x
    li   a1, 50              # y
    li   a2, 0xf800          # red, in RGB565
    call prg32_gfx_pixel     # ... where does it go?
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
