.option norelax
.equ TITLE, 0
.equ PLAY,  1
.equ OVER,  2
.section .text
.global l13a_init
.global l13a_update
.global l13a_draw
l13a_init:
    ret
l13a_update:
game_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read      # a0 = buttons: the INPUT
    la   t0, state
    lw   t1, 0(t0)             # t1 = the present STATE
    andi t2, a0, 0x10          # button A
    li   t3, TITLE
    bne  t1, t3, 1f
    beqz t2, done              # TITLE: stay until A is pressed
    li   t1, PLAY              # TITLE --A--> PLAY
    j    store
1:  li   t3, OVER
    bne  t1, t3, done          # PLAY is handled elsewhere
    beqz t2, done              # OVER: stay until A is pressed
    li   t1, TITLE             # OVER --A--> TITLE
store:
    sw   t1, 0(t0)             # the next state becomes the present state
done:
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
l13a_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, state
    lw   t1, 0(t0)
    la   t0, colours
    slli t1, t1, 2
    add  t0, t0, t1
    lw   a0, 0(t0)
    call prg32_gfx_clear
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .rodata
colours: .word 0x001f, 0x07e0, 0xf800     # TITLE blue, PLAY green, OVER red
.section .data
state: .word TITLE
