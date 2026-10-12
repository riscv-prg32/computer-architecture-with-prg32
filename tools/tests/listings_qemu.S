# Functional tests of the slide listings on QEMU virt (RV32, machine mode).
# Each CHECK compares a register with an expected value; a failure exits with the test number.
.equ TITLE, 0
.equ PLAY,  1
.equ OVER,  2
.equ MAX_X, 304
.equ BTN_LEFT, 1
.equ BTN_RIGHT, 2
.equ SPEED, 2
.equ SPEED_Q8, 96
.macro CHECK reg, val, n
    li   x31, \val
    li   x30, \n
    bne  \reg, x31, fail
.endm
.section .text
.global _start
_start:
    la   sp, stack_top
    la   t0, trap_entry
    csrw mtvec, t0

# ---- L04 array element
    la   t0, scores
    li   t1, 2
    slli t1, t1, 2
    add  t0, t0, t1
    lw   a0, 0(t0)
    CHECK a0, 34, 1

# ---- L05 shifts side box: x*4, /2, x*10
    li   t0, 7
    slli t0, t0, 2
    CHECK t0, 28, 2
    srli t0, t0, 1
    CHECK t0, 14, 3
    li   t0, 7
    slli t1, t0, 3
    slli t2, t0, 1
    add  t0, t1, t2
    CHECK t0, 70, 4
# ---- L05 negate
    li   t1, 6
    sub  t0, zero, t1
    CHECK t0, -6, 5
    not  t0, t1
    addi t0, t0, 1
    CHECK t0, -6, 6
    neg  t0, t1
    CHECK t0, -6, 7
# ---- L05 warm-up: 0 - 1
    li   t2, 0
    addi t2, t2, -1
    CHECK t2, 0xFFFFFFFF, 8
# ---- L05 unsigned overflow idiom
    li   t0, 0xFFFFFFFF
    li   t1, 1
    add  t2, t0, t1
    sltu t3, t2, t0
    CHECK t3, 1, 9
    li   t0, 5
    li   t1, 3
    add  t2, t0, t1
    sltu t3, t2, t0
    CHECK t3, 0, 10
# ---- L05 signed overflow idiom: four cases
    li   a5, 0x7FFFFFFF
    li   a6, 1
    jal  ra, sovf
    CHECK a0, 1, 11
    li   a5, -1
    li   a6, 1
    jal  ra, sovf
    CHECK a0, 0, 12
    li   a5, 0x80000000
    li   a6, -1
    jal  ra, sovf
    CHECK a0, 1, 13
    li   a5, 100
    li   a6, -28
    jal  ra, sovf
    CHECK a0, 0, 14
# ---- L05 clamp
    li   a5, -1
    li   a6, 0
    jal  ra, clamp
    CHECK t2, 0, 15
    li   a5, 400
    li   a6, 0
    jal  ra, clamp
    CHECK t2, 304, 16
    li   a5, 100
    li   a6, BTN_RIGHT
    jal  ra, clamp
    CHECK t2, 102, 17
    li   a5, 1
    li   a6, BTN_LEFT
    jal  ra, clamp
    CHECK t2, 0, 18
# ---- L05 quiz: slt / sltu
    li   t0, 0xFFFFFFFF
    li   t1, 1
    slt  t2, t0, t1
    sltu t3, t0, t1
    CHECK t2, 1, 19
    CHECK t3, 0, 20

# ---- L06 fixed point ball
    la   t0, ball_x_q8
    li   t1, 0x2A00
    sw   t1, 0(t0)
    jal  ra, ball_update
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    CHECK t1, 0x2A60, 21
    srai a0, t1, 8
    CHECK a0, 42, 22
    jal  ra, ball_update
    jal  ra, ball_update
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    CHECK t1, 0x2B20, 23
    srai a0, t1, 8
    CHECK a0, 43, 24

# ---- L08 De Morgan: both programs agree for the four inputs
    li   s1, 0
dm_loop:
    mv   t0, s1
    andi t3, t0, 0x03
    li   s2, 0
    bnez t3, 1f
    li   s2, 1              # idle, short way
1:  li   s3, 1              # long way
    andi t3, t0, 0x01
    bnez t3, 2f
    andi t3, t0, 0x02
    bnez t3, 2f
    j    3f
2:  li   s3, 0
3:  li   x30, 25
    bne  s2, s3, fail
    addi s1, s1, 1
    li   t4, 4
    blt  s1, t4, dm_loop
# ---- L08 masks: test, set, clear, toggle (bit 4)
    li   t0, 0x5A
    andi t1, t0, 0x0F
    CHECK t1, 0x0A, 26
    li   t0, 0x41
    ori  t0, t0, 0x10
    CHECK t0, 0x51, 27
    andi t0, t0, ~0x10
    CHECK t0, 0x41, 28
    xori t0, t0, 0x10
    CHECK t0, 0x51, 29
    li   t0, 0x41            # 'A'
    xori t0, t0, 0x20
    CHECK t0, 0x61, 30       # 'a'
# ---- L08 lamp: bit s0 of the mask
    li   t1, 0x12
    li   s0, 4
    srl  t1, t1, s0
    andi t1, t1, 1
    CHECK t1, 1, 31
    li   t1, 0x12
    li   s0, 2
    srl  t1, t1, s0
    andi t1, t1, 1
    CHECK t1, 0, 32

# ---- L09 half adder and full adder, all inputs
    li   s1, 0
fa_loop:
    andi a0, s1, 1
    srli a1, s1, 1
    andi a1, a1, 1
    srli a2, s1, 2
    andi a2, a2, 1
    xor  t0, a0, a1
    xor  a3, t0, a2
    and  t1, a0, a1
    and  t2, t0, a2
    or   a4, t1, t2
    slli t3, a4, 1
    or   t3, t3, a3         # Cout:S
    add  t4, a0, a1
    add  t4, t4, a2
    li   x30, 33
    bne  t3, t4, fail
    xor  t0, a0, a1         # half adder
    and  t1, a0, a1
    slli t1, t1, 1
    or   t1, t1, t0
    add  t4, a0, a1
    li   x30, 34
    bne  t1, t4, fail
    addi s1, s1, 1
    li   t5, 8
    blt  s1, t5, fa_loop

# ---- L11 palette lookup
    li   a0, 0
    jal  ra, pick
    CHECK a4, 0xf800, 35
    li   a0, 3
    jal  ra, pick
    CHECK a4, 0xffe0, 36
    li   a0, 2
    jal  ra, pick
    CHECK a4, 0x001f, 37
# ---- L11 parity, all 256 bytes against a bit-count loop
    li   s1, 0
par_loop:
    mv   a0, s1
    srli t0, a0, 4
    xor  a0, a0, t0
    srli t0, a0, 2
    xor  a0, a0, t0
    srli t0, a0, 1
    xor  a0, a0, t0
    andi a0, a0, 1
    mv   t1, s1
    li   t2, 0
4:  andi t3, t1, 1
    add  t2, t2, t3
    srli t1, t1, 1
    bnez t1, 4b
    andi t2, t2, 1
    li   x30, 38
    bne  a0, t2, fail
    addi s1, s1, 1
    li   t4, 256
    blt  s1, t4, par_loop
# ---- L11 exercise: seqz via xor + sltiu
    li   a0, 77
    li   a1, 77
    xor  a0, a0, a1
    sltiu a0, a0, 1
    CHECK a0, 1, 39

# ---- L13 state machine
    li   a5, TITLE
    li   a6, 0
    jal  ra, run_state
    CHECK a0, TITLE, 40
    li   a5, TITLE
    li   a6, 0x10
    jal  ra, run_state
    CHECK a0, PLAY, 41
    li   a5, PLAY
    li   a6, 0x10
    jal  ra, run_state
    CHECK a0, PLAY, 42
    li   a5, OVER
    li   a6, 0
    jal  ra, run_state
    CHECK a0, OVER, 43
    li   a5, OVER
    li   a6, 0x10
    jal  ra, run_state
    CHECK a0, TITLE, 44

# ---- L14 serial send (MSB first), rebuilt MSB first on the other side
    li   a0, 0xB5
    li   a1, 0
    li   t0, 8
5:  srli t1, a0, 7
    andi t1, t1, 1
    slli a1, a1, 1           # receiver: make room
    or   a1, a1, t1          # receiver: insert bit
    slli a0, a0, 1
    addi t0, t0, -1
    bnez t0, 5b
    CHECK a1, 0xB5, 45
# ---- L14 exercise: rotate left on 8 bits
    li   a0, 0x81
    srli t1, a0, 7
    andi t1, t1, 1
    slli a0, a0, 1
    or   a0, a0, t1
    andi a0, a0, 255
    CHECK a0, 0x03, 46

# ---- L15 word and bytes
    la   t0, value
    lw   t1, 0(t0)
    lbu  t2, 0(t0)
    lbu  t3, 1(t0)
    lbu  t4, 3(t0)
    CHECK t1, 0x12345678, 47
    CHECK t2, 0x78, 48
    CHECK t3, 0x56, 49
    CHECK t4, 0x12, 50
    la   t0, name
    la   t1, score
    sub  t2, t1, t0
    CHECK t2, 8, 51          # 6 bytes + 2 of padding
    la   t0, cafe
    lbu  t0, 0(t0)
    CHECK t0, 0x01, 52

# ---- L16 best score
    la   t0, best
    sw   zero, 0(t0)
    li   a0, 50
    jal  ra, keep_best
    li   a0, 30
    jal  ra, keep_best
    la   t0, best
    lw   t1, 0(t0)
    CHECK t1, 50, 53

# ---- L20 pixel address
    li   a0, 100
    li   a1, 50
    li   t0, 320
    mul  t1, a1, t0
    add  t1, t1, a0
    CHECK t1, 16100, 54

# ---- L18 z = x + y, push and pop
    la   t0, x
    lw   t1, 0(t0)
    la   t0, y
    lw   t2, 0(t0)
    add  t3, t1, t2
    la   t0, z
    sw   t3, 0(t0)
    lw   t4, z
    CHECK t4, 12, 55
    mv   s1, sp
    li   t0, 1234
    addi sp, sp, -4
    sw   t0, 0(sp)
    li   t0, 0
    lw   t0, 0(sp)
    addi sp, sp, 4
    CHECK t0, 1234, 56
    li   x30, 57
    bne  s1, sp, fail

# ---- L19 trap handler: a machine software interrupt, then an ecall
    li   t0, 0x11111111
    li   t1, 0x22222222
    li   s4, 0               # set by the handler
    li   t2, 8               # mie.MSIE
    csrs mie, t2
    csrsi mstatus, 8         # mstatus.MIE
    li   t3, 0x2000000       # CLINT msip
    li   t4, 1
    sw   t4, 0(t3)           # raise the interrupt
    nop
    nop
    CHECK s4, 1, 58          # the interrupt path ran
    CHECK t0, 0x11111111, 59 # context preserved
    CHECK t1, 0x22222222, 60
    csrr s5, mstatus
    andi s5, s5, 8
    CHECK s5, 8, 61          # mret restored MIE
    ecall                    # exception path: handler skips it
    CHECK s4, 2, 62

pass:
    li   t0, 0x100000
    li   t1, 0x5555
    sw   t1, 0(t0)
8:  j    8b
fail:
    li   t0, 0x100000
    slli x30, x30, 16
    li   t1, 0x3333
    or   t1, t1, x30
    sw   t1, 0(t0)
6:  j    6b

# ---------------- routines holding the slide code ----------------
sovf:                        # a5 + a6: a0 = 1 on signed overflow (L05)
    mv   t0, a5
    mv   t1, a6
    li   a0, 0
    add  t2, t0, t1
    slti t3, t1, 0
    slt  t4, t2, t0
    bne  t3, t4, overflow
    ret
overflow:
    li   a0, 1
    ret

clamp:                       # a5 = x, a6 = buttons (L05 "Keeping the marker on the screen")
    mv   t2, a5
    mv   t0, a6
    andi t3, t0, BTN_LEFT
    beqz t3, 1f
    addi t2, t2, -SPEED
1:  andi t3, t0, BTN_RIGHT
    beqz t3, 2f
    addi t2, t2, SPEED
2:
    bgez t2, 3f
    li   t2, 0
3:  li   t3, MAX_X
    ble  t2, t3, 4f
    mv   t2, t3
4:
    ret

ball_update:                 # L06
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    addi t1, t1, SPEED_Q8
    sw   t1, 0(t0)
    ret

pick:                        # L11
    la   t0, palette
    slli t1, a0, 2
    add  t0, t0, t1
    lw   a4, 0(t0)
    ret

prg32_input_read:
    la   a0, fake_buttons
    lw   a0, 0(a0)
    ret

run_state:                   # a5 = state, a6 = buttons; returns a0 = new state
    la   t0, state
    sw   a5, 0(t0)
    la   t0, fake_buttons
    sw   a6, 0(t0)
    addi sp, sp, -16
    sw   ra, 12(sp)
    jal  ra, game_update
    lw   ra, 12(sp)
    addi sp, sp, 16
    la   t0, state
    lw   a0, 0(t0)
    ret

game_update:                 # L13, with the elided prologue and epilogue filled in
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read
    la   t0, state
    lw   t1, 0(t0)
    andi t2, a0, 0x10
    li   t3, TITLE
    bne  t1, t3, 1f
    beqz t2, done
    li   t1, PLAY
    j    store
1:  li   t3, OVER
    bne  t1, t3, done
    beqz t2, done
    li   t1, TITLE
store:
    sw   t1, 0(t0)
done:
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

keep_best:                   # L16
    la   t0, best
    lw   t1, 0(t0)
    ble  a0, t1, 1f
    sw   a0, 0(t0)
1:  ret

.balign 4
trap_entry:                  # L19, with the two elided parts filled in
    addi sp, sp, -16
    sw   t0, 0(sp)
    sw   t1, 4(sp)

    csrr t0, mcause
    bgez t0, exception
    li   t0, 0x2000000       # serve the device: clear msip
    sw   zero, 0(t0)
    li   s4, 1
    j    7f
exception:
    csrr t0, mepc            # skip the ecall
    addi t0, t0, 4
    csrw mepc, t0
    li   s4, 2
7:
    lw   t0, 0(sp)
    lw   t1, 4(sp)
    addi sp, sp, 16
    mret

.section .rodata
palette: .word 0xf800, 0x07e0, 0x001f, 0xffe0
.section .data
scores: .word 32, 11, 34, 22
ball_x_q8: .word 0
state: .word 0
fake_buttons: .word 0
value: .word 0x12345678
name:  .asciz "PRG32"
       .balign 4
score: .word 0
cafe:  .word 0xCAFE0001
best:  .word 0
x: .word 5
y: .word 7
z: .word 0
.section .bss
.space 4096
stack_top:
