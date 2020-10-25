(function(){
    const deleteBtn = $('#deleteBtn');

    deleteBtn.click(deleteFiles)

    function deleteFiles(){
        console.log("Delete File Execution Started...");

        fetch('/delete' , {
            method : 'delete',
            body : '',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => ({
                    status: response.status
                })
            ).then(response => {
                if(response.status === 200){
                    console.log("File Deletion Success");
                }
                else{
                    console.log("File Deletion Failed");
                }
            }));
    }
})();

