  //iOS 消息推送

  var emoji = require('cloud/lib/emoji.js');

  var msgTypeText = -1;
  var msgTypeImage = -2;
  var msgTypeAudio = -3;
  var msgTypeVideo = -4;
  var msgTypeLocation = -5;

  var msgTypeSystem = 1;//系统消息
  var msgTypeAnnouncement = 2;//公告
  var msgTypeApply = 3;//报名
  var msgTypeVote = 4;//投票

  //消息类型转换
  function getMsgDesc(msg) {
    var type = msg._lctype;
    if (type == msgTypeText) {
      return emoji.replace_colons(msg._lctext);
    } else if (type == msgTypeImage) {
      return "[图片]";
    } else if (type == msgTypeAudio) {
      return "[语音]";
    } else if (type == msgTypeLocation) { //位置消息
      return "[位置]" + msg._lctext;
    } else if (type == msgTypeAnnouncement) {
      return "[公告]" + msg._lctext;
    } else if (type == msgTypeVideo) {
      return "[视频]";
    } else if (type == msgTypeApply) {
      return "[报名]" + msg._lctext;
    } else if (type == msgTypeVote) {
      return "[投票]" + msg._lctext;
    } else {
      return "[未知消息]";
    }
  }

  function receiversOffline(req, res) {
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
    var params = req.params
    var contentStr = params.content;
    var msg = JSON.parse(contentStr);
    //系统消息跳过
    // if (msg._lctype == msgTypeSystem){
    //   res.success({skip: true});
    //   return;
    // }
    var msgDesc = getMsgDesc(msg);
    var alertStr = msg._lcattrs.cy_name + '：' + msgDesc;
    var pushMessage = getAPNSPushMessage(params.convid,"");
    res.success({pushMessage: pushMessage});
  }

  //设置推送消息
  function getAPNSPushMessage(convId,alertStr) {
    var json = {
      badge: "Increment",
      sound: "default",
      convid: convId     //来支持点击弹框，跳转至相应对话
      // ,"_profile": "dev"      //设置证书，开发时用 dev，生产环境不设置
    };
    json.alert = alertStr;
    return JSON.stringify(json);
  }

  exports.receiversOffline = receiversOffline; // used by main.js