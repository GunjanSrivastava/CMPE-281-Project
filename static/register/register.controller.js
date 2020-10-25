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
    const verifyPasswordFld = $('#verifyPassword');
    const successAlert = $('#register-success');
    const verifyUnsuccessAlert = $('#verify-unsuccess');

    let username;

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
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                console.log(TAG + "Registration Success");
                console.log(response.status);

                userName = response.files.user.username;
                successAlert.html("Verification Code has been sent to your registered email address. Please enter to proceed.")
                successAlert.show();
                if(response.status === 200){
                    console.log(response.files);
                }
                else{
                    console.log(TAG + "Registration Failed");
                }
            }));
    }

    function verifyCode(){
        console.log(TAG + "Executing Verify...");
        successAlert.hide();
        verifyUnsuccessAlert.hide();
        const code = enterCodeFld.val();
        fetch('/verify' , {
            method : 'post',
            body : JSON.stringify({verificationCode: code , email : userName}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                console.log(response.status);
                console.log(response.files);
                if(response.status === 200){
                    console.log(TAG + " Verification Success");
                    console.log(response.files);
                    window.location.replace("http://localhost:3000/dashboard.html");
                }
                else{
                    console.log(TAG + "Verification Failed");
                    verifyUnsuccessAlert.html("Incorrect verification code provided.")
                    verifyUnsuccessAlert.show();
                }
            }));
    }

    function signIn(){
        window.location.replace("http://localhost:3000/signIn.html");
    }

    function validateEmail(mail)
        {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(myForm.emailAddr.value))
            {
                return true
            }
            alert("You have entered an invalid email address!")
            return false
        }
})();

