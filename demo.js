

//SDK依赖
var sdk = require('./sdk');
//AppId和AppKey
var app = new sdk.App("150753086263684","zHGKLmQaU9PLMEGObyubsV5uhDAeYVqQ","a8ifp3YwBSjipz3BisGA8akF")

// sdk.send_hy(app,"13401190417","haha哈哈123","","https://op-tester.ipaynow.cn/paytest/notify")

sdk.query(app,"400001201711101739382232061","13401190417");
