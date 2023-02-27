// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyB-vGEOyySC4JMYdtG1Ret4pbiZLmhknLs",
	authDomain: "jeanycar-25a07.firebaseapp.com",
	databaseURL: "https://jeanycar-25a07-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "jeanycar-25a07",
	storageBucket: "jeanycar-25a07.appspot.com",
	messagingSenderId: "469828085729",
	appId: "1:469828085729:web:4bc30a96b8e227f0c9d4a0",

};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database

var items = 10;
var database = firebase.database();

// Get DOM elements
var showFormButton = document.getElementById('show-form-button');

var moreButton = document.getElementById('more-button');

var notif = document.getElementById('header_notify');

var myForm = document.getElementById('postLink');
var myContent = document.getElementById('column1');

var myModal = document.getElementById('showmodal');
var myModal_user = document.getElementById('m_username');
var myModal_vistor = document.getElementById('m_visitor');
var myModal_link = document.getElementById('m_link');

var myModal_close = document.getElementById('m_close');
var myModal_delete = document.getElementById('m_delete');
var myModal_delete_id = document.getElementById('delete_id');

var saveButton = document.getElementById('save-button');
var cancelButton = document.getElementById('cancel-button');

var titleInput = document.getElementById('title');
var quoteTextarea = document.getElementById('quote');
var authorInput = document.getElementById('author');
var quoteTableBody = document.getElementById('quote-table-body');

var postFrom = document.getElementById('addst');


let inputChanged = false;

// Show form when the "Show Form" button is clicked
showFormButton.addEventListener('click', function() {
	showFormButton.style.display = 'none';
	myContent.style.display = 'none';

	myForm.style.display = 'block';
	notif.style.display = "none";
});

// Hide form when the "Cancel" button is clicked
cancelButton.addEventListener('click', function() {
	inputChanged = false;
	myForm.style.display = 'none';
	myContent.style.display = 'block';
	showFormButton.style.display = 'block';
});

// Save form data to Firebase Realtime Database when the "Save" button is clicked
// Save form data to Firebase Realtime Database when the "Save" button is clicked

saveButton.addEventListener('click', function(event) {
	var title = titleInput.value;
	var quote = quoteTextarea.value;
	var author = authorInput.value;
	saveData(title, quote, author);
});




loadDatabase(items);

// Clear form inputs and selected row
function clearForm() {
	document.getElementById('title').value = '';
	document.getElementById('quote').value = '';
	document.getElementById('author').value = '';
	selectedRow = null;
}


function getTimeString(timestamp) {
	var now = new Date();
	var diff = now.getTime() / 1000 - timestamp / 1000; // Convert Firebase Timestamp to Unix timestamp in seconds


	if (diff < 100) {
		return "New";
	} else if (diff < 3600) {
		var minutes = Math.floor(diff / 60);
		return minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
	} else if (diff < 86400) {
		var hours = Math.floor(diff / 3600);
		return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
	} else if (diff < 2592000) {
		var days = Math.floor(diff / 86400);
		if (days == 1) {
			return "Yesterday";
		} else if (days < 30) {
			return days + " day" + (days == 1 ? "" : "s") + " ago";
		} else {
			var months = Math.floor(days / 30);
			return months + " month" + (months == 1 ? "" : "s") + " ago";
		}
	} else if (diff < 15778476000) { // 6 months in seconds
		var date = new Date(timestamp.seconds * 1000);
		var options = {
			month: 'long',
			day: 'numeric'
		};
		return date.toLocaleDateString(undefined, options);
	} else {
		var date = new Date(timestamp.seconds * 1000);
		return date.toLocaleString();
	}
}

function openLink() {
	window.open(myModal_link.innerHTML);
	//document.getElementById("sup").value = eval(upvote) + eval(1);
	//document.forms["frm2"].submit();

}

titleInput.addEventListener('input', function() {
	if (titleInput === '') {
		inputChanged = false;
	} else {
		inputChanged = true;
	}
});

window.addEventListener('beforeunload', function(e) {
	if (inputChanged) {
		e.preventDefault();
		e.returnValue = '';
	}
});


moreButton.addEventListener('click', function() {
	items += 5;
	loadDatabase(items);

});

function loadDatabase(itemCount) {
	database.ref('quotes').orderByChild('timestamp').limitToLast(itemCount).on('value', function(snapshot) {
		// Clear existing table rows
		quoteTableBody.innerHTML = '';
		// Generate new table rows in reverse order
		var reversedData = [];
		snapshot.forEach(function(childSnapshot) {
			reversedData.unshift(childSnapshot.val());
		});
		reversedData.forEach(function(childData) {

			let modAuthor = "";

			if ((getTimeString(childData.timestamp)) == "New") {
				modAuthor = "<span style='color:#ff0000'>*</span>" + childData.author;
			} else {
				modAuthor = childData.author;
			}

			let timestamps = (childData.timestamp);



			let myTitle = childData.title;
			let myQuote = childData.quote;
			let myAuthor = modAuthor;
			let myTime = getTimeString(childData.timestamp);

			var ttd = document.createElement('td');
			//rrow.classList.add('quote-row');

			var rrow = document.createElement('tr');
			//rrow.classList.add('quote-row');

			var row = document.createElement('div');
			row.classList.add('quote-row');


			//////////////////////////////////////////////////////////

			var quoteEl = document.createElement('span');
			quoteEl.innerHTML =
				"<span style='color:#ed4c2b;'><strong>" + myAuthor +
				"</strong></span><br><em style='color:#008ba3;'><small>" + myTitle +
				"</em></small><br><br><small>" + myQuote +
				"<br></small><br><small><small style='color:#808080;'>" + myTime;

			/////////////////////////////////////////////////////////

			row.appendChild(quoteEl);
			ttd.appendChild(row);
			rrow.appendChild(ttd);
			quoteTableBody.appendChild(rrow);

			// Add event listener to delete quote on row click
			row.addEventListener('click', () => {

				var clickcount = false;

				myModal.style.display = 'block';

				myModal_user.innerHTML = myAuthor;
				myModal_link.innerHTML = "<em style='color:#008ba3;'><small>" + myTitle + "</em>";
				myModal_vistor.innerHTML = '0 Visitors';

				//myModal_delete_id.innerHTML = childData.timestamp;

				if ((getTimeString(childData.timestamp)) == "New") {
					myModal_delete.style.display = 'block';
				} else {
					myModal_delete.style.display = 'none';
				}


				m_close.addEventListener('click', function() {
					myModal_delete.innerHTML = 'DELETE';
					myModal.style.display = 'none';
					clickcount = false;
				});

				myModal_delete.addEventListener('click', function() {
					if (clickcount == false) {
						myModal_delete.innerHTML = '&#x2713;CONFIRM DELETE';
						clickcount = true;
					} else {
						database.ref('quotes').orderByChild('timestamp').equalTo(childData.timestamp).once('value', function(snapshot) {
							snapshot.forEach(function(childSnapshot) {
								childSnapshot.ref.remove(function(error) {
									if (error) {
										console.error("Failed to delete quote:", error);
									} else {
										notif.style.display = "block";
										notif.innerHTML = "Link deleted successfully!";
										myModal_delete.innerHTML = 'DELETE';
										myModal.style.display = 'none';
										clickcount = false;
									}
								});
								return;
							});
						});
					}
				});
			});
		});

	}, function(error) {
		console.error("Failed to retrieve quotes:", error);
		if (error.code === "PERMISSION_DENIED") {
			//alert("You don't have permission to save quotes.");
			notif.innerHTML = "Database is locked";
		} else if (error.code === "NETWORK_ERROR") {
			//alert("No internet connection. Please check your network settings and try again.");
			notif.innerHTML = "No internet connection.";
		} else {
			//alert("Failed to save quote. Please try again later.");
			notif.innerHTML = "Failed to save link.";
		}
	});
}

function saveData(title, quote, author) {
	inputChanged = false;
	saveButton.disabled = true;

	if (title === '' || author === '') {
		saveButton.disabled = false;
	} else {
		var lineBreakCount = (quote.match(/\n/g) || []).length;
		if (lineBreakCount > 5) {
			saveButton.disabled = false;
			quoteTextarea.setCustomValidity("Too many line breaks");
		} else {
			saveButton.disabled = false;
			if (quote.length > 100) {
				quote = quote.substring(0, 100);
			}

			if (title.length > 80) {
				title = title.substring(0, 80);
			}

			if (author.length > 50) {
				author = author.substring(0, 50);
			}

			// Save form data to Firebase Realtime Database
			var quoteRef = database.ref('quotes').push();
			quoteRef.set({
				title: title,
				quote: quote,
				author: author,
				//sessionkey: "823716",
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}, function(error) {
				if (error) {
					console.error("Failed to save quote:", error);
					notif.style.display = "block";


					if (error.code === "PERMISSION_DENIED") {
						//alert("You don't have permission to save quotes.");
						notif.innerHTML = "Database is locked";
					} else if (error.code === "NETWORK_ERROR") {
						//alert("No internet connection. Please check your network settings and try again.");
						notif.innerHTML = "No internet connection.";
					} else {
						//alert("Failed to save quote. Please try again later.");
						notif.innerHTML = "Failed to save link.";
					}
				} else {
					myForm.style.display = 'none';
					titleInput.value = '';
					quoteTextarea.value = '';
					authorInput.value = '';
					

					showFormButton.style.display = 'block';
					myContent.style.display = 'block';

					notif.style.display = "block";
					notif.innerHTML = "Link saved!";
				}

			});

		}

	}
}