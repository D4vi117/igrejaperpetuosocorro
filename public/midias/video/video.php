<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

require_once '/home/u150765648/domains/igrejaperpetuosocorro.com/vendor/autoload.php';
use Dotenv\Dotenv;

/* ENV */
$dotenv = Dotenv::createImmutable('/home/u150765648/domains/igrejaperpetuosocorro.com/');
$dotenv->load();

/* CONEXÃO */
try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Erro de conexão']);
    exit;
}

/* PARÂMETRO */
$videoRaw = trim($_GET['video'] ?? '');

if ($videoRaw === '') {
    echo json_encode(['success'=>false,'message'=>'Parâmetro inválido']);
    exit;
}

/* NORMALIZA PARA LIKE */
$videoLike = '%' . str_replace('-', ' ', $videoRaw) . '%';

/* BUSCA VÍDEO ATUAL */
$sqlAtual = "
SELECT *
FROM conteudos
WHERE tipo = 'video'
AND (
    path = :video
    OR titulo LIKE :titulo
)
LIMIT 1
";

$stmt = $pdo->prepare($sqlAtual);
$stmt->bindValue(':video', 'video/' . $videoRaw);
$stmt->bindValue(':titulo', $videoRaw);
$stmt->execute();

$videoAtual = $stmt->fetch();

if (!$videoAtual) {
    echo json_encode([
        'success'=>false,
        'message'=>'Vídeo não encontrado ' . $videoRaw
    ]);
    exit;
}

/* DADOS DO VÍDEO ATUAL */
$idAtual   = (int)$videoAtual['id'];
$dataAtual = $videoAtual['data_publicacao'];

/* ANTERIORES (até 2) */
$sqlPrev = "
SELECT *
FROM conteudos
WHERE tipo = 'video'
AND data_publicacao < :data
AND id != :id
ORDER BY data_publicacao DESC
LIMIT 2
";

$stmtPrev = $pdo->prepare($sqlPrev);
$stmtPrev->bindValue(':data', $dataAtual);
$stmtPrev->bindValue(':id', $idAtual, PDO::PARAM_INT);
$stmtPrev->execute();
$anteriores = $stmtPrev->fetchAll();

/* PRÓXIMOS (até 2) */
$sqlNext = "
SELECT *
FROM conteudos
WHERE tipo = 'video'
AND data_publicacao > :data
AND id != :id
ORDER BY data_publicacao ASC
LIMIT 2
";

$stmtNext = $pdo->prepare($sqlNext);
$stmtNext->bindValue(':data', $dataAtual);
$stmtNext->bindValue(':id', $idAtual, PDO::PARAM_INT);
$stmtNext->execute();
$proximos = $stmtNext->fetchAll();

/* COMPLETA COM ANTERIORES SE FALTAR PRÓXIMOS */
$faltando = 2 - count($proximos);

if ($faltando > 0) {

    $idsIgnorar = array_merge(
        [$idAtual],
        array_column($anteriores, 'id')
    );

    $placeholders = implode(',', array_fill(0, count($idsIgnorar), '?'));

    $sqlExtraPrev = "
    SELECT *
    FROM conteudos
    WHERE tipo = 'video'
    AND data_publicacao < ?
    AND id NOT IN ($placeholders)
    ORDER BY data_publicacao DESC
    LIMIT ?
    ";

    $stmtExtra = $pdo->prepare($sqlExtraPrev);

    $i = 1;
    $stmtExtra->bindValue($i++, $dataAtual);
    foreach ($idsIgnorar as $id) {
        $stmtExtra->bindValue($i++, $id, PDO::PARAM_INT);
    }
    $stmtExtra->bindValue($i++, $faltando, PDO::PARAM_INT);

    $stmtExtra->execute();

    $anteriores = array_merge($anteriores, $stmtExtra->fetchAll());
}

/* ORDENA ANTERIORES POR DATA (ASC) */
usort($anteriores, function($a, $b) {
    return strtotime($a['data_publicacao']) <=> strtotime($b['data_publicacao']);
});

/* JSON FINAL */
echo json_encode([
    'success' => true,
    'data' => $videoAtual,
    'relacionados' => [
        'anteriores' => $anteriores,
        'proximos'   => $proximos
    ]
]);
