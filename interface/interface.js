var curUser;
var curUserLeader=0;
var mintocwidth=200;  
var minheight=560;
var minwidth=880;
var containerwidth=minwidth;
var minframewidth=300; //for text and images
var minframetextheight=270; //for text and images
var minframeimageheight=230; //for text and images
var minframeheight=270; //for text and images
var url = ENV.base_url; 
var urlstatic = "http://textualcommunities.usask.ca/media/tc/"; 
//    var community="T25";   
//    var community="JDP1";   
var community="BD32";  
//var community="EE";  
var TCid="TCUSask";
var communityID=0;
var communityFont="";
var isCommunityLeader=0;
var editor=null;	
var $iframe=null;
var editorstring="";
//in full application -- set next from params
var docName="";
var pageName="";
var pageKey="";
var pageID=0;
var currentEntity=null;
var currentDocId;
var pwidth=0;
var pheight=0;
var search = location.search.substr(1);
var imageMap = null;
var login = null;
var userId = null;
var currentDate; //store time in secs here
var currentTimer=0;
var startTime;
var timerId;
var editorActive=1;
timerId = setInterval(update, 1000);
//format milliseconds as hh:mm:ss.sss
function msToTime(s) {
  function addZ(n) {
    return (n<10? '0':'') + n;
  }
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
}

function update() {
	if (currentTimer!=0 && editorActive) {
		var currTime = new Date();
		currentTimer+=currTime.getTime()-startTime;
		startTime=currTime.getTime();
		$("#timer").html(msToTime(currentTimer));
	}
}

if ($.cookie('community')) {community=$.cookie('community')} else {
	community="CTP2"; $.cookie('community', 'CTP2', { expires: 365 });}
if ($.cookie('docName')) {docName=$.cookie('docName')} else {
		docName="Hg"; $.cookie('docName', 'Hg', { expires: 365 });}
if ($.cookie('pageName')) {pageName=$.cookie('pageName')} else {
		pageName="1r";  $.cookie('pageName', '1r', { expires: 365 });}

if (search)  {
    var params = search.split('&');
    for (var i=0; i<params.length; i++) {
        var param = params[i].split('=');
        var key = param[0];
        var value = param[1];
        if (key == 'community') {
            community = value;
         }
        if (key == 'login') {
            login = value;
        }
        if (key == 'userId') {
            userId = value;
        }
        if (key == 'docName') {
          docName = value;
           $.cookie('docName', docName, { expires: 365 });
        }
        if (key == 'pageName') {
          pageName = value;
          $.cookie('pageName', pageName, { expires: 365 });
        }
    }

} 

$.cookie('community', community, { expires: 365 });
$.getJSON(url+'communities/?page_size=0&format=json',  function (data) { 
	$.each(data, function(h, thiscommunity){
		if (thiscommunity.abbr==community) {
			communityID=thiscommunity.id};
			$.cookie('communityID', communityID, { expires: 365 });
	});
});

function getCurrentEntity(pid) {
	$.getJSON(url+'entities/'+pid+'/?page_size=0&format=json',function(entity) {
		if (entity.has_parent) {
			$.getJSON(url+'entities/'+pid+'/parent?page_size=0&format=json',function(parent) {
				getCurrentEntity(parent.id) 
			});
		}
		else if (entity.label=="entity") {
			currentEntity=entity.name;
		}
	});
}


function loadTexts (mycommunity) {
	var rootMenu="[";
	var doccount=0;
	$.getJSON(url+'communities/'+communityID+'/docs/?page_size=0&format=json', function (docdata) {
		var numdocs=docdata.length;
		$.each(docdata, function(i, thisdoc) {
			doccount+=1;
			rootMenu+="{title:'"+thisdoc.name+"',isLazy: true, url:'"+thisdoc.id+"',istop:true}";
			if (doccount==numdocs) {
				rootMenu+="]";
				makeTextMenu(rootMenu);
			} else {
				rootMenu+=",";
			}
		});
	});
}
	
	  			//check for default font
                                function getDefaultFont(mycommunity) {
	$.getJSON(url+'communities/?page_size=0&format=json',  function (data) { 
		$.each(data, function(h, thiscommunity){ 
			if (thiscommunity.abbr==mycommunity) {
				var detective = new Detector();
				if (detective.detect(thiscommunity.font)) communityFont=thiscommunity.font;
				else  alert("Transcripts in this community should be viewed with "+thiscommunity.font+". You should add this font to your system. (You will need to reload this viewer)");
				//test -- is it in the system?
			}
		});
	}).error(function(jqXHR, textStatus, errorThrown) {
    /* how can I find the value "page" had in the query? */
    	alert("Error connecting to "+url+". Check your network connections.");
  	});
}

function doThisOne(which) {
	alert(which);
}

function deleteTexts(doc) {
	s
	 $.getJSON(url+'docs/'+doc+'/',function(thisDoc) {
	 	 $.getJSON(url+'docs/'+doc+'/has_text_in',function(thisText) {
		 	 $.ajax({url: url+'texts/'+thisText.id+'/', type: 'delete'})
	 	 });
		 if (thisDoc.has_parts) {
		 	 $.getJSON(url+'docs/'+doc+'/has_parts?page_size=0&format=json',function(thisDocParts) {
		 	 	$.each(thisDocParts, function(i, thisdocPart) {
		 	 		deleteTexts(thisdocPart.id)
		 	 	});
		 	 });
		 }
	});
}






function deleteEntText(ent) {
	$('#dialog-confirm').attr("title", "Remove Entities");	
	$('#dlog-confirm-text').html("Choose <b>OK</b> to have all the selected entity, and all descendants, removed for this community. You will have to regenerate the text entities from the XML if you choose this, by committing each page.");
	$( "#dialog-confirm" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
		"OK": function() {
		  $( this ).dialog( "close" );
		  $.ajax({url: url+'entities/'+ent+'/', type: 'delete'}).done (function (results) {
		  	loadEntities(community, 1);
		  });
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
}


function deleteDoc(doc) {
	$('#dialog-confirm').attr("title", "Remove Document or page");	
	$('#dlog-confirm-text').html("Choose <b>OK</b> to have this document (with all its pages) or this page removed.");
	$( "#dialog-confirm" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
		"OK": function() {
		  $( this ).dialog( "close" );
		  $.ajax({url: url+'docs/'+doc+'/', type: 'delete'}).done (function (results) {
		  	loadPages(community);
            	var texttree=$("#tree").dynatree("getTree")
				texttree.reload();
		  });
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
}

function loadPages (mycommunity) {
		$.getJSON(url+'communities/?page_size=0&format=json',  function (data) { 
			$.each(data, function(h, thiscommunity){ 
				if (thiscommunity.abbr==mycommunity) {
					var rootMenu="[";
					var doccount=0;
					$.getJSON(url+'communities/'+thiscommunity.id+'/docs/?page_size=0&format=json', function (docdata) {
							var numdocs=docdata.length;
							$.each(docdata, function(i, thisdoc) {
							doccount+=1;
							rootMenu+="{title:'"+thisdoc.name+"',isLazy: true, url:'"+thisdoc.id+"'}";
					//		rootMenu+="{title:'"+thisdoc.name+"',isLazy: true, url:'"+thisdoc.id+"'}";
							if (doccount==numdocs) {
								rootMenu+="]";
								makeDMenu(rootMenu);
							} else {rootMenu+=",";}
							});
					});
				}
			});
		});
	}
	
//context: 0 when called from init, 1 when called after deletion or rebuild
function loadEntities (mycommunity, context) {
		$.getJSON(url+'communities/?page_size=0&format=json',  function (data) { 
			$.each(data, function(h, thiscommunity){ 
				if (thiscommunity.abbr==mycommunity) {
					var rootMenu="[";
					var entcount=0;
					$.getJSON(url+'communities/'+thiscommunity.id+'/entities/?page_size=0&format=json', function (entdata) {
							var numents=entdata.length;
							if (numents==0 && context==1) {
								//could be nothing now...
								$("#entitytree").dynatree("getRoot").removeChildren();
	//							$("#entitytree").dynatree("getTree").reload();			
							} else {
								$.each(entdata, function(i, thisent) {
								entcount+=1;
								rootMenu+="{title:'"+thisent.name+"',isLazy: true, url:'"+thisent.id+"'}";
								if (entcount==numents) {
									rootMenu+="]";
									makeEntMenu(rootMenu, context);
								} else {rootMenu+=",";}
							});
						}
					});
				}
			});
		});
	}


//if we have a page -- activate the menu, find and show this page
function doLazyRead (node, editpage) {
			currentDocId=node.data.url;
			if (!node.childList) {
				$.getJSON(url+'docs/'+node.data.url+'/has_parts?page_size=0&format=json',function(thisdoc){
					node.setLazyNodeStatus(DTNodeStatus_Loading);
					var children = "[";
					var pagecount=0;
					 $.each(thisdoc, function(i, pageurl) {
						pagecount+=1;
						children+="{title:'"+pageurl.name+"', label:'"+pageurl.label+"', pageid:'"+pageurl.id+"', url:'"+pageurl.id+"'}";
						if (pagecount==thisdoc.length) {
							children+="]";
							node.setLazyNodeStatus(DTNodeStatus_Ok);
							node.addChild(eval(children));
							if (editpage) {
								node.expand();
								//now find the node for this page
								$.each(node.getChildren(), function(h, thispage) {
									if (thispage.data.title==editpage) {
										imageLoaded=0;
										loadTCDocIdText(thispage.data.pageid, thispage.data.key);
									}
								});
							}
						} else {
							children+=","
						}
				  });
			});
		} else {
			if (editpage) {
					node.expand();
					//now find the node for this page
					$.each(node.getChildren(), function(h, thispage) {
						if (thispage.data.title==editpage) {
							imageLoaded=0;
							loadTCDocIdText(thispage.data.pageid, thispage.data.key);
						}
					});
				}
		}
}

function isLeader(thisUser) {
	$.getJSON(url+'memberships/?page_size=0&format=json', function (userlist) {
		$.each(userlist, function(i, thisuser) {
			if (thisuser.user==thisUser.id && thisuser.community==communityID && (thisuser.role==1 || thisuser.role==2)) {
				isCommunityLeader=1;
			}
		});
	});
}

function setEditorButtons(user) {
	//don't deal with members.  what are they?
	if (user==null) {
		//visitor
		$('.btn.submit, .btn.commit, .btn.save, .btn.checklinks, .btn.makelinks').hide();
	} else {
		var isThisLeader=0;
		$.getJSON(url+'memberships/?page_size=0&format=json', function (userlist) {
		    //check for leadership first -- trumps transcription!
			$.each(userlist, function(i, thisuser) {
				if (thisuser.user==curUser.id && thisuser.community==communityID && (thisuser.role==1 || thisuser.role==2)) {
					//leader or coleader: hide submit button
						$('.btn.submit').hide();
						isThisLeader=1
						isCommunityLeader=1;
				}
				//not found as leader; check as transcriber..
				if (i==userlist.length-1 && !isThisLeader) {
					$.each(userlist, function(j, thisuser) {
						if (thisuser.user==curUser.id) {
							var bill=1;
						}
						if (thisuser.user==curUser.id && thisuser.community==communityID) {
							if (thisuser.role==4 || thisuser.role==3) {
								//transcriber, not a leader in this community
								//check tasks for this page... find the task status for this page for this user. if no tasks, or not assigned, hide buttons
									$('.btn.commit, .btn.checklinks, .btn.makelinks').hide();
									$.getJSON(url+'tasks/?doc='+pageID+'&page_size=0&format=json', function(tasks) {
										if (tasks.length==0) $('.btn.submit, .btn.save, .btn.checklinks, .btn.makelinks').hide();
										var gotit=false;
										$.each(tasks, function(h, task){
											$.getJSON(url+'memberships/'+task.membership+'/?page_size=0&format=json', function(membership) {
												if (membership.user==curUser.id) {
													gotit=true;
													if (task.status>1) 
														$('.btn.submit, .btn.save, .btn.checklinks, .btn.makelinks').hide();
													else $('.btn.submit, .btn.save').show();
												} else if (!gotit) {
													if (h==tasks.length-1) 
														$('.btn.submit, .btn.save, .btn.checklinks, .btn.makelinks').hide();
												}
											});
										});
									}); 
									return;
							 }
						}
					});
				}
			});
		});	
	}
}

function adjustTextSpace() {
	$("#transcriptHeader").width($("#transcriptheader").parent().parent().width());
	setTranscriptHeight();
	if (editor) {
		editor.setSize($("#transcripttext").parent().parent().width()-5, getTranscriptHeight());
		if (communityFont) $(".CodeMirror").css({'font-family':communityFont}); 
		editor.refresh();
	}	else {
		$('#mergely-resizer').height(getTranscriptHeight());
		$('#mergely-resizer').width($("#transcripttext").parent().width());
		$('#compare').mergely('resize');
	}
}


function heightRightWindows(which, value) {
 	if ($('#splitright').attr('name')=="ishorizontal") {
 	 	if (which==0) { //take it out of image window till we hit minheight...
 			var imageHeight=$('#topright').height();
 			if (imageHeight-value>=minframeheight) {
 				$('#topright').height(imageHeight-value);
 				$( "#topright" ).resizable( "option", "maxHeight", $(window).height()-minframeimageheight-50);
 			} else {
 				if (imageHeight!=minframeheight) {
 					value=value-(imageHeight-minframeheight);
 					$('#topright').height(minframeheight);
 				}
 				if ($('#lowerright').height()-value<minframeheight) $('#lowerright').height(minframeheight);
 				else $('#lowerright').height($('#lowerright').height()-value);
 				$( "#topright" ).resizable( "option", "maxHeight", $(window).height()-minframeimageheight-50);
 				adjustTextSpace();
 			}
 		} else {
 			$('#topright').height($('#topright').height()+(value/2));
  			$('#lowerright').height($('#lowerright').height()+(value/2));
 			$( "#topright" ).resizable( "option", "maxHeight", $(window).height()-minframeimageheight-50);
  			adjustTextSpace();
		}
	}
} 


function widthRightWindows(which, value) {
 //which: 0 make it narrow, 1 wider, how much: 
 	if ($('#splitright').attr('name')=="ishorizontal") {
 		if (which==0) { //contracting, take it all out of the image window, until we hit minimum width
 			var imageWidth=$('#topright').width();
 			if ($('#left').is(":visible")) {
				if (imageWidth-value>minframewidth) {
					$('#right').width($('#right').width()-value-4);
					$('#topright').width(imageWidth-value-4); //case 1: just contract both windows
					$('#lowerright').width(imageWidth-value-4); //reset editor width too
					$( "#right" ).css("left", $('#left').width() +8+'px');
	//				$( "#left" ).resizable( "option", "maxWidth", $(window).width()-(minframewidth*2)-36);
				} else { //brought window size to minimum
					$('#right').width(minframewidth+4);
					$('#topright').width(minframewidth); //case 1: just contract both windows
					$('#lowerright').width(minframewidth); //reset editor width too
					$( "#right" ).css("left", $('#left').width() +8+'px');
				}
 			} else {
 				if (imageWidth-value>minwidth) {
					$('#right').width($('#right').width()-value-4);
					$('#topright').width(imageWidth-value-4); //case 1: just contract both windows
					$('#lowerright').width(imageWidth-value-4); //reset editor width too
	//				$( "#left" ).resizable( "option", "maxWidth", $('#right').width()-(minframewidth*2)-36);
				} else { //brought window size to minimum
					$('#right').width(minwidth+4);
					$('#topright').width(minwidth); //case 1: just contract both windows
					$('#lowerright').width(minwidth); //reset editor width too
				}
 			}
 		} else { //grow the windows
 				var imageWidth=$('#topright').width();
 				if ($('#left').is(":visible")) { 
 			 		$('#right').width(imageWidth+value);
 					$('#topright').width(imageWidth+value-8); //case 1: just contract both windows
 					$('#lowerright').width(imageWidth+value-8); //reset editor width too
 					$( "#right" ).css("left", $('#left').width() +8+'px');
 	//				$( "#left" ).resizable( "option", "maxWidth", $(window).width()-(minframewidth*2)-36);
 				} else {
 					$('#right').width(imageWidth+value+6);
 					$('#topright').width(imageWidth+value-2); //case 1: just contract both windows
 					$('#lowerright').width(imageWidth+value-2); //reset editor width too
 					$( "#openpanel" ).css("position", 'absolute');
 					$("#openpanel" ).css("left", 4+'px');
 	//				$( "#right" ).css("position", 'absolute');
					$( "#right" ).css("top", '2px');
					$( "#right" ).css("left", '2px');
 				}
  		}
 	}
 	//adjust min widths of resizables
 	adjustTextSpace();
}

function doSelectPrevious (which) {	
	if ($("#pc"+which).is(':checked')) {
		var entstring="";
		for (var j=1; j<=which; j++) {
			$("#pc"+j).attr("checked", true);
		}
		for (var j=1; j<=$('#pccont').attr('data-n'); j++) {	
			if ($("#pc"+j).is(':checked')) {
				if (entstring!="") entstring+=", ";
				entstring+=$("#tdpc"+j).html();
			}
		}
		$('#prevInfo').html("Continuing text selected: "+entstring);
	} else {
		results=sanityPrevious();
		$('#prevInfo').html("Continuing text selected: "+results.entstring+results.warning);
	}
}

function sanityPrevious() {
	var entstring="";
	var warning="";
	var sanity=true;
	var highestchecked=0;
	var highestunchecked=0;
	var elements=[];
	for (var j=1; j<=$('#pccont').attr('data-n'); j++) {	
		if ($("#pc"+j).is(':checked')) {
			if (entstring!="") entstring+=", ";
			entstring+=$("#tdpc"+j).html();
			var myelement={'prev': $("#pc"+j).attr('title'), 'element':$("#td2pc"+j).attr('data-xml'), 'nval':$("#pc"+j).attr('data-n') };
			elements.push(myelement);
			highestchecked=j;
		} else highestunchecked=j;
	}
	if (highestunchecked>0 && highestchecked>highestunchecked) {
		sanity=false;
		warning="<br/><b>You have chosen to continue a text from a previous page, without continuing all its ancestors.  This is very unusual (but not impossible). Are you sure?</b>";
	}
	return {
		'entstring': entstring,
		'warning': warning,
		'sanity':sanity,
		'elements':elements
	}
}

function getXMLDoc(xmlPage, ms) {
	dlogAlertResize('XML for '+ms, "Fetching the document XML.  This may take a few moments", $(window).height()-100,$(window).width()-300);
	$.getJSON(url+'docs/'+xmlPage+'/xml/', function (xml) {
			xml=xml[0];
			xml=xml.replace(/&/g, "&amp;");
			xml=xml.replace(/</g, "&lt;");
			xml="<pre>"+xml+"</pre>";
			$('#dlog-alert-text').html(xml);
	});
}

function makeDMenu(rootMenu) {
	$("#tree").dynatree({
      children: eval(rootMenu), 
      onActivate: function(node) {
			if ( node.data.pageid) {
				loadTCDocIdText(node.data.pageid, node.data.key);
			}
		},
      onLazyRead: function(node){
      		doLazyRead(node, "")
	    },
	  onRender:  function (node, nodeSpan) {
	  	if (!node.data.pageid) {
			var postImg = document.createElement('img');
			 postImg.setAttribute('src', 'getdocxml.png');
			 postImg.setAttribute('class', node.data.postImageClass);
			 postImg.setAttribute('alt', node.data.postImageAltText);
			 postImg.setAttribute('onClick', 'javascript:getXMLDoc(\'' + node.data.url + '\',\''+node.data.title+'\');');
			 postImg.setAttribute('title', 'Extract the document XML');
			 var finda = 'a:contains("'+node.data.title+'")'
			$(nodeSpan).find(finda).after(postImg);
		}
	  	if (isCommunityLeader) {
				 var postImg = document.createElement('img');
				 postImg.setAttribute('src', 'deletedoc.png');
				 postImg.setAttribute('class', node.data.postImageClass);
				 postImg.setAttribute('alt', node.data.postImageAltText);
				 postImg.setAttribute('onClick', 'javascript:deleteDoc(\'' + node.data.url + '\');');
				 postImg.setAttribute('title', 'This will remove this document (and all its pages) or this page from the database. Be careful!');
				 // the element is then appended to the Anchor tag (title)
				 // using jquery.after.

				 // it works really well, except for IE7.  Working on that now.
				var finda = 'a:contains("'+node.data.title+'")'
				 $(nodeSpan).find(finda).after(postImg);
			 }
		}
		
     });
    var containerheight=$(window).height();
     if (containerheight<minheight) containerheight=minheight;
     $( ".dynatree-container").height(containerheight-96);
     //now
       initTextDtree(docName, pageName);
}

//given a place in a documemt -- work up the doc till you get the page of the document and its name
function calcuateDocPage (docPart ) {
	$.getJSON(url+'docs/'+docPart.id+'/parent?format=json',function(parentPart){
		if (parentPart.depth==1) initTextDtree( parentPart.name, docPart.name);
		else calcuateDocPage (parentPart);
	});
}

function makeTextMenu(rootMenu) {
	$("#texttree").dynatree({
		children: eval(rootMenu),
	  	onActivate: function(node) {
	  		if ( node.data.lineid) {
				var entityText="";
				var numdocs=0;
				$.getJSON(url+'entities/'+node.data.lineid+'/has_text_of/'+node.data.parentid+'?format=json',function(thisdoc){
					var mynum=thisdoc[0].id;
					$.getJSON(url+'texts/'+mynum+'/is_text_in?format=json',function(thispart){
						calcuateDocPage(thispart);
					});
				});
			}
	  	},
	  	onLazyRead: function(node) {
	  		if (node.data.parentid) {
	  			var thisurl=url+'docs/'+node.data.parentid+'/has_entities/'+node.data.url+'/?page_size=0&format=json';
	  			var mydoc=node.data.parentid;
	  		} else {
	  			var thisurl=url+'docs/'+node.data.url+'/has_entities?page_size=0&format=json';
	  			var mydoc=node.data.url;
	  		}
	  			$.getJSON(thisurl,function(thisdoc){
	  			node.setLazyNodeStatus(DTNodeStatus_Loading);
			    var children = "[";
				var pagecount=0;
				if (thisdoc.length!=0) {
					 $.each(thisdoc, function(i, pageurl) {
							pagecount+=1;
							if (pageurl.has_parts) {
								children+="{title:'"+pageurl.name+"', isLazy: true, url:'"+pageurl.id+"', parentid:'"+mydoc+"', istop:false}";
							}  else {
								children+="{title:'"+pageurl.name+"', lineid:'"+pageurl.id+"', parentid:'"+mydoc+"'}";
							}	
							if (pagecount==thisdoc.length) {
								children+="]";
								node.setLazyNodeStatus(DTNodeStatus_Ok);
								node.addChild(eval(children));
							} else {
								children+=",";
							}
					 });
				 } else node.setLazyNodeStatus(DTNodeStatus_Ok);
	  		});
	  	},
	  	onRender:  function (node, nodeSpan) {
			if (node.data.istop) {
				var postImg = document.createElement('img');
				 postImg.setAttribute('src', 'getdocxml.png');
				 postImg.setAttribute('class', node.data.postImageClass);
				 postImg.setAttribute('alt', node.data.postImageAltText);
				 postImg.setAttribute('onClick', 'javascript:getXMLDoc(\'' + node.data.url + '\',\''+node.data.title+'\');');
				 postImg.setAttribute('title', 'Extract the document XML');
				 var finda = 'a:contains("'+node.data.title+'")'
				$(nodeSpan).find(finda).after(postImg);
			}
		}
     });
     var containerheight=$(window).height();
     if (containerheight<minheight) containerheight=minheight;
     $( ".dynatree-container").height(containerheight-34);
}

function makeEntMenu(rootMenu, context) {
	$("#entitytree").dynatree({
      children: eval(rootMenu),
      onActivate: function(node) {
			if ( node.data.lineid) {
				var entityText="";
				var numdocs=0;
				$('#showcollation').attr('src', url + 'regularize/?entity=' + node.data.lineid);
				$('#showcollation').height($('#right').height());
				$('#showcollation')[0].contentWindow.postMessage($('#right').width());
			}
		},
      onLazyRead: function(node){
      		$.getJSON(url+'entities/'+node.data.url+'/has_parts?page_size=0&format=json',function(thisdoc){
			  	node.setLazyNodeStatus(DTNodeStatus_Loading);
			    var children = "[";
				var pagecount=0;
			     $.each(thisdoc, function(i, pageurl) {
						pagecount+=1;
						if (pageurl.has_parts) {
							children+="{title:'"+pageurl.name+"', isLazy: true, url:'"+pageurl.id+"'}";
						}  else {
							children+="{title:'"+pageurl.name+"', lineid:'"+pageurl.id+"'}";
						}	
						if (pagecount==thisdoc.length) {
							children+="]";
							node.setLazyNodeStatus(DTNodeStatus_Ok);
							node.addChild(eval(children));
						} else {
							children+=",";
						}
			     });
	 	    });
	    },
	onRender:  function (node, nodeSpan) {
	  	if (isCommunityLeader) {
				 var postImg = document.createElement('img');
				 postImg.setAttribute('src', 'deleteenttext.png');
				 postImg.setAttribute('class', node.data.postImageClass);
				 postImg.setAttribute('alt', node.data.postImageAltText);
				 if (node.data.url) {postImg.setAttribute('onClick', 'javascript:deleteEntText(\'' + node.data.url + '\');');}
				 else {postImg.setAttribute('onClick', 'javascript:deleteEntText(\'' + node.data.lineid + '\');');}
				 postImg.setAttribute('title', 'This will remove all chosen entities (and their children) in these documents from the database. You will have to recommit each page to regenerate them.');
				 // the element is then appended to the Anchor tag (title)
				 // using jquery.after.

				 // it works really well, except for IE7.  Working on that now.
				var finda = 'a:contains("'+node.data.title+'")'
				 $(nodeSpan).find(finda).after(postImg);
			 }
		}
     });
    var containerheight=$(window).height();
     if (containerheight<minheight) containerheight=minheight;
     $( ".dynatree-container").height(containerheight-80);
     if (context==1) {
     	var texttree=$("#entitytree").dynatree("getTree")
		texttree.reload();
     }
}

function loadTCDocumentText (doctext, pagekey) {
		//set up transcript menus
		//need to put a catch in here, where it seems the event is fired twice (dunno why)
		//fix so &#1234; entities display correctly -- might have to adjust if we ever get different patterns .. eg use $('<div/>').html('&amp;').text() 
		var newtext=doctext.replace(/&([^;]*);/g,  function($0, $1) {
			if ($1=="amp") return ("&amp;")
			else return $('<div/>').html('&'+$1+';').text();
			//return String.fromCharCode(parseInt($1, 10));
		});
		doctext=newtext;
		var tree =$("#tree").dynatree("getTree");
		var pnode=tree.getNodeByKey(pagekey);
/*		if (editor && editor.getValue()!="") {
			if (docName==pnode.getParent().data.title && pageName==pnode.data.title) return; //already got it
		} */
		var tabindex=$("#tabs").tabs('option', 'selected');
		if (tabindex==1) {
			editorstring=doctext;
			$('#tabs').tabs('select', 0);
		} else {
			//could be in mergely...
	//		$( "#transcripttext").height($("#transcripttext").parent().parent().height()-52);
			if (!editor) {
				if ($('#mergely-resizer').length>0) $('#mergely-resizer').remove();
				$('#transcripttext').html('<textarea id="code"></textarea>');
				$( "#transcripttext").height($("#lowerright").height()-$("#transcriptHeader").height()-$("#transcriptcontrols").height());
				editor = CodeMirror.fromTextArea(document.getElementById("code"), {lineWrapping: true, lineNumbers: true});
				if (communityFont) $(".CodeMirror").css({'font-family':communityFont}); 
				editor.setSize($(window).width()-$('#left').width(), $("#transcripttext").height());
				editor.refresh();
			}
			editor.setValue(doctext);
			adjustTextSpace();
			editor.refresh();
		}	
		pnode.activate();
		var activeLi = pnode.li;
		 tabindex=$("#tabs").tabs('option', 'selected');
		 if (tabindex==0) {
		 	if ($('#tree').is(':visible')) {
				$('.dynatree-container').animate({ // animate the scrolling to the node
				  scrollTop: $(activeLi).offset().top - $('.dynatree-container').offset().top + $('.dynatree-container').scrollTop()
				}, 'slow');
			}
		}
		$('#docid').html(pnode.getParent().data.title);
		$('#ptitle').html(pnode.data.title);	
		if ($('#previewdiv').hasClass('ui-dialog-content')) PreviewTranscript();
		prevnode=pnode.getPrevSibling();
		if 	(prevnode) {
			$('#prevpage').html('<a class="pagelink" title="'+prevnode.data.title+'" href="javascript:loadTCDocIdText(\''+prevnode.data.pageid+'\',\''+prevnode.data.key+'\')">&lt;</a>');
		} else $('#prevpage').html("");
		nextnode=pnode.getNextSibling();
		if 	(nextnode) {
			$('#nextpage').html('<a  class="pagelink" title="'+nextnode.data.title+'" href="javascript:loadTCDocIdText(\''+nextnode.data.pageid+'\',\''+nextnode.data.key+'\')">></a>');
		} else $('#nextpage').html(""); 
}

$(function() {
	$( "#tabs" ).tabs({ active: 0 });
	$("#tabs").on("tabsselect", function(e, tab) {
		if (( tab.index==0) && !$('#info').is(':visible')) {
			$("#showcollation").css({'display':'none'});
			$("#info").css({'display':'block'});
			$("#topright").css({'display':'block'});
			$("#lowerright").css({'display':'block'});	
		}
		if (tab.index==1) {
			$("#showcollation").css({'display':'block'});
			$("#info").css({'display':'none'});
			$("#topright").css({'display':'none'});
			$("#lowerright").css({'display':'none'});
		}
    });
});

function initTextDtree(editdoc, editpage) {
	//choose the document, find and initialize the node,then show the text etc for it
	var tree =$("#tree").dynatree("getTree");
	var root=tree.getRoot();
	$.each(root.getChildren(), function(h, thisdoc){ 
		if (thisdoc.data.title==editdoc) {
			doLazyRead (thisdoc, editpage);
		}
	});
}




//really complicated -- keeping this all in place with shifting font sizes
function changeSplitVert(change) {
		var rightWidth=$('#right').width();
		var changeleft=Math.ceil(change/2);
		var changeright=Math.floor(change-changeleft);
		var oldtr=$('#topright').outerWidth();
		var oldlr=$('#lowerright').outerWidth();		
		if (oldtr+changeleft<=minframewidth) {
			var oldtrc=minframewidth-oldtr;
			changeright+=(changeleft-oldtrc);
			changeleft=oldtrc;
		} 
		if (oldlr+changeright<=minframewidth) {
			var oldlrc=minframewidth-oldlr;
			changeleft+=(changeright-oldlrc);
			changeright=oldlrc;
		}
		//maths has to be: if tr+lr is less than 6px less than right, won't float!

/*		while (rightWidth<$('#topright').width()+changeleft+$('#lowerright').width()+changeright+24) {
			if ($('#topright').width()+changeleft>=minframewidth+0.5) changeleft-=0.5;
			if ($('#lowerright').width()+changeright>=minframewidth+0.5) changeright-=0.5;
		} */
		//final adjustment: to keep right edge exactly where we want it
		//set margin as proportion of rightWindow width
		var margin=rightWidth/150;
		if (margin<9) margin=9;
		var adjust=rightWidth-oldtr-oldlr-changeleft-changeright-margin;
		
		if (changeleft>changeright) changeleft+=adjust; else changeright+=adjust;
		$('#topright').width($('#topright').width()+changeleft);
		$('#lowerright').width($('#lowerright').width()+changeright);
}
             
function hideTOC(){
	var leftWidth=$('#left').width();
	$('#left').hide();
	var wholeWidth=$(window).width()-6;
	if (wholeWidth<minwidth) wholeWidth=minwidth;
	$('#right').width(wholeWidth);
	$('#openpanel').show();
	$( "#right" ).css("left", '2px');
	$( "#right" ).css("top", '2px');
//	$( "#right" ).css( "maxWidth",wholeWidth);
	$( "#right" ).css( "float", "left");
	if ($('#splitright').attr('name')=="isvertical") {
//	 	$( "#topright").css( "top", '-45px');
//		$( "#lowerright").css( "top", '-45px');
		$( "#topright" ).resizable( "option", "maxWidth", $(window).width()-(minframewidth)-18);
		changeSplitVert(leftWidth);

		placeLowerRight($('#right').height());

	} else {
		$( "#topright" ).width(wholeWidth-8);
		$( "#lowerright" ).width(wholeWidth-8);
	}
	adjustTextSpace();
	$.cookie("tocvisible", 0, { expires: 365 });
}

var imageLoaded=0;
function loadTCDocIdText(pageid, pagekey) {
    if (!imageLoaded) {
    	//if no image don't try and load it!
    	$.ajax({
			type: 'HEAD',
			url: url+'docs/'+pageid+'/has_image/',
			success: function() {
					// page exists
				var imagecall='<script type="text/javascript">'
					+ 'var $imageMap = $(".image_map");'
					+ 'var options = {zoom: 2 , minZoom: 1, maxZoom: 5};'
					+ 'imageMap = new ImageMap($imageMap[0], '
					+   '"http://textualcommunities.usask.ca/api/docs/'
					+   pageid +'/has_image/", options);<' + '/script>';
				$('#docimage').html(imagecall);
				imageLoaded=1;
			},
			error: function() {
				$('#docimage').html("<div style='position: absolute; top: 50%; left: 48%; transform: translateX(-50%) translateY(-48%);'>No image of this page</div>");
			}
		});
 	}	
 	var tree =$("#tree").dynatree("getTree");
 	var pnode=tree.getNodeByKey(pagekey);
	docName=pnode.getParent().data.title;
	pageName=pnode.data.title;  
	pageKey=pnode.data.key;
	pageID=pnode.data.pageid;
	$.getJSON(url+'docs/'+pageID+'/has_entities?page_size=0&format=json',function(pid) {
		if (pid.length>0) getCurrentEntity(pid[0].id);
	});

	setEditorButtons(curUser);
/*    if (curUser) {
        var $buttons = $('.btn.commit, .btn.submit, .btn.save');
       	setEditorButtons(curUser)
        $.getJSON(
            url + 'users/' + curUser.id + '/can_edit/' + pageid + '/', 
            function(data) {
                if (data.editable) {
                    $buttons.prop('disabled', false);
                } else {
                	$buttons.prop('disabled', true);
                }
            }
        );
    } */
    //this version for getting the current revision:
    //test: is there a revision? if so... show it
    //set up menus for showing revisions, etc
    //not at all sure what cur_rev does. rewrite ignoring for now...
    //instead: check if has_revisions has content; else just load the db
    $.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json',function(thetext) {
		if (thetext.length==0) {
			$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
                $.getJSON(url+'texts/'+hastextin.id+'/xml',function(thetext){
                        $('#transcriptinf').html('No edited versions: as loaded in database');
                        loadTCDocumentText(thetext, pagekey);
                        createTranscriptMenus(pageid, 0, -1).done(function (menus) {
                                        $('#revinf1').html(menus.left);
                                        $('#revinf2').html(menus.right);
                                        setTranscriptHeight();
                        });
                        imageLoaded=0;		
                });
            });
		} else {
         //   currentTranscript=thetext.cur_rev; //but what exactly is cur_rev???
            //if we have several versions -- call up the revision system
            //first, test how many revisions we have; put the latest one in the window
                    $('#transcriptinf').html('Several versions.  Compare with each other, and the database.');
                    loadTCDocumentText(thetext[0].text, pagekey);
                    createTranscriptMenus(pageid, thetext[0].id, -1).done(function (menus) {
                        $('#revinf1').html(menus.left);
                        $('#revinf2').html(menus.right);
                        setTranscriptHeight();
                    });
                    imageLoaded=0;
          }
     });
     //write the cookies! so we can go there again...
     $.getJSON(url + 'docs/' + pageid + '/', function(pageinf) {
     	$.cookie('pageName', pageinf.name, { expires: 365 });
     	$.getJSON(url + 'docs/' + pageid + '/parent/', function(parent) {
     	 	$.cookie('docName', parent.name, { expires: 365 });
     	});
     });
}

function setupMergely(text1, text2) {
//get rid of codemirror instance, if there is one...
	if (editor) {
		var oldeditor=editor.getWrapperElement();
		if (oldeditor.parentNode) {
			oldeditor.parentNode.removeChild(oldeditor);
			editor=null;
		}
	}
//if there is a mergely, just write in new text
	if ($('#mergely-resizer').length>0) {
		if (communityFont) $(".CodeMirror").css({'font-family':communityFont}); 
		$('#compare').mergely('lhs', text1);
		$('#compare').mergely('rhs', text2);
	}
//alter html
	$('#transcripttext').height($('#transcripttext').parent().height()-70)
  	var newtext1=text1.replace(/\t/g, "");
	var newtext2=text2.replace(/\t/g, "");
	var newtext3=newtext1.replace(/  /g, "");
	var newtext4=newtext2.replace(/  /g, "");
	var newtext5=newtext3.replace(/&([^;]*);/g,  function($0, $1) {
			if ($1=="amp") return ("&amp;")
			else return $('<div/>').html('&'+$1+';').text();
		});
	var newtext6=newtext4.replace(/&([^;]*);/g,  function($0, $1) {
			if ($1=="amp") return ("&amp;")
			else return $('<div/>').html('&'+$1+';').text();
		});

	$('#transcripttext').html("<div id=\"mergely-resizer\"><div id=\"compare\"></div></div>");
	$('#mergely-resizer').height($('#transcripttext').height());
		 $('#compare').mergely({
			height: "auto",
			width: "auto",
			cmsettings: { readOnly: false },
			lhs: function(setValue) {
				setValue(newtext5);
			},
			rhs: function(setValue) {
				setValue(newtext6);
			}
		});
}

function getUserInf(user) {
    var userinf={}
    for (var i in users) {
        if (users[i].id==user) {
            userinf.first_name=users[i].first_name;
            userinf.last_name=users[i].last_name;
            return userinf;
        }
    }
    userinf.first_name="Unknown";
    userinf.last_name="Unknown";
    return userinf;
}

var users;
function getUsers() {
	 return $.getJSON(url+'users/?page_size=0&format=json', function(allusers) {
	 	users=allusers;
	 });
}
//left and right will be revision ids for comparison; if 0 then compare to database; if -1 set to none
function createTranscriptMenus (pageid, left, right) {
	//only make these when setting up a new transcript. So set the time to nil now
	var currTime = new Date();
	currentTimer=1;
	startTime=currTime.getTime();
    return $.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
        //do the left first
        var leftMenu='<select id="leftSelTranscript" onchange="javascript:doTranscriptVersions('+pageid+')">';
        for (var i=0; i < versions.length; i++) {
            var userInf=getUserInf(versions[i].user);
            var status="";
            if (versions[i].status==2) status= " [submitted]";
            if (versions[i].status==3) status= " [committed]";
            if (versions[i].status==4) status= " [previousDB]";
            if (versions[i].id!=right) {
                if (versions[i].id==left) {
                    var d = Date.parse(versions[i].create_date);
                    var x= moment(versions[i].create_date).format('LLL');
                    leftMenu+='<option value="'+versions[i].id+'" selected="selected">'+moment(versions[i].create_date).format('MMMM Do YYYY, h:mm:ss a')+': '+userInf.first_name+' '+userInf.last_name+status+'</option>';
                }
                else leftMenu+='<option value="'+versions[i].id+'">'+moment(versions[i].create_date).format('MMMM Do YYYY, h:mm:ss a')+': '+userInf.first_name+' '+userInf.last_name+status+'</option>';
            }
        }
        //append database version
        if (right!=0) {
            if (left==0) leftMenu+='<option value="0" selected="selected">Version in database</option>' 
                else  leftMenu+='<option value="0">Version in database</option>';
        }
        leftMenu+="</select>";
        versions.left=leftMenu;
        //now, let's build the right-hand menu
        var rightMenu='<select  id="rightSelTranscript" onchange="javascript:doTranscriptVersions('+pageid+')">';
        if (right==-1) rightMenu+='<option value="-1"  selected="selected">[Show this version only]</option>';
        else  rightMenu+='<option value="-1">[Nothing]</option>';
        for (var i=0; i < versions.length; i++) {
            var userInf=getUserInf(versions[i].user);
            var status="";
            if (versions[i].status==2) status= " [submitted]";
            if (versions[i].status==3) status= " [committed]";
            if (versions[i].status==4) status= " [previousDB]";
            if (versions[i].id!=left) {
                if (versions[i].id==right) 
                    rightMenu+='<option value="'+versions[i].id+'" selected="selected">'+moment(versions[i].create_date).format('MMMM Do YYYY, h:mm:ss a')+': '+userInf.first_name+' '+userInf.last_name+status+'</option>';
                else rightMenu+='<option value="'+versions[i].id+'">'+moment(versions[i].create_date).format('MMMM Do YYYY, h:mm:ss a')+': '+userInf.first_name+' '+userInf.last_name+status+'</option>';
            }
        }
        if (left!=0) {
            if (right==0) rightMenu+='<option value="0" selected="selected">Version in database</option>' 
                else  rightMenu+='<option value="0">Version in database</option>';
        }
        rightMenu+="</select>";
        versions.right=rightMenu;
        //set values on various save buttons
        if (right==-1) {
            //just one to deal with...
            $('#tcnt1').hide();
            $('#tcnt3').hide();
            $('#tcnt2').show();
            $('#tcnt2').css('width', '100%');
            $('#tcntSave').attr('value', pageid);
        } else {
            //got to set for both left and right
            $('#tcnt1').show();
        $('#tcnt2').width(0);
        $('#tcnt1').css('width', '50%');
        $('#tcnt3').show();
        $('#tcnt1').css('width', '50%');
        $('#tcnt2').hide();		
        $('#tcntSaveLeft').attr('value', pageid);
        $('#tcntSaveLeft').attr('data-version', left);
        $('#tcntSaveRight').attr('value', pageid);
        $('#tcntSaveRight').attr('data-version', right);
        }
    });
}

function getTranscriptHeight() {
	return ($("#lowerright").height()-$("#transcriptHeader").height()-$("#transcriptcontrols").height()-5);
} 
function setTranscriptHeight() {
	$( "#transcripttext").height(getTranscriptHeight());
}

//from the user and the page: identify the task and update its status
function updateTaskStatus(context,pageid, user) {
	//first, find the transcription tasks for this page
	$.getJSON(url+'tasks/?doc='+pageid+'&page_size=0&format=json', function(tasks) {
		//locate each membership. If a leader/or lead transcriber is transcribing there will be no task assigned to a membership. 
		$.each(tasks, function(h, task){
			$.getJSON(url+'memberships/'+task.membership+'/?page_size=0&format=json', function(membership) {
				if (membership.user==user) { //set to in process
					task.status=context;
					return $.post(url+'tasks/'+task.id+'/', task
					).success(function(){	
						setEditorButtons(curUser);
						//redo transcript menus
						$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
							createTranscriptMenus(pageid, versions[0].id, -1).done(function (menus) {
								$('#revinf1').html(menus.left);
								$('#revinf2').html(menus.right);
							});
						});
					}).fail(function(xhr){
						alert(xhr.responseText);
					});
				}
			});
		});
	});
}
//1: not comparing; 2: left compare; 3: right compare; context: we are in process 1 /submitting 2/committing 3
//to eliminate synchronicity problems -- committing etc is all done through callbacks
//use prev field to give transcript status	
function SaveTranscript(which, context) {
	var currTime = new Date();
	currentTimer+=currTime.getTime()-startTime;
	var timeCommit=currentTimer;
	if (which==1) {
		var pageid=$('#tcntSave').attr('value');
		return $.post(url+'docs/'+pageid+'/transcribe/', {
				text: editor.getValue(),
				user: curUser.id,
				status: context,
				spent_time: currentTimer
			}).success(function(result){
				//redo the transcript menus here
				//get the latest revision we have here
				result.success=true;
				$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
						createTranscriptMenus(pageid, versions[0].id, -1).done(function (menus) {
							$('#revinf1').html(menus.left);
							$('#revinf2').html(menus.right);
							setTranscriptHeight();
					});
				});
				//housekeeping: update task status; calculate time spent on the transcription
				if (context==3) { //  commit this one!
					//save existing database as revision; mark with status 4, then commit latest revision to database
					//pull the existing database page and add it to the transcripts
					$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
						$.getJSON(url+'texts/'+hastextin.id+'/xml',function(dbtext){
							return $.post(url+'docs/'+pageid+'/transcribe/', {
								text: dbtext,
								user: curUser.id,
								status: 4,
								spent_time: 0
							}).success(function(result){
								//now write the last revision to the database
								$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
									//have to identify the last committed... might not be first or second version etc
									$.each(versions, function(h, version){ 
										if (version.spent_time==timeCommit && version.status==3) {
											$.post(url+'revision/'+version.id+'/commit/', {
											}).success(function(){
												createTranscriptMenus(pageid, versions[0].id, -1).done(function (menus) {
													$('#revinf1').html(menus.left);
													$('#revinf2').html(menus.right);
													setTranscriptHeight();
												});
												loadTexts (community);
												var texttree=$("#texttree").dynatree("getTree")
												texttree.reload();
												loadEntities(community, 1);
											});
										}
									});
								});
							});
						});
					});
				}	else updateTaskStatus(context,pageid, curUser.id);
				
			}).fail(function(xhr){
					xhr.success=false;
					alert(xhr.responseText);
			});
	} 
	if (which==2) {
		var pageid=$('#tcntSaveLeft').attr('value');
		$.post(url+'docs/'+pageid+'/transcribe/', {
				text: $('#compare').mergely('get', 'lhs'),
				user: curUser.id,
				status: context,
				spent_time: currentTimer
			}).success(function(){
				$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
						createTranscriptMenus(pageid, versions[0].id, $('#tcntSaveRight').attr('data-version')).done(function (menus) {
							$('#revinf1').html(menus.left);
							$('#revinf2').html(menus.right);
							setTranscriptHeight();
					});
				});
				updateTaskStatus(1,pageid, curUser.id);
			}).fail(function(xhr){
					alert(xhr.responseText);
			});
	}
	if (which==3) {
		var pageid=$('#tcntSaveRight').attr('value');
		$.post(url+'docs/'+pageid+'/transcribe/', {
				text: $('#compare').mergely('get', 'rhs'),
				user: curUser.id,
				status: context,
				time_spent: currentTimer
			}).success(function(){
				$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
						createTranscriptMenus(pageid, $('#tcntSaveLeft').attr('data-version'), versions[0].id).done(function (menus) {
							$('#revinf1').html(menus.left);
							$('#revinf2').html(menus.right);
							setTranscriptHeight();
					});
				});
				updateTaskStatus(1,pageid,curUser.id);
			}).fail(function(xhr){
					alert(xhr.responseText);
			});
	}
}

//what to do.. validate; warn no longer available, update status on this task
function SubmitTranscript () {
	//validate it first...
	validateTranscript ().done (function (results) {
		if (!results.success) return;
		else  {
			if (results.errorMessage!="") doPreview(results.errorMessage, 'Preview');
			else {
				$('#dlog-confirm-text').html("Page validates. Press OK to submit this transcript to the transcription leader for approval.  You will not be able to edit this page after submission.");
				$( "#dialog-confirm" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
					"OK": function() {
					  $( this ).dialog( "close" );
						SaveTranscript(1, 2);
					},
					Cancel: function() {
					  $( this ).dialog( "close" );
					}
				  }
				});
			}
		}
	});	
}

function checkInterPageLinks(thispageXML, prevXML, nextXML, prevNode, nextNode) {
	if (prevXML) {//check entities in previous page
		$.getJSON(url+'docs/'+prevNode.data.pageid+'/has_entities/?page_size=0&format=json',function(preventities){
			if (preventities.length==0)  {// no enties. Save the page, write it to the db, updating the task
				SaveTranscript(1, 3);  //context 3 advises -- put this in the database.  
			} else {

			}	
		});
	}
	if (nextXML) {
		//have we got some entities?
		$.getJSON(url+'docs/'+nextNode.data.pageid+'/has_entities/?page_size=0&format=json',function(nextentities){
			if (nextentities.length>0)  {// entities on next page.  Warn to link those
					$('#dialog-alert').attr("title", "Make links between pages");
					$('#dlog-alert-text').html("The next page contains entities which might need linking with this page. Click Check Links on this page, or Make Links on the next page. ");
					$( "#dialog-alert" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
					"OK": function() {$( this ).dialog( "close" );} } });
			}
			SaveTranscript(1, 3);  //context 3 advises -- put this in the database. 
		});
	}
}

function dlogAlert (title, advice, height, width) {
	$('#dialog-alert').attr("title", title);
	$('#dlog-alert-text').html(advice);
	$( "#dialog-alert" ).dialog({resizable: false, height:height, width: width, modal: true, buttons: {
		"OK": function() {$( this ).dialog( "close" );} } 
	});
}

function dlogAlertResize (title, advice, height, width) {
	$('#dialog-alert').attr("title", title);
	$('#dlog-alert-text').html(advice);
	$( "#dialog-alert" ).dialog({resizable: true, height:height, width: width, modal: true});
}



function commitTranscript () {
		validateTranscript ().done (function (results) {
		if (!results.success) return;
		else  {
			if (results.errorMessage!="") doPreview(results.errorMessage, 'Preview');
			else {
				//check -- if this page contains a <pb we cannot handle it
				var thispageXML=editor.getValue();
				if (thispageXML.indexOf("<pb") > -1) {
					$('#dlog-alert-text').html("This transcript contains a &lt;pb> element. Remove this &lt;pb> element before committing to the database. To add a page (&lt;pb>), go to the Documents->Edit page in the Profile. ");
					$( "#dialog-alert" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
						"OK": function() {
							 $( this ).dialog( "close" );
						}
					  }
					});
					return;
				}
				$('#dlog-confirm-text').html("Page validates and may be committed to the database.");
				$( "#dialog-confirm" ).dialog({resizable: false, height:225, width: 500, modal: true, buttons: {
					"OK": function() {
					  $( this ).dialog( "close" );
						SaveTranscript(1,3);
						updateTaskStatus(3, $('#tcntSave').attr('value'), curUser.id);
					},
					Cancel: function() {
					  $( this ).dialog( "close" );
					}
				  }
				});
			}
		}
	});
}



function validateTranscript () {
	//fix needed... if starts <text><front ... append dummy body; or prepend dummy body if it starts <text><back
	var myxml=editor.getValue();
	myxml=myxml.replace('</front></text>', '</front><body><p></p></body></text>');
	myxml=myxml.replace('<text><back>', '<text><body><p></p></body><back>');
	return $.post(url+'communities/'+communityID+'/xmlvalidate/', {
		xml: myxml
	}).success(function(xhr){
		//carry on silently
		xhr.success=true;
		if (xhr.status=="success") {xhr.errorMessage=''}
		else {
			xhr.errorMessage=xhr.error;
		}
	}).fail(function(xhr){
		alert(xhr.responseText);
		xhr.success=false;
	}); 
}

function PreviewTranscript () {
	  validateTranscript ().done (function (results) {
		if (!results.success) return;
		else doPreview(results.errorMessage, 'Preview');
	});
}

function doPreview(errorMessage, title) {
	//make a new window, put the text in it
	//we must be in the editor!!!
	var p=editor.getValue();
	p1=p.replace('<body>','');
	p2=p1.replace('</body>','');
	p3=p2.replace('</text>','');
	p4=p3.replace('<text>','');
	p5=p4.replace(/(\r\n|\n|\r)/gm,"");
	//get the css files
				//if dialogue is visible -- then get its dimensions and use them now
	if (pwidth==0)  {
		pwidth=410;
		pheight=710;
	}
	//changed.  Look for css and js file for the communities.  Only allow one css file (first one found)
	$.getJSON(url+'communities/'+communityID+'/css/?page_size=0&format=json',function(cssinf) {
		//got one? use it!
		if (cssinf.length > 0) {
			var csslink='<link id="csslink" href="'+urlstatic+cssinf[0].css+'" rel="stylesheet" type="text/css"/>\r';
		//	var csslink='<link id="csslink" href="default.css" rel="stylesheet" type="text/css"/>\r';
			//do the same for jscript
			$.getJSON(url+'communities/'+communityID+'/js/?page_size=0&format=json',function(jsinf) {
				if (jsinf.length > 0) {
					var jslink=urlstatic+jsinf[0].js;
		//			var jslink="default.js";
					makePreview(jslink, p5, errorMessage, csslink, title);
				} else {
					$.getJSON(url+'communities/1/js/?page_size=0&format=json',function(jsinf) {
						var jslink=urlstatic+jsinf[0].js;
						makePreview(jslink, p5, errorMessage, csslink, title);
					});
				}
			});
		}
		else {
			//get the default...
			$.getJSON(url+'communities/1/css/?page_size=0&format=json',function(cssinf) {
				var csslink='<link id="csslink" href="'+urlstatic+cssinf[0].css+'" rel="stylesheet" type="text/css"/>\r';
		//		var csslink='<link id="csslink" href="default.css" rel="stylesheet" type="text/css"/>\r';
				//get the js
				$.getJSON(url+'communities/'+communityID+'/js/?page_size=0&format=json',function(jsinf) {
					if (jsinf.length > 0) {
						var jslink=urlstatic+jsinf[0].js;
						makePreview(jslink, p5, errorMessage, csslink, title);
					} else {
						$.getJSON(url+'communities/1/js/?page_size=0&format=json',function(jsinf) {
							var jslink=urlstatic+jsinf[0].js;
							makePreview(jslink, p5, errorMessage, csslink, title);
						});
					}
				});
			});
		}
	});
}

//forced to be brutal as different browsers interpret spaces, margins, etc, all a bit differently
function placeTopRight(rightHeight) {
	var topTR = $("#topright").offset().top;
	var currtop=parseInt($("#topright").css('top'),10);
	var moveTR=6-topTR+currtop;

//	$( "#topright" ).css("top", moveTR+'px');

	if ($("#splitright").attr("name")=="isvertical" )
		$( "#topright" ).height(rightHeight-6);
	else 
		$( "#topright" ).height(rightHeight/2-8);
}


//problem: currtop value is NOT valid for lower right when switching from one vert mode to another
// real simple in vertical: top of lr is same as tr
function placeLowerRight(rightHeight) {
	var topLR = $("#lowerright").offset().top;
	var topTR = $("#topright").offset().top;
	if ($("#splitright").attr("name")=="isvertical" ) {
		//set the top of the LR to zero:
		$( "#lowerright" ).css("top", '0px');
		var rightwidth=$('#right').outerWidth(true);
		topLR = $("#lowerright").offset().top;
		movebTR=topTR-topLR;
		var lrHeight= rightHeight-9;
		$( "#lowerright" ).css("left", '0px');
		var currlr=$("#lowerright").offset().left;
		if ($('#left').is(":visible")) var leftwidth=$('#left').outerWidth();
		else var leftwidth = -3;
		var trw=$("#topright").outerWidth();
		var lrw=$("#lowerright").outerWidth();
		var margin = (rightwidth-$("#topright").width()-$("#lowerright").width());
		$( "#lowerright" ).css("left", (margin*4/5)+leftwidth+$("#topright").outerWidth()-currlr+'px');

	} else {
		var currtop=parseInt($("#lowerright").css('top'),10);
		var bottomTR = $("#topright").offset().top + $("#topright").height();
		//calculate relative position to move
		var movebTR = 5+bottomTR-topLR+currtop;
		var lrHeight=rightHeight-topLR-movebTR-2+currtop;
	}
	$( "#lowerright" ).css("top", movebTR+'px');
	//height of lowerright: leave margin at base
	$( "#lowerright" ).height(lrHeight);
}
    
function makePreview(jslink, p4, errorMessage, csslink, title) {
	if (errorMessage=="") {
		p4=p4.replace(/<head/g, "<h3");
		p4=p4.replace(/<\/head/g, "</h3");
		p4=p4.replace(/<row/g, "<tr");
		p4=p4.replace(/<\/row/g, "</tr");
		p4=p4.replace(/<cell/g, "<td");
		p4=p4.replace(/<\/cell/g, "</td");
	}
	if ($('#previewdiv').hasClass('ui-dialog-content'))  {
		$iframe.remove();
	}  	
//		jslink="default.js";
//		csslink='<link id="csslink" href="default.css" rel="stylesheet" type="text/css"/>\r';
		$iframe = $('<iframe height="'+(pheight-10)+'" width="'+(pwidth-10)+'"></iframe>').load(function(){
			var ifpreview = document.createElement( "div" );
			ifpreview.id = "ifdiv";
			if (csslink!="") $iframe.contents().find('head').append(csslink);
			if (jslink!="") {
				script1=document.createElement('script');
				script1.src="http://code.jquery.com/jquery-1.10.2.min.js";
				script1.type="text/javascript";
				script=document.createElement('script');
				script.src=jslink;
				script.type="text/javascript";
		//		$iframe.contents().find('head')[0].appendChild(script1);
				$iframe.contents().find('head')[0].appendChild(script);
		}
			if (communityFont) $iframe.contents().find('body').css({"font-family": communityFont});
			$iframe.contents().find('body')[0].appendChild(ifpreview);
			if (errorMessage!="") {
				$iframe.contents().find('body').html(errorMessage);
				$("#previewdiv").attr("title","XML parse failed");
			}
			else  {
				$iframe.contents().find('body').html(p4);
				$("#previewdiv").attr("title","Preview");
			}
		});
		$( "#previewdiv" ).dialog( "option", "title", title+" "+docName+", "+pageName);
		$('#previewdiv').append($iframe);
		if ($('#previewdiv').hasClass('ui-dialog-content'))  {
			return;
		}
		$( "#previewdiv").dialog({close: function( event, ui ) {}, resize: function( event, ui ) {} });
		$( "#previewdiv" ).on( "dialogclose", function( event, ui ) {
			pwidth=$( "#previewdiv" ).width();
			pheight=$( "#previewdiv" ).height();
			$( "#previewdiv" ).dialog('destroy');
			$('#previewdiv').children().remove();
		} );
		$( "#previewdiv" ).on( "dialogresize", function( event, ui ) {
			$('iframe').height(ui.size.height-10);
			$('iframe').width(ui.size.width-10);
			pheight=ui.size.height;
			pwidth=ui.size.width;
		} );
		$( "#previewdiv" ).dialog( "option", "height", pheight );
		$( "#previewdiv" ).dialog( "option", "width", pwidth );
		return;
}


//compare a transcript to the database version
function compareToDb(pageid, versionid) {
	//get the database version
		$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
				$.getJSON(url+'texts/'+hastextin.id+'/xml',function(dbtext){
					//got db text.  Get the transcript...
					$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
						$.each(versions, function(i, thisrevision) {
							if (thisrevision.id==versionid) {
								var mytext=thisrevision.text;
								createTranscriptMenus(pageid, 0, versionid).done(function (menus) {
									$('#revinf1').html(menus.left);
									$('#revinf2').html(menus.right);
									setupMergely(dbtext, mytext);
									adjustTextSpace();
								});
							}
						});
					});
				});
		});
}

//we don't use it now -- leave it as one day it might help!
function loadTCDocPartText(thisurl, mycommunity, document, documentpath) {
	//get the community first
	$.getJSON(thisurl+'communities/?format=json',  function (data) { 
			$.each(data.results, function(h, thiscommunity){ 
				if (thiscommunity.name==mycommunity) {
					//get the doc we want
					$.getJSON(url+'communities/'+thiscommunity.id+'/docs/?format=json', function (docdata) {
						$.each(docdata.results, function(i, thisdoc) {
							if (thisdoc.name==document)  {
							//now start looking for the document path
								$.getJSON(url+'docs/'+thisdoc.id+'/has_parts?page_size=0&format=json',function(docpages){
									
									 $.each(docpages, function(i, thispage) {
									 	var this_path=thispage.label+"="+thispage.name;
									 	if (this_path==documentpath) {
									 		//got the page -- now chase the trail to get its text...
									 		$.getJSON(url+'docs/'+thispage.id+'/has_text_in?format=json',function(hastextin){
									 			$.getJSON(url+'texts/'+hastextin.id+'/xml',function(thetext){
									 				loadTCDocumentText(thetext, "");
									 			});
											});
										}
									});
								});
							}
						});
					});
				}
			});
	});
}



function doTranscriptVersions(pageid) {
	var leftPage=$("#leftSelTranscript :selected").val();
	var rightPage=$("#rightSelTranscript :selected").val();
	loadTranscripts(pageid, leftPage, rightPage);
}

function loadTranscripts(pageid, leftPage, rightPage) {
	//if rightPage is -1: just load the left 
	if (rightPage==-1) {
		if ($('#mergely-resizer').length>0) {
			$('#mergely-resizer').remove();
			$('#transcripttext').html('<textarea id="code"></textarea>');
			editor = CodeMirror.fromTextArea(document.getElementById("code"), {lineWrapping: true, lineNumbers: true});
			adjustTextSpace();
		}
		if (leftPage==0) {
			//get db
			$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
				$.getJSON(url+'texts/'+hastextin.id+'/xml',function(dbtext) {editor.setValue(dbtext)});
			});
		} else {
			$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
				$.each(versions, function(i, thisrevision) {
					if (thisrevision.id==leftPage) {editor.setValue(thisrevision.text)}
				});
			});
		}
	} else {
		if (leftPage==0) {
			$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
				$.getJSON(url+'texts/'+hastextin.id+'/xml',function(dbtext) {
					//rightpage MUST be a version..
					$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
						$.each(versions, function(i, thisrevision) {
							if (thisrevision.id==rightPage) {
								setupMergely(dbtext, thisrevision.text);
								adjustTextSpace();
							}
						});
					});
				});
			});
		} else {
			//left page: a revision
			$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions) {
				$.each(versions, function(i, thisrevision) {
					if (thisrevision.id==leftPage) {
						//now get the rightpage -- can't be -1
						if (rightPage==0) {
							$.getJSON(url+'docs/'+pageid+'/has_text_in?format=json',function(hastextin){
								$.getJSON(url+'texts/'+hastextin.id+'/xml',function(dbtext) {
									setupMergely(thisrevision.text, dbtext);
									adjustTextSpace();
								});
							});
						} else {
							$.getJSON(url+'docs/'+pageid+'/has_revisions/?page_size=0&format=json', function(versions2) {
								$.each(versions2, function(i, thisrevision2) {
									if (thisrevision2.id==rightPage) {
										setupMergely(thisrevision.text, thisrevision2.text);
										adjustTextSpace();
									}	
								});
							});
						}
					}
				});
			});
		}
	}
	createTranscriptMenus(pageid, leftPage, rightPage).done(function (menus) {
			$('#revinf1').html(menus.left);
			$('#revinf2').html(menus.right);
			setTranscriptHeight();
	});
}

//we are only because on the way down, entity names and labels matched. So if the line checks, everything checks
function checkEntLink(entsarray, thisentity, thispage, pnode, prevMatched, context) {
	$.getJSON(url+'entities/'+thisentity+'/has_docs/'+thispage+'?page_size=0&format=json', function (entplaces) {
		//possibly, we are at too high a level -- might have to go down the parts and dig deeper
		if (entplaces.length==0) {
			return $.getJSON(url+'entities/'+thisentity+'/has_parts?page_size=0&format=json', function (entparts) {
				$.each(entparts, function(i,entpart) {
					var checkEnt=entsarray[entsarray.length-1];
					if (entpart.label==checkEnt.label && entpart.name==checkEnt.n)
				 		checkEntLink(entsarray, entpart.id, thispage, pnode, prevMatched, context);
				 });
			});
		}
		var thisent=entplaces[entplaces.length-1];
		for (i=0; i<entsarray.length; i++) {
			var thisprev=entsarray[i];
			var thisDETref="urn:det:"+TCid+":"+community+":document="+pnode.parent.data.title+":"+pnode.data.label+"="+pnode.data.title+":"+thisent.label+"="+thisent.name+":"+prevMatched+thisprev.label+"="+thisprev.n;
			if (thisDETref==thisprev.prev) thisprev.matched=1;
			prevMatched+=thisprev.label+"="+thisprev.n+":";
		}
		var allMatched=true;
		var message="Links between this page and the previous found: <br/>"
		$.each(entsarray, function(i,obj) {if (obj.matched === 0) { allMatched = false; message="No match found on previous page for:<br/>"+obj.prev; return false;} else {
			if (i>0) message+="<br/>"
			message+=" &lt;"+obj.gi+' n="'+obj.n+'"> on '+pnode.data.label+ ' '+pageName+ ' and on '+pnode.data.label+ ' '+pnode.data.title;
		} });
		if (allMatched) {dlogAlert("Check links succeeded", message, 225, 600); return true;}	
		else  { 
			message+="<br/><br/>Make sure you commit the current transcript before checking links.";
			dlogAlert("Check links error", message, 230, 800); return false;}							
	});
}

//call this recursively until we get as far as we need to go
function descendEntityHierarchy(entity, index, entitiesarray, prevnode, has_parts, prevmatched, context) {
	if (!has_parts) {
		dlogAlert("Check links error", "Error: No children found for &lt;"+entitiesarray[index-1].gi+' n="'+ entitiesarray[index-1].n+'">', 200, 500); return false;
	} else {
		$.getJSON(url+'entities/'+entity+'/has_parts?format=json',function(entparts){
			$.each(entparts, function(i, entity) {
				if (entity.label==entitiesarray[index-1].label && entity.name==entitiesarray[index-1].n) {
				 	if (index==entitiesarray.length) return checkEntLink(entitiesarray, entity.id, prevnode.data.pageid, prevnode, prevmatched, context);
				 	else return descendEntityHierarchy(entity.id, index+1, entitiesarray, prevnode, entity.has_parts, prevmatched, context);
				}  
			});
		});
	}
}

function unLinkPageEls(i, j) {
	for (++i;i<j;i++) {
		var myradio='input[name="link'+i+'"]';
		var thisLink="#unLinkP"+i;
		$(thisLink).attr("checked", "checked")
	}
}

function linkPageEls(i, j) {
	var src_link="#unLinkP"+i;
	for (var k=0;k<i;k++) {
		var myradio='input[name="link'+i+'"]';
		var thisLink="#nLinkP"+k;
		var ischecked=$(thisLink).is(':checked');
		if  (!$(thisLink).is(':checked')) $(myradio).attr("checked", "checked");
	}
}

//now get the entities; find if there is a match between the last entity on the previous page and the first on this page
function chooseContinuingElements(entitiesarray, pageid, prevnode, thisent) {
	//right.  let's get the last line number of the last entity on the page.  Not straightforward!
	$.getJSON(url+'entities/'+thisent+'/has_docs/'+prevnode.data.pageid+'?page_size=0&format=json', function (docparts) {
		//in case we don't have any parts for this one -- go up an entity and do it again...
		if (docparts.length==0) {
			$.getJSON(url+'entities/'+thisent+'/parent?page_size=0&format=json', function (docents) {
				chooseContinuingElements(entitiesarray, pageid, prevnode, docents.id)
			});
		} else {
			var lastlabel=docparts[docparts.length-1].label;
			var lastline=docparts[docparts.length-1].name;
			var xmlsrc =editor.getValue();
			var $xmlDoc=$($.parseXML(xmlsrc));
			//got to be one of these!!! 
			var currEl=$xmlDoc.find('text').children(":first");
	//		if  (currEl.length==0) currEl=$xmlDoc.find('');
	//		if  (currEl.length==0) currEl=$xmlDoc.find('back');
			//does last element on prev page match the first elements on this page?
			var highest_matched=-1;
			var highest_prev=-1;
			var prevEnts="";
			for (var i=0;i<entitiesarray.length; i++) {
				//could be root entity is not in the document; in that case, it must match, just grab from entity array (already calculated for previous page)
				
				if (i==0 && entitiesarray[0].gi=="null" && entitiesarray[0].label=="entity") {
					entityid=':entity='+entitiesarray[0].n;
					//just move all the array up one, as entity cannot be declared in the document in this case
					for  (var j=0;j<entitiesarray.length-1; j++) {
						entitiesarray[j]=entitiesarray[j+1];
					}
					entitiesarray.splice(j, 1);
				} 
				var currEl=currEl.eq(0).find(entitiesarray[i].gi);
				var currEln=currEl.eq(0).attr("n");
				if (currEl.eq(0).is('[prev]')) {var currElprev=currEl.eq(0).attr("prev")} else {var currElprev=null};
	//			var currElprev=currEl.eq(0).attr("prev");
				if (currEln==entitiesarray[i].n) {
					entitiesarray[i].matched=true;
					//if we already have the entity, no need to repeat it!
					if (entitiesarray[0].label=="entity") {var entityid=""}
		//			else entityid=':entity='+currentEntity;
					entitiesarray[i].prevmatch="urn:det:"+TCid+":"+community+":document="+prevnode.parent.data.title+":"+prevnode.data.label+"="+prevnode.data.title+":"+lastlabel+"="+lastline+entityid+":"+prevEnts+entitiesarray[i].label+"="+entitiesarray[i].n;
					prevEnts+=entitiesarray[i].label+"="+entitiesarray[i].n+":";
					if (currElprev) {
						entitiesarray[i].prev=currElprev;
						if (entitiesarray[i].prevmatch==entitiesarray[i].prev) highest_prev=i
					}
					highest_matched=i;
				}
			}
			if (highest_matched==-1) {
				dlogAlert("Make links", 'No links found between this and the previous page (that is: the "n" attributes on elements on the previous and this page do not match, or there are no "n" attributes)', 225, 600);
				return;
			}
			//now make a nice dialogue showing what is going on
			if (entitiesarray.length>1) {var suffix=""} else {var suffix="s"};
			var prevels="<p>The following appear"+suffix+" on "+prevnode.data.label+"s "+prevnode.data.title+" and "+pageName+"<br/>"+"<table style='width:615px; margin: 10px; font-family:"+communityFont+"'>";
			var nmatches=0
			for (var i=0;i<entitiesarray.length; i++) {
				if (entitiesarray[i].matched) {
					prevels+="<tr><td><input n='"+i+"' id='nLinkP"+i+"' onchange='javascript:linkPageEls("+i+", "+entitiesarray.length+")' type='radio' name='link"+i+"' value='link' checked>Link</input></td><td><input n='"+i+"' id='unLinkP"+i+"' onchange='javascript:unLinkPageEls("+i+", "+entitiesarray.length+")' type='radio' name='link"+i+"' value='unlink' >Unlink</input></td><td>&lt;"+entitiesarray[i].gi+' n="'+entitiesarray[i].n+'"></td></tr>';
					nmatches++;
				}
			}
			$.getJSON(url+'entities/'+thisent+'/xml/'+prevnode.data.pageid, function (doctext) {
				var doctext2=doctext[0].replace("<lb/>","");
				var $last_txt=$($.parseXML(doctext2)).find(entitiesarray[entitiesarray.length-1].gi);
				var last_txt=stripText(0, 40, $last_txt.eq(0));
				var this_text=stripText(1, 40, currEl.eq(0));
				height=nmatches*25;
				prevels+="</table>";
				prevels+="&lt;"+entitiesarray[highest_matched].gi+' n="'+entitiesarray[highest_matched].n+'"> on '+prevnode.data.label+' '+prevnode.data.title+' ends <font color="red">'+last_txt.trim()+'</font>, continuing on '+prevnode.data.label+' '+pageName+' <font color="red">'+this_text.trim()+'</font><br/>';
				prevels+='Keep <b>Link</b> to have the text flow from page to page. Click <b>Unlink</b> to close these entities on the previous page and reopen them on the next page'
				$('#dialog-alert').attr("title", "Make links between pages");
				$('#dlog-alert-text').html(prevels);
				$( "#dialog-alert" ).dialog({resizable: false, height:275+height, width: 800, modal: true, buttons: {
					"OK": function() {
							var highestLinked=-1;
							for  (var i=0;i<entitiesarray.length; i++) {
								var thisLink="#nLinkP"+i;
								if  ($(thisLink).is(':checked')) highestLinked=i;
							}
							if (highestLinked!=-1) {
								if (highestLinked==highest_prev) {
									$( this ).dialog( "close" );
									dlogAlert ("Link pages advice", "The element or elements you have selected already have valid \"prev\" attributes linking across the pages.", 275+height, 800)
									return;
								} else {
									//check there is nothing separating the prev elements except white space...
									currEl=$xmlDoc.find('text').children(":first");
									var prevGI=currEl.prop('tagName');
									for  (var i=0;i<=highestLinked; i++) {
										//first prev element must be first child of body/front/back
										currEl=currEl.children(":first");
										var thisgi=currEl.prop('tagName');
										var thisN=currEl.attr('n');
										if (thisgi!=entitiesarray[i].gi || thisN!= entitiesarray[i].n) {
											$( this ).dialog( "close" );
											dlogAlert ("Link pages error", "A &lt;"+thisgi+"> element found immediately within a &lt;"+prevGI+"> element, where &lt;"+entitiesarray[i].gi+" n='"+entitiesarray[i].n+"'> was expected. Delete this element, or move it within the last element to be linked.", 275, 800)
											return;
										}
										prevGI=thisgi;
									}
									//here is where we check -- if there is ANYTHING between the elements to hold the prev, we got a problem
									for  (var i=0;i<entitiesarray.length; i++) {
										var matchEl=entitiesarray[i].gi+'[n="'+entitiesarray[i].n+'"]'
										var thisLink="#nLinkP"+i;
										if  ($(thisLink).is(':checked')) {
											$xmlDoc.find(matchEl).eq(0).attr("prev", entitiesarray[i].prevmatch);
										} else { 
											$xmlDoc.find(matchEl).eq(0).removeAttr("prev");
										}
									}
									//write the html to the editor
									//var xmlText = new XMLSerializer().serializeToString($xmlDoc.find("Object").get(0));
									var xmlText = (new XMLSerializer()).serializeToString($xmlDoc.find("text").get(0));
									editor.setValue(xmlText);
									$( this ).dialog( "close" );
									return;
								}
							}
							$( this ).dialog( "close" );
						} 
					} 
				});
			});
		}
	});
} 

function stripText (start, extent, txt) {
	var test=txt.clone().children().remove().end().text();
	if (test=="") test=txt.text();  //might be we lost everything! revert to just text
	if (extent>test.length) extent=test.length;
	if (start) return test.slice(0,extent);
	else return test.slice(test.length-extent, test.length);
}
function digDownPage(entID, entitiesarray, pageid, prevnode) {
	$.getJSON(url+'docs/'+pageid+'/has_entities/'+entID+'?page_size=0&format=json', function (pageentities) {
		if (pageentities.length==0) {
			dlogAlert("Check links error", 'Error: no entry found for entity id "<b>'+entID+'</b>on page id <b>'+pageid+'</b>. Check REST interface at  /docs/'+pageid+'/has_entities/'+entID, 350, 800);
			return;
		}
		$.getJSON(url+'entities/'+pageentities[pageentities.length-1].id+'/has_text_of?page_size=0&format=json', function (penttext) {
			createEntityEntry(penttext[penttext.length-1].element, pageentities[pageentities.length-1], entitiesarray);
		//down the tree we go...
			if (pageentities[pageentities.length-1].has_parts)
				digDownPage(pageentities[pageentities.length-1].id, entitiesarray, prevnode.data.pageid, prevnode);
			else {
				chooseContinuingElements(entitiesarray, pageid, prevnode, pageentities[pageentities.length-1].id);
			}
		});
	});
}

//go up tree loading in entities etc
function walkUpTree(startpageent, thispageent, entitiesarray, prevnode) {
	$.getJSON(url+'entities/'+thispageent.id+'/parent', function (parent) {
		$.getJSON(url+'entities/'+parent.id+'/has_text_of?page_size=0&format=json', function (penttext) {
			if (penttext.length==0) //must be toplevel entity, not bound to a div within the document
				createEntityEntry(null, parent, entitiesarray);
			else createEntityEntry(penttext[penttext.length-1].element, parent, entitiesarray);
			if (parent.has_parent) walkUpTree(startpage, parent, entitiesarray, prevnode); 
			else {
				//flip array order so highest is first
				//now start on down from the startpage .. note we have already got it
				$.getJSON(url+'entities/'+startpageent.id+'/has_text_of?page_size=0&format=json', function (penttext2) {
					createEntityEntry(penttext2[penttext2.length-1].element, startpageent, entitiesarray);
					if (startpageent.has_parts)
							digDownPage(startpageent.id, entitiesarray, prevnode.data.pageid, prevnode);
					else chooseContinuingElements(entitiesarray, prevnode.data.pageid, prevnode, startpageent.id); 
				});
			}
		 });
	});
}

//function: link up this and previous page by identifying cases where 
function makeLinks () {
	// validate it first
	validateTranscript ().done (function (results) {
		if (!results.success) return;
		else  {
			if (results.errorMessage!="") doPreview(results.errorMessage, 'Preview');
			else {
		//get the last elements from the previous page
				var tree =$("#tree").dynatree("getTree");
				var pnode=tree.getNodeByKey(pageKey);
				var prevnode=pnode.getPrevSibling();
				var entitiesarray=new Array();
				if (!validPrevs()) return(false);
				$.getJSON(url+'docs/'+prevnode.data.pageid+'/has_entities?page_size=0&format=json', function (pageentities) {
					if (pageentities.length==0) {
						dlogAlert("Make links error", 'Error: the database entry for the previous page contains no entities to link to. Check the transcription for that page and commit it to the database before proceeding.', 200, 600);
						return false;
					} else {
						//but... we could have a parent.. in which case, we have to go up the tree, get all the entities to the top, then come on down again
						if (pageentities[pageentities.length-1].has_parent) {
							walkUpTree(pageentities[pageentities.length-1], pageentities[pageentities.length-1], entitiesarray, prevnode);
						} else {	
							$.getJSON(url+'entities/'+pageentities[pageentities.length-1].id+'/has_text_of?page_size=0&format=json', function (penttext) {
								//pull the element and attribute out
								createEntityEntry(penttext[penttext.length-1].element, pageentities[pageentities.length-1], entitiesarray);
								//down the tree we go...
								if (pageentities[pageentities.length-1].has_parts)
									digDownPage(pageentities[pageentities.length-1].id, entitiesarray, prevnode.data.pageid, prevnode);
								else chooseContinuingElements(entitiesarray, prevnode.data.pageid, prevnode, pageentities[pageentities.length-1].id); 
							});
						}
					}
				});
			}
		}
	});
}

function createEntityEntry(tt, pageentity, entitiesarray) {
		if (!tt) var elGI=null;
		else var elGI=tt.slice(tt.indexOf("<")+1, tt.indexOf(" "));
		entitiesarray.push(JSON.parse('{"prev":0, "matched":0, "prevmatch":0, "gi":"'+elGI+'", "n":"'+pageentity.name+'", "label":"'+pageentity.label+'"}'));	
}

//identify inconsistencies like:  Devotion=1:**Secton**=meditation 1 AND Devotion=1:**Section**=meditation 1:Para=6
//caused by error in the entities refsdcl, of course. we can pick these up in checkLinks.  But how could we test the whole DB for consistency...???
function validEntityHierarchy(entitiesarray) {
	//if there is only one, and it is an entity -- chuck it back.  You can't have a prev attribute on an entity by definition? well, we aren't going to stand for it...
	//hmm -- might need this 
	if (entitiesarray.length==0) {
		dlogAlert("Check links error", 'Error: No "prev" attributes on any elements. Choose Link Pages first.', 175, 600);
		return false;
	}

/*	if (entitiesarray.length==1 && entitiesarray[0].label=="entity") {
		dlogAlert("Check links error", 'Error: the only prev attribute given is for a top-level entity. You need to link elements lower in the document hierarchy.', 175, 600);
		return false;
	} */
	for (var i = 1; i < entitiesarray.length; i++) {
		//remove last label and name from prev value, and match with previous prev.  If we don't have a match we do have a problem!
		var thisprev=entitiesarray[i].prev;
		var removeprev=":"+entitiesarray[i].label+"="+entitiesarray[i].n;
		thisprev=thisprev.slice(0,thisprev.lastIndexOf(removeprev));
		if (thisprev!=entitiesarray[i-1].prev) {
			//problem Houston! does not match... let's match up 
			for (var j=0, fnd=0; j<thisprev.length && fnd==0; j++) {if (thisprev[j]!=entitiesarray[i-1].prev[j]) fnd=1;}
			var thisprevbit=thisprev.slice(thisprev.lastIndexOf(":", j)+1, thisprev.length);
			var nowprevbit=entitiesarray[i-1].prev.slice(entitiesarray[i-1].prev.lastIndexOf(":", j)+1, entitiesarray[i-1].prev.length);
			dlogAlert("Check links error", 'Error: entity "<b>'+thisprevbit+'</b>" in <br/>"'+entitiesarray[i].prev+'"<br/>does not match entity "<b>'+nowprevbit+'</b>" in <br/>"'+entitiesarray[i-1].prev+'". <br/>This is likely an error in the entities reference declaration involving the label given this entity. You should fix this.', 350, 800);
			return false;
		}
	}
	return true;
}

function makePrevsArray() {
	var entitiesarray=new Array();
	var xmlsrc =editor.getValue();
	var $xmlDoc = $($.parseXML(xmlsrc));
	var prevEls= $xmlDoc.find('[prev]');
	var prevElsArray = [].slice.call(prevEls);
	prevElsArray.forEach(function(index) {
		var elGI=index.localName;
		var nattr;
		var prevattr;
		var indexArray= [].slice.call(index.attributes);
		indexArray.forEach(function (attribute) {
			if (attribute.localName =="n") nattr=attribute.nodeValue;
			if (attribute.localName =="prev") prevattr=attribute.nodeValue;
		});
		var lastlabel=prevattr.slice(prevattr.lastIndexOf(":")+1, prevattr.lastIndexOf("="));
		// add to list of entities to check
		entitiesarray.push(JSON.parse('{"gi":"'+elGI+'", "n":"'+nattr+'", "prev":"'+prevattr+'", "matched":0, "prevmatch":0, "label":"'+lastlabel+'"}'));
	});
	return entitiesarray;
}

function validPrevs() {
	var entitiesarray=new Array();
	entitiesarray=makePrevsArray();
	if (entitiesarray.length>0 && !validEntityHierarchy(entitiesarray)) return false;
	else return true;
}
//look at prev links on this and next page
function checkLinks (context) {
	//do we have prev links on this page?
	validateTranscript ().done (function (results) {
		if (!results.success) return; else  
		{
			if (results.errorMessage!="") doPreview(results.errorMessage, 'Preview');
		else {
			var tree =$("#tree").dynatree("getTree");
			var pnode=tree.getNodeByKey(pageKey);
			var prevnode=pnode.getPrevSibling();
			if (prevnode) {
				//get the XML for the current committed database version; get elements with n and prev attrs.  Note!!! no jQuery, odd javascripty stuff
				//add sanity check: if labels and names don't match on the way down, we have a problem.. better fix it.
				//example: Devotion=1:**Secton**=meditation 1 and Devotion=1:**Section**=meditation 1:Para=6	
				var entitiesarray=new Array();
				entitiesarray=makePrevsArray();
				if (!validEntityHierarchy(entitiesarray)) return;
				//now, check these against previous page...find each entity on previous page, match n and prev values, if they match, perfect
				//so, grab entities from previous page; we need to do this hierarchically.  We are going to figure that only one object continues...
				//way to do this: look for the DEEPEST nested entity on the page. Reason -- this will be on the page. higher level div might begin 
				//pages before, and so NOT be returned by entities/entityid/has_text_of/pageid.  
				//get lowest entity: dig down till we get its id.  So go down the entity trail till we find it
			//	var position = entitiesarray[0].prev.indexOf(":entity:")
				if (entitiesarray[0].prev.indexOf(":", entitiesarray[0].prev.indexOf(":entity=")+1)!=-1) 
					var entName=entitiesarray[0].prev.slice(entitiesarray[0].prev.indexOf(":entity=")+8, entitiesarray[0].prev.indexOf(":", entitiesarray[0].prev.indexOf(":entity=")+1));
				else var entName=entitiesarray[0].prev.slice(entitiesarray[0].prev.indexOf(":entity=")+8, entitiesarray[0].prev.length);
				return $.getJSON(url+'communities/'+communityID+'/entities?page_size=0&format=json',function(entities){ 
					var gotit=false;
					$.each(entities, function(i, entity) {
						if (entity.label=="entity" && entity.name==entName) {
							//might be the only one we are checking...
							var prevmatched="entity="+entName+":";
							if (entitiesarray.length==1) {
							//could be that the entity does NOT correspond to a div within the document -- ie, defined at higher level
								gotit=true;
								if (entitiesarray[0].label=="entity") prevmatched="";  
			//if entity has a gi ... then we add it to the entity chain in prevmatched
								return checkEntLink(entitiesarray, entity.id, prevnode.data.pageid, prevnode, prevmatched, context);
							}  else {//go dig deeper
								gotit=true;
								return descendEntityHierarchy(entity.id, 1, entitiesarray, prevnode, entity.has_parts, prevmatched, context );
							}
						} 
						if (i==entities.length-1 && !gotit) dlogAlert("Check links error", "Error: &lt;"+ entitiesarray[0].gi+' n="'+ entitiesarray[0].n+'"> not found on previous page', 200, 500);
					});
				});
			} else {
				dlogAlert("Check links advice", "No previous page. You can only check links between a page and the previous page", 150, 800);
				return false;
			}
		}	
		}	
	});	
}

//topright: becomes left, lowerright goes to the right

function splitvertical () {
 	if ($('#splitright').attr('name')=="ishorizontal") {
 		$("#splitright").attr("name", "isvertical" );
		$('#split').attr('src', 'splithoriz.png');
 		$('#split').attr('title', 'Image and text above and below');
 		var bodyWidth=$(window).width();
 		if ($('#left').is(':visible')) {
			var leftWidth = $("#left").width();
			var rightWidth=bodyWidth-leftWidth-12;
		}  else {
			var leftWidth = 0;
 			var rightWidth=bodyWidth-leftWidth-6;
 		}
		var rightheight=$('#right').height();
		$("#right").width(rightWidth);
		$("#topright").width(rightWidth/2-8);
		$("#lowerright").width(rightWidth/2-8);
		$("#topright").height(rightheight-9);
//		$("#topright").css({'float':'left'});
//		$("#lowerright").css({'float':'right'});
		changeSplitVert(0);

		placeLowerRight(rightheight);
		adjustTextSpace();
		$( "#topright" ).resizable( "destroy" );
		$( "#topright").resizable({   
			handles: 'e', 
			maxWidth: bodyWidth-leftWidth-minframewidth-36,
			minWidth: minframewidth,
			resize: function(event, ui) {
			ui.size.height = ui.originalSize.height;
			}
		 });
		 $("#topright").off("resize", "");
		 $("#topright").on("resize", function (event, ui) {
			if ($('#left').is(':visible'))
				var leftWidth = $("#left").width();
			else var leftWidth = 0;
			var rightWidth=$("#right").width();
			var bodyWidth=$(window).width();
			var imageWidth=ui.size.width;
			var transcriptWidth=rightWidth-imageWidth-16;
			if (transcriptWidth<minframewidth) {
				transcriptWidth=minframewidth;
				changeSplitVert(0);

				placeLowerRight($("#right").height());

			}
			if (imageWidth<minframewidth) {
				imageWidth=minframewidth;
				changeSplitVert(0);

				placeLowerRight($("#right").height());

			}
			$("#topright").width(imageWidth);
			$("#lowerright").width(transcriptWidth);
			adjustTextSpace();

			changeSplitVert(0);
			placeLowerRight($("#right").height());
			$('#docimage').css( "minWidth", '300px');
			$( "#topright").css( "minWidth", '300px');
			$( "#lowerright" ).css( "minWidth",'300px');
		});
		$.cookie("ishorizontal", "isvertical", { expires: 365 });
	} else {
		$("#splitright").attr("name", "ishorizontal" );
		$('#split').attr('src', 'splitvert.png');
 		$('#split').attr('title', 'Image and text side by side');
		var infdivheight=$("#info").height();
		var rightHeight=$("#right").height();
		placeTopRight(rightHeight);  
 		$("#topright").width($("#right").width()-8);
 		$("#lowerright").width($("#right").width()-8);
		$( "#transcripttext").width($("#transcripttext").parent().width());
//		$("#topright").css({'float':'none'});
// 		$("#lowerright").css({'float':'none'});
		$( "#lowerright" ).css("left", '0px');

		placeLowerRight(rightHeight);
		adjustTextSpace();
		$("#topright").resizable( "destroy");
		$("#topright").resizable({   
			handles: 's', 
			minHeight:minframeimageheight,
    		maxHeight:$(window).height()-minframetextheight-7,
			resize: function(event, ui) {
			ui.size.height = ui.originalSize.height;
			}
		 });
		 $("#topright").off("resize", "");
		 $("#topright").on("resize", function (event, ui) {
			var topHeight = ui.size.height;
			$('#topright').height(topHeight);
			placeLowerRight($(window).height()-8);
			adjustTextSpace();
		});
		$.cookie("ishorizontal", "ishorizontal", { expires: 365 });
	}
	if (imageMap) {
        var map = imageMap.map;
        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    }
}

function showTOC(){
	var wholeWidth=$(window).width()-10;
	$('#left').show();
	var leftwidth=$('#left').width();
	$('#openpanel').hide();
	var newWidth=wholeWidth-leftwidth-4;
	var change=newWidth-$('#right').width();
	$('#right').width(newWidth);
	$( "#right" ).css("left", leftwidth+10+'px');
	$( "#right" ).css("top", '2px');
	$( "#closepanel" ).css("left", (leftwidth - 18)+'px');
	if ($('#splitright').attr('name')=="ishorizontal") {
		$( "#topright" ).width(wholeWidth-12-leftwidth);
		$( "#lowerright" ).width(wholeWidth-12-leftwidth);
	} else {
		//might take either frame below minimum when we restore the size
        changeSplitVert(change);

        placeLowerRight($('#right').height());

	}
	adjustTextSpace();
	$.cookie("tocvisible", 1, { expires: 365 })
}

function togglepageitem() {
	if ($('#tree').is(':visible')) {
		$("#tree").css({'display':'none'});
		$("#texttree").css({'display':'block'});
		$('#byitemb').removeAttr('href');
		$('#bypageb').attr('href','javascript:togglepageitem()');
		$('#bypageb').css({'cursor':'pointer', 'background-color':'#D2D2D2', 'color':'#999'});
		$('#byitemb').css({'cursor':'default', 'background-color':'#999', 'color':'#fff'});
		$('#bypageb').hover(function() {
			  $('#bypageb').css({'background-color':'#BDBDBD', 'color':'#fff'}); 
		   }, 
		   function() {
			   $('#bypageb').css({'background-color':'#D2D2D2', 'color':'#999'})
		   })
		$("#byitemb").off('mouseenter mouseleave');
	} else {
		$("#tree").css({'display':'block'});
		$("#texttree").css({'display':'none'});
		$('#bypageb').removeAttr('href');
		$('#byitemb').attr('href','javascript:togglepageitem()');
		$('#byitemb').css({'cursor':'pointer', 'background-color':'#D2D2D2', 'color':'#999'});
		$('#bypageb').css({'cursor':'default', 'background-color':'#999', 'color':'#fff'});
		$('#byitemb').hover(function() {
			  $('#byitemb').css({'background-color':'#BDBDBD', 'color':'#fff'}); 
		   }, 
		   function() {
			   $('#byitemb').css({'background-color':'#D2D2D2', 'color':'#999'})
		   })
		$('#bypageb').off('mouseenter mouseleave');
	}
}

function init() {
 	editor = CodeMirror.fromTextArea(document.getElementById("code"),{lineWrapping: true, lineNumbers: true});
  	var setWidth1 = $("#left").width();
 	var infdivheight=$("#info").height();
	var leftwidth=$('#left').width();
  	var containerheight=$(window).height()-80;
 	containerwidth=$(window).width();
 	if (containerheight<minheight-80) containerheight=minheight-80;
 	if (containerwidth<minwidth) {
 		containerwidth=minwidth; }
 	var toprightheight=containerheight/2;
 	var lowerrightheight=containerheight/2;
 	var transHdHeight=$('#transcriptHeader').height();
 	var transContHeight=$('#transcriptcontrols').height();
 	$( "#right").width(containerwidth-setWidth1-12);
 	$( "#closepanel").css("left", (setWidth1 - 18)+'px');
     $( "#left").height(containerheight+73);
     $( "#left").resizable({ handles: 'e', minWidth:mintocwidth,
    	maxWidth:300});
    $( "#topright" ).css("position", 'relative');
	$( "#topright" ).css("top", "-"+(infdivheight-3)+'px');
	$( "#docimage").css("top", '-5px');
    $( "#docimage").css("position", 'relative');
 	$( "#topright" ).height(toprightheight+infdivheight/2+30);
 	//got to figure out where top lowerleft, and its height
	$( "#right" ).height(containerheight+73);
	$( "#right").css("left", $( "#left").width()+8+'px');
 	placeLowerRight(containerheight+73);
	$( "#topright").resizable({   
    	handles: 's', 
    	minHeight:minframeimageheight,
    	maxHeight:containerheight-minframetextheight+80,
    	resize: function(event, ui) {
          ui.size.width = ui.originalSize.width;
	}
	 });
    $("#left ").on("resize", function (event, ui) {
            var setWidth = $("#left").width();
            var wholeWidth=$(window).width()-10;
			var newWidth=wholeWidth-setWidth;
			var change=newWidth-$('#right').width();
            $('#right').width(newWidth);
            if ($("#splitright").attr("name")=="isvertical") {
            	changeSplitVert(change);
            } else {
           		 $('#topright').width(newWidth-6);
           		 $('#lowerright').width(newWidth-6);
           	}
            $( "#right" ).css( "left", setWidth+8+'px');
            $( "#closepanel" ).css("left", (setWidth - 18)+'px');
        });
   	 $("#topright").on("resize", function (event, ui) {
       var wholeWidth=$('body').width()-6;
		var topHeight = $("#topright").height();
		var wholeHeight=$("#right").height()-6;
		$('#lowerright').height(wholeHeight-topHeight - 7);
		adjustTextSpace();
 //		$( "#topright").css( "minHeight", '200px');
//		$( "#lowerright" ).css( "minHeight",'200px');
	});

    $(window).resize(function (event) {
 		var wholeWidth=$(window).width()-6;
 		var wholeHeight=$(window).height()-6;
 		if ($('#left').is(":visible"))
 			var origleft=$("#left").width();
 		else var origleft=0;
		var origright=$("#right").width();
		var origheight=$("#right").height();
		if ($('#left').is(':visible')) {
			var origwidth=origleft+origright+7;
		} else {var origwidth=origright+7;}
 		var whichEl =event.target;
 		var topright=$('#topright')[0];
 		if (whichEl==topright) return;
		if ($('#splitright').attr('name')=="ishorizontal") {
			//lots of calculating to do... 
			if (wholeWidth>=origleft+origright) { //window growing horizontally
					widthRightWindows(1, wholeWidth-origleft-origright);
			} else if (wholeWidth<origleft+origright) {  //window shrinking horizontally!
				if (wholeWidth<minwidth) {
					if ($("left").width()+$("right").width() !=minwidth) $("right").width(minwidth-origleft);
					return;
				}
				//steal size from left panel until it reaches min-width (200 px)
				var subtract = (origleft+origright)-wholeWidth;
				if (origleft>0) {
					//cases: 1. subtract by so little as to be able to do this just by contracting the left window
					if (subtract<=origleft - mintocwidth) {
						$('#left').width(origleft-subtract);
						$( "#closepanel" ).css("left", origleft-subtract-18+'px');
					}  else if ( (origleft-subtract)< mintocwidth) { //case 2. we are going down to minwidth. can't make it smaller
						if (origleft>mintocwidth) {  //got a bit to subtract!
							subtract=mintocwidth+subtract-origleft;
							 $('#left').width(mintocwidth);
							 $( "#closepanel" ).css("left", mintocwidth-18+'px');
							 widthRightWindows(0, subtract); //take the rest out of the right window
						} else { // case 3. we are already at minwidth.  just make the windows narrower
							 widthRightWindows(0, subtract);
						}
					} 
				} else {
					widthRightWindows(0, subtract);
				}
			}
		   if (wholeHeight<=origheight)  {//window shrinking vertically, to minimum height and no more
				var subtract=origheight-wholeHeight;
				if (origheight-subtract<minheight) {
					subtract=origheight-minheight; }
				if (subtract>0) {
					heightRightWindows(0, subtract);
					$('#left').height(origheight-subtract);
					$( ".dynatree-container").height(origheight-subtract-86);
					$('#right').height(origheight-subtract);
				}
		   }
		   if (wholeHeight>origheight)  {//window growing vertically
				var incr=wholeHeight-origheight;
				heightRightWindows(1, incr);
				$('#left').height(origheight+incr);
				$( ".dynatree-container").height(origheight+incr-86);
				$('#right').height(origheight+incr);
		   }
		} else { //window is vertically split
			if (wholeHeight>=origheight) { //window growing vertically 
				//do nothing if window is smaller than minheight
				var incr=wholeHeight-origheight;
				$('#left').height($('#left').height()+incr);
				$('#right').height($('#right').height()+incr);
				$('#topright').height($('#topright').height()+incr);
				$('#lowerright').height($('#lowerright').height()+incr);
				$( ".dynatree-container").height(origheight+incr-86);

				placeLowerRight($('#right').height());

			}  
			if (wholeHeight<origheight && wholeHeight>minheight) { //window shrinking vertically 
				var incr=origheight-wholeHeight;
				$('#left').height($('#left').height()-incr);
				$('#right').height($('#right').height()-incr);
				$('#topright').height($('#topright').height()-incr);
				$('#lowerright').height($('#lowerright').height()-incr);
				$( ".dynatree-container").height(origheight-incr-86);

				placeLowerRight($('#right').height());

			} 
			if (wholeWidth>=origwidth) { //window growing horizontally. Ignore tocwindow! 
				var incr=wholeWidth-origwidth;
				$('#right').width(origright+incr);
				changeSplitVert(incr);

				placeLowerRight($('#right').height());

			} 
			if (wholeWidth<origwidth && wholeWidth>minwidth) { //window shrinking horizontally. Ignore tocwindow! 
				var incr=wholeWidth-origwidth;
				$('#right').width(origright+incr);
				changeSplitVert(incr);

				placeLowerRight($('#right').height());

			} 

		}
	adjustTextSpace();
       if ($('#showcollation').is(':visible')) {
        	$('#showcollation').height($('#right').height());
        	$('#showcollation')[0].contentWindow.postMessage($('#right').width());
        }
 });


            $.ajaxSetup({
                error: function(jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        alert('Error for '+this.url+': '+'No connection.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        alert('Error for '+this.url+': '+'Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        alert('Error for '+this.url+': '+'Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        alert('Error for '+this.url+': '+'Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        alert('Error for '+this.url+': '+'Ajax request aborted.');
                    } else {
                        alert('Error for '+this.url+': '+'Uncaught Error.\n' + jqXHR.responseText);
                    }
                }
            });
            getDefaultFont(community);
            getUsers();
            loadPages(community);
            loadTexts(community);
            loadEntities(community, 0);
            if ($.cookie("ishorizontal")) {
				if ($.cookie("ishorizontal")=="ishorizontal") { }
				else {
					splitvertical ();
				}
			} else {
				$.cookie("ishorizontal", "ishorizontal", { expires: 365 });
			}
			if ($.cookie("tocvisible")) {
				if ($.cookie("tocvisible")==0) {
					hideTOC(); }
			} else $.cookie("tocvisible", 1, { expires: 365 }); 

		    	//restore toc, split vert/horizontal
    }
    $(document).ready(function(){
        $('#tcnt1').hide();
        $('#tcnt3').hide();
        var $buttons = $('.btn.commit, .btn.submit, .btn.save');
        $.ajax({
            dataType: "json",
            url: url + 'auth/',
            success: function(user){
         //get csrf token
				var csrftoken = $.cookie('csrftoken');
			   $.ajaxSetup({
				 crossDomain: false,
				 beforeSend: function(xhr, settings) {
				   // these HTTP methods do not require CSRF protection
				   if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type))) {
					 xhr.setRequestHeader("X-CSRFToken", csrftoken);
				   }
				 },
				 dataType: 'json'
			   });
              if (login == 1) {
                $.get(url + 'v1/user/' + user.id + '/?fields=usermapping',
                  function(u){
                    if (parseInt(u.usermapping.mapping_id) != userId) {
                      window.location = url + 'auth/logout/?partner=1&next=' + encodeURIComponent(window.location.href);
                    }
                    curUser = user;
                    isLeader(curUser);
                    if (pageID!=0) setEditorButtons(user);
                    init();
                  }
                );
              } else {
              	//coz /auth returns currently logged in user
                curUser = user;
                isLeader(curUser);
                if (pageID!=0) setEditorButtons(user)
                init();
              }
            },
            error: function() {
                if (login == 1)  {
                    window.location = url + 'auth/login/?partner=1&next=' +
                      encodeURIComponent(window.location.href);
                }else{
  //              	isLeader(curUser); //can't log in, so can't be leader
                	setEditorButtons(null);
//                    $buttons.prop('disabled', true);
                    init();
                }
            }
        });
     $( "#right" ).on( "idle.idleTimer", function(event, elem, obj){
     	var currTime = new Date();
     	editorActive=0;
		currentTimer+=currTime.getTime()-startTime;
		$("#timer").html(msToTime(currentTimer));
	});
	$( "#right"  ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
		//restart the clock. Start it every time we load a new transcript. Save value and restart when we save a transcript
		var currTime = new Date();
		startTime=currTime.getTime();
		editorActive=1;
		$("#timer").html(msToTime(currentTimer));
	});
	$( "#right" ).idleTimer( {
			timeout:10000, 
			events:'mousemove keydown wheel mousewheel mousedown touchstart touchmove MSPointerDown MSPointerMove'
	});
})
 