<?php
function formatCurrentTime() {
    $h = date('G');
    $m = date('i');
    
    $hoursForms = ['час', 'часа', 'часов'];
    $minutesForms = ['минута', 'минуты', 'минут'];
    
    $getForm = function($n, $forms) {
        $n = abs($n) % 100;
        $n1 = $n % 10;
        
        if ($n > 10 && $n < 20) return $forms[2];
        if ($n1 > 1 && $n1 < 5) return $forms[1];
        if ($n1 == 1) return $forms[0];
        return $forms[2];
    };
    
    return $h . ' ' . $getForm($h, $hoursForms) . ' ' . 
           $m . ' ' . $getForm($m, $minutesForms);
}
?>