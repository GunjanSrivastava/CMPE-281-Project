(function(){
    fetch('/db/retrieve' , {
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
                console.log("Retrieve Success");
                console.log(response.files);
                loadTable(response.files);
            }
            else{
                console.log("Retrieve Failed");
            }
        }));
    let description;

    function loadTable(files){
        console.log("Updating Table...");
        const table = $('#listFilesTable');
        const tblBody = document.createElement("tbody");

        for(let i=0; i<files.length; i++){
            const file = files[i];
            const userId = file.userId;
            const firstName = file.firstName;
            const lastName = file.lastName;
            const emailAddress = file.emailAddress;
            const bucketName = file.bucketName;
            const objectKey = file.objectKey;
            const objectLocation = file.objectLocation;
            const uploadTime = file.uploadTime;
            const updatedTime = file.updatedTime;
            const description = file.description;
            let data = [objectKey,uploadTime,updatedTime,description,objectLocation];
            const row = document.createElement("tr");

            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('td');
                if(j === 4){
                    var a = document.createElement('a');
                    var linkText = document.createTextNode("Link");
                    a.appendChild(linkText);
                    a.title = "Link";
                    //const loc = "https://d3ntls9e0ywkq1.cloudfront.net/"+objectKey;
                    a.href = objectLocation;

                    cell.appendChild(a);
                    //cell.href = objectLocation;
                    row.appendChild(cell);
                }else {
                    const val = document.createTextNode(data[j]);
                    cell.appendChild(val);
                    row.appendChild(cell);
                }
            }
            const lastCell = document.createElement('td');
            const btn = document.createElement('button');
            const label = document.createElement('label');
            label.setAttribute('class', 'btn btn-primary');
            label.setAttribute('innerHTML', 'Update');

            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('class', 'file-update');
            input.onchange = function(){
                updateFiles(file, this);
            };

            // container.innerHTML = "<input id=\"fileInput\" onchange=\"updateFile()\" type=\"file\" style=\"display:none;\" />";
            btn.setAttribute('class', 'btn btn-primary');
            btn.innerHTML = 'Update';
            const  btnText= document.createTextNode("Update");
            // label.appendChild(btn);
            label.appendChild(btnText);
            label.appendChild(input);
            lastCell.appendChild(label);
            // lastCell.appendChild()
            row.appendChild(lastCell);
            tblBody.appendChild(row);
            btn.onclick = function(){
                updateFiles(file);
            };
        }
        table.append(tblBody);
        // const fileInput = $('.file-update');
        // fileInput.change(updateFile(file));
        console.log("Table Updated...");
    }

    function updateFiles(originalFile,obj){
        console.log(obj);
        console.log(originalFile);
        let file = obj.files[0];
        if(originalFile.objectKey!=file.name){
            console.log("not same file");
            obj.value=null;
            return;
        }
        let formData = new FormData();
        formData.append('file', file);

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
                    console.log(response.files);
                    updateIntoDb(response.files.Bucket,response.files.Key,response.files.Location);
                }
                else{
                    console.log("update Failed");
                }
            }));
        obj.value = null;
    }

    function updateIntoDb(bucket,key,loc){
        console.log("Executing Insert Into DB...");
        key = key.substring(key.indexOf('/')+1);
        const fName = window.localStorage.getItem('firstName');
        const lName = window.localStorage.getItem('lastName');
        const email = window.localStorage.getItem('email');
        const userId = email + ' ' +  key;
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const updateTime = date+' '+time;
        // const desc = "This is the latest version";

        const newUser =  {
            userId : userId,
            updateTime : updateTime,
        }

        fetch('/db/update' , {
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

    // function updateFiles(file){
    //     console.log(file);
    // }
})();