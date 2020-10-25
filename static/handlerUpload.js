(function(){
    const uploadBtn = $('#uploadBtn');
    $('#welcome-user').value = window.localStorage.getItem('firstName');
    uploadBtn.click(uploadHandler)

    function uploadHandler(){
        const TAG = 'HandlerUpload';

        console.log(TAG + "Executing File Upload...");
        console.log(window.localStorage.getItem('firstName'));
        fetch('/upload' , {
            method : 'post',
            body : '',
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
                    console.log(TAG + " Upload Success");
                    console.log(response.files);
                    // TODO : update list on page
                    //TODO : Insert into RDS
                    insertIntoDb(response.files.Bucket,response.files.Key,response.files.Location);
                }
                else{
                    console.log("Upload Failed");
                }
            }));
        }

        function insertIntoDb(bucket,key,loc){
            console.log("Executing Insert Into DB...");
            key = key.substring(key.indexOf('/')+1);
            const fName = window.localStorage.getItem('firstName');
            const lName = window.localStorage.getItem('lastName');
            const email = window.localStorage.getItem('email');
            const userId = email + ' ' +  key;
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const uploadTime = date+' '+time;
            const updateTime = null;
            const desc = "This is the latest version";

           const newUser =  {
               userId : userId,
               fName : fName,
               lName : lName,
               email : email,
               bucket : bucket,
               key : key,
               location : loc,
               uploadTime : uploadTime,
               updateTime : updateTime,
               desc: desc
           }

            fetch('/db/insert' , {
                method : 'post',
                body : JSON.stringify(newUser),
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
                        console.log(" Insert Success");
                        console.log(response.files);
                        location.reload();
                    }
                    else{
                        console.log("Insert Failed");
                    }
                }));
        }
})();

