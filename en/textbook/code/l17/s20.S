new_game:                       # temporary: only change the state
    la   t0, state
    li   t1, PLAY
    sw   t1, 0(t0)
    ret

play_update:                    # temporary: nothing moves yet
    ret

draw_score:                     # temporary
    ret

draw_worm:                      # temporary
    ret
