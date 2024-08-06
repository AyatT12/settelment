const image = document.getElementById('hover-image-extension2');
const dropdown = document.getElementById('dropdown-content-extension2');

image.addEventListener('click', function () {
	if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        net_contract_dropdown.style.display = 'none';

    }
});

const net_contract_Icon = document.getElementById('net_contract_Icon');
const net_contract_dropdown = document.getElementById('net_contract_dropdown');

net_contract_Icon.addEventListener('click', function () {
	if (net_contract_dropdown.style.display === 'block') {
        net_contract_dropdown.style.display = 'none';
    } else {
        net_contract_dropdown.style.display = 'block';
        dropdown.style.display = 'none';

    }
});
