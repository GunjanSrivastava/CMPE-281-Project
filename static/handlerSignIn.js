(function(){
    const emailAddressFld = $('#enterEmailFld');
    const passwordFld = $('#enterPwdFld');
    const signInBtn = $('#signInBtn');

    signInBtn.click(signIn);

    const TAG = 'HandlerSignIn';

    function signIn(){
        console.log(TAG + "Executing SignIn...")
        const emailAddress = emailAddressFld.val();
        const password = passwordFld.val();

        fetch('/signIn' , {
            method : 'post',
            body : JSON.stringify({email: emailAddress, password: password}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                if(response.status === 200){
                    console.log(TAG + "SignIn Success");
                    console.log(response);
                    // insertUserIntoDB(response.files.response.idToken.payload.name,response.files.response.idToken.payload.family_name,
                    //     response.files.response.idToken.payload.email);

                    window.localStorage.setItem('firstName' , response.files.response.idToken.payload.name);
                    window.localStorage.setItem('lastName' , response.files.response.idToken.payload.family_name);
                    window.localStorage.setItem('email' , response.files.response.idToken.payload.email);
                    if(response.files.response.idToken.payload.email === 'gunjan.srivastava@sjsu.edu'){
                        window.location.replace("http://localhost:3000/admin.html");
                    }else
                    {
                        window.location.replace("http://localhost:3000/dashboard.html");
                    }
                }
                else{
                    console.log(TAG + "SignIn Failed");
                }
            }));
    }

    function insertUserIntoDB(fName,lName,email){
        fetch('/create/users' , {
            method : 'post',
            body : JSON.stringify({fName : fName, lName: lName, email: email}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                if(response.status === 200){
                    console.log(response.files);
                }
                else{
                    console.log(TAG + "Insert User Failed");
                }
            }));
    }
})();

