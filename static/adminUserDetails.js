(function(){

    const TAG = "Fetch User Details..."

        console.log("Started...")

        fetch('/cognito/users' ,{
            method : 'get',
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
                    console.log(TAG + "Cognito User Fetch Success");
                    console.log(response.files);
                    loadAdminTable(response.files);
                }
                else{
                    console.log(TAG + "Cognito User Fetch Failed");
                }
            }));

    function loadAdminTable(files){
        console.log("Loading Admin Table...");
        const table = $('#adminTable');
        const tblBody = document.createElement("tbody");

        for(let i=0; i<files.Users.length; i++){
            const user = files.Users[i];

            const firstName = user.Attributes[2].Value;
            const lastName = user.Attributes[5].Value;
            const emailAddress = user.Attributes[6].Value;
            const userCreateDate = user.UserCreateDate;
            const userLastModifiedDate = user.UserLastModifiedDate;
            let data = [firstName,lastName,emailAddress,userCreateDate,userLastModifiedDate];

            const row = document.createElement("tr");

            for (let j = 0; j < 6; j++) {
                const cell = document.createElement('td');
                if(j === 5){
                    var a = document.createElement('label');
                    var linkText = document.createTextNode("View");
                    a.appendChild(linkText);
                    a.title = "View";
                    cell.appendChild(a);
                    row.appendChild(cell);
                }else {
                    const val = document.createTextNode(data[j]);
                    cell.appendChild(val);
                    row.appendChild(cell);
                }
            }

            tblBody.appendChild(row);
        }
        table.append(tblBody);

        const tble = document.getElementById('adminTable');
        for (let i = 0; i < tble.rows.length; i++) {
                tble.rows[i].onclick = function () {
                    tableClick(this);

                };
        }
        function tableClick(row) {
            console.log(row);
            const email = row.getElementsByTagName('td')[2].innerHTML;
            const folder = row.getElementsByTagName('td')[0].innerHTML;
            console.log(folder);
            window.localStorage.setItem('selectedUser', email);
            window.localStorage.setItem('selectedUserFirstName' , folder);
            window.location = "http://localhost:3000/adminUserFileDetails.html";
        }
        console.log("Table Updated...");
    }

})();





