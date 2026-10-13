# ARC12 Computer Architecture - Lecture 09: Elements of Boolean Algebra
# l09.S: a full adder, one gate per instruction, on its eight input combinations
#
# On the screen: eight rows, one per combination of A, B and Cin (000 at the top):
# three lamps for the inputs on the left, then S and Cout on the right. It is the
# truth table of the full adder.
# Build: python3 -m prg32 cartridge build l09.S --portable \
#            --entry-prefix l09 --name l09 --out l09.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ CYAN,   0x07ff

.section .text
.global l09_init
.global l09_update
.global l09_draw

l09_init:
    ret

l09_update:
    ret

# full_adder: a0 = A, a1 = B, a2 = Cin (each 0 or 1); result: a3 = S, a4 = Cout
full_adder:
    xor  t0, a0, a1      # t0   = A xor B
    xor  a3, t0, a2      # S    = A xor B xor Cin
    and  t1, a0, a1      # t1   = A . B
    and  t2, t0, a2      # t2   = (A xor B) . Cin
    or   a4, t1, t2      # Cout = A . B + (A xor B) . Cin
    ret

# lamp: a0 = column, a1 = row, a2 = bit (0 or 1), a3 = colour when the bit is 1
lamp:
    li   a4, GREY
    beqz a2, 1f
    mv   a4, a3
1:  slli a0, a0, 5
    addi a0, a0, 60          # x = 60 + 32 * column
    slli a1, a1, 4
    slli t0, a1, 1
    srli a1, a1, 1
    add  a1, a1, t0          # 40 * row ...
    srli a1, a1, 1           # ... / 2 = 20 * row
    addi a1, a1, 20          # y = 20 + 20 * row
    li   a2, 24
    li   a3, 14
    tail prg32_gfx_rect      # a tail call: rect returns to our caller

l09_draw:
    addi sp, sp, -32
    sw   ra, 28(sp)
    sw   s0, 24(sp)
    sw   s1, 20(sp)
    sw   s2, 16(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   s0, 0               # row = the three inputs as a number, 0 to 7
1:  srli a0, s0, 2
    andi a0, a0, 1           # A   = bit 2 of the row
    srli a1, s0, 1
    andi a1, a1, 1           # B   = bit 1
    andi a2, s0, 1           # Cin = bit 0
    call full_adder
    mv   s1, a3              # keep S and Cout: they are in a registers,
    mv   s2, a4              # which the next calls destroy

    li   a0, 0               # column 0: A
    mv   a1, s0
    srli a2, s0, 2
    andi a2, a2, 1
    li   a3, YELLOW
    call lamp
    li   a0, 1               # column 1: B
    mv   a1, s0
    srli a2, s0, 1
    andi a2, a2, 1
    li   a3, YELLOW
    call lamp
    li   a0, 2               # column 2: Cin
    mv   a1, s0
    andi a2, s0, 1
    li   a3, YELLOW
    call lamp
    li   a0, 4               # column 4: S
    mv   a1, s0
    mv   a2, s1
    li   a3, CYAN
    call lamp
    li   a0, 5               # column 5: Cout
    mv   a1, s0
    mv   a2, s2
    li   a3, CYAN
    call lamp

    addi s0, s0, 1
    li   t0, 8
    blt  s0, t0, 1b
    lw   s2, 16(sp)
    lw   s1, 20(sp)
    lw   s0, 24(sp)
    lw   ra, 28(sp)
    addi sp, sp, 32
    ret
