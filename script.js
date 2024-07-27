const visitEl = document.getElementById('visit-number')

window.onload = async () => {
    // const response = await fetch('https://server.osudb.online/visit', { mode: 'no-cors' })
    // const response = await fetch('https://server.osudb.online/visit')
    const response = await fetch('http://127.0.0.1:8989/visit')
    const data = await response.json()
    visitEl.innerText = data.count
}