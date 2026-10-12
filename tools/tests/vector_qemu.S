# Lecture 24: the loop that empties the map of Verm1, scalar and with the RISC-V vector extension,
# and a vector sum.  Runs on QEMU virt with -cpu rv32,v=true; exit 0 = all checks passed.
.equ COLS, 40
.equ ROWS, 24
.macro CHECK reg, val, n
    li   x31, \val
    li   x30, \n
    bne  \reg, x31, fail
.endm
.section .text
.global _start
_start:
    la   sp, stack_top
    li   t0, 0x600              # mstatus.VS = dirty: switch the vector unit on
    csrs mstatus, t0

    call fill
#@ scalar
    la   t0, grid
    li   t1, COLS*ROWS
1:  sb   zero, 0(t0)            # one byte per turn of the loop
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
#@ end
    call count
    CHECK a0, 0, 1

    call fill
#@ vector
    la   t0, grid
    li   t1, COLS*ROWS
    vsetvli t2, t1, e8, m1, ta, ma  # elements are bytes
    vmv.v.i v0, 0                   # a register full of zeros
1:  vsetvli t2, t1, e8, m1, ta, ma  # t2 = bytes of this turn
    vse8.v  v0, (t0)                # store t2 bytes at once
    add  t0, t0, t2
    sub  t1, t1, t2
    bnez t1, 1b
#@ end
    call count
    CHECK a0, 0, 2

#@ sum
    la   t0, numbers
    li   t1, 16                 # sixteen words to add
    vsetvli t2, zero, e32, m1, ta, ma
    vmv.v.i v1, 0               # v1 = partial sums, one per lane
1:  vsetvli t2, t1, e32, m1, tu, ma
    vle32.v v2, (t0)            # load t2 words
    vadd.vv v1, v1, v2          # add them, lane by lane
    slli t3, t2, 2
    add  t0, t0, t3
    sub  t1, t1, t2
    bnez t1, 1b
    vsetvli t2, zero, e32, m1, ta, ma
    vmv.s.x v3, zero
    vredsum.vs v3, v1, v3       # add the lanes together
    vmv.x.s a0, v3
#@ end
    CHECK a0, 136, 3

pass:
    li   t0, 0x100000
    li   t1, 0x5555
    sw   t1, 0(t0)
2:  j    2b
fail:
    li   t0, 0x100000
    slli x30, x30, 16
    li   t1, 0x3333
    or   t1, t1, x30
    sw   t1, 0(t0)
3:  j    3b

fill:                           # every byte of the grid = 1
    la   t0, grid
    li   t1, COLS*ROWS
    li   t2, 1
1:  sb   t2, 0(t0)
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
    ret
count:                          # a0 = sum of the bytes of the grid
    la   t0, grid
    li   t1, COLS*ROWS
    li   a0, 0
1:  lbu  t2, 0(t0)
    add  a0, a0, t2
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
    ret

.section .rodata
numbers: .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
.section .bss
grid:    .space COLS*ROWS
         .space 1024
stack_top:
