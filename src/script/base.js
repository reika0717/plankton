$(function(){
  // $("#header").load("header.html");
  // $("#footer").load("footer.html");

  // var navi = $('header').offset().top;
  // console.log(navi)
  // $(window).scroll(function(){
  //   if($(this).scrollTop() >= navi){
  //     $('header').addClass('fixed')
  //   } else {
  //     $('header').removeClass('fixed')
  //   }
  // });

  $('li.nav__list-parent').hover(function () {
    var list_child = $(this).find('ul')
    $(list_child).slideToggle()
  })


});
