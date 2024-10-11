var map1 = L.map('map1').setView([41.3111, 69.2406], 10); // Toshkent viloyati koordinatalari

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map1);

var marker;
map1.on('click', function(e) {
    if (marker) {
        map1.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map1);
    alert("Tanlangan nuqta: " + e.latlng.lat + ", " + e.latlng.lng);
});

$('#locationForm').on('submit', function(e) {
    e.preventDefault();
    var addressName = $('#addressName').val();
    var ownerName = $('#ownerName').val();
    if (marker) {
        var latlng = marker.getLatLng();
        alert("Manzil nomi: " + addressName + "\nKimning manzili: " + ownerName + "\nKoordinatalar: " + latlng.lat + ", " + latlng.lng);
        // Bu yerda ma'lumotlarni saqlash kodini qo'shishingiz mumkin
    } else {
        alert("Iltimos, xaritada nuqtani tanlang.");
    }
});


var map2 = L.map('map2').setView([41.3111, 69.2406], 10); // Toshkent viloyati koordinatalari

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map2);

var marker;
map2.on('click', function(e) {
    if (marker) {
        map2.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map2);
    alert("Tanlangan nuqta: " + e.latlng.lat + ", " + e.latlng.lng);
});

var addresses = [
    { id: 1, name: "Manzil 1", owner: "Kimdir 1", lat: 41.3111, lng: 69.2406 },
    { id: 2, name: "Manzil 2", owner: "Kimdir 2", lat: 41.3200, lng: 69.2500 },

    { id: 1, name: "Manzil 1", owner: "Kimdir 1", lat: 41.3111, lng: 69.2406 },
    { id: 2, name: "Manzil 2", owner: "Kimdir 2", lat: 41.3200, lng: 69.2500 },

    { id: 1, name: "Manzil 1", owner: "Kimdir 1", lat: 41.3111, lng: 69.2406 },
    { id: 2, name: "Manzil 2", owner: "Kimdir 2", lat: 41.3200, lng: 69.2500 },

    { id: 1, name: "Manzil 1", owner: "Kimdir 1", lat: 41.3111, lng: 69.2406 },
    { id: 2, name: "Manzil 2", owner: "Kimdir 2", lat: 41.3200, lng: 69.2500 },

    { id: 1, name: "Manzil 1", owner: "Kimdir 1", lat: 41.3111, lng: 69.2406 },
    { id: 2, name: "Manzil 2", owner: "Kimdir 2", lat: 41.3200, lng: 69.2500 },
];
loadTable()
function loadTable() {
    var tableBody = $('#addressTable');
    tableBody.empty();
    addresses.forEach(function(address) {
        var row = `<tr>
            <td>${address.name}</td>
            <td>${address.owner}</td>
            <td><button class="btn btn-primary selectButton" data-id="${address.id}">Tanlash</button></td>
        </tr>`;
        tableBody.append(row);
    });
}

function showAddressDetails(address) {
    $('#addressTitle').text(address.name);
    $('#addressOwner').text(address.owner);
    if (marker) {
        map2.removeLayer(marker);
    }
    marker = L.marker([address.lat, address.lng]).addTo(map2);
    map2.setView([address.lat, address.lng], 13);
}

$(document).on('click', '.selectButton', function() {
    var id = $(this).data('id');
    var address = addresses.find(function(addr) { return addr.id == id; });
    showAddressDetails(address);
});

$('#deleteButton').on('click', function() {
    var addressName = $('#addressTitle').text();
    addresses = addresses.filter(function(addr) { return addr.name !== addressName; });
    loadTable();
    $('#addressTitle').text('Manzil nomi');
    $('#addressOwner').text('Kimning manzili');
    if (marker) {
        map2.removeLayer(marker);
    }
});
