
document.addEventListener('DOMContentLoaded', function () {
    let studentsSwiper = new Swiper('.students__swiper', {
        slidesPerView: 'auto',
        spaceBetween: 15,
        centeredSlides: true,
        breakpoints:{
            1250:{
                centeredSlides: false,
            }
        }
    });
  });
  