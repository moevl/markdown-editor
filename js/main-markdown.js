const textarea = document.getElementById('wmd-input-second');
const preview = document.getElementById('wmd-preview-second');
document.addEventListener('paste', handlePasteImage);
// textarea.addEventListener('input', updatePreview)
async function handlePasteImage() {

    let myclip = await navigator.clipboard.read();


    let blob = await myclip[0].getType('image/png');

    let buff = await blob.arrayBuffer();
    let int8 = new Uint8Array(buff);

    let binString = '';
    for (num of int8) {
        binString += String.fromCharCode(num);
    }
    let base64 = btoa(binString);
    let uploaded = await uploadToHost(base64);
    insertAtPointer(`![](${uploaded})`);
    updatePreview();

}
function updatePreview() {
    preview.innerHTML = convertToHTML(textarea.value);
}

function insertAtPointer(image) {
    textarea.value = textarea.value.substring(0, textarea.selectionStart) + image + textarea.value.substring(textarea.selectionStart, textarea.value.length)
}
async function uploadToHost(image) {
    const url = "https://api.imgbb.com/1/upload";
    const params = {
        key: '9011b08f2b9acbf945bad76d88374780'
    };
    let form = new FormData();
    form.append('image', image);

    const res = await fetch(url + '?' + new URLSearchParams(params), {
        method: 'POST',
        body: form
    });
    const resObj = await res.json();
    const uploadedUrl = resObj.data.url;
    // console.log(uploadedUrl);
    return uploadedUrl;

}
function convertToHTML(markdown) {
    let preview = markdown.replaceAll(/\!\[\]\((.+?)\)/g, '<img src=' + '$1' + '/>').replaceAll();
    // console.log(preview);
    return preview;
}


(function () {


    var converter2 = new Markdown.Converter();


    converter2.hooks.chain("plainLinkText", function (url) {
        return url.replace(/^https?:\/\//, "");
    });

    var help = function () { alert("Do you need help?"); }
    var options = {
        helpButton: { handler: help },
        strings: { quoteexample: "whatever you're quoting, put it right here" }
    };
    var editor2 = new Markdown.Editor(converter2, "-second", options);

    editor2.run();
})();