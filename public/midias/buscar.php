<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

require_once '/home/u150765648/domains/igrejaperpetuosocorro.com/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable('/home/u150765648/domains/igrejaperpetuosocorro.com/');
$dotenv->load();

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

/* GET params */
$busca  = trim($_GET['busca'] ?? '');
$tipo   = $_GET['tipo'] ?? 'allMidias';
$limite = (int)($_GET['limite'] ?? 5);
$pagina = (int)($_GET['pagina'] ?? 1);

$limite = in_array($limite,[5,10,20,50])?$limite:5;
$pagina = $pagina>0?$pagina:1;
$offset = ($pagina-1)*$limite;

/* WHERE base */
$where = "WHERE 1=1 ";
$params = [];

if($busca!=='') {
    $where .= " AND (
        c.titulo LIKE :busca OR 
        c.description  LIKE :busca OR 
        c.id IN (SELECT ct.conteudo_id FROM conteudo_tag ct 
                 INNER JOIN tags t ON t.id=ct.tag_id 
                 WHERE t.nome LIKE :busca_sub)
    )";
    $params[':busca'] = "%$busca%";
    $params[':busca_sub'] = "%$busca%";
}

if($tipo!=='allMidias') {
    $where .= " AND c.tipo=:tipo ";
    $params[':tipo'] = $tipo;
}

/* Contagem total */
$sqlCount = "SELECT COUNT(*) as total FROM conteudos c $where";
$stmtCount = $pdo->prepare($sqlCount);
foreach($params as $key=>$value){
    $stmtCount->bindValue($key,$value,PDO::PARAM_STR);
}
$stmtCount->execute();
$totalRegistros = (int)$stmtCount->fetch()['total'];
$totalPaginas   = (int)ceil($totalRegistros/$limite);

/* Query principal */
$sql = "SELECT * FROM conteudos c $where ORDER BY c.data_publicacao DESC LIMIT :limite OFFSET :offset";
$stmt = $pdo->prepare($sql);
foreach($params as $key=>$value){
    $stmt->bindValue($key,$value,PDO::PARAM_STR);
}
$stmt->bindValue(':limite',$limite,PDO::PARAM_INT);
$stmt->bindValue(':offset',$offset,PDO::PARAM_INT);
$stmt->execute();
$resultados = $stmt->fetchAll();

/* JSON */
echo json_encode([
    'success'=>true,
    'pagina_atual'=>$pagina,
    'total_paginas'=>$totalPaginas,
    'total_registros'=>$totalRegistros,
    'data'=>$resultados
]);
