window.addEventListener('load', function() {
    if (localStorage.getItem('showSwal') === 'true') {
        Swal.fire({
            title: 'Logged Out',
            text: 'You have successfully logged out..',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        localStorage.removeItem('showSwal');
    }
});