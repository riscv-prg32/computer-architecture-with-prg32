    la   t0, x
    lw   t1, 0(t0)       # bring x into a register
    la   t0, y
    lw   t2, 0(t0)       # bring y into a register
    add  t3, t1, t2      # compute, between registers
    la   t0, z
    sw   t3, 0(t0)       # take the result back to memory

.section .data
x: .word 5
y: .word 7
z: .word 0
