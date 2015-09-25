//var ENV = {	base_url: 'http://a1c30aad.ngrok.io/',};
var url = ENV.base_url;
var urlstatic = "http://textualcommunities.usask.ca/media/tc/"; 
var allCommunities=[];
var app = angular.module('TCApp', ['ngRoute', 'ngSanitize', 'twygmbh.auto-height']);
var communityID=0;
var myCommunity={};
var doReload=false;
app.config(function($routeProvider) {
	$routeProvider
    .when('/', {
      templateUrl:'TChome.html'
    })
     .when('/community/home/:communityID', {
      controller:'communityController',
      templateUrl:'CommunityHome.html'
    })
     .when('/community/view/:communityID', {
      controller:'communityController',
      templateUrl:'CommunityView.html'
    })
     .when('/community/about/:communityID', {
      controller:'communityController',
      templateUrl:'CommunityStats.html'
    })
    .otherwise({
      redirectTo:'/'
    }); 
});

app.controller('getStatsController',
  function($scope, $routeParams, $http, $window) {
  	if (document.getElementById("editArrow")) {
  		var minel=document.getElementById("Minimize");
  		minel.remove(minel.selectedIndex);
  	}
  //get some stats together!!
	  $http.get(url+'communities/')
			.success(function(data) {
			   allCommunities=data;
			   var thisComm=allCommunities.filter(function (el) {return el.id == $routeParams.communityID});
			   $scope.community=thisComm[0];
			   $http.get(url+'communities/'+$scope.community.id+'/docs') 
					.success(function(docs) {
						 $scope.ndocs=docs.length;
						 var npages=0;
						 var npagestranscribed=0;
						 var ntranscripts=0;
						 docs.forEach(function(index) {
							$http.get(url+'docs/'+index.id+'/has_parts/') 
								.success(function(pages) {
									npages+=pages.length
									$scope.npages=npages;
									pages.forEach(function(thispage) {
										//does the url exist..?
										$http.get(url+'docs/'+thispage.id+'/has_revisions/') 
											.success(function(revisions) {
												if (revisions.length>0) {
													npagestranscribed+=1;
													ntranscripts+=revisions.length;
													$scope.npagestranscribed=npagestranscribed;
													$scope.ntranscripts=ntranscripts;
												}
											});
									}); 
								});
						 }); 
					}); 
			});
 });
 
 app.controller('statsController',
  function($scope, $routeParams, $http, $window) {
  $scope.onViewLoad = makeCommunityHead($routeParams.communityID, 'about', $http) ;
 });


app.controller('editController',
  function($scope, $routeParams, $http, $window) {
  $scope.onViewLoad = makeCommunityHead($routeParams.communityID, 'edit', $http) ;
  if (doReload) $window.location.reload();
  //add arrow icon!
  toggleHead();
  doReload=false;

});


app.controller('homeController',
  function($scope, $routeParams, $http) {
	if (document.getElementById("editArrow")) {
  		var minel=document.getElementById("Minimize");
  		minel.remove(minel.selectedIndex);
  	}
  $scope.onViewLoad = makeCommunityHead($routeParams.communityID, 'home', $http) ;
  doReload=true;
});

app.controller('communityController',
  function($scope, $routeParams, $http, $window) {
    $scope.thisCommunityID=$routeParams.communityID;
     if (allCommunities.length==0) {
		$http.get(url+'communities/')
			.success(function(data) {
				allCommunities=data;
				var thisComm=allCommunities.filter(function (el) {return el.id == $routeParams.communityID});
   				 $scope.community=thisComm[0];
   				 $scope.community.img="CTP2_logo.png";
   				 $scope.editSrc=url+"interface/indexajax.html?community="+ $scope.community.abbr;
			});
	} else {
		 var thisComm=allCommunities.filter(function (el) {return el.id == $routeParams.communityID});
   		 $scope.community=thisComm[0];
   		 $scope.editSrc=url+"interface/indexajax.html?community="+$scope.community.abbr;
   		 $scope.community.img="CTP2_logo.png";
   	}
});

app.controller('loginController', function($scope, $http) {
 	$scope.isLoggedIn=false;
 	$scope.isEdit=false;
	$http.get(url+'auth/')
        .success(function (user) {
           $scope.loggedin=user.username
           $scope.isLoggedIn=true;
          $scope.community={};  //unless we have a community selected? or none?
           $http.get(url+'memberships/')
           	.success(function (data) {
           		var memberships=data.filter(function (el) {return el.user == user.id});
           		//ok, which communities are these?
          	 	if (allCommunities.length==0) {
					$http.get(url+'communities/')
						.success(function(cdata) {
							allCommunities=cdata;
							$scope.mcList=filterComms(memberships,allCommunities);
						});
				} else {
					$scope.mcList=filterComms(memberships,allCommunities);
				}
           	});
        })
        .error(function () {
            $scope.isLoggedIn=false;
        });  
});

app.controller('pcListController', function($scope, $http) {
   	var pcList = this;
   	if (allCommunities.length==0) {
		$http.get(url+'communities/')
			.success(function(data) {
				pcList.communities=data;
				allCommunities=data;
			});
	} else pcList.communities=allCommunities;
});

function filterComms(match1,match2) {
	var merged=[];
	for (var i=0; i<match1.length; i++) {
		for (var j=0; j<match2.length; j++) {
			if (match1[i].community==match2[j].id) {
				//do we already have this community..?
				var exists = merged.filter(function (el) {return el.id == match2[j].id});
				if (exists.length=="0") {
					merged.push(match2[j]); 
				}
			}
		}
	}
	return merged;
}

function makeCommunityHead (id, context, $http) {
	if (allCommunities.length==0) {
		$http.get(url+'communities/')
			.success(function(data) {
				allCommunities=data;
				var thisComm=allCommunities.filter(function (el) {return el.id == id});
   				writeCommHead(id, context, thisComm[0]);
 			});
	} else {
		 var thisComm=allCommunities.filter(function (el) {return el.id == id});
   		 writeCommHead(id, context, thisComm[0]);
   	}
}

function writeCommHead(id, context, myCommunity) {
	if (context=='home')
		var homeLink="<li><a href='/interface/index.html#/community/home/"+id+"' class='selected'>Home</a></li>";
	else 
		var homeLink="<li><a href='/interface/index.html#/community/home/"+id+"'>Home</a></li>";
	if (context=='about')
		var aboutLink="<li><a href='/interface/index.html#/community/about/"+id+"' class='selected'>About</a></li>";	
	else
		var aboutLink="<li><a href='/interface/index.html#/community/about/"+id+"'>About</a></li>";
	if (context=='edit')
		var viewLink="<li><a href='/interface/index.html#/community/view/"+id+"'  class='selected'>View</a></li>";
	else
		var viewLink="<li><a href='/interface/index.html#/community/view/"+id+"'>View</a></li>";
	var wikiLink="<li><a href=''>Wiki</a></li>";
	var blogLink="<li><a href=''>Blog</a></li>";
	var bbLink="<li><a href=''>Bulletin Board</a></li>";
	var manageLink="<li><a href=''>Manage</a></li>";
	document.getElementById("MyCommHead").innerHTML='<nav><ul>'+homeLink+aboutLink+viewLink+blogLink+bbLink+manageLink+'</ul></nav>';
}

function changeCommunity () {
	var communityID=this.attributes['n'].value;
	window.location=url+"interface/index.html#/community/home/"+communityID;
}

function logIn() {
	window.location=url+"admin/login/?next=/interface/index.html";
}

function logOut() {
	window.location=url+"admin/logout/?next=/interface/index.html";
}

function toggleHead() {
	if (!document.getElementById("editArrow")) {
		document.getElementById("Minimize").innerHTML='<a href="javascript:toggleHead();" id="editArrow" title="Hide headers"><img src="arrowsup.png" height="26px" id="arrowImg"></img></a>';
	} else {
		if (document.getElementById("arrowImg").getAttribute("src")=="arrowsup.png") {
			document.getElementById("arrowImg").setAttribute("src", "arrowsdown.png")
			document.getElementById("editArrow").setAttribute("title", "Show headers")
			document.getElementById("TCHead").style.display = 'none';
			document.getElementById("TCHead2").style.display = 'none';
			var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			document.getElementById("editHolder").style.height=height+"px"; 
		}
		else {
			document.getElementById("arrowImg").setAttribute("src", "arrowsup.png");
			document.getElementById("editArrow").setAttribute("title", "Hide headers")
			var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			document.getElementById("editHolder").style.height=height-122+"px"; 
			var isWebkit = 'WebkitAppearance' in document.documentElement.style;
			if (isWebkit) {
				document.getElementById("TCHead").style.display = '-webkit-flex';
				document.getElementById("TCHead2").style.display = '-webkit-flex';
			} else {
				document.getElementById("TCHead").style.display = 'flex';
				document.getElementById("TCHead2").style.display = 'flex';
			}
		}
	}
}

