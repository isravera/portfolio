"use strict";

// Enable tooltips everywhere
let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Github Calendar - https://github.com/IonicaBizau/github-calendar
new GitHubCalendar("#github-graph", "isravera", { responsive: true });

// Contact Form

const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contactName');
const contactEmail = document.getElementById('contactEmail');
const contactMessage = document.getElementById('contactMessage');
const contactResultContainer = document.getElementById('contactResultContainer');
const contactSendButton = document.getElementById('contactSendButton');

const showMessage = (type, title, message) => `
<div class="alert alert-${type} alert-dismissible fade show" role="alert">
	<h4 class="alert-heading">${title}</h4>
	<p>${message}</p>
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;

const resetContactForm = _ => {

	contactForm.reset();
	contactName.classList.remove('is-valid');
	contactEmail.classList.remove('is-valid');
	contactMessage.classList.remove('is-valid');
}

const checkEmptyInputs = _ => {

	if(contactName.value.length <= 0) {
		toggleInputStatus(contactName, 'danger');
		return false;
	} else {
		toggleInputStatus(contactName, 'success');
	}

	if(contactEmail.value.length <= 0) {
		toggleInputStatus(contactEmail, 'danger');
		return false;
	} else {
		toggleInputStatus(contactEmail, 'success');
	}

	if(contactMessage.value.length <= 0) {
		toggleInputStatus(contactMessage, 'danger');
		return false;
	} else {
		toggleInputStatus(contactMessage, 'success');
	}

	return true;

}

const validateEmail = email => {

	const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	if(email.value.match(format)) {
		return true;
	} else {
		return false;
	}
}

const processContactForm = _ => {

	contactSendButton.disabled = true;

	let sendMessage = false;

	if(checkEmptyInputs()) {

		if(validateEmail(contactEmail)) {
			toggleInputStatus(contactEmail, 'success');
			sendMessage = true;
		} else {
			toggleInputStatus(contactEmail, 'danger');
		}
	}

	if(sendMessage) {

		fetch(`https://zrh-code.com/api/v1/contact.php?subject=portfolio%20contact%20form&name=${contactName.value}&email=${contactEmail.value}&message=${contactMessage.value}`)
			.then(res => res.json())
			.then(data => {

				if(data.status != 200) {

					contactResultContainer.innerHTML = showMessage('danger', data.description, `Error ${data.status}: ${data.message}`);
				} else {

					contactResultContainer.innerHTML = showMessage('success', data.message, 'I will contact you as soon as possible');

					resetContactForm();
				}
				
			});
	}

	contactSendButton.disabled = false;

}

const toggleInputStatus = (input, status) => {

	if(status === 'success') {
		input.classList.remove('is-invalid');
		input.classList.add('is-valid');
	} else {
		input.classList.remove('is-valid');
		input.classList.add('is-invalid');
	}

}

contactSendButton.addEventListener('click', processContactForm);