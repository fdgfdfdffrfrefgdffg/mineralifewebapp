
var addresses = [];

document.getElementById('AutosForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    
    // Convert form data to JSON
    const data = {
        login: formData.get('InLogin'),
        parol: formData.get('InParol'),
    };


    // Send POST request using Fetch API
    fetch('https://mineralifeuz.pythonanywhere.com/api/autolar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Ma\'lumotlar muvaffaqiyatli yuborildi!');
        loadTable()
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ma\'lumotlarni yuborishda xatolik yuz berdi.');
    });
});
function loadTable() {
    var tableBody = $('#addressTable');
    tableBody.empty();

    fetch('https://mineralifeuz.pythonanywhere.com/api/autolar/')
        .then(response => response.json())
        .then(addressesAPI => {
            addresses = addressesAPI
            addressesAPI.forEach(function(address) {
                var row = `<tr>
                    <td>${address.id}</td>
                    <td>${address.login}</td>
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
    $('#OutAutoID').text(address.id);
    $('#OutAutoLogin').text("Login: " + address.login);
    $('#OutAutoPassword').text("Parol: " + address.parol);
}

$(document).on('click', '.selectButton', function() {
    var id = $(this).data('id'); // data-OutOrderID o'rniga data-id
    var address = addresses.find(function(addr) { return addr.id == id; });
    showAddressDetails(address);
});

$('#deleteButton').on('click', async function() {
    var addressName = $('#OutAutoID').text();
    var address = addresses.filter(function(addr) { return addr.id == parseInt(addressName); });
    if (addressName == 'Mashinani tanlashingiz mumkin.') return;

    try {
        const response = await fetch('https://mineralifeuz.pythonanywhere.com/api/autolar/' + address[0].id + "/", {
            method: 'DELETE'
        });

        if (response.ok) {
            // Agar muvaffaqiyatli bo'lsa, mahalliy ro'yxatdan ham o'chirish
            loadTable();
            $('#OutAutoID').text('Buyurtmani tanlashingiz mumkin.');
            $('#OutAutoLogin').text('');
            $('#OutAutoPassword').text('');
        } else {
            console.error('O\'chirishda xatolik yuz berdi:', response.statusText);
        }
    } catch (error) {
        console.error('O\'chirishda xatolik yuz berdi:', error);
    }
});
