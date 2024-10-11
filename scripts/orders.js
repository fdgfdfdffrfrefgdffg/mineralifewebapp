
var addresses = [];

document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    if (marker1) {
        var latlng = marker1.getLatLng();
    } else {
        alert("Iltimos, xaritada nuqtani tanlang.");
        return; // Exit the function if no marker is selected
    }
    console.log(latlng)
    // Convert form data to JSON
    const data = {
        customer_id: parseInt(formData.get('ownerID')),
        fio: formData.get('orderName'),
        product: formData.get('InProductName'),
        suv_miqdori: formData.get('InProductCount'),
        viloyat: formData.get('InViloyat'),
        tuman: formData.get('InTuman'),
        longitute: latlng.lng, // Corrected spelling
        latitute: latlng.lat, // Corrected spelling
        sana: formData.get('InSana'),
        vaqt: formData.get('InVaqt'),
        dastavka: formData.get('InDastavka') === 'on', // Convert checkbox value to boolean
        eslatma: formData.get('InNote'),
        auto: formData.get('InAuto'),
        status: true // Assuming this is a static value
    };

    console.log(data); // Log data for debugging

    // Send POST request using Fetch API
    fetch('https://mineralifeuz.pythonanywhere.com/api/orders/', {
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

var marker1;
map1.on('click', function(e) {
    if (marker1) {
        map1.removeLayer(marker1);
    }
    marker1 = L.marker(e.latlng).addTo(map1);
});


$('#searchButton').on('click', function() {
    var longitute = $('#InLongitute').val();
    var langitute = $('#InLangitute').val();
    longitute = parseFloat(longitute)
    langitute = parseFloat(langitute)
    // Formadagi qiymatlarni konsolga chop etish
    console.log('Longitute:', longitute);
    console.log('Langitute:', langitute);

    if (marker1) {
        map1.removeLayer(marker1);
    }
    marker1 = L.marker([langitute, longitute]).addTo(map1);
    map1.setView([langitute, longitute], 13);
    
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

function loadTable() {
    var tableBody = $('#addressTable');
    tableBody.empty();

    fetch('https://mineralifeuz.pythonanywhere.com/api/orders/')
        .then(response => response.json())
        .then(addressesAPI => {
            addresses = addressesAPI
            addressesAPI.forEach(function(address) {
                var row = `<tr>
                    <td>${address.fio}</td>
                    <td>${address.customer_id}</td>
                    <td>${address.product}</td>
                    <td>${address.suv_miqdori}</td>
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
});


function showAddressDetails(address) {
    $('#OutOrderID').text(address.id);
    $('#OutOrderFio').text("Fio: " + address.owner);
    $('#OutOrderCustomer').text("Mijoz: " + address.customer_id);
    $('#OutOrderProduct').text("Mahsulot: " + address.product);
    $('#OutOrderCount').text("Soni: " + address.suv_miqdori);
    $('#OutOrderViloyat').text("Viloyat: " + address.viloyat);
    $('#OutOrderTuman').text("Tuman: " + address.tuman);
    $('#OutOrderSana').text("Sana: " + address.sana);
    $('#OutOrderVaqt').text("Vaqt: " + address.vaqt);
    $('#OutOrderEslatma').text("Eslatma: " + address.eslatma);
    $('#OutOrderAuto').text("Auto: " + address.auto);
    $('#OutOrderDastavka').text("Dastavka: " + address.dastavka);
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


$('#deleteButton').on('click', function() {
    var addressName = $('#OutOrderID').text();
    var address = addresses.filter(function(addr) { return addr.id == parseInt(addressName); });
    if (addressName == 'Buyurtmani tanlashingiz mumkin.') return;

    fetch('https://mineralifeuz.pythonanywhere.com/api/orders/' + address[0].id + "/", {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('O\'chirishda xatolik yuz berdi: ' + response.statusText);
        }
        // Agar muvaffaqiyatli bo'lsa, mahalliy ro'yxatdan ham o'chirish
        loadTable();
        $('#OutOrderID').text('Buyurtmani tanlashingiz mumkin.');
        $('#OutOrderFio').text('');
        $('#OutOrderCustomer').text('');
        $('#OutOrderProduct').text('');
        $('#OutOrderCount').text('');
        $('#OutOrderViloyat').text('');
        $('#OutOrderTuman').text('');
        $('#OutOrderSana').text('');
        $('#OutOrderVaqt').text('');
        $('#OutOrderEslatma').text('');
        $('#OutOrderAuto').text('');
        $('#OutOrderDastavka').text('');
        if (marker) {
            map2.removeLayer(marker);
        }
    })
    .catch(error => {
        console.error('O\'chirishda xatolik yuz berdi:', error);
    });
});
