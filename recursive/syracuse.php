<?php

function calculate_syracuse_recursive($n, $i = PHP_INT_MAX) {
    if ($i == 0) return $n;
    $i --;
    $n = $n % 2 == 0 ? $n / 2 : $n * 3 + 1;
    return calculate_syracuse_recursive($n, $i);
}

$n = 15;
$i = 4;
echo calculate_syracuse_recursive($n, $i);