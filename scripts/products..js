
var products = [];

document.getElementById('ProductsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    
    // Convert form data to JSON
    const data = {
        fio: formData.get('InFio'),
        pul: formData.get('InPul'),
        kod: formData.get('InKod'),
        asosiy_mahsulot: formData.get('InAsosiy_mahsulot'),
        eslatma: formData.get('InEslatma'),
    };


    // Send POST request using Fetch API
    fetch('https://mineralifeuz.pythonanywhere.com/api/products/', {
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
    var tableBody = $('#productTable');
    tableBody.empty();

    fetch('https://mineralifeuz.pythonanywhere.com/api/products/')
        .then(response => response.json())
        .then(productsAPI => {
            products = productsAPI
            productsAPI.forEach(function(product) {
                var row = `<tr>
                    <td>${product.id}</td>
                    <td>${product.fio}</td>
                    <td><button class="btn btn-primary selectButton" data-id="${product.id}">Tanlash</button></td>
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

function showProductDetails(product) {
    $('#OutProductID').text(product.id);
    $('#OutProductFio').text("Fio: " + product.fio);
    $('#OutProductPul').text("Pul: " + product.pul);
    $('#OutProductKod').text("Kod: " + product.kod);
    $('#OutProductAsosiyMahsulot').text("Asosiy mahsulot: " + (product.asosiy_mahsulot ? "Ha" : "Yo'q"));
    $('#OutProductEslatma').text("Eslatma: " + product.eslatma);
}

$(document).on('click', '.selectButton', function() {
    var id = $(this).data('id'); // data-OutOrderID o'rniga data-id
    var product = products.find(function(prod) { return prod.id == id; });
    showProductDetails(product);
});

$('#deleteButton').on('click', async function() {
    var productName = $('#OutProductID').text();
    var product = products.filter(function(prod) { return prod.id == parseInt(productName); });
    if (productName == 'Mahsulotni tanlashingiz mumkin.') return;

    try {
        const response = await fetch('https://mineralifeuz.pythonanywhere.com/api/products/' + product[0].id + "/", {
            method: 'DELETE'
        });

        if (response.ok) {
            // Agar muvaffaqiyatli bo'lsa, mahalliy ro'yxatdan ham o'chirish
            loadTable();
            $('#OutProductID').text('Mahsulotni tanlashingiz mumkin.');
            $('#OutProductFio').text('');
            $('#OutProductPul').text('');
            $('#OutProductKod').text('');
            $('#OutProductAsosiyMahsulot').text('');
            $('#OutProductEslatma').text('');
        } else {
            console.error('O\'chirishda xatolik yuz berdi:', response.statusText);
        }
    } catch (error) {
        console.error('O\'chirishda xatolik yuz berdi:', error);
    }
});
