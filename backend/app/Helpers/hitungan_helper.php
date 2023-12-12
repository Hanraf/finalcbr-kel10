<?php 
function sdc($newCase, $baseCase) {
    $similarities = [];
    foreach ($baseCase as $bc) {
        $bcPernyataan = $bc['id_pernyataan'];

        // Hitung koefisien Sorensen
        $kesamaanCiri = array_intersect($newCase, $bcPernyataan);
        $sorensenCoefficient = 2 * count($kesamaanCiri) / (count($newCase) + count($bcPernyataan));

        $similarities[] = [
            'id_kasus' => $bc['id_kasus'],
            'id_minatbakat' => $bc['id_minatbakat'],
            'minat_bakat' => $bc['minat_bakat'],
            'stimulasi' => $bc['stimulasi'],
            'sorensen_coefficient' => $sorensenCoefficient
        ];
    }

    // Urutkan berdasarkan sorensen_coefficient
    usort($similarities, function($a, $b) {
        return $b['sorensen_coefficient'] <=> $a['sorensen_coefficient'];
    });

    return $similarities;
}
