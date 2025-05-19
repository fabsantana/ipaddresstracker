let map = L.map('map', {
    setView: ([51.505, -0.09], 13),
    zoomControl: false
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

const apiKey = import.meta.env.VITE_IPIFY_KEY

const ipAddressEl = document.getElementById('ip-address')
const locationEl = document.getElementById('location')
const timezoneEl = document.getElementById('timezone')
const ispEl = document.getElementById('isp')
const submitBtn = document.getElementById('submit')
const ipInput = document.getElementById('ip-input')

// Regex to validate IPv4 addresses
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;


async function getIP(ip = '') {
    try {
        const url = ip 
        ? `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`
        : `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('error fetching data', error)
    }
}

async function updateMap(ip = '') {
    try {
        const data = await getIP(ip)
        if (data) {
            ipAddressEl.textContent = data.ip
            locationEl.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
            timezoneEl.textContent = `UTC ${data.location.timezone}`
            ispEl.textContent = data.isp
            map.setView([data.location.lat, data.location.lng], 12)
            L.marker([data.location.lat, data.location.lng]).addTo(map);
        }
    }
    catch (error) {
        console.error("error updating the map", error)
    }
}

window.onload = async () => {
    await updateMap()
}

submitBtn.addEventListener('click', async () => {
    const ip = ipInput.value.trim()
    if (ipRegex.test(ip)) {
        await updateMap(ip)
    } else {
        alert("Please enter a valid IP address!")
    }
})