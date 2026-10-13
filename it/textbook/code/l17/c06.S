.section .data                  # variables: they live in RAM
state:     .word TITLE
prev_btn:  .word 0              # the buttons one frame ago
dir:       .word 0
want:      .word 0
step_q8:   .word 0
score:     .word 0
best:      .word 0              # lost when the power goes
food_x:    .word 0
food_y:    .word 0
head_i:    .word 0              # ring index of the head
length:    .word 0              # number of cells of the worm
body_x:    .space 256           # the ring: one byte per segment
body_y:    .space 256
grid:      .space COLS*ROWS     # one byte per cell: 1 = worm
