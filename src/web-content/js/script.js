function showLeftBar() {
	updateTokenButton();
	$('#leftbar').css({ left: '0px' });
	$('#main').css({ left: '200px' });
}

function hideLeftBar() {
	$('#leftbar').css({ left: '-200px' });
	$('#main').css({ left: '0px' });
}

async function loadPage(name) {
	const html = await $.get(`/pages/${name}.html`);
	$('#main').html(html);
}

function report(message) {
	alert(message);
}

let login = null;

function getData(...names) {
	const data = {};
	$('[name]').filter(':visible').each(function(){
		const field = $(this);
		const name = field.attr('name');
		data[name] = field.val();
	});
	return data;
}

function updateTokenButton() {
	if (login.hasOtp) {
		$('#delotp').show();
		$('#addotp').hide();
	} else {
		$('#delotp').hide();
		$('#addotp').show();
	}
}

async function loadWelcome() {
	await loadPage('welcome');
	$('#username').text(login.name);
}

$(document).ready(async () => {

	login = await API.checkLogin();
	if (!login) {
		await loadPage('login');
	} else {
		showLeftBar();
		await loadWelcome();
	}

	$('#main').on('click', '#login input[type="button"]', async () => {
		const data = getData();
		if (data.token) {
			data.token = data.token.replace(/\s/g, '');
		}
		try {
			login = await API.login(data);
			showLeftBar();
			await loadWelcome();
		} catch(error) {
			if (error instanceof NotFound) {
				report('E-mail inválido');
			} else if (error instanceof Unauthorized) {
				if (data.token) {
					report('Senha e/ou token incorretos');
				} else {
					report('Senha incorreta');
				}
			} else if (error instanceof BadRequest) {
				$('[name="token"]').closest('.form-item').show();
			}
		}
	});

	$('#main').on('click', '[value="Ok"]', async () => {
		await loadWelcome();
	});

	$('#addotp').on('click', async () => {
		await API.createOtpStep();
		login.hasOtp = true;
		updateTokenButton();
		await loadPage('qrcode');
	});

	$('#delotp').on('click', async () => {
		await API.removeOtpStep();
		login.hasOtp = false;
		updateTokenButton();
	});

	$('#logout').on('click', async () => {
		await API.logout();
		login = null;
		hideLeftBar();
		loadPage('login');
	});

});
