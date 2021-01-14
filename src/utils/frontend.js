function copyToClipboard(){
    var temp = document.createElement('input')
    const text = window.location.href;

    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
}

export { copyToClipboard }