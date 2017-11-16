

var util = require('./util');

exports.App = function (appId,appKey,desKey){
	this.appId=appId;
	this.appKey=appKey;
	this.desKey = desKey;
}



	/**
     * 发送行业短信(需要在运营后台-短信服务管理 中进行配置)
	 * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mobile    发送手机号
     * @param content   发送内容
     * @param mhtOrderNo    商户订单号,可为空(自动生成)。商户订单号和状态报告通知中的相关字段对应
     * @param notifyUrl 后台通知地址
     */
exports.send_hy = function (app,mobile,content,mhtOrderNo,notifyUrl){
	return send(app,mobile,content,"S01",mhtOrderNo,notifyUrl)
}

	/**
     * 发送营销短信(需要在运营后台-短信服务管理 中进行配置)
	 * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mobile    发送手机号
     * @param content   发送内容
     * @param mhtOrderNo    商户订单号,可为空(自动生成)。商户订单号和状态报告通知中的相关字段对应
     * @param notifyUrl 后台通知地址
     */
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

	

	return post("funcode="+type+"&message="+message,"https://sms.ipaynow.cn",app);
}




	/**
     * 查询短信发送结果(状态报告)
     * @param nowPayOrderNo 现在支付订单号(send_yx和send_hy方法的返回值)
     * @param mobile 手机号
     */
exports.query = function(app,nowPayOrderNo,mobile) {

	var m = {};
	
	m['funcode'] = 'SMS_QUERY';
	m['appId'] = app.appId;
	m['nowPayOrderNo'] = nowPayOrderNo;
	m['mobile'] = mobile;

	content = util.postFormLinkReport(m);

	var mchSign = new Buffer(util.md5(content+"&"+app.appKey));

	content = content+"&mchSign="+mchSign;

	return post1(content,"https://sms.ipaynow.cn");
	
}







function post(content,posturl,app){
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
            if(result.split("|").length==2){	
			}else{
            	var return2 = result.split("|")[1];

				var util = require('./util');
            	var originalMsg = util.decrypt(return2.replace(/[\r\n]/g,""),app.desKey);
				console.log(originalMsg);
			}
        });
    
	});
	post_req.write(content);
	post_req.end();
	return result;
}



function post1(content,posturl){
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
            if(result.split("|").length==2){	
			}else{
            	console.log("result="+result); 
			}
        });
    
	});
	post_req.write(content);
	post_req.end();
	return result;
}