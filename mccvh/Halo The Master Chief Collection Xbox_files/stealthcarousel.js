$(document).ready(function() {

    //Set up background images for videos before building carousel
    $("#Stealth-Carousel .panel-feature").each(function() {
        var posterImage = $(this).attr("data-poster-image");
        if (posterImage != undefined) {
            var posterImageCSS = "url('" + posterImage + "')";
            $(this).css("background-image", posterImageCSS);
        }
    });

    // create left and right carousels from center carousel, for ease of maintenance

    var centerPanels = $(".center-carousel .stealth-sub-carousel-panel");

    var panelsMax = (centerPanels.length - 1);

    for (var i = 0; i <= panelsMax; i++) {
        $(centerPanels[i]).attr("class", "stealth-panel-" + (i + 1) + " stealth-sub-carousel-panel");
    }




    if (centerPanels.length > 1) {

        $(".stealth-carousel .stealth-carousel-arrow").css("display", "block");

        var leftPanels = new Array;
        var rightPanels = new Array;

        // sort center panels into left and right carousels
        for (var i = 0; i <= panelsMax; i++) {
            // right carousel sorting
            if (i == 0) {
                rightPanel = panelsMax;
            } else {
                rightPanel = (i - 1);
            }

            rightPanels[rightPanel] = $(centerPanels[i]).clone().attr({ "class": "stealth-panel-" + (rightPanel + 1) + " stealth-sub-carousel-panel", "aria-hidden": "true", "tabindex": "-1", "role": "presentation" });

            //left carousel sorting
            if (i == panelsMax) {
                leftPanel = 0;
            } else {
                leftPanel = (i + 1);
            }
            leftPanels[leftPanel] = $(centerPanels[i]).clone().attr({ "class": "stealth-panel-" + (leftPanel + 1) + " stealth-sub-carousel-panel", "aria-hidden": "true", "tabindex": "-1", "role": "presentation" });

            //add numbered class to center panels for script to work
            //$(centerPanels[i]).attr("class" , "stealth-panel-"+(i+1) + " stealth-sub-carousel-panel");
        }

        // create left and right carousel containers
        $('<div/>').appendTo(".stealth-carousel").attr({ "class": "stealth-sub-carousel left-carousel", "aria-hidden": "true", "tabindex": "-1", "role": "presentation" });
        $('<div/>').appendTo(".stealth-carousel").attr({ "class": "stealth-sub-carousel right-carousel", "aria-hidden": "true", "tabindex": "-1", "role": "presentation" });

        //put panels in place
        for (var i = 0; i <= panelsMax; i++) {
            $(leftPanels[i]).appendTo(".left-carousel");
            $(rightPanels[i]).appendTo(".right-carousel");
        }
        $(".stealth-sub-carousel .stealth-sub-carousel-panel:not(:first-of-type)").addClass("hide-panel");

        // remove any IDs from right/left panels
        $(".stealth-sub-carousel.left-carousel .stealth-sub-carousel-panel , .stealth-sub-carousel.right-carousel  .stealth-sub-carousel-panel").attr("id", "");

        // remove any IDs from right/left panel <a> elements
        $(".left-carousel a, .right-carousel a").removeAttr("id");
        $(".left-carousel iframe, .right-carousel iframe").attr("tabindex", "-1"); //Fix issue where focus was going to videos hidden in left and right areas.

    }






    // ========================================
    //pre-existing functionality

    if ($(".stealth-carousel").length) {

        $(".stealth-carousel").each(function(index, item) {
            var currentPanel = 1;
            var panelCount = $(item).find(".stealth-sub-carousel").first().find('[class^="stealth-panel-"]').length;

            function syncHeights() {
                var maxHeight = 0;

                $(item).find('.panel-content').css('height', "auto");


                $(item).find('.panel-content').each(function(index, panel) {

                    maxHeight = $(".center-carousel .stealth-sub-carousel-panel:not([aria-hidden ='true']) .panel-content").outerHeight(false);
                    //console.log("maxHeight " + maxHeight);
                    /*
                    if (!(($(panel).parent().attr("aria-hidden") == "true") )) {
                        console.log("index " + index + " height " + height);
                        maxHeight = height;
                    }*/
                });

                $(item).find('.panel-content').css('height', maxHeight + "px");
            }
            //                $(item).on("ready", function() {
            //                    syncHeights();
            //                });

            function arrowHeights() {
                var arrowHeight = $(item).find('.center-carousel').find('.stealth-panel-' + currentPanel).find('.panel-feature').height() / 2; //-EL:Changed to panel feature to put arrow at center of image, not whole container
                /*if (window.matchMedia('(max-width:767px)').matches) {
                    arrowHeight += 44;
                }*/
                $(item).find('.stealth-carousel-arrow').css('top', arrowHeight + "px");
            }
            arrowHeights();
            syncHeights()

            function rotateCaroLeft(focusedCarousel) {
                var nextPanel = currentPanel - 1;
                if (nextPanel < 1) {
                    nextPanel = panelCount;
                }

                $(focusedCarousel).find(".stealth-panel-" + currentPanel).attr("aria-hidden", "true").addClass("hide-panel").find("a, button, summary").attr({ "tabindex": "-1", "aria-hidden": "true" });
                $(focusedCarousel).find(".stealth-panel-" + nextPanel).attr("aria-hidden", "false").removeClass("hide-panel");
                currentPanel = nextPanel;

                $(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("tabindex", "-1"); //Make videos unfocussable if not front and center
                $(focusedCarousel).find(".stealth-panel-" + nextPanel + " iframe").attr("tabindex", "0");
                var videoSrc = $(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("src");
                //if ($(focusedCarousel).find(".stealth-panel-" + nextPanel + " .panel-feature").attr("data-poster-image") != undefined){
                //  console.log($(focusedCarousel).find(".stealth-panel-" + nextPanel + " .panel-feature") + " has a poster image!!!");
                //}
                //$(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("src", videoSrc);

                currentPanel = nextPanel;

                /* copied from standard version */
                $(".center-carousel .stealth-panel-" + currentPanel + " *").removeClass("x-hidden-focus");

                // restore a and button tab focus on active panel only
                $(".center-carousel .stealth-panel-" + currentPanel).attr("aria-hidden", "false").removeClass("hide-panel").find("a, button, summary").attr({ "tabindex": "0", "aria-hidden": "false" });


                arrowHeights();
                syncHeights()
            }

            function rotateCaroRight(focusedCarousel, jumpToPanel) {
                var nextPanel;

                if (jumpToPanel != null) {
                    nextPanel = jumpToPanel;
                } else {
                    nextPanel = currentPanel + 1;
                }

                if (nextPanel > panelCount) {
                    nextPanel = 1;
                }
                $(focusedCarousel).find(".stealth-panel-" + currentPanel).attr("aria-hidden", "true").addClass("hide-panel").find("a, button, summary").attr({ "tabindex": "-1", "aria-hidden": "true" });
                $(focusedCarousel).find(".stealth-panel-" + nextPanel).attr("aria-hidden", "false").removeClass("hide-panel");

                if (jumpToPanel != null) {
                    $(window).on("load", function() {
                        setTimeout(function() {
                            $("#" + theId + " a.OttoGallery").click();
                            $(".lightboxcontent").attr("aria-live", "assertive");
                        }, 2000);
                    });
                }

                currentPanel = nextPanel;

                $(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("tabindex", "-1"); //Make videos unfocussable if not front and center
                $(focusedCarousel).find(".stealth-panel-" + nextPanel + " iframe").attr("tabindex", "0");
                var videoSrc = $(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("src");
                //if ($(focusedCarousel).find(".stealth-panel-" + nextPanel + " .panel-feature").attr("data-poster-image") != undefined){
                //  console.log($(focusedCarousel).find(".stealth-panel-" + nextPanel + " .panel-feature") + " has a poster image!!!");
                //}
                //$(focusedCarousel).find(".stealth-panel-" + currentPanel + " iframe").attr("src", videoSrc);;

                currentPanel = nextPanel;

                /* copied from standard version */
                $(".center-carousel .stealth-panel-" + currentPanel + " *").removeClass("x-hidden-focus");

                // restore a and button tab focus on active panel only
                $(".center-carousel .stealth-panel-" + currentPanel).attr("aria-hidden", "false").removeClass("hide-panel").find("a, button, summary").attr({ "tabindex": "0", "aria-hidden": "false" });

                arrowHeights();
                syncHeights()
            }

            // disable a and button tab focus except starting panel
            $("[class^=stealth-panel]").not(".center-carousel .stealth-panel-1").attr("aria-hidden", "true").find("a, button, summary").attr({ "tabindex": "-1", "aria-hidden": "true" });
            /*
                        $(item).find('.left-arrow').on("keydown", function (e) {
                            (13 == e.keyCode || 32 == e.keyCode) && $(this).click()
                        }),*/
            $(item).find('.left-arrow').on("click", function() {
                // disable a and button tab focus on every navigation
                $("[class^=stealth-panel]").attr("aria-hidden", "true").find("a, button, summary").attr({ "tabindex": "-1", "aria-hidden": "true" });
                rotateCaroLeft(item);
            });
            /*
                        $(item).find('.right-arrow').on("keydown", function (e) {
                            (13 == e.keyCode || 32 == e.keyCode) && $(this).click()
                        }),*/
            $(item).find('.right-arrow').on("click", function() {
                // disable a and button tab focus on every navigation
                $("[class^=stealth-panel]").attr("aria-hidden", "true").find("a, button, summary").attr({ "tabindex": "-1", "aria-hidden": "true" });
                rotateCaroRight(item);
            });


            var touchstartX = 0;
            var touchendX = 0;

            item.addEventListener("touchstart", function(event) {
                touchstartX = event.changedTouches[0].screenX;
            }, false);

            item.addEventListener("touchend", function(event) {
                touchendX = event.changedTouches[0].screenX;
                var distance = touchendX - touchstartX;
                if (distance > 30) {
                    rotateCaroLeft(item);
                } else if (distance < -30) {
                    rotateCaroRight(item);
                }
            }, false);

            var clickstartX = 0;
            var clickendX = 0;

            $(item).on('mousedown', function(event) {
                clickstartX = event.clientX;
            });

            $(item).on('mouseup', function(event) {
                clickendX = event.clientX;
                var distance = clickendX - clickstartX;
                if (distance > 30) {
                    rotateCaroLeft(item);
                } else if (distance < -30) {
                    rotateCaroRight(item);
                }
            });


            /*item.addEventListener("dragstart", function (event) {
                clickstartX = event.clientX;
            }, false);*/

            item.addEventListener("dragend", function(event) {
                clickendX = event.clientX;
                var distance = clickendX - clickstartX;
                if (distance > 30) {
                    rotateCaroLeft(item);
                } else if (distance < -30) {
                    rotateCaroRight(item);
                }
            }, false);

            setTimeout(function() {
                syncHeights();
                arrowHeights();
            }, 500);

            $(window).resize(function() {
                syncHeights();
                arrowHeights();
            });

            // skip to specific slide 

            // get hashtag, make sure it's is lower case
            theHash = document.location.hash.toLowerCase();
            theId = document.location.hash.substring(1);

            var centerPanels = $(this).find(".center-carousel .stealth-sub-carousel-panel");
            var targetIndex;
            if (theHash.length) {
                $(centerPanels).each(function() {
                    if ($(this).attr("id") == theId) {

                        targetIndex = ($(this).index() + 1);

                        rotateCaroRight(item, targetIndex);

                    }
                });

            }
        });


    }
    $(".left-carousel a, .right-carousel a").removeAttr("id");


    $(".video-sneak-slider a.OttoGallery").on("click", function() {
        sliderOffset = $(".video-sneak-slider").offset().top;
        bannerHeight = 0;
        if ($(".video-sneak-slider .m-banner").length) {
            bannerHeight = $(".video-sneak-slider .m-banner").outerHeight(true);
        }
        scrollTarget = sliderOffset + bannerHeight - 72;

        $(".lightboxclosebutton").on("click", function() {
            $('html,body').scrollTop(scrollTarget);
        });
    });


});