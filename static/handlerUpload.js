(function(){
    const fileInput = $('#file-input');
    const uploadBtn = $('#upload-btn');
    const uploadDiv = $('#upload-div');
    const fileDesc = $('#file-desc');
    const fileAlert = $('#file-alert');
    const greeting = $('#user_name');
    const uploadAlert = $('#upload_alert_msg');
    uploadAlert.hide();

    let description;

    greeting.text( 'Welcome '+window.localStorage.getItem('firstName')+',');
    uploadBtn.click(displayFileContainer)
    fileInput.change(uploadHandler)
    // fileInput.click(inputClick)

    function inputClick(){
        this.value = null;
    }
    function displayFileContainer(){
        uploadDiv.visible();
    }

    jQuery.fn.visible = function() {
        return this.css('visibility', 'visible');
    };

    function uploadHandler(){
        fileAlert.hide();
        const TAG = 'HandlerUpload';
        description = fileDesc.val();
        if(description===''){
            fileAlert.html('Provide file description before uploading.');
            fileAlert.show();
            this.value = null;
            return;
        }
        let file = this.files[0];
        let formData = new FormData();
        console.log(file instanceof File);
        formData.append('file', file);
        uploadAlert.html("This might take few seconds...");
        uploadAlert.show();
        fetch('/upload' , {
            method : 'post',
            body :formData
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                uploadAlert.hide();
                if(response.status === 200){
                    console.log(TAG + " Upload Success");
                    console.log(response.files);
                    insertIntoDb(response.files.Bucket,response.files.Key,response.files.Location);
                    //insertIntoDb(response.files.Bucket,response.files.Key);
                }
                else{
                    console.log("Upload Failed");
                }
            }));
        this.value = null;
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
            const updateTime = date+' '+time;
            loc = loc.replace('https://project-cmpe-281.s3.us-west-2.amazonaws.com/' , '');
            loc = 'https://d3ntls9e0ywkq1.cloudfront.net/' + loc;
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
               desc: description
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

