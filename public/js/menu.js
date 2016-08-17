$('#img_container').css('display','none');

$('#menu_author').click(function () {
    $('#img_container').css('display','none');
    $('#author_container').css('display','inline');
    $('#update_container').css('display','none');
});
$('#menu_img').click(function () {
    $('#author_container').css('display','none');
    $('#img_container').css('display','inline');
    $('#update_container').css('display','none');
});
$('#menu_update').click(function () {
    $('#author_container').css('display','none');
    $('#update_container').css('display','inline');
    $('#img_container').css('display','none');
});
