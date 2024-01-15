function submittedForm(event) {

    event.preventDefault();

    // Get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var dob = document.getElementById('dob').value;
    var acceptTerms = document.getElementById('acceptTerms').checked;



    var user = {
        name: name,
        email: email,
        password: password,
        dob: dob,
        acceptTerms: acceptTerms
    };

    var users = JSON.parse(localStorage.getItem('users')) || [];


    users.push(user);


    localStorage.setItem('users', JSON.stringify(users));


    displayUsers();


    document.getElementById('registrationForm').reset();
}

function displayUsers() {

    var userList = document.getElementById('userList');

    userList.innerHTML = '';


    var users = JSON.parse(localStorage.getItem('users')) || [];


    users.forEach(function (user) {
        var row = userList.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.textContent = user.name;
        cell2.textContent = user.email;
        cell3.textContent = user.password;
        cell4.textContent = user.dob;
        cell5.textContent = user.acceptTerms ? 'True' : 'False';
    });
}


displayUsers();
