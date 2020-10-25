(function(){
    fetch('/retrieve/users' , {
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
                console.log("Retrieve Users Success");
                console.log(response.files);
                loadAdminTable(response.files);
            }
            else{
                console.log("Retrieve Failed");
            }
        }));

    function loadAdminTable(files){
        console.log("Loading Admin Table...");
        const table = $('#adminTable');
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
                    const loc = "https://d3ntls9e0ywkq1.cloudfront.net/"+objectKey;
                    a.href = loc;

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
            const btnText = document.createTextNode("Update");
            btn.appendChild(btnText);
            btn.onClick = updateFiles();

            lastCell.appendChild(btn);
            row.appendChild(lastCell);
            tblBody.appendChild(row);
        }
        table.append(tblBody);
        console.log("Table Updated...");
    }

    function updateFiles(){

    }
})();