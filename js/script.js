var menuIsOpen = false;

$(document).ready(function() {
	

	$('#header-menu').on('click', function(){
		openOrCloseMenu();
	});

	$('#header-cross').on('click', function(){
		openOrCloseMenu();
	});
});

function openOrCloseMenu(){

	if(menuIsOpen === false){
		$('#header-menu').css({'display':'none'});
		$('#header-nav').css({'display':'block'});
		menuIsOpen = true;
	}else{
		$('#header-nav').css({'display':'none'});
		$('#header-menu').css({'display':'block'});
		menuIsOpen = false;
	}
}
