<?php

function calculate_fibonacci($n) {
    if ($n == 0 || $n == 1) return $n;
    return calculate_fibonacci($n - 1) + calculate_fibonacci($n - 2);
}

$n = 16;
echo calculate_fibonacci($n) . "\n";