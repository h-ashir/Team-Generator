  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('ratingValue');
  const ratingStars = document.getElementById('ratingStars');

  const editButton = document.querySelector('.edit-feedback');
  const feedbackArea = document.querySelector('.feedback-area');
  const downloadButton = document.querySelector('.download');

  window.addEventListener('load', function() {
    if (localStorage.getItem('showSwal') === 'true') {
        Swal.fire({
            title: 'Save to history',
            text: 'Saved to history',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        localStorage.removeItem('showSwal');
    }
});

  downloadButton.addEventListener('click', function() {
    localStorage.setItem('showSwal', 'true');
    window.location.href = 'generate-team.html';
  });

  if (editButton && feedbackArea){
    editButton.addEventListener('click', (event) =>{
      event.preventDefault();
      feedbackArea.style.display =  feedbackArea.style.display === 'none' ? 'block' :'none';
    });
  }
 
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const value = parseInt(this.getAttribute('data-value'));
      highlightStars(value);
    });
 
    star.addEventListener('mouseleave', function() {
      const value = parseInt(ratingValue.value);
      highlightStars(value);
    });
 
    star.addEventListener('click', function() {
      const value = parseInt(this.getAttribute('data-value'));
      ratingValue.value = value;
      highlightStars(value);
    });
  });
 
  function highlightStars(value) {
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      if (starValue <= value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
