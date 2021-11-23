<?php

function calculate_gcd($a, $b) {
    if ($a == $b) return $a;
    if ($a > $b) return calculate_gcd($a - $b, $b);
    return calculate_gcd($a, $b - $a);
}

echo calculate_gcd(13*52, 13*45);