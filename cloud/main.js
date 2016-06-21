// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:

//定义
var mchat = require('cloud/mchat');

//签名
//AV.Cloud.define("conv_sign", msign.convSign);

//ios 发送离线消息
AV.Cloud.define("_receiversOffline", mchat.receiversOffline);

