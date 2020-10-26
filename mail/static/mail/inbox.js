document.addEventListener('DOMContentLoaded', function () {

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

	//End of first listener
	});		

function compose_email() {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'block';
	document.querySelector('#mail-view').style.display = 'none';
	

	// Clear out composition fields
	document.querySelector('#compose-recipients').value = '';
	document.querySelector('#compose-subject').value = '';
	document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {
	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';
	document.querySelector('#mail-view').style.display = 'none';

	// Show the mailbox name
	document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
	fetch(`/emails/${mailbox}`)
		.then(response => response.json())
		.then(emails => {
			// Print emails
			console.log(emails);
			emails.forEach(add_emails);
		});
}

function add_emails(object) {
	const mail = document.createElement('div');
	mail.id = 'mail'
	// Create data-id with mail id
	mail.dataset.mailid = object.id
	mail.onclick = function () {
		fetch(`/emails/${this.dataset.mailid}`)
		.then(response => response.json())
		.then(email => {
			// Print email
			console.log(email);
			document.querySelector('#emails-view').style.display = 'none';
			document.querySelector('#compose-view').style.display = 'none';
			document.querySelector('#mail-view').style.display = 'block';
			// ... do something else with email ...
		});
	};
	
	if (object.read) {
		mail.className = 'mail-read'
	} else {
		mail.className = 'mail-unread'
	}
	mail.innerHTML =
	`<span>${object.sender}</span> 
	<span>${object.subject}</span>
	<span class='right'>${object.timestamp}</span>`
	document.querySelector('#emails-view').append(mail)
	
}

function sent_email() {
	fetch('/emails', {
			method: 'POST',
			body: JSON.stringify({
				recipients: document.querySelector('#compose-recipients').value,
				subject: document.querySelector('#compose-subject').value,
				body: document.querySelector('#compose-body').value
			})
		})
		.then(response => response.json())
		.then(result => {
			// Print result
			console.log(result);
		});
}

function load_email(id) {
	fetch(`/emails/${id}`)
		.then(response => response.json())
		.then(email => {
			// Print email
			console.log(email);

			// ... do something else with email ...
		});
}
