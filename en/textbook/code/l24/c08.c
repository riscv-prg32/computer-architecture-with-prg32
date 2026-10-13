// the kernel: this function runs once in every thread
__global__ void clear(unsigned char *grid, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // who am I?
    if (i < n)
        grid[i] = 0;                                 // my cell, and only mine
}

// on the host: 4 blocks of 256 threads cover the 960 cells
clear<<<(960 + 255) / 256, 256>>>(grid, 960);
