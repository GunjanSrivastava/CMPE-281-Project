(function(){
    const downloadBtn = $('#downloadLink');
    const dynamic_link = 'https://project-cmpe-281.s3-us-west-2.amazonaws.com/Gunjan/testing.txt';

    downloadBtn.attr("href",dynamic_link);

    //downloadBtn.click(downloadFile)

    function downloadFile(){
        console.log("Initiated Downloading...");
        //
        // var link = document.createElement("a");
        // link.setAttribute('download', name);
        // link.href = "https://project-cmpe-281.s3-us-west-2.amazonaws.com/Gunjan/testing.txt";
        // document.body.appendChild(link);
        // link.click();
        // link.remove();


    }
})();

