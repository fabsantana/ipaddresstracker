let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const apiKey = import.meta.env.VITE_IPIFY_KEY

const ipAddressEl = document.getElementById('ip-address')
const locationEl = document.getElementById('location')
const timezoneEl = document.getElementById('timezone')
const ispEl = document.getElementById('isp')

async function getIP() {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('error fetching data', error)
    }
}

window.onload = async () => {
    try {
        const data = await getIP()
        if (data) {
            ipAddressEl.textContent = data.ip
            locationEl.textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`
            timezoneEl.textContent = data.location.timezone
            ispEl.textContent = data.isp
            map.setView([data.location.lat, data.location.lng], 12)
        }
    }
    catch (error) {
        console.error("error updating the DOM")
    }
}