// The function of this script is just to setup the popup of the buttons when the end user didn't choose any button yet

$(function () {

	$('[data-toggle="popover"]').popover()

});

$('#takeOrLeave').popover('disable');