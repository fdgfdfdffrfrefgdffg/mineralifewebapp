
var addresses = [];

document.getElementById('CustomerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    if (marker) {
        var latlng = marker.getLatLng();
    } else {
        alert("Iltimos, xaritada nuqtani tanlang.");
        return; // Exit the function if no marker is selected
    }
    // Convert form data to JSON
    const data = {
        customer_name: formData.get('InCustomerName'),
        longitute: latlng.lng, // Corrected spelling
        latitute: latlng.lat, // Corrected spelling
        telefon: formData.get('InTelefon'),
    };

    console.log(data); // Log data for debugging

    // Send POST request using Fetch API
    fetch('https://mineralifeuz.pythonanywhere.com/api/customers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Ma\'lumotlar muvaffaqiyatli yuborildi!');
        addresses.push(data);
        loadTable()
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ma\'lumotlarni yuborishda xatolik yuz berdi.');
    });
});




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
});

function loadTable() {
    var tableBody = $('#addressTable');
    tableBody.empty();

    fetch('https://mineralifeuz.pythonanywhere.com/api/customers/')
        .then(response => response.json())
        .then(addressesAPI => {
            addresses = addressesAPI
            addressesAPI.forEach(function(address) {
                var row = `<tr>
                    <td>${address.id}</td>
                    <td>${address.customer_name}</td>
                    <td><button class="btn btn-primary selectButton" data-id="${address.id}">Tanlash</button></td>
                </tr>`;
                tableBody.append(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
        });
}

// Sahifa yuklanganda jadvalni yuklash
$(document).ready(function() {
    loadTable();
    console.log(addresses)

});


function showAddressDetails(address) {
    console.log(address)
    $('#OutCustomerID').text(address.id);
    $('#OutCustomerName').text("Mijoz: " + address.customer_name);
    $('#OutCustomerTel').text("Telefon: " + address.telefon);
    if (marker) {
        map2.removeLayer(marker);
    }
    marker = L.marker([address.latitute, address.longitute]).addTo(map2);
    map2.setView([address.latitute, address.longitute], 13);
}

$(document).on('click', '.selectButton', function() {
    var id = $(this).data('id'); // data-OutOrderID o'rniga data-id
    var address = addresses.find(function(addr) { return addr.id == id; });
    showAddressDetails(address);
});

$('#deleteButton').on('click', async function() {
    var addressName = $('#OutCustomerID').text();
    if (addressName == 'Buyurtmani tanlashingiz mumkin.') return;

    addresses = addresses.filter(function(addr) { return addr.id !== parseInt(addressName); });

    try {
        const response = await fetch('https://mineralifeuz.pythonanywhere.com/api/customers/' + addressName + "/", {
            method: 'DELETE'
        });

        if (response.ok) {
            // Agar muvaffaqiyatli bo'lsa, mahalliy ro'yxatdan ham o'chirish
            loadTable();
            $('#OutCustomerID').text('Buyurtmani tanlashingiz mumkin.');
            $('#OutCustomerName').text('');
            $('#OutCustomerTel').text('');
            if (marker) {
                map2.removeLayer(marker);
            }
        } else {
            console.error('O\'chirishda xatolik yuz berdi:', response.statusText);
        }
    } catch (error) {
        console.error('O\'chirishda xatolik yuz berdi:', error);
    }
});
