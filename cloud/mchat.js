//iOS 消息推送

var emoji = require('cloud/lib/emoji.js');

var msgTypeText = -1;
var msgTypeImage = -2;
var msgTypeAudio = -3;
var msgTypeVideo = -4;
var msgTypeLocation = -5;
var msgTypeEmotion = 1;

//消息类型转换
function getMsgDesc(msg) {
  var type = msg._lctype;
  if (type == msgTypeText) {
    return emoji.replace_colons(msg._lctext);
  } else if (type == msgTypeImage) {
    return "[图片]";
  } else if (type == msgTypeAudio) {
    return "[语音]";
  } else if (type == msgTypeLocation) {
    return msg._lctext;
  } else if (type == msgTypeEmotion){
    return "[动态表情]";
  } else if (type == msgTypeVideo) {
    return "[视频]";
  } else {
    return "[未知消息]";
  }
}

function receiversOffline(req, res) {
  console.log("接受人" + JSON.stringify(req.offlinePeers) + "*" + JSON.stringify(res.offlinePeers);

  if (req.params.convId) {
    // api v2
    try{
        sendAPNSMessage(req,res);
    } catch(err) {
      // json parse error
      res.success();
    }
  } else {
    console.log("receiversOffline , conversation id is null");
    res.success();
  }
}
//发送推送消息
function sendAPNSMessage(req, res){
    // var params = req.params;
    // var q = new AV.Query('_Conversation');
    // q.equalTo ('objectId', params.convId);
    // q.limit (1);
    // q.find({
    // success: function(results) {
    //     //获取用户的昵称
    //     // results is an array of AV.Object.
    //     var dict = results[0].get('attr');
    //     var username = dict[params.fromPeer]['username']
        var pushMessage = getAPNSPushMessage(req.params,"");
        res.success({pushMessage: pushMessage});
    // },
    // error: function(error) {
    //     // error is an instance of AV.Error.
    //     res.success();
    // }
    // });
}

//设置推送消息
function getAPNSPushMessage(params,userName) {
  var contentStr = params.content;
  var json = {
    badge: "Increment",
    sound: "default",
    convid: params.convId     //来支持点击弹框，跳转至相应对话
    ,"_profile": "dev"      //设置证书，开发时用 dev，生产环境不设置
  };
  var msg = JSON.parse(contentStr);
  var msgDesc = getMsgDesc(msg);
  if (userName) {
      json.alert = msg._lcattrs["cy_name"]  + ':' + msgDesc;
  } else {
      json.alert = msgDesc;
  }
//  if (msg._lcattrs && msg._lcattrs.dev) {
    //设置证书，开发时用 dev，生产环境不设置
//    json._profile = "dev";
//  }
  return JSON.stringify(json);
}

exports.receiversOffline = receiversOffline; // used by main.js