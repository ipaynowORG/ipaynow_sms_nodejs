

var util = require('./util');

exports.App = function (appId,appKey,desKey){
	this.appId=appId;
	this.appKey=appKey;
	this.desKey = desKey;
}




exports.send_hy = function (app,mobile,content,mhtOrderNo,notifyUrl){
	return send(app,mobile,content,"S01",mhtOrderNo,notifyUrl)
}

exports.send_yx = function (app,mobile,content,mhtOrderNo,notifyUrl){
	return send(app,mobile,content,"YX_01",mhtOrderNo,notifyUrl)
}






function send(app,mobile,content,type,mhtOrderNo,notifyUrl) {

	var m = {};
	
	m['funcode'] = type;
	m['appId'] = app.appId;
	m['content'] = util.url_encode(content);
	if(mhtOrderNo != ""){
		m['mhtOrderNo'] = mhtOrderNo;
	}else{
		
		m['mhtOrderNo'] = util.generateMixed(13);
	}
	m['mobile'] = mobile;
	m['notifyUrl'] = notifyUrl;

	content = util.postFormLinkReport(m);

	var message1 = "appId="+app.appId+"";
	message1 = new Buffer(message1).toString('base64');

	

	var message2 = content;
	message2 = util.encrypt(message2,app.desKey);

	

	var message3 = new Buffer(util.md5(content+"&"+app.appKey)).toString('base64');	

	

	var message = message1+"|"+message2+"|"+message3+"";
	
	message = encodeURIComponent(message);

	

	return post("funcode="+type+"&message="+message,"https://sms.ipaynow.cn");
}





exports.query = function(app,nowPayOrderNo,mobile) {

	var m = {};
	
	m['funcode'] = 'SMS_QUERY';
	m['appId'] = app.appId;
	m['nowPayOrderNo'] = nowPayOrderNo;
	m['mobile'] = mobile;

	content = util.postFormLinkReport(m);

	var mchSign = new Buffer(util.md5(content+"&"+app.appKey));

	content = content+"&mchSign="+mchSign;

	return post(content,"https://sms.ipaynow.cn");
	
}







function post(content,posturl){
	var https = require('https');
	var util = require('util');
	var url = require('url');
	var querystring = require('querystring');


	var post_option = url.parse(posturl);
	post_option.method = "POST";

	post_option.headers = {
    	'Content-Type' : 'text/html',
    	'Content-Length' : content.length
	};
	
	var result = "";
	var post_req = https.request(post_option,function(res){
    	res.setEncoding('utf8');
    	res.on('data',function(chunk){
        	result += chunk;
    	});
    	res.on('end', function() {
            console.log("result="+result);
        });
    
	});
	post_req.write(content);
	post_req.end();
	return result;
}