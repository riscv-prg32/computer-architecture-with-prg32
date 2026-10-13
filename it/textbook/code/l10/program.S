# ARC12 Computer Architecture - Lecture 10: Introduction to Electronics and Digital Electronics
# l10.S: one button, one bit: from the finger to a register
#
# On the screen: a large square, grey while LEFT is released and yellow while it is
# pressed. On the kit LEFT is a switch between GPIO18 and ground.
# Build: python3 -m prg32 cartridge build l10.S --portable \
#            --entry-prefix l10 --name l10 --out l10.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0

.section .text
.global l10_init
.global l10_update
.global l10_draw

l10_init:
    ret

l10_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read    # a0 = one bit per button
    andi t3, a0, 0x01        # bit 0: LEFT
    la   t0, pressed
    sw   t3, 0(t0)           # 0: not pressed, 1: pressed
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
# on the kit:
#   LEFT is a switch between pin GPIO18 and ground
#   pressed  -> the pin is at 0 volts
#   released -> the pin is at 3.3 volts
# the runtime inverts the level: in the program, pressed is 1

l10_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    la   t0, pressed
    lw   t1, 0(t0)
    li   a4, GREY
    beqz t1, 1f
    li   a4, YELLOW
1:  li   a0, 120
    li   a1, 60
    li   a2, 80
    li   a3, 80
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
pressed: .word 0
