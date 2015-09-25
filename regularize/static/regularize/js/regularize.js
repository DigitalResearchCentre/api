var API_ENDPOINT = '/'
  , REGULARIZE_URL = API_ENDPOINT + 'regularize/'
;
var env = {
  API_ENDPOINT: API_ENDPOINT,
  REGULARIZE_URL: REGULARIZE_URL,
  COLLATE_URL: REGULARIZE_URL + 'collate/',
};

window.onmessage = function(width) {
  $('body').width(width);
};

var Entity = Backbone.Model.extend({
  urlRoot: env.API_ENDPOINT + 'entities/',
  hasTextOf: function(callback) {
    return $.get(this.url() + '/has_text_of/', callback);
  },
  witnesses: function(callback) {
    return $.get(this.url() + '/witnesses/', callback);
  },
  prev: function(callback) {
    return $.get(this.url() + '/prev/', callback);
  },
  next: function(callback) {
    return $.get(this.url() + '/next/', callback);
  },

  collate: function(callback) {
    var dfd = this.witnesses();
    return $.when(dfd).then(function(witnesses){
      return collate(witnesses, callback);
    });
  }
});

var Text = Backbone.Model.extend({
  urlRoot: env.API_ENDPOINT + 'texts/',
  xml: function(callback) {
    return $.get(this.url() + '/xml/', callback);
  },
});

function toggleInfo() {
  seeWitnesses();
}

function _regularize(witnesses, rules) {
  _.each(witnesses, function(witness){ 
    var content = witness.content;
    if (!witness.orig) {
      witness.orig = content;
    }
    rules = _.sortBy(rules, function(rule) {
      var re = /regularize\((.+), (.+)\)/;
      var match = re.exec(rule.action);
      rule.from = match[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      rule.to = match[2];
      return match[1].length;
    });
    _.each(rules, function(rule){
      var from = $.trim(rule.from) + '(?=( |$))';
      var to = rule.to;
      if (!to || to == 'null') {
        to = '';
      }
      content = content.replace(new RegExp('^'+from, 'g'), to);
      content = content.replace(new RegExp(' '+from, 'g'), ' '+to);
    });
    witness.content = content.replace(/  /g, ' ');
  });
  return witnesses;
}

function collate(witnesses, callback) {
  console.log(witnesses);
  var data = {data: JSON.stringify({
    witnesses: _regularize(witnesses, allRules.rules),
    algorithm: 'dekker',
    joined: true,
    tokenComparator: {type: 'equality'},
    transpositions: true,
  })};

  return $.post(env.COLLATE_URL, data, function(data){
    var table = data.table;
    var alignment = _.map(data.witnesses, function(id){
      return {witness: id, tokens: []};
    });
    data.alignment = alignment;
    _.each(table, function(row, i){
      _.each(row, function(token, j){
        alignment[j].tokens[i] = token.length > 0 ? 
          {t: $.trim(token.join(' '))} : null;
      });
    });
    callback(data);
    seeWitnesses();
  });
}

function recollate()
{  
  isRecollate = true;
  var newWitnesses = buildWitnesses();
  //var newWitnesses = createNewAllTokens();
  isRecollate = false;
  
  $.ajax({
    url: env.REGULARIZE_URL + "postRecollate/",
    dataType: 'json',
    type: 'post',
    async: false,
    data: {data: JSON.stringify(newWitnesses)},
    success: function(data){ }
  });
  
  collate(newWitnesses.witnesses, function(data){
    _.each(data.alignment, function(alignment, i){
      var origAlignment = allTokens.alignment[i];
      if (origAlignment) {
        _.each(alignment.tokens, function(token, j) {
          var origToken = origAlignment.tokens[j];
          if(origToken !== null && token !== null) {
            if(origToken.t == token.t) {
              token.origToken = origToken.origToken;
            }
          }
        });
      }
    });
    allTokens = {alignment: data.alignment};
    if(allTokens.alignment[0] != 'undefined') {
      totalPos = allTokens.alignment[0].tokens.length;
    }

  });
}


function getTokens(callback) {
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;
  entity.witnesses(function(witnesses){
    collate(witnesses, function(data) {
      callback(witnesses, {alignment: data.alignment});
    });
  });
}

$(document).ready(function(){

  allAlign = { alignments: [] };
  newRules = { rules: [] };
  customRules = { rules: [] };
  allRules = { rules: [] };
  var i;
  console.log(ruleSet);
  for(i in ruleSet.ruleSet.rules)
  {
    allRules.rules.push(ruleSet.ruleSet.rules[i]);
  }
  for(i in ruleSet.ruleSet.alignments)
  {
    allAlign.alignments.push(ruleSet.ruleSet.alignments[i]);
    allAlign.alignments[i].isApplied = false;
  }
  getTokens(load);
});

function getBaseTokens() {
  _.each(allAlign.alignments, function(alignment){
    alignment.isApplied = false;
  });
  getTokens(function(witnesses, data){
    _.each(data.alignment, function(alignment, i){
      _.each(alignment.tokens, function(token){
        if (token) {
          _.each(allTokens.alignment[i].tokens, function(oldToken){
            if (oldToken && token.t == oldToken.t) {
              token.origToken = oldToken.origToken;
            }
          });
        }
      });
    });
  });
  return allTokens;
}



function backEntity() {
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;
  entity.prev(function(data){
    window.location.href = env.REGULARIZE_URL + "?entity="+ data.id + "&page=" + returnUrl;
  });
}

function forwardEntity()
{
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;
  entity.next(function(data){
    window.location.href = env.REGULARIZE_URL + "?entity="+ data.id + "&page=" + returnUrl;
  });
}

function returnPage()
{
  window.location.href = 'http://textualcommunities.usask.ca/' + returnUrl;
}

function chooseRuleSet()
{
  var uri = URI()
    , entityId = uri.query(true).entity
  ;
  window.location.href = env.REGULARIZE_URL + 
    "chooseRuleSetsInterface/?entity=" + entityId + "&page=" + returnUrl;
}

function chooseTexts()
{
  window.location.href = env.REGULARIZE_URL + 
    "chooseTextsInterface/?entity=" + entityId +  "&page=" + returnUrl;
}




function load(witnesses, tokens) {
  
  allImages = allImages.replace(/u'/g, '\'');
  allImages = allImages.replace(/'/g, '\"');
  allImages = JSON.parse(allImages);
  //console.log(allImages);
  
  document.information.style.visibility = "hidden";
  document.reg_information.style.visibility ="hidden";
  document.edit_reg.style.visibility = "hidden";
  
  alignOn = false;
  isOriginals = false;
  isRealign = false;
  customAligns = { alignments: [] };
  isCustomAlign = false;
  var i;
  
  contextStruct = { witnesses: [] };
  
  isBuildWitnesses = false;
  isRecollate = false;
  isCustomRules = false;
  autoReg = false;
  distinct = { witnesses: [] };
  
   // add keyboard shortcut
  shortcut.add("Alt+Right", function () {
    addTokenThis();
  });

  shortcut.add("Shift+Right", function () {
    if(!isRealign)
    {
      addTokenTo();
    }
  });

  shortcut.add("Tab", function() {
    if(!isRealign)
    {
      findNextVariant();
    }
  });
  
  shortcut.add("Enter", function() {
    if(!isRealign)
    {
      addRule();
    }
  });
    
  allTokens = tokens;
  origTokens = createNewAllTokens();
  allWitnesses = witnesses;
  totalPos = allTokens.alignment[0].tokens.length;
  
  var temp = urn.split("entity=")[1];
  var entity = temp.split(":", 1)[0];
  var line = temp.split("Line=")[1];
  document.getElementById("title_label").innerHTML = "entity " + entity + ", line " + line;
  document.getElementById("ruleSetNameLabel").innerHTML = ruleSetName + "  ";
  
  if(isAllWitnesses == "True") {
    $('#chooseTextsLabel').text('all ');
  } else {
    content = "";
    $.each(allTokens.alignment, function(index, item){
      content += item.witness + " ";
    });
    
    content += " ";
    
    document.getElementById("chooseTextsLabel").innerHTML = content;
  }
  
  showRegularization();
  regOn = true;

  currentPosition -= 1;
  nextToken();

  var clickCounter = 0;
  $('#regularization_area').click(function(){
    if (isRealign) {
      selectRealignToken();
    }else{
      setTimeout(function(){
        if (clickCounter === 0) {
          selectToken(setRegThis);
        }else {
          clickCounter -= 1;
        }
        if (clickCounter < 0) {
          clickCounter = 0;
        }
      }, 500);
    }
  }).dblclick(function(){
    if (!isRealign) {
      selectToken(setRegTo);
      clickCounter = 2;
    }
  });
}

function selectToken(callback) {
    var content = document.regularization.reg.value;
    var txt = document.regularization.reg;
    var pos = txt.selectionStart;

    var token = findWord(pos, content);

    if(!token || token == "null") {
      alert("Invalid selection");
    } else if(token != "isId") {
      callback(token);
    }
}

function setRealignToken(token) {
  $('#realign_token input[name="token"]').val(token);
}

function getRealignToken() {
  return $('#realign_token input[name="token"]').val();
}



function selectRealignToken() {
  var content = document.regularization.reg.value;
  var txt = document.regularization.reg;
  var pos = txt.selectionStart;
//  if(document.getElementById("move_realign").checked)
//  {
//    document.getElementById("backward_realign").checked = false;
//    document.getElementById("forward_realign").checked = false;
//    document.getElementById("backward_select").style.visibility = "hidden";
//    document.getElementById("forward_select").style.visibility = "hidden";
//  }

  var token = findWord(pos, content);

  if(!token)
  {
    alert("Invalid selection");
  }
  else if(token != "isId")
  {
    setRealignToken(token);
  }
}

function setRegTo(token) {
  $('form[name="regularization"] input[name="reg_to"]').val(token);
}

function setRegThis(token) {
  $('form[name="regularization"] input[name="reg_this"]').val(token);
}
function getRegThis() {
  return $('form[name="regularization"] input[name="reg_this"]').val();
}

function moveToken(to) {
  var regTo = document.regularization.reg_to;
  var regToWhole;
  if (regTo) {
    regToWhole = regTo.value;
  }
  setRegThis('');
  if(!regOn) {
    allTokens = origTokens;
  }

  currentPosition = to;
  
  if(alignOn) {
    applyAlign();
  }
  if (regTo) {
    regTo.value = regToWhole;
  }

  return regularize();
}

function nextToken() {
  if(currentPosition != totalPos - 1) {
    if (moveToken(parseInt(currentPosition) + 1) === null) {
      nextToken();
    }
  }
}

function previousToken() {
  if(currentPosition !== 0) {
    if (moveToken(parseInt(currentPosition) - 1) === null) {
      previousToken();
    }
  }
}


function findWord(pos, content)
{
  //find whitespaces -- find word indexes
  var found = false;
  var endPos = content.slice(pos).indexOf(' ');
  if (endPos === -1) {
    endPos = content.length;
  }else{
    endPos += pos;
  }
  var startPos = content.slice(0, pos).lastIndexOf(' ') + 1;

  var token = content.slice(startPos, endPos);
  token = token.split(" ");
  token = token.join("");
  var origToken = token;
  token = token.split("(")[0];
  if(isOriginals)
  {
    token = token.split(",")[0];
  }

  var notToken = false;
  var isId = false;
  for(var i in allWitnesses.witnesses)
  {
    if(token == allWitnesses.witnesses[i].id)
    {
      informationWindow(allWitnesses.witnesses[i].id);
      isId = true;
      token = "isId";
    }
  }
  
  if(!isId)
  {
    token = origToken;
  }

  if(token == "///" || token === "")
  {
    notToken = true;
  }

  if(notToken)
  {
    return false;
  }
  else
  {
    return token;
  }
}

function addRule()
{
  
  var reg_thisWhole = getRegThis();
  var reg_toWhole = document.regularization.reg_to.value;
    
  if(regOn && reg_thisWhole != reg_toWhole)
  {
    var reg_word = getRegThis();
    var reg_to = document.regularization.reg_to.value;
    reg_thisWhole = getRegThis();
    reg_toWhole = document.regularization.reg_to.value;
    var choice = document.regularization.reg_choices.value;
    var newRule = "";
    var index = "";
    var rulesToAdd = {rules:[]};

    if(reg_thisWhole === "" || reg_toWhole === "")
    {
      alert("Invalid Rule");
      return false;
    }

    if(reg_toWhole[reg_toWhole.length] == " ")
    {
      reg_toWhole = reg_toWhole.substring(0, reg_toWhole.length-1);
    }

    if (reg_word !== "" && reg_to !== "")
    {
      if(choice == "this_place")
      {
        for (var i in distinct.witnesses)
        {
          if(reg_word == distinct.witnesses[i].token)
          {
             index = i;
          }
        }

        // get rule for each of the witnesses with this token
        $.each(distinct.witnesses[index].originals, function(i, original){
          $.each(original.id, function(j, id){
            newRule = createRule(choice, reg_thisWhole, 
                                 reg_toWhole, reg_word, id, index);
            var add = true;
            $.each(rulesToAdd.rules, function(k, rule){
                if(
                  rule.scope == newRule.scope && 
                  rule.action == newRule.action && 
                  rulesToAdd.rules[i].token == newRule.token
                ) {
                  add = false;
                }
            });
            if(add) {
              rulesToAdd.rules.push(newRule);
            }
          });
        });
        $.each(rulesToAdd.rules, function(i, rule) {
          addRuleList(rule);
        });
      }
      else
      {
        newRule = createRule(choice, reg_thisWhole, reg_toWhole, reg_word, "", "");
        addRuleList(newRule);
      }

    }
    

    contextStruct = { witnesses: [] };

    setRegThis('');
    document.regularization.reg_to.value = reg_toWhole;

    if(regOn)
    {
      insertRegTable(choice, reg_thisWhole, reg_toWhole);
    }

    changeRegularizeLabel(choice, reg_thisWhole, reg_toWhole);
  }
  else
  {
    alert("Turn regularization on to add new rules");
  }
}

function addRuleList(newRule)
{ 
  sendRule(newRule);
  
  if(isCustomRules)
  {
    customRules.rules.push(newRule);
    allRules.rules.push(newRule);
    regularize();
    //);
  }
  else //if(regOn && !isCustomRules)
  {
    allRules.rules.push(newRule);
    regularize();
    //);
  }

}

/*
 * id: id of the witness getting context for
 * index: index in the distinct.witnesses list (for token)
 */
function getContext(id, index)
{   
  //alert("getContext: " + id);
  var needMoreContext = false;
  var context = "";
  var contextIndex;
  var origContext = "";
  
  // find the context that relate to the id
  for(var i in contextStruct.witnesses)
  {
    if(contextStruct.witnesses[i].id == id)
    {
      context = contextStruct.witnesses[i].context;
      origContext = contextStruct.witnesses[i].context;
      contextIndex = i;
    }
  }
  var re = new RegExp(context, 'g');
  
  // find if the context matches any witnesses
  // if it matches any witnesses that are not to be 
  // regularize --> needMoreContext
  // if there are more than one match in a witness to 
  // be regularized --> needMoreContext
  var numMatches = 0;
  $.each(allWitnesses.witnesses, function(i, witness){
    var content = witness.content;
    var result = content.match(re);
    if(result !== null && result !== undefined && result !== 'undefined') {
      numMatches++; 
    }
  });
  
  if(numMatches > 1)
  {
    needMoreContext = true;
  }
  
  if(needMoreContext)
  {
    returnContext = getMoreContext(id, index, contextIndex);
    if(returnContext)
    {
      context = getContext(id, index);
      return context;
    }
    else
    {
      return origContext;
    }
  }
  else
  {
    return origContext;
  }
  
}

/*
 * id: id of the witness getting context for
 * index: index in the distinct.witnesses list (for token)
 * witnessIndex: index into the contextStruct
 */
function getMoreContext(id, index, witnessIndex)
{
  //alert("getMoreContext: " + id);
  
  var tokenWitnessIndex;
  var endTokensPos = allTokens.alignment[0].tokens.length;
  endTokensPos--;
  for (var i in allWitnesses.witnesses)
  {
    if(allWitnesses.witnesses[i].id == id)
    {
      tokenWitnessIndex = i;
    }
  }

  if(contextStruct.witnesses[witnessIndex].startPos === 0 && contextStruct.witnesses[witnessIndex].maxPos == endTokensPos)
  {
    // total context
    return false;
  }
  else if (contextStruct.witnesses[witnessIndex].startPos === 0 && contextStruct.witnesses[witnessIndex].endPos != endTokensPos)
  {
    contextStruct.witnesses[witnessIndex].endPos++;
    if(allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].endPos] !== null)
    {
      contextStruct.witnesses[witnessIndex].context += " " + allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].endPos].t;
    }
    contextStruct.witnesses[witnessIndex].switchDirections = false;
  }
  else if (contextStruct.witnesses[witnessIndex].endPos == endTokensPos && contextStruct.witnesses[witnessIndex].startPos !== 0)
  {
    contextStruct.witnesses[witnessIndex].startPos--;
    if(allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].startPos] !== null)
    {
      contextStruct.witnesses[witnessIndex].context = allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].startPos].t + " " + contextStruct.witnesses[witnessIndex].context;
    }
    contextStruct.witnesses[witnessIndex].switchDirections = false;
  }
  else if (contextStruct.witnesses[witnessIndex].goForward === true && contextStruct.witnesses[witnessIndex].endPos != endTokensPos)
  {
    contextStruct.witnesses[witnessIndex].goForward = false;
    contextStruct.witnesses[witnessIndex].endPos++;
    if(allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].endPos] !== null)
    {
      contextStruct.witnesses[witnessIndex].context += " " + allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].endPos].t;
    }
  }
  else if (contextStruct.witnesses[witnessIndex].goForward === false && contextStruct.witnesses[witnessIndex].startPos !== 0)
  {
    contextStruct.witnesses[witnessIndex].goForward = true;
    contextStruct.witnesses[witnessIndex].startPos--;
    if(allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].startPos] !== null)
    {
      contextStruct.witnesses[witnessIndex].context = allTokens.alignment[tokenWitnessIndex].tokens[contextStruct.witnesses[witnessIndex].startPos].t + " " + contextStruct.witnesses[witnessIndex].context;
    }
  }

  return true;
}

function sendRule(newRule)
{
  var sendRules = {rules: []};
  sendRules.rules.push(newRule);
  sendRules.urn = urn;
  sendRules.userName = userName;
  sendRules.ruleSetName = ruleSetName;
  
    $.post(env.REGULARIZE_URL + "postNewRule/", {data: JSON.stringify(sendRules)}, function(data){
       //alert("success");
     })
   .error(function () {alert("error: saveRules");});

}

function changeRegularizeLabel(choice, reg_thisWhole, reg_toWhole)
{
  
  changeLabelTimer = null;
  
  var scope = "";
  if(choice == "all_places")
  {
    scope = "all places in all witnesses.";
  }
  else if (choice == "this_entity")
  {
    scope = "all witnesses in this entity.";
  }
  else
  {
    scope = "all witnesses for this place.";
  }
  
  var content = "REGULARIZED:: \"" + reg_thisWhole + "\" to \"" + reg_toWhole + "\" in " + scope + "</br>";
  document.getElementById('newRegInfo').innerHTML = content;
  
  if (changeLabelTimer === null || !changeLabelTimer)
  {
    changeLabelTimer = setTimeout(function() {document.getElementById('newRegInfo').innerHTML = "";}, 5000);
  }
  
}

function regularize() {
  var content = findDistinct(currentPosition);
  if (content) {
    if(!isRealign) {
      automateReg(document.getElementById("automate"));
    }
    document.regularization.reg.value = content;
  }
  return content;
}

function findDistinct(position) {
  if(!regOn) {
    regRules = newRules;
  } else if(isCustomRules) {
    regRules = customRules;
  } else {
    regRules = allRules;
  }
  
  distinct = {witnesses:[]};
  var i, j, k;
  
  for (i in allTokens.alignment) {
    var regToken = false;
    var origToken = "";
    var added = false;
    var token = "";

    // get token from json
    if(!allTokens.alignment[i].tokens[position]) {
      origToken = "null";
    } else {
      origToken = allTokens.alignment[i].tokens[position].t;
    }

    // regularize token
    token = getToken(i, position);

    // determine what the original token is, if it is regularized
    if(origToken != token) {
      regToken=true;
    }
    
    if(allTokens.alignment[i].tokens[position]) {
      if(allTokens.alignment[i].tokens[position].origToken !== "" && allTokens.alignment[i].tokens[position].origToken !== undefined) {
        regToken = true;
        origToken = allTokens.alignment[i].tokens[position].origToken;
      }
    }
    
    // search if token is already in the array
    // if is ... add after
    var index;
    for(j in distinct.witnesses) {
      var distinctToken = distinct.witnesses[j].token;
      
      if(token == distinctToken && !added) {
        for(k in distinct.witnesses[j].originals) {
          if(origToken == distinct.witnesses[j].originals[k].origToken && !added) {
            distinct.witnesses[j].originals[k].id.push(allTokens.alignment[i].witness);
            added = true;
          }
        }
        if(!added) {
          distinct.witnesses[j].originals.push({
            "origToken": origToken,
            "id": []
          });
          
          index = distinct.witnesses[j].originals.length-1;
          distinct.witnesses[j].originals[index].id.push(allTokens.alignment[i].witness);
          added = true;
        }
      }
    }
    
    // add token to array because it is the first one
    if(i===0) {
      distinct.witnesses.push({
        "token": token,
        "originals": []
      });
      
      distinct.witnesses[i].originals.push({
        "origToken": origToken,
        "id" : []
      });
      
      distinct.witnesses[i].originals[i].id.push(allTokens.alignment[i].witness);
      added = true;
    } else if (!added) {
      // not already in array ... add token and id to it
      distinct.witnesses.push({
        "token": token,
        "originals": []
      });
      
      for(j in distinct.witnesses) {
        if(distinct.witnesses[j].token == token && !added) {
          distinct.witnesses[j].originals.push({
            "origToken": origToken,
            "id" : []
          });
          
          index = distinct.witnesses[j].originals.length-1;
          distinct.witnesses[j].originals[index].id.push(allTokens.alignment[i].witness);
        }
      }
    }
  }
  
  // create the content for the collation area text box
  var content = "";
  var allNull = true;
  _.each(distinct.witnesses, function(witness) {
    content += witness.token;
    if (witness.token !== null && witness.token !== 'null') {
      allNull = false;
    }
    
    for(var j in witness.originals) {
      for(var k in witness.originals[j].id) {
        content += " " + witness.originals[j].id[k];

        if(witness.originals[j].origToken != witness.token && isOriginals) {
          content += "(" + witness.originals[j].origToken + "), ";
        }else{
          content += ",";
        }
      }
    }
    content += " /// "; 
  });
  return allNull ? null : content;
}

//http://www.openjs.com/scripts/events/keyboard_shortcuts/
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		};
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt.disable_in_input) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			};
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			};
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt.keycode) {
					if(opt.keycode == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt.propagate) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		};
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt.type
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt.type, func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt.type, func);
		else ele['on' + opt.type] = func;
	},

//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination]);
		if(!binding) return;
		var type = binding.event;
		var ele = binding.target;
		var callback = binding.callback;

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
};

function findNextVariant()
{
  var reg_to = document.regularization.reg_to.value;

  var position = currentPosition;
  
  if(!regOn)
  {
    alert("Regularization must be on to perform this action");
    return;
  }

  if(isCustomRules)
  {
    regRules = customRules;
  }
  else
  {
    regRules = allRules;
  }

  if(reg_to === "")
  {
    alert("Please select a token");
  }
  else
  {
     reg_to = reg_to.split(" ", 1);
     var found = false;
     var foundVariant = false;
     var variant = "";
     for (var i in allTokens.alignment)
     {
       var token = getToken(i, position);

       if (token == reg_to && !found)
       {
         found = true;
       }
       else if (found && reg_to != token && !foundVariant)
       {
           foundVariant = true;
           variant = token;
       }
     }
     if(foundVariant)
     {
       setRegThis(variant);
     }
     else
     {
       alert("Error: Cannot get next variant.");
     } 
   }
}

function addTokenTo()
{
    // if more than one winess, check to see if words are different
    // if words are different -> cannot add next word
    // else add next word to reg_this
    // if reg_on see if rules apply to next word!

  var reg_this = document.regularization.reg_to.value;
  var position = currentPosition;
  var newToken = "";
  
  if(!regOn)
  {
    alert("Regularization must be on to perform this action");
    return;
  }
  
  var reg_thisArray = reg_this.split(" ");
  var newPosition = currentPosition-1;
  newPosition += reg_thisArray.length;

  if(reg_this === "")
  {
    alert("Please select a token");
  }
  else if(newPosition >= totalPos)
  {
    alert("Cannot add next token: There are no more tokens in entity!");
  }
  else
  {
    var i;
     position--;
     for(i in reg_thisArray)
     {
       reg_this = reg_thisArray[i];
       position++;
     }
  
     var add = true;
     var found = false;

     for (i in allTokens.alignment)
     {
       var token = getToken(i, position);
        
        if(token == reg_this)
        {
         var rToken = getToken(i, position + 1);

          if(!found) {
            found = true;
            newToken = rToken;
          }
          else if(found && rToken != newToken)
          {
            add = false;
          }
         }
    }

     if(add)
     {
       document.regularization.reg_to.value += " " + newToken;
     }
     else
     {
       alert("Error: Cannot get next token.  Not all next tokens match.");
     } 
  }

}

function addTokenThis()
{
    // if more than one winess, check to see if words are different
    // if words are different -> cannot add next word
    // else add next word to reg_this
    // if reg_on see if rules apply to next word!

  
  var reg_this = "";
  if(!isRealign)
  {
    reg_this = getRegThis();
  }
  else
  {
    reg_this = getRealignToken();
  }
  var position = currentPosition;
  var newToken = "";
  
  if(!regOn && !isRealign)
  {
    alert("Regularization must be on to perform this action");
    return;
  }
  else if(isRealign && !alignOn)
  {
    alert("Alignment must be on to perform this action");
    return;
  }
  
  var reg_thisArray = reg_this.split(" ");
  var newPosition = currentPosition-1;
  newPosition += reg_thisArray.length;

  if(reg_this === "")
  {
    alert("Please select a token");
  }
  else if(newPosition >= totalPos)
  {
    alert("Cannot add next token: There are no more tokens in entity!");
  }
  else
  {
    var i;
     position--;
     for(i in reg_thisArray)
     {
       reg_this = reg_thisArray[i];
       position++;
     }
  
     var add = true;
     var found = false;

     for (i in allTokens.alignment)
     {
       var token = getToken(i, position);
        
        
        if(token == reg_this)
        {
          var rToken = getToken(i, position + 1);

          if(!found)
          {
            found = true;
            newToken = rToken;
          }
          else if(found && rToken != newToken)
          {
            add = false;
          }
         }
    }

     if(add && !isRealign)
     {
       setRegThis(getRegThis() + ' ' + newToken);
     }
     else if(add && isRealign)
     {
       setRealignToken(getRealignToken() + ' ' + newToken);
     }
     else
     {
       alert("Error: Cannot get next token.  Not all next tokens match.");
     } 
  }
}

function buildWitnesses()
{
  //alert("buildWitnesses");
  newWitnesses = { witnesses: [] };
  isBuildWitnesses = true;
  allTokens = origTokens;

  for (var i in allTokens.alignment)
  {
    var content = "";
    for (var j in allTokens.alignment[i].tokens)
    {
      var token = getToken(i, j);
      if(token != "null")
      {
        content += token + " ";
      }
    }

    content = content.substring(0, content.length-1);
    newWitnesses.witnesses.push ({
      "id": allTokens.alignment[i].witness,
      "content": content
    });
  }
  
  isBuildWitnesses=false;

  return newWitnesses;
}

function seeWitnesses() {
  var newWitnesses = buildWitnesses();
  var content = "";

  _.each(allWitnesses, function(witness){
    content += witness.doc + ": " + (witness.orig || witness.content) + "<br />";
    //content += witness.id + ": " + witness.content + "<br />";
  });
  
  document.getElementById('newRegInfo').innerHTML = content;
  document.getElementById("newRegInfo").style.visibility = "visible";
}

function checkSpaces(reg_word)
{
  
  var position = 0;
  var i = -1;
  var indices = [];
  
  while (position != -1)
  {
    position = reg_word.indexOf(" ", i + 1);
    if(position != -1)
    {
      indices.push(position);
    }
    i = position;
  }
  
  if(indices == [])
  {
    return false;
  }
  else
  {
    return indices;
  }
}

function getToken(witnessId, position)
{
   var token = "";
   var collate = false;
   var origToken = "";
   var regRules = { rules: []};
   var foundMatch = true;
   var ruleApplied = false;
   
   if(isCustomRules) {
     regRules = customRules;
     
   }
   else {
     regRules = allRules;
   }
  
   var tokens = allTokens.alignment[witnessId].tokens;
   if (tokens && tokens[position]) {
     token = tokens[position].t;
     origToken = tokens[position].t;
   } else {
     token = "null";
   }

   var reg_to;
   for (var k in regRules.rules) {
     var action = regRules.rules[k].action;
     var reg_this = action.split(',')[0];
     reg_this = reg_this.substring(11,reg_this.length);
     reg_to = action.split(', ')[1];
     reg_to = reg_to.substring(0, reg_to.length-1);
     var wholeToToken = reg_to;
     var regularizeToken = regRules.rules[k].token;
     var choice = regRules.rules[k].scope;
     foundMatch = true;
     var modifications = regRules.rules[k].modifications;

     if (modifications[modifications.length-1].modification_type == "delete") {
       isDisabled = true;
     }
     else if ($.trim(token) == $.trim(regRules.rules[k].token)) {  
        if(choice == "this_place") {
          var reg_thisArray = reg_this.split(" ");
          var reg_toArray = reg_to.split(" ");
          var tokenArray = regularizeToken.split(" ");  //?!? maybe should use reg_thisArray (is token only one word)
          var index = "";
          
          // Establish this is the correct place to regularize
          var m;
          if(tokenArray.length == 1) {
            for(m in reg_thisArray)
            {
              if(token == reg_thisArray[m])
              {
                index = m;
              }
            }
          } else {
            for(m in reg_thisArray) {
              if(tokenArray[0] == reg_thisArray[m])
              {
                index = m;
              }
            }
          }
          
          var numBack = currentPosition - index;
          for(m = 0; m<index; m++) {
            //alert(numBack);
            if(tokens[numBack]) {
              if(tokens[numBack].t != reg_thisArray[m] && foundMatch) {
                foundMatch = false;
              }
            } else {
              m--;
            }
            numBack--;
          }
          
          var numForward = currentPosition;
          for(m = index + tokenArray.length - 1; m < reg_thisArray.length; m++) {
            if(tokens[numForward]) {
              if(tokens[numForward].t != reg_thisArray[m] && foundMatch) {
                foundMatch = false;
              }
            }
            else
            {
              m++;
            }
            numForward++;
          }
          
          if(foundMatch) { 
             ruleApplied = true;
             //alert("match");
             var found = false;
             var indexEndThis = 0;
             var n;
             for(m = index; m < reg_thisArray; m++) {
               for(n = index; n < reg_toArray; n++) {
                 if(reg_thisArray[m] == reg_toArray[n] && !found) {
                   found = true;
                   indexEndThis = m;
                 }
               }
             }
             var endIndex = reg_thisArray.length-index-indexEndThis;
             reg_thisArray = reg_thisArray.splice(index, endIndex);
             
             indexEndThis = 0;
             for(m = index; m < reg_thisArray; m++)
             {
               for(n = index; n < reg_toArray; n++)
               {
                 if(reg_thisArray[m] == reg_toArray[n] && !found)
                 {
                   found = true;
                   indexEndThis = m;
                 }
               }
             }
             reg_thisArray = reg_thisArray.splice(indexEndThis, reg_thisArray.length-1-indexEndThis);
             reg_this = reg_thisArray.join(" ");
             //alert("RegSoFar: " + reg_thisArray.join(" "));
             
             
             for(m = index; m < reg_toArray; m++)
             {
               for(n = index; n < reg_thisArray; n++)
               {
                 if(reg_thisArray[n] == reg_toArray[m] && !found)
                 {
                   found = true;
                   indexEndThis = m;
                 }
               }
             }
             reg_toArray = reg_toArray.splice(index, reg_toArray.length-index-indexEndThis);
             
             for(m = index; m < reg_toArray; m++)
             {
               for(n = index; n < reg_thisArray; n++)
               {
                 if(reg_thisArray[n] == reg_toArray[m] && !found)
                 {
                   found = true;
                   indexEndThis = m;
                 }
               }
             }
             reg_toArray = reg_toArray.splice(indexEndThis, reg_toArray.length-1-indexEndThis);
             reg_to = reg_toArray.join(" ");
             wholeToToken = reg_to;
             
             //alert("reg_this: " + reg_this + " reg_to: " + reg_to);
            
          } else if(!ruleApplied) {
            token = origToken;
            //alert("Nomatch: " + token);
          }
          
        }
        
        var spacesThis = checkSpaces(reg_this);
        var spacesTo = checkSpaces(reg_to);
        var content;
        
        if(spacesThis !== false)
        {
            content = token;

            for (var i in spacesThis) {
              position++;
              if(tokens[position]) {
                newToken = tokens[position].t;
              } else {
                newToken = "null";
              }
              content += " " + newToken;
            }

            if(content == reg_this) {
              position = currentPosition;
              if(origToken === "") {
                origToken = reg_this;
              }
              if (tokens[position]) {
                tokens[position].t = reg_to;
                tokens[currentPosition].origToken = origToken;
                tokens[currentPosition].reg_to = reg_to;
              }

              //console.log(allTokens);
              position++;
              for(k in spacesThis) { 
                tokens.splice(position, 1);
              }
              collate = true;
            }
        } else {
          ///TODO: change in object
          if(foundMatch)
          {
            token = reg_to;
          }
          else
          {
            token = origToken;
          }
        }
        
        if(spacesTo !== false && !isBuildWitnesses) {
            //Check if next word(s) match
            // if match -> recollate

            content = reg_to;
            //alert("spacesTo");

            content = content.split(' ').join('');

            //alert(content + " " + reg_this + " " + reg_to);

            if(content == reg_this)
            {
              var insertTokens = reg_to.split(' ');
              position = currentPosition;
              for(k in insertTokens) {
                if(k === 0) {
                  if(origToken === "") {
                    origToken = reg_this;
                  }
                  
                  if(tokens[position]) {
                    tokens[position].t = insertTokens[k];
                    tokens[position].origToken = origToken;
                    tokens[position].reg_to = reg_to;
                  } else {
                    tokens.splice(position, 1, {
                      t: insertTokens[k], 
                      n: insertTokens[k], 
                      origToken: origToken, 
                      reg_to: reg_to
                    });
                    // TODO:: May have to add a null token at end of each other witness to make same number of tokens
                  }
                } else {
                  if(origToken === "")
                  {
                    origToken = reg_this;
                  }
                  tokens.splice(position,0,{
                    t: insertTokens[k],
                    n: insertTokens[k],
                    origToken: origToken,
                    reg_to: reg_to
                  });
                  // TODO:: May have to add a null token at tend of each oter witness to make same number of tokens
                }
                position++;
              }

              reg_to = reg_to.split(' ')[0];
              collate = true;
              token = reg_to;
            }
        }
        else if(spacesTo !== false && isBuildWitnesses)
        {
          token = wholeToToken;
        }
        else
        {
          ///TODO: change in array
          if(foundMatch)
          {
            reg_to = reg_to.split(' ')[0];
            token = reg_to;
          }
          else
          {
            token = origToken;
          }
        }
      }
    }
    
    if(collate)
    {
      collate = false;
      if(!isBuildWitnesses)
      {
        //recollate();
        isRecollate = false;
        reg_to = reg_to.split(' ')[0];
        token = reg_to;
      }
    }
    return token;
}

function informationWindow(witnessId)
{
  var regInfo = { data: [] };
  var context = "";
  var index = "";
  var position = currentPosition;
  var regRules = "";
  var token = "";
  var temp = urn.split("entity=")[1];
  var entity = temp.split(":", 1)[0];
  var line = temp.split("Line=")[1];
  
  document.getElementById('newRegInfo').style.visibility = "hidden";
  document.getElementById('newRegInfo').innerHTML = "";
  
  witnessId = witnessId.split('(')[0];
  
  for (var i in allWitnesses.witnesses)
  {
    if(witnessId == allWitnesses.witnesses[i].id)
    {
      context = allWitnesses.witnesses[i].content;
      index = i;
    }
  }
  
  if(isCustomRules && regOn)
  {
    regRules = customRules;
  }
  else if(regOn)
  {
    regRules = allRules;
  }
  else
  {
    regRules = {rules: []};
  }
  
  var reg_this = "";
  var reg_to = "";
  var choice = "";
  
  for(var j in distinct.witnesses)
  {
    for(var k in distinct.witnesses[j].originals)
    {
      for(var l in distinct.witnesses[j].originals[k].id)
      {
        if(distinct.witnesses[j].originals[k].id[l] == witnessId)
        {
          reg_this = distinct.witnesses[j].originals[k].origToken;
          reg_to = distinct.witnesses[j].token;
        }
      }
    }
  }
  
  if(reg_this != reg_to) {
    for(i in regRules.rules) {
      if(reg_this == regRules.rules[i].token) {
        choice = regRules.rules[i].scope;
      }
    }
  }
  
  if(choice == "all_places")
  {
    choice = "all places in all witnesses";
  }
  else if(choice == "this_entity")
  {
    choice = "this entity in all witnesses";
  }
  else if(choice == "this_place")
  {
    choice = "this place in all witnesses";
  }
  
  document.information.style.visibility = "visible";
  document.reg_information.style.visibility ="hidden";
  document.getElementById('witnessId').innerHTML = witnessId;
  document.getElementById('word').innerHTML = position;
  document.getElementById('line').innerHTML = line;
  document.getElementById('block').innerHTML = entity; 
  document.getElementById('context').innerHTML = context;
  
  if(reg_this !== "" && reg_to !== "" && choice !== "") {
    document.reg_information.style.visibility = "visible";
    document.getElementById('reg_this_info').innerHTML = reg_this;
    document.getElementById('reg_to_info').innerHTML = reg_to;
    document.getElementById('choice').innerHTML = choice;
  }
  
  displayImage(witnessId);
}

var imageCount;

function displayImage(witnessId)
{
  for(var i in allImages.images)
  {
    if(allImages.images[i].id == witnessId)
    {
      new ImageMap(allImages.images[i].url);
    }
  }
}

function ImageMapType (options){
  options = options || {};
  this.tileSize = options.tileSize || new google.maps.Size(256, 256);
  this.maxZoom = options.maxZoom || 4;
  this.minZoom = options.minZoom || 1;
  this.name = options.name || 'Image';
  this.src= options.src || 'image/';
}

ImageMapType.prototype.getTile = function (coord, zoom, ownerDocument){
  var tilesCount = Math.pow(2, zoom);
  
  if( coord.x >= tilesCount || coord.x < 0 || coord.y >= tilesCount || coord.y < 0)
  {
    var div = ownerDocument.createElement('div');
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.backgroundColor = "#FFF";
    return div;
  }
  
  var img = ownerDocument.createElement('img');
  img.width = this.tileSize.width;
  img.height = this.tileSize.height;
  img.src = this.src+(zoom)+'/'+coord.x+'_'+coord.y+".jpg";
  return img;
};


function ImageMap(url){
  options = {};
  options.mapTypeId = 'DRCImageMapType';
  options.center = options.center || new google.maps.LatLng(0, 0);
  options.zoom = options.zoom || 1;
  options.maxZoom = options.maxZoom || 4;
  options.minZoom = options.minZoom || 1;
  options.name = options.name || 'Image';
  options.src = options.src || 'http://textualcommunities.usask.ca' + url;
  options.streetViewControl = false;
  options.mapTypeControlOptions = options.mapTypeControlOptions || {
    mapTypeIds: [],
    style: null
  };
  var image = {
    src: 'http://textualcommunities.usask.ca' + url,
    width: 1707,
    height: 2514
  };
  this.rate = image.width > image.height ?  256/image.width : 256/image.height;
  this.x_fix = (256 - this.rate*image.width)/2;
  this.y_fix = (256 - this.rate*image.height)/2;
  var max = 256*Math.pow(2, options.zoom)-4;
  this.maxSize = {
    width: max-this.x_fix*Math.pow(2, options.zoom+1),
    height: max-this.y_fix*Math.pow(2, options.zoom+1)
  };
  
  var map = new google.maps.Map(
    document.getElementById("image_map"), options);

  map.mapTypes.set(options.mapTypeId, new ImageMapType(options));
 
  map.overlayView = new google.maps.OverlayView();
  map.overlayView.draw = function (){};
  map.overlayView.setMap(map);
//  google.maps.event.addListener(map, 'mousemove', function(e){
//    var div = document.getElementById('coord');
//    div.textContent = e.latLng.lat() + ', ' + e.latLng.lng();
//  });
  google.maps.event.addListener(map, 'projection_changed', function(e){
    var zoom = this.getZoom();
    var tile_num = Math.pow(2, zoom-1);
    var projection = this.getProjection();
    var latLng = projection.fromPointToLatLng(new google.maps.Point(64, 64));
    this.setCenter(latLng);
  });
  this.map = map;
}

function loadRegTable() {
  document.getElementById("reg_table_title").innerHTML = "Regularizations";
  var regRules = { rules: [] };
  
  regRules = allRules;

  //delete everything out of reg_table
  var table = document.getElementById('reg_table');
  var rowCount = table.rows.length;
  for(var i =rowCount-1; i>=0; i--) {
    table.deleteRow(i);
  }

  rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  
  var checkCellTitle = row.insertCell(0);
  checkCellTitle.innerHTML  = "Apply";
  var scopeCellTitle = row.insertCell(1);
  scopeCellTitle.innerHTML = "Scope";
  var regThisCellTitle = row.insertCell(2);
  regThisCellTitle.innerHTML = "Reg. This";
  var regToCellTitle = row.insertCell(3);
  regToCellTitle.innerHTML = "Reg. To";
  var deleteCellTitle = row.insertCell(4);
  deleteCellTitle.innerHTML = "Delete";
  
  rowCount++; 
  
  for(i in regRules.rules) {
    var scope = regRules.rules[i].scope;
    var reg_this = regRules.rules[i].token;
    var reg_to = "";
    action = regRules.rules[i].action;
    reg_this = action.split(',')[0];
    reg_this = reg_this.substring(11,reg_this.length);
    reg_to = action.split(', ')[1];
    reg_to = reg_to.substring(0, reg_to.length-1);
    var modifications = regRules.rules[i].modifications;
    var isDisabled = false;
    if (modifications[modifications.length-1].modification_type == "delete")
    {
      isDisabled = true; 
    }
    insertRegTable(scope, reg_this, reg_to, isDisabled);
    rowCount++;
  }
  
  document.edit_reg.style.visibility = "visible";
}

function insertRegTable(scope, reg_this, reg_to, isDisabled)
{
    if(reg_this === null) {
      reg_this = "null";
    }
    if(reg_to === null) {
      reg_to = "null";
    }
    var found = true;
    if(isCustomRules)
    {
      found = false;
      //alert("isCustom: insertRegTable"); 
      for(var i in customRules.rules)
      {
        var customScope = customRules.rules[i].scope;
        var action = customRules.rules[i].action;
        var reg_thisRule = action.split(',')[0];
        reg_thisRule = reg_thisRule.substring(11,reg_thisRule.length);
        var reg_toRule = action.split(', ')[1];
        reg_toRule = reg_toRule.substring(0, reg_toRule.length-1);
        var scopeRule = customRules.rules[i].scope;
        //TODO: add more when completed rules
        if(customScope == scope && reg_this == reg_thisRule && reg_to == reg_toRule)
        {
          found = true;
        }
      }
    }
    
    var table = document.getElementById('reg_table');

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    
    var checkCell = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    if(found) {
      element1.checked = "checked";
    }
    if(isDisabled) {
      element1.disabled = true;
    }
    checkCell.appendChild(element1);

    var scopeCell = row.insertCell(1);
    var element2 = document.createElement("select");
    var option1 = document.createElement("option");
    option1.text = "All witnesses, this entity";
    if(isDisabled) {
      element2.disabled = true;
    }
    element2.options.add(option1);
    var option2 = document.createElement("option");
    option2.text = "All witnesses, this place";
    element2.options.add(option2);
    var option3 = document.createElement("option");
    option3.text = "All witnesses, all places";
    element2.options.add(option3);
    if(scope == "all_places") {
      element2.selectedIndex = 2; 
    } else if (scope == "this_place") {
      element2.selectedIndex = 1;
    }
    scopeCell.appendChild(element2);

    var regThisCell = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "text";
    element3.size = "25";
    //regThisCell.innerHTML = reg_this;
    element3.value = reg_this;
    if(isDisabled) {
      element3.disabled = true;
    }
    regThisCell.appendChild(element3);

    var regToCell = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "text";
    element4.size = "25";
    element4.value = reg_to;
    if(isDisabled) {
      element4.disabled = true;
    }
    regToCell.appendChild(element4);


    var deleteCell = row.insertCell(4);
    deleteCell.align = "center";
    var element5 = document.createElement("input");
    element5.type = "checkbox";
    //element5.checked = "checked";
    if(isDisabled) {
      element5.disabled = true;
    }
    deleteCell.appendChild(element5);
}

function submitCustomReg()
{
  // for alignments
  var table = document.getElementById("reg_table");
  var rowCount = table.rows.length;
  var i;
  if(alignOn) {
    isCustomAlign = true;
    
    
    customAligns = { alignments: [] };
    var sendAligns = { alignments: [] };
    var aligns = allAlign;
    
    for(i=1; i<rowCount; i++)
    {
      var row = table.rows[i];
      var check = row.cells[0].childNodes[0];
      var deleteCell = row.cells[4].childNodes[0];
      var index = i - 1;
      
      if(check.checked)
      {
        customAligns.alignments.push(aligns.alignments[index]);
      }
      
      if(deleteCell.checked)
      { 
        var newAlign = aligns.alignments[index];
        newAlign.modifications.push({
          "userId": userName,
          "modification_type": "delete",
          "dateTime" : getDateTime()
        });
        customAligns.alignments.push(newAlign);
        allAlign.alignments[index].modifications.push({
          "userId": userName,
          "modification_type": "delete",
          "dateTime" : getDateTime()
        });
        sendAligns.alignments.push(newAlign);
      }
    }
    
    sendAligns.urn = urn;
    sendAligns.userName = userName;
    sendAligns.ruleSetName = ruleSetName;
    

    // send changed rules to server
    $.ajax({
        url: env.REGULARIZE_URL + "changeAligns/",
        dataType: 'json',
        type: 'POST',
        async: false,
        data: {data: JSON.stringify(sendAligns)},
        success: function(data){
    }});
  
    sendAligns = {alignments:[]};
    
    allTokens = getBaseTokens();
    origTokens = createNewAllTokens();
    
    regularize();
    //);
    loadAlignTable();
    
    
    return;
  }
  
  // for regularization rules
  isCustomRules = true;  // ??!! <----
  table = document.getElementById('reg_table');
  rowCount = table.rows.length;
  
  customRules = { rules: [] };
  //first one is one to delete; second is new reg
  var sendRules = { rules: [] };
  
  var regRules = allRules;
  
  for(i=1; i<rowCount; i++) {
    var row = table.rows[i];
    var check = row.cells[0].childNodes[0];
    var deleteRule = row.cells[4].childNodes[0];
    var index = i - 1;
    var scope = row.cells[1].childNodes[0].value;
    var reg_this = row.cells[2].childNodes[0].value;
    var reg_to = row.cells[3].childNodes[0].value;

    if(scope == "All witnesses, this entity") {
      scope = "this_entity";
    } else if(scope == "All witnesses, this place") {
      scope = "this_place";
    } else {
      scope = "all_places";
    }

    var action = regRules.rules[index].action;
    var reg_thisRule = action.split(',')[0];
    reg_thisRule = reg_thisRule.substring(11,reg_thisRule.length);
    var reg_toRule = action.split(', ')[1];
    reg_toRule = reg_toRule.substring(0, reg_toRule.length-1);
    var scopeRule = regRules.rules[index].scope;
    
    if(deleteRule != null && deleteRule.checked) {
      // delete from database
      var newRule = allRules.rules[index];
      newRule.modifications.push({
        "userId " : userName,
        "modification_type" : "delete",
        "dateTime" : getDateTime()
      });
      customRules.rules.push(newRule);
      sendRules.rules.push(newRule);
    } else if(check != null && check.checked) {
      if(reg_this == reg_thisRule && reg_to == reg_toRule && scope == scopeRule) {
        //add to customReg
        customRules.rules.push(regRules.rules[index]);
      }
      else
      {
        var rule = allRules.rules[index];
        var thisChange = false;
        if(reg_this != reg_thisRule)
        {
          rule.modifications.push({
            "userId": userName,
            "modification_type": "modify(reg_this," + reg_thisRule + "," + reg_this + ")",
            "dateTime": getDateTime()
          });
          sendRules.rules.push(rule);
          rule.action = "regularize(" + reg_this + "," + reg_toRule + ")";
          thisChange = true;
        }
        
        if(reg_to != reg_toRule)
        {
          rule.modifications.push({
            "userId": userName,
            "modification_type": "modify(reg_to," + reg_toRule + "," + reg_to + ")",
            "dateTime": getDateTime()
          });
          sendRules.rules.push(rule);
          if(thisChange)
          {
            rule.action = "regularize(" + reg_thisRule + "," + reg_to + ")";
          }
          else
          {
            rule.action = "regularize(" + reg_this + "," + reg_to + ")"; 
          }
        }
        
        if(scope != scopeRule)
        {
          rule.modifications.push({
            "userId": userName,
            "modification_type": "modify(scope," + scopeRule + "," + scope + ")",
            "dateTime": getDateTime()
          });
          sendRules.rules.push(rule);
          rule.scope = scope;
        }
        
        customRules.rules.push(rule)

      }
    }
    
    sendRules.urn = urn;
    sendRules.userName = userName;
    sendRules.ruleSetName = ruleSetName;

    // send changed rules to server
    $.ajax({
        url: env.REGULARIZE_URL + "changeRules/",
        dataType: 'json',
        type: 'POST',
        async: false,
        data: {data: JSON.stringify(sendRules)},
        success: function(data){
    }});
  
    sendRules = {rules:[]};
  }
  
  // get new/all rules and reload reg_table
  allTokens = getBaseTokens();
  
  regularize();
  //);
  loadRegTable();
}

function getDateTime()
{
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var dateTime = hours + ":" + minutes + ":" + seconds + " " + month + "/" + day + "/" + year
  
  return dateTime;
}

function createRule(scope, reg_this, reg_to, token, id, index)
{
 
  contextStruct = {witnesses:[]};
  var goForward;
  var context = reg_this;
  var appliesTo = urn;
  
  if(currentPosition == totalPos-1)
  {
    goForward = false;
  }
  else
  {
    goForward = true;
  }
  
  if(scope == "this_place")
  {
      contextStruct.witnesses.push({
        "id": id,
        "token": token,
        "context": reg_this,
        "tokenPos": currentPosition,
        "startPos": currentPosition,
        "endPos": currentPosition,
        "goForward": goForward,
        "switchDirections": true
        
      });
      context = getContext(id, index);
      
      var contextRegTo = context.replace(reg_this, reg_to);
      reg_to = contextRegTo;
  }
  else if(scope == "this_entity")
  {
    appliesTo = urn.split(":Line=")[0];
  }
  else
  {
    appliesTo = urn.split(":Tale=")[0];
  }
  
  dateTime = getDateTime();
  
  var action = "regularize(" + context + ", " + reg_to + ")";
  newRule = {
             "_id" : "",
             "appliesTo" : appliesTo,
             "action" : action,
             "modifications" : [{
               "userId": userName,
               "modification_type": "create",
               "dateTime": dateTime
             }],
             "scope" : scope,
             "token" : token
           };
           
           
  return newRule;

}

function automateReg(checkBox)
{
  
  if(checkBox.checked)
  {
    autoReg = true; 
    
    var maxPosition = 0;
    var maxLength = 0;
    
    for (var i in distinct.witnesses)
    {
      var numberIds = 0;
      for(var j in distinct.witnesses[i].originals)
      {
        for(var k in distinct.witnesses[i].originals[j].id)
        {
          numberIds++;
        }
      }
       
      // nothing should ever be regularized to null
      if(numberIds > maxLength && distinct.witnesses[i].token != "null")
      {
        maxPosition = i;
        maxLength = numberIds;
      }
    }
   
    
    document.regularization.reg_to.value = distinct.witnesses[maxPosition].token;
    
    // null should never be regularized to anything ?!?
    if(distinct.witnesses[maxPosition] == "null")
    {
      maxPosition++;
    }
    
    if(maxPosition != distinct.witnesses.length-1)
    {
      maxPosition++;
      setRegThis(distinct.witnesses[maxPosition].token)
    }
    else if(maxPosition != 0 && maxPosition == distinct.witnesses.length)
    {
      setRegThis(distinct.witnesses[0].token)
    }
    
    
  }
  else
  {
    autoReg = false;
    
    setRegThis('')
    document.regularization.reg_to.value = "";
  }
}

function showOriginals(checkBox)
{ 
  if(checkBox.checked)
  {
    isOriginals = true;
  }
  else
  {
    isOriginals = false; 
  }
  regularize();
  //);
}

function toNull()
{
  document.regularization.reg_to.value = 'null';
  addRule();
  document.regularization.reg_to.value = '';
}

function showRegularization()
{
    document.getElementById("align_wrapper").innerHTML = "";
    var regHTML = "<br /><br /><label id='reg_this'>Regularize This:</label>";
    regHTML += "<input type='text' name='reg_this' size='82'/> <br /><label id='reg_to'>To This:</label>";
    regHTML += "<input type='text' name='reg_to' size='80'/>";
    regHTML += "<input name='regToNull' type='button' value='Or null' onclick='toNull()'>";
    regHTML += "<p>Regularize Choices:";
    regHTML += "<select name='reg_choices'>";
    regHTML += "<option value='this_entity'>All witnesses, this entity</option>";
    regHTML += "<option value='this_place'>All witnesses, this place</option>";
    regHTML += "<option value='all_places'>All witnesses, all places</option>";
    regHTML += "<option value='other'>Other ...</option>";
    regHTML += "</select></p>";
    regHTML += "<br /> Shortcuts:: <br/>'Alt+Right Arrow': Add next word to Regularize This";
    regHTML += "<br /> 'Shift+Right Arrow': Add next word to Regularize To";
    regHTML += "<br /> 'Tab': Find next variant to regularize";
    regHTML += "<br /> 'Enter': Add rule";
    regHTML += "<br /> <input type='checkbox' name='automate' value='automate' id='automate'";
    regHTML += "onchange='automateReg(this)'/> <label id='automateLabel'>Automate regularization selection</label>";
    regHTML += "<br /> <input type='checkbox' name='originals' value='originals' onchange='showOriginals(this)'/>";
    regHTML += "<label id='showOriginals'>Show originals</label>";

    document.getElementById('reg_wrapper').innerHTML = regHTML;
    document.regularization.originals.style.visibility = "hidden";
    if(regOn)
    {
      document.edit_reg.style.visibility = "visible";
      document.getElementById("showOriginals").innerHTML = "Show originals";
      document.regularization.originals.style.visibility = "visible";
    }
    else
    {
      document.getElementById('showOriginals').innerHTML = "";
    }
    isRealign = false;
    loadRegTable();
}

function showRealign(checkBox)
{
  if(checkBox.checked)
  {
    isRealign = true;
    document.realign_token.style.visibility = "visible";
    document.regularization.reg_checkbox.checked = false;
    document.getElementById("reg_wrapper").innerHTML = "";
    
    for (var i in allAlign.alignments)
    {
      allAlign.alignments[i].isApplied = false;
    }
    
    var alignHTML = "Change token alignment: <input type='text' name='token' size='20'/>";
    alignHTML += "<br/> <input type='checkbox' id='move_realign' value='move_realign' onchange='changeKindCheckbox(this)'/> Move token";
    alignHTML += "<br/> <input type='checkbox' id='combine_realign' value='combine_realign' onchange='changeKindCheckbox(this)'/> Create phrase";
    //alignHTML += "<br/> <input type='checkbox' id='insert_realign' value='insert_realign' onchange='changeKindCheckbox(this)'/> Insert into tokens";
    alignHTML += "<br/><div id='alignOption_wrapper'></div>"
    alignHTML += "<br />";
    alignHTML += "<input name='submitRealign' type='button' value='Change' onclick='addAlign()'>";
    alignHTML += "<br />";
    alignHTML += "Old alignment: <label id='realign_this'></label>";
    alignHTML += "<br />";
    alignHTML += "New alignment: <label id='realign_to'></label>";
    
    document.getElementById("align_wrapper").innerHTML = alignHTML;
    document.edit_reg.style.visibility = "hidden";
    document.getElementById("move_realign").checked = true;
    changeKindCheckbox(document.getElementById("move_realign"));
    currentPosition = 0;
    recollate();
    alignOn = false;
    align_onoff();
  } else {
    isRealign = false;
  }
}

function changeKindCheckbox(checkBox)
{
  if(checkBox.value == "move_realign")
  {
    document.getElementById("combine_realign").checked = false;
    
    document.getElementById("alignOption_wrapper").innerHTML = "";
    var alignHTML = "<br/>Direction:<br/>";
    alignHTML += "<input type='checkbox' name='forward_realign' value='forward_realign' id='forward_realign'";
    alignHTML += "onchange='alignmentDirection(this)'/> Forward";
    alignHTML += "<select name='forward_select' id='forward_select' onchange='getRealign()'></select>";
    //alignHTML += "<br/>";
    //alignHTML += "<input type='checkbox' name='backward_realign' value='bacward_realign' id='backward_realign'";
    //alignHTML += "onchange='alignmentDirection(this)'/> Backward";
    //alignHTML += "<select name='backward_select' id='backward_select' onchange='getRealign()'></select>";
    document.getElementById("alignOption_wrapper").innerHTML = alignHTML;
    document.getElementById("forward_realign").style.visibility = "visible";
    //document.getElementById("backward_realign").style.visibility = "visible";
    //document.getElementById("forward_select").style.visibility = "hidden";
    //document.getElementById("backward_select").style.visibility = "hidden";
    document.getElementById("forward_realign").checked = "true";
    document.getElementById("forward_realign").style.visibility = "hidden";
    alignmentDirection(document.getElementById("forward_realign"));
  }
  else
  {
    document.getElementById("move_realign").checked = false;
    document.getElementById("alignOption_wrapper").innerHTML = "";
    document.getElementById("alignOption_wrapper").innerHTML = "Shortcuts::<br/>'Alt+Right Arrow': Add next token to Change Alignment";
  }
}

function alignmentDirection(checkBox)
{
  if(checkBox.value == "forward_realign")
  {
    //document.getElementById("backward_realign").checked = false;
    //document.getElementById("forward_select").style.visibility = "visible";
    //document.getElementById("backward_select").style.visibility = "hidden";
    
    document.getElementById("forward_select").options.length = 0;
    var option = document.createElement("option");
    option.text = "--";
    document.getElementById("forward_select").add(option);
    var numPos = totalPos - currentPosition;
    for(var i = 0; i < numPos; i++)
    {
      var option = document.createElement("option");
      option.text = i+1;
      document.getElementById("forward_select").add(option);
    }
  }
  else
  {
    document.getElementById("forward_realign").checked = false;
    document.getElementById("forward_select").style.visibility = "hidden";
    document.getElementById("backward_select").style.visibility = "visible";
    
    document.getElementById("backward_select").options.length = 0;
    var option = document.createElement("option");
    option.text = "--";
    document.getElementById("backward_select").add(option);
    for(var i = 0; i <= currentPosition; i++)
    {
      var option = document.createElement("option");
      option.text = i+1;
      document.getElementById("backward_select").add(option);
    }
  }
}

function realign(token, isMove, isForward, numPos, position, witnessId)
{
  var isCreate = true;
  
  if(isMove) {
    isCreate = false;
  }
  
  if(token == "") {
    alert("Please select a token");
    return;
  }
  
  if(!regOn) {
    alert("Regularization must be on to change alignment");
    return;
  }
  
  if(!alignOn) {
    alert("Alignment must be on to change alignment");
    return;
  }
  
  var index = 0;
  for(var i in allTokens.alignment) {
    if(allTokens.alignment[i].witness == witnessId) {
      index = i; 
      //alert("found: " + index);
    }
  }
  
  if (token != "") {
    // MOVE TOKENS
    if(isMove) {
      if(isForward) {
        var newPos = parseInt(position);
        var numAdd = 0;
        for(var k = 0; k < numPos; k++) {
          // GET RID OF null
          newPos++;
          //alert(index + " " + allTokens.alignment[index].tokens[newPos].t);
          if(allTokens.alignment[index].tokens[newPos] == null) {
            //alert(index + " " + newPos + " null");
            allTokens.alignment[index].tokens.splice(newPos, 1);
            allTokens.alignment[index].tokens.splice(position, 0, "null");
            allTokens.alignment[index].tokens[position] = null;
          } else {
            // MOVE ALL TOKENS FORWARD
            //alert(index + " non-null");
            allTokens.alignment[index].tokens.splice(position, 0, "null");
            allTokens.alignment[index].tokens[position] = null;
            numAdd++;
          }
        }
      }
      else
      {
        for(var i in allTokens.alignment)
        {
          if(i == index)
          {
            newPosition = totalPos + 1;
            for(var k = 0; k < numPos; k++)
            {
              allTokens.alignment[i].tokens.splice(newPosition, 0, "null");
              newPosition++;
            }

            for(var k in allTokens.alignment[i].tokens)
            {
              if(allTokens.alignment[i].tokens[k] == "null")
              {
                allTokens.alignment[i].tokens[k] = null;
              }
            }
          }
          else
          {
            for(var k = 0; k < numPos; k++)
            {
              allTokens.alignment[i].tokens.splice(0, 0, "null");
              allTokens.alignment[i].tokens[0] = null;
            }
          }
        }
      }
    }
    
    // CREATE PHRASE
    if(isCreate) {
      //alert("isCreate");
      if(token[token.length-1] == " ") {
        token.splice(token.length-1, 1);
      }

      token = token.split(" ");
      var length = token.length;
      
      var match = true;
      var forwardNum = currentPosition;

      for (var j = 0; j < length; j++) {
        var newToken = getToken(index, forwardNum)
        //alert(allTokens.alignment[index].witness + ":" + newToken + " " + token[j]);
        if(newToken != 'null') {
          if(newToken != token[j]) {
            match = false;
          }
        } else {
          j--;
        }
        forwardNum++;
      }
      
      if(match) {
        //alert("match");
        allTokens.alignment[index].tokens[currentPosition].t = token.join(" ");
        var indexInput = totalPos;
        var indexDelete = currentPosition;
        indexDelete++;

        for(var j = 0; j < length-1; j++) {
          allTokens.alignment[index].tokens[indexInput] = null;
          indexInput++;
        }

        for(var j=0; j < length-1; j++) {
          allTokens.alignment[index].tokens.splice(indexDelete, 1);
        }
      }
    }
  }
  
  
  totalPos = allTokens.alignment[0].tokens.length;
  allPos = allTokens.alignment[0].tokens.length;
  // Make sure there are no extra null positions in alignment
  for(var j = 0; j <= allPos; j++)
  {
    var found = false;
    for(var k in allTokens.alignment)
    {
      if(allTokens.alignment[k].tokens[j] != null)
      {
        found = true;
      }
    }
    
    if(!found)
    {
      for(var k in allTokens.alignment)
      {
        allTokens.alignment[k].tokens.splice(j, 1);
      }
      j--;
      allPos--;
    }
  }
  
  console.log(allTokens);
  regularize();
}

function getRealign()
{
  var oldAlign = "";
  var newAlign = "";
  var oldTotalPos = totalPos;
  
  var numPos = null;
  var isForward = null;
  var token = getRealignToken();
  var isMove = document.getElementById("move_realign").checked;
  
  var ids = [];

  for (var i in distinct.witnesses)
  {
    if(token == distinct.witnesses[i].token)
    {
      for (var j in distinct.witnesses[i].originals)
      {
        for (var k in distinct.witnesses[i].originals[j].id)
        {
          ids.push(distinct.witnesses[i].originals[j].id[k]);
        }
      }
    }
  }
  
  if(isMove)
  {
    isForward = document.getElementById("forward_realign").checked;
    
    if(isForward)
    {
      numPos = document.getElementById("forward_select").value;
    }
    else
    {
      numPos = document.getElementById("backward_select").value;
    }
  }
  
  if(token == "")
  {
    alert("Please select a token");
    return;
  }
  
  if(!regOn)
  {
    alert("Regularization must be on to change alignment");
    return;
  }
  
  if(!alignOn)
  {
    alert("Alignment must be on to change alignment");
    return;
  }
  
  var newTokens = createNewAllTokens();
  var oldTokens = allTokens;
  allTokens = newTokens;
  
  if(document.getElementById("forward_realign").checked)
  {
    //OLDALIGN
    var numTokens = totalPos + parseInt(numPos);
    for(var i=0; i<numTokens; i++)
    {
      var position = i;
      //if(position <= totalPos)
      //{ 
        oldAlign += findDistinct(position) + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      //}
//      else
//      {
//        oldAlign += getNullContent() + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
//      }
    }

    //NEWALIGN
    regularize();
    for(var k in ids)
    {
      realign(token, isMove, isForward, numPos, currentPosition, ids[k]);
    }
    var numTokens = totalPos + parseInt(numPos);
    for(var i = 0; i<numTokens; i++)
    {
      var position = i;
      if(position <= totalPos)
      { 
        newAlign += findDistinct(position) + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
      else
      {
        newAlign += getNullContent() + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
    }
  }
  else
  {
    
    //OLDALIGN
    var numTokens = totalPos + parseInt(numPos) - 1;
    var endPosition = 0 - parseInt(numPos);
    var position = 0;
    for(var i=numTokens; i>endPosition; i--)
    {
      if(i >= -1)
      { 
        oldAlign += findDistinct(position) + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        position++;
      }
      else
      {
        oldAlign += getNullContent() + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
    }

    //NEWALIGN
    regularize();
    for(var k in ids)
    {
      realign(token, isMove, isForward, numPos, currentPosition, ids[k]);
    }
    var numTokens = totalPos + parseInt(numPos) - 1;
    var endPosition = 0 - parseInt(numPos);
    var position = 0;
    for(var i = numTokens; i>endPosition; i--)
    {
      if(i >= -1)
      { 
        newAlign += findDistinct(position) + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        position++;
      }
      else
      {
        newAlign += getNullContent() + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
    }
  }
  
  document.getElementById("realign_this").innerHTML = oldAlign;
  document.getElementById("realign_to").innerHTML = newAlign;
  
  // make distinct object correct
  allTokens = oldTokens;
  regularize();
  totalPos = oldTotalPos;
}

function getNullContent()
{
  var content = "null ";
  
  for(var i in allTokens.alignment)
  {
    content += allTokens.alignment[i].witness + " ";
  }
  content += "///";
  return content;
}

function createNewAllTokens()
{
  var newTokens;
  
  if(!isRecollate)
  {
    newTokens = {alignment: []};
  }
  else
  {
    newTokens = {witnesses:[]};
  }
  
  for(var i in allTokens.alignment)
  {
    
    if(!isRecollate)
    {
      newTokens.alignment.push({
        "witness": allTokens.alignment[i].witness,
        "tokens": []
      });

      for(var j in allTokens.alignment[i].tokens)
      {
        if(allTokens.alignment[i].tokens[j] == null)
        {
          newTokens.alignment[i].tokens.push(null);
        }
        else
        {
          newTokens.alignment[i].tokens.push({
            "t": allTokens.alignment[i].tokens[j].t
          });
        }
      }
    }
    else
    {
      newTokens.witnesses.push({
        "id": allTokens.alignment[i].witness,
        "tokens": []
      });
      
      for(var j in allTokens.alignment[i].tokens)
      {
        if(allTokens.alignment[i].tokens[j] == null)
        {
          newTokens.witnesses[i].tokens.push(null);
        }
        else
        {
          var token = "";
          token = getToken(i, j);
          newTokens.witnesses[i].tokens.push({
            "t": token
          });
        }
      }
    }
  }
  
  return newTokens;
}

function loadAlignTable() {
  document.getElementById("reg_table_title").innerHTML = "Alignments";

  //delete everything out of reg_table
   var table = document.getElementById('reg_table');
   var rowCount = table.rows.length;
   for(var i =rowCount-1; i>=0; i--)
   {
     table.deleteRow(i);
   }

  var table = document.getElementById('reg_table');

  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  
  var checkCellTitle = row.insertCell(0);
  checkCellTitle.innerHTML = "Apply";
  var tokenCellTitle = row.insertCell(1);
  tokenCellTitle.innerHTML = "Token or Phrase";
  var positionCellTitle = row.insertCell(2);
  positionCellTitle.innerHTML = "Witness ID";
  var typeCellTitle = row.insertCell(3);
  typeCellTitle.innerHTML = "Type";
  var directionCellTitle = row.insertCell(4);
  directionCellTitle.innerHTML = "Direction";
  var numCellTitle = row.insertCell(5);
  numCellTitle.innerHTML = "Number of Positions";
  var deleteCellTitle = row.insertCell(6);
  deleteCellTitle.innerHTML = "Delete";
  
  rowCount++; 
  
  for(var i in allAlign.alignments)
  {
    var token = allAlign.alignments[i].token;
    //var token = allAlign.alignments[i].context;
    var witnessId = allAlign.alignments[i].witnessId;
    var type = allAlign.alignments[i].isMove;
    var direction = allAlign.alignments[i].isForward;
    var numPos = allAlign.alignments[i].numPos;
    var modifications = allAlign.alignments[i].modifications;
    var isDisabled = false;
    if (modifications[modifications.length-1].modification_type == "delete")
    {
      isDisabled = true; 
    }
    
    insertAlignTable(token, witnessId, type, direction, numPos, isDisabled);
    rowCount++;
  }
  
  document.edit_reg.style.visibility = "visible";
}

function insertAlignTable(token, witnessId, isMove, isForward, numPos, isDisabled)
{
  var table = document.getElementById('reg_table');

  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  var checkCell = row.insertCell(0);
  var element1 = document.createElement("input");
  element1.type = "checkbox";
  element1.checked = true;
  var found = false;
  for(var i in customAligns.alignments)
  {
    var customToken = customAligns.alignments[i].token;
    var customID = customAligns.alignments[i].witnessID;
    var customMove = customAligns.alignments[i].isMove;
    var customForward = customAligns.alignments[i].isForward;
    var customNumPos = customAligns.alignments[i].numPos;
    if(customToken == token && customID == witnessId && isMove == customMove && isForward == customForward && numPos == customNumPos)
    {
      found = true;
    }
  }
  if(found)
  {
    element1.checked = "checked";
  }
  if(isDisabled)
  {
    element1.disabled = true;
  }
  checkCell.appendChild(element1);
  
  var tokenCell = row.insertCell(1);
  var element2 = document.createElement("label");
  element2.innerHTML = token;
  if(isDisabled)
  {
    element2.style.opacity = "0.5";
  }
  tokenCell.appendChild(element2);
  
  var positionCell = row.insertCell(2);
  var element3 = document.createElement("label");
  element3.innerHTML = witnessId;
  if(isDisabled)
  {
    element3.style.opacity = "0.5";
  }
  positionCell.appendChild(element3);
  
  var typeCell = row.insertCell(3);
  var element4 = document.createElement("label");
  if(isMove)
  {
    element4.innerHTML = "Move tokens";
  }
  else
  {
    element4.innerHTML = "Create phrase";
  }
  if(isDisabled)
  {
    element4.style.opacity = "0.5";
  }
  typeCell.appendChild(element4);
  
  var directionCell = row.insertCell(4);
  var element5 = document.createElement("label");
  if(isMove)
  {
    if(isForward)
    {
      element5.innerHTML = "Forward";
    }
    else
    {
      element5.innerHTML = "Backward";
    }
  }
  else
  {
    element5.innerHTML = "--";
  }
  if(isDisabled)
  {
    element5.style.opacity = "0.5";
  }
  directionCell.appendChild(element5);
  
  var numberCell = row.insertCell(5);
  var element6 = document.createElement("label");
  if(isMove)
  {
    element6.innerHTML = numPos;
  }
  else
  {
    element6.innerHTML = "--";
  }
  if(isDisabled)
  {
    element6.style.opacity = "0.5";
  }
  numberCell.appendChild(element6);

  var deleteCell = row.insertCell(6);
  deleteCell.align = "center";
  var element7 = document.createElement("input");
  element7.type = "checkbox";
  if(isDisabled)
  {
    element7.disabled = true;
  }
  deleteCell.appendChild(element7);
}

function align_onoff()
{
  if(alignOn)
  {
    alignOn = false;
    document.getElementById("align_button").value = "Align. Off";
    allTokens = getBaseTokens();
    origTokens = createNewAllTokens();
    regularize();
  }
  else
  {
    alignOn = true;
    document.getElementById("align_button").value = "Align. On";
    //allTokens = getBaseTokens();
    // apply all rules and alignments
    regularize();
    applyAlign();
    regularize();
    loadAlignTable();
  }
}

function createAlignment(token, isMove, isForward, numPos)
{
  var allNewAlign = { alignments: [] };
  contextStruct = {witnesses: []};
  origTokens = getBaseTokens();
  
  if(isForward == null)
  {
    isForward = false;
  }
  
  if(numPos == null)
  {
    numPos = 0;
  }
  
  if(token[token.length-1] == " ")
  {
    token.splice(token.length-1, 1);
  }

  token = token.split(" ");
  var witnessId = "";
  var context = "";

  for(var i in allTokens.alignment)
  {
    var match = true;
    var index = currentPosition;
    context = "";
    for (var j in token)
    {
      if(getToken(i, index) != token[j])
      {
        match = false;
      }
      index++;
    }

    if(match)
    {
      witnessId = allTokens.alignment[i].witness;
      
      if(currentPosition == totalPos-1)
      {
        goForward = false;
      }
      else
      {
        goForward = true;
      }
      
      contextStruct.witnesses.push({
        "id": witnessId,
        "token": token[0],
        "context": token.join(" "),
        "tokenPos": currentPosition,
        "startPos": currentPosition,
        "endPos": currentPosition,
        "goForward": goForward,
        "switchDirections": true
        
      });
      
      console.log(contextStruct);
      
      var index = 0;
      for(var j in distinct.witnesses)
      {
        if(token[0] == distinct.witnesses[j].token)
        {
          index = j;
        }
      }
      
      context = getContext(witnessId, index);
      
      var newAlign = {
        "token": token.join(" "),
        "appliesTo": urn,
        "witnessId": witnessId,
        "context": context,
        "isMove": isMove,
        "isForward": isForward,
        "numPos": numPos,
        "position": currentPosition,
        "isApplied": true,
        "modifications": []
      };

      newAlign.modifications.push({
        "modification_type": "create",
        "userName": userName,
        "dateTime": getDateTime()
      });
      
      console.log(newAlign);
      
      allNewAlign.alignments.push(newAlign);
    }
  }
  
  return allNewAlign;
}

function addAlign()
{
  var numPos = null;
  var isForward = null;
  var token = $('#realign_token input[name=token]').val();
  var isMove = document.getElementById("move_realign").checked;
  document.getElementById("realign_this").innerHTML = "";
  document.getElementById("realign_to").innerHTML = "";
  
  if(isMove)
  {
    isForward = document.getElementById("forward_realign").checked;
    
    if(isForward)
    {
      numPos = document.getElementById("forward_select").value;
    }
    else
    {
      numPos = document.getElementById("backward_select").value;
    }
    
    if(numPos == "--")
    {
      alert("Select number of positions to move token");
      return;
    }
  }
  
  newAlign = createAlignment(token, isMove, isForward, numPos);
  
  for(var i in newAlign.alignments)
  {
    allAlign.alignments.push(newAlign.alignments[i]);
    // add to table
    insertAlignTable(newAlign.alignments[i].token, newAlign.alignments[i].witnessId, newAlign.alignments[i].isMove, newAlign.alignments[i].isForward, newAlign.alignments[i].numPos, false);
    // do alignment
    realign(token, isMove, isForward, numPos, currentPosition, newAlign.alignments[i].witnessId);
  }
  
  //send to server
  sendAlign(newAlign);
  
}

function sendAlign(newAlign)
{
  var sendAligns = {alignments: []};
  
  for(var i in newAlign.alignments)
  {
    sendAligns.alignments.push(newAlign.alignments[i]);
  }
  sendAligns.urn = urn;
  sendAligns.userName = userName;
  sendAligns.ruleSetName = ruleSetName;
  
    $.post(env.REGULARIZE_URL + "postNewAlign/",
           {data: JSON.stringify(sendAligns)},
        function(data){
       //alert("success");
     })
   .error(function () {alert("error: saveAlign");})

}

/**
 * applies ALL alignments
 */
function applyAlign()
{
  var aligns = {alignments: []};
  if(isCustomAlign)
  {
    aligns = customAligns;
  }
  else
  {
    aligns = allAlign;
  }
  
  if(!alignOn)
  {
    return;
  }
  
  for (var i in aligns.alignments)
  {
    var token = aligns.alignments[i].token;
    var isMove = aligns.alignments[i].isMove;
    var isForward = aligns.alignments[i].isForward;
    var numPos = aligns.alignments[i].numPos;
    var context = aligns.alignments[i].context;
    var witnessId = aligns.alignments[i].witnessId;
    var _id = aligns.alignments[i].witnessId;
    var position = aligns.alignments[i].position;
    var foundMatch = true;
    var tokenArray = token.split(" ");
    var alignApplied = aligns.alignments[i].isApplied;
    if(aligns.alignments[i].modifications[aligns.alignments[i].modifications.length-1].modification_type != "delete")
    {
      for(var j in allTokens.alignment)
      {
        if(allTokens.alignment[j].witness == witnessId && !alignApplied)
        {
          //alert("match witnessId: " + witnessId);
          //for(var k in allTokens.alignment[j].tokens[currentPosi])
          //{
            var k = currentPosition;
            //findDistinct(k);
            //alert("At: " + getToken(j, k) + " alignTok: " + tokenArray[0]);
            if(getToken(j, k) == tokenArray[0])
            {
              //alert("match Token: " + tokenArray[0]);
              //alert("Context: " + context);
              var contextArray = context.split(" ");
              var index = "";

              if(isMove)
              {
                for(var l in allTokens.alignment)
                {
                  if(witnessId == allTokens.alignment[l].witness)
                  {
                    witnessId = l;

                    for(var m in contextArray)
                    {
                      if(tokenArray[0] == contextArray[m])
                      {
                        index = m;
                      }
                    }

                    var numBack = k - index;
                    for(var m = 0; m<index; m++)
                    {
                      //alert(numBack);
                      if(allTokens.alignment[witnessId].tokens[numBack] != null)
                      {
                        if(allTokens.alignment[witnessId].tokens[numBack].t != contextArray[m] && foundMatch)
                        {
                          //alert("backward no match");
                          foundMatch = false;
                        }
                      }
                      else
                      {
                        m--;
                      }
                      numBack--;
                    }

                    var numForward = k;
                    for(var m = index + tokenArray.length - 1; m < contextArray.length; m++)
                    {
                      if(allTokens.alignment[witnessId].tokens[numForward] != null)
                      {
                        if(allTokens.alignment[witnessId].tokens[numForward].t != contextArray[m] && foundMatch)
                        {
                          //alert("forward no match");
                          foundMatch = false;
                        }
                      }
                      else
                      {
                        m++;
                      }
                      numForward++;
                    }

                    if(foundMatch && !alignApplied)
                    { 
                       //alert("match: " + witnessId);
                       alignApplied = true;
                       if(isCustomAlign)
                       {
                         customAligns.alignments[i].isApplied = true;
                       }
                       else
                       {
                         allAlign.alignments[i].isApplied = true;
                       }
                       realign(token, isMove, isForward, numPos, k, _id);
                    }
                  }
                }
              }
              else
              {
                //alert("isCreate");
                for(var n in allTokens.alignment)
                {
                  if(allTokens.alignment[n].witness == witnessId)
                  {
                    //alert("found witnesses");
                    witnessId = n;
                  
                    var numForward = k;
                    //alert(k);
                    for(var m in tokenArray)
                    {
                      if(allTokens.alignment[witnessId].tokens[numForward] != null)
                      {
                        if(tokenArray[m] != allTokens.alignment[witnessId].tokens[numForward].t)
                        {
                          //alert("match not found");
                          foundMatch = false;
                        }
                      }
                      else
                      {
                        m--;
                      }
                      numForward++;
                    }

                    if(foundMatch && !alignApplied)
                    {
                      //alert("here");
                      alignApplied = true;
                      if(isCustomAlign)
                      {
                        customAligns.alignments[i].isApplied = true;
                      }
                      else
                      {
                        allAlign.alignments[i].isApplied = true;
                      }
                      //alert(k);
                      realign(token, isMove, isForward, numPos, k, _id);
                    }
                  }
                }
              }
            }
          //}
        }
      }
    }
  }
  
  console.log(allTokens);
  console.log(allAlign);
}





