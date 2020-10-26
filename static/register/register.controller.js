(function(){
    const emailAddressFld = $('#emailAddressFld');
    const passwordFld = $('#passwordFld');
    const firstNameFld = $('#firstNameFld');
    const lastNameFld = $('#lastNameFld');
    const enterCodeFld = $('#enterCodeFld');
    const submitCodeBtn = $('#submitCodeBtn');
    const registerBtn = $('#registerBtn');
    const signUpBtn = $('#signUpBtn');
    const registrationUnaccessAlert = $('#register-unsuccess');
    const verifyPasswordFld = $('#verifyPasswordFld');
    const successAlert = $('#register-success');
    const verifyUnsuccessAlert = $('#verify-unsuccess');
    const registerContainer = $('#register-div');
    const verifyContainer = $('#verify-div');


    let userName;

    registerBtn.click(register);
    submitCodeBtn.click(verifyCode);
    signUpBtn.click(register);

    const TAG = 'HandleRegister';

    function register(){
        console.log(TAG + "Executing Register...")
        const firstName = firstNameFld.val();
        const lastName = lastNameFld.val();
        const emailAddress = emailAddressFld.val();
        const password = passwordFld.val();
        const verifyPassword = verifyPasswordFld.val();
        registrationUnaccessAlert.hide();
        if(password!=verifyPassword){
            registrationUnaccessAlert.html('Registration unsuccessful. Entered passwords does not match');
            registrationUnaccessAlert.show();
            return;
        }

        fetch('/register' , {
            method : 'post',
            body : JSON.stringify({firstName: firstName, lastName: lastName,
                emailAddress : emailAddress, password : password}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if(response.status===404) {
                    registrationUnaccessAlert.html('Registration unsuccessful. Something went worng.');
                    registrationUnaccessAlert.show();
                    console.log(TAG + "Registration Failed");
                    return;
                }
                console.log(TAG + "Registration Success");

                userName = response.user.username;
                window.localStorage.setItem('firstName', firstName);
                window.localStorage.setItem('lastName', lastName);
                window.localStorage.setItem('email', emailAddress);
                successAlert.html("Verification Code has been sent to your registered email address. Please enter to proceed.")
                successAlert.show();
                registerContainer.hide();
                verifyContainer.show();
            }));
    }

    function verifyCode(){
        console.log(TAG + "Executing Verify...");
        successAlert.hide();
        verifyUnsuccessAlert.hide();
        const code = enterCodeFld.val();
        fetch('/verify' , {
            method : 'post',
            body : JSON.stringify({verificationCode: code , email: userName}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if(response.status === 200){
                    console.log(TAG + " Verification Success");
                    console.log(response);
                    window.location = "http://localhost:3000/home.html";
                }
                else{
                    console.log(TAG + "Verification Failed");
                    verifyUnsuccessAlert.html("Incorrect verification code provided.")
                    verifyUnsuccessAlert.show();
                }
            }));
    }

    function signIn(){
        window.location = "http://localhost:3000/signIn.html";
    }

    function validateEmail(mail)
    {
        if (/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/.test(myForm.emailAddr.value))
        {
            return true
        }
        alert("You have entered an invalid email address!")
        return false
    }
})();