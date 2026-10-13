.section .rodata                # constants: they stay in the cartridge file
title:     .asciz "VERM1"
press_a:   .asciz "PRESS A"
game_over: .asciz "GAME OVER"
dx:        .word  1, 0, -1,  0  # right, down, left, up
dy:        .word  0, 1,  0, -1
