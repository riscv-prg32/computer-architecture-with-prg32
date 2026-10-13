# ARC12 Computer Architecture - Lecture 08: Elements of Boolean Algebra
# l08.S: one lamp per button, a marker that moves, and De Morgan at the joystick
#
# On the screen: seven lamps, one per button (LEFT on the left), lit while the button
# is held; a white marker that LEFT and RIGHT move; a square that is green when
# neither LEFT nor RIGHT is pressed and red otherwise.
# Build: python3 -m prg32 cartridge build l08.S --portable \
#            --entry-prefix l08 --name l08 --out l08.prg32
.option norelax

.equ BLACK,  0x0000
.equ WHITE,  0xffff
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ GREEN,  0x07e0
.equ RED,    0xf800

.section .text
.global l08_init
.global l08_update
.global l08_draw

l08_init:
    ret

l08_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read    # a0 = all the buttons, one bit each
    mv   t0, a0              # keep our own copy
    la   t1, buttons
    sw   t0, 0(t1)           # remember them for draw

    la   t1, marker_x
    lw   t2, 0(t1)
    andi t3, t0, 0x01        # keep only bit 0: LEFT
    beqz t3, 1f              # zero: LEFT is not pressed
    addi t2, t2, -2          # move left
1:
    andi t3, t0, 0x02        # keep only bit 1: RIGHT
    beqz t3, 2f
    addi t2, t2, 2           # move right
2:
    sw   t2, 0(t1)

# "idle" when NEITHER LEFT NOR RIGHT is pressed
    li   t4, 1               # idle = 1
    andi t3, t0, 0x03        # 0x03 = LEFT | RIGHT: keep both bits
    beqz t3, 3f              # all zero: (LEFT + RIGHT)' is true
    li   t4, 0               # idle = 0
3:  la   t1, idle
    sw   t4, 0(t1)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

l08_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   s0, 0               # s0 = bit number, 0 to 6
1:  la   t0, buttons
    lw   t1, 0(t0)           # t1 = the button mask
    srl  t1, t1, s0          # bring bit number s0 down to bit 0
    andi t1, t1, 1           # keep it, clear all the others
    li   a4, GREY            # lamp off
    beqz t1, 2f
    li   a4, YELLOW          # lamp on
2:  slli a0, s0, 5
    addi a0, a0, 48          # x = 48 + 32 * bit
    li   a1, 40
    li   a2, 24
    li   a3, 24
    call prg32_gfx_rect
    addi s0, s0, 1
    li   t0, 7
    blt  s0, t0, 1b

    la   t0, marker_x        # the marker
    lw   a0, 0(t0)
    li   a1, 100
    li   a2, 16
    li   a3, 16
    li   a4, WHITE
    call prg32_gfx_rect

    la   t0, idle            # the result of De Morgan's test
    lw   t1, 0(t0)
    li   a4, RED
    beqz t1, 3f
    li   a4, GREEN
3:  li   a0, 152
    li   a1, 150
    li   a2, 16
    li   a3, 16
    call prg32_gfx_rect
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
buttons:  .word 0
marker_x: .word 152
idle:     .word 1
