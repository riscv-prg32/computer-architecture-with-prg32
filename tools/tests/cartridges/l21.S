.option norelax
.section .text
.global l21_init
.global l21_update
.global l21_draw
l21_init:
    ret
l21_update:
steer_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)

    call prg32_input_read      # a0 = one bit per button
    mv   s0, a0                # keep it in a saved register

    andi t0, s0, 0x10          # button A
    beqz t0, 1f
    li   a0, 0                 # channel
    li   a1, 0                 # instrument
    li   a2, 69                # note: A4, 440 Hz
    li   a3, 255               # volume
    li   a4, 120               # milliseconds
    call prg32_audio_note
1:  andi t0, s0, 0x01          # LEFT: s0 survived the call
    beqz t0, 2f
    la   t1, marker_x
    lw   t2, 0(t1)
    addi t2, t2, -2
    sw   t2, 0(t1)
2:  lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
l21_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0
    call prg32_gfx_clear
    la   t0, marker_x
    lw   a0, 0(t0)
    li   a1, 100
    li   a2, 16
    li   a3, 16
    li   a4, 0xffe0
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .data
marker_x: .word 152
