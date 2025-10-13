$(document).ready(function() {
  $("#BodyContent a").not(".followable").each(function() {
    var thelink = "";
    if ($(this).attr("href")) {
      thelink = $(this).attr("href").toLowerCase();
    }
    if (thelink.indexOf("/store/") !== -1 || thelink.indexOf("marketplace.xbox") !== -1) {
      $(this).attr("rel", "nofollow");
    }
  })
});