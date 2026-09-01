import * as donationMODULES from './modules/donation/donationMODULES.js'


const searchInput = document.querySelector('#search');
const prioritySelect = document.querySelector('#priority');

const updateDonations = () => {
    donationMODULES.render(searchInput.value, prioritySelect.value);
};



searchInput.addEventListener('input', updateDonations);
prioritySelect.addEventListener('change', updateDonations);

updateDonations();


  

