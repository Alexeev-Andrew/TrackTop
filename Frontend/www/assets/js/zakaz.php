<?php
if($_POST)
    {
		
    $to = "mikehorbach1999@gmail.com"; //куди відправляти лист
    $subject = "Замовлення дзвінка";
	$page = $_SERVER['HTTP_REFERER'];
    $message = '<span style="font-weight:bold;color:#29AEE3;font-size:18px;"><i>Очікуйте дзвінка</i> </span><br><br>
    Телефон: <span style="font-weight:bold;color:#29AEE3;"> '.$_POST['tele_phone_call'].'</span><br>
	Посилання на <a href="'.$page.'">сторінку де натиснули</a><br>';
    $headers = "Content-type: text/html; charset=UTF-8 \r\n";
    $headers .= "From: <tracktop@tracktop.com.ua>\r\n";//Почта от кого
    $result = mail($to, $subject, $message, $headers);
  
    if ($result){
		header('Content-type: text/html; charset=utf-8');
        echo "Ми скоро передзвонимо вам!";
    }
    }	
?>