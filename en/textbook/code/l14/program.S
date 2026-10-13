# ARC12 Computer Architecture - Lecture 14: Elementary Machines: Registers and Buses
# l14.S: a byte sent one bit at a time, and rebuilt at the other end
#
# On the screen: top row: the eight bits of 0xA5 in the order in which they leave,
# most significant first (lit, dark, lit, dark, dark, lit, dark, lit). Bottom row: the
# byte rebuilt by the receiver. A green square says that it is equal to the byte sent.
# Build: python3 -m prg32 cartridge build l14.S --portable \
#            --entry-prefix l14 --name l14 --out l14.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ GREEN,  0x07e0
.equ RED,    0xf800
.equ BYTE,   0xA5            # the byte to send: 1010 0101

.section .text
.global l14_init
.global l14_update
.global l14_draw

l14_init:
    ret

l14_update:
    ret

# lamp: a0 = position 0 to 7, a1 = y, a2 = bit
lamp:
    li   a4, GREY
    beqz a2, 1f
    li   a4, YELLOW
1:  slli a0, a0, 5
    addi a0, a0, 36          # x = 36 + 32 * position
    li   a2, 24
    li   a3, 24
    tail prg32_gfx_rect

l14_draw:
    addi sp, sp, -32
    sw   ra, 28(sp)
    sw   s0, 24(sp)
    sw   s1, 20(sp)
    sw   s2, 16(sp)
    sw   s3, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear

    li   s0, BYTE            # a0 of the slide: the byte to send
    li   s1, 0               # the receiver's shift register
    li   s2, 0               # how many bits have gone
1:  srli t1, s0, 7           # bring bit 7 down to bit 0
    andi s3, t1, 1           # s3 = the bit to put on the wire
    mv   a0, s2              # ... here the wire is a lamp:
    li   a1, 40              #     position = the order of sending
    mv   a2, s3
    call lamp
    slli s1, s1, 1           # receiver: make room (serial to parallel)
    or   s1, s1, s3          #           insert the bit
    slli s0, s0, 1           # sender: shift left, the next bit moves up
    andi s0, s0, 255         #         (keep eight bits)
    addi s2, s2, 1
    li   t0, 8               # eight bits to go
    blt  s2, t0, 1b

    li   s2, 0               # show the byte that the receiver rebuilt
2:  li   t0, 7
    sub  t0, t0, s2
    srl  a2, s1, t0
    andi a2, a2, 1
    mv   a0, s2
    li   a1, 100
    call lamp
    addi s2, s2, 1
    li   t0, 8
    blt  s2, t0, 2b

    li   a4, RED             # is it the byte that was sent?
    li   t0, BYTE
    bne  s1, t0, 3f
    li   a4, GREEN
3:  li   a0, 152
    li   a1, 150
    li   a2, 16
    li   a3, 16
    call prg32_gfx_rect
    lw   s3, 12(sp)
    lw   s2, 16(sp)
    lw   s1, 20(sp)
    lw   s0, 24(sp)
    lw   ra, 28(sp)
    addi sp, sp, 32
    ret
