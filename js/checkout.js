document.addEventListener('DOMContentLoaded', function () {
    const addNewAddressButton = document.querySelector('.add-new-btn');
    const addressInput = document.querySelector('.address-input');
    const closeAddressInputButton = document.querySelector('.close-address-input');
    const addressItems = document.querySelectorAll('.address-item');

    if (addNewAddressButton && addressInput && closeAddressInputButton && addressItems.length > 0) {
        addressInput.style.display = 'none'; // Initially hide the address input

        addNewAddressButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default button behavior
            addressInput.querySelector('h3').textContent = 'Add New Address'; // Reset header to "Add New Address"
            addressInput.style.display = 'flex'; // Show the address input
        });

        closeAddressInputButton.addEventListener('click', function () {
            addressInput.style.display = 'none'; // Hide the address input
        });

        addressItems.forEach(item => {
            const editButton = item.querySelector('.button-groups img[alt="edit-icon"]');

            if (editButton) {
                editButton.addEventListener('click', function () {
                    // Get address details from the clicked address item
                    const addressName = item.querySelector('.address-name').textContent;
                    const addressLine = item.querySelector('.address-line').textContent;
                    const addressPhone = item.querySelector('.address-phone').textContent;

                    // Populate the address input fields with the retrieved data
                    document.querySelector('#name').value = addressName;
                    document.querySelector('#phone').value = addressPhone.replace('Phone: ', ''); // Remove "Phone: " prefix
                    document.querySelector('#address').value = addressLine;

                    addressInput.querySelector('h3').textContent = 'Edit Address'; // Change header to "Edit Address"
                    addressInput.style.display = 'flex'; // Show the address input
                });
            }
        });
    }
});