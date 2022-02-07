<?php
	$inData = getRequestInfo();
	
	$UID = $inData["UID"]; 
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		/* $stmt = $conn->prepare("UPDATE from Users WHERE Login=? AND Password=?");
		$stmt->bind_param("sss", $id, $login, $password);
		$stmt->execute(); */

		if (isset($firstName))
		{
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName=? WHERE UID=?");
			$stmt->bind_param("ss", $firstName, $UID);
			$stmt->execute();
		}

		if (isset($lastName))
		{

		}

		if (isset($email))
		{
			
		}

		if (isset($phone))
		{
			
		}

		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
