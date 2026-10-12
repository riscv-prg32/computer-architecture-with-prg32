draw_score:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, score
    lw   a0, 0(t0)
    la   a1, score_txt
    call to_decimal             # the score, as three characters
    li   a0, 56
    li   a1, 0
    la   a2, score_txt
    call draw_text
    la   t0, best
    lw   a0, 0(t0)
    la   a1, best_txt+5         # after the letters "BEST "
    call to_decimal
    li   a0, 256
    li   a1, 0
    la   a2, best_txt
    call draw_text
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
