const urlBase = 'http://31contacts.tk/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
    userId = 0;
    firstName = "";
    lastName = "";

    window.location.href = "register.html";
}

function doRegister()
{
    userId = 0;
    firstName = "";
    lastName = "";

    firstName = document.getElementById("userFirstName").value;
    lastName = document.getElementById("userLastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5( password );

		if (firstName!="" && lastName!="" && login!="" && password!=""){
		    document.getElementById("registerResult").innerHTML = "";

		    let tmp = {firstName:firstName,lastName:lastName,login:login,password:hash};
		    let jsonPayload = JSON.stringify( tmp );

		    let url = urlBase + 'LAMPAPI/Register.' + extension;

		    let xhr = new XMLHttpRequest();
		    xhr.open("POST", url, true);
		    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		    try
		    {
		        xhr.onreadystatechange = function()
		        {
		            if (this.readyState == 4 && this.status == 200)
		            {
		                  document.getElementById("registerResult").innerHTML = "Your account has been created!";

		                  window.location.href = "index.html";
		            }
		        };
		        xhr.send(jsonPayload);
		    }
		    catch(err)
		    {
		        document.getElementById("registerResult").innerHTML = err.message;
		    }
		} else {
				document.getElementById("registerResult").innerHTML = "Looks like some of your info is missing!";
		}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doGoToUpdate()
{
        userId = 0;
        firstName = "";
        lastName = "";
        document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "update.html";
}

function addContact()
{
	let firstName = document.getElementById("newFirstName").value;
	let lastName = document.getElementById("newLastName").value;
	let email = document.getElementById("newEmail").value;
	let phone = document.getElementById("newPhone").value;

	document.getElementById("contactAddResult").innerHTML = "";

	if (firstName!="" && lastName!="" && email!="" && phone!="") {
	  let tmp = {user:userId, firstName:firstName, lastName:lastName, email:email, phone:phone};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	} else {
		document.getElementById("contactAddResult").innerHTML = "Looks like some contact info is missing!";
	}

}


function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactsSearchResult").innerHTML = "";

	let contactsList = "";

	let tmp = {search:srch,user:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// document.getElementById("contactsSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );


				// This section takes care of formatting the HTML for the contacts list
				let contactsListElement = document.getElementById("contactsList");

				let e = document.querySelector('#contactsList');

				var child = e.firstChild;

				// This section clears contact list before every search
				while (child) {
					e.removeChild(child);
					child = e.firstChild;
				}

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					let contactElement = contactsListElement.appendChild(document.createElement("div"));
					contactElement.setAttribute("style", "width: 1200px; float:left; height:100px; margin:10px");
					contactElement.setAttribute("id", "contact"+i);
					contactElement.setAttribute("class", "contact");

					let firstNameElement = contactElement.appendChild(document.createElement("div"));
					firstNameElement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					firstNameElement.setAttribute("id", "firstName");
					firstNameElement.innerHTML = jsonObject.results[i].firstName;

					let lastNameElement = contactElement.appendChild(document.createElement("div"));
					lastNameElement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					lastNameElement.setAttribute("id", "lastName");
					lastNameElement.innerHTML = jsonObject.results[i].lastName;

					let emailElement = contactElement.appendChild(document.createElement("a"));
					emailElement.setAttribute("style", "width: 450px; float:left; height:50px; margin:10px");
					emailElement.setAttribute("id", "email");
					emailElement.href = "mailto:" + jsonObject.results[i].email;
					emailElement.innerHTML = jsonObject.results[i].email;
					emailElement.click();

					let phoneElement = contactElement.appendChild(document.createElement("div"));
					phoneElement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					phoneElement.setAttribute("id", "phone");
					let phoneNumber = jsonObject.results[i].phone;
					phoneElement.innerHTML = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, 10);
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactsSearchResult").innerHTML = err.message;
	}

}

function doDeleteUser(){

                        var result = confirm('Are you sure you want to delete your account?');
                        if (result==true){
                                readCookie();
                                let tmp = {firstName:firstName,id:userId};
                                let jsonPayload = JSON.stringify( tmp );

                                let url = urlBase + 'LAMPAPI/DeleteUser.' + extension;

                                let xhr = new XMLHttpRequest();
                                xhr.open("POST", url, true);
                                xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

                                try
                                {
                                        xhr.send(jsonPayload);
                                        window.location.href = "index.html";
					alert('Sorry to see you go '+firstName+'. Your account was succesfully deleted.');
                                }
                                catch(err)
                                {
                                        alert('SORRY your account could not be deleted');
                                }
 
                        }

}
