var galleryItem = document.getElementsByClassName('jsColor');
var descriptionItem = document.getElementsByClassName('jsTextColor');

for (var i = 0; i < galleryItem.length; i++) {
    var randomcol = chroma.random();
    galleryItem[i].style.background = randomcol.hex();
    if(randomcol.get('lab.l') < 50) {
        descriptionItem[i].style.color = '#ffffff';
    } else {
        descriptionItem[i].style.color = '#000000';
    }
}