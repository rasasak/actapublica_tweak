// ==UserScript==
// @name         MZA tweak
// @version      0.8.5
// @downloadURL  https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @updateURL    https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @description  Malá vylepšení pro web MZA...
// @author       Rasasak
// @match        https://www.mza.cz/actapublica/matrika/detail/*
// @match        https://www.mza.cz/scitacioperaty/digisada/*
// @icon         https://www.mza.cz/actapublica/assets/favicon/android-chrome-192x192.png
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues

// ==/UserScript==

var g = unsafeWindow.g_viewer;
var actaPublica = window.location.href.indexOf("actapublica/matrika/detail") > -1;
var scitaciOperaty = window.location.href.indexOf("scitacioperaty/digisada/detail") > -1;


    $("#seadragon-toolbar").children().last().height('4px')
    if (window.location.href.indexOf("actapublica/matrika/detail") > -1) {
        $('#prev-image').after($('#next-image')) //posun šipek na matrikách

    }

// click2zoom => dblClick2zoom
g.gestureSettingsMouse.clickToZoom = false
g.gestureSettingsMouse.dblClickToZoom = true

// prepare referal strip
g.showReferenceStrip = true;
g.referenceStripScroll = "vertical";

    if(actaPublica){
        // dates in header
	    var birth = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(1) span').text();
	    var married = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(2) span').text();
	    var died = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(3) span').text();
        // indexes in header
	    var ibirth = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(4) span').text();
	    var imarried = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(5) span ').text();
	    var idied = $('#matrika-header .nav:nth-child(2) .nav-item:nth-child(6) span ').text();
    }else if(scitaciOperaty){
         let hamburger = makeHamburger();
         $("main .container-fluid .card .card-body").first().attr('id','scitaniHeader').addClass('collapse');
         $(".card-header").empty().prepend(hamburger);
	     var city = $('main div .card .collapse .row div:nth-child(1) p strong').text();
	     var numbers = $('main div .card .collapse .row div:nth-child(2) p ').first().text();
	     var year = $('main div .card .collapse .row:nth-child(2) div:nth-child(3) p ').first().text();

         $('.card-header').append('<ul id="header-nav" class="nav" style="font-size: 60%;"></ul>');
         $('#header-nav').append(hamburger);
         $('#header-nav').append(`
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Město/obec</span><br>
					    <span class="font-weight-bolder">`+city+`</span>
					  </li>
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Číslo popisné od-do</span><br>
					    <span class="font-weight-bolder">`+numbers+`</span>
					  </li>
					  <li class="nav-item px-3 " style="">
					    <span class="small font-italic">Rok sčítání</span><br>
					    <span class="font-weight-bolder">`+year+`</span>
					  </li>
				      `);
        };


	  //toolbar for buttons
	  let toolbar = document.querySelector('#seadragon-toolbar .form-group');


	//dezoomify button
    let btnDezoomify = makeButton('dezoomify','Stáhnout (Dezoomify)','fas fa-cloud-download-alt');
    toolbar.after(btnDezoomify);

	btnDezoomify.onclick = () => {
		let dezoomify_url = g.tileSources[g.currentPage()];
        console.log("DZI: "+dezoomify_url);
		dezoomify_url = "https://dezoomify.rasasak.cz/#"+dezoomify_url;
		window.open(dezoomify_url, '_blank');
	};



    //setting button
    let btnSettings = makeButton('settings','Nastavení','fas fa-cog')


    //setting
    let divSettings = document.createElement('div');
    divSettings.setAttribute('class','form-check');
    divSettings.setAttribute('style','background-color:white;');
    divSettings.classList.add("pt-2");

     if(actaPublica){
        $('#adjustImagePanel').append(divSettings);
        divSettings.style.display = "";
     }else if(scitaciOperaty){
        toolbar.after(btnSettings);
        $('#seadragon-toolbar').append(divSettings);
        divSettings.style.display = "none";
     };


  	 btnSettings.onclick = () => {
		 if(divSettings.style.display == "none"){
          divSettings.style.display = ""
         }else{
          divSettings.style.display = "none"
         }
	 };

       //kompaktni rezim
    let inpCompact = makeInput("compact", "Kompaktní režim", false)
    divSettings.append(inpCompact);
GM.getValue( "compact", false ).then(value => {
    inpCompact.firstChild.checked = value;
    compacted(value)
    if(value){
        updateMySeadragonHeight()
    }else{
        updateSeadragonHeight()
    };
});

	  inpCompact.firstChild.onclick = () => {
          GM.getValue( "compact", false ).then(value => {
              if(value == true){
                  GM.setValue("compact", false);
                  inpCompact.firstChild.checked = false;
                  compacted(false)
                  console.log('Kompaktní režim =', false);
              }else{
                  GM.setValue("compact", true);
                  inpCompact.firstChild.checked = true;
                  compacted(true)
                  console.log('Kompaktní režim =', true);
              }
          });
	  };



    //minimap
     if (scitaciOperaty) {
        let inpMinimap = makeInput("minimapa", "Minimapa", false, [g.navigator.element])
        divSettings.append(makeSettingSpacer());
        divSettings.append(inpMinimap);

 	  inpMinimap.firstChild.onclick = () => {
          GM.getValue( "minimapa", "false" ).then(value => {
              if(value == true){
                  GM.setValue("minimapa", false);
                  inpMinimap.firstChild.checked = false;
                  g.navigator.element.style.display = "none";
                  console.log('Minimapa =', false);
              }else{
                  GM.setValue("minimapa", true);
                  inpMinimap.firstChild.checked = true;
                  g.navigator.element.style.display = "";
                  console.log('Minimapa =', true);
              }
          });
	  };
     };

    //navigation
    let btnPlus10 = makeButtonText('plusTen', '+10 snímků', '+10');
    let btnMinus10 = makeButtonText('minusTen', '-10 snímků', '-10');
    let btnPlus25 = makeButtonText('plus25', '+25 snímků', '+25');
    let btnMinus25 = makeButtonText('minus25', '-25 snímků', '-25');

    $('#next-image').after(btnPlus25);
	  btnPlus25.onclick = () => {
		  g.goToPage(g.currentPage()+25)
	  };

    $('#prev-image').before(btnMinus25);
	  btnMinus25.onclick = () => {
		  g.goToPage(g.currentPage()-25)
	  };

    $('#next-image').after(btnPlus10);
	  btnPlus10.onclick = () => {
		  g.goToPage(g.currentPage()+10)
	  };

    $('#prev-image').before(btnMinus10);
	  btnMinus10.onclick = () => {
		  g.goToPage(g.currentPage()-10)
	  };



    let inpNav10 = makeInput("navigace10", "+/- 10", true, [btnPlus10, btnMinus10])

    divSettings.append(makeSettingSpacer());
    divSettings.append(inpNav10);


	  inpNav10.firstChild.onclick = () => {
          GM.getValue( "navigace10", true ).then(value => {
              if(value == true){
                  GM.setValue("navigace10", false);
                  inpNav10.firstChild.checked = false;
                  btnPlus10.style.display = "none";
                  btnMinus10.style.display = "none";
                  console.log('Rozšířená (10) navigace =', false);
              }else{
                  GM.setValue("navigace10", true);
                  inpNav10.firstChild.checked = true;
                  btnPlus10.style.display = "";
                  btnMinus10.style.display = "";
                  console.log('Rozšířená (10) navigace =', true);
              }
          });
	  };

    let inpNav25 = makeInput("navigace25", "+/- 25", false, [btnPlus25, btnMinus25])

    divSettings.append(makeSettingSpacer());
    divSettings.append(inpNav25);


	  inpNav25.firstChild.onclick = () => {
          GM.getValue( "navigace25", false ).then(value => {
              if(value == true){
                  GM.setValue("navigace25", false);
                  inpNav25.firstChild.checked = false;
                  btnPlus25.style.display = "none";
                  btnMinus25.style.display = "none";
                  console.log('Rozšířená (25) navigace =', false);
              }else{
                  GM.setValue("navigace25", true);
                  inpNav25.firstChild.checked = true;
                  btnPlus25.style.display = "";
                  btnMinus25.style.display = "";
                  console.log('Rozšířená (25) navigace =', true);
              }
          });
	  };

 //reference strip
    let inpStrip = makeInput("reference_strip", "Referenční pás", false )

    divSettings.append(makeSettingSpacer());
    divSettings.append(inpStrip);
GM.getValue( "reference_strip", false ).then(value => {
    inpStrip.firstChild.checked = value;
    if(value){//TRUE
       g.addReferenceStrip();
    }else{//FALSE
       g.removeReferenceStrip();
    };
});

	  inpStrip.firstChild.onclick = () => {
          GM.getValue( "reference_strip", false ).then(value => {
              if(value == true){
                  GM.setValue("reference_strip", false);
                  inpStrip.firstChild.checked = false;
                  g.removeReferenceStrip();
                  console.log('Referenční pás =', false);
              }else{
                  GM.setValue("reference_strip", true);
                  inpStrip.firstChild.checked = true;
                  g.addReferenceStrip();
                  console.log('Referenční pás =', true);
              }
          });
	  };



	// normalize
    $("#full-page").empty().append('<i class="fas fa-expand"></i>');
    $("#step-10-forward").hide();
    $("#step-10-backward").hide();
    $("#plus25").after($("#last-image"));
	if (window.location.href.indexOf("scitacioperaty/digisada/detail") > -1) {
          $('.nav-pills').prepend(`<li class="nav-item">
				        <a class="nav-link" href="https://www.mza.cz/scitacioperaty/digisada/search">
                                            <i class="fas fa-arrow-circle-left"></i> Zpět na vyhledávání
                                        </a>
			            </li>`);
            $("main .container-fluid .row").first().remove();
            $("#zoom-in").empty().append('<i class="fas fa-search-plus"></i>');
            $("#zoom-out").empty().append('<i class="fas fa-search-minus"></i>');
            $("#home").empty().append('<i class="fas fa-home"></i>');
            $("#full-page").empty().append('<i class="fas fa-arrows-alt"></i>');
            $("#prev-image").empty().append('<i class="fas fa-angle-double-left"></i>');
            $("#next-image").empty().append('<i class="fas fa-angle-double-right"></i>');
            $("#full-page").empty().append('<i class="fas fa-expand"></i>');


        	//preserve button
        let btnPreserve = makeButton('preserve', 'Zachovat zoom a polohu', checkPreserveIcon() );
        $("#dezoomify").after(btnPreserve);

        btnPreserve.onclick = () => {
            if (g.preserveViewport == false){
                g.preserveViewport = true
                btnPreserve.firstChild.setAttribute('class','fas fa-lock')
            }else{
                g.preserveViewport = false
                btnPreserve.firstChild.setAttribute('class','fas fa-unlock')
            }
            console.log('Preserve = '+g.preserveViewport)
        };


    }

//});


function makeButton(id, title, icon){
    let btn = document.createElement('a');
    btn.setAttribute('id', id);
	  btn.setAttribute('type','button');
	  btn.setAttribute('class','btn btn-light mr-1');
	  btn.setAttribute('title',title);
	  btn.setAttribute('style','display: inline-block; position: relative;');

    let icn = document.createElement('i');
	  icn.setAttribute('class',icon);

    btn.append(icn);
    return btn;
}

function makeButtonText(id, title, text, ){
    let btn = document.createElement('a');
    btn.setAttribute('id', id);
    btn.setAttribute('type','button');
    btn.setAttribute('class','btn btn-light mr-1');
    btn.setAttribute('title',title);
    btn.setAttribute('style','display: inline-block; position: relative; font-weight:bold;');

    btn.append(text);
    return btn;
}

function makeInput(id, title, def, array=false){
    let div = document.createElement('div');
    div.setAttribute('class','form-check')
    let inp = document.createElement('input');
    inp.setAttribute('class','form-check-input');
    inp.setAttribute('type','checkbox');
    inp.setAttribute('id',id);
    if(array){
    GM.getValue( id, def ).then(value => {
        inp.checked = value;
           for(var i = 0; i < array.length; i++){
               if(value == true){
                   array[i].style.display = "";
               }else{
                   array[i].style.display = "none";
               }
           }
    });
    };
    let lab = document.createElement('label');
    lab.setAttribute('class','form-check-label');
    lab.setAttribute('for',id);
    lab.append(title);

    div.append(inp)
    div.append(lab);
    return div

}


function checkPreserveIcon(){
	if (g.preserveViewport == false){
		return 'fas fa-unlock';
	}else{
		return 'fas fa-lock';
	};
}

function makeSettingSpacer(){
    let spc = document.createElement('div');
	spc.setAttribute('class','px-2');
    spc.append("|")
    return spc
}



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function compacted(bool){
    if(bool){//TRUE
       layoutCompact()
        prepareMySeadragonHeight()
    }else{//FALSE
       layoutNormal()
        prepareSeadragonHeight()
    };

};

function layoutCompact(){
        if(actaPublica){
                  $('.navbar-brand').first().hide();
                  $('#search').attr('title','Vyhledávání').html('<i class="fas fa-search"></i>');
                  $('#matrika-header .nav .navbar-text').hide();
                  $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
                  $('#seadragon-toolbar .form-group .input-group .input-group-prepend').hide()
                  $('footer').removeClass('py-3').addClass('py-2');
                  let backurl = $('#matrika-header ul .mt-1 .nav li:nth-child(4)').children().attr('href')
                   backurl = backurl.split('/').pop()
                  $('#matrika-header .nav').first().prepend( $('#matrika-header ul .mt-1 .nav li:nth-child(4)') )

                  $('#navbarCollapse ul').first().append( $('#matrika-header ul .mt-1').last() )
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').addClass('ml-5 mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Snímky')
            $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick","setTimeout(updateMySeadragonHeight, 1)");
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').addClass('mr-2').removeClass('mr-3').children().addClass('btn-sm').text('Podrobnosti')
                  let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
                  parts = parts.match(/\((.*)\)/);
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').addClass('btn-sm').text('Části '+parts[0])

            $('#matrika-header .nav').first().append(`<li id="date-indexes" class="nav-item pl-3">
					<ul class="nav">
                      <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">N</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+birth+`</span><br>
					    <span class="small font-italic">`+ibirth+`</span>
					  </li>
                      <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">O</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+married+`</span><br>
					    <span class="small font-italic">`+imarried+`</span>
					  </li>
                       <li class="nav-item pt-2 pl-3">
					    <span class="align-middle" style="font-size:1.5rem">Z</span><br>
					  </li>
					  <li class="nav-item pl-2 pr-3" style="min-width: 80px;">
					    <span class="font-weight-bolder">`+died+`</span><br>
					    <span class="small font-italic">`+idied+`</span>
					  </li>
					</ul>
				      </li>`);
            $('#matrika-header .nav:nth-child(2)').hide();
$('#matrika-header .nav .nav-item:nth-child(1) a').attr('href','/actapublica/matrika/'+backurl)

            $('#matrika-pripinacky').removeClass('pt-2').addClass('pt-1')
            $('#matrika-pripinacky button').addClass('btn-sm')
            $('#seadragon-toolbar').removeClass('pt-2 pb-2').addClass('pt-1 pb-1')

        }else if(scitaciOperaty){
                  $('body .navbar-light').hide();
                  $('body nav div').first().removeClass('container-md').addClass('container-fluid');
                  $('body nav').css('border-bottom-width','0px');
                  $('body nav').prepend("<a class='navbar-brand px-2' id='nav-brand' href='https://www.mza.cz/scitacioperaty/' style='color:#0B3152; background-color:white;'>Sčítací operáty</a>");
                  addGlobalStyle('.card-body { padding: 4px ! important; };');
                  $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
                 $('footer').removeClass('py-3').addClass('py-2')
                $('.input-group-prepend').hide()

        };
}


function layoutNormal(){
        if(actaPublica){
                             $('#date-indexes').remove()
            $('#matrika-header .nav:nth-child(2)').show();
                  $('.navbar-brand').first().show();
                  $('#search').attr('title','').html('<i class="fas fa-search"></i>&nbsp;Vyhledávání');
                  $('#matrika-header .nav .navbar-text').show();
                  $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
                  $('#seadragon-toolbar .form-group .input-group .input-group-prepend').show()
                  $('footer').removeClass('py-2').addClass('py-3');

                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').removeClass('ml-5 mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Digitalizované stránky')
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(1)').children().attr("onclick","setTimeout(updateSeadragonHeight, 1)");
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(2)').removeClass('mr-2').addClass('mr-3').children().removeClass('btn-sm').text('Podrobnosti o matrice')
                  let parts = $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').text()
                  parts = parts.match(/\((.*)\)/);
                  $('#navbarCollapse ul .mt-1 .nav li:nth-child(3) a').removeClass('btn-sm').text('Části matriky '+parts[0])
                  $('#matrika-header ul').first().append( $('#navbarCollapse .mt-1') )
$('#matrika-header .nav .mt-1 .nav').append( $('#matrika-header ul li').first() )
                  let backurl = $('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href')
                  backurl = backurl.split('/').pop()
                  $('#matrika-header ul .mt-1 .nav li:nth-child(4) a').attr('href','/actapublica/matrika/'+backurl)
                  $('#matrika-pripinacky').removeClass('pt-1').addClass('pt-2')
                  $('#matrika-pripinacky button').removeClass('btn-sm')
                  $('#seadragon-toolbar').removeClass('pt-1 pb-1').addClass('pt-2 pb-2')

        }else if(scitaciOperaty){
                 $('body .navbar-light').show();
                 $('body nav div').first().removeClass('container-fluid').addClass('container-md');
                 $('body nav').css('border-bottom-width','4px');
                 $('#nav-brand').remove();
                 addGlobalStyle('.card-body { padding: 20px ! important; };');
                 $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
                 $('footer').removeClass('py-2').addClass('py-3')
                $('.input-group-prepend').show()


        };
}

function makeHamburger(){
    let btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary collapsed');
    btn.setAttribute('type','button');
    btn.setAttribute('data-toggle','collapse');
    btn.setAttribute('data-target','#scitaniHeader');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','scitaniHeader');
    btn.setAttribute('title','Zobrazit základní informace o digitalizační sadě');

    let icn = document.createElement('i');
	  icn.setAttribute('class','fas fa-bars');

    btn.append(icn);
    return btn;

}








function updateMySeadragonHeight(round = 1)
{
	if (g.isFullPage()) {
		//fullscreen mode
		return;
	}

	var toolbarHeight = $("#seadragon-toolbar").outerHeight(true);
	if (toolbarHeight == 0 && round <= 8) {
		//asi prepinani tabu, chvilku pockam...
		//console.log("waiting " + round);
		setTimeout(function() { updateMySeadragonHeight(round + 1); }, 50 * round);
	}

	var height = $(window).height() - $("#header").outerHeight(true) - $("#matrika-header").outerHeight(true) - $("#matrika-pripinacky").outerHeight(true) - $("#seadragon-toolbar").outerHeight(true);

/*
	console.log(
		"window: " + $(window).outerHeight(true) +
		", header: " + $("#header").outerHeight(true) +
		", matrika-header: " + $("#matrika-header").outerHeight(true) +
		", matrika-pripinacky: " + $("#matrika-pripinacky").outerHeight(true) +
		", seadragon-toolbar: " + $("#seadragon-toolbar").outerHeight(true) +
		", footer: " + $("#footer").innerHeight());
	console.log("Height: " + height);
*/

	//vyska ale musi byt aspon 200px
	height = Math.max(height, 200);

	$('#openseadragon').css({ 'height': height + 'px' });
}

/**
 * Nastaveni handleru, aby se Vyska SeaDragonu prizpusobovala vysce okna
 */
function prepareMySeadragonHeight()
{
	$(window).resize(updateMySeadragonHeight);
	updateMySeadragonHeight();
}



//injection popover hover

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}


exec(function() {
    $('[data-toggle="popover"]').popover('dispose');
    $('[data-toggle="popover"]').popover({
       trigger:'hover click'
    })
});

$.fn.immediateText = function() {
    return this.contents().not(this.children()).text();
};

var puvodce = $('.table tbody tr:nth-child(4) td:nth-child(2)').first().immediateText().trim()
console.log( $('.table tbody tr:nth-child(4) td:nth-child(2)').first().contents().eq(0).wrap("<a href='https://www.mza.cz/actapublica/matrika/hledani_puvodce?typ_puvodce_id=&search_by_puvodce="+puvodce+"'></a>")  )
