(function(){
    const fileInput = $('#file-input');
    $('#welcome-user').value = window.localStorage.getItem('firstName');
    fileInput.change(uploadHandler)

    function uploadHandler(){
        const TAG = 'HandlerUpload';
        let file = document.getElementById("file-input").files[0];
        let formData = new FormData();
        console.log(file instanceof File);
        formData.append("file", file);
        formData.append('folder',"Gunjan")

        fetch('/upload' , {
            method : 'post',
            body :formData
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                if(response.status === 200){
                    console.log(TAG + " Upload Success");
                    console.log(response.files);
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

