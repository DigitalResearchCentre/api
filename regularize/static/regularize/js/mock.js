
function mockWitnesses(callback) {
  var dfd = $.Deferred();
  var data = [{"content": "This Carpenter / hadde weddid / a newe wyf ", "doc": "Ad1", "id": "4434938"}, {"content": "This carpenter had wedded anewe wif ", "doc": "Ad2", "id": "4476363"}, {"content": "\u00b6 This Carpenter had wedded anew wyf ", "doc": "Ad3", "id": "4490152"}, {"content": "\u00b6 This Carpenter / hadde wedded newe a wyf ", "doc": "Base", "id": "4532345"}, {"content": "This Carpint\ua770er had weddid a new wif ", "doc": "Bo1", "id": "4577645"}, {"content": "This Carpenter hade weddid a new wif ", "doc": "Bw", "id": "4652282"}, {"content": "This carpenter hadde weddid anewe wif ", "doc": "Ch", "id": "4696069"}, {"content": "This Carpenter had newe wedded awif ", "doc": "Cn", "id": "4749005"}, {"content": "This Carpunter hadde wedded a newe wyf", "doc": "Cp", "id": "4793252"}, {"content": "This Carpenter hadde weddid a newe wyf ", "doc": "Cx1", "id": "4832373"}, {"content": "Thys carpenter hadde weddyd newe a wyf ", "doc": "Cx2", "id": "4874755"}, {"content": "\u00b6 . This Carpenter had wedded / newe a wyf", "doc": "Dd", "id": "4915371"}, {"content": "\u00b6 This Carpenter hadde wedded newe a wyif ", "doc": "Dl", "id": "4948015"}, {"content": "This Carpenter had wedded a newe wif ", "doc": "Ds1", "id": "4989989"}, {"content": "\u00b6 This Carpenter / hadde wedded newe a wyf", "doc": "El", "id": "5032247"}, {"content": "This Carpenter hade wedded newe a wyf ", "doc": "En1", "id": "5073209"}, {"content": "This carpenter had weddid anewe wyf ", "doc": "En2", "id": "5187373"}, {"content": "This carpenter had weddid anewe wyf ", "doc": "En2", "id": "5152578"}, {"content": "This carpenter had weddid anewe wyf ", "doc": "En2", "id": "5117783"}, {"content": "This carpenter hadde weddid / a newe wyf ", "doc": "En3", "id": "5269518"}, {"content": "This carpenter had wedded a newe wyf ", "doc": "Fi", "id": "5313255"}, {"content": "This carpenter hadde weddid newe a wyf", "doc": "Gg", "id": "5396389"}, {"content": "This Carpente had wedded newly a wyfe ", "doc": "Gl", "id": "5430386"}, {"content": "This carpenter had weddid newe a wyf", "doc": "Ha4", "id": "5544063"}, {"content": "\u00b6 This Carpenter / hadde wedded newe a wyf", "doc": "Hg", "id": "5582533"}, {"content": "This Carpenter had wedded newe a wif", "doc": "La", "id": "5626064"}];
  if (callback) {
    callback(data);
  }
  dfd.resolve(data);
  return dfd;
}

function mockRuleset(callback) {
  var dfd = $.Deferred();
  var data = [];
  if (callback) {
    callback(data);
  }
  dfd.resolve(data);
  return dfd;
}

