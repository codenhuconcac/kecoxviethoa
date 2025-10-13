// JavaScript Document
$(function() {
	$('#YoutubeBg').velocity({scale:0},{duration:400});
});
var FloatPlayer = function(_id) {
	this.id = _id;
	this.init();
}

//Youtube Player
var Youtube = (function() {
    //public static

    //constructor
    var _myID;


    function Youtube(_id) {
        _myID = _id;
        init();
    }

    //private
    var init = function() {
		$('#floatBg').velocity({width:'100%',marginLeft:'0%'},{duration:400});
		$('#YoutubeBg').delay(400).velocity({opacity:1,scale:1},{duration:400});
		
		setTimeout(function(){
        var _html = "";
		_html += '<div id="movieWrap">';
		_html += '<div class="linerFloatTop"></div>';
		_html += '<div class="floatImage">';
		_html += '<p class="btn_close"></p>';
		_html += '</div>';
		_html += '<div class="linerFloatBottom"></div>';
		_html += '</div>';
        $('#floatPlayer').append(_html);
        $('.floatImage').delay(400).append('<div id="YoutubeWrap"><iframe width="850" height="478" src="https://www.youtube.com/embed/' + _myID + '?autoplay=1&rel=0&wmode=transparent" frameborder="0" allowfullscreen></iframe><div>');

		$(".linerFloatTop").prepend('<div class="synapse"></div>');
		setInterval(function(){
			$(".linerFloatTop .synapse").delay(1000).velocity({'left':'110%'},2000).velocity({'left':'-10%'},0);
		},3000);
		$(".linerFloatBottom").prepend('<div class="synapse"></div>');
		setInterval(function(){
			$(".linerFloatBottom .synapse").delay(1000).velocity({'right':'110%'},2000).velocity({'right':'-10%'},0);
		},3000);
		
		$('.btn_close').hover(
			function() {$(this).stop().velocity({opacity:"0.5"},300);},
			function() {$(this).stop().velocity({opacity:"1"},300);});

		$('#floatBg,.btn_close,#movieWrap').click(function(){
		$('#YoutubeBg').velocity({opacity:0,scale:0},{duration:400});
		$('#floatBg').delay(400).velocity({width:'0%',marginLeft:'50%'},{duration:400});
		$('.btn_close,#movieWrap').fadeOut(400);
		$('#movieWrap').attr('src','').css({overflow:'hidden',height:'0px'});
			 setTimeout(function(){$('#movieWrap').remove();}, 100);
		});
		}, 800);




    }

    return Youtube;
})();

$(".movie_section:odd").css({'margin-left':'48px'}); 

$(function(){

    $("#movie_thumb").hover(
    function() {$(".btn_play_on").animate({opacity:"1"},150);},
    function() {$(".btn_play_on").animate({opacity: "0"},150)});

    $(".movie-box").hover(
    function() {$(this).find(".btn_play_on").animate({opacity:"1"},150);},
    function() {$(this).find(".btn_play_on").animate({opacity: "0"},150)});
});