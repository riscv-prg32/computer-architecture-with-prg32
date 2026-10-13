.section .data
scores: .word 32, 11, 34, 22     # four 32-bit words, 16 bytes

.section .text
    la   t0, scores      # t0 = ADDRESS of element 0
    li   t1, 2           # index i = 2
    slli t1, t1, 2       # offset = i * 4 bytes (shift left by 2)
    add  t0, t0, t1      # ADDRESS of element i
    lw   a0, 0(t0)       # a0 = VALUE of scores[2] = 34
