.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0          # the head
.equ BODY,  0x03e0          # the body: a darker green
.equ RED,   0xf800          # the food
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40
.equ ROWS,  24
.equ TOP,   8
.equ SPEED_MIN, 32          # 32/256 of a cell per frame at the start
.equ SPEED_MAX, 96          # the worm never goes faster than this
.equ BTN_LEFT,  0x01
.equ BTN_RIGHT, 0x02
.equ BTN_UP,    0x04
.equ BTN_DOWN,  0x08
.equ BTN_A,     0x10
.equ DIR_RIGHT, 0           # bit 0 = vertical, bit 1 = backwards
.equ DIR_DOWN,  1
.equ DIR_LEFT,  2
.equ DIR_UP,    3
.equ TITLE, 0               # the three states of the game
.equ PLAY,  1
.equ OVER,  2
