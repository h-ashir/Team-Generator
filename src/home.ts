import Swal from 'sweetalert2';

window.addEventListener('load', () => {
    const showSwal = localStorage.getItem('showSwal');
    if (showSwal === 'true') {
        Swal.fire({
            title: 'Logged Out',
            text: 'You have successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        localStorage.removeItem('showSwal');
    }
});
