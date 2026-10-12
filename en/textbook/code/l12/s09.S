.section .rodata
title:   .asciz "VERM1"
dx:      .word  1, 0, -1,  0    # right, down, left, up
dy:      .word  0, 1,  0, -1

.section .data
head_x:  .word 5
head_y:  .word 12
dir:     .word 0                # direction of the last step
want:    .word 0                # direction asked by the player
step_q8: .word 0
score:   .word 0
food_x:  .word 20
food_y:  .word 12
