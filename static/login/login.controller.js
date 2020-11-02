(function(){
    const $emailAddressFld = $('#enterEmailFld');
    const $passwordFld = $('#enterPwdFld');
    const $signInBtn = $('#signInBtn');
    const $unsuccessAlert = $('.login-unsuccess');
    $signInBtn.click(signIn);

    const TAG = 'HandlerSignIn';

    function signIn(){
        console.log(TAG + "Executing SignIn...")
        const emailAddress = $emailAddressFld.val();
        const password = $passwordFld.val();
        $unsuccessAlert.hide();

        fetch('/signIn' , {
            method : 'post',
            body : JSON.stringify({email: emailAddress, password: password}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => {
                if(data.status===404) {
                    $unsuccessAlert.html('Sign in unsuccessful. Incorrect credentials.');
                    $unsuccessAlert.show();
                    console.log(TAG + "SignIn Failed");
                    return;
                }
                console.log(TAG + "SignIn Success");
                console.log(data);
                window.localStorage.setItem('firstName', data.response.idToken.payload.name);
                window.localStorage.setItem('lastName', data.response.idToken.payload.family_name);
                window.localStorage.setItem('email', data.response.idToken.payload.email);
                if(data.response.idToken.payload.email === 'gunjan.srivastava@sjsu.edu'){
                    //window.location= "admin.html";
                    window.location= "http://localhost:3000/admin.html";
                    return;
                }else
                {
                    //window.location = "home.html";
                    window.location= "http://localhost:3000/home.html";
                }
            }));
    }
})();
