.option norelax
.equ BTN_LEFT, 1
.section .text
.global l05_init
.global l05_update
.global l05_draw
l05_init:
    ret
l05_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read      # a0 = button mask
    mv   t0, a0

    la   t1, marker_x
    lw   t2, 0(t1)             # t2 = marker_x, starts at 2
    andi t3, t0, BTN_LEFT      # is LEFT pressed?
    beqz t3, 1f
    addi t2, t2, -1            # one step to the left
1:  sw   t2, 0(t1)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
l05_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_console_clear
    la   t0, marker_x
    lw   a0, 0(t0)
    call prg32_console_hex32
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .data
marker_x: .word 2
