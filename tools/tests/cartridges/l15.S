.option norelax
.section .text
.global l15_init
.global l15_update
.global l15_draw
l15_init:
    ret
l15_update:
    ret
l15_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    sw   s1, 4(sp)
    call prg32_console_clear
    la   t0, value
    lw   t1, 0(t0)       # the whole word
    lbu  t2, 0(t0)       # the byte at address A
    lbu  t3, 1(t0)       # the byte at address A+1
    lbu  t4, 3(t0)       # the byte at address A+3
    slli s0, t2, 16
    slli t3, t3, 8
    or   s0, s0, t3
    or   s0, s0, t4      # s0 = 0x00 78 56 12
    mv   a0, t1
    call prg32_console_hex32
    li   a0, 32
    call prg32_console_putc
    mv   a0, s0
    call prg32_console_hex32
    lw   s1, 4(sp)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .data
value: .word 0x12345678
