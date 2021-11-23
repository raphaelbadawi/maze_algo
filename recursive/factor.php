<?php

function calculate_factor($n) {
    if ($n <= 1) {
        return $n;
    }
    return $n * calculate_factor($n - 1);
}

$n = 4;
echo calculate_factor($n);
