# ARC12 Computer Architecture - Lecture 18: The Processor
# l18.S: z = x + y on a load-store machine
#
# On the screen: three bars, eight pixels per unit: x = 5 (white), y = 7 (white) and z
# = 12 (green), computed by the seven instructions of the slide.
# Build: python3 -m prg32 cartridge build l18.S --portable \
#            --entry-prefix l18 --name l18 --out l18.prg32
.option norelax

.equ BLACK, 0x0000
.equ WHITE, 0xffff
.equ GREEN, 0x07e0

.section .text
.global l18_init
.global l18_update
.global l18_draw

l18_init:
    ret

l18_update:
    la   t0, x
    lw   t1, 0(t0)       # bring x into a register
    la   t0, y
    lw   t2, 0(t0)       # bring y into a register
    add  t3, t1, t2      # compute, between registers
    la   t0, z
    sw   t3, 0(t0)       # take the result back to memory
    ret

# bar: a0 = ADDRESS of a variable, a1 = y of the bar, a4 = colour
bar:
    lw   a2, 0(a0)       # the VALUE of the variable
    slli a2, a2, 3       # width: eight pixels per unit
    li   a0, 20
    li   a3, 16
    tail prg32_gfx_rect

l18_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    la   a0, x
    li   a1, 40
    li   a4, WHITE
    call bar
    la   a0, y
    li   a1, 72
    li   a4, WHITE
    call bar
    la   a0, z
    li   a1, 120
    li   a4, GREEN
    call bar
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
x: .word 5
y: .word 7
z: .word 0
