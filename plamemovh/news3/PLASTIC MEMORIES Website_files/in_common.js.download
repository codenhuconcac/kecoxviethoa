// JavaScript Document


$(function() {
	new Substrate('#cynapse', '/circuit.svg');
	$("h2.pageTitle").delay(600).velocity({width:"600px"},600);
	$(".Title__underbar").delay(300).velocity({width:"600px"},600);
	$(".contents__inWrap").delay(900).velocity({opacity:"1"},600);

	$(".nav__menu li").prepend("<p class='nav_circle'></p><p class='nav_circle_in'>&nbsp;</p>").hover(
		function() {
			$(this).find(".nav_off").stop().velocity({opacity:"0"},300);
			$(this).find(".nav_on").stop().velocity({opacity:"1"},300);
			$(this).find(".nav_circle").stop().velocity({borderColor:"#f64562",width:"11px",height:"11px",left:"-7px",top:"-1px"},100);
			$(this).find(".nav_circle_in").stop().velocity({opacity:"1"},100);
			$(this).find(".menu__sub").stop().delay(200).velocity({width:"150px"},200);
			},
		function() {
			$(this).find(".nav_off").stop().velocity({opacity:"1"},300);
			$(this).find(".nav_on").stop().velocity({opacity:"0"},300);
			$(this).find(".nav_circle").stop().velocity({borderColor:"#ccc",width:"5px",height:"5px",left:"-4px",top:"2px"},100);
			$(this).find(".nav_circle_in").stop().velocity({opacity:"0"},100);
			$(this).find(".menu__sub").stop().velocity({width:"0px"},300);
		}
	);
	$('a[href^=#]').click(function() {
		var speed = 400;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed);
		return false;
	});
});

var siteURL = encodeURIComponent("http://www.plasticmemoriesusa.com/");
// twitter
$.getJSON(
	"http://urls.api.twitter.com/1/urls/count.json?url=" + siteURL  + "&callback=?", null,
	function(json){ 
	$('ul.nav__sns li.twitter div.frame-middle p').append(json["count"]);
	}
);
// facebook
$.ajax({
	type: "GET",
	url: "https://api.facebook.com/method/fql.query?query=select+share_count+from+link_stat+where+url%3D'" + siteURL + "'&format=json&callback",
	async: true,
	cache: false,
	dataType: "jsonp"
}).done(function(json) {
	$('ul.sns li.facebook div.frame-middle p').append(json[0]["share_count"]);
});



$(window).scroll(function () {
	var nav_height =$('nav').height();
	var win_height =window.innerHeight;
	var _height =nav_height-win_height;
if(0 < _height){
	if($(window).scrollTop() > _height) {
		$('nav').css({position:'fixed',bottom:'0px',top:'auto'});
	}else{
		$('nav').css({position:'absolute',bottom:'auto',top:'0px'});
	}
}else{
		$('nav').css({position:'fixed',top:'0'});
}
});