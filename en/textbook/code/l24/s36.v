// Lecture 12: opposite directions differ in bit 1 only
module uturn (
    input  wire [1:0] dir,      // direction of the last step
    input  wire [1:0] want,     // direction asked by the player
    output wire       refuse    // 1 = this would be a U-turn
);
    assign refuse = (dir ^ want) == 2'b10;
endmodule
