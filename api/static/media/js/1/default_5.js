//note: due to synchronization problems, include another javascript file in this file using the routine here given

function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

	if (script.readystatechange) { //IE
		script.onreadystatechange = function () {
			if (script.readyState=="loaded" || script.readyState=="complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	 } else { //others
  		 script.onload = function () {
  			 	callback();
   		};
   	}
   // fire the loading
   head.appendChild(script);
}

loadScript("http://code.jquery.com/jquery-1.10.2.min.js", function (){
	prepareMe();
});

 var prepareMe = function(){
 	//if we contain <abbr> or <expan> tags: lets toggle between views
 	var $expan=$('expan[abbr]');
 	var $abbr=$('abbr[expan]');
 	var $am=$('am');
 	var $ex=$('ex');
 	var $sic=$('sic[corr]');
 	var $corr=$('corr[sic]');
 	var $reg=$('reg[orig]');
 	var $orig=$('orig[reg]');
 	var $choice=$('choice');
 	var $app=$('app');
 	var $gap=$('gap');
 	var $unclear=$('unclear');
 	//put everything in a container div, except select div
 	$('body').css({"margin-left":"15px", "margin-right":"18px"});
 	$('body').children().wrapAll('<div id="TCPContainer" style="margin-top: 10px;  padding-top:10px";>');  //this will contain what we are editing -- margin divs go left, right, above, below
 	if ($expan.length || $abbr.length || $sic.length || $corr.length || $reg.length || $orig.length || $choice.length || $am.length || $ex.length) {
 		makeSelectMenu();
 		toggleOrig();
 	}
 	doNotes();
 	doFrame();
 	$('[rend]').each (function (i) {
 		$(this).attr("class", $(this).attr("rend"));
 		$(this).removeAttr("rend");
 	});
 	if ($app.length) {
 		makeAppReadingsMenu();
 		chooseReadings();
 	}
    if ($gap.length) doGaps();
    if ($unclear.length) {
    	$unclear.each (function (i) {
    		$(this).attr("title", "Unclear text");
    	});
    }
    doGaps();
    doBreaks();
    doTables();
	adjustDivs();
 	$(window).resize(function (event) {
//    	adjustDivs();
    });  
 };
 
function doTables() {
		$('tr').each (function (j) {
			$(this).children('td').each(function (k) {
				if ($(this).is("[cols]")) {
					$(this).attr("colspan", $(this).attr("cols"));
					$(this).removeAttr("cols");
				}
				if ($(this).is("[rows]")) {
					$(this).attr("rowspan", $(this).attr("rows"));
					$(this).removeAttr("rows");
				}
			});
		});
}

function doBreaks() {
	var $lb=$('lb');
	$lb.each (function (i) {
		if ($(this).is("[break]"))
			var wbreak=$(this).attr("break");
		else var wbreak="yes";
		if (wbreak=="no") $(this).after('-<br/>');
		else $(this).after('<br/>');
	});
}
 
function doGaps() {
	var $gap=$('gap');
	$gap.each (function (i) {
		if ($(this).is("[unit]"))
			var unit=$(this).attr("unit");
		else var unit="chars";
		if ($(this).is("[quantity]"))
			var quantity=$(this).attr("quantity");
		else var quantity=1;
		var insert="";
		if ((unit=="chars" || unit=="lines") && !isNaN(quantity)) {
			if (unit=="chars") var insertc="&nbsp;";
			else var insertc="&nbsp;&nbsp;&nbsp;&nbsp;<br/>";
			for (var i=0; i<quantity; i++) {
				insert+=insertc
			}
			$(this).attr("title", "Missing text: "+quantity+" "+unit);
			$(this).html(insert);
		}
	});
}
 	
function makeAppReadingsMenu(){
	var rdgs = new Object(); 
	$('app').each (function (i) {
		var titletip="";
		$(this).children('rdg').each (function (j) {
			if (j!=0) titletip+="\n";
			if ($(this).html()=="") titletip+=$(this).attr('type')+": [    ]";
 			else titletip+=$(this).attr('type')+": "+$(this).html();
			if (typeof rdgs[$(this).attr('type')]==='undefined') {
				rdgs[$(this).attr('type')]="";
			}
		});
		$(this).attr('title', titletip);
	});
	var select=document.createElement('select');
	 select.onchange=new Function("chooseReadings()");
	 select.id="selectrdg";
	for (var key in rdgs) {
		 if (rdgs.hasOwnProperty(key)) {
			var option=document.createElement('option');
			option.value=key;
			option.innerHTML="Readings: "+key;
			if (key=="lit") option.selected="selected";
			select.appendChild(option);
		 }
	}
	if ($('#sdiv').length!=0) $('#sdiv').append(select);
	else {
		var selectdiv=document.createElement('div');
	 	selectdiv.id="sdiv";
	 	selectdiv.style.textAlign="center";
		selectdiv.appendChild(select);
		var body=document.getElementsByTagName("body")[0];
    	body.insertBefore(selectdiv, body.firstChild);
	}
}

 function adjustDivs() {
 	//get actual body width...
  	var rightonly=0;
 	var leftonly=0;
 	var leftandright=0;
 	if ($('#TCrm').length!=0 && $('#TClm').length==0) rightonly=1;
 	else if ($('#TClm').length!=0 && $('#TCrm').length==0) leftonly=1;
    else if ($('#TClm').length!=0 && $('#TCrm').length!=0) leftandright=1;
    var origwidth=$('body').width();
    $('body').css({"width":"3000px"});
    $('#TCPContainer').css({"float":"left"});
    var width = $('#TCPContainer').width(); 	
    $('body').css({"width":""});
    //set minwidth...
    var minwidth=width;
    if (rightonly==1) minwidth=width+width/4+10;
    if (leftonly==1) minwidth=width+width/4+10;
    if (leftandright==1) minwidth=width+(width*0.4)+10;
    if (minwidth>1200) minwidth=1200;
    $('body').css({"min-width": minwidth+"px"});
 // 	$('body').width(width);
 	if ($('#TCtm').length!=0) {
 		$('#TCtm').css({"position":"relative", "width":"100%"}) ;
		if ($('#tl').length!=0) $('#tl').css({"left": "0px", "margin-top": "0px", "position" : "absolute", "width":"20%"});
		if ($('#tm').length!=0) $('#tm').css({"position":"absolute", "left": "15%", "margin-top": "0px", "width" : "60%", "text-align": "center"});
		if ($('#tr').length!=0) $('#tr').css({"right": "10%", "position":"absolute",  "margin-top": "0px", "text-align": "right", "width": "20%"});
		//add dummy div here, to clear
		if ($('#TCdummy').length==0)  $('#TCtm').after('<div id="TCdummy" style="clear: both"></div>');
	}
	if ($('#TCbm').length!=0) {
		$('#TCbm').css({"position":"relative", "width":"100%", "margin-top":"20px", "top":"20"}) ;
		if ($('#bl').length!=0) $('#bl').css({"left": "0px", "margin-top": "0px", "position" : "absolute", "width":"20%"});
		if ($('#bm').length!=0) $('#bm').css({"position":"absolute", "left": "15%", "margin-top": "0px", "width" : "60%", "text-align": "center"});
		if ($('#br').length!=0) $('#br').css({"right": "10%", "position":"absolute",  "margin-top": "0px", "text-align": "right", "width": "20%"});
		//add dummy div here, to clear
		if ($('#TCdummy2').length==0)  $('#TCbm').after('<div id="TCdummy2" style="clear: both;">&nbsp;</div>');
	}

 	if ($('#TCrm').length==0 && $('#TClm').length==0) {
 		$('#TCPContainer').css({"margin-left": "15px", "margin-right": "15px"});
 	}
 	if ($('#TCrm').length!=0 && $('#TClm').length==0) { //right only
 		//set up for float..
 		$('#TCPContainer').css({"float":"left", "width":"79%", "margin-left": "5px", "margin-right": "5px"});
 		$('#TCrm').css({"margin-left":"5", "margin-right":"5", "width": "18%", "float": "left"});
  		$('#TCrm').children('note').each(function (i) {
 			var did=$(this).attr('id');		
 			$("[data-id='" + did + "']").show();
 			var dideltop=$("[data-id='" + did + "']").position().top;
 			$("[data-id='" + did + "']").hide();
 			$(this).css({"top": dideltop});
 		});
	}
 	if ($('#TClm').length!=0 && $('#TCrm').length==0) {//left only
 		//set up for float..
  		$('#TCPContainer').css({"float":"left", "width":"79%", "margin-left": "5px", "margin-right": "5px"});
		$('#TClm').css({"margin-left":"5", "margin-right":"5", "width": "18%", "float": "left"});
  		$('#TClm').children('note').each(function (i) {
 			var did=$(this).attr('id');		
 			$("[data-id='" + did + "']").show();
 			var dideltop=$("[data-id='" + did + "']").position().top;
 			$("[data-id='" + did + "']").hide();
 			$(this).css({"top": dideltop});
 		});
 		//adjust top of elements in the div, according 
 	}
 	 if ($('#TClm').length!=0 && $('#TCrm').length!=0) {//left and right
 		//set up for float..
 		$('#TClm').css({"margin-left":"2", "margin-right":"2", "width": "12%", "float": "left"});
	 	$('#TCPContainer').css({"float":"left", "width":"73%", "margin-left": "2px", "margin-right": "2px"});
		$('#TCrm').css({"margin-left":"2", "margin-right":"2", "width": "12%", "float": "left"});
 		 $('#TCrm').children('note').each(function (i) {
 			var did=$(this).attr('id');		
 			$("[data-id='" + did + "']").show();
 			var dideltop=$("[data-id='" + did + "']").position().top;
 			$("[data-id='" + did + "']").hide();
 			$(this).css({"top": dideltop});
 		});
 		 $('#TClm').children('note').each(function (i) {
 			var did=$(this).attr('id');		
 			$("[data-id='" + did + "']").show();
 			var dideltop=$("[data-id='" + did + "']").position().top;
 			$("[data-id='" + did + "']").hide();
 			$(this).css({"top": dideltop});
 		});
 	}
 }
 
 
 function doNotes(){
 	//get div width
 	var notesdiv=document.createElement('div');
	notesdiv.id="TCnotes";
	notesdiv.style.width="100%";
 	notesdiv.style.clear="both";
	$('#TCPContainer').after(notesdiv);
 	var notenum=0;
 	//in older tei: we used rend.  Now, we use place
  	$('note').each (function (i) {
  	// here is the logic.  simple rend=marg or marg-right: put it in the right margin, aligned at same height as original
  		if ($(this).attr('place')=='margin' || $(this).attr('place')=='margin-right' ) {
  			var top=$(this).position().top;
  			if ($('#TCrm').length==0) {
  				rmdiv=document.createElement('div');
  				rmdiv.id="TCrm";
  				rmdiv.style.marginRight="15px";
  				$('#TCPContainer').after(rmdiv);
  			}
			var newnote=document.createElement('note');
			newnote.innerHTML=$(this).html();
			newnote.style.position='absolute';
			newnote.id='TCnote'+i;
			$(this).attr('data-id','TCnote'+i); 
			newnote.style.top=top+'px';
			$('#TCrm').append(newnote);
			$(this).hide();	
  		} else if ($(this).attr('place')=='margin-left') {
  			var top=$(this).position().top;
  			if ($('#TClm').length==0) {
  				lmdiv=document.createElement('div');
  				lmdiv.id="TClm";
  				lmdiv.style.marginLeft="15px";
  				$('#TCPContainer').before(lmdiv);
  			}
			var newnote=document.createElement('note');
			newnote.innerHTML=$(this).html();
			newnote.style.position='absolute';
			newnote.id='TCnote'+i;
			$(this).attr('data-id','TCnote'+i); 
			newnote.style.top=top+'px';
			$('#TClm').append(newnote);
			$(this).hide();	
  		} else if ( $(this).attr('type')=='ed') {
 			notenum+=1;
 			if (notenum=="1") $('#TCnotes').append("<hr/>");
  			var mynote='<a href="#n'+notenum+'">'+notenum+'</a>. '+ $(this).html();
  			if ($(this).attr('resp'))
  				mynote+="&nbsp;("+$(this).attr('resp')+")&nbsp;&nbsp;&nbsp;";
  			$(this).html('<sup id="n'+notenum+'"><a href="#'+notenum+'" title="'+$(this).text()+'">'+notenum+'</a></sup>');
  			var newnote=document.createElement('note');
  			newnote.innerHTML=mynote
  			newnote.id=notenum;
  			$('#TCnotes').append(newnote);
  		} else if ($(this).attr('place')) {
  			var rendval=$(this).attr('place');
  			createTBMNote(rendval, $(this));
   		}
  	});
 }
 
function doFrame() {
	$('fw').each (function (i) {
		var rendval=$(this).attr('place');
		createTBMNote(rendval, $(this));
	});
}

 //deal with top and bottom margins -- including signatures
 function createTBMNote(rendval, thiselement) {
		switch (rendval) {
			 case 'tm': 
			 case 'tl':
			 case 'tr':  
				if ($('#TCtm').length==0) {
					TCtmdiv=document.createElement('div');
					TCtmdiv.id='TCtm';
					TCtmdiv.style.marginTop="10px";
					if ($('#TClm').length!=0) $('#TClm').before(TCtmdiv);
					else $('#TCPContainer').before(TCtmdiv);
					var thisdiv=TCtmdiv;
					break;
				} else var thisdiv=document.getElementById('TCtm');
				break;
			case 'bm': 
			case 'bl':
			case 'br':  
			default: 
				if ($('#TCbm').length==0) {
					TCbmdiv=document.createElement('div');
					TCbmdiv.id='TCbm';
					TCbmdiv.style.clear="both";
					if ($('#TCrm').length!=0) $('#TCrm').after(TCbmdiv);
					else $('#TCPContainer').after(TCbmdiv);
					var thisdiv=TCbmdiv;
					break;
				} else var thisdiv=document.getElementById('TCbm')
		}
	    if ($('#'+rendval).length==0) {
				var innerdiv=document.createElement('div');
				innerdiv.id=rendval;
				thisdiv.appendChild(innerdiv)
			 } else var innerdiv=document.getElementById(rendval);
		var newnote=document.createElement('note');
		if (thiselement.prop("tagName")=="FW") {
			switch (thiselement.attr("type")) {
				case "sig": newnote.title="Signature"; break;
				case "catch": newnote.title="Catchword"; break;
				case "header": newnote.title="Header"; break;
				case "footer": newnote.title="Footer"; break;
				case "pageNum": newnote.title="Page number"; break;
			}
		}
		newnote.innerHTML=" "+thiselement.html();
		innerdiv.appendChild(newnote);
		thiselement.hide();
}

 function makeSelectMenu() {
	 var selectdiv=document.createElement('div');
	 selectdiv.id="sdiv";
	 selectdiv.style.textAlign="center";
	 var select=document.createElement('select');
	 select.onchange=new Function("toggleOrig()");
	 select.id="selectshow";
	 var option1=document.createElement('option');
	 option1.value="original";
	 option1.selected="selected";
	 option1.innerHTML="Diplomatic";
	 select.appendChild(option1);
	var option2=document.createElement('option');
	 option2.value="edited";
	 option2.innerHTML="Edited";
	select.appendChild(option2);
	selectdiv.appendChild(select);
	var btn=document.createTextNode(" ");
	selectdiv.appendChild(btn);
    var body=document.getElementsByTagName("body")[0];
    body.insertBefore(selectdiv, body.firstChild);
 }
 
 function chooseReadings(){
 	var rdgtype=$("#selectrdg").val();
 	$('app').each (function (i) {
 		var foundrdg=false;
 		$(this).children('rdg').each (function (j) {
			if ($(this).attr('type')==rdgtype) {
				$(this).show();
				foundrdg=true;
			} else $(this).hide();
		});
		if (!foundrdg) {
			$(this).children('rdg').each (function (j) {
				if ($(this).attr('type')=='lit') {
					$(this).show();
				} 
			});
		}
 	});
 }
 
 function toggleOrig() {
 	var $expan=$('expan[abbr]');
 	var $abbr=$('abbr[expan]');
 	var $sic=$('sic[corr]');
 	var $corr=$('corr[sic]');
 	var $reg=$('reg[orig]');
 	var $orig=$('orig[reg]');
 	var $choice=$('choice');
 	var $am=$('am');
 	var $ex=$('ex');
 
  if ($("#selectshow").val() =="original") {
  		if ($expan.length) {
				$('expan').each (function (i) {
					$(this).attr('data-orig', $(this).html());
					$(this).html($(this).attr('abbr'));
				});
 		}
  		if ($corr.length) {
				$('corr').each (function (i) {
					$(this).attr('data-orig', $(this).html());
					$(this).html($(this).attr('sic'));
				});
 		}
  		if ($ex.length) {
				$('ex').each (function (i) {
					$(this).hide();
				});
 		}
   		if ($am.length) {
				$('am').each (function (i) {
					$(this).show();
				});
 		}
 		if ($corr.length) {
				$('corr').each (function (i) {
					$(this).attr('data-orig', $(this).html());
					$(this).html($(this).attr('sic'));
				});
 		}
  		if ($reg.length) {
				$('reg').each (function (i) {
					$(this).attr('data-orig', $(this).html());
					$(this).html($(this).attr('orig'));
				});
 		}
 		if ($abbr.length) {
				$('abbr').each (function (i) {
					$(this).html($(this).attr('data-orig'));
				});
 		}
 		if ($sic.length) {
				$('sic').each (function (i) {
					$(this).html($(this).attr('data-orig'));
				});
 		}
 		if ($orig.length) {
				$('orig').each (function (i) {
					$(this).html($(this).attr('data-orig'));
				});
 		}
 		if ($choice.length) {
 				$('choice').each (function (i) {
 					$(this).children().each (function (j) {
 						if ($(this).prop("tagName")=="EXPAN") $(this).hide();
 						if ($(this).prop("tagName")=="ABBR") $(this).show();
 						if ($(this).prop("tagName")=="EX") $(this).hide();
 						if ($(this).prop("tagName")=="AM") $(this).show();
 						if ($(this).prop("tagName")=="SIC") $(this).show();
 						if ($(this).prop("tagName")=="CORR") $(this).hide();
 						if ($(this).prop("tagName")=="REG") $(this).hide();
 						if ($(this).prop("tagName")=="ORIG") $(this).show();
 					});
 				});
 		}
 	} else {
 		$('expan').each (function (i) {
 			$(this).html($(this).attr('data-orig'));
 		});
 		$('corr').each (function (i) {
 			$(this).html($(this).attr('data-orig'));
 		});
  		if ($ex.length) {
				$('ex').each (function (i) {
					$(this).show();
				});
 		}
   		if ($am.length) {
				$('am').each (function (i) {
					$(this).hide();
				});
 		}
 		$('reg').each (function (i) {
 			$(this).html($(this).attr('data-orig'));
 		});
		$('abbr').each (function (i) {
 			$(this).attr('data-orig', $(this).html());
 			$(this).html($(this).attr('expan'));
 		});
		$('sic').each (function (i) {
 			$(this).attr('data-orig', $(this).html());
 			$(this).html($(this).attr('corr'));
 		});
 		$('orig').each (function (i) {
 			$(this).attr('data-orig', $(this).html());
 			$(this).html($(this).attr('reg'));
 		});
 		 if ($choice.length) {
			$('choice').each (function (i) {
				$(this).children().each (function (j) {
					if ($(this).prop("tagName")=="EXPAN") $(this).show();
					if ($(this).prop("tagName")=="ABBR") $(this).hide();
 					if ($(this).prop("tagName")=="EX") $(this).show();
 					if ($(this).prop("tagName")=="AM") $(this).hide();
					if ($(this).prop("tagName")=="SIC") $(this).hide();
					if ($(this).prop("tagName")=="CORR") $(this).show();
					if ($(this).prop("tagName")=="REG") $(this).show();
					if ($(this).prop("tagName")=="ORIG") $(this).hide();
				});
			});
 		}

	}
 }