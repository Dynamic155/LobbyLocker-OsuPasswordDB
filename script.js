window.onload = () => {
    fetch('https://server.osudb.online/visit', { mode: 'no-cors' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('visit-number').innerText = data.count;
        });
};