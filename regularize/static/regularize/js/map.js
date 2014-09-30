function ImageMapType (options){
  options = options || {};
  this.tileSize = options.tileSize || new google.maps.Size(256, 256);
  this.maxZoom = options.maxZoom || 4;
  this.minZoom = options.minZoom || 2;
  this.name = options.name || 'Image';
  this.src= options.src || 'image/';
}

ImageMapType.prototype.getTile = function (coord, zoom, ownerDocument){
  var div = ownerDocument.createElement('DIV');
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.color = 'red';
  var imgSrc = this.getTileUrl(coord, zoom);
  if (imgSrc !== ''){
    div.style.background = 'url('+imgSrc+')';
    div.style.backgroundRepeat = 'no-repeat';
  }
  return div; 
};
ImageMapType.prototype.getTileUrl = function (coord, zoom) {
  var limit=Math.pow(2, zoom);
  if (coord.x < 0 || coord.y < 0 || coord.x >= limit || coord.y >= limit){
    return '';
  }
  var x=coord.x;
  var y=coord.y;
  return this.src+zoom+'/'+x+'/'+y+'/';
};



function ImageMap(div, src, options){
  options = options || {};
  options.mapTypeId = 'DRCImageMapType';
  options.center = options.center || new google.maps.LatLng(0, 0);
  options.zoom = options.zoom || 2;
  options.maxZoom = options.maxZoom || 5;
  options.minZoom = options.minZoom || 2;
  options.name = options.name || 'Image';
  options.src = options.src || src;
  if (options.src[options.src.length-1] != '/'){
    options.src += '/';
  }
  options.streetViewControl = false;
  options.mapTypeControlOptions = options.mapTypeControlOptions || {
    mapTypeIds: [],
    style: null
  };

  var imageMap = this;
  this.getImageInfo(options.src, function(data){
    imageMap._imageInfo = data;
    options.maxZoom = data.max_zoom;
    var map = new google.maps.Map(div, options);
    var imageType = new ImageMapType(options);

    map.mapTypes.set(options.mapTypeId, imageType);
    map.overlayView = new google.maps.OverlayView();
    map.overlayView.draw = function (){};
    map.overlayView.setMap(map);
    imageMap.map = map;
    window.map = map;

    var projection = map.getProjection();
    var onProjectionChange = imageMap.onProjectionChange.bind(imageMap);
    if (projection) {
      onProjectionChange();
    }
    google.maps.event.addListener(map, 'projection_changed', onProjectionChange);
  });
}

ImageMap.prototype.onProjectionChange = function(e) {
  var map = this.map;
  var projection = map.getProjection();
  var zoom = map.getZoom();
  var bounds = map.getBounds();
  var width = this._imageInfo.width;
  var height = this._imageInfo.height;
  var maxZoom = this._imageInfo.max_zoom;
  var ne = projection.fromLatLngToPoint(bounds.getNorthEast());
  var sw = projection.fromLatLngToPoint(bounds.getSouthWest());
  var w = ne.x - sw.x;
  var h = sw.y - ne.y;
  width = width / Math.pow(2, maxZoom + 1 - zoom);
  height = height / Math.pow(2, maxZoom + 1 - zoom);
  while (w > width * 2 && h > height * 2) {
    zoom += 1;
    width *= 2;
    height *= 2;
  }
  map.setZoom(zoom);
  map.setCenter(projection.fromPointToLatLng(
    new google.maps.Point(width/2 - w/2, h/2)));
};

ImageMap.prototype.getImageInfo = function(src, callback, zoom) {
  $.get(src, callback);
};

