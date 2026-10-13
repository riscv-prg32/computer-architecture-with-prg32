double a = 0.1 + 0.2;

// a == 0.3 ?   false
// a = 0.30000000000000004

// better:
// fabs(a - 0.3) < 1e-9
