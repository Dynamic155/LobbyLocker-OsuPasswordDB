const visitEl = document.getElementById('visit-number')

window.onload = async () => {
    const response = await fetch('https://server.osudb.online/visit')
    const data = await response.json()
    visitEl.innerText = data.count
}