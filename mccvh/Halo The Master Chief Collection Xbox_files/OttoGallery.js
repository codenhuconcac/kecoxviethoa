// Otto Gallery V1.5 for MWF
$(document).ready(function(){
    var youtubeorigin = window.location.host;
    function OttoLightboxes(inline) {
      // youtube/dam switching
      if ($(".OttoGallery[data-otto-youtubeid][data-otto-iframe-src]").length > 0) {
        var dualcount = $(".OttoGallery[data-otto-youtubeid][data-otto-iframe-src]").length;
        var dualcounter = 0;
        $(".OttoGallery[data-otto-youtubeid][data-otto-iframe-src]").each(function() {
          var currentgallery = this;
          // test DAM video
          var thisiframesrc = $(currentgallery).data("otto-iframe-src");
          var thisvidid = thisiframesrc.split("/")[6].split("?")[0]
          var jsonurlraw = "https://query.prod.cms.rt.microsoft.com/cms/api/am/document/GUID"
          console.log(jsonurlraw.replace("GUID", thisvidid))
          $.get(jsonurlraw.replace("GUID", thisvidid))
            .done(function() {
              console.log("removing youtube")
                $(currentgallery).removeAttr("data-otto-youtubeid");
              })
            .fail(function() {
                $(currentgallery).removeAttr("data-otto-iframe-src");
              })
            .always(function() {
              dualcounter++;
              if (dualcounter === dualcount) {
                runLightBoxes();
              }
            })
        })
      } else {
        if (window.runOttoLbOnce === undefined) {
          runOttoLbOnce = {
            runlb: function() {
              runLightBoxes();
            }
          }
          runOttoLbOnce.runlb();
        }
      }
  
      // inline functionality
      if (inline === "inline") {
  
      }
      function runLightBoxes() {
        //document.domain = "xbox.com";
        var urlRegion = document.URL.toLowerCase().split("xbox.com/")[1].slice(0, 5);
        var agegateforlbactive = true;
        var userAgentString = navigator.userAgent; // detect browser (for IE YouTube swipe issue)
        var youtubeorigin = window.location.host;
        var categoryList = [];
        var lightboxopentype = "";
        var escapeflag = 0;
       $(".OttoGallery").each(function(currentgalleryindex) {
        var currentgallery = this;
        if ($(currentgallery).attr("data-otto-thumbnav") == "off") {
         var thumbnav = "off"
        } else {
         var thumbnav = "on"
        }
  
        // set up aspect ratio
        var ottoAspect = "16x9";
        if ($(currentgallery).attr("data-otto-aspect-ratio")) {
          ottoAspect = $(currentgallery).attr("data-otto-aspect-ratio").toLowerCase();
        } else {
          ottoAspect = "16x9";
        }
  
        // set up categories
        var ottoCategories = "off";
  
          $(currentgallery).find("ul").eq(0).addClass("mainSlick mainSlick" + currentgalleryindex)
  
          // slide function
          // arrow colors
          var mainarrowcolor = "#f3f3f3";
          var thumbnailarrowcolor = "#f3f3f3";
          if ($(currentgallery).data("otto-mainarrowcolor")) {
            mainarrowcolor = $(currentgallery).data("otto-mainarrowcolor");
          } 
          if ($(currentgallery).data("otto-thumbnailarrowcolor")) {
            thumbnailarrowcolor = $(currentgallery).data("otto-thumbnailarrowcolor");
          } 
  
          // determine gallery type
          var gallerytype = $(currentgallery).data("otto-type");
  
          // data-otto-type
          if (gallerytype == "lightbox") {
            //// begin lightbox type gallery ////
            lbtabonly = 0;
            var lightboxid = $(currentgallery).attr("id");
            var targetdiv = $(currentgallery).data("otto-targetdivid");
            var agegate = $(currentgallery).data("otto-agegate");
            var lightboxcontainer = $(currentgallery).attr("data-otto-lightbox-container");
            var textcontainer = $(currentgallery).data("otto-text-desc-id");
            var altaudioid = $(currentgallery).data("otto-alt-audio-youtubeid");
            var ottoidtitle;
  
            if ($(currentgallery).attr("data-otto-generated") !== "true" && $(currentgallery).attr("data-otto-iframe-src") !== undefined && 
              $(currentgallery).attr("data-otto-iframe-src").toLowerCase().indexOf("videoplayer/embed") !== -1) {
              var vidguidarray = $(currentgallery).attr("data-otto-iframe-src").split("/");
              var vidguid = vidguidarray[vidguidarray.length - 1].split("?")[0];
              var jsonurlraw = "https://query.prod.cms.rt.microsoft.com/cms/api/am/document/GUID"
            
              $.get(jsonurlraw.replace("GUID", vidguid))
                .done(function(responseData) {
                  var thisvidtitle = responseData.title;
                  var thisvidname = responseData._name;
                  ottoaria(thisvidtitle, thisvidname);
                  //ottotitle(thisvidname)
                  ottoidtitle = thisvidname;
                })
              function ottoaria(title, name) {
                var ot = ottotext.locales[urlRegion];
                if ($(currentgallery).attr("data-otto-aria-ignore") != "true"){
                    $(currentgallery).attr("aria-label", ot["keyAriawatch"] + ' ' + name);
                }
                $(currentgallery).attr("data-otto-thevidname", name);
              }
              // function ottotitle(name) {
              //   $(".lightboxcontent").attr("aria-label", name);
              // }
  
            }
  
            if ($(currentgallery).data("otto-lightbox-vid-vertical-placement")) {
              var lightboxvertical = $(currentgallery).data("otto-lightbox-vid-vertical-placement");
            } else {
              var lightboxvertical = "-17%";
            }
  
            if ($(currentgallery).attr("src")) {
              var imgsrc = $(currentgallery).attr("src"); 
            } else {
              var imgsrc = "https://assets.xboxservices.com/assets/0f/8e/0f8ec64d-27e7-49cd-b8c8-ceb0d239b334.png?n=playbutton.png";
            }
            $(currentgallery).attr("src", imgsrc);
            $(currentgallery).addClass("lightboxplaybutton");
  
            function opennewwindow() {
                
              if ($(currentgallery).data("otto-youtubeid")) {
  
                var youtubeid = $(currentgallery).data("otto-youtubeid");
  
                // Atlas tracking - YouTube play tracking only NOTE: xbtracker.js not required
                if ($(currentgallery).data("otto-xbtrackeratlas")) {
                  var youtubeatlastag = $(currentgallery).data("otto-xbtrackeratlas");
                  // console.log(youtubeatlastag);
                  $.ajax({
                    url: "http://view.atdmt.com/jaction/" + youtubeatlastag,
                    dataType:"jsonp"
                  });
                }
                
                if (userAgentString.indexOf("iPhone") >= 0) { // if browser is iPhone
                  $("body").append("<a id='ytclick' target='_blank' style='display: none;' href='https://www.youtube-nocookie.com/embed/" + 
                                   youtubeid + "?id=" + youtubeid + "&amp;rel=0&amp;origin=https%3A%2F%2Fwww.xbox.com'></a>");
                  $("#ytclick")[0].click();
                  //console.log("open new window for youtube?")
                } else {
                  window.open('https://www.youtube-nocookie.com/embed/' + youtubeid + '?id=' + youtubeid + '&amp;rel=0&amp;origin=https%3A%2F%2Fwww.xbox.com');
                }
  
              } else if ($(currentgallery).data("otto-htmlfivevideoname")) {
                if ($(currentgallery).data("otto-xbtrackeratlas")) {
                  var htmlatlastag = $(currentgallery).data("otto-xbtrackeratlas");
                  // console.log(youtubeatlastag);
                  $.ajax({
                    url: "http://view.atdmt.com/jaction/" + htmlatlastag,
                    dataType:"jsonp"
                  });
                }
                var html5mp4 = $(currentgallery).data("otto-video-mp4");
                window.open(html5mp4);
                
              } else if ($(currentgallery).data("otto-wirewaxid")) {
                if ($(currentgallery).data("otto-xbtrackeratlas")) {
                  var wirewaxatlastag = $(currentgallery).data("otto-xbtrackeratlas");
                  // console.log(youtubeatlastag);
                  $.ajax({
                    url: "http://view.atdmt.com/jaction/" + wirewaxatlastag,
                    dataType:"jsonp"
                  });
                }
                var wirewaxid = $(currentgallery).data("otto-wirewaxid");
                window.open('http://www.wirewax.com/embed/' + wirewaxid);
  
              } else if ($(currentgallery).data("otto-zentrickid")) {
                if ($(currentgallery).data("otto-xbtrackeratlas")) {
                  var zentrickatlastag = $(currentgallery).data("otto-xbtrackeratlas");
                  // console.log(youtubeatlastag);
                  $.ajax({
                    url: "http://view.atdmt.com/jaction/" + zentrickatlastag,
                    dataType:"jsonp"
                  });
                }
                var zentrickid = $(currentgallery).data("otto-zentrickid");
                window.open('https://watch.zentrick.com/' + zentrickid);
  
              } else if ($(currentgallery).data("otto-iframe-src")) {
                if ($(currentgallery).data("otto-xbtrackeratlas")) {
                  var iframeatlastag = $(currentgallery).data("otto-xbtrackeratlas");
                  // console.log(youtubeatlastag);
                  $.ajax({
                    url: "http://view.atdmt.com/jaction/" + iframeatlastag,
                    dataType:"jsonp"
                  });
                }
                var iframesrc = $(currentgallery).data("otto-iframe-src");
                window.open(iframesrc);
  
              }
              $(".lightboxcontent").remove();
            }
            
            $(currentgallery).click(function() {
              if ($(window).width() <= 0) {
                if (agegate && agegateforlbactive == true) {
                  $(currentgallery).before('<div class="lightboxcontent" id="contentmobile-' + lightboxid + '" role="dialog">' +
                                           '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                           '</div>' +
                                           '</div>');
                  $("body").append('<div id="page-cover"></div>');
                  $("#page-cover").show();
                  // console.log ("lightbox age gate opened");
                  if (ageGate("#contentmobile-" + lightboxid, opennewwindow) == "agegatepassed") {
                    opennewwindow();
                  }  
                  if (typeof lightboxcontainer !== "undefined") {
                    $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                  }   
                } else {
                  opennewwindow();
                }
  
                $(".lightboxclosebutton").click(function() {
                  $(".lightboxcontent").remove();
                  // console.log("closing lightbox");
                });
              } else {
                var uniqueid = $(currentgallery).data("otto-htmlfivevideoname"); // to unload videojs
  
                // accessibility
                // make only lightbox tabbable
                $("[tabindex]").each(function() {
                    $(this).attr("tabindexold", $(this).attr("tabindex"))
                    $(this).attr("tabindex", "-1")
                });
                $("a, area, button, input, object, select, textarea, iframe").attr("tabindex", "-1");
  
                if ($(currentgallery).data("otto-youtubeid")) {
  
                  var youtubeid = $(currentgallery).data("otto-youtubeid");
                  if ($(currentgallery).data("otto-xbtrackeratlas")) {
                    var atlastag = 'data-otto-xbtrackeratlas="' + $(currentgallery).data("otto-xbtrackeratlas") + '"';
                  } else {
                    var atlastag = "";
                  }              
  
                  $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog">' +
                                           '<div class="lightboxcontainer">' +
                                           '<iframe class="ytplayer lightbox" tabindex="2" id="gallery-' + currentgalleryindex + '-player-' + youtubeid + 
                                           '" type="text/html" ' + atlastag + ' src="https://www.youtube-nocookie.com/embed/' + youtubeid + 
                                           '?enablejsapi=1&origin=https://' + youtubeorigin + '&rel=0"" frameborder="0" allowfullscreen></iframe>' + 
                                           '</div>' +
                                           '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window" tabindex="1">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                           '</div>' +
                                           '</div>');
                  $("body").append('<div id="page-cover"></div>');
                  $("#page-cover").show();
                  if (typeof lightboxcontainer !== "undefined") {
                    $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                  } 
  
                  var accLoc = {
                        "locales": {
                          "en-us": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "ar-ae": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "ar-sa": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "cs-cz": {
                            "keyOpentexttranscript": "OTEVŘÍT TEXTOVÝ PŘEPIS",
                            "keyClosetexttranscript": "ZAVŘÍT TEXTOVÝ PŘEPIS",
                            "keyWatchvideowithaudiode": "SLEDOVAT VIDEO SE ZVUKOVÝM POPISEM",
                            "keyClosevideo": "ZAVŘÍT VIDEO"
                          },
                          "da-dk": {
                            "keyOpentexttranscript": "ÅBN TEKSTAFSKRIFT",
                            "keyClosetexttranscript": "LUK TEKSTAFSKRIFT",
                            "keyWatchvideowithaudiode": "SE VIDEO MED LYDBESKRIVELSE",
                            "keyClosevideo": "LUK VIDEO"
                          },
                          "de-at": {
                            "keyOpentexttranscript": "UNTERTITEL EINBLENDEN",
                            "keyClosetexttranscript": "UNTERTITEL AUSBLENDEN",
                            "keyWatchvideowithaudiode": "VIDEO MIT ERLÄUTERUNGEN ANSEHEN",
                            "keyClosevideo": "VIDEO SCHLIESSEN"
                          },
                          "de-ch": {
                            "keyOpentexttranscript": "UNTERTITEL EINBLENDEN",
                            "keyClosetexttranscript": "UNTERTITEL AUSBLENDEN",
                            "keyWatchvideowithaudiode": "VIDEO MIT ERLÄUTERUNGEN ANSEHEN",
                            "keyClosevideo": "VIDEO SCHLIESSEN"
                          },
                          "de-de": {
                            "keyOpentexttranscript": "UNTERTITEL EINBLENDEN",
                            "keyClosetexttranscript": "UNTERTITEL AUSBLENDEN",
                            "keyWatchvideowithaudiode": "VIDEO MIT ERLÄUTERUNGEN ANSEHEN",
                            "keyClosevideo": "VIDEO SCHLIESSEN"
                          },
                          "el-gr": {
                            "keyOpentexttranscript": "ΑΝΟΙΓΜΑ ΑΠΟΜΑΓΝΗΤΟΦΩΝΗΜΕΝΟΥ ΚΕΙΜΕΝΟΥ",
                            "keyClosetexttranscript": "ΚΛΕΙΣΙΜΟ ΑΠΟΜΑΓΝΗΤΟΦΩΝΗΜΕΝΟΥ ΚΕΙΜΕΝΟΥ",
                            "keyWatchvideowithaudiode": "ΔΕΙΤΕ ΤΟ ΒΙΝΤΕΟ ΜΕ ΗΧΗΤΙΚΗ ΠΕΡΙΓΡΑΦΗ",
                            "keyClosevideo": "ΚΛΕΙΣΤΕ ΤΟ ΒΙΝΤΕΟ"
                          },
                          "en-au": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-ca": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-gb": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-hk": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-ie": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-in": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-nz": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-sg": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "en-za": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "es-ar": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIPCIÓN DE TEXTO",
                            "keyClosetexttranscript": "CERRAR TRANSCRIPCIÓN DE TEXTO",
                            "keyWatchvideowithaudiode": "MIRAR VIDEO CON DESCRIPCIÓN DE AUDIO",
                            "keyClosevideo": "CERRAR VIDEO"
                          },
                          "es-cl": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIPCIÓN DE TEXTO",
                            "keyClosetexttranscript": "CERRAR TRANSCRIPCIÓN DE TEXTO",
                            "keyWatchvideowithaudiode": "MIRAR VIDEO CON DESCRIPCIÓN DE AUDIO",
                            "keyClosevideo": "CERRAR VIDEO"
                          },
                          "es-co": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIPCIÓN DE TEXTO",
                            "keyClosetexttranscript": "CERRAR TRANSCRIPCIÓN DE TEXTO",
                            "keyWatchvideowithaudiode": "MIRAR VIDEO CON DESCRIPCIÓN DE AUDIO",
                            "keyClosevideo": "CERRAR VIDEO"
                          },
                          "es-es": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIPCIÓN TEXTUAL",
                            "keyClosetexttranscript": "CERRAR TRANSCRIPCIÓN TEXTUAL",
                            "keyWatchvideowithaudiode": "VER VÍDEO CON DESCRIPCIÓN DE AUDIO",
                            "keyClosevideo": "CERRAR VÍDEO"
                          },
                          "es-mx": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIPCIÓN DE TEXTO",
                            "keyClosetexttranscript": "CERRAR TRANSCRIPCIÓN DE TEXTO",
                            "keyWatchvideowithaudiode": "MIRAR VIDEO CON DESCRIPCIÓN DE AUDIO",
                            "keyClosevideo": "CERRAR VIDEO"
                          },
                          "fi-fi": {
                            "keyOpentexttranscript": "AVAA TEKSTITYS",
                            "keyClosetexttranscript": "SULJE TEKSTITYS",
                            "keyWatchvideowithaudiode": "KATSO VIDEO ÄÄNIKUVAUKSELLA",
                            "keyClosevideo": "SULJE VIDEO"
                          },
                          "fr-be": {
                            "keyOpentexttranscript": "OUVRIR TRANSCRIPTION",
                            "keyClosetexttranscript": "FERMER TRANSCRIPTION",
                            "keyWatchvideowithaudiode": "REGARDER LA VIDÉO AVEC AUDIODESCRIPTION",
                            "keyClosevideo": "FERMER LA VIDÉO"
                          },
                          "fr-ca": {
                            "keyOpentexttranscript": "OUVRIR LA TRANSCRIPTION",
                            "keyClosetexttranscript": "FERMER LA TRANSCRIPTION",
                            "keyWatchvideowithaudiode": "REGARDER LA VIDÉO AVEC DESCRIPTION SONORE",
                            "keyClosevideo": "FERMER LA VIDÉO"
                          },
                          "fr-ch": {
                            "keyOpentexttranscript": "OUVRIR TRANSCRIPTION",
                            "keyClosetexttranscript": "FERMER TRANSCRIPTION",
                            "keyWatchvideowithaudiode": "REGARDER LA VIDÉO AVEC AUDIODESCRIPTION",
                            "keyClosevideo": "FERMER LA VIDÉO"
                          },
                          "fr-fr": {
                            "keyOpentexttranscript": "OUVRIR TRANSCRIPTION",
                            "keyClosetexttranscript": "FERMER TRANSCRIPTION",
                            "keyWatchvideowithaudiode": "REGARDER LA VIDÉO AVEC AUDIODESCRIPTION",
                            "keyClosevideo": "FERMER LA VIDÉO"
                          },
                          "he-il": {
                            "keyOpentexttranscript": "OPEN TEXT TRANSCRIPT",
                            "keyClosetexttranscript": "CLOSE TEXT TRANSCRIPT",
                            "keyWatchvideowithaudiode": "WATCH VIDEO WITH AUDIO DESCRIPTION",
                            "keyClosevideo": "CLOSE VIDEO"
                          },
                          "hu-hu": {
                            "keyOpentexttranscript": "SZÖVEGES ÁTIRAT MEGNYITÁSA",
                            "keyClosetexttranscript": "SZÖVEGES ÁTIRAT BEZÁRÁSA",
                            "keyWatchvideowithaudiode": "VIDEÓ MEGTEKINTÉSE HANGOS LEÍRÁSSAL",
                            "keyClosevideo": "VIDEÓ BEZÁRÁSA"
                          },
                          "it-it": {
                            "keyOpentexttranscript": "APRI TRASCRIZIONE TESTO",
                            "keyClosetexttranscript": "CHIUDI TRASCRIZIONE TESTO",
                            "keyWatchvideowithaudiode": "GUARDA VIDEO CON DESCRIZIONE AUDIO",
                            "keyClosevideo": "CHIUDI VIDEO"
                          },
                          "ja-jp": {
                            "keyOpentexttranscript": "テキスト チャット内容を開く",
                            "keyClosetexttranscript": "テキスト チャット内容を閉じる",
                            "keyWatchvideowithaudiode": "音声による説明付きでビデオを見る",
                            "keyClosevideo": "ビデオを閉じる"
                          },
                          "ko-kr": {
                            "keyOpentexttranscript": "자막 열기",
                            "keyClosetexttranscript": "자막 닫기",
                            "keyWatchvideowithaudiode": "오디오 설명으로 비디오 보기",
                            "keyClosevideo": "비디오 닫기"
                          },
                          "nb-no": {
                            "keyOpentexttranscript": "ÅPNE TEKSTAVSKRIFT",
                            "keyClosetexttranscript": "LUKK TEKSTAVSKRIFT",
                            "keyWatchvideowithaudiode": "SE VIDEO MED LYDBESKRIVELSE",
                            "keyClosevideo": "LUKK VIDEO"
                          },
                          "nl-be": {
                            "keyOpentexttranscript": "TEKSTTRANSCRIPTIE OPENEN",
                            "keyClosetexttranscript": "TEKSTTRANSCRIPTIE SLUITEN",
                            "keyWatchvideowithaudiode": "VIDEO MET AUDIOBESCHRIJVINGEN BEKIJKEN",
                            "keyClosevideo": "VIDEO SLUITEN"
                          },
                          "nl-nl": {
                            "keyOpentexttranscript": "TEKSTTRANSCRIPTIE OPENEN",
                            "keyClosetexttranscript": "TEKSTTRANSCRIPTIE SLUITEN",
                            "keyWatchvideowithaudiode": "VIDEO MET AUDIOBESCHRIJVINGEN BEKIJKEN",
                            "keyClosevideo": "VIDEO SLUITEN"
                          },
                          "pl-pl": {
                            "keyOpentexttranscript": "OTWÓRZ TRANSKRYPCJĘ TEKSTU",
                            "keyClosetexttranscript": "ZAMKNIJ TRANSKRYPCJĘ TEKSTU",
                            "keyWatchvideowithaudiode": "OBEJRZYJ FILM Z OPISEM DŹWIĘKOWYM",
                            "keyClosevideo": "WYŁĄCZ FILM"
                          },
                          "pt-br": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIÇÃO DO TEXTO",
                            "keyClosetexttranscript": "FECHAR TRANSCRIÇÃO DO TEXTO",
                            "keyWatchvideowithaudiode": "ASSISTA AO VÍDEO COM DESCRIÇÃO DO ÁUDIO",
                            "keyClosevideo": "FECHAR VÍDEO"
                          },
                          "pt-pt": {
                            "keyOpentexttranscript": "ABRIR TRANSCRIÇÃO DE TEXTO",
                            "keyClosetexttranscript": "FECHAR TRANSCRIÇÃO DE TEXTO",
                            "keyWatchvideowithaudiode": "VER VÍDEO COM DESCRIÇÃO DE ÁUDIO",
                            "keyClosevideo": "FECHAR VÍDEO"
                          },
                          "ru-ru": {
                            "keyOpentexttranscript": "ОТКРЫТЬ ТЕКСТОВУЮ РАСШИФРОВКУ",
                            "keyClosetexttranscript": "ЗАКРЫТЬ ТЕКСТОВУЮ РАСШИФРОВКУ",
                            "keyWatchvideowithaudiode": "СМОТРЕТЬ ВИДЕО С РАСШИФРОВКОЙ ЗВУКА",
                            "keyClosevideo": "ЗАКРЫТЬ ВИДЕО"
                          },
                          "sk-sk": {
                            "keyOpentexttranscript": "OTVORIŤ PREPIS TEXTU",
                            "keyClosetexttranscript": "ZAVRIEŤ PREPIS TEXTU",
                            "keyWatchvideowithaudiode": "SLEDOVAŤ VIDEO SO ZVUKOVÝM POPISOM",
                            "keyClosevideo": "ZAVRIEŤ VIDEO"
                          },
                          "sv-se": {
                            "keyOpentexttranscript": "ÖPPNA TEXTTRANSKRIPTION",
                            "keyClosetexttranscript": "STÄNG TEXTTRANSKRIPTION",
                            "keyWatchvideowithaudiode": "SE VIDEO MED LJUDBESKRIVNINGAR",
                            "keyClosevideo": "STÄNG VIDEO"
                          },
                          "tr-tr": {
                            "keyOpentexttranscript": "METİN DEŞİFRESİNİ AÇ",
                            "keyClosetexttranscript": "METİN DEŞİFRESİNİ KAPAT",
                            "keyWatchvideowithaudiode": "VİDEOYU SES AÇIKLAMASIYLA BİRLİKTE İZLE",
                            "keyClosevideo": "VİDEOYU KAPAT"
                          },
                          "zh-cn": {
                            "keyOpentexttranscript": "打开文本副本",
                            "keyClosetexttranscript": "关闭文本副本",
                            "keyWatchvideowithaudiode": "观看带音频解说的视频",
                            "keyClosevideo": "关闭视频"
                          },
                          "zh-hk": {
                            "keyOpentexttranscript": "開啟文字抄本稿",
                            "keyClosetexttranscript": "關閉文字抄本稿",
                            "keyWatchvideowithaudiode": "觀看影片連語音說明",
                            "keyClosevideo": "關閉影片"
                          },
                          "zh-tw": {
                            "keyOpentexttranscript": "開啟文字檔",
                            "keyClosetexttranscript": "關閉文字檔",
                            "keyWatchvideowithaudiode": "搭配音訊描述觀賞影片",
                            "keyClosevideo": "關閉影片"
                          }
                        }
                      }
  
                  var regionaccLoc = accLoc.locales[urlRegion];
  
                  if (textcontainer !== "" && textcontainer != undefined) {
                    $(".lightboxcontainer").append('<a href="#" class="c-call-to-action c-glyph f-lightweight textDescOpen" aria-label="open text description of video" tabindex="0">' +
                                '<span data-open="' + regionaccLoc["keyOpentexttranscript"] + '" data-close="' + regionaccLoc["keyClosetexttranscript"] + '">' + regionaccLoc["keyOpentexttranscript"] + '</span>' +
                            '</a>');
                    $(".textDescOpen").click(function(e) {
                      e.preventDefault();
                      if ($(this).find("span").text() === $(this).find("span").data("open")) {
                        $(textcontainer).clone().appendTo(".lightboxcontainer");
                        $(".lightboxcontainer .ottoTextDesc").show();
                        $(this).find("span").text($(this).find("span").data("close"));
                      } else {
                        $(".lightboxcontainer " + textcontainer).remove();
                        $(this).find("span").text($(this).find("span").data("open"));
                      }
                    })
                  }
                  if (altaudioid !== "" && altaudioid != undefined) {
                    $(".lightboxcontainer").append('<a href="#" class="c-call-to-action c-glyph f-lightweight altaudioOpen" aria-label="open alternate audio video" tabindex="0">' +
                                '<span data-open="' + regionaccLoc["keyWatchvideowithaudiode"] + '" data-close="' + regionaccLoc["keyClosevideo"] + '">' + regionaccLoc["keyWatchvideowithaudiode"] + '</span>' +
                            '</a>');
                    $(".altaudioOpen").click(function(e) {
                      e.preventDefault();
                      if ($(this).find("span").text() === $(this).find("span").data("open")) {
                        $(".lightboxcontainer iframe").attr("src", 'https://www.youtube-nocookie.com/embed/' + altaudioid + '?enablejsapi=1&origin=https://' + youtubeorigin + '&rel=0')
                        $(this).find("span").text($(this).find("span").data("close"));
                      } else {
                        $(".lightboxcontainer iframe").attr("src", 'https://www.youtube-nocookie.com/embed/' + youtubeid + '?enablejsapi=1&origin=https://' + youtubeorigin + '&rel=0')
                        $(this).find("span").text($(this).find("span").data("open"));
                      }
                    })
                  }
  
  
                  // if (lightboxopentype === "tabbed") {
                  //   $(".lightboxclosebutton").focus();
                  //   lightboxopentype = "";
                  // }
                  $(".lightboxclosebutton").first().focus();
  
                  //onYouTubeLightboxReady();
  
                } else if ($(currentgallery).data("otto-htmlfivevideoname")) {
                  var html5mp4 = $(currentgallery).data("otto-video-mp4");
                  var html5webm = $(currentgallery).data("otto-video-webm");
                  var html5ogg = $(currentgallery).data("otto-video-ogg");
                  var html5error = "Sorry, your browser does not support this video.";
  
                  // set up video's preroll image
                  var prerollurl = $(currentgallery).data("otto-videopreroll");
                  if ($(currentgallery).attr("data-otto-videopreroll-time")) {
                    var prerolltime = $(currentgallery).data("otto-videopreroll-time");
                  } else {
                    var prerolltime = 3000;
                  }
                  
                  // video pre-roll
                  // make only lightbox tabbable
                  $("[tabindex]").each(function() {
                      $(this).attr("tabindexold", $(this).attr("tabindex"))
                      $(this).attr("tabindex", "-1")
                  });
                  $("a, area, button, input, object, select, textarea").attr("tabindex", "-1");
                  if ($(currentgallery).attr("data-otto-videopreroll")) {
                    $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog">' +
                                             '<div class="lightboxcontainer">' +
                                             '<img id="preroll-' + lightboxid + '" src="' + prerollurl + '" style="width: 100%">' +
                                             '<div class="html5playbuttoncontainerlightbox" aria-label="Play the video">' + 
                                             '<img class="videoplaybutton" src="https://assets.xboxservices.com/assets/0f/8e/0f8ec64d-27e7-49cd-b8c8-ceb0d239b334.png?n=playbutton.png">' + 
                                             '</div>' +
                                             '</div>' +
                                             '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window" tabindex="1">' +
                                             // '<img id="lbclosebutton" ' + 
                                             // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                             '</div>' +
                                             '</div>');
                    $("body").append('<div id="page-cover"></div>');
                    
                    $("#page-cover").show();
                    if (typeof lightboxcontainer !== "undefined") {
                      $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                    } 
  
                    $(".html5playbuttoncontainerlightbox").click(function() {
                      // console.log("play button clicked")
                      $(".html5playbuttoncontainerlightbox").remove();
                      $("#preroll-" + lightboxid).remove();
                      $(".lightboxcontainer").append('<video tabindex="2" controls id="' + uniqueid + '" class="html5playerlightbox" data-setup="{}" width="auto" height="auto" autoplay><source src="' + 
                                               html5mp4 + '" type="video/mp4"><source src="' + html5webm + '" type="video/webm"><source src="' + 
                                               html5ogg + '" type="video/ogg">' + html5error + '</video>');
                      // videojs(uniqueid, {}, function(){
                      //         // Player (this) is initialized and ready.
                      // });
  
                    })
  
                  } else {
  
                    $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog">' +
                                             '<div class="lightboxcontainer">' +
                                             '<video tabindex="2" controls id="' + uniqueid + '" class="html5playerlightbox" data-setup="{}" width="auto" height="auto"><source src="' + 
                                             html5mp4 + '" type="video/mp4"><source src="' + html5webm + '" type="video/webm"><source src="' + 
                                             html5ogg + '" type="video/ogg">' + html5error + '</video>' + 
                                             '</div>' +
                                             '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window" tabindex="1">' +
                                             // '<img id="lbclosebutton" ' + 
                                             // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                             '</div>' +
                                             '</div>');
                      $(".lightboxclosebutton").first().focus();
                    // videojs(uniqueid, {}, function(){
                    //         // Player (this) is initialized and ready.
                    // });
                    $("body").append('<div id="page-cover"></div>');
                    $("#page-cover").show();
                    if (typeof lightboxcontainer !== "undefined") {
                      $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                    } 
  
                  }
  
                  $(".lightboxclosebutton").first().focus();
  
                } else if ($(currentgallery).data("otto-wirewaxid")) {
  
                  var wirewaxid = $(this).data("otto-wirewaxid");
                  ottoidtitle = $(this).data("otto-thevidname");
                  $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog" aria-label="' + ottoidtitle + '">' +
                                           '<div class="lightboxcontainer">' +
                                           '<iframe class="wirewaxplayer" src="http://www.wirewax.com/embed/' + wirewaxid + 
                                           '/000000" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen data-appid="XboxWeb"></iframe>' + 
                                           '</div>' +
                                           '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                           '</div>' +
                                           '</div>');
                  $("body").append('<div id="page-cover"></div>');
                  $("#page-cover").show();
                  if (typeof lightboxcontainer !== "undefined") {
                    $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                  } 
  
                } else if ($(currentgallery).data("otto-zentrickid")) {
  
                  var zentrickid = $(this).data("otto-zentrickid");
                  ottoidtitle = $(this).data("otto-thevidname");
                  $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog" aria-label="' + ottoidtitle + '">' +
                                           '<div class="lightboxcontainer">' +
                                           '<iframe class="wirewaxplayer" src="https://watch.zentrick.com/' + zentrickid + 
                                           '" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen data-appid="XboxWeb"></iframe>' + 
                                           '</div>' +
                                           '<div class="lightboxclosebutton c-glyph glyph-cancel" aria-label="close video window">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png"' +
                                           '</div>' +
                                           '</div>');
                  $("body").append('<div id="page-cover"></div>');
                  $("#page-cover").show();
                  if (typeof lightboxcontainer !== "undefined") {
                    $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                  } 
  
                } else if ($(currentgallery).data("otto-iframe-src")) {
  
                  var iframesrc = $(this).data("otto-iframe-src");
                  ottoidtitle = $(this).data("otto-thevidname");
                  // $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog" aria-label="' + ottoidtitle + '">' +
                  $(currentgallery).before('<div class="lightboxcontent" id="content-' + lightboxid + '" role="dialog" aria-modal="true" aria-label="' + ottoidtitle + '">' +
                                           '<button class="lightboxclosebutton lbclose1 c-glyph glyph-cancel" aria-label="close video window" tabindex="0">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png">' +
                                           '</button>' +
                                           '<div class="lightboxcontainer">' +
                                           '<iframe class="wirewaxplayer" src="' + iframesrc + 
                                           '" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen tabindex="0" aria-label="' + ottoidtitle + '" data-appid="XboxWeb"></iframe>' + 
                                           '</div>' +
                                           '<div class="lightboxclosebutton lbclose2" tabindex="0" aria-hidden="true">' +
                                           // '<img id="lbclosebutton" ' + 
                                           // 'src="https://compass-ssl.xbox.com/assets/53/9d/539d5bb9-97b1-4a3b-b03e-e74a0e063ef1.png?n=Global-Resources-UI_X-Button_White-X-Black-Background_43x43.png">' +
                                           '</div>' +
                                           '</div>');
                  $("body").append('<div id="page-cover"></div>');
                  $("#page-cover").show();
  
                  if (typeof lightboxcontainer !== "undefined") {
                    $(".lightboxcontent").detach().appendTo(lightboxcontainer);
                  } 
                }
  
                checklightboxheight();
  
                setTimeout(function() { // with second close button
  
                  $(".lbclose2")[0].addEventListener("focus", function() {
                    // console.log("lbclose2 received focus")
                    $(".lbclose1")[0].focus()
                  })
  
                  // $(".wirewaxplayer")[0].addEventListener("focus", function() {
                  //   console.log("iframe received focus")
                  //   $(".lbclose2").attr("tabindex", "0")
                  // })
                  // $(".lbclose1")[0].addEventListener("focusout", function() {
                  //   setTimeout(function() {
                  //     console.log("lbclose1 left focus")
                  //     $(".lbclose2").attr("tabindex", "0")
                  //   }, 20)
                  // })                
                  // $(".lbclose1")[0].addEventListener("focus", function() {
                  //   console.log("lbclose1 received focus")
                  //   $(".lbclose2").attr("tabindex", "-1")
                  // })
  
                  /*redirect first shift+tab to last input*/
                  $(document).on('keydown', ".lbclose1", function (e) {
                    keyevent = e;
                    if (e.key === "Tab") {
                      var docurl = document.URL.toLowerCase();
                      if (userAgentString.indexOf("Trident") !== -1 || userAgentString.indexOf("Firefox") !== -1) {
                        // e.preventDefault();
                        // setTimeout(function() {
                        //   $(".wirewaxplayer")[0].focus();
                        // }, 10)
                        if (e.shiftKey) {
                          if ($(".wirewaxplayer").attr("src").toLowerCase().indexOf("xbox.com") === -1 || 
                               docurl.indexOf("origin-") !== -1) {
                            e.preventDefault();
                            setTimeout(function() {
                              $(".wirewaxplayer")[0].focus();
                            }, 10)
                          } else {
                            e.preventDefault();
                            setTimeout(function() {
                              if ($("iframe.wirewaxplayer").contents().find(".f-video-trigger").attr("aria-hidden") === "false") {
                                $("iframe.wirewaxplayer").contents().find("button.f-play-trigger")[0].focus()
                              } else {
                                $(".wirewaxplayer").contents().find("button").last()[0].focus();
                              }
                              
                            }, 10)
                          }
                        }
                      } else if (e.shiftKey) {
                        if ($(".wirewaxplayer").attr("src").toLowerCase().indexOf("xbox.com") === -1 || 
                               docurl.indexOf("origin-") !== -1) {
                            e.preventDefault();
                            $(".wirewaxplayer")[0].focus();
                        } else {
                          if ($("iframe.wirewaxplayer").contents().find(".f-video-trigger").attr("aria-hidden") === "false") {
                            e.preventDefault();
                            $("iframe.wirewaxplayer").contents().find("button.f-play-trigger")[0].focus()
                          } else {
                            e.preventDefault();
                            $(".wirewaxplayer").contents().find("button").last()[0].focus();
                          }
                        }
                      } 
                    }
                      
                  });
  
                  
                }, 250)
  
                // setTimeout(function() {
                //   var inputs = $(".lightboxcontent").find('div[tabindex], a, area, button, input, object, select, textarea, iframe');
                //   console.log(inputs)
                //   var firstInput = $(".lightboxcontent .lightboxclosebutton");
                //   var lastInput = $(".lightboxcontent iframe").find("button").last();
  
                //   /*set focus on first input*/
                //   //firstInput.focus();
  
                //   /*redirect last tab to first input*/
                //   $(document).on('keydown', lastInput, function (e) {
                //      if ((e.keyCode === 9 && !e.shiftKey)) {
                //         var firstInput = $(".lightboxcontent .lightboxclosebutton");
                //         var lastInput = $(".lightboxcontent iframe").find("button").last();
                //          e.preventDefault();
                //          $(firstInput).focus();
                //          console.log("tabbing from last")
                //      }
                //   });
  
                //   /*redirect first shift+tab to last input*/
                //   $(document).on('keydown', firstInput, function (e) {
                //       if ((e.keyCode === 9 && e.shiftKey)) {
                //           var firstInput = $(".lightboxcontent .lightboxclosebutton");
                //   var lastInput = $(".lightboxcontent iframe").find("button").last();
                //           e.preventDefault();
                //           $(lastInput).focus();
                //           console.log("shift tabbing from first")
                //       }
                //   });
                // }, 2000)
  
                $(".lightboxclosebutton").first().focus();
  
                var closeLightbox = function() {
                  $(".lightboxcontent").remove();
                  $("#page-cover").remove();
                  if ($(currentgallery).data("otto-youtubeid")) {
                     if (typeof(ottoYTTimeCheck) !== 'undefined') {
                    clearInterval(ottoYTTimeCheck);
                  }
                  } else if ($(currentgallery).data("otto-htmlfivevideoname")) {
                    // videojs(uniqueid).dispose();
                  }
  
                  // restore tab order
                  $("a, area, button, input, object, select, textarea, iframe").attr("tabindex", "0");
                  $("[tabindexold]").each(function() {
                      $(this).attr("tabindex", $(this).attr("tabindexold"))
                  });
                  lbtabonly = 0;
                }
  
                $(".lightboxclosebutton").on("click", function() {
                  closeLightbox();
                  if ($(currentgallery).find("[tabindex]").length === 0) {
                    $(currentgallery).focus();
                  } else {
                    $(currentgallery).find("[tabindex]").eq(0).focus();
                  }
                });
  
                $(".lightboxclosebutton").on("keypress", function(event) {
                  if((event.keyCode == 13) || (event.keyCode== 32)){
                    closeLightbox();
                    if ($(currentgallery).find("[tabindex]").length === 0) {
                      $(currentgallery).focus();
                    } else {
                      $(currentgallery).find("[tabindex]").eq(0).focus();
                    }
                  }
                });
  
                if (escapeflag === 0) {
                  $(document).on("keydown", function(event) {
                    if (event.keyCode === 27) {
                      console.log("pressed escape")
                      escapeflag++;
                      if ($(".lightboxclosebutton").length > 0) {
                        $(".lightboxclosebutton").click();
  
                      }
                    }
                  });
                }
  
                if (agegate && agegateforlbactive == true) {
                  ageGate("#content-" + lightboxid);
                }
              } 
  
              // vertical placement of lightbox video
              $(".lightboxcontent").css("margin-top", lightboxvertical);
              $("#page-cover").click(function() {
                $("#page-cover").remove();
                closeLightbox();
              });
            });
  
            $(".OttoGallery[data-otto-type='lightbox']").on("keydown", function(event) {
              if((event.keyCode == 13) || (event.keyCode== 32)){
                if (lbtabonly === 0) {
                  event.preventDefault();
                  lightboxopentype = "tabbed"
                  $(this).click(); 
                  lbtabonly = 1;
                }       
              }
            })
  
            //// end lightbox type gallery ////
          } 
  
          function ageGate(lightboxcontentid, callback) {
            var urlRegion = document.URL.toLowerCase().split("xbox.com/")[1].slice(0, 5);
            var agLoc = {
              "locales": {
                "en-us": {
                  "keyPleaseenteryourbirthd": "Please enter your birthdate to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-ca": {
                  "keyPleaseenteryourbirthd": "Please enter your birthdate to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "ar-sa": {
                  "keyPleaseenteryourbirthd": "Please enter your birthdate to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "ar-ae": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "cs-cz": {
                  "keyPleaseenteryourbirthd": "Pokračujte zadáním svého data narození",
                  "keyMonth": "Měsíc",
                  "keyDay": "Den",
                  "keyYear": "Rok",
                  "keyEnter": "Zadat",
                  "keyPleaseenteravaliddate": "Pokračujte zadáním platného data",
                  "keyPleaseenteranumberine": "Do všech polí zadejte čísla",
                  "keyYouarenotallowedtovie": "Nemáte povoleno zobrazit tento obsah."
                },
                "da-dk": {
                  "keyPleaseenteryourbirthd": "Skriv din fødselsdato for at fortsætte",
                  "keyMonth": "Måned",
                  "keyDay": "Dag",
                  "keyYear": "År",
                  "keyEnter": "Ok",
                  "keyPleaseenteravaliddate": "Skriv en gyldig dato for at fortsætte",
                  "keyPleaseenteranumberine": "Skriv et tal i hvert felt",
                  "keyYouarenotallowedtovie": "Du har ikke tilladelse til at se dette indhold."
                },
                "de-at": {
                  "keyPleaseenteryourbirthd": "Gib bitte dein Geburtsdatum ein, um fortzufahren.",
                  "keyMonth": "Monat",
                  "keyDay": "Tag",
                  "keyYear": "Jahr",
                  "keyEnter": "WEITER",
                  "keyPleaseenteravaliddate": "Gib bitte ein gültiges Datum ein, um fortzufahren.",
                  "keyPleaseenteranumberine": "Gib bitte in jedem Feld eine Zahl ein.",
                  "keyYouarenotallowedtovie": "Es tut uns leid, aber du bist zu jung für diese Inhalte."
                },
                "de-ch": {
                  "keyPleaseenteryourbirthd": "Gib bitte dein Geburtsdatum ein, um fortzufahren.",
                  "keyMonth": "Monat",
                  "keyDay": "Tag",
                  "keyYear": "Jahr",
                  "keyEnter": "WEITER",
                  "keyPleaseenteravaliddate": "Gib bitte ein gültiges Datum ein, um fortzufahren.",
                  "keyPleaseenteranumberine": "Gib bitte in jedem Feld eine Zahl ein.",
                  "keyYouarenotallowedtovie": "Es tut uns leid, aber du bist zu jung für diese Inhalte."
                },
                "de-de": {
                  "keyPleaseenteryourbirthd": "Gib bitte dein Geburtsdatum ein, um fortzufahren.",
                  "keyMonth": "Monat",
                  "keyDay": "Tag",
                  "keyYear": "Jahr",
                  "keyEnter": "WEITER",
                  "keyPleaseenteravaliddate": "Gib bitte ein gültiges Datum ein, um fortzufahren.",
                  "keyPleaseenteranumberine": "Gib bitte in jedem Feld eine Zahl ein.",
                  "keyYouarenotallowedtovie": "Es tut uns leid, aber du bist zu jung für diese Inhalte."
                },
                "el-gr": {
                  "keyPleaseenteryourbirthd": "Για να συνεχίσετε, καταχωρίστε την ημερομηνία γέννησής σας",
                  "keyMonth": "Μήνας",
                  "keyDay": "Ημέρα",
                  "keyYear": "Έτος",
                  "keyEnter": "Εισαγωγή",
                  "keyPleaseenteravaliddate": "Για να συνεχίσετε, καταχωρίστε μια έγκυρη ημερομηνία",
                  "keyPleaseenteranumberine": "Καταχωρίστε έναν αριθμό σε κάθε πεδίο",
                  "keyYouarenotallowedtovie": "Δεν επιτρέπεται η προβολή του εν λόγω περιεχομένου."
                },
                "en-au": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-gb": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-hk": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-ie": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-in": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-nz": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-sg": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "en-za": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "es-ar": {
                  "keyPleaseenteryourbirthd": "Ingresa tu fecha de nacimiento para continuar",
                  "keyMonth": "Mes",
                  "keyDay": "Día",
                  "keyYear": "Año",
                  "keyEnter": "Ingresar",
                  "keyPleaseenteravaliddate": "Ingresa una fecha válida para continuar",
                  "keyPleaseenteranumberine": "Ingresa un número en cada campo",
                  "keyYouarenotallowedtovie": "No tienes permitido ver este contenido."
                },
                "es-cl": {
                  "keyPleaseenteryourbirthd": "Ingresa tu fecha de nacimiento para continuar",
                  "keyMonth": "Mes",
                  "keyDay": "Día",
                  "keyYear": "Año",
                  "keyEnter": "Ingresar",
                  "keyPleaseenteravaliddate": "Ingresa una fecha válida para continuar",
                  "keyPleaseenteranumberine": "Ingresa un número en cada campo",
                  "keyYouarenotallowedtovie": "No tienes permitido ver este contenido."
                },
                "es-co": {
                  "keyPleaseenteryourbirthd": "Ingresa tu fecha de nacimiento para continuar",
                  "keyMonth": "Mes",
                  "keyDay": "Día",
                  "keyYear": "Año",
                  "keyEnter": "Ingresar",
                  "keyPleaseenteravaliddate": "Ingresa una fecha válida para continuar",
                  "keyPleaseenteranumberine": "Ingresa un número en cada campo",
                  "keyYouarenotallowedtovie": "No tienes permitido ver este contenido."
                },
                "es-es": {
                  "keyPleaseenteryourbirthd": "Escribe tu fecha de nacimiento para continuar",
                  "keyMonth": "Mes",
                  "keyDay": "Día",
                  "keyYear": "Año",
                  "keyEnter": "Entrar",
                  "keyPleaseenteravaliddate": "Escribe una fecha válida para continuar",
                  "keyPleaseenteranumberine": "Escribe un número en cada campo",
                  "keyYouarenotallowedtovie": "No tienes permiso para ver este contenido."
                },
                "es-mx": {
                  "keyPleaseenteryourbirthd": "Ingresa tu fecha de nacimiento para continuar",
                  "keyMonth": "Mes",
                  "keyDay": "Día",
                  "keyYear": "Año",
                  "keyEnter": "Ingresar",
                  "keyPleaseenteravaliddate": "Ingresa una fecha válida para continuar",
                  "keyPleaseenteranumberine": "Ingresa un número en cada campo",
                  "keyYouarenotallowedtovie": "No tienes permitido ver este contenido."
                },
                "fi-fi": {
                  "keyPleaseenteryourbirthd": "Jatka antamalla syntymäaikasi",
                  "keyMonth": "Kuukausi",
                  "keyDay": "Päivä",
                  "keyYear": "Vuosi",
                  "keyEnter": "Lähetä",
                  "keyPleaseenteravaliddate": "Jatka antamalla kelvollinen päivämäärä",
                  "keyPleaseenteranumberine": "Kirjoita numero jokaiseen kenttään",
                  "keyYouarenotallowedtovie": "Tämän sisällön katsominen on sinulta kielletty."
                },
                "fr-be": {
                  "keyPleaseenteryourbirthd": "Saisissez votre date de naissance pour continuer",
                  "keyMonth": "Mois",
                  "keyDay": "Jour",
                  "keyYear": "Année",
                  "keyEnter": "Entrer",
                  "keyPleaseenteravaliddate": "Saisissez une date valide pour continuer",
                  "keyPleaseenteranumberine": "Saisissez un nombre dans chaque champ",
                  "keyYouarenotallowedtovie": "Vous n'êtes pas autorisé à visionner ce contenu."
                },
                "fr-ca": {
                  "keyPleaseenteryourbirthd": "Veuillez entrer votre date de naissance pour continuer",
                  "keyMonth": "Mois",
                  "keyDay": "Jour",
                  "keyYear": "Année",
                  "keyEnter": "Entrer",
                  "keyPleaseenteravaliddate": "Veuillez entrer une date valide pour continuer",
                  "keyPleaseenteranumberine": "Veuillez entrer un chiffre dans chaque champ",
                  "keyYouarenotallowedtovie": "Vous n’êtes pas autorisé à visionner ce contenu."
                },
                "fr-ch": {
                  "keyPleaseenteryourbirthd": "Saisissez votre date de naissance pour continuer",
                  "keyMonth": "Mois",
                  "keyDay": "Jour",
                  "keyYear": "Année",
                  "keyEnter": "Entrer",
                  "keyPleaseenteravaliddate": "Saisissez une date valide pour continuer",
                  "keyPleaseenteranumberine": "Saisissez un nombre dans chaque champ",
                  "keyYouarenotallowedtovie": "Vous n'êtes pas autorisé à visionner ce contenu."
                },
                "fr-fr": {
                  "keyPleaseenteryourbirthd": "Saisissez votre date de naissance pour continuer",
                  "keyMonth": "Mois",
                  "keyDay": "Jour",
                  "keyYear": "Année",
                  "keyEnter": "Entrer",
                  "keyPleaseenteravaliddate": "Saisissez une date valide pour continuer",
                  "keyPleaseenteranumberine": "Saisissez un nombre dans chaque champ",
                  "keyYouarenotallowedtovie": "Vous n'êtes pas autorisé à visionner ce contenu."
                },
                "he-il": {
                  "keyPleaseenteryourbirthd": "Please enter your date of birth to continue",
                  "keyMonth": "Month",
                  "keyDay": "Day",
                  "keyYear": "Year",
                  "keyEnter": "Enter",
                  "keyPleaseenteravaliddate": "Please enter a valid date to continue",
                  "keyPleaseenteranumberine": "Please enter a number in every field",
                  "keyYouarenotallowedtovie": "You are not allowed to view this content."
                },
                "hu-hu": {
                  "keyPleaseenteryourbirthd": "A folytatáshoz add meg a születésed dátumát",
                  "keyMonth": "Hónap",
                  "keyDay": "Nap",
                  "keyYear": "Év",
                  "keyEnter": "Belépés",
                  "keyPleaseenteravaliddate": "A folytatáshoz adj meg egy érvényes dátumot",
                  "keyPleaseenteranumberine": "Írj be egy érvényes számot mindegyik mezőbe",
                  "keyYouarenotallowedtovie": "Nincs jogod megtekinteni ezt a tartalmat."
                },
                "it-it": {
                  "keyPleaseenteryourbirthd": "Inserisci la tua data di nascita per continuare",
                  "keyMonth": "Mese",
                  "keyDay": "Giorno",
                  "keyYear": "Anno",
                  "keyEnter": "Entra",
                  "keyPleaseenteravaliddate": "Inserisci un valore valido per la data per continuare",
                  "keyPleaseenteranumberine": "Immetti un numero in ciascun campo",
                  "keyYouarenotallowedtovie": "Non sei autorizzato a visualizzare questo contenuto."
                },
                "ja-jp": {
                  "keyPleaseenteryourbirthd": "続行するには、生年月日を入力してください",
                  "keyMonth": "月",
                  "keyDay": "日",
                  "keyYear": "年",
                  "keyEnter": "入力",
                  "keyPleaseenteravaliddate": "続行するには、有効な日付を入力してください",
                  "keyPleaseenteranumberine": "各フィールドに数字を入力してください",
                  "keyYouarenotallowedtovie": "このコンテンツを表示する許可がありません"
                },
                "ko-kr": {
                  "keyPleaseenteryourbirthd": "계속하려면 생일을 입력해 주세요.",
                  "keyMonth": "월",
                  "keyDay": "일",
                  "keyYear": "연도",
                  "keyEnter": "입력",
                  "keyPleaseenteravaliddate": "계속하려면 유효한 날짜를 입력해 주세요.",
                  "keyPleaseenteranumberine": "모든 영역에 숫자를 입력해 주세요.",
                  "keyYouarenotallowedtovie": "이 콘텐츠를 볼 수 있는 권한이 없습니다."
                },
                "nb-no": {
                  "keyPleaseenteryourbirthd": "Oppgi fødselsdatoen din for å fortsette",
                  "keyMonth": "Måned",
                  "keyDay": "Dag",
                  "keyYear": "År",
                  "keyEnter": "Send",
                  "keyPleaseenteravaliddate": "Angi en gyldig dato for å fortsette",
                  "keyPleaseenteranumberine": "Angi et tall i hvert felt",
                  "keyYouarenotallowedtovie": "Du har ikke tillatelse til å se dette innholdet."
                },
                "nl-be": {
                  "keyPleaseenteryourbirthd": "Voer je geboortedatum in om door te gaan",
                  "keyMonth": "Maand",
                  "keyDay": "Dag",
                  "keyYear": "Jaar",
                  "keyEnter": "Bezoek",
                  "keyPleaseenteravaliddate": "Voer een geldige datum in om door te gaan",
                  "keyPleaseenteranumberine": "Voer in elk veld een getal in",
                  "keyYouarenotallowedtovie": "Je hebt geen toestemming om deze content te bekijken."
                },
                "nl-nl": {
                  "keyPleaseenteryourbirthd": "Voer je geboortedatum in om door te gaan",
                  "keyMonth": "Maand",
                  "keyDay": "Dag",
                  "keyYear": "Jaar",
                  "keyEnter": "Bezoek",
                  "keyPleaseenteravaliddate": "Voer een geldige datum in om door te gaan",
                  "keyPleaseenteranumberine": "Voer in elk veld een getal in",
                  "keyYouarenotallowedtovie": "Je hebt geen toestemming om deze content te bekijken."
                },
                "pl-pl": {
                  "keyPleaseenteryourbirthd": "Podaj datę urodzenia, aby kontynuować",
                  "keyMonth": "Miesiąc",
                  "keyDay": "Dzień",
                  "keyYear": "Rok",
                  "keyEnter": "Wpisz",
                  "keyPleaseenteravaliddate": "Podaj prawidłową datę, aby kontynuować",
                  "keyPleaseenteranumberine": "Wpisz liczbę w każdym polu",
                  "keyYouarenotallowedtovie": "Nie masz dostępu do tych treści."
                },
                "pt-br": {
                  "keyPleaseenteryourbirthd": "Insira sua data de nascimento para continuar",
                  "keyMonth": "Mês",
                  "keyDay": "Dia",
                  "keyYear": "Ano",
                  "keyEnter": "Participe",
                  "keyPleaseenteravaliddate": "Insira uma data válida para continuar",
                  "keyPleaseenteranumberine": "Insira um número em cada campo",
                  "keyYouarenotallowedtovie": "Você não tem permissão para exibir este conteúdo."
                },
                "pt-pt": {
                  "keyPleaseenteryourbirthd": "Introduz a tua data de nascimento para continuares",
                  "keyMonth": "Mês",
                  "keyDay": "Dia",
                  "keyYear": "Ano",
                  "keyEnter": "Entrar",
                  "keyPleaseenteravaliddate": "Introduz uma data válida para continuares",
                  "keyPleaseenteranumberine": "Introduz um número em cada campo",
                  "keyYouarenotallowedtovie": "Não podes ver este conteúdo."
                },
                "ru-ru": {
                  "keyPleaseenteryourbirthd": "Для продолжения укажите дату своего рождения",
                  "keyMonth": "Месяц",
                  "keyDay": "Число",
                  "keyYear": "Год",
                  "keyEnter": "Войти",
                  "keyPleaseenteravaliddate": "Для продолжения укажите допустимую дату",
                  "keyPleaseenteranumberine": "Введите число в каждое поле",
                  "keyYouarenotallowedtovie": "Вам не разрешен просмотр данного материала."
                },
                "sk-sk": {
                  "keyPleaseenteryourbirthd": "Pokračujte zadaním svojho dátumu narodenia",
                  "keyMonth": "Mesiac",
                  "keyDay": "Deň",
                  "keyYear": "Rok",
                  "keyEnter": "Vstúpiť",
                  "keyPleaseenteravaliddate": "Ak chcete pokračovať, zadajte platný dátum",
                  "keyPleaseenteranumberine": "Do každého poľa zadajte číslo",
                  "keyYouarenotallowedtovie": "Nemáte povolené prezerať si tento obsah."
                },
                "sv-se": {
                  "keyPleaseenteryourbirthd": "Ange ditt födelsedatum för att fortsätta",
                  "keyMonth": "Månad",
                  "keyDay": "Dag",
                  "keyYear": "År",
                  "keyEnter": "Ange",
                  "keyPleaseenteravaliddate": "Ange ett giltigt datum för att fortsätta",
                  "keyPleaseenteranumberine": "Fyll i alla fält",
                  "keyYouarenotallowedtovie": "Du har inte behörighet att se det här innehållet."
                },
                "tr-tr": {
                  "keyPleaseenteryourbirthd": "Lütfen devam etmek için doğum tarihinizi girin",
                  "keyMonth": "Ay",
                  "keyDay": "Gün",
                  "keyYear": "Yıl",
                  "keyEnter": "Girin",
                  "keyPleaseenteravaliddate": "Devam etmek için lütfen geçerli bir tarih girin",
                  "keyPleaseenteranumberine": "Lütfen her alana bir sayı girin",
                  "keyYouarenotallowedtovie": "Bu içeriği görüntülemenize izin verilmemektedir."
                },
                "zh-cn": {
                  "keyPleaseenteryourbirthd": "请输入您的出生日期以继续",
                  "keyMonth": "月",
                  "keyDay": "天",
                  "keyYear": "年",
                  "keyEnter": "输入",
                  "keyPleaseenteravaliddate": "请输入有效日期以继续",
                  "keyPleaseenteranumberine": "请在每个字段中输入一个数字",
                  "keyYouarenotallowedtovie": "您不能查看此内容。"
                },   
                "zh-hk": {
                  "keyPleaseenteryourbirthd": "請輸入您的出生日期，以繼續程序",
                  "keyMonth": "月",
                  "keyDay": "日",
                  "keyYear": "年",
                  "keyEnter": "輸入",
                  "keyPleaseenteravaliddate": "請輸入有效日期，以繼續程序",
                  "keyPleaseenteranumberine": "每欄請輸入一個數字",
                  "keyYouarenotallowedtovie": "您不得查看此內容。"
                },
                "zh-tw": {
                  "keyPleaseenteryourbirthd": "請輸入生日後繼續",
                  "keyMonth": "月",
                  "keyDay": "日",
                  "keyYear": "年",
                  "keyEnter": "進入",
                  "keyPleaseenteravaliddate": "請輸入正確的日期後繼續",
                  "keyPleaseenteranumberine": "請在每個欄位輸入一個數字",
                  "keyYouarenotallowedtovie": "您無法觀看這個內容。"
                }
              }
            }
            var agCopy = agLoc.locales[urlRegion]
            // Age gate
            // console.log("age gate activated");
  
            function createSitewideottoCookie(name, value, daystoexpire) {
              if (daystoexpire) {
                var date = new Date();
                date.setTime(date.getTime() + (daystoexpire * 24 * 60 * 60 * 1000));
                var cookieexpires = "; expires=" + date.toUTCString();
              } else {
                var cookieexpires = "";
              }
              document.cookie = name + "=" + value + cookieexpires + "; domain=.xbox.com; path=/";
            }
  
            var cookiestring = document.cookie;
            if (agegate != null) {
              slideinit();
              $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'swipe', false, false);
              $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'touchMove', false, false);
              
              var dateorder = $(currentgallery).data("otto-agegate-dateorder");
              var minimumage = $(currentgallery).data("otto-agegate");
              var today = new Date();
              var todayyear = today.getFullYear();
              var todaymonth = today.getMonth();
              var todayday = today.getDate();
              var requiredageyear = todayyear - minimumage;
              var requiredbirthday = new Date(requiredageyear, todaymonth, todayday);
  
              $(currentgallery).find(".itemthumb").addClass("ottogated");
              $(currentgallery).find("button, .ottoCatSelector, .thumbnailarea").addClass("ottogated");
  
              $(".lightboxcontainer").css("pointer-events", "none");
  
              $(currentgallery).find(".galleryitem img").addClass("ottoshadow");
              $(lightboxcontentid).addClass("lightboxshadow");
  
              if (dateorder == "DMY") {
                datefieldsorder = '<label for="agegateday"><span>' + agCopy.keyDay + '</span> ' +
                      '<input class="agegateday" type="text" name="agegateday" placeholder="DD" maxlength="2"></label>' +
                      '<label for="agegatemonth"><span>' + agCopy.keyMonth + '</span> ' +
                      '<input class="agegatemonth" type="text" name="agegatemonth" placeholder="MM" maxlength="2"></label>' +
                      '<label for="agegateyear"><span>' + agCopy.keyYear + '</span> ' +
                      '<input class="agegateyear" type="text" name="agegateyear" placeholder="YYYY" maxlength="4"></label>'
              } else {
                datefieldsorder = '<label for="agegatemonth"><span>' + agCopy.keyMonth + '</span> ' +
                      '<input class="agegatemonth" type="text" name="agegatemonth" placeholder="MM" maxlength="2"></label>' +
                      '<label for="agegateday"><span>' + agCopy.keyDay + '</span> ' +
                      '<input class="agegateday" type="text" name="agegateday" placeholder="DD" maxlength="2"></label>' +
                      '<label for="agegateyear"><span>' + agCopy.keyYear + '</span> ' +
                      '<input class="agegateyear" type="text" name="agegateyear" placeholder="YYYY" maxlength="4"></label>'
              }
              $(currentgallery).find(".galleryitem").add(lightboxcontentid).append('<div class="ottoagegate">' +
                    '<h2>' + agCopy.keyPleaseenteryourbirthd + '</h2>' +
                    '<form action="" method="post">' +
                    '<div>' +
                    datefieldsorder +
                    '<div class="clear"></div>' +
                    '<input class="agegatesubmit" type="submit" value="' + agCopy.keyEnter + '">' +
                    '</div>' +
                    '</form>' +
                    '</div>' +
                    '</div>');
  
              $(currentgallery).find(".galleryitem form").add(lightboxcontentid).submit(function(e){
                    e.preventDefault();
                    var usermonth = parseInt($(currentgallery).add(lightboxcontentid).find("[name=agegatemonth]").val());
                    var userday = parseInt($(currentgallery).add(lightboxcontentid).find("[name=agegateday]").val());
                    var useryear = parseInt($(currentgallery).add(lightboxcontentid).find("[name=agegateyear]").val());
                    userbirthday = new Date(useryear, usermonth - 1, userday);
  
                    // check valid date
                    var acceptablelowyear = todayyear - 130
                    function agegatemessage(message) {
                      if (agegateindy == "yes") {
                        $(currentgallery).find(".ottoagegate h2").html(message);
                      } else {
                       $(".OttoGallery").not(".independentagegate").find(".ottoagegate h2").html(message);
                       $(lightboxcontentid).find(".ottoagegate h2").html(message);
                      }
                    }
  
                    if ( (usermonth > 12) || (usermonth < 1)) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);
  
                    } else if ( useryear <= acceptablelowyear || useryear > todayyear ) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);
  
                    } else if ( userday < 1 ) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);
  
                    } else if (( usermonth == 4 || usermonth == 6 || usermonth == 9 || usermonth == 11 ) && ( userday > 30 )) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);
                      
                    } else if ( ((useryear % 4 == 0) && ( (!(useryear % 100 == 0)) || (useryear % 400 == 0))) && (usermonth == 2) && (userday > 29)) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);
  
                    } else if ((usermonth == 2 && ((useryear % 4 == 0) && ( (!(useryear % 100 == 0)) || (useryear % 400 == 0)))) && (userday > 29)) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);   
                          
                    } else if ((usermonth == 2 && ((useryear % 4 != 0) && ( (!(useryear % 100 != 0)) || (useryear % 400 != 0)))) && (userday > 28)) {
                      agegatemessage(agCopy.keyPleaseenteravaliddate);              
  
                    } else if ( isNaN(usermonth) || isNaN(userday) || isNaN(useryear) ) {
                      agegatemessage(agCopy.keyPleaseenteranumberine);
  
                    } else { // date is valid, now check to see if age requirement is met
                      if ( userbirthday <= requiredbirthday ) {
                        if (agegateindy == "yes") {
                          $(currentgallery).find(".galleryitem img").removeClass("ottoshadow");
                          $(currentgallery).find(".ottoagegate").hide();
                          $(currentgallery).find(".itemthumb").removeClass("ottogated");
                          $(currentgallery).find("button, .ottoCatSelector, .thumbnailarea").removeClass("ottogated");
                          //$(currentgallery).find(".galleryitem").removeClass("hidevideoimage");
                          // create site-wide cookie, good for 90 days
                          createSitewideottoCookie("ottoAgeGate" + agegate, "Passed", 90);
                          $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'swipe', true, true);
                          $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'touchMove', true, true);
                          $(currentgallery).find(".galleryitem iframe").removeClass("hideyoutube");
                        } else {
                          // remove all non-independent age gates from every gallery
                          $(".OttoGallery").not(".independentagegate").find(".galleryitem img").removeClass("ottoshadow");
                          $(".OttoGallery").not(".independentagegate").find(".ottoagegate").hide();
                          $(".OttoGallery").not(".independentagegate").find(".itemthumb").removeClass("ottogated");
                          $(".OttoGallery").not(".independentagegate").find("button, .ottoCatSelector, .thumbnailarea").removeClass("ottogated");
                          $(".OttoGallery").not(".independentagegate").find(".galleryitem iframe").removeClass("hideyoutube");
                          $("[data-otto-type='lightbox']").removeAttr("data-otto-agegate");
                          $(".lightboxcontainer").css("pointer-events", "auto");
                          agegateforlbactive = false;
                          // opennewwindow();
                          //$(".OttoGallery").not(".independentagegate").find(".galleryitem").removeClass("hidevideoimage");
                          $(lightboxcontentid).removeClass("lightboxshadow").find(".ottoagegate").hide();
                          // create sitewide cookie, good for 90 days
                          createSitewideottoCookie("ottoAgeGate" + agegate, "Passed", 90);
                          if (callback && callback == opennewwindow) {
                            callback();
                          }
                          
                          $(".OttoGallery").not(".independentagegate").find($(".galleryitem iframe")).removeClass("hideyoutube");
                          $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'swipe', true, true);
                          $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'touchMove', true, true);
                          if ( callback && callback == opennewwindow) {
                            callback();
                          }
                          return "agegatepassed"
                        }
  
                      } else {
                        agegatemessage(agCopy.keyYouarenotallowedtovie);
                        createSitewideottoCookie("ottoAgeGate" + agegate, "Failed", 30);
                        if (agegateindy == "yes") {
                          $(currentgallery).find(".agegatesubmit").css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(currentgallery).find(".ottoagegate label").css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(currentgallery).find(".agegatemonth").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(currentgallery).find(".agegateday").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(currentgallery).find(".agegateyear").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                        } else {
                          $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegatesubmit").css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".ottoagegate label").css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegatemonth").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegateday").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                          $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegateyear").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                        }
                      }
                    }
  
                });
              
            } 
  
            cookiesplit = document.cookie.split(";");
  
            for (userage = 0; userage < 22; userage++) {
              // agegate previously passed
              var ottocookie = cookiesplit.indexOf(" ottoAgeGate" + userage + "=Passed");
              if (ottocookie != -1) {
                var cookiepassedage = parseInt(cookiesplit[ottocookie].replace(" ottoAgeGate", "").replace("=Passed", ""));
                if ((agegate != null) && (agegate <= cookiepassedage)) { 
                  $(currentgallery).find(".galleryitem img").removeClass("ottoshadow");
                  $(currentgallery).find(".ottoagegate").hide();
                  $(currentgallery).find(".itemthumb").removeClass("ottogated");
                  $(currentgallery).find("button, .ottoCatSelector, .thumbnailarea").removeClass("ottogated");
                  $(lightboxcontentid).removeClass("lightboxshadow").find(".ottoagegate").hide();
                  $("[data-otto-type='lightbox']").removeAttr("data-otto-agegate");
                  $(".lightboxcontainer").css("pointer-events", "auto");
                  $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'swipe', true, true);
                  $(currentgallery).find(".mainSlick" + currentgalleryindex + ", .thumbSlick" + currentgalleryindex).slick('slickSetOption', 'touchMove', true, true);
                  
                  //slideinit();
                  $(currentgallery).find($(".galleryitem iframe")).removeClass("hideyoutube");
                  return "agegatepassed"
                }
              }
              // age gate previously failed
              var ottocookiefail = cookiesplit.indexOf(" ottoAgeGate" + userage + "=Failed");
              if (ottocookiefail != -1) {
                function agegatemessage(message) {
                  if (agegateindy == "yes") {
                    $(currentgallery).find(".ottoagegate h2").html(message);
                  } else {
                   $(".OttoGallery").not(".independentagegate").find(".ottoagegate h2").html(message);
                   $(lightboxcontentid).find(".ottoagegate h2").html(message);
                  }
                }
                var cookiepassedage = parseInt(cookiesplit[ottocookiefail].replace(" ottoAgeGate", "").replace("=Failed", ""));
                if ((agegate != null) && (agegate >= cookiepassedage)) { 
                  agegatemessage(agCopy.keyYouarenotallowedtovie);
                  if (agegateindy == "yes") {
                    $(currentgallery).find(".agegatesubmit").css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(currentgallery).find(".ottoagegate label").css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(currentgallery).find(".agegatemonth").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(currentgallery).find(".agegateday").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(currentgallery).find(".agegateyear").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                  } else {
                    $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegatesubmit").css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".ottoagegate label").css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegatemonth").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegateday").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                    $(".OttoGallery").not(".independentagegate").add(lightboxcontentid).find(".agegateyear").attr('disabled', 'disabled').css({ "pointer-events" : "none", "opacity" : ".3" });
                  }
                }
              }
            }
  
            if (agegate == null) {
              // Slide navigation
              slideinit();
              $(currentgallery).find($(".galleryitem iframe")).removeClass("hideyoutube");
            }
  
            // agegate fill in every form date section at the same time
            $(currentgallery).find(".agegatemonth").keyup(function() {
              var usermonth = $(currentgallery).find("[name=agegatemonth]").val();
              $(".agegatemonth").val(usermonth);
            });
            $(currentgallery).find(".agegateday").keyup(function() {
              var userday = $(currentgallery).find("[name=agegateday]").val();
              $(".agegateday").val(userday);
            });
            $(currentgallery).find(".agegateyear").keyup(function() {
              var useryear = $(currentgallery).find("[name=agegateyear]").val();
              $(".agegateyear").val(useryear);
            });
  
            if (urlRegion === "el-gr") {
              $(".ottoagegate form .agegatesubmit").css("font-size", "12px").css("top", "-2px");
            }
  
          }
  
       });
  
      }
    }
    if ($(".OttoFilmstrip").length === 0) {
      OttoLightboxes();
    }
  
    var OttoFilmstrips = (function() {
ottotext = {
  "locales": {
    "en-us": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "Thumbnails of trailers and gameplay images",
      "keyProductaria": "Gallery of product images and videos"
    },
    "ar-sa": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "ar-ae": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "cs-cz": {
      "keyAriawatch": "Přehrát video:",
      "keyPlay": "Hrát",
      "keyDialogbox": "dialogové okno",
      "keySeeimage": "Zobrazit obrázek",
      "keyClosedialog": "Zavřít dialogové okno",
      "keyClickenlarge": "kliknutím zvětšíte vyskakovací okno (<PLACEHOLDER>)",
      "keyGamearia": "Videoukázky a obrázky ze hry",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie obrázků a videí produktu"
    },
    "da-dk": {
      "keyAriawatch": "Afspil videoen:",
      "keyPlay": "Spil",
      "keyDialogbox": "dialogboks",
      "keySeeimage": "Se billede",
      "keyClosedialog": "Luk-dialogboks",
      "keyClickenlarge": "klik for at forstørre (<PLACEHOLDER>)-popup-vinduet",
      "keyGamearia": "Trailere og gameplay-billeder",
      "keyThumbnailaria": "",
      "keyProductaria": "Galleri af produktbilleder og -videoer"
    },
    "de-at": {
      "keyAriawatch": "Video wiedergeben:",
      "keyPlay": "Abspielen",
      "keyDialogbox": "Dialogfeld",
      "keySeeimage": "Bild anzeigen",
      "keyClosedialog": "Dialogfeld „Schließen“",
      "keyClickenlarge": "Zum Vergrößern des Pop-up-Fensters (<PLACEHOLDER>) klicken",
      "keyGamearia": "Trailer und Spielbilder",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie der Produktbilder und Videos"
    },
    "de-ch": {
      "keyAriawatch": "Video wiedergeben:",
      "keyPlay": "Abspielen",
      "keyDialogbox": "Dialogfeld",
      "keySeeimage": "Bild anzeigen",
      "keyClosedialog": "Dialogfeld „Schließen“",
      "keyClickenlarge": "Zum Vergrößern des Pop-up-Fensters (<PLACEHOLDER>) klicken",
      "keyGamearia": "Trailer und Spielbilder",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie der Produktbilder und Videos"
    },
    "de-de": {
      "keyAriawatch": "Video wiedergeben:",
      "keyPlay": "Abspielen",
      "keyDialogbox": "Dialogfeld",
      "keySeeimage": "Bild anzeigen",
      "keyClosedialog": "Dialogfeld „Schließen“",
      "keyClickenlarge": "Zum Vergrößern des Pop-up-Fensters (<PLACEHOLDER>) klicken",
      "keyGamearia": "Trailer und Spielbilder",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie der Produktbilder und Videos"
    },
    "el-gr": {
      "keyAriawatch": "Δείτε το βίντεο:",
      "keyPlay": "Παίξτε",
      "keyDialogbox": "παράθυρο διαλόγου",
      "keySeeimage": "Βλ. εικόνα",
      "keyClosedialog": "Κλείσιμο παραθύρου διαλόγου",
      "keyClickenlarge": "κάντε κλικ για μεγέθυνση (<PLACEHOLDER>) - αναδυόμενο παράθυρο",
      "keyGamearia": "Τρέιλερ και εικόνες παιχνιδιού",
      "keyThumbnailaria": "",
      "keyProductaria": "Συλλογή εικόνων και βίντεο προϊόντος"
    },
    "en-au": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-ca": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-gb": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-hk": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-ie": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-in": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-nz": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-sg": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "en-za": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialogue box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialogue",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "es-ar": {
      "keyAriawatch": "Reproducir video:",
      "keyPlay": "Reproducir",
      "keyDialogbox": "cuadro de diálogo",
      "keySeeimage": "Ver imagen",
      "keyClosedialog": "Cerrar diálogo",
      "keyClickenlarge": "Ventana emergente Haz clic para ampliar (<PLACEHOLDER>)",
      "keyGamearia": "Avances e imágenes de jugabilidad",
      "keyThumbnailaria": "",
      "keyProductaria": "Galería de imágenes y videos del producto"
    },
    "es-cl": {
      "keyAriawatch": "Reproducir video:",
      "keyPlay": "Reproducir",
      "keyDialogbox": "cuadro de diálogo",
      "keySeeimage": "Ver imagen",
      "keyClosedialog": "Cerrar diálogo",
      "keyClickenlarge": "Ventana emergente Haz clic para ampliar (<PLACEHOLDER>)",
      "keyGamearia": "Avances e imágenes de jugabilidad",
      "keyThumbnailaria": "",
      "keyProductaria": "Galería de imágenes y videos del producto"
    },
    "es-co": {
      "keyAriawatch": "Reproducir video:",
      "keyPlay": "Reproducir",
      "keyDialogbox": "cuadro de diálogo",
      "keySeeimage": "Ver imagen",
      "keyClosedialog": "Cerrar diálogo",
      "keyClickenlarge": "Ventana emergente Haz clic para ampliar (<PLACEHOLDER>)",
      "keyGamearia": "Avances e imágenes de jugabilidad",
      "keyThumbnailaria": "",
      "keyProductaria": "Galería de imágenes y videos del producto"
    },
    "es-es": {
      "keyAriawatch": "Reproduce el vídeo:",
      "keyPlay": "Reproducir",
      "keyDialogbox": "cuadro de diálogo",
      "keySeeimage": "Ver imagen",
      "keyClosedialog": "Cerrar cuadro de diálogo",
      "keyClickenlarge": "Ventana emergente Haz clic para ampliar (<PLACEHOLDER>)",
      "keyGamearia": "Tráileres e imágenes del juego",
      "keyThumbnailaria": "",
      "keyProductaria": "Galería de imágenes y vídeos de productos"
    },
    "es-mx": {
      "keyAriawatch": "Reproducir video:",
      "keyPlay": "Reproducir",
      "keyDialogbox": "cuadro de diálogo",
      "keySeeimage": "Ver imagen",
      "keyClosedialog": "Cerrar diálogo",
      "keyClickenlarge": "Ventana emergente Haz clic para ampliar (<PLACEHOLDER>)",
      "keyGamearia": "Avances e imágenes de jugabilidad",
      "keyThumbnailaria": "",
      "keyProductaria": "Galería de imágenes y videos del producto"
    },
    "fi-fi": {
      "keyAriawatch": "Katso video:",
      "keyPlay": "Toista",
      "keyDialogbox": "valintaruutu",
      "keySeeimage": "Katso kuva",
      "keyClosedialog": "Sulje valintaikkuna",
      "keyClickenlarge": "suurenna ponnahdusikkuna (<PLACEHOLDER>) napsauttamalla",
      "keyGamearia": "Trailereita ja pelikuvaa",
      "keyThumbnailaria": "",
      "keyProductaria": "Tuotekuva- ja -videogalleria"
    },
    "fr-be": {
      "keyAriawatch": "Lire la vidéo :",
      "keyPlay": "Lire",
      "keyDialogbox": "boîte de dialogue",
      "keySeeimage": "Voir l'image",
      "keyClosedialog": "Fermer la boîte de dialogue",
      "keyClickenlarge": "cliquez pour agrandir (<PLACEHOLDER>) la boîte de dialogue Windows",
      "keyGamearia": "Bandes-annonces et images de gameplay",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie d'images et de vidéo du produit"
    },
    "fr-ca": {
      "keyAriawatch": "Faire jouer la vidéo :",
      "keyPlay": "Jouez",
      "keyDialogbox": "boîte de dialogue",
      "keySeeimage": "Voir l’image",
      "keyClosedialog": "Fermer la fenêtre",
      "keyClickenlarge": "cliquez pour agrandir la fenêtre contextuelle (<PLACEHOLDER>)",
      "keyGamearia": "Bandes-annonces et images du jeu",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie d’images et de vidéos de produits"
    },
    "fr-ch": {
      "keyAriawatch": "Lire la vidéo :",
      "keyPlay": "Lire",
      "keyDialogbox": "boîte de dialogue",
      "keySeeimage": "Voir l'image",
      "keyClosedialog": "Fermer la boîte de dialogue",
      "keyClickenlarge": "cliquez pour agrandir (<PLACEHOLDER>) la boîte de dialogue Windows",
      "keyGamearia": "Bandes-annonces et images de gameplay",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie d'images et de vidéo du produit"
    },
    "fr-fr": {
      "keyAriawatch": "Lire la vidéo :",
      "keyPlay": "Lire",
      "keyDialogbox": "boîte de dialogue",
      "keySeeimage": "Voir l'image",
      "keyClosedialog": "Fermer la boîte de dialogue",
      "keyClickenlarge": "cliquez pour agrandir (<PLACEHOLDER>) la boîte de dialogue Windows",
      "keyGamearia": "Bandes-annonces et images de gameplay",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerie d'images et de vidéo du produit"
    },
    "he-il": {
      "keyAriawatch": "Play the video:",
      "keyPlay": "Play",
      "keyDialogbox": "dialog box",
      "keySeeimage": "See image",
      "keyClosedialog": "Close dialog",
      "keyClickenlarge": "click to enlarge (<PLACEHOLDER>) popup window",
      "keyGamearia": "Trailers and gameplay images",
      "keyThumbnailaria": "",
      "keyProductaria": "Gallery of product images and videos"
    },
    "hu-hu": {
      "keyAriawatch": "A videó lejátszása:",
      "keyPlay": "Lejátszás",
      "keyDialogbox": "párbeszédpanel",
      "keySeeimage": "Kép megtekintése",
      "keyClosedialog": "Párbeszédpanel bezárása",
      "keyClickenlarge": "kattintson ide a(z) (<PLACEHOLDER>) előugró ablak kinagyításához",
      "keyGamearia": "Előzetesek és játékmenetképek",
      "keyThumbnailaria": "",
      "keyProductaria": "Termékképek és -videók galériája"
    },
    "it-it": {
      "keyAriawatch": "Riproduci il video:",
      "keyPlay": "Riproduci",
      "keyDialogbox": "finestra",
      "keySeeimage": "Visualizza immagine",
      "keyClosedialog": "Chiudi finestra",
      "keyClickenlarge": "fai clic per ingrandire la finestra popup (<PLACEHOLDER>)",
      "keyGamearia": "Trailer e immagini del gioco",
      "keyThumbnailaria": "",
      "keyProductaria": "Galleria di immagini e video dei prodotti"
    },
    "ja-jp": {
      "keyAriawatch": "動画をプレイ:",
      "keyPlay": "再生する",
      "keyDialogbox": "ダイアログ ボックス",
      "keySeeimage": "イメージを見る",
      "keyClosedialog": "ダイアログを閉じる",
      "keyClickenlarge": "クリックして(<PLACEHOLDER>)ウィンドウを拡大する",
      "keyGamearia": "トレーラーとゲームプレイ画像",
      "keyThumbnailaria": "",
      "keyProductaria": "製品画像とビデオ ギャラリー"
    },
    "ko-kr": {
      "keyAriawatch": "비디오 재생:",
      "keyPlay": "플레이",
      "keyDialogbox": "대화 상자",
      "keySeeimage": "이미지 보기",
      "keyClosedialog": "대화 상자 닫기",
      "keyClickenlarge": "클릭하여 (<PLACEHOLDER>) 팝업창 확대하기",
      "keyGamearia": "트레일러 및 게임 플레이 이미지",
      "keyThumbnailaria": "",
      "keyProductaria": "제품 이미지 및 영상 갤러리"
    },
    "nb-no": {
      "keyAriawatch": "Spill videoen:",
      "keyPlay": "Spill",
      "keyDialogbox": "dialogboks",
      "keySeeimage": "Se bilde",
      "keyClosedialog": "Lukk dialogboks",
      "keyClickenlarge": "klikk for å forstørre (<PLACEHOLDER>) popup-vindu",
      "keyGamearia": "Trailere og bilder av spillet",
      "keyThumbnailaria": "",
      "keyProductaria": "Galleri av produktbilder og videoer"
    },
    "nl-be": {
      "keyAriawatch": "Speel de video af:",
      "keyPlay": "Spelen",
      "keyDialogbox": "dialoogvenster",
      "keySeeimage": "Bekijk afbeelding",
      "keyClosedialog": "Dialoogvenster sluiten",
      "keyClickenlarge": "klik om pop-upvenster (<PLACEHOLDER>) te vergroten",
      "keyGamearia": "Trailers en gameplay-afbeeldingen",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerij van productafbeeldingen en video's"
    },
    "nl-nl": {
      "keyAriawatch": "Speel de video af:",
      "keyPlay": "Spelen",
      "keyDialogbox": "dialoogvenster",
      "keySeeimage": "Bekijk afbeelding",
      "keyClosedialog": "Dialoogvenster sluiten",
      "keyClickenlarge": "klik om pop-upvenster (<PLACEHOLDER>) te vergroten",
      "keyGamearia": "Trailers en gameplay-afbeeldingen",
      "keyThumbnailaria": "",
      "keyProductaria": "Galerij van productafbeeldingen en video's"
    },
    "pl-pl": {
      "keyAriawatch": "Odtwórz wideo:",
      "keyPlay": "Odtwórz",
      "keyDialogbox": "okno dialogowe",
      "keySeeimage": "Patrz obraz",
      "keyClosedialog": "Zamknij okno dialogowe",
      "keyClickenlarge": "kliknij, aby powiększyć okno podręczne (<PLACEHOLDER>)",
      "keyGamearia": "Grafiki przedstawiające zwiastuny i fragmenty rozgrywki",
      "keyThumbnailaria": "",
      "keyProductaria": "Galeria zdjęć i filmów o produkcie"
    },
    "pt-br": {
      "keyAriawatch": "Veja o vídeo:",
      "keyPlay": "Jogar",
      "keyDialogbox": "caixa de diálogo",
      "keySeeimage": "Veja a imagem",
      "keyClosedialog": "Fechar caixa de diálogo",
      "keyClickenlarge": "clique para ampliar (<PLACEHOLDER>) a janela pop-up",
      "keyGamearia": "Trailers e imagens do gameplay",
      "keyThumbnailaria": "",
      "keyProductaria": "Galeria de imagens e vídeos dos produtos"
    },
    "pt-pt": {
      "keyAriawatch": "Reproduzir o vídeo:",
      "keyPlay": "Reproduzir",
      "keyDialogbox": "caixa de diálogo",
      "keySeeimage": "Ver imagem",
      "keyClosedialog": "Fechar caixa de diálogo",
      "keyClickenlarge": "clicar para ampliar a janela de pop-up (<PLACEHOLDER>)",
      "keyGamearia": "Trailers e imagens do jogo",
      "keyThumbnailaria": "",
      "keyProductaria": "Galeria de imagens e vídeos de produtos"
    },
    "ru-ru": {
      "keyAriawatch": "Воспроизвести видео:",
      "keyPlay": "Воспроизвести",
      "keyDialogbox": "диалоговое окно",
      "keySeeimage": "Смотреть изображение",
      "keyClosedialog": "Закрыть диалоговое окно",
      "keyClickenlarge": "нажмите, чтобы увеличить размер всплывающего окна (<PLACEHOLDER>)",
      "keyGamearia": "Анонсы и изображения геймплея",
      "keyThumbnailaria": "",
      "keyProductaria": "Галерея видеороликов и изображений продуктов"
    },
    "sk-sk": {
      "keyAriawatch": "Prehrať video:",
      "keyPlay": "Prehrať",
      "keyDialogbox": "dialógové okno",
      "keySeeimage": "Zobraziť obrázok",
      "keyClosedialog": "Zavrieť dialógové okno",
      "keyClickenlarge": "kliknutím zväčšiť kontextovú ponuku okna (<PLACEHOLDER>)",
      "keyGamearia": "Upútavky a obrázky z hry",
      "keyThumbnailaria": "",
      "keyProductaria": "Galéria obrázkov a videí produktov"
    },
    "sv-se": {
      "keyAriawatch": "Spela upp videon:",
      "keyPlay": "Spela",
      "keyDialogbox": "dialogruta",
      "keySeeimage": "Se bild",
      "keyClosedialog": "Stäng dialogruta",
      "keyClickenlarge": "klicka för att förstora (<PLACEHOLDER>) popup-fönstret",
      "keyGamearia": "Trailers och gameplay",
      "keyThumbnailaria": "",
      "keyProductaria": "Ett galleri med produktbilder och videoklipp"
    },
    "tr-tr": {
      "keyAriawatch": "Videoyu oynatın:",
      "keyPlay": "Oynatın",
      "keyDialogbox": "iletişim kutusu",
      "keySeeimage": "Görüntüye göz atın",
      "keyClosedialog": "İletişim kutusunu kapatın",
      "keyClickenlarge": "büyütmek için tıklayın (<PLACEHOLDER>) açılır penceresi",
      "keyGamearia": "Tanıtım videoları ve oynanış görüntüleri",
      "keyThumbnailaria": "",
      "keyProductaria": "Ürün görüntülerinden ve videolarından oluşan galeri"
    },
    "zh-cn": {
      "keyAriawatch": "播放影片：",
      "keyPlay": "畅玩",
      "keyDialogbox": "对话框",
      "keySeeimage": "查看图像",
      "keyClosedialog": "关闭对话框",
      "keyClickenlarge": "单击可放大（<PLACEHOLDER>）图片",
      "keyGamearia": "預告與遊戲影像",
      "keyThumbnailaria": "",
      "keyProductaria": "產品影像和影片藝廊"
    },
    "zh-hk": {
      "keyAriawatch": "播放影片：",
      "keyPlay": "播放",
      "keyDialogbox": "對話方塊",
      "keySeeimage": "查看影像",
      "keyClosedialog": "關閉對話",
      "keyClickenlarge": "按一下以放大 (<PLACEHOLDER>) 彈出式視窗",
      "keyGamearia": "預告與遊戲影像",
      "keyThumbnailaria": "",
      "keyProductaria": "產品影像和影片藝廊"
    },
    "zh-tw": {
      "keyAriawatch": "觀賞",
      "keyPlay": "播放",
      "keyDialogbox": "對話方塊",
      "keySeeimage": "查看影像",
      "keyClosedialog": "關閉對話",
      "keyClickenlarge": "按一下以放大 (<PLACEHOLDER>) 彈出式視窗",
      "keyGamearia": "預告片與遊戲內容影像",
      "keyThumbnailaria": "",
      "keyProductaria": "產品影像和影片藝廊"
    }
  }
}
      var urlRegion = document.URL.toLowerCase().split("xbox.com/")[1].slice(0, 5);
      var jsonurlraw = "https://query.prod.cms.rt.microsoft.com/cms/api/am/document/GUID"
      var videourlraw = "https://www.microsoft.com/" + urlRegion + "/videoplayer/embed/GUID?autoplay=false";
      var imageurlraw = "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/TID";
      var topAria = ottotext.locales[urlRegion].keyGamearia;
        if ($(".OttoFilmstrip").attr("data-otto-type-gallery") === "accessories") {
          topAria = ottotext.locales[urlRegion].keyProductaria;
        }
      $(".OttoFilmstrip").each(function(fsindex) {
        var currentfilmstrip = this;
        $(currentfilmstrip).after('<div class="m-product-placement f-video ottofs' + fsindex + '" data-grid="col-12">' +
                        '<div class="c-carousel f-single-slide" role="region" aria-label="' + ottotext.locales[urlRegion].keyThumbnailaria +'">' +
                          '<button class="c-flipper f-previous" aria-hidden="true" tabindex="-1"></button>' +
                          '<button class="c-flipper f-next" aria-hidden="true" tabindex="-1"></button>' +
                          '<div>' +
                            '<ul role="tablist" class="c-group"></ul></div></div></div>');
        var numberofitems = $(currentfilmstrip).find("div").length;
        for (var i = 0; i < numberofitems; i++) {
          $(".ottofs" + fsindex + " ul").append('<li></li>');
        }
        var showinlinemedia = false;
        if ($(currentfilmstrip).attr("data-otto-filmstrip-inline") !== undefined && $(currentfilmstrip).attr("data-otto-filmstrip-inline").toLowerCase() === "true") {
          showinlinemedia = true;
        }
        if (showinlinemedia === true) {
          if ($(".OttoIMAnnounce").length === 0) {
            $("body").append('<div style="width:0;height:0;font-size:0;" class="OttoIMAnnounce" aria-live="assertive" data-carouselcurrent="1"></div>');
          }
          $(".ottofs" + fsindex).addClass("inlinefilmstrip")

          var therole = "region";
          // if (navigator.userAgent.indexOf("Firefox") !== -1) {
          //   var therole = "application";
          // }
          $(currentfilmstrip).before('<div class="m-hero ottoinlinemedia ottoinline' + fsindex + '">' +
                                      // '<div class="c-carousel f-multi-slide theme-white" role="application" aria-label="' + topAria + '" aria-live="assertive">' +
                                      '<div class="c-carousel f-multi-slide theme-white" role="' + therole + '" aria-label="' + topAria + '" aria-live="off">' +
                                        '<div class="c-group"><div class="c-sequence-indicator" role="tablist"></div>' +
                                        '<button class="c-action-toggle c-glyph glyph-play f-toggle" data-toggled-label="Pause" data-toggled-glyph="glyph-pause" aria-label="Play" aria-pressed="false"></button></div>' +
                                        '<button class="c-flipper f-previous" aria-label="go to previous gallery item"></button>' +
                                        '<div>' +
                                          '<ul aria-hidden="true"></ul></div>' +
                                        '<button class="c-flipper f-next" aria-label="go to next gallery item"></button>' +
                                        '</div></div>')
          for (var j = 0; j < numberofitems; j++) {
            $(".ottoinline" + fsindex).find("ul").append("<li></li>");
            $(".ottoinline" + fsindex).find(".c-sequence-indicator").append("<button></button>")
          }
          // $(".ottoinlinemedia .f-previous")[0].addEventListener("focus", function() {
          //   console.log("previous received focus")
          //   $(".ottoinlinemedia .c-carousel").attr("aria-label", topAria);
          // })
          // $(".ottoinlinemedia .f-next")[0].addEventListener("focus", function() {
          //   console.log("next received focus")
          //   $(".ottoinlinemedia .c-carousel").attr("aria-label", topAria);
          // })
          // $(".ottoinlinemedia .f-previous")[0].addEventListener("blur", function() {
          //   console.log("previous lost focus")
          //   $(".ottoinlinemedia .c-carousel").attr("aria-label", "Main gallery updated");
          // })
          // $(".ottoinlinemedia .f-next")[0].addEventListener("blur", function() {
          //   console.log("next lost focus")
          //   $(".ottoinlinemedia .c-carousel").attr("aria-label", "Main gallery updated");
          // })
          
        }
        $(currentfilmstrip).find("div").each(function(itemindex) {
          var currentitem = this;
          if ($(currentitem).is("[data-otto-video]") && $(currentitem).is("[data-otto-youtubevideo]")) {
            var vidguid = $(currentitem).attr("data-otto-video");
            if (vidguid.length > 6) {
              $.get(jsonurlraw.replace("GUID", vidguid))
                .done(function(responseData) {
                    var thumbid = responseData.thumbnail.href.split("/")[responseData.thumbnail.href.split("/").length - 1];
                    var thisvidurl = videourlraw.replace("GUID", vidguid);
                    var thisvidscreenshot = imageurlraw.replace("TID", thumbid) + "?w=330&q=50";
                    var thisvidtitle = responseData.title;
                    var thisvidname = responseData._name;
                    populatevid(itemindex, thisvidurl, thisvidscreenshot, thisvidtitle, thisvidname, showinlinemedia);
                  })
                .fail(function() {
                    var thisyoutubeid = $(currentitem).attr("data-otto-youtubevideo");
                    // var thisvidscreenshot = 'https://i1.ytimg.com/vi/' + thisyoutubeid + '/maxresdefault.jpg'; // ytimg.com has no cookies
                    var thisvidscreenshot = '';
                    var thisvidtitle = "youtube video";
                    var thisvidname = "youtube video";
                    populateyt(itemindex, thisyoutubeid, thisvidscreenshot, thisvidtitle, thisvidname, showinlinemedia);
                  })
              } else {
                var thisyoutubeid = $(currentitem).attr("data-otto-youtubevideo");
                // var thisvidscreenshot = 'https://i1.ytimg.com/vi/' + thisyoutubeid + '/maxresdefault.jpg';
                var thisvidscreenshot = '';
                var thisvidtitle = "youtube video";
                var thisvidname = "youtube video";
                populateyt(itemindex, thisyoutubeid, thisvidscreenshot, thisvidtitle, thisvidname, showinlinemedia);
              }
            
          } else if ($(currentitem).is("[data-otto-youtubevideo]")) {
            var thisyoutubeid = $(currentitem).attr("data-otto-youtubevideo");
            // var thisvidscreenshot = 'https://i1.ytimg.com/vi/' + thisyoutubeid + '/maxresdefault.jpg';
            var thisvidscreenshot = '';
            var thisvidtitle = "youtube video";
            var thisvidname = "youtube video";
            populateyt(itemindex, thisyoutubeid, thisvidscreenshot, thisvidtitle, thisvidname, showinlinemedia);
          } else if ($(currentitem).is("[data-otto-video]")) {
            var vidguid = $(currentitem).attr("data-otto-video");
            $.get(jsonurlraw.replace("GUID", vidguid))
              .done(function(responseData) {
                //responseData = jQuery.parseJSON(responseData);
                var thumbid = responseData.thumbnail.href.split("/")[responseData.thumbnail.href.split("/").length - 1];
                var thisvidurl = videourlraw.replace("GUID", vidguid);
                var thisvidscreenshot = imageurlraw.replace("TID", thumbid) + "?w=330&q=50";
                var thisvidtitle = responseData.title;
                var thisvidname = responseData._name;
                populatevid(itemindex, thisvidurl, thisvidscreenshot, thisvidtitle, thisvidname, showinlinemedia);
              })
          } else if ($(currentitem).is("[data-otto-mp4]")) {
            var vidurl = $(currentitem).attr("data-otto-mp4");
            var vidscreen = $(currentitem).attr("data-otto-mp4screen");
            var vidtitle = $(currentitem).attr("data-otto-mp4title");
            var vidname = $(currentitem).attr("data-otto-mp4desc");
            populatemp4(itemindex, vidurl, vidscreen, vidtitle, vidname, showinlinemedia);
          } else {
            var thisimg = $(currentitem).attr("data-otto-image");
            var thistitle = $(currentitem).attr("data-otto-image-alt");
            populateimg(itemindex, thisimg, thistitle, showinlinemedia);
          }
  
  
        })
  
        function populatevid(vidindex, vidurl, vidscreenshot, vidtitle, vidname, showinline) {
          if (showinline === false) {
            var regiontext = ottotext.locales[urlRegion];
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large">' +
                '<a href="javascript:void(0)" class="OttoGallery" data-otto-type="lightbox" tabindex="-1" data-otto-generated="true" data-otto-lightbox-container="body" ' +
                  'data-otto-lightbox-vid-vertical-placement="2%" data-otto-iframe-src="' + vidurl + '" id="vidouter' + fsindex + vidindex + '" data-otto-thevidname="' + vidname + '">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play OttoGallery" data-otto-generated="true" id="vidinner' + fsindex + vidindex + '" data-otto-type="lightbox" data-otto-lightbox-container="body" ' +
                    'data-otto-lightbox-vid-vertical-placement="2%" data-otto-iframe-src="' + vidurl + '" aria-label="' + regiontext["keyAriawatch"] + ' ' + vidname + '" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            if ($(".filmstrip").last().index(".filmstrip") === fsindex && $(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              OttoLightboxes();
            }
          } else {
            var regiontext = ottotext.locales[urlRegion];
            var inlineclass = "";
            if (vidindex === 0) {inlineclass = "inlinefsActive"}
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large" data-linkedstrip="media' + fsindex + vidindex + '">' +
                '<a href="javascript:void(0)" class="inlinelink ' + inlineclass + '" data-otto-generated="true" ' +
                  'id="vidouter' + fsindex + vidindex + '" data-otto-thevidname="' + vidname + '" role="tab">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="update main gallery with video: ' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play" tabindex="-1" style="pointer-events:none;cursor:auto;" data-otto-generated="true" id="vidinner' + fsindex + vidindex + '" ' +
                    'aria-hidden="true" aria-label="" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            $(".ottoinline" + fsindex + " .c-sequence-indicator button").eq(vidindex).replaceWith('<button role="tab" aria-selected="true" aria-controls="media' + fsindex + vidindex + '"></button>' +
                                                                          '<span id="" class="c-tooltip" role="tooltip" aria-hidden=""></span>')
            $(".ottoinline" + fsindex + " ul li").eq(vidindex).replaceWith('<li id="media' + fsindex + vidindex + '" class="">' +
                                                '<section class="m-hero-item f-x-center f-y-bottom context-device theme-light vid-container">' +
                                                // '<div class="m-ambient-video"><iframe class="damVideo" aria-label="' + regiontext["keyAriawatch"] + ' ' + vidname + '" src="' + vidurl + '" allowfullscreen></iframe></div></div></section></li>')
                                                '<div class="m-ambient-video"><iframe class="damVideo" aria-label="main gallery now displaying ' + vidname + '" src="' + vidurl + '" role="application" allowfullscreen></iframe></div></section></li>')
            if ($(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              connectMedia();
            }
          }
        }
        function populateyt(vidindex, vidid, vidscreenshot, vidtitle, vidname, showinline) {
          if (showinline === false) {
            var regiontext = ottotext.locales[urlRegion];
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large">' +
                '<a href="javascript:void(0)" class="OttoGallery" data-otto-type="lightbox" tabindex="-1" data-otto-generated="true" data-otto-lightbox-container="body" ' +
                  'data-otto-lightbox-vid-vertical-placement="2%" data-otto-youtubeid="' + vidid + '" id="vidouter' + fsindex + vidindex + '" data-otto-thevidname="' + vidname + '">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play OttoGallery" data-otto-generated="true" id="vidinner' + fsindex + vidindex + '" data-otto-type="lightbox" data-otto-lightbox-container="body" ' +
                    'data-otto-lightbox-vid-vertical-placement="2%" data-otto-youtubeid="' + vidid + '" aria-label="' + regiontext["keyAriawatch"] + ' ' + vidname + '" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            if ($(".filmstrip").last().index(".filmstrip") === fsindex && $(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              OttoLightboxes();
            }
          } else {
            var regiontext = ottotext.locales[urlRegion];
            var inlineclass = "";
            if (vidindex === 0) {inlineclass = "inlinefsActive"}
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large" data-linkedstrip="media' + fsindex + vidindex + '">' +
                '<a href="javascript:void(0)" class="inlinelink ' + inlineclass + '" role="tab" data-otto-generated="true" ' +
                  'id="vidouter' + fsindex + vidindex + '" data-otto-thevidname="' + vidname + '">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="update main gallery with video: ' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play" tabindex="-1" style="pointer-events:none;cursor:auto;" data-otto-generated="true" id="vidinner' + fsindex + vidindex + '" ' +
                    'aria-hidden="true" aria-label="" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            $(".ottoinline" + fsindex + " .c-sequence-indicator button").eq(vidindex).replaceWith('<button role="tab" aria-selected="true" aria-controls="media' + fsindex + vidindex + '"></button>' +
                                                                          '<span id="" class="c-tooltip" role="tooltip" aria-hidden=""></span>')
            $(".ottoinline" + fsindex + " ul li").eq(vidindex).replaceWith('<li id="media' + fsindex + vidindex + '" class="">' +
                                                '<section class="m-hero-item f-x-center f-y-bottom context-device theme-light">' +
                                                '<div class="m-ambient-video"><div class="ytplayer" role="application" id="ytvid_' + fsindex + vidindex + '" ' + 
                                           'data-ytid="' + vidid +'"></div></div></section></li>')
            if ($(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              connectMedia();
            }
  
          }
        }
        function populatemp4(vidindex, vidurl, vidscreenshot, vidtitle, vidname, showinline) {
          if (showinline === false) {
            var regiontext = ottotext.locales[urlRegion];
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large">' +
                '<a href="javascript:void(0)" class="OttoGallery" data-otto-type="lightbox" tabindex="-1" data-otto-generated="true" data-otto-lightbox-container="body" ' +
                  'data-otto-lightbox-vid-vertical-placement="2%" data-otto-video-mp4="' + vidurl + '" data-otto-htmlfivevideoname="htmlvid'+ fsindex + vidindex + '" data-otto-thevidname="' + vidname + '">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play OttoGallery" data-otto-generated="true" data-otto-type="lightbox" data-otto-lightbox-container="body" ' +
                    'data-otto-lightbox-vid-vertical-placement="2%" data-otto-video-mp4="' + vidurl + '" data-otto-htmlfivevideoname="htmlvid'+ fsindex + vidindex + '" aria-label="' + 
                    regiontext["keyAriawatch"] + ' ' + vidname + '" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            if ($(".filmstrip").last().index(".filmstrip") === fsindex && $(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              OttoLightboxes();
            }
          } else {
            var regiontext = ottotext.locales[urlRegion];
            var inlineclass = "";
            if (vidindex === 0) {inlineclass = "inlinefsActive"}
            $(".ottofs" + fsindex).find("li").eq(vidindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large" data-linkedstrip="media' + fsindex + vidindex + '">' +
                '<a href="javascript:void(0)" class="inlinelink ' + inlineclass + '" data-otto-type="" role="tab" data-otto-generated="true" ' +
                  'data-otto-htmlfivevideoname="htmlvid'+ fsindex + vidindex + '" data-otto-thevidname="' + vidname + '">' +
                  '<picture class="c-image">' +
                    '<source srcset="' + vidscreenshot + '" media="(min-width:0)">' +
                      '<img srcset="" src="' + vidscreenshot + '" alt="update main gallery with video: ' + vidtitle + '">' +
                    '</picture>' +
                  '</a>' +
                  '<a href="javascript:void(0)" class="c-action-trigger c-glyph glyph-play" tabindex="-1" style="pointer-events:none;cursor:auto;" data-otto-generated="true" ' +
                    'data-otto-htmlfivevideoname="htmlvid'+ fsindex + vidindex + '" aria-hidden="true" aria-label=""' + 
                    '" role="tab" data-otto-thevidname="' + vidname + '">' +
                    '<span class="x-screen-reader">' + regiontext["keyPlay"] + '</span>' +
                  '</a>' +
                '</section>')
            $(".ottoinline" + fsindex + " .c-sequence-indicator button").eq(vidindex).replaceWith('<button role="tab" aria-selected="true" aria-controls="media' + fsindex + vidindex + '"></button>' +
                                                                          '<span id="" class="c-tooltip" role="tooltip" aria-hidden=""></span>')
            $(".ottoinline" + fsindex + " ul li").eq(vidindex).replaceWith('<li id="media' + fsindex + vidindex + '" class="">' +
                                                // '<section class="m-hero-item f-x-center f-y-bottom context-device theme-light">' +
                                                // '<div class="m-ambient-video"><iframe src="' + vidurl + '"></iframe></div></div></section></li>')
                                                '<section class="m-hero-item f-x-center f-y-bottom context-device theme-light">' +
                                                '<div class="m-ambient-video">' +
                                                    '<video controls role="img" alt="video: ' + vidtitle + '" poster="">' +
                                                        '<source src="' + vidurl + '" type="video/mp4">' +   
                                                '</video></div></section></li>')
            if ($(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              connectMedia();
            }
          }
        }
        function populateimg(imgindex, image, imgtitle, showinline) {
          if (showinline === false) {
            var regiontext = ottotext.locales[urlRegion];
            $(".ottofs" + fsindex).find("li").eq(imgindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large">' +
                            '<a href="javascript:void(0)" data-js-dialog-show="image-' + fsindex + imgindex + '" aria-label="' + regiontext["keyClickenlarge"].replace("<PLACEHOLDER>", imgtitle) + 
                            '" role="tab">' +
                            '<picture class="c-image">' +
                                '<source srcset="' + image + '" media="(min-width:0)">' +
                                '<img srcset="" src="' + image + '" alt="' + imgtitle + '">' +
                            '</picture>' +
                                '<span class="x-screen-reader">' + regiontext["keySeeimage"] + '</span>' +
                            '</a>' +
                        '</section>');
            $(".ottofs" + fsindex).after('<div class="c-dialog f-lightbox" id="image-' + fsindex + imgindex + '" aria-hidden="true">' +
                                  '<div role="presentation" tabindex="-1"></div>' +
                                  '<button class="c-glyph glyph-cancel" data-js-dialog-hide aria-label="' + regiontext["keyClosedialog"] + '" tabindex="0"></button>' +
                                  '<div role="dialog" tabindex="-1">' +
                                      '<div role="document">' +
                                          '<img alt="' + imgtitle + '" src="' + image + '">' +
                                      '</div></div></div>')
            if ($(".filmstrip").last().index(".filmstrip") === fsindex && $(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              OttoLightboxes();
            }
          } else {
            var regiontext = ottotext.locales[urlRegion];
            var inlineclass = "";
            if (imgindex === 0) {inlineclass = "inlinefsActive"}
            $(".ottofs" + fsindex).find("li").eq(imgindex).attr("role", "none").html('<section role="none" class="m-product-placement-item context-video f-size-large" data-linkedstrip="media' + fsindex + imgindex + '">' +
                            // '<a href="javascript:void(0)" class="inlinelink ' + inlineclass + '" aria-label="' + regiontext["keyClickenlarge"].replace("<PLACEHOLDER>", imgtitle) + 
                            '<a href="javascript:void(0)" class="inlinelink ' + inlineclass + '" role="tab" aria-label="">' +
                            '<picture class="c-image">' +
                                '<source srcset="' + image + '" media="(min-width:0)">' +
                                '<img srcset="" src="' + image + '" alt="update main gallery with image: ' + imgtitle + '">' +
                            '</picture>' +
                                // '<span class="x-screen-reader">' + regiontext["keySeeimage"] + '</span>' +
                            '</a>' +
                        '</section>');
            $(".ottoinline" + fsindex + " .c-sequence-indicator button").eq(imgindex).replaceWith('<button role="tab" aria-selected="true" aria-controls="media' + fsindex + imgindex + '"></button>' +
                                                                          '<span id="" class="c-tooltip" role="tooltip" aria-hidden=""></span>')
            $(".ottoinline" + fsindex + " ul li").eq(imgindex).replaceWith('<li id="media' + fsindex + imgindex + '" class="">' +
                                                '<section class="m-hero-item f-x-left f-y-top context-accessory theme-dark" role="tabpanel">' +
                                                  '<picture>' +
                                                    '<source srcset="' + image + '" media="(min-width:0)">' +
                                                    '<img srcset="' + image + '" src="' + image + '" alt="' + imgtitle + '" aria-label="main gallery now displaying ' + imgtitle + '">' +
                                                  '</picture></section></li>')
            if ($(".ottofs" + fsindex + " ul").find("section").length === numberofitems) {
              connectMedia();
            }
          }
        }
  
        // connect filmstrip and hero behaviors
        function connectMedia() {
          $("click", ".ottofs" + fsindex + ".inlinefilmstrip a").first().addClass("inlinefsActive");
          $(document).on("click", ".ottofs" + fsindex + ".inlinefilmstrip a", function(e) {
            $(".ottofs" + fsindex + ".inlinefilmstrip a").removeClass("inlinefsActive");
            $(".ottofs" + fsindex + " .inlinelink").attr("tabindex", "-1");
            $(this).addClass("inlinefsActive").attr("tabindex", "0");
            var linkedmedia = $(this).closest(".m-product-placement-item").attr("data-linkedstrip");
            $('button[aria-controls="' + linkedmedia + '"]')[0].click();
            var currentcar = $(".OttoIMAnnounce").attr("data-carouselcurrent");
            var closestLi = $(this).closest("li");
            var speakindex = $(".ottofs" + fsindex + ".inlinefilmstrip li").index(closestLi) + 1;
            var totalLi = $(".ottofs" + fsindex + ".inlinefilmstrip li").length;
            if (speakindex === parseInt(currentcar)) {
              if ($(".OttoIMAnnounce").text().indexOf("displaying") === -1) {
                var updPhrase = "main gallery already displaying item " + speakindex + " of " + totalLi;
              } else {
                var updPhrase = "main gallery already on item " + speakindex + " of " + totalLi;
              }
              
            } else {
              var updPhrase = "main gallery updated with item " + speakindex + " of " + totalLi;
            }
            
            // if ($(".OttoIMAnnounce").text() === updPhrase) {}
            $(".OttoIMAnnounce").text(updPhrase).attr("data-carouselcurrent", speakindex);
            // $(linkedmedia)[0].focus();
            stopAllVids();
          })
          $(document).on("keypress", ".ottofs" + fsindex + ".inlinefilmstrip a", function(event) {
            if(event.keyCode== 32){ 
              event.preventDefault();
              $(this).click();
              stopAllVids();
              // $(".gameDiv").not(".pagHide").not(".catHide").eq(0).find("a").focus();
            }
          })
          if (navigator.userAgent.indexOf("Firefox") !== -1) {
            $(document).on("keypress", ".inlinelink", function(event) {
              if(event.keyCode === 32 || event.keycode === 13){ 
                event.preventDefault();
                $(this).click();
              }
            })
          }
          $(document).on("click", ".ottoinline" + fsindex + " .f-next", function(e) {
            var largeindex = $(".ottoinline" + fsindex + " .c-sequence-indicator button[aria-selected='true'").index(".ottoinline" + fsindex + " .c-sequence-indicator button");
            $(".ottofs" + fsindex + ".inlinefilmstrip a.inlinelink ")[largeindex].focus();
            $(".ottofs" + fsindex + ".inlinefilmstrip a.inlinelink ")[largeindex].click();
            setTimeout(function() {
              stopAllVids();
              e.target.focus();
            }, 20)
          })
          $(document).on("click", ".ottoinline" + fsindex + " .f-previous", function(e) {
            var largeindex = $(".ottoinline" + fsindex + " .c-sequence-indicator button[aria-selected='true'").index(".ottoinline" + fsindex + " .c-sequence-indicator button");
            $(".ottofs" + fsindex + ".inlinefilmstrip a.inlinelink ")[largeindex].focus();
            $(".ottofs" + fsindex + ".inlinefilmstrip a.inlinelink ")[largeindex].click();
            setTimeout(function() {
              stopAllVids();
              e.target.focus();
            }, 20)
          })

          // filmstrip arrow navigation setup
          console.log("activating arrow nav");
          $(".ottofs" + fsindex + " .inlinelink").attr("tabindex", "-1");
          $(".ottofs" + fsindex + " .inlinelink").first().attr("tabindex", "0");
          $(".ottofs" + fsindex + " .inlinelink").on("keydown", function(e) {
            if (e.keyCode === 39) { // right arrow key
              e.preventDefault();
              var currentindex = $(this).index(".inlinelink");
              var totalthumbs = $(".ottofs" + fsindex + " .inlinelink").length;
              if (currentindex === totalthumbs - 1) {
                $(".ottofs" + fsindex + " .inlinelink").eq(0)[0].click();
                $(".ottofs" + fsindex + " .inlinelink").eq(0)[0].focus();
              } else {
                $(".ottofs" + fsindex + " .inlinelink").eq(currentindex + 1)[0].click();
                $(".ottofs" + fsindex + " .inlinelink").eq(currentindex + 1)[0].focus();
              }
              console.log(currentindex)
            }
            if (e.keyCode === 37) { // left arrow key
              e.preventDefault();
              var currentindex = $(this).index(".inlinelink");
              var totalthumbs = $(".ottofs" + fsindex + " .inlinelink").length;
              if (currentindex === 0) {
                $(".ottofs" + fsindex + " .inlinelink").eq(totalthumbs - 1)[0].click();
                $(".ottofs" + fsindex + " .inlinelink").eq(totalthumbs - 1)[0].focus();
              } else {
                $(".ottofs" + fsindex + " .inlinelink").eq(currentindex - 1)[0].click();
                $(".ottofs" + fsindex + " .inlinelink").eq(currentindex - 1)[0].focus();
              }
              console.log(currentindex)
            }
          })
          //$("body").append('<script src="https://www.youtube.com/iframe_api"></scr' + 'ipt>')
          //// load YouTube Iframe API ////
                    // var tag = document.createElement('script');
                    // tag.src = "https://www.youtube.com/iframe_api";
                    // var firstScriptTag = document.getElementsByTagName('script')[0];
                    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          //// loaded YouTube Iframe API ///        
  
          OttoLightboxes("inline");
          // $(".inlinelink").each(function() {
          //   $(this)[0].addEventListener("blur", function() {
          //     console.log("inlinelink lost focus")
          //     $(".ottoinlinemedia .c-carousel").attr("aria-live", "off");
          //   })
          // })
          // $(".inlinelink").each(function() {
          //   $(this)[0].addEventListener("focus", function() {
          //     console.log("inlinelink received focus")
          //     setTimeout(function() {
          //       $(".ottoinlinemedia .c-carousel").attr("aria-live", "assertive");
          //     }, 20)
          //   })
          // })
        }
      });  
  
    })();
  
    function checklightboxheight() {
      $(".lightboxcontent").removeClass("ottosmallscreen");
      $(".lightboxcontainer").css("height", "100%");
      var winheight = $(window).height();
      var scrollheight = $(document).scrollTop();
      var bottomboxpos = ($(".lightboxcontainer").offset().top - scrollheight) + $(".lightboxcontainer").height();
      if (bottomboxpos >= winheight) {
        var difference = Math.ceil(bottomboxpos - winheight);
        var amounttoshrink = Math.floor(difference + (.16 * difference));
        var newlbheight = $(".lightboxcontainer").height() - amounttoshrink;
        $(".lightboxcontainer").css("height", newlbheight + "px");
        $(".lightboxcontent").addClass("ottosmallscreen");
      } else {
        $(".lightboxcontainer").css("height", "100%");
      }
    }
  
    var windowresized = (function () {
      var timers = {};
      return function (callback, ms, uniqueId) {
        if (!uniqueId) {
          uniqueId = "Fires only once.";
        }
        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })();
  
    $(window).resize(function () {
      windowresized(function(){
        if ($(".lightboxcontainer").length !== 0) {
          checklightboxheight();
        }
      }, 400, "pageresize");
    });
  });
  
  var playerList = {};
  function onYouTubeIframeAPIReady() {
    $(document).ready(function(){
      $(".ytplayer").each(function(event) {
        var iframeid = $(this).attr("id");
        //var datasource = $(this).attr("data-source");
        var ytid = $(this).attr("data-ytid");
          
        playerList[iframeid] = new YT.Player(iframeid, {
          'videoId': ytid,
          'host': "https://www.youtube-nocookie.com",
          playerVars: { 'rel': 0, 'origin': window.location.href  }
          //'src': datasource,
          // events: {
            // 'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
          // }
        });
      })
      //console.log(playerList);
    });
  }
  
  function stopAllVids() {
    $("video").each(function() { $(this)[0].pause() }) // stop all mp4's
    var allplayers = Object.keys(playerList); // stop youtube
    for (var i = 0; i < allplayers.length; i++) {
      theplayer = playerList[allplayers[i]]
      playerstate = playerList[allplayers[i]].getPlayerState();
      if (playerstate === 1) {
        playerList[allplayers[i]].pauseVideo();
      }
    }
    $(document).find(".damVideo").each( function() {
      if (!$(this).closest("li").hasClass("f-active")) {
        $(this).attr('src', $(this).attr('src')); // reset dam videos
      }
    });
  }
