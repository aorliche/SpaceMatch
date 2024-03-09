<?php
if (!strstr($_SERVER['HTTP_REFERER'], 'hunimal.org/SpaceMatch/')) {
    die($_SERVER['HTTP_REFERER']);
}
$new = file_get_contents('php://input');
$newScore = json_decode($new);

$existing = file_get_contents('scores.json');
$existingScores = json_decode($existing);

array_push($existingScores, $newScore);
$json = json_encode($existingScores);

file_put_contents('scores.json', $json);

echo "Success";
?>
