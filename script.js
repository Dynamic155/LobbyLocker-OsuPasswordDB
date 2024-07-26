window.onload = () => {
    fetch('http://10.2.72.49:8989/visit')
        .then(response => response.json())
        .then(data => {
            document.getElementById('visit-number').innerText = data.count;
        });
};