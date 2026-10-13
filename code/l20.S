# ARC12 Computer Architecture - Lecture 20: Buses and the Video Card
# l20.S: one pixel, please
#
# On the screen: a single red pixel at x = 100, y = 50 on a black screen. Look
# closely.
# Build: python3 -m prg32 cartridge build l20.S --portable \
#            --entry-prefix l20 --name l20 --out l20.prg32
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
