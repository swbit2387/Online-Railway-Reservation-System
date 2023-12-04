const deleteUser = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `api/user/deleteUser/${id}`,
      data: {},
    });

    if (res.status === 204) {
      swal('Welcome', 'deleted successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/allUsers');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};
