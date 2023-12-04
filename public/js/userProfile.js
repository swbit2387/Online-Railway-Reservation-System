// const emailElement = document.getElementById('email');
// const photoElement = document.getElementById('photo');

// // fetch user profile data from the server using an API call
// fetch('/api/profile')
//   .then(response => response.json())
//   .then(profileData => {
//     // update the Name, Email and Photo elements with the received data
//     emailElement.textContent = profileData.email;
//     photoElement.src = profileData.photoUrl;
//   })
//   .catch(error => {
//     console.error('Error fetching profile data:', error);
//   });

/////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

$(document).ready(function () {
  var readURL = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('.profile-pic').attr('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  $('.file-upload').on('change', function () {
    readURL(this);
  });

  $('.upload-button').on('click', function () {
    $('.file-upload').click();
  });
});

const updateSettings = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/user/updateMe`,
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      swal('Welcome', 'Updated successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/me');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

const userDataForm = document.querySelector('.form-updateUser');
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name23').value;
    const email = document.getElementById('email23').value;

    updateSettings(name, email);
  });
