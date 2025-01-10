let newDataBtn = document.querySelector('#new-data-btn')
let submitData = document.querySelector('#add_Data')
let crudFormCont = document.querySelector('#crud-form-cont')
let theCrudForm = document.querySelector('#crud-form')
let resultPage = document.querySelector('#result-cont')
let shield = document.querySelector('#shield')
let cross = document.querySelector('#cross')
let nameBar = document.querySelector('#crud-name')
let emailBar = document.querySelector('#crud-email')
let rollBar = document.querySelector('#roll-no')
let wtrmrkCont = document.querySelector('#wtrmrk-cont')


let submitEditedData = document.querySelector('#edit_Data')
submitEditedData.style.display = 'none'


// pressing +add-data-btn and blurring the page
newDataBtn.addEventListener('click', () => {
  // Reset button states
  submitEditedData.style.display = 'none'; // Hide the edit button
  submitData.style.display = 'block'; // Show the add button

  setTimeout(() => {
    crudFormCont.style.position = "absolute";
    crudFormCont.style.display = "flex";
    resultPage.style.filter = "blur(6px)";
    shield.style.display = "block";
  }, 400);
});


// closing input popup
cross.addEventListener('click', () => {
  crudFormCont.style.display = 'none'
  resultPage.style.filter = "blur(0px)"
  shield.style.display = "none"

  setTimeout(() => {
    nameBar.value = ""
    emailBar.value = ""
    rollBar.value = ""
  }, 2000);
})
submitData.addEventListener('click', () => {

  wtrmrkCont.style.display = 'none'

  if (rollBar.value.length !== "" && rollBar.value.length === 5) {
    crudFormCont.style.display = 'none';
    resultPage.style.filter = "blur(0px)";
    shield.style.display = "none";

    setTimeout(() => {
      nameBar.value = "";
      emailBar.value = "";
      rollBar.value = "";
    }, 800);
  } else {
    Swal.fire({
      title: 'Error',
      text: `Roll Number's length must be 5`,
      icon: 'error',
      background: '#111',
      color: '#fff',
      confirmButtonColor: 'rgb(0 98 57)',
      confirmButtonBorder: '1px solid rgb(0 98 57)',
      backdrop: false,
    });
  }
})


// FireBase begins here... 🔥
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnApoP0tiLFBxbBrW8PrCff6ABLdXeOcg",
  authDomain: "usermanagement-manage-io.firebaseapp.com",
  projectId: "usermanagement-manage-io",
  storageBucket: "usermanagement-manage-io.firebasestorage.app",
  messagingSenderId: "670194247384",
  appId: "1:670194247384:web:a81595503e0a91c63bd9ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// yahan se self-work
const db = getDatabase(app)

const addStudents = () => {

  set(ref(db, 'students/' + rollBar.value), {
    name: nameBar.value.trim(),
    email: emailBar.value.trim(),
    rollNumber: rollBar.value.trim(),
  })

  //confused 😵
  readData()

  if (rollBar.value.length !== "" && rollBar.value.length === 5) {
    setTimeout(() => {
      Swal.fire({
        title: 'Success',
        text: 'Student Added!',
        icon: 'success',
        background: '#111',
        color: '#fff',
        confirmButtonColor: 'rgb(0 98 57)',
        confirmButtonBorder: '1px solid rgb(0 98 57)',
        backdrop: false,
      });

    }, 600);
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Write a 5-digit roll number',
      icon: 'error',
      background: '#111',
      color: '#fff',
      confirmButtonColor: 'rgb(0 98 57)',
      confirmButtonBorder: '1px solid rgb(0 98 57)',
      backdrop: false,
    });

  }

}
submitData.addEventListener('click', addStudents)

// reading the data
const readData = () => {
  const userRef = ref(db, 'students/')

  get(userRef).then((snapshot) => {

    const realtimeData = snapshot.val()
    const table = document.querySelector('#each-data-cont')
    let html = ''

    for (const key in realtimeData) {
      const { name, email, rollNumber } = realtimeData[key]
      html += `
      <div class="each-data">
        <div class="name">${name.length > 8 ? name.slice(0, 8) + "..." : name}</div>
        <div class="line"></div>
        <div class="email">${email.slice(0, 6) + "..."}</div>
        <div class="line"></div>
        <div class="roll-no">${rollNumber}</div>
        <div class="line"></div>
       <div id="edit-btn" class="edit" onclick="updateData('${rollNumber}')">Edit</div>
       <div class="line"></div>
       <div id="delete-btn" class="delete" onclick="deleteData('${rollNumber}')">Delete</div>
      </div>
    `;

      table.innerHTML = html


    }
  })
}
readData()


// delete data
// delete data
window.deleteData = function (rollNumber) {
  const userRef = ref(db, `students/${rollNumber}`);
  remove(userRef)
    .then(() => {
      // Call readData after removing the entry to update the UI
      readData();

      Swal.fire({
        title: 'Deleted',
        text: 'Student Deleted',
        icon: 'warning',
        background: '#111',
        color: '#fff',
        confirmButtonColor: 'rgb(0 98 57)',
        confirmButtonBorder: '1px solid rgb(0 98 57)',
        backdrop: false,
      });
    })
    .catch((error) => {
      console.error('Error deleting data:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete student. Please try again.',
        icon: 'error',
        background: '#111',
        color: '#fff',
        confirmButtonColor: 'rgb(0 98 57)',
        confirmButtonBorder: '1px solid rgb(0 98 57)',
        backdrop: false,
      });
    });
    readData();

};


// re-showing the form pop-up when pressed edit
window.updateData = function (rollNumber) {
  const userRef = ref(db, `students/${rollNumber}`);
  get(userRef).then((item) => {
    if (item.exists()) {
      // Correctly assigning the values to the input fields
      nameBar.value = item.val().name;
      emailBar.value = item.val().email;
      rollBar.value = item.val().rollNumber;

      // Show the form popup
      crudFormCont.style.position = "absolute";
      crudFormCont.style.display = "flex";
      resultPage.style.filter = "blur(6px)";
      shield.style.display = "block";

      // Switching buttons
      submitData.style.display = "none";
      submitEditedData.style.display = "block";

      // Remove any previously attached event listeners to avoid duplicates
      submitEditedData.replaceWith(submitEditedData.cloneNode(true));
      submitEditedData = document.querySelector('#edit_Data');

      // Add event listener for editing data
      submitEditedData.addEventListener('click', () => {
        if (rollBar.value.length === 5) {
          // Update the data in Firebase
          update(ref(db, `students/${rollNumber}`), {
            name: nameBar.value.trim(),
            email: emailBar.value.trim(),
            rollNumber: rollBar.value.trim(),
          }).then(() => {
            // Hide the form and reset fields
            crudFormCont.style.display = 'none';
            resultPage.style.filter = "blur(0px)";
            shield.style.display = "none";

            setTimeout(() => {
              Swal.fire({
                title: 'Success',
                text: 'Edition successful',
                icon: 'success',
                background: '#111',
                color: '#fff',
                confirmButtonColor: 'rgb(0 98 57)',
                confirmButtonBorder: '1px solid rgb(0 98 57)',
                backdrop: false,
              });

              // nameBar.value = "";
              // emailBar.value = "";
              // rollBar.value = "";
              readData(); // Refresh the data
            }, 800);
          }).catch((error) => {
            console.error('Error updating data:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to update data. Please try again.',
              icon: 'error',
              background: '#111',
              color: '#fff',
              confirmButtonColor: 'rgb(0 98 57)',
              confirmButtonBorder: '1px solid rgb(0 98 57)',
              backdrop: false,
            });

          });
        } else {
          Swal.fire({
            title: 'Error',
            text: "Roll Number's length must be 5",
            icon: 'error',
            background: '#111',
            color: '#fff',
            confirmButtonColor: 'rgb(0 98 57)',
            confirmButtonBorder: '1px solid rgb(0 98 57)',
            backdrop: false,
          });

        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Student not found',
        icon: 'error',
        background: '#111',
        color: '#fff',
        confirmButtonColor: 'rgb(0 98 57)',
        confirmButtonBorder: '1px solid rgb(0 98 57)',
        backdrop: false,
      });

    }
  }).catch((error) => {
    console.error('Error fetching data:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to fetch student data. Please try again.',
      icon: 'error',
      background: '#111',
      color: '#fff',
      confirmButtonColor: 'rgb(0 98 57)',
      confirmButtonBorder: '1px solid rgb(0 98 57)',
      backdrop: false,
    });

  });
};

let deleteBtn = document.querySelector('#delete-btn')
deleteBtn.addEventListener('click', () => {
  setTimeout(() => {
    window.location.reload()
  }, 1000);
})
