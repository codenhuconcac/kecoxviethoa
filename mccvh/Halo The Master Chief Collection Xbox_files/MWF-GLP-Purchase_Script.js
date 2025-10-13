$(document).ready(function () {
  var urlRegion = document.URL.toLowerCase().split("xbox.com/")[1].slice(0, 5);
  if (urlRegion === "ar-sa") { urlRegion = "en-sa" }
  if (urlRegion === "ar-ae") { urlRegion = "en-ae" } 

  xgpGuidArray = ["29a81209-df6f-41fd-a528-2ae6b91f719c", "609d944c-d395-4c0a-9ea4-e9f39b52c1ad"];
  var xgplistUrl = "https://catalog.gamepass.com/sigls/v2?id=CATEGORY&language=LANG&market=MARK";

  guidAmpt = {"29a81209-df6f-41fd-a528-2ae6b91f719c" : "allCloud",
              "609d944c-d395-4c0a-9ea4-e9f39b52c1ad" : "allPC"                  
  }

  xgplistUrl = xgplistUrl.replace("LANG", urlRegion).replace("MARK", urlRegion.split("-")[1].toUpperCase());

  for (var i = 0; i < xgpGuidArray.length; i++) {
    var catUrl = xgplistUrl.replace("CATEGORY", xgpGuidArray[i]);  
   
    (function() {
      xgpLists(catUrl, i, guidAmpt[xgpGuidArray[i]]);
    })(i);
  }
  function xgpLists(url, index, arrayname) {
    $.get(url)
      .done(function(responseData) {
        listData = responseData;
        var idlength = listData.length
        var idArray = [];
        for (var j = 1; j < idlength; j++) {
          if (idArray.indexOf(listData[j].id) === -1) {
            idArray.push(listData[j].id)
          }
        }
        gameIdArrays[arrayname] = [];
        gameIdArrays[arrayname] = idArray;
        
        if (arrayname === "allPC") {
          var activecheck1 = setInterval(function() {
                            var activeAjax = $.active;
                            if (activeAjax === 0) {
                              chunktotal = Math.ceil(fullGameArray.length / 20)
                              ratingsApi();
                              clearInterval(activecheck1);
                            }
                          }, 500);
        }
      })
  } 
  function ratingsApi() {
    var ratingsUrl = "https://displaycatalog.mp.microsoft.com/v7.0/ratings?market=US&languages=LANG&MS-CV=DGU1mcuYo0WMMp+F.1"
    ratingsUrl = ratingsUrl.replace("US", urlRegion.split("-")[1]).replace("LANG", urlRegion);

    $.get(ratingsUrl)
      .done(function(listData) {
        ratingData = listData;
        API_POP();
      })
  }

  function API_POP() {
      regionRatingOrgs = { "en-us" : "ESRB", "en-au" : "COB-AU", "en-hk" : "IARC", "en-in" : "IARC", "en-nz" : "OFLC-NZ", "en-sg" : "IARC", "ja-jp" : "CERO", "ko-kr" : "GRB", "zh-hk" : "IARC", "zh-tw" : "CSRR", "ar-ae" : "IARC", "ar-sa" : "IARC", "cs-cz" : "PEGI", "da-dk" : "PEGI", "de-at" : "PEGI", "de-ch" : "PEGI", "de-de" : "USK", "el-gr" : "PEGI", "en-gb" : "PEGI", "en-ie" : "PEGI", "en-za" : "FPB", "fi-fi" : "PEGI", "fr-be" : "PEGI", "fr-ch" : "PEGI", "fr-fr" : "PEGI", "he-il" : "PEGI", "hu-hu" : "PEGI", "it-it" : "PEGI", "nb-no" : "PEGI", "nl-be" : "PEGI", "nl-nl" : "PEGI", "pl-pl" : "PEGI", "pt-pt" : "PEGI", "ru-ru" : "PCBP", "sk-sk" : "PEGI", "sv-se" : "PEGI", "tr-tr" : "PEGI", "en-ca" : "ESRB", "fr-ca" : "ESRB", "es-ar" : "ESRB", "es-cl" : "CCC", "es-co" : "ESRB", "es-es" : "PEGI", "es-mx" : "ESRB", "pt-br": "DJCTQ" };      ratingorg = regionRatingOrgs[urlRegion];
      if ($(".glpbigids").length !== 0) {
          var forcepre = false;
          if ($("#forcePreorder").length > 0 && $("#forcePreorder").attr("data-forcePreorder").toLowerCase() === "true") {
              forcepre = true;
          } 
          var forcedbuyids = "";
          if ($("#forceBuy").length > 0) {
              var rawforce = $("#forceBuy").attr("data-force");
              rawforce = rawforce.toUpperCase();
              forcedbuyids = rawforce;
          }
          fullGameArray = [];
          subscriptiongames = [];
          ignoresubscriptions = [];
          var editions = ["Standard", "Silver", "Gold", "Fourth", "5", "6", "7", "8"];
          for (var i = 0; i < editions.length; i++) {
              geteditionbigids(editions[i]);
          }
          function geteditionbigids(edition) {
              var tempid;
              if ($("#edition" + edition).length > 0) {
                tempid = $("#edition" + edition).data("download-bigid").toUpperCase().trim();
                if (tempid.length === 12) { fullGameArray.push(tempid) }
                tempid = $("#edition" + edition).data("disc-bigid").toUpperCase().trim();
                if (tempid.length >= 12) { fullGameArray.push(tempid) }
                tempid = $("#edition" + edition).data("other-bigid").toUpperCase().trim();
                if (tempid.length === 12) { fullGameArray.push(tempid) }
                tempid = $("#edition" + edition).data("download-bigid-updated").toUpperCase().trim();
                if (tempid.length === 12) { fullGameArray.push(tempid) }
                tempid = $("#edition" + edition).data("disc-bigid-updated").toUpperCase().trim();
                if (tempid.length >= 12) { fullGameArray.push(tempid) }
                tempid = $("#edition" + edition).data("other-bigid-updated").toUpperCase().trim();
                if (tempid.length === 12) {
                    fullGameArray.push(tempid)
                }
              }
          }
          if ($("#subscriptionEdition").length > 0) {
            var tempid;
            tempid = $("#subscriptionEdition").data("sub-edition").toUpperCase().trim();
            if (tempid.length === 12) { subscriptiongames.push(tempid) }
            tempid = $("#subscriptionEdition").data("sub-edition-updated").toUpperCase().trim();
            if (tempid.length === 12) { subscriptiongames.push(tempid) }
            tempid = $("#subscriptionEdition").data("sub-ignore");
            if (tempid.length > 3) { ignoresubscriptions = tempid.split(",") }
          }

          if (subscriptiongames.length > 0) {
            for (var k = 0; k < subscriptiongames.length; k++) {
              if (fullGameArray.indexOf(subscriptiongames[k]) === -1) {
                fullGameArray.push(subscriptiongames[k])
              }
            }
          }

          var tempaddonids = $("#addonArray").data("addons-bigids").split(",");
          addonarray = [];
          for (var i = 0; i < tempaddonids.length; i++) {
              var tempid = tempaddonids[i].toUpperCase().trim();
              if (tempid.length === 12) {
                  addonarray.push(tempid);
                  fullGameArray.push(tempid);
              }
          }

          var tempaddonids2 = $("#addonArray2").data("addons2-bigids").split(",");
          addonarray2 = [];
          for (var j = 0; j < tempaddonids2.length; j++) {
              var tempid = tempaddonids2[j].toUpperCase().trim();
              if (tempid.length === 12) {
                  addonarray2.push(tempid);
                  fullGameArray.push(tempid);
              }
          }

          // get custom images for add-ons
          addonCustomImages = {}
          if ($("#addonCustomImgs").length > 0 && $("#addonCustomImgs").attr("data-addons-custom").length > 12) {
            var tempcustimgs = $("#addonCustomImgs").attr("data-addons-custom");
            if (tempcustimgs.indexOf("::") === -1) {
              throw "GLP Purchase Script error: Custom add-on image section needs to contain double colon separating bigID and custom image."
            }
            var tempciarray = tempcustimgs.split(",");
            tempciarray.forEach(function(custimg) {
              addonCustomImages[custimg.split("::")[0].trim().toUpperCase()] = custimg.split("::")[1].trim()
            })
          }

          

          // get custom images for subscriptions
          subscriptionCustomImages = {}
          if ($("#subscriptionCustomImgs").length > 0 && $("#subscriptionCustomImgs").attr("data-subscription-custom").length > 4) {
            var tempcustimgs = $("#subscriptionCustomImgs").attr("data-subscription-custom");
            if (tempcustimgs.indexOf("::") === -1) {
              throw "GLP Purchase Script error: Custom subscription image section needs to contain double colon separating sku and custom image."
            }
            var tempciarray = tempcustimgs.split(",");
            tempciarray.forEach(function(custimg) {
              subscriptionCustomImages[custimg.split("::")[0].trim().toUpperCase()] = custimg.split("::")[1].trim()
            })
          }

          chunktotal = Math.ceil(fullGameArray.length / 60)
          GUID_pop(fullGameArray);

          function GUID_pop(rawGuids) {
              var countryCode = urlRegion.split("-")[1].toUpperCase();
              var guidUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=' + countryCode + '&languages=' + urlRegion + '&MS-CV=DGU1mcuYo0WMMp+F.1'

              var first12 = rawGuids.slice(0, 60)
              rawGuids = rawGuids.slice(60)

              var firstToUrl = first12.join(",").replace();
              guidUrl = guidUrl.replace("GAMEIDS", firstToUrl)
              $.get(guidUrl)
                  .done(function (responseData) {
                      var apiData = responseData;
                      populate(apiData, 0, firstToUrl);
                      guidUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=' + countryCode + '&languages=' + urlRegion + '&MS-CV=DGU1mcuYo0WMMp+F.1'
                      restPop();
                  })

              function restPop() {
                  var m, n, temparray, chunk = 20;
                  var arrayCount = 1
                  for (m = 0, n = rawGuids.length; m < n; m += chunk) {
                      (function (m, n) {
                          temparray = rawGuids.slice(m, m + chunk);
                          var guidsToUrl = temparray.join(",");
                          guidUrl = guidUrl.replace("GAMEIDS", guidsToUrl)

                          $.get(guidUrl)
                              .done(function (responseData) {
                                  var apiData = responseData;
                                  populate(apiData, arrayCount, guidsToUrl);
                                  arrayCount++
                              })
                          guidUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=' + countryCode + '&languages=' + urlRegion + '&MS-CV=DGU1mcuYo0WMMp+F.1'
                      })(m, n);
                  }
              }

              var gamehtml = '';
              var popcounter = 0;
              // var bigidUrls = biUrls.items.urls;
              // var biuArray = Object.keys(bigidUrls);
              allGames = {};
              gameIdArrays["exclusives"] = [];
              gameIdArrays["newreleases"] = [];
              gameIdArrays["multiplayer"] = [];
              gameIdArrays["upcoming"] = [];
              gameIdArrays["kidsfamily"] = [];
              gameIdArrays["onsale"] = [];
              gameIdArrays["enhanced"] = gameIdArrays["enhanced"].filter(function (v) { return fullGameArray.indexOf(v) !== -1 });
              gameIdArrays["360games"] = [];

              //get 360 object ready
              // var x360tempids = Object.keys(all360Games);
              // var x360length = x360tempids.length;

              // for (var x=0; x < x360length; x++) {
              //   if (all360Games[x360tempids[x]].excludes.toLowerCase().indexOf(urlRegion) !== -1) {
              //     delete all360Games[x360tempids[x]]
              //   } else if (all360Games[x360tempids[x]].includes.length > 3 && all360Games[x360tempids[x]].includes.toLowerCase().indexOf(urlRegion) === -1) {
              //     delete all360Games[x360tempids[x]]
              //   }
              // }
              // gameIdArrays["360games"] = Object.keys(all360Games);


              selectedGames = [];
              prunedGames = [];
              shownGames = [];

              var nowdate = new Date();
              var nowmonthsdate = new Date();
              var monthsagofilterdate = new Date(nowmonthsdate.setMonth(nowmonthsdate.getMonth() - 2));
              var locgamesremoved = 0;

              function populate(data, count, bigidsgiven) {
                  // var now = new Date();
                  // var monthsago = new Date(now.setMonth(now.getMonth() - 9));
                  var productQuantity = data.Products.length;

                  bigidsgiven = bigidsgiven.split(",");
                  var allprodids = [];
                  for (var s = 0; s < productQuantity; s++) {
                      var temppid = data.Products[s].ProductId
                      if (fullGameArray.indexOf(temppid) === -1) {
                          temppid += "/" + data.Products[s].DisplaySkuAvailabilities[0].Availabilities[0].SkuId;
                      }
                      allprodids.push(temppid);
                  }
                  var eliminated = [];
                  eliminated = bigidsgiven.filter(function (v) { return allprodids.indexOf(v) === -1 });

                  for (var w = 0; w < eliminated.length; w++) {
                      locgamesremoved++
                      var idind = fullGameArray.indexOf(eliminated[w]);
                      if (idind !== -1) { fullGameArray.splice(idind, 1); }
                      var idind1 = gameIdArrays["HDRGaming"].indexOf(eliminated[w]);
                      if (idind1 !== -1) { gameIdArrays["HDRGaming"].splice(idind1, 1); }
                      var idind2 = gameIdArrays["TryForFree.homepage"].indexOf(eliminated[w]);
                      if (idind2 !== -1) { gameIdArrays["TryForFree.homepage"].splice(idind2, 1); }
                      var idind3 = gameIdArrays["enhanced"].indexOf(eliminated[w]);
                      if (idind3 !== -1) { gameIdArrays["enhanced"].splice(idind3, 1); }
                      var idind4 = gameIdArrays["fourk"].indexOf(eliminated[w]);
                      if (idind4 !== -1) { gameIdArrays["fourk"].splice(idind4, 1); }
                      var idind5 = gameIdArrays["IDXPAgaming.homepage"].indexOf(eliminated[w]);
                      if (idind5 !== -1) { gameIdArrays["IDXPAgaming.homepage"].splice(idind5, 1); }
                      var idind6 = gameIdArrays["exclusives"].indexOf(eliminated[w]);
                      if (idind6 !== -1) { gameIdArrays["exclusives"].splice(idind6, 1); }
                      var idind7 = gameIdArrays["kidsfamily"].indexOf(eliminated[w]);
                      if (idind7 !== -1) { gameIdArrays["kidsfamily"].splice(idind7, 1); }
                      var idind8 = gameIdArrays["newreleases"].indexOf(eliminated[w]);
                      if (idind8 !== -1) { gameIdArrays["newreleases"].splice(idind8, 1); }
                      var idind9 = gameIdArrays["multiplayer"].indexOf(eliminated[w]);
                      if (idind9 !== -1) { gameIdArrays["multiplayer"].splice(idind9, 1); }
                      var idind10 = gameIdArrays["upcoming"].indexOf(eliminated[w]);
                      if (idind10 !== -1) { gameIdArrays["upcoming"].splice(idind10, 1); }
                      var idind11 = gameIdArrays["editors"].indexOf(eliminated[w]);
                      if (idind11 !== -1) { gameIdArrays["editors"].splice(idind11, 1); }
                      var idind12 = gameIdArrays["onsale"].indexOf(eliminated[w]);
                      if (idind12 !== -1) { gameIdArrays["onsale"].splice(idind12, 1); }
                      var idind13 = gameIdArrays["physical"].indexOf(eliminated[w]);
                      if (idind13 !== -1) { gameIdArrays["physical"].splice(idind13, 1); }
                      var idind14 = addonarray.indexOf(eliminated[w]);
                      if (idind14 !== -1) { addonarray.splice(idind14, 1); }
                      var idind15 = addonarray2.indexOf(eliminated[w]);
                      if (idind15 !== -1) { addonarray2.splice(idind15, 1); }
                  }

                  for (var t = 0; t < allprodids.length; t++) {
                      var excludetest = false;
                      // if (allprodids.indexOf(bigidsgiven[t]) !== -1) {
                      var producttest = data.Products[t];
                      var excludeit404 = 0;
                      var excludeitpurch = 0;
                      producttest.DisplaySkuAvailabilities.forEach(function (d) {
                          d.Availabilities.forEach(function (av) {
                              if (av.Actions.indexOf("Purchase") !== -1) {
                                  excludeit404 += 1;
                                  excludeitpurch += 1;
                              }
                              if (av.Actions.indexOf("Details") !== -1) {
                                  excludeit404 += 1;
                              }
                          })
                      })
                      if (excludeit404 === 0 && excludeitpurch === 0) {
                          excludetest = true;
                      }
                      //}

                      if (excludetest === true) {
                          //console.log("NOTE: BigID " + allprodids[t] + " unavailable to buy in this locale. Removing from game lists.");
                          locgamesremoved++
                          popcounter--
                          var idind = fullGameArray.indexOf(allprodids[t]);
                          if (idind !== -1) { fullGameArray.splice(idind, 1); }
                          var idind1 = gameIdArrays["HDRGaming"].indexOf(allprodids[t]);
                          if (idind1 !== -1) { gameIdArrays["HDRGaming"].splice(idind1, 1); }
                          var idind2 = gameIdArrays["TryForFree.homepage"].indexOf(allprodids[t]);
                          if (idind2 !== -1) { gameIdArrays["TryForFree.homepage"].splice(idind2, 1); }
                          var idind3 = gameIdArrays["enhanced"].indexOf(allprodids[t]);
                          if (idind3 !== -1) { gameIdArrays["enhanced"].splice(idind3, 1); }
                          var idind4 = gameIdArrays["fourk"].indexOf(allprodids[t]);
                          if (idind4 !== -1) { gameIdArrays["fourk"].splice(idind4, 1); }
                          var idind5 = gameIdArrays["IDXPAgaming.homepage"].indexOf(allprodids[t]);
                          if (idind5 !== -1) { gameIdArrays["IDXPAgaming.homepage"].splice(idind5, 1); }
                          var idind6 = gameIdArrays["exclusives"].indexOf(allprodids[t]);
                          if (idind6 !== -1) { gameIdArrays["exclusives"].splice(idind6, 1); }
                          var idind7 = gameIdArrays["kidsfamily"].indexOf(allprodids[t]);
                          if (idind7 !== -1) { gameIdArrays["kidsfamily"].splice(idind7, 1); }
                          var idind8 = gameIdArrays["newreleases"].indexOf(allprodids[t]);
                          if (idind8 !== -1) { gameIdArrays["newreleases"].splice(idind8, 1); }
                          var idind9 = gameIdArrays["multiplayer"].indexOf(allprodids[t]);
                          if (idind9 !== -1) { gameIdArrays["multiplayer"].splice(idind9, 1); }
                          var idind10 = gameIdArrays["upcoming"].indexOf(allprodids[t]);
                          if (idind10 !== -1) { gameIdArrays["upcoming"].splice(idind10, 1); }
                          var idind11 = gameIdArrays["editors"].indexOf(allprodids[t]);
                          if (idind11 !== -1) { gameIdArrays["editors"].splice(idind11, 1); }
                          var idind12 = gameIdArrays["onsale"].indexOf(allprodids[t]);
                          if (idind12 !== -1) { gameIdArrays["onsale"].splice(idind12, 1); }
                          var idind13 = gameIdArrays["physical"].indexOf(allprodids[t]);
                          if (idind13 !== -1) { gameIdArrays["physical"].splice(idind13, 1); }
                          var idind14 = addonarray.indexOf(allprodids[t]);
                          if (idind14 !== -1) { addonarray.splice(idind14, 1); }
                          var idind15 = addonarray2.indexOf(allprodids[t]);
                          if (idind15 !== -1) { addonarray2.splice(idind15, 1); }
                      }
                  }

                  for (var i = 0; i < productQuantity; i++) {
                      // if (data.Products[i].ProductId === undefined) { continue; }
                      var temppid = data.Products[i].ProductId.toUpperCase();
                      if (fullGameArray.indexOf(temppid) === -1) {
                          temppid += "/" + data.Products[i].DisplaySkuAvailabilities[0].Availabilities[0].SkuId;
                      }
                      var itemId = temppid;

                      var itemTitle = data.Products[i].LocalizedProperties[0].ProductTitle;
                      if (itemTitle === undefined) {
                          itemTitle = "";
                      }
                      var titleClickname = itemTitle.toLowerCase().replace(/\s/g, "-").replace(/[^>a-z0-9-]/gi, '');
                      if (titleClickname === "") {
                          titleClickname = "-";
                      }

                      var shortdesc = data.Products[i].LocalizedProperties[0].ShortDescription;
                      if (shortdesc === "") {
                          shortdesc = data.Products[i].LocalizedProperties[0].ProductDescription;
                      }
                      if (shortdesc === undefined) {
                          shortdesc = "";
                      }

                      // determine physical or download
                      if (gameIdArrays["physical"].indexOf(itemId) !== -1) {
                          var phys = "true";
                      } else {
                          var phys = "false";
                      }
                      // var phys = "false";
                      // if (data.Products[i].ProductBSchema === "ProductDevice;1") {
                      //   phys = "true";
                      // }

                      // get boxshot
                      if (phys === "false" && data.Products[i].LocalizedProperties[0].Images !== undefined) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var imageInd = 1;
                          for (var j = 0; j < imagesNum; j++) {
                              if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "BrandedKeyArt") {
                                  imageInd = j;
                                  break;
                              }
                          }
                          if (data.Products[i].LocalizedProperties[0].Images[imageInd]) {
                              var itemBoxshot = data.Products[i].LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                              var itemBoxshotSmall;
                          } else {
                              var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                              var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          }
                          if (itemBoxshot.indexOf("xboxlive.com") !== -1) {
                              itemBoxshotSmall = itemBoxshot + "&w=140&format=jpg";
                              itemBoxshot = itemBoxshot + "&w=200&format=jpg";
                          } else {
                              itemBoxshotSmall = itemBoxshot;
                          }
                      } else if (phys === "true" && data.Products[i].LocalizedProperties[0].Images !== undefined) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var imageInd = 999;
                          for (var j = 0; j < imagesNum; j++) {
                              if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "BrandedKeyArt") {
                                  imageInd = j;
                                  break;
                              }
                          }
                          if (data.Products[i].LocalizedProperties[0].Images[imageInd]) {
                              var itemBoxshot = data.Products[i].LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                              var itemBoxshotSmall;
                          } else {
                              if (data.Products[i].LocalizedProperties[0].Images[0]) {
                                  if (data.Products[i].LocalizedProperties[0].Images[0].Uri.toLowerCase().indexOf("s-microsoft") === -1) {
                                      var itemBoxshot = data.Products[i].LocalizedProperties[0].Images[0].Uri.replace("http:", "https:") + "&w=231&h=197&q=90&m=6&b=%23FFFFFFFF&o=f";
                                  } else {
                                      var itemBoxshot = data.Products[i].LocalizedProperties[0].Images[0].Uri.replace("http:", "https:")
                                  }
                                  var itemBoxshotSmall = itemBoxshot;
                              } else {
                                  var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                                  var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                              }
                          }
                      } else {
                          var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                      }
                      // get boxart without green band
                      if (data.Products[i].LocalizedProperties[0].Images !== undefined && data.Products[i].LocalizedProperties[0].Images.length > 0) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var imageInd = 1;
                          for (var j = 0; j < imagesNum; j++) {
                              if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "BoxArt") {
                                  imageInd = j;
                                  break;
                              }
                          }
                          if (data.Products[i].LocalizedProperties[0].Images[imageInd]) {
                              var itemBoxart = data.Products[i].LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                          } else {
                              var itemBoxart = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          }
                          if (itemBoxart.indexOf("xboxlive.com") !== -1) {
                              itemBoxart = itemBoxart + "&w=400&format=jpg";
                          }
                          // get poster without green band
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var imageInd = 1;
                          for (var j = 0; j < imagesNum; j++) {
                              if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Poster") {
                                  imageInd = j;
                                  break;
                              }
                          }
                          if (data.Products[i].LocalizedProperties[0].Images[imageInd]) {
                              var itemPoster = data.Products[i].LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                          } else {
                              var itemPoster = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          }
                          if (itemPoster.indexOf("xboxlive.com") !== -1) {
                              itemPoster = itemPoster + "&w=540&format=jpg";
                          }
                      } else {
                          var itemBoxart = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          var itemPoster = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg"
                      }
                      // get square shot for add-ons
                      if (addonarray.indexOf(itemId) !== -1 || subscriptiongames.indexOf(itemId) !== -1) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var ssInd = 1;
                          for (var j = 0; j < imagesNum; j++) {
                              if (document.URL.toLowerCase().indexOf("playerunknowns-battlegrounds") !== -1) {
                                  if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Poster") { //FeaturePromotionalSquareArt
                                      ssInd = j;
                                      break;
                                  }
                              } else {
                                if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Poster" && data.Products[i].LocalizedProperties[0].Images[j].Width < data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 40) {
                                      ssInd = j;
                                      break; // preferred art
                                  }
                                  if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Logo" && data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 271) {
                                      ssInd = j;
                                      //break;
                                  }
                                  if ((data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Tile" || data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "tile")
                                      && data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 271) {
                                      ssInd = j;
                                      //break;
                                  }
                                  // if ((data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Tile" || data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "tile") 
                                  //   && data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 149) {
                                  //   ssInd = j;
                                  //   break;
                                  // } 
                                  if (data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 271) {
                                      ssInd = j;
                                      //break;
                                  }
                                  if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Poster") {
                                      ssInd = j;
                                      //break
                                  }
                              }
                          }
                          var squareshot = data.Products[i].LocalizedProperties[0].Images[ssInd].Uri.replace("http:", "https:");
                          var boxbgColor = data.Products[i].LocalizedProperties[0].Images[ssInd].BackgroundColor;
                          //if (squareshot.indexOf("xboxlive.com") !== -1) { squareshot = squareshot + "&w=300&format=jpg"; }
                          var itemId = data.Products[i].ProductId.toUpperCase();

                          if (itemId === "9NBLGGH1Z6FQ") {
                              squareshot = "https://compass-ssl.xbox.com/assets/31/f7/31f7fa75-a7ec-4769-893f-12cc0752373e.jpg?n=ReCore_Boxshot-digital-X1_294x215.jpg";
                          }
                          if (itemId === "BZFK7WNK7R4M") {
                              squareshot = "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTc6LYEXhNheFwp2halN6MiJq0hK8tHwcOslhHzFcqc.uw90wjv2YtwC_mZJs.lEh1cto.K33xsXgRNctiGCKrDjVsG9PhS5GzkLXFMF5wlXsJAfaI6.Hc6zR2KrB00Sjgkn0kvJZv.PD1.7g.ytDgP368SN3vocTlHhhyS_BQ8qZs-";
                          }
                          if (itemId === "9WZDNCRFJ3P2" || itemId === "9WZDNCRFJ1XX") {
                              boxbgColor = "blue";
                          }
                      }

                      // get square shot for add-ons section 2
                      if (addonarray2.indexOf(itemId) !== -1 || subscriptiongames.indexOf(itemId) !== -1) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var ssInd = 1;
                          for (var k = 0; k < imagesNum; k++) {
                              if (document.URL.toLowerCase().indexOf("playerunknowns-battlegrounds") !== -1) {
                                  if (data.Products[i].LocalizedProperties[0].Images[k].ImagePurpose === "Poster") { //FeaturePromotionalSquareArt
                                      ssInd = k;
                                      break;
                                  }
                              } else {
                                if (data.Products[i].LocalizedProperties[0].Images[k].ImagePurpose === "Poster" && data.Products[i].LocalizedProperties[0].Images[k].Width < data.Products[i].LocalizedProperties[0].Images[k].Height && data.Products[i].LocalizedProperties[0].Images[k].Width > 40) {
                                      ssInd = k;
                                      break; // preferred art
                                  }
                                  if (data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Logo" && data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 271) {
                                      ssInd = k;
                                      //break;
                                  }
                                  if ((data.Products[i].LocalizedProperties[0].Images[k].ImagePurpose === "Tile" || data.Products[i].LocalizedProperties[0].Images[k].ImagePurpose === "tile")
                                      && data.Products[i].LocalizedProperties[0].Images[k].Width === data.Products[i].LocalizedProperties[0].Images[k].Height && data.Products[i].LocalizedProperties[0].Images[k].Width > 271) {
                                      ssInd = k;
                                      //break;
                                  }
                                  // if ((data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "Tile" || data.Products[i].LocalizedProperties[0].Images[j].ImagePurpose === "tile") 
                                  //   && data.Products[i].LocalizedProperties[0].Images[j].Width === data.Products[i].LocalizedProperties[0].Images[j].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 149) {
                                  //   ssInd = j;
                                  //   break;
                                  // } 
                                  if (data.Products[i].LocalizedProperties[0].Images[k].Width === data.Products[i].LocalizedProperties[0].Images[k].Height && data.Products[i].LocalizedProperties[0].Images[j].Width > 271) {
                                      ssInd = k;
                                      //break;
                                  }
                                  if (data.Products[i].LocalizedProperties[0].Images[k].ImagePurpose === "Poster") {
                                      ssInd = k;
                                      //break
                                  }
                              }
                          }
                          var squareshot = data.Products[i].LocalizedProperties[0].Images[ssInd].Uri.replace("http:", "https:");
                          var boxbgColor = data.Products[i].LocalizedProperties[0].Images[ssInd].BackgroundColor;
                          //if (squareshot.indexOf("xboxlive.com") !== -1) { squareshot = squareshot + "&w=300&format=jpg"; }
                          var itemId = data.Products[i].ProductId.toUpperCase();

                          if (itemId === "9NBLGGH1Z6FQ") {
                              squareshot = "https://compass-ssl.xbox.com/assets/31/f7/31f7fa75-a7ec-4769-893f-12cc0752373e.jpg?n=ReCore_Boxshot-digital-X1_294x215.jpg";
                          }
                          if (itemId === "BZFK7WNK7R4M") {
                              squareshot = "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTc6LYEXhNheFwp2halN6MiJq0hK8tHwcOslhHzFcqc.uw90wjv2YtwC_mZJs.lEh1cto.K33xsXgRNctiGCKrDjVsG9PhS5GzkLXFMF5wlXsJAfaI6.Hc6zR2KrB00Sjgkn0kvJZv.PD1.7g.ytDgP368SN3vocTlHhhyS_BQ8qZs-";
                          }
                          if (itemId === "9WZDNCRFJ3P2" || itemId === "9WZDNCRFJ1XX") {
                              boxbgColor = "blue";
                          }
                      }
                      // custom square shot
                      if (addonCustomImages[itemId] !== undefined) {
                        squareshot = addonCustomImages[itemId]
                      }

                      // get screenshot
                      if (phys === "false" && data.Products[i].LocalizedProperties[0].Images !== undefined) {
                          var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                          var imageInd = 1;
                          for (var j = 0; j < imagesNum; j++) {
                              var im = data.Products[i].LocalizedProperties[0].Images[j];
                              if ((im.ImagePurpose === "ImageGallery" || im.ImagePurpose === "Screenshot") && (im.Height < im.Width)) {
                                  imageInd = j;
                                  break;
                              }
                          }
                          if (data.Products[i].LocalizedProperties[0].Images[imageInd]) {
                              var itemScreenshot = data.Products[i].LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                          } else {
                              var itemScreenshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          }
                          if (itemScreenshot.indexOf("xboxlive.com") !== -1) {
                              itemScreenshot = itemScreenshot + "&w=480&format=jpg";
                          }
                      } else {
                          if (data.Products[i].LocalizedProperties[0].Images !== undefined && data.Products[i].LocalizedProperties[0].Images[0]) {
                              var itemScreenshot = data.Products[i].LocalizedProperties[0].Images[0].Uri.replace("http:", "https:") + "&w=231&h=197&q=90&m=6&b=%23FFFFFFFF&o=f";
                          } else {
                              var itemScreenshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                          }
                      }

                      // get screenshot array
                      var ssarray = [];
                      // if (phys === "false" && data.Products[i].LocalizedProperties[0].Images !== undefined) {
                      //   var imagesNum = data.Products[i].LocalizedProperties[0].Images.length;
                      //   var sslimit = 5;
                      //   var imageInd = 1;
                      //   for (var j = 0; j < imagesNum; j++) {
                      //     var im = data.Products[i].LocalizedProperties[0].Images[j];
                      //     if ((im.ImagePurpose.toLowerCase() === "imagegallery" || im.ImagePurpose.toLowerCase() === "screenshot") && (im.Height < im.Width)) {
                      //       if (im.Uri.indexOf("xboxlive.com") !== -1) {
                      //         var ssimg = im.Uri.replace("http:", "https:") + "&w=980&format=jpg";
                      //       } else {
                      //         var ssimg = im.Uri.replace("http:", "https:");
                      //       }
                      //       if (ssarray.length < sslimit) {
                      //         if (ssarray.indexOf(ssimg) === -1 && omitimages.indexOf(ssimg) === -1) {
                      //           ssarray.push(ssimg);
                      //         }
                      //       } else {
                      //         break;
                      //       } 
                      //     }
                      //   }
                      // }


                      var releaseDate = data.Products[i].MarketProperties[0].OriginalReleaseDate;
                      if (releaseDate === undefined) {
                          releaseDate = 0;
                      }
                      var modDate = data.Products[i].DisplaySkuAvailabilities[0].Availabilities[0].LastModifiedDate;
                      if (modDate === undefined) {
                          modDate = 0;
                      }
                      if (releaseDate === 0 && data.Products[i].DisplaySkuAvailabilities[0].Availabilities[0].Properties.PreOrderReleaseDate !== undefined) {
                          releaseDate = data.Products[i].DisplaySkuAvailabilities[0].Availabilities[0].Properties.PreOrderReleaseDate;
                      }
                      var msproduct = data.Products[i].IsMicrosoftProduct;
                      var multiplayer = "false";
                      var coop = "false";
                      var mptest = data.Products[i].Properties;
                      if (mptest.Attributes) {
                          for (var n = 0; n < mptest.Attributes.length; n++) {
                              if (mptest.Attributes[n].Name.toLowerCase().indexOf("multiplayer") !== -1) {
                                  multiplayer = "true";
                              }
                              if (mptest.Attributes[n].Name.toLowerCase().indexOf("coop") !== -1) {
                                  coop = "true";
                              }
                          }
                      }

                      //get prices
                      var listprice;
                      var msrpprice;
                      var taxincluded = "false";
                      var enddate = "none";
                      var currencycode;
                      var onsale = "false";
                      var gwg = "false";
                      var golddiscount = "false"; // deals with gold ... and gold member sale prices?
                      var goldandsilversale = "false";
                      var goldandsilversalegoldprice = 100000000;
                      var specialprice = 100000000;
                      var eaaccessgame = "false";
                      var gamepassgame = "false";
                      var eaplaygame = "false";
                      var gamepassprice = 0;
                      var eaplayprice = 0;
                      var purchasable = "false";
                      var tempea = "false"
                      var tempgs = "false";
                      var goldaffids = [];
                      var silversaleperc = "0%";
                      var goldandsilversalegoldperc = "0%";
                      var subskus = {};
                      var platxbox = "false";
                      var platpc = "false";

                      if (phys === "false") {
                          if (data.Products[i].LocalizedProperties[0].EligibilityProperties !== null && data.Products[i].LocalizedProperties[0].EligibilityProperties !== undefined &&
                              data.Products[i].LocalizedProperties[0].EligibilityProperties !== "undefined") {
                              if (data.Products[i].LocalizedProperties[0].EligibilityProperties.Affirmations.length > 0) {
                                  data.Products[i].LocalizedProperties[0].EligibilityProperties.Affirmations.forEach(function (aff) {
                                      if (aff.Description.toLowerCase().indexOf("ea access") !== -1) {
                                          tempea = "true";
                                      }
                                      if (aff.Description.toLowerCase().indexOf("game pass") !== -1) {
                                          gamepassgame = "true";
                                      }
                                      if (aff.Description.toLowerCase().indexOf("ea play") !== -1) {
                                          eaplaygame = "true";
                                      }
                                      if (aff.Description.toLowerCase().indexOf("gold") !== -1) {
                                          tempgs = "true";
                                          goldaffids.push(aff.AffirmationProductId);
                                      }
                                  })
                              }
                              if (data.Products[i].LocalizedProperties[0].EligibilityProperties.Remediations.length > 0) {
                                  data.Products[i].LocalizedProperties[0].EligibilityProperties.Remediations.forEach(function (re) {
                                      if (re.Description.toLowerCase().indexOf("ea access") !== -1) {
                                          tempea = "true";
                                      }
                                      // if (re.Description.toLowerCase().indexOf("game pass") !== -1) {
                                      //     gamepassgame = "true";
                                      // }
                                      if (re.Description.toLowerCase().indexOf("ea play") !== -1) {
                                          eaplaygame = "true";
                                      }
                                      // if (re.Description.toLowerCase().indexOf("gold") !== -1) {
                                      //     tempgs = "true";
                                      //     goldaffids.push(aff.AffirmationProductId);
                                      // }
                                  })
                              }
                          }
                          var purchindexes = [];
                          data.Products[i].DisplaySkuAvailabilities.forEach(function (sku, skuind) {
                              var purchnum = 0;
                              sku.Availabilities.forEach(function (av, ind) {
                                  if (av.Actions.indexOf("Purchase") !== -1) {
                                      purchasable = "true";
                                      purchnum++;
                                      if (purchnum > 1 && tempgs === "true" && av.RemediationRequired === true && goldaffids.indexOf(av.Remediations[0].BigId) !== -1) {
                                          goldandsilversale = "true";
                                      }
                                      av.Conditions.ClientConditions.AllowedPlatforms.forEach(function(plat) {
                                          if (plat.PlatformName === "Windows.Xbox") {
                                              platxbox = "true";
                                          }
                                          if (plat.PlatformName === "Windows.Desktop") {
                                              platpc = "true";
                                          }
                                      })
                                      if (av.Remediations && av.Remediations[0].BigId === "CFQ7TTC0K5DJ") {
                                          tempgs = "true";
                                          goldandsilversale = "true";
                                          golddiscount = "true";
                                      }
                                      if (subscriptiongames.indexOf(data.Products[i].ProductId) !== -1 && purchindexes.indexOf(skuind) === -1) {
                                        purchindexes.push(skuind);
                                      } 
                                      if (gamepassgame === "true") {
                                        if (av.RemediationRequired === true) {
                                          av.Remediations.forEach(function(rm) {
                                            if (rm.BigId === "CFQ7TTC0K6L8") {
                                              gamepassprice = av.OrderManagementData.Price.ListPrice;
                                            }
                                          })
                                        }
                                      }
                                      if (eaplaygame === "true") {
                                        if (av.RemediationRequired === true) {
                                          av.Remediations.forEach(function(rm) {
                                            if (rm.BigId === "CFQ7TTC0K5DH" && av.OrderManagementData.Price.MSRP !== 0) {
                                              eaplayprice = av.OrderManagementData.Price.ListPrice;
                                            }
                                          })
                                        }
                                      }
                                  }
                                  if (av.Actions.indexOf("Purchase") !== -1 && (av.OrderManagementData.Price.MSRP !== 0 || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) &&
                                      sku.Sku.Properties.IsTrial === false) {
                                      if ((av.OrderManagementData.Price.ListPrice !== av.OrderManagementData.Price.MSRP || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) && ind !== 0) {
                                          specialprice = av.OrderManagementData.Price.ListPrice;
                                      } else {
                                          listprice = av.OrderManagementData.Price.ListPrice;
                                          enddate = av.Conditions.EndDate;
                                      }
                                      if (ind === 0) {
                                          msrpprice = av.OrderManagementData.Price.MSRP;
                                      }
                                      currencycode = av.OrderManagementData.Price.CurrencyCode;
                                      if (av.Properties.MerchandisingTags !== undefined) {
                                          if (av.Properties.MerchandisingTags.indexOf("LegacyGamesWithGold") !== -1) {
                                              gwg = "true";
                                              specialprice = listprice;
                                              listprice = msrpprice;
                                              enddate = av.Conditions.EndDate;
                                          }
                                          if (av.Properties.MerchandisingTags.indexOf("LegacyDiscountGold") !== -1) {
                                              golddiscount = "true";

                                          }
                                      }
                                      if (goldandsilversale === "true" && av.DisplayRank === 1) {
                                          goldandsilversalegoldprice = av.OrderManagementData.Price.ListPrice;
                                          var golddiff = msrpprice - goldandsilversalegoldprice;
                                          goldandsilversalegoldperc = Math.round(golddiff / msrpprice * 100).toString() + "%";
                                      }
                                      if (tempea === "true" && av.Actions.length >= 2) {
                                          eaaccessgame = "true";
                                      }
                                      if (listprice < msrpprice) {
                                          onsale = "true";
                                          var listdiff = msrpprice - listprice;
                                          silversaleperc = Math.round(listdiff / msrpprice * 100).toString() + "%";
                                          if (gameIdArrays["onsale"].indexOf(itemId) === -1) {
                                              gameIdArrays["onsale"].push(itemId);
                                          }
                                      }
                                      if (av.OrderManagementData.Price.TaxType && av.OrderManagementData.Price.TaxType === "ConsumptionTaxIncluded") {
                                          taxincluded = "true";
                                      }
                                  }
                              })
                          })
                        if (purchindexes.length > 0) {
                          for (var p = 0; p < purchindexes.length; p++) {
                            var subsku = data.Products[i].DisplaySkuAvailabilities[p].Sku.SkuId;
                            var subpricetext = data.Products[i].DisplaySkuAvailabilities[p].Sku.LocalizedProperties[0].SkuTitle;
                            var subprice = data.Products[i].DisplaySkuAvailabilities[p].Availabilities[0].OrderManagementData.Price.RecurrencePrice;
                            subskus[subsku] = {};
                            subskus[subsku]["subpricetext"] = subpricetext;
                            subskus[subsku]["subprice"] = subprice;
                          }
                        }

                      } else {
                          data.Products[i].DisplaySkuAvailabilities.forEach(function (sku) {
                              sku.Availabilities.forEach(function (av) {
                                  if (av.Actions.indexOf("Purchase") !== -1 && av.Actions.indexOf("Browse") !== -1 && (av.OrderManagementData.Price.MSRP !== 0 || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) && av.Actions.length > 2) {
                                      listprice = av.OrderManagementData.Price.ListPrice;
                                      enddate = av.Conditions.EndDate;
                                      msrpprice = av.OrderManagementData.Price.MSRP;
                                      currencycode = av.OrderManagementData.Price.CurrencyCode;
                                      if (listprice < msrpprice) {
                                          onsale = "true";
                                          if (gameIdArrays["onsale"].indexOf(itemId) === -1) {
                                              gameIdArrays["onsale"].push(itemId);
                                          }
                                      };
                                  }
                              })
                          })
                      }


                      if (listprice === undefined) {
                          //console.log("NOTE: BigID " + itemId + " has no price information.");
                          listprice = 100000000;
                          msrpprice = 100000000;
                          currencycode = "USD";
                      }

                      
                      var rating = "none";
                      var ratingUrl = "https://www.esrb.org/";
                      var ratingcode = "";
                      var ratingage = 99;
                      var ratingsystem = "none";
                      var kidfamilyratings = ["ESRB:T", "ESRB:E10", "ESRB:E", "PEGI:3", "PEGI:7", "PEGI:12", "COB-AU:G", "COB-AU:PG", "OFLC-NZ:G", "OFLC-NZ:PG", "OFLC-NZ:R13", "USK:Everyone", "USK:6", "USK:12",
                          "PCBP:0", "PCBP:6", "PCBP:12", "DJCTQ:L", "DJCTQ:10", "DJCTQ:12", "DJCTQ:14", "CSRR:G", "CSRR:PG12", "CSRR:PG15"
                      ]
                      var rawdescriptors = "none";
                      var rawinteractive = "none";
                      var rawdisclaimers = "none";
                      var pegiFallbackRegions = "en-za ,";
                      var iarcFallbackRegions = "ja-jp ,";
                      var cr = 99;
                      var cresrb = 99;
                      var crfallback = 0;
                      var crfallback_PEGI = -1;
                      var crfallback_IARC = -1;
                      if (data.Products[i].MarketProperties[0].ContentRatings !== undefined && data.Products[i].MarketProperties[0].ContentRatings !== null && data.Products[i].MarketProperties[0].ContentRatings.length > 0) {
                          for (var c = 0; c < data.Products[i].MarketProperties[0].ContentRatings.length; c++) {
                            // if (data.Products[i].MarketProperties[0].ContentRatings[c].RatingSystem === "ESRB") {
                            //   cresrb = c;
                            // }
                            if (data.Products[i].MarketProperties[0].ContentRatings[c].RatingSystem === "Microsoft") { // Microsoft rating is fallback
                              crfallback = c;
                            }
                            if ((pegiFallbackRegions.includes(urlRegion)) && data.Products[i].MarketProperties[0].ContentRatings[c].RatingSystem === "PEGI") { // PEGI fallback for en-za
                              crfallback_PEGI = c;
                            }
                            if ((iarcFallbackRegions.includes(urlRegion)) && data.Products[i].MarketProperties[0].ContentRatings[c].RatingSystem === "IARC") { // PEGI fallback for en-za
                              crfallback_IARC = c;
                            }
                            if (data.Products[i].MarketProperties[0].ContentRatings[c].RatingSystem === ratingorg) {
                              cr = c;
                            }
                          }
                          if (cr === 99) { cr = cresrb } // if region's rating system is not found, use esrb
                          if (cr === 99) { cr = crfallback } // fallback if no esrb either
                          if ((pegiFallbackRegions.includes(urlRegion)) && crfallback_PEGI !== -1 && cr === crfallback) { cr = crfallback_PEGI } // fallback if pegi needed
                          if ((iarcFallbackRegions.includes(urlRegion)) && crfallback_IARC !== -1 && cr === crfallback) { cr = crfallback_IARC } // fallback if iarc needed
                          ratingsystem = data.Products[i].MarketProperties[0].ContentRatings[cr].RatingSystem;
                          ratingcode = data.Products[i].MarketProperties[0].ContentRatings[cr].RatingId;
                          var ratimage = ratingData.RatingBoards[ratingsystem].Ratings[ratingcode].LocalizedProperties[0].LogoUrl;
                          ratingage = ratingData.RatingBoards[ratingsystem].Ratings[ratingcode].Age;
                          rating = ratingData.RatingBoards[ratingsystem].Ratings[ratingcode].LocalizedProperties[0].LongName;
                          ratingUrl = ratingData.RatingBoards[ratingsystem].LocalizedProperties[0].Url;
                          
                          if (kidfamilyratings.indexOf(rating) !== -1) {
                              gameIdArrays["kidsfamily"].push(itemId);
                          }
                          rawdescriptors = data.Products[i].MarketProperties[0].ContentRatings[cr].RatingDescriptors.join(",");
                          if (data.Products[i].MarketProperties[0].ContentRatings[cr].InteractiveElements !== undefined) {
                            rawinteractive = data.Products[i].MarketProperties[0].ContentRatings[cr].InteractiveElements.join(",");
                          }
                          rawdisclaimers = data.Products[i].MarketProperties[0].ContentRatings[cr].RatingDisclaimers.join(",");
                      }
                    

                      if (urlRegion === "ja-jp" || urlRegion === "ko-kr") {
                          $(".c-label[data-game='kids and family']").remove()
                      }

                      // if (biuArray.indexOf(itemId) === -1) {
                      var itemhref = 'https://www.xbox.com/' + urlRegion + '/games/store/' + titleClickname + '/' + itemId;
                      // } else {
                      // var itemhref = bigidUrls[itemId];
                      // var splitHref = itemhref.split("/")
                      // splitHref.splice(3, 0, urlRegion)
                      // itemhref = splitHref.join("/")
                      //}

                      var avgstars = 0;
                      var ratingcount = 0;
                      if (data.Products[i].MarketProperties[0].UsageData) {
                          data.Products[i].MarketProperties[0].UsageData.forEach(function (rt) {
                              if (rt.AggregateTimeSpan.toLowerCase() === "alltime") {
                                  avgstars = rt.AverageRating;
                                  ratingcount = rt.RatingCount;
                              }
                          })
                      }

                      // xbl gold stuff
                      var xblrequired = "false";
                      var xblmultrequired = "false";
                      if (data.Products[i].Properties.Attributes) {
                          for (var k = 0; k < data.Products[i].Properties.Attributes.length; k++) {
                              if ($("#goldrequiredflag").attr("data-gold-required") && $("#goldrequiredflag").attr("data-gold-required").toLowerCase() === "true") {
                                  xblrequired = "true";
                              }
                              if (data.Products[i].Properties.Attributes[k].Name === "XblOnlineMultiPlayer" ||
                                  (data.Products[i].Properties.Attributes[k].Name === "OnlineMultiplayerWithGold" && data.Products[i].Properties.Attributes[k].Maximum !== 1)) {
                                  xblmultrequired = "true";
                              }
                          }
                      }


                      if (itemId === "9NBLGGH1Z6FQ") {
                          itemBoxshot = "https://compass-ssl.xbox.com/assets/31/f7/31f7fa75-a7ec-4769-893f-12cc0752373e.jpg?n=ReCore_Boxshot-digital-X1_294x215.jpg";
                          itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/31/f7/31f7fa75-a7ec-4769-893f-12cc0752373e.jpg?n=ReCore_Boxshot-digital-X1_294x215.jpg";
                      }
                      if (itemId === "BZFK7WNK7R4M") {
                          itemBoxshot = "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTc6LYEXhNheFwp2halN6MiJq0hK8tHwcOslhHzFcqc.uw90wjv2YtwC_mZJs.lEh1cto.K33xsXgRNctiGCKrDjVsG9PhS5GzkLXFMF5wlXsJAfaI6.Hc6zR2KrB00Sjgkn0kvJZv.PD1.7g.ytDgP368SN3vocTlHhhyS_BQ8qZs-&w=200&format=jpg";
                          itemBoxshotSmall = "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTc6LYEXhNheFwp2halN6MiJq0hK8tHwcOslhHzFcqc.uw90wjv2YtwC_mZJs.lEh1cto.K33xsXgRNctiGCKrDjVsG9PhS5GzkLXFMF5wlXsJAfaI6.Hc6zR2KrB00Sjgkn0kvJZv.PD1.7g.ytDgP368SN3vocTlHhhyS_BQ8qZs-&w=200&format=jpg";
                      }

                      // genres
                      if (data.Products[i].Properties.Categories !== undefined && data.Products[i].Properties.Categories !== null) {
                          var gamegenres = data.Products[i].Properties.Categories.join(", ").toLowerCase();
                      } else {
                          var gamegenres = "unlisted";
                      }

                      var recentxgp = "false";
                      // if (gameIdArrays["SubsXGPRecentlyAdded"].indexOf(itemId) !== -1) {
                      //   recentxgp = "true";
                      // }

                      allGames[itemId] = {
                          releasedate: releaseDate, msproduct: msproduct, multiplayer: multiplayer, coop: coop, rating: rating, ratingage: ratingage, ratingsystem: ratingsystem,
                          gameurl: itemhref, titleclickname: titleClickname, boxshot: itemBoxshot, boxshotsmall: itemBoxshotSmall, title: itemTitle, msrpprice: msrpprice,
                          listprice: listprice, currencycode: currencycode, onsale: onsale, upcoming: "false", newrelease: "false", physical: phys, genres: gamegenres,
                          screenshot: itemScreenshot, ratingUrl: ratingUrl, ratimage: ratimage, descriptors: rawdescriptors, disclaimers: rawdisclaimers, interactive: rawinteractive, stars: avgstars, starcount: ratingcount, screenarray: ssarray, description: shortdesc,
                          gameswithgold: gwg, golddiscount: golddiscount, goldandsilversale: goldandsilversale, goldandsilversalegoldprice: goldandsilversalegoldprice,
                          specialprice: specialprice, eaaccessgame: eaaccessgame, gamepassgame: gamepassgame, eaplaygame: eaplaygame, purchasable: purchasable, silversaleperc: silversaleperc,
                          goldandsilversalegoldperc: goldandsilversalegoldperc, x360game: "false", includes: "", excludes: "", playson: "false", moddate: modDate, recentxgp: recentxgp,
                          enddate: enddate, squareshot: squareshot, boxbgcolor: boxbgColor, boxart: itemBoxart, poster: itemPoster, taxincluded: taxincluded,
                          xblrequired: xblrequired, xblmultrequired: xblmultrequired, subskus: subskus, gamepassprice: gamepassprice, eaplayprice: eaplayprice,
                          platformxbox: platxbox, platformpc: platpc
                      };

                      //make API-provided lists        
                      if (msproduct === true) {
                          gameIdArrays["exclusives"].push(itemId);
                      }
                      if (multiplayer === "true") {
                          gameIdArrays["multiplayer"].push(itemId);
                      }
                      var reldate = new Date(releaseDate);
                      if (reldate > nowdate) {
                          gameIdArrays["upcoming"].push(itemId);
                          allGames[itemId]["upcoming"] = "true";
                      }
                      if (reldate < nowdate && monthsagofilterdate < reldate) {
                          gameIdArrays["newreleases"].push(itemId);
                          allGames[itemId]["newrelease"] = "true";
                      }

                      popcounter++;

                      //console.log("itemId:" + itemId + "  " + i + ":" + (productQuantity -1) + "   " + popcounter + ":" + (fullGameArray.length) + "  locagamesremoved:" + locgamesremoved + "   " + count + ":" + chunktotal)

                      if ((i === (productQuantity - 1)) && count === chunktotal - 1) {
                          var activecheck = setInterval(function () {
                              var activeAjax = $.active;
                              if (activeAjax === 0) {
                                  ajaxdone();
                                  clearInterval(activecheck);
                              }
                          }, 500);

                          function ajaxdone() {
                              // Object.assign(allGames, all360Games);
                              // delete all360Games

                              //$(".gameDiv").last().after('<script type="text/javascript" src="/en-US/global-resources/templates/MWF/JS/MWF-Aria-Boxshots-loc.js"></s' + 'cript>');
                              //$(".gameDivsWrapper").append(gamehtml);
                              var x1RegionPop = (function () {
                                  $(".gameDiv a").each(function () {
                                      var rawHref = $(this).attr("href")
                                      var splitHref = rawHref.split("/")
                                      splitHref.splice(3, 0, urlRegion)
                                      var newHref = splitHref.join("/")
                                      $(this).attr("href", newHref)
                                  })
                              })();

                              $("a[data-sorting='release']").eq(2).remove()
                              //$(".generalSort li a").eq(0).attr("aria-checked", "true");

                              pagePop();


                          }
                      }
                      
                  }
              }
          }

          function pagePop() {
              // add steam dropdowns
              $(".moduleStandard .purchaseDrop").append('<option value="steam1">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".moduleSilver .purchaseDrop").append('<option value="steam2">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".moduleGold .purchaseDrop").append('<option value="steam3">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".moduleFourth .purchaseDrop").append('<option value="steam4">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".module5 .purchaseDrop").append('<option value="steam5">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".module6 .purchaseDrop").append('<option value="steam6">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".module7 .purchaseDrop").append('<option value="steam7">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');
              $(".module8 .purchaseDrop").append('<option value="steam8">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Steam") + '</option>');


              //add gamestore dropdown item
              $(".moduleStandard .purchaseDrop").append('<option value="gameStore1">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".moduleSilver .purchaseDrop").append('<option value="gameStore2">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".moduleGold .purchaseDrop").append('<option value="gameStore3">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".moduleFourth .purchaseDrop").append('<option value="gameStore4">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".module5 .purchaseDrop").append('<option value="gameStore5">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".module6 .purchaseDrop").append('<option value="gameStore6">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".module7 .purchaseDrop").append('<option value="gameStore7">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');
              $(".module8 .purchaseDrop").append('<option value="gameStore8">' + $("#downloadsteamtext").text().replace("[[PLACEHOLDER]]", "Epic Games Store") + '</option>');

              var standard = document.querySelector('.purchase');
              if(standard) {
                  if(standard.classList.contains('steamPreorder')){
                      $(".moduleStandard .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steamPreorder steam1">' +
                      '<div class="c-group">' +
                      '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#preordertext").text() + '</span></a>' +
                      '</div></div>');
                  } else {
                      $(".moduleStandard .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam1">' +
                      '<div class="c-group">' +
                      '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                      '</div></div>');
                  }

                  if(standard.classList.contains('gameStorePreOrder')){
                      $(".moduleStandard .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore1">' +
                      '<div class="c-group">' +
                      '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#preordertext").text() + '</span></a>' +
                      '</div></div>');
                  } else {
                      $(".moduleStandard .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore1">' +
                      '<div class="c-group">' +
                      '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                      '</div></div>');
                  }
              }


              //steam section
              $(".moduleSilver .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam2">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".moduleGold .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam3">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".moduleFourth .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam4">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module5 .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam5">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module6 .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam6">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module7 .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam7">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module8 .purchaseButtons").last().after('<div class="purchaseButtons hidden steamdl steam8">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="steam"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');


              //game store section
              $(".moduleSilver .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore2">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".moduleGold .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore3">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".moduleFourth .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore4">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module5 .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore5">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module6 .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore6">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module7 .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore7">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');
              $(".module8 .purchaseButtons").last().after('<div class="purchaseButtons hidden gameStoredl gameStore8">' +
                  '<div class="c-group">' +
                  '<a href="#" class="c-call-to-action f-primary c-glyph" target="_blank" data-retailer="game store"><span>' + $("#buynowtext").text() + '</span></a>' +
                  '</div></div>');

              $(".purchase").each(function () {
                  var purcheach = this;
                  $(purcheach).find(".purchaseDrop option").each(function (ind) {
                      $(this).addClass("opt" + ind);
                  })
              })

              givenbigids = {};
              var editions = ["Standard", "Silver", "Gold", "Fourth", "5", "6", "7", "8"];
              for (var i = 0; i < editions.length; i++) {
                  grabgivenbigids(editions[i]);
              }
              function grabgivenbigids(edition) {
                if ($("#edition" + edition).length > 0) {
                  givenbigids[edition.toLowerCase() + "DL"] = $("#edition" + edition).data("download-bigid").toUpperCase().trim();
                  givenbigids[edition.toLowerCase() + "Disc"] = $("#edition" + edition).data("disc-bigid").toUpperCase().trim();
                  givenbigids[edition.toLowerCase() + "Oth"] = $("#edition" + edition).data("other-bigid").toUpperCase().trim();
                  givenbigids[edition.toLowerCase() + "DLUp"] = $("#edition" + edition).data("download-bigid-updated").toUpperCase().trim();
                  givenbigids[edition.toLowerCase() + "DiscUp"] = $("#edition" + edition).data("disc-bigid-updated").toUpperCase().trim();
                  givenbigids[edition.toLowerCase() + "OthUp"] = $("#edition" + edition).data("other-bigid-updated").toUpperCase().trim();
                  if (allGames[givenbigids[edition.toLowerCase() + "DLUp"]] !== undefined && allGames[givenbigids[edition.toLowerCase() + "DLUp"]].purchasable === "true") {
                      givenbigids[edition.toLowerCase() + "DLUse"] = givenbigids[edition.toLowerCase() + "DLUp"];
                  } else {
                      givenbigids[edition.toLowerCase() + "DLUse"] = givenbigids[edition.toLowerCase() + "DL"];
                  }
                  if (allGames[givenbigids[edition.toLowerCase() + "DiscUp"]] !== undefined && allGames[givenbigids[edition.toLowerCase() + "DiscUp"]].purchasable === "true") {
                      givenbigids[edition.toLowerCase() + "DiscUse"] = givenbigids[edition.toLowerCase() + "DiscUp"];
                  } else {
                      givenbigids[edition.toLowerCase() + "DiscUse"] = givenbigids[edition.toLowerCase() + "Disc"];
                  }
                  if (allGames[givenbigids[edition.toLowerCase() + "OthUp"]] !== undefined && allGames[givenbigids[edition.toLowerCase() + "OthUp"]].purchasable === "true") {
                      givenbigids[edition.toLowerCase() + "OthUse"] = givenbigids[edition.toLowerCase() + "OthUp"];
                  } else {
                      givenbigids[edition.toLowerCase() + "OthUse"] = givenbigids[edition.toLowerCase() + "Oth"];
                  }
                } else {
                  givenbigids[edition.toLowerCase() + "DL"] = "0";
                  givenbigids[edition.toLowerCase() + "Disc"] = "0";
                  givenbigids[edition.toLowerCase() + "Oth"] = "0";
                  givenbigids[edition.toLowerCase() + "DLUp"] = "0";
                  givenbigids[edition.toLowerCase() + "DiscUp"] = "0";
                  givenbigids[edition.toLowerCase() + "OthUp"] = "0";
                  givenbigids[edition.toLowerCase() + "DLUse"] = "0";
                  givenbigids[edition.toLowerCase() + "DiscUse"] = "0";
                  givenbigids[edition.toLowerCase() + "OthUse"] = "0";
                }
              }

              var daystext = $("#daystext").text();
              var hourstext = $("#hourstext").text();
              var minutestext = $("#minutestext").text();
              var daytext = $("#daytext").text();
              var hourtext = $("#hourtext").text();
              var minutetext = $("#minutetext").text();
              function timeleft(nowdate, finaldate) {
                  var msecPerMinute = 1000 * 60;
                  var msecPerHour = msecPerMinute * 60;
                  var msecPerDay = msecPerHour * 24;

                  var interval = finaldate - nowdate;

                  var days = Math.floor(interval / msecPerDay);
                  interval = interval - (days * msecPerDay);

                  var hours = Math.floor(interval / msecPerHour);
                  interval = interval - (hours * msecPerHour);

                  var minutes = Math.floor(interval / msecPerMinute);
                  // interval = interval - (minutes * msecPerMinute );  

                  // var seconds = Math.floor(interval / 1000 );  

                  var returntext = "";
                  if (days > 1) {
                      returntext = days + " " + daystext;
                  } else if (days === 1) {
                      returntext = days + " " + daytext;
                  } else {
                      var finalhours = hourstext;
                      if (hours === 1) { finalhours = hourtext }
                      var finalminutes = minutestext;
                      if (minutes === 1) { finalminutes = minutetext }
                      returntext = hours + " " + finalhours + " " + minutes + " " + finalminutes;
                  }

                  return returntext
              }

              // steam integration
              var steamStandard = $("#editionStandard").data("steam");
              var steamSilver = $("#editionSilver").data("steam");
              var steamGold = $("#editionGold").data("steam");
              var steamFourth = $("#editionFourth").data("steam");
              var steam5 = $("#edition5").data("steam");
              var steam6 = $("#edition6").data("steam");
              var steam7 = $("#edition7").data("steam");
              var steam8 = $("#edition8").data("steam");

              // Game Store integration
              var gameStoreStandard = $("#editionStandard").data("gamestore");
              var gameStoreSilver = $("#editionSilver").data("gamestore");
              var gameStoreGold = $("#editionGold").data("gamestore");
              var gameStoreFourth = $("#editionFourth").data("gamestore");
              var gameStore5 = $("#edition5").data("gamestore");
              var gameStore6 = $("#edition6").data("gamestore");
              var gameStore7 = $("#edition7").data("gamestore");
              var gameStore8 = $("#edition8").data("gamestore");

              var boxshottext = $("#boxshottext").text();

              //populate 
              populatemodule(".moduleStandard", givenbigids["standardDLUse"], givenbigids["standardDiscUse"], givenbigids["standardOthUse"], steamStandard, gameStoreStandard);
              populatemodule(".moduleSilver", givenbigids["silverDLUse"], givenbigids["silverDiscUse"], givenbigids["silverOthUse"], steamSilver, gameStoreSilver);
              populatemodule(".moduleGold", givenbigids["goldDLUse"], givenbigids["goldDiscUse"], givenbigids["goldOthUse"], steamGold, gameStoreGold);
              populatemodule(".moduleFourth", givenbigids["fourthDLUse"], givenbigids["fourthDiscUse"], givenbigids["fourthOthUse"], steamFourth, gameStoreFourth);
              populatemodule(".module5", givenbigids["5DLUse"], givenbigids["5DiscUse"], givenbigids["5OthUse"], steam5, gameStore5);
              populatemodule(".module6", givenbigids["6DLUse"], givenbigids["6DiscUse"], givenbigids["6OthUse"], steam6, gameStore6);
              populatemodule(".module7", givenbigids["7DLUse"], givenbigids["7DiscUse"], givenbigids["7OthUse"], steam7, gameStore7);
              populatemodule(".module8", givenbigids["8DLUse"], givenbigids["8DiscUse"], givenbigids["8OthUse"], steam8, gameStore8);

            

              function populatemodule(moduleclass, dlbigid, discbigid, otherbigid, steam, gameStore) {
                  $(moduleclass).find(".steamdl a").attr("href", steam)
                  $(moduleclass).find(".gameStoredl a").attr("href", gameStore)

                  $(moduleclass).find(".pricing").not(".ignoreApi").html("");
                  var tempbigids = [dlbigid, discbigid, otherbigid];
                  var bigids = [];
                  for (var t = 0; t < tempbigids.length; t++) {
                      if (tempbigids[t].length >= 12) {
                          bigids.push(tempbigids[t]);
                      }
                  }
                  var maincontentbigid = dlbigid;
                  if (dlbigid === "") {
                      maincontentbigid = discbigid;
                  }
                  if (dlbigid === "" && discbigid === "") {
                      maincontentbigid = otherbigid;
                  }
                  if ((dlbigid === "" && discbigid === "" && otherbigid === "") || allGames[maincontentbigid] === undefined) {
                      $(moduleclass).remove();
                      return false;
                  }

                  if (maincontentbigid !== "") {
                      // rating stars
                      var point5rounded = Math.floor(allGames[maincontentbigid].stars * 2) / 2; // round down to nearest .5 for MWF
                      $(moduleclass).find(".c-rating").attr("data-value", point5rounded);
                      $(moduleclass).find(".c-rating span").eq(0).text(point5rounded.toString());
                  }
                  // big picture
                  if (!$(moduleclass).find("[data-grid='col-6'] picture").hasClass("ignoreApi")) {
                      $(moduleclass).find("[data-grid='col-6']").eq(0).find("picture").remove();
                      var bigboximage = allGames[maincontentbigid].poster;
                      $(moduleclass).find("[data-grid='col-6']").eq(0).append('<picture class="custompsimage">' +
                          '<source srcset="' + bigboximage + '" media="(min-width:0)">' +
                          '<img srcset="' + bigboximage + '" src="' + bigboximage + '" alt="' + allGames[maincontentbigid].title + ' ' +
                          boxshottext + '">' +
                          '</picture>')
                  }
                  // edition title
                  $(moduleclass).find("h3.c-heading-3").not(".ignoreApi").eq(0).text(allGames[maincontentbigid].title);

                  // pricing
                  var currregion;
                  var currentdate = new Date();
                  var salepricetext = $("#salepricetext").text();
                  var daysremaintext = $("#daysremaintext").text();
                  var xboxlivegoldtext = $("#xboxlivegoldtext").text();
                  var gamepasstext = $("#gamepasstext").text();
                  var eaaccesstext = $("#eaaccesstext").text();
                  var eaplaytext = eaplaystrings.locales[urlRegion].keyWitheaplay;
                  for (var i = 0; i < tempbigids.length; i++) {
                      var thebigid = tempbigids[i];
                      if (thebigid.length >= 12) {
                          var priceclass = "";
                          if (i === 0) {
                              priceclass = "pricedl"
                          }
                          if (i === 1) {
                              priceclass = "pricedisc";
                          }
                          if (i === 2) {
                              priceclass = "priceother";
                          }
                          if (allGames[thebigid] === undefined) {
                              console.error("BigID " + thebigid + " not found in API - please check availability")
                              continue;
                          }
                          if ((thebigid.length === 12 || thebigid.length === 17) && allGames[thebigid].purchasable === "true") {
                              if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                  var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                  var listshown = allGames[thebigid]["listprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                              } else {
                                  if (urlRegion === "ar-sa") {
                                      currregion = "en-us";
                                  } else {
                                      currregion = "en-ca";
                                  }
                                  var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                  var listshown = allGames[thebigid]["listprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                              }
                              if (urlRegion === "ja-jp" && allGames[thebigid]["taxincluded"] === "true") {
                                  listshown = listshown + " (税込)";
                                  msrpshown = msrpshown + " (税込)"
                              }
                              if (allGames[thebigid]["listprice"] !== 100000000) {
                                  if (allGames[thebigid]["msrpprice"] !== allGames[thebigid]["listprice"] && allGames[thebigid]["gameswithgold"] === "false") {
                                      var differencenum = allGames[thebigid]["msrpprice"] - allGames[thebigid]["listprice"];
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var diffshown = differencenum.toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var diffshown = differencenum.toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      var endtime = new Date(allGames[thebigid]["enddate"]);
                                      var timeleftstring = timeleft(currentdate, endtime);
                                      var priceshown = '<span class="priceareas pricearea' + moduleclass.replace(".module", "") + ' ' + priceclass + ' hidden">' +
                                          '<div class="leftCol"><h4 class="origPrice" aria-label="' + 
                                            oldnewpricestrings.locales["en-us"].keyOldprice.replace("<<PLACEHOLDERPRICE>>", msrpshown) + '">' + msrpshown + '</h4></div>' +
                                          '<div class="rightCol"><h4 aria-label="' + 
                                            oldnewpricestrings.locales["en-us"].keyNewprice.replace("<<PLACEHOLDERPRICE>>", listshown) + '">' + listshown + '</h4></div>' +
                                          '<p class="c-paragraph-4 zpt">' + salepricetext.replace("[[PLACEHOLDER1]]", diffshown) + ' &bull; ' + daysremaintext.replace("[[PLACEHOLDER2]]", timeleftstring) + '</p>';
                                  } else {
                                      var priceshown = '<span class="priceareas pricearea' + moduleclass.replace(".module", "") + ' ' + priceclass + ' hidden">' +
                                          '<div class="leftCol"><h4>' + msrpshown + '</h4></div>';
                                  }
                                  if (allGames[thebigid]["gameswithgold"] === "true") {
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      var endtime = new Date(allGames[thebigid]["enddate"]);
                                      var timeleftstring = timeleft(currentdate, endtime);
                                      priceshown += '<p class="c-paragraph-4 zpt">' + xboxlivegoldtext.replace("[[PLACEHOLDER]]", specialshown) + '</p>' +
                                          '<p class="c-paragraph-4 zpt">' + daysremaintext.replace("[[PLACEHOLDER2]]", timeleftstring) + '</p>';
                                  }
                                  if (allGames[thebigid]["goldandsilversalegoldperc"] !== "0%") {
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var specialshown = allGames[thebigid]["goldandsilversalegoldprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var specialshown = allGames[thebigid]["goldandsilversalegoldprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      var endtime = new Date(allGames[thebigid]["enddate"]);
                                      var timeleftstring = timeleft(currentdate, endtime);
                                      priceshown += '<p class="c-paragraph-4 zpt">' + xboxlivegoldtext.replace("[[PLACEHOLDER]]", specialshown) + '</p>' +
                                          '<p class="c-paragraph-4 zpt">' + daysremaintext.replace("[[PLACEHOLDER2]]", timeleftstring) + '</p>';
                                  }
                                  if (allGames[thebigid]["gamepassgame"] === "true" && (allGames[thebigid]["specialprice"] > 0 && 
                                      allGames[thebigid]["specialprice"] !== 100000000 && allGames[thebigid]["eaplaygame"] === "false")) {
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      priceshown += '<p class="c-paragraph-4 zpt">' + gamepasstext.replace("[[PLACEHOLDER]]", specialshown) + '</p>';
                                  }
                                  if (allGames[thebigid]["eaaccessgame"] === "true" && allGames[thebigid]["specialprice"] !== 100000000) {
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var specialshown = allGames[thebigid]["specialprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      priceshown += '<p class="c-paragraph-4 zpt">' + eaaccesstext.replace("[[PLACEHOLDER]]", specialshown) + '</p>';
                                  }
                                  if (allGames[thebigid]["eaplaygame"] === "true") {
                                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                                          var specialshown = allGames[thebigid]["eaplayprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      } else {
                                          var specialshown = allGames[thebigid]["eaplayprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                                      }
                                      priceshown += '<p class="c-paragraph-4 zpt">' + specialshown + ' ' + eaplaytext + '</p>';
                                  }
                              } else {
                                  var priceshown = "";
                              }
                              $(moduleclass).find(".pricing").append(priceshown + '</span>');

                              // buy links
                              var buynowtext = $("#buynowtext").text();
                              var preordertext = $("#preordertext").text();
                              var downloadtext = $("#downloadtext").text();
                              var buyariatext = $("#buyariatext").text();
                              var preorderariatext = $("#preorderariatext").text();
                              var downloadariatext = $("#downloadariatext").text();
                              var topctapreorder = $("#preordertext").text();
                              var topctagetitnow = topCtaText.locales[urlRegion].keyGetitnow;

                              // Steam Aria labels
                              var steamText = buyariatext.replace("Microsoft Store", "steam");
                                  steamText = steamText.replace("the ", "")
                              var steamAriaLabel = steamText.replace("[[PLACEHOLDER]]", allGames[thebigid]["title"]);

                              // steam pre-order aria-label
                              var steamTextPreorder = preorderariatext.replace("Microsoft Store", "steam");
                                  steamTextPreorder = steamTextPreorder.replace("the ", "");
                              var steamPreorderAria = steamTextPreorder.replace("[[PLACEHOLDER]]", allGames[thebigid]["title"]);

                              //Game Store Aria Labels
                              var gameStoreText = buyariatext.replace("Microsoft Store", "Epic Game Store");
                                  gameStoreText = gameStoreText.replace("the ", "")
                              var gameStoreAriaLabel = gameStoreText.replace("[[PLACEHOLDER]]", allGames[thebigid]["title"]); 
                              
                              
                              //Addes the steam and game store aria-label to steam link
                              var moduleBlock = $(moduleclass).hasClass("steamPreorder");
                              if(moduleBlock === false) {
                                  $(moduleclass).find(".steamdl a").attr("aria-label", steamAriaLabel);
                              } else {
                                  $(moduleclass).find(".steamdl a").attr("aria-label", steamPreorderAria);
                              }

                              
                              
                              $(moduleclass).find(".gameStoredl a").attr("aria-label", gameStoreAriaLabel);

                              if (forcepre === true) {
                                  var purchasetext = preordertext;
                                  var ariatext = preorderariatext
                                  var toptext = topctapreorder;
                              } else {
                                  if (allGames[thebigid]["upcoming"] === "false" || allGames[thebigid]["description"].toLowerCase().indexOf("game preview") !== -1 ||
                                      allGames[thebigid]["description"].toLowerCase().indexOf("gamepreview") !== -1 || allGames[thebigid]["title"].toLowerCase().indexOf("preview") !== -1 ||
                                      forcedbuyids.indexOf(thebigid) !== -1) {
                                      var purchasetext = buynowtext;
                                      var ariatext = buyariatext;
                                      var toptext = topctagetitnow;
                                  } else {

                                      var purchasetext = preordertext;
                                      var ariatext = preorderariatext
                                      var toptext = topctapreorder;
                                  }
                              }

                                  
                              if (allGames[thebigid]["msrpprice"] === 0 && allGames[thebigid]["upcoming"] === "false") {
                                  purchasetext = downloadtext;
                                  ariatext = downloadariatext
                              }
                              var linkeq = 0;
                              if (i === 1) { linkeq = 1 }
                              if (i === 2) { linkeq = 2 }
                              var linksection = $(moduleclass).find(".purchaseButtons").eq(linkeq);
                              $(linksection).find("a").not(".ignoreApi").remove();
                              $(linksection).find(".c-group").not(".ignoreApi").prepend('<a data-xbbigid="' + thebigid + '" href="' + allGames[thebigid]["gameurl"] + '" class="c-call-to-action f-primary c-glyph xbstorebuy" data-retailer="ms store" ' +
                                  'data-clickname="www>games>' + allGames[thebigid]["titleclickname"] + '>purchase>click" aria-label="' +
                                  ariatext.replace("[[PLACEHOLDER]]", allGames[thebigid]["title"]) + '"><span>' + purchasetext + '</span></a>')

                              if (moduleclass === ".moduleStandard") {
                                $("a[href='#purchaseoptions']").not(".ignoreApi").eq(0).find("span").text(toptext);
                                // DYNAMIC ARIA-LABEL FOR HERO CTA
                                  setTimeout(function() {
                                     var heroCta =  $('.glp-hero .heroCTA a').not(".singlePurch").not(".ignoreApi");
                                     var ariaPhrase = $("#mainCtaAriaLabel").text();
                                     var dynamicAria = toptext + ", " + ariaPhrase
                                     $(heroCta).attr('aria-label', dynamicAria);

                                    // console.log(dynamicAria);
                                   
                                  }, 3000)
                              
                                $("a[href='#purchaseoptions']").not(".ignoreApi").eq(0).find("span").text(toptext);
                              }
                          }
                      }
                  }

                  // show the first price area
                  $(moduleclass).find(".priceareas").eq(0).removeClass("hidden");

                  if ($(moduleclass).find(".priceareas").length === 0) {
                      $(moduleclass).remove();
                  }

                  // he-il chrome bug
                  if (urlRegion === "he-il" && navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
                      $(".priceareas .c-paragraph-4").hide();
                  }

              }

              // store popup buy
              (function storeButtons() {

                      contextualPop(); 
                  


                  function contextualPop() {
                    var recoactivecheck = setInterval(function() {
                                                var recoactiveAjax = $.active;
                                                if (recoactiveAjax === 0) {
                                                 setTimeout(function() { storePrep(); }, 1600)
                                                  clearInterval(recoactivecheck);
                                                }
                                              }, 500);
                      function storePrep() {
                          var bodycontent = $("#BodyContent a");
                          if ($("#BodyContent").length === 0) {
                            bodycontent = $(".body a");
                          }
                          bodycontent.each(function() {
                           if ($(this).attr("href") !== undefined && $(this).attr("href").toLowerCase().indexOf("games/store/") !== -1 && $(this).attr("href").toLowerCase().indexOf("/p/") !== -1 && $(this).attr("href").toLowerCase().indexOf("onerf") === -1) {
                             var hrefurl = $(this).attr("href").toLowerCase();
                             var husplit = hrefurl.split("/")
                             if (husplit.length === 6 && $(this).attr("href").toLowerCase().indexOf("/store/") === -1 && $(this).attr("href").toLowerCase().indexOf("/p/") !== -1) {
                                var thebigid = husplit[5].slice(0,12).toUpperCase();
                             } else if (husplit.length > 6 && $(this).attr("href").toLowerCase().indexOf("/store/") === -1 && $(this).attr("href").toLowerCase().indexOf("/p/") !== -1) {
                              if (husplit[3].indexOf("-") === -1) { // no locale in url
                                var thebigid = husplit[5].slice(0,12).toUpperCase();
                              } else {
                                var thebigid = husplit[6].slice(0,12).toUpperCase();
                              }
                             } else if (husplit.length > 7 && $(this).attr("href").toLowerCase().indexOf("/store/p/") !== -1) {
                               var thebigid = husplit[7].slice(0,12).toUpperCase();
                             }
                             $(this).addClass("xbstorebuy").attr("data-xbbigid", thebigid);
                            }
                            if ($(this).attr("href") !== undefined && ($(this).attr("href").toLowerCase().indexOf("www.xbox.com/xbox-game-pass#join") !== -1 || 
                              $(this).attr("href").toLowerCase().indexOf("www.xbox.com/xbox-game-pass/pc-games") !== -1)) {
                              // if (document.URL.toLowerCase().indexOf("origin-int") !== -1) {
                              //   var newurl = "https://origin-int.xbox.com/xbox-game-pass?rpid=" + givenbigids.standardDLUse + "#join";
                              // } else {
                              //   var newurl = "https://www.xbox.com/xbox-game-pass?rpid=" + givenbigids.standardDLUse + "#join";
                              // }
                              // $(this).attr("href", newurl);
                              var rpid = givenbigids.standardDLUse;
                              if ($("#contextual-rpid").length > 0 && $("#contextual-rpid").attr("data-rpid").length > 0) {
                                rpid = $("#contextual-rpid").attr("data-rpid");
                              }
                              var gpid = "CFQ7TTC0KHS0"; //default to ultimate game pass
                              if ($("#contextual-game-pass-version").length > 0 && $("#contextual-game-pass-version").attr("data-gp-version") === "pc") {
                                gpid = "CFQ7TTC0KGQ8"; // pc version
                              }
                              if ($("#contextual-game-pass-version").length > 0 && $("#contextual-game-pass-version").attr("data-gp-version") === "ultimate") {
                                $(this).attr('href', 'https://www.xbox.com/xbox-game-pass?rpid=' + rpid + '#join');
                                $(this).attr('target', "_blank")
                              } else {
                                $(this).attr('onclick', 'document.dispatchEvent(new CustomEvent("launchContextualStore", { detail: { productId: "' + gpid + '", referringProductId: "' + rpid + '", activateStoreExperiments: "true" }}));')
                                $(this).attr('href', 'JavaScript:void(0);');
                                $(this).removeAttr('target')
                              }
                            }
                          })
                          storePop();
                      }

                      function storePop() {
                        var orig = document.location.origin.toLowerCase().replace("https://", "").replace("http://", "");
                         $(".xbstorebuy").each(function () {
                           var bi = $(this).attr("data-xbbigid");
                           // $(this).attr("onclick", "xboxContextualStore.Open('" + bi + "')");
                           $(this).attr('onclick', 'document.dispatchEvent(new CustomEvent("launchContextualStore", { detail: { productId: "' + bi + '", activateStoreExperiments: "true" }}));')
                           // $(this).attr("onclick", 'launchProductPurchase({productId: "' + bi + '",storeDomain: "' + orig + 
                           //    '",styleOverrides: {"z-index": 100000, "position": "fixed","border": "2px solid black", "left": "0", "right": "0", "margin": "0 auto"},partnerId: "' + orig + '"})');
                           $(this).attr('href', 'JavaScript:void(0);');
                           $(this).removeAttr('target')
                         })
                      }

                    
                  }
              })();

              // establish pricing dropdowns
              $(".purchase").each(function () {
                  if ($(this).find(".pricedisc").length === 0) {
                      $(this).find(".opt1").remove();
                  }
                  if ($(this).find(".priceother").length === 0) {
                      $(this).find(".opt2").remove();
                  }
                  if ($(this).find(".pricedl").length === 0) {
                      $(this).find(".opt0").remove();
                  }
                  if ($(this).find(".steamdl a").attr("href") === undefined || $(this).find(".steamdl a").attr("href").length < 8) {
                      $(this).find(".opt3").remove();
                  }
                if ($(this).find(".gameStoredl a").attr("href") === undefined || $(this).find(".gameStoredl a").attr("href").length < 8) {
                      $(this).find(".opt4").remove();
                  }
                  
                  if ($(this).find(".purchaseDrop option").length < 2) {
                      $(this).find(".purchaseDrop").remove();
                  }
              })

              if ($(".purchase").length === 0) {
                  $(".getGame").remove();
              }

              // top CTA direct to buy if only one option
              if ($(".purchase select").length === 0 && $(".purchaseButtons").not(".hidden").length === 1 && // no purch dropdowns, only 1 purch button
                  $(".purchase .c-call-to-action.btnFat").length === 0) { //no game pass cta
                var singleCtatext = $(".purchaseButtons").not(".hidden").find("a span").text();
                var singleCtaaria = $(".purchaseButtons").not(".hidden").find("a").attr("aria-label");
                var singleCtahref = $(".purchaseButtons").not(".hidden").find("a").attr("href");
                $(".heroCTA a").not(".ignoreApi").eq(0).addClass("singlePurch");
                $(".heroCTA a").not(".ignoreApi").eq(0).find("span").text(singleCtatext);
                $(".heroCTA a").not(".ignoreApi").eq(0).attr("aria-label", singleCtaaria)
                                     .attr("href", singleCtahref)
                                     .attr("target", "blank");
              } 

              // populate addons
              var userratingtext = $("#userratingtext").text();
              for (var a = 0; a < addonarray.length; a++) {
                  var thebigid = addonarray[a];
                  if (allGames[thebigid]["purchasable"] !== "false") {
                      var point5rounded = Math.floor(allGames[thebigid].stars * 2) / 2;

                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                          var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var listshown = allGames[thebigid]["listprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var gpshown = allGames[thebigid]["gamepassprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var eashown = allGames[thebigid]["eaplayprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      } else {
                          if (urlRegion === "ar-sa") {
                              currregion = "en-us";
                          } else {
                              currregion = "en-ca";
                          }
                          var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var listshown = allGames[thebigid]["listprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var gpshown = allGames[thebigid]["gamepassprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var eashown = allGames[thebigid]["eaplayprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      }

                      var aopricing = "";
                      if (allGames[thebigid]["listprice"] !== 100000000) {
                          if (allGames[thebigid]["msrpprice"] !== allGames[thebigid]["listprice"] && allGames[thebigid]["gameswithgold"] === "false") {
                              aopricing = '<section class="pricing"><div class="leftCol"><h4 class="origPrice" aria-label="' + 
                                            oldnewpricestrings.locales["en-us"].keyOldprice.replace("<<PLACEHOLDERPRICE>>", msrpshown) + '">' + msrpshown + '</h4></div>' +
                                  '<div class="rightCol"><h4 aria-label="' + 
                                            oldnewpricestrings.locales["en-us"].keyNewprice.replace("<<PLACEHOLDERPRICE>>", listshown) + '">' + listshown + '</h4></div></section>';
                          } else {
                              aopricing = '<section class="pricing"><div class="leftCol"><h4>' + listshown + '</h4></div></section>';
                          }
                      }

                      // if (urlRegion.indexOf("en-") > -1) {
                        if (allGames[thebigid]["gamepassgame"] === "true" ) {
                          if (allGames[thebigid]["gamepassprice"] === 0) {
                            aopricing = '<section class="pricing"><span style="font-size: 0">' + 
                              gpstrings.locales[urlRegion].keyIncluded.replace("<<PLACEHOLDERGPLOGO>>", "Game Pass") + '</span><div class="leftCol" aria-hidden="true">' + 
                              gpstrings.locales[urlRegion].keyIncluded.replace("<<PLACEHOLDERGPLOGO>>", '<span class="context-glyph-tile"><span class="c-glyph" role="img" aria-label="Game Pass"></span></span>') + '</div></section>';
                          } else {
                            aopricing = '<section class="pricing"><div class="leftCol"><h4 class="origPrice" aria-label="' + 
                                            gamepasspricestrings.locales[urlRegion].keyOldprice.replace("<<PLACEHOLDERPRICE>>", msrpshown) + '">' + msrpshown + '</h4></div>' +
                                    '<div class="rightCol"><h4 aria-label="' + 
                                            gamepasspricestrings.locales[urlRegion].keyNewprice.replace("<<PLACEHOLDERPRICE>>", gpshown) + '">' + 
                                            gpstrings.locales[urlRegion].keyWith.replace("<<PLACEHOLDERPRICE>>", gpshown).replace("<<PLACEHOLDERGPLOGO>>", '<span class="context-glyph-tile"><span class="c-glyph" role="img" aria-label="Game Pass"></span></span></img>') + '</h4></div></section>';

                                            
                          }
                          
                        }

                        console.log("<<PLACEHOLDERGPLOGO>>");

                        if (allGames[thebigid]["eaplaygame"] === "true" ) {
                          // if (allGames[thebigid]["eaplayprice"] === 0) {
                          //   aopricing = '<section class="pricing"><span style="font-size: 0">' + 
                          //     gpstrings.locales[urlRegion].keyIncluded.replace("<<PLACEHOLDERGPLOGO>>", "Game Pass") + '</span><div class="leftCol" aria-hidden="true">' + 
                          //     gpstrings.locales[urlRegion].keyIncluded.replace("<<PLACEHOLDERGPLOGO>>", '<span class="context-glyph-tile"><span class="c-glyph"></span></span>') + '</div></section>';
                          // } else {
                            aopricing = '<section class="pricing"><div class="leftCol"><h4 class="origPrice" aria-label="' + 
                                            gamepasspricestrings.locales[urlRegion].keyOldprice.replace("<<PLACEHOLDERPRICE>>", msrpshown).replace("Game Pass", "EA Play") + '">' + msrpshown + '</h4></div>' +
                                    '<div class="rightCol"><h4 aria-label="' + eashown + ' ' + 
                                            eaplaystrings.locales[urlRegion].keyWitheaplay + '">' + eashown + ' ' +
                                            eaplaystrings.locales[urlRegion].keyWitheaplay +   '</h4></div></section>';
                          // }
                          
                        }
                      // }

                      $("#add-ons ul").not(".ignoreApi").append('<li>' +
                          '<section class="m-product-placement-item f-size-large context-software" data-bigid="' + thebigid + '">' +
                          '<a href="' + allGames[thebigid].gameurl + '" data-clickname="www>games>add-ons>' + allGames[thebigid].titleclickname + '>click" data-retailer="ms store">' +
                          '<picture aria-hidden="true" style="background-color: ' + allGames[thebigid].boxbgcolor + '">' +
                          '<source srcset="' + allGames[thebigid].squareshot + '" media="(min-width:0)">' +
                          '<img class="c-image" srcset="' + allGames[thebigid].squareshot + '" src="' + allGames[thebigid].squareshot + '" ' +
                          'alt="' + allGames[thebigid].title + '">' +
                          '</picture>' +
                          '<div>' +
                          '<h3 class="c-heading" itemprop="product name">' + allGames[thebigid].title + '</h3>' +
                          '<div class="c-rating" data-value="' + point5rounded + '" data-max="5">' +
                          '<p class="x-screen-reader">' + userratingtext + ':' +
                          '<span itemprop="ratingValue">' + point5rounded + '</span>/' +
                          '<span itemprop="bestRating">5</span>' +
                          '</p>' +
                          '<div></div>' +
                          '</div>' +
                          aopricing +
                          //'<p class="c-paragraph">' + allGames[thebigid].description + '</p>' +
                          '</div>' +
                          '</a>' +
                          '</section>' +
                          '</li>')

                      if (a === addonarray.length - 1) {
                          // post pop changes
                          // $("[data-bigid='9WZDNCRFJ3TJ'] picture").css("background-color", "white");
                          // $("[data-bigid='9WZDNCRFJ3TJ'] img").css("border", "1px solid lightgrey");
                          if ($("#add-ons li").length === 0) {
                              $("#add-ons").remove();
                          }
                      }
                  }
              }


              // populate addons
              var userratingtext = $("#userratingtext").text();
              for (var a = 0; a < addonarray2.length; a++) {
                  var thebigid = addonarray2[a];
                  if (allGames[thebigid]["purchasable"] !== "false") {
                      var point5rounded = Math.floor(allGames[thebigid].stars * 2) / 2;

                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                          var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var listshown = allGames[thebigid]["listprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      } else {
                          if (urlRegion === "ar-sa") {
                              currregion = "en-us";
                          } else {
                              currregion = "en-ca";
                          }
                          var msrpshown = allGames[thebigid]["msrpprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                          var listshown = allGames[thebigid]["listprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      }

                      var aopricing = "";
                      if (allGames[thebigid]["listprice"] !== 100000000) {
                          if (allGames[thebigid]["msrpprice"] !== allGames[thebigid]["listprice"] && allGames[thebigid]["gameswithgold"] === "false") {
                              aopricing = '<section class="pricing"><div class="leftCol"><h4 class="origPrice">' + msrpshown + '</h4></div>' +
                                  '<div class="rightCol"><h4>' + listshown + '</h4></div></section>';
                          } else {
                              aopricing = '<section class="pricing"><div class="leftCol"><h4>' + listshown + '</h4></div></section>';
                          }
                      }

                      $("#add-ons2 ul").not(".ignoreApi").append('<li>' +
                          '<section class="m-product-placement-item f-size-large context-software" data-bigid="' + thebigid + '">' +
                          '<a target="blank" href="' + allGames[thebigid].gameurl + '" data-clickname="www>games>add-ons>' + allGames[thebigid].titleclickname + '>click" data-retailer="ms store">' +
                          '<picture style="background-color: ' + allGames[thebigid].boxbgcolor + '">' +
                          '<source srcset="' + allGames[thebigid].squareshot + '" media="(min-width:0)">' +
                          '<img class="c-image" srcset="' + allGames[thebigid].squareshot + '" src="' + allGames[thebigid].squareshot + '" ' +
                          'alt="' + allGames[thebigid].title + '">' +
                          '</picture>' +
                          '<div>' +
                          '<h3 class="c-heading" itemprop="product name">' + allGames[thebigid].title + '</h3>' +
                          '<div class="c-rating" data-value="' + point5rounded + '" data-max="5">' +
                          '<p class="x-screen-reader">' + userratingtext + ':' +
                          '<span itemprop="ratingValue">' + point5rounded + '</span>/' +
                          '<span itemprop="bestRating">5</span>' +
                          '</p>' +
                          '<div></div>' +
                          '</div>' +
                          aopricing +
                          //'<p class="c-paragraph">' + allGames[thebigid].description + '</p>' +
                          '</div>' +
                          '</a>' +
                          '</section>' +
                          '</li>')

                      if (a === addonarray2.length - 1) {
                          // post pop changes
                          // $("[data-bigid='9WZDNCRFJ3TJ'] picture").css("background-color", "white");
                          // $("[data-bigid='9WZDNCRFJ3TJ'] img").css("border", "1px solid lightgrey");
                          if ($("#add-ons2 li").length === 0) {
                              $("#add-ons2").remove();
                          }
                      }
                  }
              }

              // populate subscription options
              if (subscriptiongames.length > 0 && allGames[subscriptiongames[0]] !== undefined) {
                var sgind = 99;
                if (Object.keys(allGames[subscriptiongames[0]].subskus).length > 0) {
                  sgind = 0;
                } else if (Object.keys(allGames[subscriptiongames[1]].subskus).length > 0) {
                  sgind = 1;
                }
                if (sgind === 99) { 
                  $(".subscriptionsblade").remove(); 
                } else {
                  var thebigid = subscriptiongames[sgind];
                  var theskus = Object.keys(allGames[subscriptiongames[sgind]].subskus);
                  theskus = theskus.filter(function (v) { return ignoresubscriptions.indexOf(v) === -1 });
                  for (var a = 0; a < theskus.length; a++) {
                      var thesku = theskus[a];

                      if (urlRegion !== "ar-sa" && urlRegion !== "ar-ae") {
                          var listshown = allGames[thebigid].subskus[thesku]["subprice"].toLocaleString(urlRegion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      } else {
                          if (urlRegion === "ar-sa") {
                              currregion = "en-us";
                          } else {
                              currregion = "en-ca";
                          }
                          var listshown = allGames[thebigid].subskus[thesku]["subprice"].toLocaleString(currregion, { style: 'currency', currency: allGames[thebigid]["currencycode"] });
                      }

                      var subpricing = "";
                      // if (allGames[thebigid]["msrpprice"] !== allGames[thebigid]["listprice"] && allGames[thebigid]["gameswithgold"] === "false") {
                      //     aopricing = '<section class="pricing"><div class="leftCol"><h4 class="origPrice">' + msrpshown + '</h4></div>' +
                      //         '<div class="rightCol"><h4>' + listshown + '</h4></div></section>';
                      // } else {
                      subpricing = '<section class="pricing"><div class="leftCol"><h4>' + listshown + '</h4></div></section>';
                      // }

                      var skushot = allGames[thebigid].squareshot;
                      if (subscriptionCustomImages[thesku] !== undefined) {
                        skushot = subscriptionCustomImages[thesku];
                      }

                      $("#subscriptions ul").not(".ignoreApi").append('<li>' +
                          '<section class="m-product-placement-item f-size-large context-software" data-bigid="' + thebigid + '">' +
                          '<a target="blank" href="' + allGames[thebigid].gameurl + '/' + thesku + '" data-retailer="ms store">' +
                          '<picture style="background-color: ' + allGames[thebigid].boxbgcolor + '">' +
                          '<source srcset="' + skushot + '" media="(min-width:0)">' +
                          '<img class="c-image" srcset="' + allGames[thebigid].squareshot + '" src="' + skushot + '" ' +
                          'alt="' + allGames[thebigid].subskus[thesku].subpricetext + '">' +
                          '</picture>' +
                          '<div>' +
                          '<h3 class="c-heading" itemprop="product name">' + allGames[thebigid].subskus[thesku].subpricetext + '</h3>' +
                          subpricing +
                          //'<p class="c-paragraph">' + allGames[thebigid].description + '</p>' +
                          '</div>' +
                          '</a>' +
                          '</section>' +
                          '</li>')

                  }
                }
              }
              if ($("#subscriptions li").length === 0) {
                  $(".subscriptionsblade").remove();
              }



              // qa fixes
              //remove star ratings
              $(".c-rating").remove();

              // hide api descriptions that have wrong languages
              var wronglang = "zh-hk, zh-tw, cs-cz, el-gr, hu-hu, sk-sk";
              if (wronglang.indexOf(urlRegion) !== -1) {
                  $(".m-product-placement-item .c-paragraph").remove();
              }

              // platform hero copy card
              if (givenbigids["standardDLUse"].length > 0) {
                var platbigid = givenbigids["standardDLUse"];
                var popConsole, popPc, popCloud;
                popConsole = popPc = popCloud = '';
                var addinfConsole, addinfPc, addinfCloud;
                addinfConsole = addinfPc = addinfCloud = '';
                var prevplat = false;
                var platcolor = $("h1").css("color");
                

                if (allGames[platbigid]["platformxbox"] === "true") {
                  popConsole = '<span class="c-paragraph-3"> ' + platStrings.locales[urlRegion]["keyConsole"] + ' </span>';
                  addinfConsole = platStrings.locales[urlRegion]["keyConsole"];
                  prevplat = true;
                }
                         
                if (gameIdArrays["allPC"].indexOf(platbigid) !== -1 || allGames[platbigid]["platformpc"] === "true") {
                  if (prevplat === true) {
                    popPc = '<span class="featureCircle"> ● </span><span class="c-paragraph-3"> ' + platStrings.locales[urlRegion]["keyPc"] + ' </span>';
                    addinfPc = '<br>' + platStrings.locales[urlRegion]["keyPc"];
                  } else {
                    popPc = '<span class="c-paragraph-3"> ' + platStrings.locales[urlRegion]["keyPc"] + ' </span>';
                    addinfPc = platStrings.locales[urlRegion]["keyPc"];
                  }
                }
          
                if (gameIdArrays["allCloud"].indexOf(platbigid) !== -1) {  
                  popCloud = '<span class="featureCircle"> ● </span><span class="c-paragraph-3"> ' + platStrings.locales[urlRegion]["keyCloud"] + ' </span>';
                  addinfCloud = '<br>' + platStrings.locales[urlRegion]["keyCloud"];
                }

                var platPop = '<div class="popicons high-contrast" style="color:  ' + platcolor + '">' + popConsole + popPc + popCloud + '</div>';

                if ($("h1").closest(".m-hero-item").length === 1) {
                  $(".heroPlatforms").css("display", "none");
                  // $(".heroLogos").last().after(platPop);
                  if ($("h1").closest("div").find(".pad48").length > 0) {
                    $("h1").closest("div").find(".pad48").before(platPop);
                  } else if ($("h1").closest("div").find(".heroPad48").length > 0) {
                    if ($("h1").closest("div").find(".heroPad48").last().hasClass("heroLogos") || 
                        $("h1").closest("div").find(".heroPad48").last().hasClass("heroXGP")) {
                      $("h1").closest("div").find(".heroPad48").last().after(platPop);
                    } else {
                      $("h1").closest("div").find(".heroPad48").last().before(platPop);
                    }
                    
                  }
                  
                  if ($(".heroPlatforms").closest(".m-banner").next(".static48").length === 1) {
                    $(".heroPlatforms").closest(".m-banner").next(".static48").remove();
                    $(".heroPlatforms").closest(".m-banner").removeClass("m-banner");
                  }
                }
               
                // $(".m-additional-information div[data-grid='col-6']").eq(4).find("ul li").last().replaceWith('<li>' + // uncomment to replace additional info platforms
                //                                                       addinfConsole + addinfPc + addinfCloud + '</li>');
                
              } 

              // ESRB info
              if (givenbigids["standardDLUse"].length > 0) {
                  var ratbigid = givenbigids["standardDLUse"]

                  var thedescriptors = '';
                  var rawdesc = allGames[ratbigid]["descriptors"];
                  var rdarray = rawdesc.split(",");
                  var rdtext = [];
                  for (var r = 0; r < rdarray.length; r++) {
                    var descnum = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Descriptors.length;
                    for (var s = 0; s < descnum; s++) {
                      if (ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Descriptors[s].Key === rdarray[r]) {
                        var desc = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Descriptors[s].Descriptor;
                        rdtext.push(desc);
                      }
                    }                
                  }
                  thedescriptors = rdtext.join(",</li> <li class='descNoWrap'>");
                  if (thedescriptors !== '') {
                    thedescriptors = '<li class="descNoWrap">' + thedescriptors + "</li>"
                  }
                  var theinteractive = '';
                  var rawint = allGames[ratbigid]["interactive"];
                  var rintarray = rawint.split(",");
                  var rinttext = [];
                  for (var r = 0; r < rintarray.length; r++) {
                    var intnum = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].InteractiveElements.length;
                    for (var s = 0; s < intnum; s++) {
                      if (ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].InteractiveElements[s].Key === rintarray[r]) {
                        var int = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].InteractiveElements[s].InteractiveElement;
                        rinttext.push(int);
                      }
                    }                
                  }
                  theinteractive = rinttext.join(",</li> <li class='descNoWrap'>");
                  if (theinteractive !== '') {
                    theinteractive = '<li class="descNoWrap">' + theinteractive + "</li>"
                  }
                  var thedisclaimers = '';
                  var rawdisc = allGames[ratbigid]["disclaimers"];
                  var rdiscarray = rawdisc.split(",");
                  var rdisctext = [];
                  for (var r = 0; r < rdiscarray.length; r++) {
                    var discnum = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Disclaimers.length;
                    for (var s = 0; s < discnum; s++) {
                      if (ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Disclaimers[s].Key === rdiscarray[r]) {
                        var disc = ratingData.RatingBoards[allGames[ratbigid]["ratingsystem"]].LocalizedProperties[0].Disclaimers[s].Disclaimer;
                        if (disc.length > 48) {
                          var discarr = disc.split(". ");
                          disc = discarr.join(". <br>");
                        }
                        rdisctext.push(disc);
                      }
                    }                
                  }
                  thedisclaimers = rdisctext.join(",</li> <li class='descNoWrap'>");
                  if (thedisclaimers !== '') {
                    thedisclaimers = '<li class="descNoWrap">' + thedisclaimers + "</li>"
                  }

                  var interactiveLine = '';
                  var disclaimersLine = '';
                  if (theinteractive !== '' && thedescriptors !== '') {
                    interactiveLine = '<li class="esrbDescDivider"></li>';
                  }
                  if (thedisclaimers !== '' && (theinteractive !== '' || thedescriptors !== '')) {
                    disclaimersLine = '<li class="esrbDescDivider"></li>';
                  }
                  
                  

                  // if (osgratings.displayData[allGames[ratbigid].ratingsystem] !== undefined) {
                  // if (ratingOrgs[urlRegion].orgname !== undefined) {
                      // var ratlink = osgratings.displayData[allGames[ratbigid].ratingsystem]["unlisted"].url;
                      var ratlink = ratingOrgs[urlRegion].orglink;
                     // console.log(ratlink)
                  // } else {
                  //     var ratlink = "unlisted";
                  // }


                  var altext = $("#ratingarialabel").text();
                  console.log(allGames[ratbigid].rating);
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating img").attr("src", allGames[ratbigid].ratimage).attr("alt", "");
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating .c-paragraph").remove();
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating .c-label a").text(allGames[ratbigid].rating);
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating .c-label a").attr("aria-label", altext.replace("[[PLACEHOLDER]]", allGames[ratbigid].rating));
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating li").remove();
                  $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append(thedescriptors + interactiveLine + 
                    theinteractive + disclaimersLine + thedisclaimers)

                  // var interactiveElem1 = ratingOrgs[urlRegion].interactiveElem1.replaceAll(" ", "\xa0");
                  // var interactiveElem2 = ratingOrgs[urlRegion].interactiveElem2.replaceAll(" ", "\xa0").replaceAll("-", "\u2011");

                  // var esrbArr = ratdesctext.join().replaceAll(" ", "\xa0").replaceAll("-", "\u2011").split(",");


                  // var descArr = [];
                  // var interactiveElem = [];
                  // var inGamePurchases = [];

                  // console.log(esrbArr[4]);
                  // console.log(interactiveElem2);

                  // for(var j = 0; j < esrbArr.length; j++) {

                  //    if(esrbArr[j] === interactiveElem1 || esrbArr[j] === interactiveElem2) {
                  //         interactiveElem.push(esrbArr[j])
                  //     } 
                         
                  //     else {
                  //         descArr.push(esrbArr[j])
                  //     }
                  // }

                  // descArr = descArr.toString().replaceAll(",", ", ");
                  // interactiveElem = interactiveElem.toString().replaceAll(",", ", ");
                  
                  
                  // if(descArr.length > 0) {
                  //     $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append('<li>' + descArr  + '</li>')
                  // }

                  // if(interactiveElem.length > 0 && descArr.length > 0) {
                  //     $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append("<li>" + "<hr class='esrbDescDivider'>" + interactiveElem  + "</li>")
                  // }

                  // if(interactiveElem.length > 0 && descArr.length === 0 ) {
                  //     $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append("<li>" + interactiveElem  + "</li>")
                  // }


                  /*
                  if(inGamePurchases.length > 0) {
                      $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append('<li>' + "<hr class='esrbDescDivider'>" + inGamePurchases  + '</li>')
                  }
                  */

                  /*
                  ratdesctext.forEach(function (desc) {
                      $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append('<li>' + desc + '</li>')
                  })
                  ratdisctext.forEach(function (disc) {

                      $(".esrbblade").not(".ignoreApi").find(".c-age-rating ul").append('<li>' + disc + '</li>')
                  })
                  */

                  if (allGames[ratbigid].rating === "none" && allGames[ratbigid].ratingsystem === "none" 
                    && allGames[ratbigid].descriptors === "none") {
                      $(".esrbblade").not(".ignoreApi").find(".c-age-rating").hide();
                  }
                  // if (ratlink !== "unlisted") {

                    $(".esrbblade").not(".ignoreApi").find(".c-age-rating .c-label a").attr("href", ratlink);
                  // }

                  var esrbModule = $('.esrbblade .m-additional-information div').not(".esrbDescDivider");
                  // Get all the divs in the esrb blade
                  // then adjust the columns a different breakpoints

                  
                  
                  for(var e = 0; e < esrbModule.length; e++) {
                     // console.log(esrbModule[e])

                      // the rating column variable
                      var ratingCol = esrbModule[2];
                      // parent ratingCol parent
                      var parentCol = esrbModule[1];
                      // the producer / developer column variable
                      var prodDevCol = esrbModule[6];
                      // the Genre column variable
                      var fifthCol = esrbModule[5];
                      var genreCol = esrbModule[8];
                      //bottom div column
                      var bottomCol = esrbModule[9];
                      //var containerCol variable
                      var containerCol = esrbModule[7];

                  }

                  
                  

                  const
                    screen = {
                      mobile: 0,
                      tablet: 1084,
                      desktop: 1400
                    };

                  // observe window resize
                  window.addEventListener('resize', resizeHandler);

                  // initial call
                  resizeHandler();

                  // calculate size
                  function resizeHandler() {

                    // get window width
                    const iw = window.innerWidth;
                   
                    // determine named size
                    let size = null;
                    for (let s in screen) {
                      if (iw >= screen[s]) {
                          size = s;
                      } 
                    }

                   
                          if(size === 'desktop') {
                              if(ratingCol) {
                                ratingCol.setAttribute('data-grid', 'col-8');
                              }
                              if(fifthCol) {
                                fifthCol.setAttribute('data-grid', 'col-4');
                              }
                              if(parentCol) {
                                parentCol.setAttribute('data-grid', 'col-8');
                              }
                              if(prodDevCol) {
                                prodDevCol.setAttribute('data-grid', 'col-4');
                              }
                              if(genreCol) {
                                genreCol.setAttribute('data-grid', 'col-6');
                              }
                              if(containerCol) {
                                containerCol.setAttribute('data-grid', 'col-6');
                              }

                        }

                        if(size === 'tablet') {
                          if(ratingCol) {
                              ratingCol.setAttribute('data-grid', 'col-8');
                            }
                            if(fifthCol) {
                              fifthCol.setAttribute('data-grid', 'col-8');
                            }
                            if(prodDevCol) {
                              prodDevCol.setAttribute('data-grid', 'col-8');
                            }
                            if(genreCol) {
                              genreCol.setAttribute('data-grid', 'col-8');
                            }
                            if(containerCol) {
                              containerCol.setAttribute('data-grid', 'col-8');
                            }
                        }

                        if(size === 'mobile') {
                          if(ratingCol) {
                              ratingCol.setAttribute('data-grid', 'col-8');
                            }
                            if(fifthCol) {
                              fifthCol.setAttribute('data-grid', 'col-8');
                            }
                            if(prodDevCol) {
                              prodDevCol.setAttribute('data-grid', 'col-8');
                            }
                            if(genreCol) {
                              genreCol.setAttribute('data-grid', 'col-8');
                            }
                            if(containerCol) {
                              containerCol.setAttribute('data-grid', 'col-8');
                            }
                        }

                  
              }

              // XBL Gold disclaimers
              // var ratbigid = givenbigids["standardDLUse"]
              // if (ratbigid === "") {
              //     ratbigid = givenbigids["standardDiscUse"];
              // }
              // if (ratbigid === "") {
              //     ratbigid = givenbigids["silverDLUse"];
              // }
              // var herocontainer = ".threeP-hero";
              // if ($(".threeP-hero").length === 0) { herocontainer = ".subHero" }
              // if (allGames[ratbigid].xblrequired === "true") {
              //     if ($(herocontainer + " hr").length > 1) {
              //         if ($(herocontainer + " hr").next("p").length === 0) {
              //             $(herocontainer + " hr").last().after('<p class="c-paragraph-1 white-c" style="text-align:center"><strong>' +
              //                 golddisclaimers.locales[urlRegion].keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar + '</strong></p>');
              //         }
              //     } else {
              //         $(herocontainer).append('<p class="c-paragraph-1 white-c" style="text-align:center"><strong>' +
              //             golddisclaimers.locales[urlRegion].keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar + '</strong></p>');
              //     }
              // } else if (allGames[ratbigid].xblmultrequired === "true") {
              //     if ($(herocontainer + " hr").length > 1) {
              //         if ($(herocontainer + " hr").next("p").length === 0) {
              //             $(herocontainer + " hr").last().after('<p class="c-paragraph-1 white-c" style="text-align:center"><strong>' +
              //                 golddisclaimers.locales[urlRegion].keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso + '</strong></p>');
              //         }
              //     } else {
              //         $(herocontainer).append('<p class="c-paragraph-1 white-c" style="text-align:center"><strong>' +
              //             golddisclaimers.locales[urlRegion].keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso + '</strong></p>');
              //     }
              // }

              // console and accessories blades

          }
      }

      // smooth scrolling
      setTimeout(function () {
          $(document).on("click", ".smoothscroll", function (e) {
              e.preventDefault();
              var thetarget = $(this).attr("href");
              var targetfocus = $(thetarget).find("a");
              if (targetfocus.length === 0) {
                  var tfparents = $(thetarget).parents();
                  for (var i = 0; i < tfparents.length; i++) {
                      targetfocus = $(tfparents[i]).nextAll().find("a");
                      if (targetfocus.length > 0) { break; }
                  }
              }
              $(targetfocus).first().focus();
              var btttop = $(thetarget).offset().top - 50;
              $("HTML, BODY").animate({
                  scrollTop: btttop
              }, 500);


          })
      }, 500)

  };

}

golddisclaimers = {
  "locales": {
      "en-us": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "ar-ae": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "ar-sa": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-ae": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-sa": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "cs-cz": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "K hraní této hry na Xboxu je nutné mít předplatné Xbox Live Gold (prodává se samostatně).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online režim pro více hráčů na Xboxu vyžaduje předplatné Xbox Live Gold (prodává se samostatně)."
      },
      "da-dk": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Spillet kræver Xbox Live Gold for at kunne spilles på Xbox (abonnement sælges separat).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Onlinemultiplayer på Xbox kræver Xbox Live Gold (abonnement sælges separat)."
      },
      "de-at": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Für das Spiel ist Xbox Live Gold (Abonnement separat erhältlich) zur Nutzung auf Xbox erforderlich.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Für Onlinemultiplayer-Funktionen auf Xbox ist Xbox Live Gold (Abonnement separat erhältlich) erforderlich."
      },
      "de-ch": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Für das Spiel ist Xbox Live Gold (Abonnement separat erhältlich) zur Nutzung auf Xbox erforderlich.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Für Onlinemultiplayer-Funktionen auf Xbox ist Xbox Live Gold (Abonnement separat erhältlich) erforderlich."
      },
      "de-de": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Für das Spiel ist Xbox Live Gold (Abonnement separat erhältlich) zur Nutzung auf Xbox erforderlich.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Für Onlinemultiplayer-Funktionen auf Xbox ist Xbox Live Gold (Abonnement separat erhältlich) erforderlich."
      },
      "el-gr": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Το παιχνίδι απαιτεί Xbox Live Gold για χρήση στο Xbox (η συνδρομή πωλείται χωριστά).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Το παιχνίδι με πολλούς παίκτες online στο Xbox απαιτεί Xbox Live Gold (η συνδρομή πωλείται χωριστά)."
      },
      "en-au": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-ca": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-gb": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-hk": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-ie": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-in": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-nz": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-sg": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "en-za": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "es-ar": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "El juego necesita Xbox Live Gold para poder usarlo en Xbox (la suscripción se vende por separado).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Multijugador en línea en Xbox requiere Xbox Live Gold (la suscripción se vende por separado)."
      },
      "es-cl": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "El juego necesita Xbox Live Gold para poder usarlo en Xbox (la suscripción se vende por separado).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Multijugador en línea en Xbox requiere Xbox Live Gold (la suscripción se vende por separado)."
      },
      "es-co": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "El juego necesita Xbox Live Gold para poder usarlo en Xbox (la suscripción se vende por separado).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Multijugador en línea en Xbox requiere Xbox Live Gold (la suscripción se vende por separado)."
      },
      "es-es": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "El juego necesita Xbox Live Gold (se vende por separado) para jugar en Xbox.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "El modo multijugador en línea de Xbox requiere una suscripción a Xbox Live Gold (se vende por separado)."
      },
      "es-mx": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "El juego necesita Xbox Live Gold para poder usarlo en Xbox (la suscripción se vende por separado).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Multijugador en línea en Xbox requiere Xbox Live Gold (la suscripción se vende por separado)."
      },
      "fi-fi": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Pelin pelaamiseen Xboxissa tarvitaan Xbox Live Gold (tilaus myydään erikseen).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Verkkomoninpeliin Xboxissa tarvitaan Xbox Live Gold (tilaus myydään erikseen)."
      },
      "fr-be": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Ce jeu nécessite Xbox Live Gold pour être lu sur Xbox (abonnement vendu séparément).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Le mode multijoueur en ligne sur Xbox nécessite Xbox Live Gold (abonnement vendu séparément)."
      },
      "fr-ca": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Ce jeu nécessite Xbox Live Gold pour être lu sur Xbox (abonnement vendu séparément).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Le mode multijoueur en ligne sur Xbox nécessite Xbox Live Gold (abonnement vendu séparément)."
      },
      "fr-ch": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Ce jeu nécessite Xbox Live Gold pour être lu sur Xbox (abonnement vendu séparément).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Le mode multijoueur en ligne sur Xbox nécessite Xbox Live Gold (abonnement vendu séparément)."
      },
      "fr-fr": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Ce jeu nécessite Xbox Live Gold pour être lu sur Xbox (abonnement vendu séparément).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Le mode multijoueur en ligne sur Xbox nécessite Xbox Live Gold (abonnement vendu séparément)."
      },
      "he-il": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Game requires Xbox Live Gold to play on Xbox (subscription sold separately).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online multiplayer on Xbox requires Xbox Live Gold (subscription sold separately)."
      },
      "hu-hu": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "A játék Xbox konzolon való lejátszásához Xbox Live Gold előfizetés (külön vásárolható meg) szükséges.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Az online többszereplős játékok Xbox konzolon való használatához Xbox Live Gold előfizetés (külön vásárolható meg) szükséges."
      },
      "it-it": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Il gioco richiede l'abbonamento a Xbox Live Gold (venduto separatamente) per giocare su Xbox.",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "La modalità multiplayer online su Xbox richiede l'abbonamento a Xbox Live Gold (venduto separatamente)."
      },
      "ja-jp": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "ゲームを Xbox でプレイするには、Xbox Live Gold (別売りのサブスクリプション) が必要です。",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Xbox でオンライン マルチプレイヤーを利用する場合は、Xbox Live Gold (別売りのサブスクリプション) が必要です。"
      },
      "ko-kr": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Xbox에서 게임을 플레이하려면 Xbox Live Gold가 필요합니다(구독은 별도 판매).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Xbox에서 온라인 멀티플레이어를 사용하려면 Xbox Live Gold(별도 판매)가 필요합니다."
      },
      "nb-no": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Spillet krever Xbox Live Gold for å bli spilt på Xbox (abonnement selges separat).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Online flerspiller på Xbox krever Xbox Live Gold (abonnement selges separat)."
      },
      "nl-be": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Voor het spelen van de game op Xbox is Xbox Live Gold vereist (afzonderlijk verkrijgbaar abonnement).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Voor onlinemultiplayer op Xbox is Xbox Live Gold vereist (afzonderlijk verkrijgbaar abonnement)."
      },
      "nl-nl": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Voor het spelen van de game op Xbox is Xbox Live Gold vereist (afzonderlijk verkrijgbaar abonnement).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Voor onlinemultiplayer op Xbox is Xbox Live Gold vereist (afzonderlijk verkrijgbaar abonnement)."
      },
      "pl-pl": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Do grania w tę grę na konsoli Xbox jest wymagana subskrypcja Xbox Live Gold (sprzedawana osobno).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Do grania w trybie dla wielu graczy online na konsoli Xbox jest wymagana subskrypcja Xbox Live Gold (sprzedawana osobno)."
      },
      "pt-br": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "O jogo requer o Xbox Live Gold para ser jogado no Xbox (assinatura vendida separadamente).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "A rede multijogador online no Xbox requer o Xbox Live Gold (assinatura vendida separadamente)."
      },
      "pt-pt": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "O jogo necessita do Xbox Live Gold para ser jogado na Xbox (subscrição vendida em separado).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "O modo multijogador online na Xbox necessita do Xbox Live Gold (subscrição vendida em separado)."
      },
      "ru-ru": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Чтобы играть в эту игру на Xbox требуется подписка Xbox Live Gold (подписка продается отдельно).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Для сетевой многопользовательской игры на Xbox требуется подписка Xbox Live Gold (подписка продается отдельно)."
      },
      "sk-sk": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Ak chcete túto hru hrať na Xboxe, vyžaduje sa predplatné Xbox Live Gold (predplatné sa predáva samostatne)",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Hranie hier pre viacerých hráčov na Xboxe online si vyžaduje Xbox Live Gold (predplatné sa predáva samostatne)."
      },
      "sv-se": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "För att spelet ska kunna spelas på Xbox krävs Xbox Live Gold (prenumeration säljs separat).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "För multiplayer online på Xbox krävs Xbox Live Gold (prenumeration säljs separat)."
      },
      "tr-tr": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "Oyunu Xbox'ta oynamak için Xbox Live Gold gerekir (abonelik ayrı satılır).",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "Xbox'ta çevrimiçi çok oyunculu oynamak için Xbox Live Gold gerekir (abonelik ayrı satılır)."
      },
      "zh-hk": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "遊戲需要 Xbox Live Gold 才能在 Xbox 上遊玩 (訂閱另售)。",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "需要 Xbox Live Gold (訂閱另售) 才能進行線上多人遊戲。"
      },
      "zh-tw": {
          "keyGamerequiresxboxlivegoldtoplayonxboxsubscriptionsoldsepar": "遊戲需要 Xbox Live Gold 才能在 Xbox 上遊玩 (訂閱另售)。",
          "keyOnlinemultiplayeronxboxrequiresxboxlivegoldsubscriptionso": "需要 Xbox Live Gold (訂閱另售) 才能進行線上多人遊戲。"
      }
  }
}

priceFormat = {
  "locales": {
      "en-us": {
          "keyPriceFormat": "$# ",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "ar-ae": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "ar-sa": {
          "keyPriceFormat": "SR #",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "en-ae": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-sa": {
          "keyPriceFormat": "SR #",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "cs-cz": {
          "keyPriceFormat": "# Kč",
          "keyHasDecimal": false,
          "keyThousandCharacter": " " //space replace comma, no decimal
      },
      "da-dk": {
          "keyPriceFormat": "# kr",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "de-at": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "de-ch": {
          "keyPriceFormat": "CHF #",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "de-de": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "el-gr": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-au": {
          "keyPriceFormat": "$# ",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-ca": {
          "keyPriceFormat": "$# ",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-gb": {
          "keyPriceFormat": "£#",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-hk": {
          "keyPriceFormat": "HK$#",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "en-ie": {
          "keyPriceFormat": "€ #",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-in": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-nz": {
          "keyPriceFormat": "$# ",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "en-sg": {
          "keyPriceFormat": "$#*",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," // no decimal
      },
      "en-za": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "es-ar": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "es-cl": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "es-co": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "es-es": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "es-mx": {
          "keyPriceFormat": "$#",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "fi-fi": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "."
      },
      "fr-be": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "."
      },
      "fr-ca": {
          "keyPriceFormat": "# $",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "fr-ch": {
          "keyPriceFormat": "CHF #",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "fr-fr": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "he-il": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "hu-hu": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "it-it": {
          "keyPriceFormat": "€#",
          "keyHasDecimal": true,
          "keyThousandCharacter": "."
      },
      "ja-jp": {
          "keyPriceFormat": "¥# (税込)",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "ko-kr": {
          "keyPriceFormat": "₩#",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "nb-no": {
          "keyPriceFormat": "# kr",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "nl-be": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "nl-nl": {
          "keyPriceFormat": "€ #",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "pl-pl": {
          "keyPriceFormat": "# zł",
          "keyHasDecimal": true,
          "keyThousandCharacter": " " // comma replace period, space replace comma
      },
      "pt-br": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "pt-pt": {
          "keyPriceFormat": "#  €",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." //period comma reversed
      },
      "ru-ru": {
          "keyPriceFormat": "# ₽",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "sk-sk": {
          "keyPriceFormat": "# €",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," // no decimal
      },
      "sv-se": {
          "keyPriceFormat": "# kr",
          "keyHasDecimal": true,
          "keyThousandCharacter": "." // no comma
      },
      "tr-tr": {
          "keyPriceFormat": "",
          "keyHasDecimal": true,
          "keyThousandCharacter": ","
      },
      "zh-hk": {
          "keyPriceFormat": "HK$#",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      },
      "zh-tw": {
          "keyPriceFormat": "NT$#",
          "keyHasDecimal": false,
          "keyThousandCharacter": "," //no decimal
      }
  }
}

// populate console and accessories
if (typeof (pcProducts) !== "undefined" && typeof (pcAccessories) !== "undefined") {
  var ItemPopulate = (function () {
      var urlRegion = document.URL.toLowerCase().split("xbox.com/")[1].slice(0, 5);
      var countryCode = urlRegion.split("-")[1].toUpperCase();
      var regionItems = pcProducts.bigids;
      var regionItemsTwo = pcAccessories.bigids;
      var currencyFormat = priceFormat.locales[urlRegion];
      var bigIdStringList = "";
      var bigIdStringTwo = "";

      regionItems.forEach(function (product) {
          if (product.updatedProdId.indexOf("/") !== -1) {
              bigIdStringList = bigIdStringList + product.updatedProdId.split("/")[0] + ',';
          } else if (product.productId.indexOf("/") !== -1) {
              bigIdStringList = bigIdStringList + product.productId.split("/")[0] + ',';
          }
      });

      regionItemsTwo.forEach(function (product) {
          if (product.updatedProdId.indexOf("/") !== -1) {
              bigIdStringTwo = bigIdStringTwo + product.updatedProdId.split("/")[0] + ',';
          } else if (product.productId.indexOf("/") !== -1) {
              bigIdStringTwo = bigIdStringTwo + product.productId.split("/")[0] + ',';
          }
      });

      bigIdStringList = setCharAt(bigIdStringList, bigIdStringList.length - 1, ""); // Remove the , at the end of the string
      bigIdStringTwo = setCharAt(bigIdStringTwo, bigIdStringTwo.length - 1, ""); // Remove the , at the end of the string

      var apiUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=' + bigIdStringList + '&market=' + countryCode + '&languages=' + urlRegion + '&MS-CV=DGU1mcuYo0WMMp+F.1';
      var apiUrlTwo = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=' + bigIdStringTwo + '&market=' + countryCode + '&languages=' + urlRegion + '&MS-CV=DGU1mcuYo0WMMp+F.1';

      console.log(apiUrl);
      console.log(apiUrlTwo);

      if (bigIdStringList !== "") {
          $.get(apiUrl)
              .done(function (responseData) {
                  var apiItemList = [];
                  var duplicateArray = [];
                  responseData.Products.forEach(function (product) {
                      product.LocalizedProperties.forEach(function (title) {
                          title.Images.forEach(function (image) {
                              product.DisplaySkuAvailabilities.forEach(function (skuAvailability) {
                                  var apiItem = new Object();
                                  if (duplicateArray.indexOf(product.ProductId) === -1) {
                                      apiItem.productTitle = title.ProductTitle;
                                      apiItem.productDescription = title.ProductDescription;
                                      apiItem.image = image.Uri;
                                      apiItem.productId = product.ProductId;
                                      apiItem.skuId = skuAvailability.Availabilities[0].SkuId;
                                      apiItem.MSRP = skuAvailability.Availabilities[0].OrderManagementData.Price.MSRP;
                                      apiItem.listPrice = skuAvailability.Availabilities[0].OrderManagementData.Price.ListPrice;
                                      duplicateArray.push(product.ProductId);
                                      apiItemList.push(apiItem);
                                  }
                              });
                          });
                      });
                  });
                  populateProdPlacement(apiItemList);
                  console.log(apiItemList);
              })
              .fail(function () {
                  populateProdPlacement(false);
              })
      } else { populateProdPlacement(false); }

      if (bigIdStringTwo !== "") {
          $.get(apiUrlTwo)
              .done(function (responseData) {
                  var apiItemListTwo = [];
                  var duplicateArrayTwo = [];
                  responseData.Products.forEach(function (product) {
                      product.LocalizedProperties.forEach(function (title) {
                          title.Images.forEach(function (image) {
                              product.DisplaySkuAvailabilities.forEach(function (skuAvailability) {
                                  var apiItemTwo = new Object();
                                  if (duplicateArrayTwo.indexOf(product.ProductId) === -1) {
                                      apiItemTwo.productTitle = title.ProductTitle;
                                      apiItemTwo.productDescription = title.ProductDescription;
                                      apiItemTwo.image = image.Uri;
                                      apiItemTwo.productId = product.ProductId;
                                      apiItemTwo.skuId = skuAvailability.Availabilities[0].SkuId;
                                      apiItemTwo.MSRP = skuAvailability.Availabilities[0].OrderManagementData.Price.MSRP;
                                      apiItemTwo.listPrice = skuAvailability.Availabilities[0].OrderManagementData.Price.ListPrice;
                                      duplicateArrayTwo.push(product.ProductId);
                                      apiItemListTwo.push(apiItemTwo);
                                  }
                              });
                          });
                      });
                  });
                  populateProdPlacementSecond(apiItemListTwo);
                  console.log(apiItemListTwo);
              })
              .fail(function () {
                  populateProdPlacementSecond(false);
              })
      } else { populateProdPlacementSecond(false); }

      function populateProdPlacement(apiItemList) {
          for (var i = 0; i < apiItemList.length; i++) {
              var productId = apiItemList[i].productId;
              var sid = apiItemList[i].skuId;
              var fullPrice = apiItemList[i].MSRP;
              var tprPrice = apiItemList[i].listPrice;
              var badgePrice = (fullPrice - tprPrice);
              tprPrice = formatCurrency(tprPrice, currencyFormat);
              fullPrice = formatCurrency(fullPrice, currencyFormat);
              var badgeCopy = '';
              if (badgePrice !== 0) {
                  badgeCopy = badgePrice;
                  badgeCopy = formatCurrency(badgeCopy, currencyFormat);
                  badgeCopy = '<strong class="c-badge f-small f-highlight">' + 'SAVE ' + badgeCopy + '</strong>';
              }
              var itemBoxshot = apiItemList[i].image;
              itemBoxshot = itemBoxshot + '&w=231&h=197&q=90&m=6&b=%23FFFFFFFF&o=f&aim=true'
              var itemTitle = apiItemList[i].productTitle;
              var productCopy = apiItemList[i].productDescription;
              productCopy = productCopy.replace(/\n/g, '<br>');
              var href = 'https://www.microsoft.com/en-us/p' + '/computer-deals/' + apiItemList[i].productId + '/' + apiItemList[i].skuId;

              var aopricing = "";
              if (tprPrice !== 100000000) {
                  if (fullPrice !== tprPrice) {
                      aopricing = '<div class="c-price" itemprop="offers" itemscope="">' +
                          '<span class="discounted" itemprop="price">' + fullPrice + '</span>' + '<span itemprop="price">' + tprPrice + '</span>' +
                          '</div>';
                  } else {
                      aopricing = '<div class="c-price" itemprop="offers" itemscope="">' +
                          '<span itemprop="price">' + fullPrice + '</span>' +
                          '</div>'
                  }
              }

              $(".pcProducts" + " ul").append('<li>' +
                  '<section class="m-product-placement-item f-size-large context-device f-clean" itemscope data-prodid="' + productId + '" data-sid="' + sid + '">' +
                  '<a target="blank" href="' + href + '">' +
                  '<picture>' +
                  '<source srcset="' + itemBoxshot + '" media="(min-width:0)">' +
                  '<img class="c-image" srcset="' + itemBoxshot + '" src="' + itemBoxshot + '" ' +
                  'alt="' + ' logo">' +
                  '</picture>' +
                  '<div>' +
                  badgeCopy +
                  '<h3 class="c-heading" itemprop="product name">' + itemTitle + '</h3>' +
                  aopricing +
                  '<link itemprop="availability" href="https://schema.org/InStock">' +
                  '<p class="c-paragraph">' + productCopy + '</p>' +
                  '</div>' +
                  '</a>' +
                  '</section>' +
                  '</li>')



          }

      }

      function populateProdPlacementSecond(apiItemListTwo) {
          for (var i = 0; i < apiItemListTwo.length; i++) {
              var productId = apiItemListTwo[i].productId;
              var sid = apiItemListTwo[i].skuId;
              var fullPrice = apiItemListTwo[i].MSRP;
              var tprPrice = apiItemListTwo[i].listPrice;
              var badgePrice = (fullPrice - tprPrice);
              fullPrice = formatCurrency(fullPrice, currencyFormat);
              tprPrice = formatCurrency(tprPrice, currencyFormat);
              var badgeCopy = '';
              if (badgePrice !== 0) {
                  badgeCopy = badgePrice;
                  badgeCopy = formatCurrency(badgeCopy, currencyFormat);
                  badgeCopy = '<strong class="c-badge f-small f-highlight">' + 'SAVE ' + badgeCopy + '</strong>';
              }
              var itemBoxshot = apiItemListTwo[i].image;
              itemBoxshot = itemBoxshot + '&w=231&h=197&q=90&m=6&b=%23FFFFFFFF&o=f&aim=true'
              var itemTitle = apiItemListTwo[i].productTitle;
              var productCopy = apiItemListTwo[i].productDescription;
              productCopy = productCopy.replace(/\n/g, '<br>');
              var href = 'https://www.microsoft.com/en-us/p' + '/computer-deals/' + apiItemListTwo[i].productId + '/' + apiItemListTwo[i].skuId;


              var aopricing = "";
              if (tprPrice !== 100000000) {
                  if (fullPrice !== tprPrice) {
                      aopricing = '<div class="c-price" itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">' +
                          '<span class="discounted" itemprop="price">' + fullPrice + '</span>' + '<span itemprop="price">' + tprPrice + '</span>' +
                          '</div>';
                  } else {
                      aopricing = '<div class="c-price" itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">' +
                          '<span itemprop="price">' + fullPrice + '</span>' +
                          '</div>'
                  }
              }

              $(".pcAccessories" + " ul").append('<li>' +
                  '<section class="m-product-placement-item f-size-large context-device f-clean" data-prodid="' + productId + '" data-sid="' + sid + '">' +
                  '<a target="blank" href="' + href + '">' +
                  '<picture>' +
                  '<source srcset="' + itemBoxshot + '" media="(min-width:0)">' +
                  '<img class="c-image" srcset="' + itemBoxshot + '" src="' + itemBoxshot + '" ' +
                  'alt="' + ' logo">' +
                  '</picture>' +
                  '<div>' +
                  badgeCopy +
                  '<h3 class="c-heading" itemprop="product name">' + itemTitle + '</h3>' +
                  aopricing +
                  '<link itemprop="availability" href="https://schema.org/InStock">' +
                  '<p class="c-paragraph">' + productCopy + '</p>' +
                  '</div>' +
                  '</a>' +
                  '</section>' +
                  '</li>')
          }


      }



  })();
} else {
  $(".pccross").remove();
  $(".acccross").remove();
}

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}



//If you don't send in the format from the PriceFormat JSON, you're going to have a bad time.
function formatCurrency(price, format) {
  var formattedPrice = "" + price;
  if (!format.keyHasDecimal) {
      formattedPrice = formattedPrice.split(".")[0];
  } else if (formattedPrice.indexOf(".99") === -1) {
      formattedPrice = formattedPrice.split(".")[0] + ".00";
  }
  if (formattedPrice.split(".")[0].length > 3) { // Needs to figure out thousands
      //console.log("splitting thousands");
      if (!format.keyHasDecimal) {
          formattedPrice = formattedPrice.substring(0, formattedPrice.length - 3) + "*" + formattedPrice.substring(formattedPrice.length - 3, formattedPrice.length);
      } else {
          formattedPrice = formattedPrice.substring(0, formattedPrice.length - 6) + "*" + formattedPrice.substring(formattedPrice.length - 6, formattedPrice.length);
      }
  }
  if (format.keyThousandCharacter === ",") {
      //console.log("replacing thousand");
      formattedPrice = formattedPrice.replace("*", format.keyThousandCharacter);
  } else {
      //console.log("replacing period");
      formattedPrice = formattedPrice.replace(".", ",");
      formattedPrice = formattedPrice.replace("*", format.keyThousandCharacter);
  }

  formattedPrice = "" + format.keyPriceFormat.replace("#", formattedPrice);

  return formattedPrice;
}

var topCtaText = {
"locales": {
  "en-us": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "ar-ae": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "ar-sa": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-ae": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-sa": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "cs-cz": {
    "keyPreorder": "PŘEDOBJEDNAT",
    "keyGetitnow": "POŘIĎTE SI JI JEŠTĚ DNES"
  },
  "da-dk": {
    "keyPreorder": "FORUDBESTIL",
    "keyGetitnow": "HENT DET NU"
  },
  "de-at": {
    "keyPreorder": "VORBESTELLEN",
    "keyGetitnow": "JETZT KAUFEN"
  },
  "de-ch": {
    "keyPreorder": "VORBESTELLEN",
    "keyGetitnow": "JETZT KAUFEN"
  },
  "de-de": {
    "keyPreorder": "VORBESTELLEN",
    "keyGetitnow": "JETZT KAUFEN"
  },
  "el-gr": {
    "keyPreorder": "ΠΡΟΠΑΡΑΓΓΕΛΙΑ",
    "keyGetitnow": "ΑΠΟΚΤΗΣΤΕ ΤΟ ΣΗΜΕΡΑ"
  },
  "en-au": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-ca": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-gb": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-hk": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-ie": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-in": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-nz": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-sg": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "en-za": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "es-ar": {
    "keyPreorder": "RESERVAR",
    "keyGetitnow": "CONSÍGUELO AHORA"
  },
  "es-cl": {
    "keyPreorder": "RESERVAR",
    "keyGetitnow": "CONSÍGUELO AHORA"
  },
  "es-co": {
    "keyPreorder": "RESERVAR",
    "keyGetitnow": "CONSÍGUELO AHORA"
  },
  "es-es": {
    "keyPreorder": "RESERVAR",
    "keyGetitnow": "CONSÍGUELO HOY"
  },
  "es-mx": {
    "keyPreorder": "RESERVAR",
    "keyGetitnow": "CONSÍGUELO AHORA"
  },
  "fi-fi": {
    "keyPreorder": "TILAA ENNAKKOON",
    "keyGetitnow": "HANKI SE NYT"
  },
  "fr-be": {
    "keyPreorder": "PRÉCOMMANDER",
    "keyGetitnow": "ACHETEZ-LE DÈS MAINTENANT"
  },
  "fr-ca": {
    "keyPreorder": "PRÉCOMMANDER",
    "keyGetitnow": "OBTENEZ-LE MAINTENANT"
  },
  "fr-ch": {
    "keyPreorder": "PRÉCOMMANDER",
    "keyGetitnow": "ACHETEZ-LE DÈS MAINTENANT"
  },
  "fr-fr": {
    "keyPreorder": "PRÉCOMMANDER",
    "keyGetitnow": "ACHETEZ-LE DÈS MAINTENANT"
  },
  "he-il": {
    "keyPreorder": "PRE-ORDER",
    "keyGetitnow": "GET IT NOW"
  },
  "hu-hu": {
    "keyPreorder": "ELŐRENDELÉS",
    "keyGetitnow": "SZEREZD BE MÉG MA"
  },
  "it-it": {
    "keyPreorder": "PREORDINA",
    "keyGetitnow": "ACQUISTA SUBITO"
  },
  "ja-jp": {
    "keyPreorder": "予約はこちら",
    "keyGetitnow": "今すぐ購入"
  },
  "ko-kr": {
    "keyPreorder": "사전 주문",
    "keyGetitnow": "지금 구매"
  },
  "nb-no": {
    "keyPreorder": "FORHÅNDSBESTILL",
    "keyGetitnow": "SKAFF DEG DET NÅ"
  },
  "nl-be": {
    "keyPreorder": "RESERVEER",
    "keyGetitnow": "KOOP HET NU"
  },
  "nl-nl": {
    "keyPreorder": "RESERVEER",
    "keyGetitnow": "KOOP HET NU"
  },
  "pl-pl": {
    "keyPreorder": "PRZEDSPRZEDAŻ",
    "keyGetitnow": "KUP JUŻ TERAZ"
  },
  "pt-br": {
    "keyPreorder": "PRÉ-ENCOMENDA",
    "keyGetitnow": "ADQUIRA AGORA"
  },
  "pt-pt": {
    "keyPreorder": "PRÉ-ENCOMENDAR",
    "keyGetitnow": "OBTER AGORA"
  },
  "ru-ru": {
    "keyPreorder": "ПРЕДЗАКАЗ",
    "keyGetitnow": "ПОЛУЧИТЬ СЕЙЧАС"
  },
  "sk-sk": {
    "keyPreorder": "PREDOBJEDNAŤ",
    "keyGetitnow": "ZÍSKAJTE JU EŠTE DNES"
  },
  "sv-se": {
    "keyPreorder": "FÖRBESTÄLL",
    "keyGetitnow": "SKAFFA DET I DAG"
  },
  "tr-tr": {
    "keyPreorder": "ÖN SİPARİŞ VERİN",
    "keyGetitnow": "ŞİMDİ EDİNİN"
  },
  "zh-hk": {
    "keyPreorder": "預先訂購",
    "keyGetitnow": "立即購買"
  },
  "zh-tw": {
    "keyPreorder": "預訂",
    "keyGetitnow": "立即購買"
  }
}
}

var gpstrings = {
"locales": {
  "en-us": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "ar-ae": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "ar-sa": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-ae": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-sa": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "cs-cz": {
    "keyIncluded": "Se zahrnutím <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> s <<PLACEHOLDERGPLOGO>>"
  },
  "da-dk": {
    "keyIncluded": "Inkluderet med <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> med <<PLACEHOLDERGPLOGO>>"
  },
  "de-at": {
    "keyIncluded": "Enthalten in <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> mit <<PLACEHOLDERGPLOGO>>"
  },
  "de-ch": {
    "keyIncluded": "Enthalten in <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> mit <<PLACEHOLDERGPLOGO>>"
  },
  "de-de": {
    "keyIncluded": "Enthalten in <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> mit <<PLACEHOLDERGPLOGO>>"
  },
  "el-gr": {
    "keyIncluded": "Περιλαμβάνεται με το <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> με <<PLACEHOLDERGPLOGO>>"
  },
  "en-au": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-ca": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-gb": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-hk": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-ie": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-in": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-nz": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-sg": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "en-za": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "es-ar": {
    "keyIncluded": "Incluido con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "es-cl": {
    "keyIncluded": "Incluido con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "es-co": {
    "keyIncluded": "Incluido con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "es-es": {
    "keyIncluded": "Incluido con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "es-mx": {
    "keyIncluded": "Incluido con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "fi-fi": {
    "keyIncluded": "Sisältyy: <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERGPLOGO>> – <<PLACEHOLDERPRICE>>"
  },
  "fr-be": {
    "keyIncluded": "Inclus avec <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> avec <<PLACEHOLDERGPLOGO>>"
  },
  "fr-ca": {
    "keyIncluded": "Inclus avec <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> avec <<PLACEHOLDERGPLOGO>>"
  },
  "fr-ch": {
    "keyIncluded": "Inclus avec <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> avec <<PLACEHOLDERGPLOGO>>"
  },
  "fr-fr": {
    "keyIncluded": "Inclus avec <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> avec <<PLACEHOLDERGPLOGO>>"
  },
  "he-il": {
    "keyIncluded": "Included with <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> with <<PLACEHOLDERGPLOGO>>"
  },
  "hu-hu": {
    "keyIncluded": "Tartalmazza: <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> ezzel: <<PLACEHOLDERGPLOGO>>"
  },
  "it-it": {
    "keyIncluded": "Incluso con <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> con <<PLACEHOLDERGPLOGO>>"
  },
  "ja-jp": {
    "keyIncluded": "<<PLACEHOLDERGPLOGO>> に同梱",
    "keyWith": "<<PLACEHOLDERGPLOGO>> 入りの <<PLACEHOLDERPRICE>>"
  },
  "ko-kr": {
    "keyIncluded": "<<PLACEHOLDERGPLOGO>>에 포함",
    "keyWith": "<<PLACEHOLDERGPLOGO>>가 있는 <<PLACEHOLDERPRICE>>"
  },
  "nb-no": {
    "keyIncluded": "Inkludert med <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> med <<PLACEHOLDERGPLOGO>>"
  },
  "nl-be": {
    "keyIncluded": "Inbegrepen bij <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> met <<PLACEHOLDERGPLOGO>>"
  },
  "nl-nl": {
    "keyIncluded": "Inbegrepen bij <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> met <<PLACEHOLDERGPLOGO>>"
  },
  "pl-pl": {
    "keyIncluded": "W zestawie z <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> z <<PLACEHOLDERGPLOGO>>"
  },
  "pt-br": {
    "keyIncluded": "Incluído com <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> com <<PLACEHOLDERGPLOGO>>"
  },
  "pt-pt": {
    "keyIncluded": "Incluído com <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> com <<PLACEHOLDERGPLOGO>>"
  },
  "ru-ru": {
    "keyIncluded": "Включено в <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> с <<PLACEHOLDERGPLOGO>>"
  },
  "sk-sk": {
    "keyIncluded": "Zahrnuté v <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> s <<PLACEHOLDERGPLOGO>>"
  },
  "sv-se": {
    "keyIncluded": "Ingår med <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> med <<PLACEHOLDERGPLOGO>>"
  },
  "tr-tr": {
    "keyIncluded": "<<PLACEHOLDERGPLOGO>> içerisinde yer alır",
    "keyWith": "<<PLACEHOLDERGPLOGO>> ile birlikte <<PLACEHOLDERPRICE>>"
  },
  "zh-hk": {
    "keyIncluded": "隨附於 <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERGPLOGO>> 為 <<PLACEHOLDERPRICE>>"
  },
  "zh-tw": {
    "keyIncluded": "包含在 <<PLACEHOLDERGPLOGO>>",
    "keyWith": "<<PLACEHOLDERPRICE>> 與 <<PLACEHOLDERGPLOGO>>"
  }
}
}

var ratingOrgs = {
"en-us": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1": "Users Interact",
  "interactiveElem2": "In-Game Purchases"
},
"ar-ae": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"ar-sa": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-ae": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-sa": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"cs-cz": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interakce uživatelů",
  "interactiveElem2":"In-Game Purchases"
},
"da-dk": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Brugere interagerer",
  "interactiveElem2":"In-Game Purchases"
},
"de-at": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Nutzerinteraktion (User Interaction)",
  "interactiveElem2":"In-Game Purchases"
},
"de-ch": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Nutzerinteraktion (User Interaction)",
  "interactiveElem2":"In-Game Purchases"
},
"de-de": {
  "orgname": "USK",
  "orglink": "https://usk.de/fuer-unternehmen/spiele-und-apps-pruefen-lassen/spiele-und-apps-im-iarc-system/",
  "interactiveElem1":"Nutzerinteraktion (User Interaction)",
  "interactiveElem2":"In-Game Purchases"
},
"el-gr": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Αλληλεπίδραση χρηστών",
  "interactiveElem2":"In-Game Purchases"
},
"en-au": {
  "orgname": "AU Classification",
  "orglink": "https://www.classification.gov.au/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-ca": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-gb": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-hk": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-ie": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-in": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-nz": {
  // "orgname": "AU Classification",
  // "orglink": "https://www.classification.gov.au/"
  "orgname": "NZ Classification Office",
  "orglink": "https://www.classificationoffice.govt.nz/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-sg": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"en-za": {
  "orgname": "Film & Publication Board",
  "orglink": "https://www.fpb.org.za/classification-guidelines/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"es-ar": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"Compras dentro del juego"
},
"es-cl": {
  "orgname": "Calificación de videojuegos",
  "orglink": "https://www.bcn.cl/leyfacil/recurso/calificacion-de-videojuegos",
  "interactiveElem1":"Interacción entre usuarios",
  "interactiveElem2":"Compras dentro del juego"
},
"es-co": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1":"Interacción entre usuarios",
  "interactiveElem2":"Compras dentro del juego"
},
"es-es": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interacción entre usuarios",
  "interactiveElem2":"Compras dentro del juego"
},
"es-mx": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1":"Usuarios interactúan",
  "interactiveElem2":"Compras dentro del juego"
},
"fi-fi": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Käyttäjät ovat vuorovaikutuksessa",
  "interactiveElem2":"In-Game Purchases"
},
"fr-be": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interaction d'utilisateurs",
  "interactiveElem2":"In-Game Purchases"
},
"fr-ca": {
  "orgname": "ESRB",
  "orglink": "https://www.esrb.org/ratings-guide/",
  "interactiveElem1":"Interaction d'utilisateurs",
  "interactiveElem2":"In-Game Purchases"
},
"fr-ch": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interaction d'utilisateurs",
  "interactiveElem2":"In-Game Purchases"
},
"fr-fr": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interaction d'utilisateurs",
  "interactiveElem2":"In-Game Purchases"
},
"he-il": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"לימות בינוניתאינטראקטציה",
  "interactiveElem2":"In-Game Purchases"
},
"hu-hu": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Felhasználói együttműködés",
  "interactiveElem2":"In-Game Purchases"
},
"it-it": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interazione tra utenti",
  "interactiveElem2":"In-Game Purchases"
},
"ja-jp": {
  "orgname": "CERO",
  "orglink": "https://www.cero.gr.jp/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"ko-kr": {
  "orgname": "GRAC",
  "orglink": "https://www.grac.or.kr/",
  "interactiveElem1":"Users Interact",
  "interactiveElem2":"In-Game Purchases"
},
"nb-no": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Brukere kommuniserer",
  "interactiveElem2":"In-Game Purchases"
},
"nl-be": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Gebruikersinteractie",
  "interactiveElem2":"In-Game Purchases"
},
"nl-nl": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Gebruikersinteractie",
  "interactiveElem2":"In-Game Purchases"
},
"pl-pl": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interakcje użytkowników",
  "interactiveElem2":"In-Game Purchases"
},
"pt-br": {
  "orgname": "Justica e Seguranca Publica",
  "orglink": "https://www.justica.gov.br/seus-direitos/classificacao",
  "interactiveElem1":"Usuários Interagem",
  "interactiveElem2":"In-Game Purchases"
},
"pt-pt": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Usuários Interagem",
  "interactiveElem2":"In-Game Purchases"
},
"ru-ru": {
  "orgname": "Russian Ministry of Culture",
  "orglink": "https://culture.gov.ru/",
  "interactiveElem1":"Взаимодействие между пользователями",
  "interactiveElem2":"In-Game Purchases"
},
"sk-sk": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Interakcia používateľov",
  "interactiveElem2":"In-Game Purchases"
},
"sv-se": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Användare deltar",
  "interactiveElem2":"In-Game Purchases"
},
"tr-tr": {
  "orgname": "PEGI",
  "orglink": "https://pegi.info/",
  "interactiveElem1":"Kullanıcı Etkileşimi",
  "interactiveElem2":"In-Game Purchases"
},
"zh-hk": {
  "orgname": "IARC",
  "orglink": "https://www.globalratings.com/",
  "interactiveElem1":"使用者互動",
  "interactiveElem2":"In-Game Purchases"
},
"zh-tw": {
  "orgname": "CSRR",
  "orglink": "https://law.moj.gov.tw/Index.aspx",
  "interactiveElem1":"反社交特徵",
  "interactiveElem2":"In-Game Purchases"
}
}

var oldnewpricestrings = {
"locales": {
  "en-us": {
    "keyOldprice": "Old price was <<PLACEHOLDERPRICE>>",
    "keyNewprice": "New price is <<PLACEHOLDERPRICE>>"
  }
}
}

var gamepasspricestrings = {
"locales": {
  "en-us": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "ar-ae": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "ar-sa": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-ae": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-sa": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "cs-cz": {
    "keyOldprice": "Cena zahrnující Game Pass činí <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Cena nezahrnující Game Pass činí <<PLACEHOLDERPRICE>>"
  },
  "da-dk": {
    "keyOldprice": "Prisen uden Game Pass er <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Prisen med Game Pass er <<PLACEHOLDERPRICE>>"
  },
  "de-at": {
    "keyOldprice": "Der Preis ohne Game Pass beträgt <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Der Preis mit Game Pass beträgt <<PLACEHOLDERPRICE>>"
  },
  "de-ch": {
    "keyOldprice": "Der Preis ohne Game Pass beträgt <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Der Preis mit Game Pass beträgt <<PLACEHOLDERPRICE>>"
  },
  "de-de": {
    "keyOldprice": "Der Preis ohne Game Pass beträgt <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Der Preis mit Game Pass beträgt <<PLACEHOLDERPRICE>>"
  },
  "el-gr": {
    "keyOldprice": "Η τιμή χωρίς το Game Pass είναι <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Η τιμή με το Game Pass είναι <<PLACEHOLDERPRICE>>"
  },
  "en-au": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-ca": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-gb": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-hk": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-ie": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-in": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-nz": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-sg": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "en-za": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "es-ar": {
    "keyOldprice": "El precio sin Game Pass es de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "El precio con Game Pass es de <<PLACEHOLDERPRICE>>"
  },
  "es-cl": {
    "keyOldprice": "El precio sin Game Pass es de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "El precio con Game Pass es de <<PLACEHOLDERPRICE>>"
  },
  "es-co": {
    "keyOldprice": "El precio sin Game Pass es de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "El precio con Game Pass es de <<PLACEHOLDERPRICE>>"
  },
  "es-es": {
    "keyOldprice": "El precio sin Game Pass es de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "El precio con Game Pass es de <<PLACEHOLDERPRICE>>"
  },
  "es-mx": {
    "keyOldprice": "El precio sin Game Pass es de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "El precio con Game Pass es de <<PLACEHOLDERPRICE>>"
  },
  "fi-fi": {
    "keyOldprice": "Ilman Game Passia hinta on <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Passin kanssa hinta on <<PLACEHOLDERPRICE>>"
  },
  "fr-be": {
    "keyOldprice": "Le prix hors Game Pass est de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Le prix Game Pass est de <<PLACEHOLDERPRICE>>"
  },
  "fr-ca": {
    "keyOldprice": "Le prix hors Game Pass est <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Le prix Game Pass est <<PLACEHOLDERPRICE>>"
  },
  "fr-ch": {
    "keyOldprice": "Le prix hors Game Pass est de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Le prix Game Pass est de <<PLACEHOLDERPRICE>>"
  },
  "fr-fr": {
    "keyOldprice": "Le prix hors Game Pass est de <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Le prix Game Pass est de <<PLACEHOLDERPRICE>>"
  },
  "he-il": {
    "keyOldprice": "Non Game Pass price is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass price is <<PLACEHOLDERPRICE>>"
  },
  "hu-hu": {
    "keyOldprice": "Nem Game Pass-ár: <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass-ár: <<PLACEHOLDERPRICE>>"
  },
  "it-it": {
    "keyOldprice": "Il prezzo senza Game Pass è <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Il prezzo con Game Pass è <<PLACEHOLDERPRICE>>"
  },
  "ja-jp": {
    "keyOldprice": "Game Pass がない場合の価格: <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass がある場合の価格 <<PLACEHOLDERPRICE>>"
  },
  "ko-kr": {
    "keyOldprice": "Game Pass 비이용자 가격: <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass 이용자 가격: <<PLACEHOLDERPRICE>>"
  },
  "nb-no": {
    "keyOldprice": "Pris uten Game Pass er <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Pris med Game Pass er <<PLACEHOLDERPRICE>>"
  },
  "nl-be": {
    "keyOldprice": "De prijs zonder Game Pass is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "De prijs met Game Pass is <<PLACEHOLDERPRICE>>"
  },
  "nl-nl": {
    "keyOldprice": "De prijs zonder Game Pass is <<PLACEHOLDERPRICE>>",
    "keyNewprice": "De prijs met Game Pass is <<PLACEHOLDERPRICE>>"
  },
  "pl-pl": {
    "keyOldprice": "Cena bez subskrypcji Game Pass wynosi <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Cena z subskrypcją Game Pass wynosi <<PLACEHOLDERPRICE>>"
  },
  "pt-br": {
    "keyOldprice": "O preço do jogo sem Game Pass é <<PLACEHOLDERPRICE>>",
    "keyNewprice": "O preço do Game Pass é <<PLACEHOLDERPRICE>>"
  },
  "pt-pt": {
    "keyOldprice": "O preço sem Game Pass é <<PLACEHOLDERPRICE>>",
    "keyNewprice": "O preço com Game Pass é <<PLACEHOLDERPRICE>>"
  },
  "ru-ru": {
    "keyOldprice": "Цена абонемента без Game Pass: <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Цена абонемента Game Pass <<PLACEHOLDERPRICE>>"
  },
  "sk-sk": {
    "keyOldprice": "Cena bez predplatného Game Pass je <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Cena predplatného Game Pass je <<PLACEHOLDERPRICE>>"
  },
  "sv-se": {
    "keyOldprice": "Priset utan Game Pass är <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Priset med Game Pass är <<PLACEHOLDERPRICE>>"
  },
  "tr-tr": {
    "keyOldprice": "Game Pass haricindeki fiyatı <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass dahilindeki fiyatı <<PLACEHOLDERPRICE>>"
  },
  "zh-hk": {
    "keyOldprice": "非 Game Pass 價格為 <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass 價格為 <<PLACEHOLDERPRICE>>"
  },
  "zh-tw": {
    "keyOldprice": "非 Game Pass 的價格為 <<PLACEHOLDERPRICE>>",
    "keyNewprice": "Game Pass 的價格 <<PLACEHOLDERPRICE>>"
  }
}
}

eaplaystrings = {
"locales": {
  "en-us": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "ar-ae": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "ar-sa": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-ae": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-sa": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "cs-cz": {
    "keyWitheaplay": "se členstvím EA Play v rámci předplatného Xbox Game Pass Ultimate"
  },
  "da-dk": {
    "keyWitheaplay": "via EA Play med Xbox Game Pass Ultimate"
  },
  "de-at": {
    "keyWitheaplay": "über EA Play mit Xbox Game Pass Ultimate"
  },
  "de-ch": {
    "keyWitheaplay": "über EA Play mit Xbox Game Pass Ultimate"
  },
  "de-de": {
    "keyWitheaplay": "über EA Play mit Xbox Game Pass Ultimate"
  },
  "el-gr": {
    "keyWitheaplay": "μέσα από το EA Play με το Xbox Game Pass Ultimate"
  },
  "en-au": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-ca": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-gb": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-hk": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-ie": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-in": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-nz": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-sg": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "en-za": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "es-ar": {
    "keyWitheaplay": "mediante EA Play con Xbox Game Pass Ultimate"
  },
  "es-cl": {
    "keyWitheaplay": "mediante EA Play con Xbox Game Pass Ultimate"
  },
  "es-co": {
    "keyWitheaplay": "mediante EA Play con Xbox Game Pass Ultimate"
  },
  "es-es": {
    "keyWitheaplay": "mediante EA Play con Xbox Game Pass Ultimate"
  },
  "es-mx": {
    "keyWitheaplay": "mediante EA Play con Xbox Game Pass Ultimate"
  },
  "fi-fi": {
    "keyWitheaplay": "Xbox Game Pass Ultimateen kuuluvalla EA Playlla"
  },
  "fr-be": {
    "keyWitheaplay": "via EA Play avec le Xbox Game Pass Ultimate"
  },
  "fr-ca": {
    "keyWitheaplay": "via EA Jouez avec Xbox Game Pass Ultimate"
  },
  "fr-ch": {
    "keyWitheaplay": "via EA Play avec le Xbox Game Pass Ultimate"
  },
  "fr-fr": {
    "keyWitheaplay": "via EA Play avec le Xbox Game Pass Ultimate"
  },
  "he-il": {
    "keyWitheaplay": "via EA Play with Xbox Game Pass Ultimate"
  },
  "hu-hu": {
    "keyWitheaplay": "EA Playjel Xbox Game Pass Ultimate előfizetéssel"
  },
  "it-it": {
    "keyWitheaplay": "tramite EA Play con Xbox Game Pass Ultimate"
  },
  "ja-jp": {
    "keyWitheaplay": "EA Xbox Game Pass Ultimate で EA Play から"
  },
  "ko-kr": {
    "keyWitheaplay": "EA Play에서 Xbox Game Pass 얼티밋으로 플레이"
  },
  "nb-no": {
    "keyWitheaplay": "via EA Play med Xbox Game Pass Ultimate"
  },
  "nl-be": {
    "keyWitheaplay": "via EA Play met Xbox Game Pass Ultimate"
  },
  "nl-nl": {
    "keyWitheaplay": "via EA Play met Xbox Game Pass Ultimate"
  },
  "pl-pl": {
    "keyWitheaplay": "za pośrednictwem EA Play w ramach subskrypcji Xbox Game Pass Ultimate"
  },
  "pt-br": {
    "keyWitheaplay": "por meio do EA Play com o Xbox Game Pass Ultimate"
  },
  "pt-pt": {
    "keyWitheaplay": "através do EA Play com o Xbox Game Pass Ultimate"
  },
  "ru-ru": {
    "keyWitheaplay": "через EA Play с Xbox Game Pass Ultimate"
  },
  "sk-sk": {
    "keyWitheaplay": "prostredníctvom EA Play s predplatným Xbox Game Pass Ultimate"
  },
  "sv-se": {
    "keyWitheaplay": "via EA Play med Xbox Game Pass Ultimate"
  },
  "tr-tr": {
    "keyWitheaplay": "Xbox Game Pass Ultimate ile EA Play üzerinden"
  },
  "zh-hk": {
    "keyWitheaplay": "使用 Xbox Game Pass Ultimate 透過 EA Play"
  },
  "zh-tw": {
    "keyWitheaplay": "透過 EA Play 使用 Xbox Game Pass Ultimate 暢玩"
  }
}
}

platStrings = {
"locales": {
  "en-us": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "ar-ae": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "ar-sa": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-ae": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-sa": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "cs-cz": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Konzole"
  },
  "da-dk": {
    "keyCloud": "Cloud",
    "keyPc": "Pc",
    "keyConsole": "Konsol"
  },
  "de-at": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "de-ch": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "de-de": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "el-gr": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Κονσόλα"
  },
  "en-au": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-ca": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-gb": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-hk": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-ie": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-in": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-nz": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-sg": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "en-za": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "es-ar": {
    "keyCloud": "Nube",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "es-cl": {
    "keyCloud": "Nube",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "es-co": {
    "keyCloud": "Nube",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "es-es": {
    "keyCloud": "Nube",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "es-mx": {
    "keyCloud": "Nube",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "fi-fi": {
    "keyCloud": "Pilvi",
    "keyPc": "PC:LLE",
    "keyConsole": "Konsoli"
  },
  "fr-be": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "fr-ca": {
    "keyCloud": "Nuage",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "fr-ch": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "fr-fr": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "he-il": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "hu-hu": {
    "keyCloud": "Felhő",
    "keyPc": "PC",
    "keyConsole": "Konzol"
  },
  "it-it": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "ja-jp": {
    "keyCloud": "クラウド",
    "keyPc": "PC",
    "keyConsole": "コンソール"
  },
  "ko-kr": {
    "keyCloud": "클라우드",
    "keyPc": "만나보세요",
    "keyConsole": "콘솔"
  },
  "nb-no": {
    "keyCloud": "Sky",
    "keyPc": "PC",
    "keyConsole": "Konsoll"
  },
  "nl-be": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "nl-nl": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "pl-pl": {
    "keyCloud": "Chmura",
    "keyPc": "KOMPUTER",
    "keyConsole": "Konsola"
  },
  "pt-br": {
    "keyCloud": "Nuvem",
    "keyPc": "PC",
    "keyConsole": "Console"
  },
  "pt-pt": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Consola"
  },
  "ru-ru": {
    "keyCloud": "Облако",
    "keyPc": "ПК",
    "keyConsole": "Консоли"
  },
  "sk-sk": {
    "keyCloud": "Cloud",
    "keyPc": "PC",
    "keyConsole": "Konzola"
  },
  "sv-se": {
    "keyCloud": "Moln",
    "keyPc": "PC",
    "keyConsole": "Konsol"
  },
  "tr-tr": {
    "keyCloud": "Bulut",
    "keyPc": "BİLGİSAYAR",
    "keyConsole": "Konsol"
  },
  "zh-hk": {
    "keyCloud": "雲端",
    "keyPc": "電腦",
    "keyConsole": "主機"
  },
  "zh-tw": {
    "keyCloud": "雲端",
    "keyPc": "PC",
    "keyConsole": "主機"
  }
}
}


alreadyMemberData = {
                  "locales": {
                      "ar-ae": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "ar-sa": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "cs-cz": {
                            "cta": "UŽ JSTE ČLENEM?",
                            "aria": "Už jste členem? Přihlaste se ke svému účtu Xbox Game Pass."
                      },

                      "da-dk": {
                            "cta": "ALLEREDE MEDLEM?",
                            "aria": "Er du allerede medlem? Log på din xbox game pass-konto."
                      },

                      "de-at": {
                            "cta": "DU BIST BEREITS MITGLIED?",
                            "aria": "Bereits Mitglied? Melde dich bei deinem Xbox Game Pass-Konto an."
                      },

                      "de-ch": {
                            "cta": "DU BIST BEREITS MITGLIED?",
                            "aria": "Bereits Mitglied? Melde dich bei deinem Xbox Game Pass-Konto an."
                      },

                      "de-de": {
                            "cta": "DU BIST BEREITS MITGLIED?",
                            "aria": "Bereits Mitglied? Melde dich bei deinem Xbox Game Pass-Konto an."
                      },

                      "el-gr": {
                            "cta": "ΕΙΣΤΕ ΗΔΗ ΣΥΝΔΡΟΜΗΤΕΣ;",
                            "aria": "Είστε ήδη συνδρομητές; Συνδεθείτε στον λογαριασμό σας Xbox Game Pass."
                      },

                      "en-ae": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-au": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-ca": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-gb": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-hk": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-ie": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-il": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-in": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-sa": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-sg": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-nz": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-us": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "en-za": {
                            "cta": "ALREADY A MEMBER?",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "es-ar": {
                            "cta": "¿YA ES MIEMBRO?",
                            "aria": "¿Ya eres miembro? Inicia sesión en tu cuenta de Xbox Game Pass."
                      },

                      "es-cl": {
                            "cta": "¿YA ES MIEMBRO?",
                            "aria": "¿Ya eres miembro? Inicia sesión en tu cuenta de Xbox Game Pass."
                      },

                      "es-co": {
                            "cta": "¿YA ES MIEMBRO?",
                            "aria": "¿Ya eres miembro? Inicia sesión en tu cuenta de Xbox Game Pass."
                      },

                      "es-es": {
                            "cta": "¿YA ERES MIEMBRO?",
                            "aria": "¿Ya eres miembro? Inicia sesión en tu cuenta de Xbox Game Pass."
                      },

                      "es-mx": {
                            "cta": "¿YA ES MIEMBRO?",
                            "aria": "¿Ya eres miembro? Inicia sesión en tu cuenta de Xbox Game Pass."
                      },

                      "fi-fi": {
                            "cta": "OLETKO JO JÄSEN?",
                            "aria": "Oletko jo jäsen? Kirjaudu Xbox Game Pass -tilillesi."
                      },

                      "fr-be": {
                            "cta": "DÉJÀ MEMBRE ?",
                            "aria": "Déjà membre ? Connectez-vous à votre compte Xbox Game Pass."
                      },

                      "fr-ca": {
                            "cta": "DÉJÀ MEMBRE?",
                            "aria": "Vous êtes déjà membre? Connectez-vous à votre compte xbox game pass."
                      },

                      "fr-ch": {
                            "cta": "DÉJÀ MEMBRE ?",
                            "aria": "Déjà membre ? Connectez-vous à votre compte Xbox Game Pass."
                      },

                      "fr-fr": {
                            "cta": "DÉJÀ MEMBRE ?",
                            "aria": "Déjà membre ? Connectez-vous à votre compte Xbox Game Pass."
                      },

                      "he-il": {
                            "cta": "ALREADY A MEMBER",
                            "aria": "Already a member? Log into your xbox game pass account."
                      },

                      "hu-hu": {
                            "cta": "MÁR TAG VAGY?",
                            "aria": "Már tag vagy? Lépj be Xbox Game Pass-fiókodba."
                      },

                      "it-it": {
                            "cta": "HAI GIÀ UN ABBONAMENTO?",
                            "aria": "Hai già un abbonamento? Accedi al tuo account Xbox Game Pass."
                      },

                      "ja-jp": {
                            "cta": "すでにメンバーですか?",
                            "aria": "すでにメンバーの方は Xbox Game Pass アカウントにログインしてください。"
                      },

                      "ko-kr": {
                            "cta": "이미 회원이신가요?",
                            "aria": "이미 가입하셨나요? Xbox Game Pass 계정에 로그인."
                      },

                      "nb-no": {
                            "cta": "ER DU ALLEREDE MEDLEM?",
                            "aria": "Er du allerede medlem? Logg inn i xbox game pass-kontoen din."
                      },

                      "nl-be": {
                            "cta": "AL LID?",
                            "aria": "Al lid? Meld je aan bij je Xbox Game Pass-account."
                      },

                      "nl-nl": {
                            "cta": "AL LID?",
                            "aria": "Al lid? Meld je aan bij je Xbox Game Pass-account."
                      },

                      "pl-pl": {
                            "cta": "POSIADASZ JUŻ CZŁONKOSTWO?",
                            "aria": "Posiadasz już subskrypcję? Zaloguj się do swojego konta xbox game pass."
                      },

                      "pt-br": {
                            "cta": "JÁ É UM MEMBRO?",
                            "aria": "Já é membro? Entre em sua conta do Xbox Game Pass."
                      },

                      "pt-pt": {
                            "cta": "JÁ ÉS MEMBRO?",
                            "aria": "Já és membro? Inicia sessão na tua conta do xbox game pass."
                      },

                      "ru-ru": {
                            "cta": "УЖЕ ОФОРМИЛИ ПОДПИСКУ?",
                            "aria": "Уже оформили подписку? Войдите в свою учетную запись Xbox Game Pass."
                      },

                      "sk-sk": {
                            "cta": "UŽ STE ČLENOM?",
                            "aria": "Už ste členom? Prihláste sa do svojho konta Xbox Game Pass."
                      },

                      "sv-se": {
                            "cta": "REDAN MEDLEM?",
                            "aria": "Redan medlem? Logga in på ditt Xbox Game Pass-konto."
                      },

                      "tr-tr": {
                            "cta": "ZATEN ÜYE MİSİNİZ?",
                            "aria": "Zaten üye misiniz? Xbox game pass hesabınızda oturum açın."
                      },

                      "zh-hk": {
                            "cta": "已經是會員？",
                            "aria": "已經是會員？登入您的 xbox game pass 帳戶。"
                      },

                      "zh-tw": {
                            "cta": "已經是會員？",
                            "aria": "已經是會員？登入您的 xbox game pass 帳戶。"
                      },
                  }
                }






// Adding the Already Member Button 
var isLoaded = false;
window.addEventListener("load", function () {
  isLoaded = true
});

document.addEventListener("readystatechange", function(){
  if(document.readyState == "complete") {
      setTimeout(function() {
          if(isLoaded) {
              addAlreadyMemberBtn();
          }
      }, 1000)
  }
});

  

  function addAlreadyMemberBtn() {

  var standardEdition  = document.querySelector(".moduleStandard .purchaseButtons a");
  var deluxeEdition  = document.querySelector(".moduleSilver .purchaseButtons a");
  var ultimateEdition  = document.querySelector(".moduleGold .purchaseButtons a");
  var fourthEdition  = document.querySelector(".moduleFourth .purchaseButtons a");
  var fifthEdition  = document.querySelector(".module5 .purchaseButtons a");
  var sixthEdition  = document.querySelector(".module6 .purchaseButtons a");
  var sevethEdition  = document.querySelector(".module7 .purchaseButtons a");
  var eigthEdition  = document.querySelector(".module8 .purchaseButtons a");
  var purchaseSections = document.querySelectorAll(".purchase");

  var xboxGamePassBtnStandard  = document.querySelector('.moduleStandard .btnFat');
  var xboxGamePassBtnDeluxe  = document.querySelector('.moduleSilver .btnFat');
  var xboxGamePassBtnUltimate  = document.querySelector('.moduleGold .btnFat');
  var xboxGamePassBtnFourth = document.querySelector('.moduleFourth .btnFat');
  var xboxGamePassBtnFifth = document.querySelector('.module5 .btnFat');
  var xboxGamePassBtnSixth = document.querySelector('.module6 .btnFat');
  var xboxGamePassBtnSeven = document.querySelector('.module7 .btnFat');
  var xboxGamePassBtnEight = document.querySelector('.module8 .btnFat');
  var alreadyMemberBtn = document.querySelector(".purchase .f-lightweight");
  

  var langLocale = window.location.href;
      langLocale = langLocale.split("/")[3].toLowerCase();

  //Localized CTA
  var dataCta = alreadyMemberData.locales[langLocale].cta;

  // Localized aria label
  var dataAria = alreadyMemberData.locales[langLocale].aria;  


      for(var a = 0; a < purchaseSections.length; a++) {
          // Standard Edition
          if(purchaseSections[a].classList.contains("moduleStandard")) {
              addAlreadyMemberPop(xboxGamePassBtnStandard, standardEdition, "moduleStandard")
          }
          if(purchaseSections[a].classList.contains("moduleSilver")) {
              addAlreadyMemberPop(xboxGamePassBtnDeluxe, deluxeEdition, "moduleSilver")
          }
          if(purchaseSections[a].classList.contains("moduleGold")) {
              addAlreadyMemberPop(xboxGamePassBtnUltimate, ultimateEdition,"moduleGold")
          }
          if(purchaseSections[a].classList.contains("moduleFourth")) {
              addAlreadyMemberPop(xboxGamePassBtnFourth, fourthEdition, "moduleFourth")
          }
          if(purchaseSections[a].classList.contains("module5")) {
              addAlreadyMemberPop(xboxGamePassBtnFifth, fifthEdition, "module5")
          }
          if(purchaseSections[a].classList.contains("module6")) {
              addAlreadyMemberPop(xboxGamePassBtnSixth, sixthEdition, "module6")
          }
          if(purchaseSections[a].classList.contains("module7")) {
              addAlreadyMemberPop(xboxGamePassBtnSeven, sevethEdition, "module7")
          }
          if(purchaseSections[a].classList.contains("module8")) {
              addAlreadyMemberPop(xboxGamePassBtnEight, eigthEdition, "module8")
          }
      }   


      function addAlreadyMemberPop(xboxGamePassEdition, purchaseEdition, moduleType) {
          var buyNowBtn = purchaseEdition;
          var bigID = buyNowBtn.getAttribute("data-xbbigid");
          var purchaseHref = buyNowBtn.getAttribute("data-clickname");
          var hrefArr = purchaseHref.split(">");

          for(var b = 0; b < hrefArr.length; b++) {
              var gameName = hrefArr[2];
          }

          if(xboxGamePassEdition && gameName && bigID) {
              var alreadyMemberUrl = `https://account.xbox.com/account/signin?returnUrl=https%3A%2F%2Fwww.xbox.com%2F${langLocale}%2Fgames%2Fstore%2F${gameName}%2F${bigID}&ru=https%3A%2F%2Fwww.xbox.com%2F${langLocale}%2Fgames%2Fstore%2F${gameName}%2F${bigID}`;
              var parentCta = xboxGamePassEdition.parentElement;
              console.log(xboxGamePassEdition);

              var alreadyMember = "." + moduleType + " .f-lightweight";
                  alreadyMember = document.querySelector(alreadyMember);

              // Check if the already a member CTA exists
              if(alreadyMember) {
                  alreadyMember.setAttribute("href", alreadyMemberUrl)
              }

              if(!alreadyMember) {
                  parentCta.innerHTML += "<a href='' class='c-call-to-action c-glyph f-lightweight link-marg-left alreadyMember' data-cta='internal' aria-label=''><span></span></a>";

                  var alreadyMemberBtn = "." + moduleType + " .alreadyMember";
                      alreadyMemberBtn = document.querySelector(alreadyMemberBtn);
                      alreadyMemberBtn.textContent = dataCta;
                      alreadyMemberBtn.setAttribute("aria-label", dataAria);
                      alreadyMemberBtn.setAttribute("href", alreadyMemberUrl)
              }
          }
      }                  


  }
})    