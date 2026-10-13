.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40              # 320 / 8 cells across
.equ ROWS,  24              # 192 / 8 cells down
.equ TOP,   8               # the top 8 pixels are the title line
.equ SPEED_Q8, 40           # 40/256 of a cell per frame (Q24.8)

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw
