window.onload = () => {
    fetch('https://server.osudb.online/visit')
        .then(response => response.json())
        .then(data => {
            document.getElementById('visit-number').innerText = data.count;
        });
};