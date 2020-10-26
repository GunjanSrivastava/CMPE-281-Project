(function(){
    const TAG = "Fetch User File Details..."
    console.log("Started...")
    const email = window.localStorage.getItem('selectedEmail');
    const user = window.localStorage.getItem('selectedUser');
    const greeting = $('#user_name');
    greeting.text('User: '+user);

    fetch('/db/retrieve' ,{
        method : 'post',
        body : JSON.stringify({email : email}),
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
                loadUserFileDetails(response.files);
            }
            else{
                console.log("Fetch Failed");
            }
        }));

    function loadUserFileDetails(files){
        console.log("Loading Admin Table...");
        const table = $('#userFilesTable');
        const tblBody = document.createElement("tbody");

        for(let i=0; i<files.length; i++){
            const file = files[i];
            const objectKey = file.objectKey;
            const description = file.description;
            const uploadTime = file.uploadTime;
            const updatedTime = file.updatedTime;
            const objectLocation = file.objectLocation;

            let data = [objectKey,description,uploadTime,updatedTime];
            const row = document.createElement("tr");

            for (let j = 0; j < 6; j++) {
                const cell = document.createElement('td');
                if(j === 4){
                    var a = document.createElement('a');
                    var linkText = document.createTextNode("Download");
                    a.appendChild(linkText);
                    a.title = "Download";
                    const loc = objectLocation;
                    a.href = loc;

                    cell.appendChild(a);
                    row.appendChild(cell);
                }else if(j === 5){
                    var a = document.createElement('label');
                    a.setAttribute('class', 'btn btn-primary');
                    var linkText = document.createTextNode("Delete");
                    a.appendChild(linkText);
                    a.title = "Delete";
                    cell.appendChild(a);
                    row.appendChild(cell);
                } else {
                    const val = document.createTextNode(data[j]);
                    cell.appendChild(val);
                    row.appendChild(cell);
                }
            }
            tblBody.appendChild(row);
        }
        table.append(tblBody);

        const userTable = document.getElementById('userFilesTable');
        for (let i = 0; i < userTable.rows.length; i++) {
            userTable.rows[i].cells[5].onclick = function () {
                const name = userTable.rows[i].getElementsByTagName('td')[0].innerHTML;
                deleteFileClick(this ,name);
            };
        }
        function deleteFileClick(row,name) {
            console.log(row);
            //const name = row.getElementsByTagName('td')[2].innerHTML;
            window.localStorage.setItem('selectedFile', name);
            // deleteFromDB('gunjan.srivastava@sjsu.edu Gunjan/upload.png');
            deleteFiles(name);
        }

        function deleteFiles(name){
            fetch('/delete' ,{
                method : 'delete',
                body : JSON.stringify({folder: email , file : name}),
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
                        console.log("Delete Success");
                        deleteFromDB(email+' ' + name);
                    }
                    else{
                        console.log("Delete Failed");
                    }
                }));
        }

        function deleteFromDB(userId){
            fetch('/db/delete' ,{
                method : 'delete',
                body : JSON.stringify({userId : userId}),
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
                        location.reload();
                    }
                    else{
                        console.log("Delete Failed");
                    }
                }));
        }
    }
})();