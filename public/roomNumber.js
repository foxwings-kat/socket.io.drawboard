var roomNumber;
		function generateRandomString(length) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let randomString = '';

			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * characters.length);
				randomString += characters.charAt(randomIndex);
			}

			return randomString;
		}

		const userTag = generateRandomString(6);
		var socket = io();

		var joinNewRoomForm = document.getElementById('joinNewRoomForm');
		var joinNewRoomInput = document.getElementById('joinNewRoomInput');
		var creatNewRoomBTN = document.getElementById('creatNewRoomBTN');
		var input = document.getElementById('input');

		var form = document.getElementById('form');
		var messages = document.getElementById('messages');


		joinNewRoomForm.addEventListener('submit', function (e) {
			e.preventDefault();
			if (joinNewRoomInput.value) {
				socket.emit('leave_room', roomNumber);
				roomNumber = joinNewRoomInput.value;
				socket.emit('join_room', roomNumber);
				chatFrame.contentWindow.postMessage({ roomNumber: roomNumber}, '*');
				boardFrame.contentWindow.postMessage({ roomNumber: roomNumber}, '*');
			}
		});

		creatNewRoomBTN.addEventListener('click', function (e) {
			socket.emit('leave_room', roomNumber);
			roomNumber = generateRandomString(6);
			joinNewRoomInput.value = roomNumber;
			socket.emit('join_room', roomNumber);
			chatFrame.contentWindow.postMessage({ roomNumber: roomNumber}, '*');
			boardFrame.contentWindow.postMessage({ roomNumber: roomNumber}, '*');
		});