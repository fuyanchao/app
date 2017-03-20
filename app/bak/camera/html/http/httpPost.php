<?php
    include_once './HttpClient.class.php';
    $url = $_POST['api_url'];
    $data  = $_POST['post_data'];
    $result = null;
   // echo $url;
   // echo $data;
    if(!empty($url)&&!empty($data)){
        $bits = parse_url($url);
        $host = $bits['host'];
    	$http = new HttpClient($host);
    	$da = json_decode($data,true);
       	echo $http->quickPost($url, $da);
    }else{
        $result = array("errcode"=>"405","errmsg"=>"缺少参数");
        echo json_encode($result);  
    }
?>