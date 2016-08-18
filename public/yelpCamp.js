var yourImg = document.getElementById("yourPic");
if(yourImg && yourImg.style) {
    yourImg.style.height = '100px';
    yourImg.style.width = '200px';
}

// var images=new Array('http://cdn-jpg2.theactivetimes.net/sites/default/files/camping.jpg','http://www.active.com/Assets/nh_camping.jpg','https://www.google.com/search?q=camping&espv=2&biw=1280&bih=726&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjg_YeB-snOAhVF1x4KHZoWBywQ_AUICCgD#imgrc=VL-LmpZiDdlFnM%3A','http://www.stainlesssteel2015.org/wp-content/uploads/2016/04/5.jpg');
// var nextimage=0;
// doSlideshow();

// function doSlideshow(){
//     if(nextimage>=images.length){nextimage=0;}
//     document.getElementsByClassName('.mainBody')
//     .css('background-image','url("'+images[nextimage++]+'")')
//     .fadeIn(500,function(){
//         setTimeout(doSlideshow,1000);
//     });
// }