document.addEventListener('DOMContentLoaded', function() {
    let selectedRow;

    // Fetch data and populate table
    fetch('https://mineralifeuz.pythonanywhere.com/api/objects_count/')
        .then(response => response.json())
        .then(data => {
            for (let key in data) {
            document.getElementById(key).innerText = data[key] + " ta";
        }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('orderTable').innerHTML = '<p>Buyurtma yo\'q</p>';
        });
});
