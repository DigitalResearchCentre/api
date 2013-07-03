var BASE_URL = 'http://textualcommunities.usask.ca/api/'

function getObject(url) {
  return $.get(url);
};

function getList(urls) {
  var dfds = $.map(urls, getObject);
  return $.when.apply(this, dfds).then(function () {
    if (dfds.length == 1) {
      return [arguments[0]];
    }else{
      return $.map(arguments, function (resp) {
        return resp[0];
      });
    }
  });
};

var TC = {
  get: function(key, data) {
    var _api = TC._api
      , args = Array.prototype.slice.call(arguments)
    ;
    data || (data = {});
    if (!_api) {
      // _api contain api url mapping in BASE_URL
      return $.get(BASE_URL).then(function (resp) {
        TC._api = resp;
        return TC.get(key, data);
      });
    }else{
      // add page_size=0 param to disable page pagination
      // ex: /api/docs -> {count: 1, next: null, result: [{id: 1, name: hg}]}
      //     /api/docs?page_size=0 -> [{id: 1, name: hg}]
      data.page_size || (data.page_size = 0);
      return $.get(_api[key], data);
    }
  },
  getCommunities: function(data) {
    return TC.get('communities', data);
  },
  getDocs: function (community) {
    return getList(community.docs);
  },
  getEntities: function(community) {
    return getList(community.entities);
  },
  getParts: function(parent) {
    return getList(parent.has_parts);
  },
  getImage: function(doc) {
    // TODO
  }
}

/************** example  **************/

// get communities
TC.getCommunities().done(function (communities) {

  var $communities = $('.community-list');
  $.each(communities, function (index, community) {
    var $community = $('<li/>')
      .appendTo($communities)
      .text(community.abbr + ': ' + community.name)
    ;

    // get docs of community
    TC.getDocs(community).done(function (docs) {

      var $docs = $('<ul/>').text('docs:').appendTo($community);
      $.each(docs, function (index, doc) {
        var $doc = $('<li/>').text(doc.name).appendTo($docs);

        // get doc parts
        TC.getParts(doc).done(function (parts) {

          var $ul = $('<ul/>').appendTo($doc);
          $.each(parts, function(index, part){
            var $child = $('<li/>').text(part.name).appendTo($ul);

            $.get(part.has_text_in).done(function(text){
              console.log(text);
              $('<div/>').text(text.xml).appendTo($child)
            });
          });
        });
      });
    });

    // get entities of community
    TC.getEntities(community).done(function (entities) {
      var $entities = $('<ul/>').text('entities:').appendTo($community);
      $.each(entities, function (index, entity) {
        $('<li/>').text(entity.name).appendTo($entities);
      });
    });
  });
});

var imageMap = new ImageMap($('.map')[0], 'http://textualcommunities.usask.ca/api/docs/353959/has_image/', {zoom: 4, minZoom: 0, maxZoom: 6});


