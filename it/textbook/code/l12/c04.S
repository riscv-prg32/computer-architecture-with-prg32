.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0
.equ RED,   0xf800
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40
.equ ROWS,  24
.equ TOP,   8
.equ SPEED_Q8, 40           # 40/256 of a cell per frame
.equ BTN_LEFT,  0x01        # one bit per button
.equ BTN_RIGHT, 0x02
.equ BTN_UP,    0x04
.equ BTN_DOWN,  0x08
.equ DIR_RIGHT, 0           # a direction is a 2-bit code:
.equ DIR_DOWN,  1           #   bit 0 = vertical
.equ DIR_LEFT,  2           #   bit 1 = backwards
.equ DIR_UP,    3

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw
