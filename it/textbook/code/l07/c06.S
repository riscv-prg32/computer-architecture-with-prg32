.section .rodata
title:   .asciz "VERM1"

.section .data
head_x:  .word 5                # column of the head, 0 .. COLS-1
head_y:  .word 12               # row of the head, 0 .. ROWS-1
step_q8: .word 0                # fraction of a step, in 1/256
