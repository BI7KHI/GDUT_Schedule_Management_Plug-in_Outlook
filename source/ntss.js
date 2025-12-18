/**
 * jQuery EasyUI 1.3.2
 *
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 *
 */
/** Deal with the result of ajax request edit */
var kbJcArr = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14'];
function dealEditResult(result,msg,dialogId,datagridId){
	var len= arguments.length;
	if(len == 2){
		dialogId = 'dlg';
		datagridId = 'datalist';
	}
	if(result >= 0){
		$.messager.show({title:msg+'信息',msg:'操作成功.',timeout:1000,showType:'fade'});
		$('#'+dialogId).dialog('close');
		$('#'+datagridId).datagrid('reload');
	}else if(result == -1){
		$.messager.alert(msg+'信息',msg+'已存在!','warning');
	}else if(result == -3){
		$.messager.alert(msg+'信息',msg+'存在子记录,请删除子记录后再操作!','warning');
	}else if(result == -302){// 登录超时
		timeoutLogin();
	}else{
		$.messager.alert(msg+'信息','<b>操作失败</b></br></br>'+result,'error');
	}
}

// 登录超时，重新登录
function timeoutLogin(){
	$.messager.alert('登录超时','请重新登录后，再继续操作!','error',
						function(){
								$("<div id='login-dlg'></div>").dialog({
									title:'请登录',
									width:350,
									height:220,
									// closed: false,
									closable: false,
									modal: true,
									href:'./mains/login/dlgLogin.html',
									hrefMode:"iframe",
									onClose:function(){$(this).dialog('destroy');}
								});
							});
}

function getSelectedDataGridIds(dataGridId,keyName){
	var ids =[];
	var rows = $('#'+dataGridId).datagrid('getSelections');
	for(var i=0;i<rows.length;i++){
		ids.push(rows[i][keyName]);
	}
	return ids.join(',');
}
function ajaxBatchDelWithConfirm(url,delwhat,dataGridId,keyName){
	var ids = getSelectedDataGridIds(dataGridId,keyName);
	if(ids =='') {
		$.messager.alert(delwhat,'请选择记录!','error');
		return false;
	}else{
		$.messager.confirm(delwhat,'确定要删除'+delwhat+'?',function(r){
		    if (r){
		    	$.post(url,{ids:ids},
		    			function(result){
		    				if(result>=0){
			    				$.messager.show({title:delwhat,msg:'影响'+result+'条记录!',timeout:2000,showType:'fade'});
			    				$('#'+dataGridId).datagrid('reload');
		    				}else if(result == -3){
		    					$.messager.alert(delwhat,'存在子记录,请删除子记录后再操作!','warning');
		    					$('#'+dataGridId).datagrid('reload');
		    				}else{
		    					$.messager.alert(delwhat,'<b>操作错误</b>:</br></br>'+result,'error');
		    				}
		    			},'text'
		    	);
		    }
		});
	}
}
// 基本方法
function myAjax(url,callback,data){// 得到数据
	$.post(url,data,callback,'text');
}
function jToObject(s){
	  return eval("({" + s + "})");
}
// 原生JavaScript随机数时间戳
function uniqueId(){
    var a=Math.random,b=parseInt;
    return Number(new Date()).toString()+b(10*a())+b(10*a())+b(10*a());
}

// 增加easyui 列拖动功能:使用方法 1.$('#gridId').datagrid().datagrid("columnMoving");
/*
$.extend($.fn.datagrid.methods,{
	   columnMoving: function(jq){
	       return jq.each(function(){
	          var target = this;
	          var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
	          cells.draggable({
	              revert:true,
	              cursor:'pointer',
	              edge:5,
	                proxy:function(source){
	                    var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:1px solid #ff0000"/>').appendTo('body');
	                    p.html($(source).text());
	                    p.hide();
	                    return p;
	                },
	                onBeforeDrag:function(e){
	                    e.data.startLeft = $(this).offset().left;
	                    e.data.startTop = $(this).offset().top;
	                },
	                onStartDrag: function(){
	                    $(this).draggable('proxy').css({
	                        left:-10000,
	                        top:-10000
	                    });
	                },
	                onDrag:function(e){
	                    $(this).draggable('proxy').show().css({
	                        left:e.pageX+15,
	                        top:e.pageY+15
	                    });
	                    return false;
	                }
	            }).droppable({
	                accept:'td[field]',
	                onDragOver:function(e,source){
	                    $(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
	                    $(this).css('border-left','1px solid #ff0000');
	                },
	                onDragLeave:function(e,source){
	                    $(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
	                    $(this).css('border-left',0);
	                },
	                onDrop:function(e,source){
	                    $(this).css('border-left',0);
	                    var fromField = $(source).attr('field');
	                    var toField = $(this).attr('field');
	                    setTimeout(function(){
	                        swapField(fromField,toField);
	                        $(target).datagrid();
	                        $(target).datagrid('columnMoving');
	                    },0);
	                }
	            });
	            // swap Field to another location
	            function swapField(from,to){
	                var columns = $(target).datagrid('options').columns;
	                var cc = columns[0];
	                _swap(from,to);
	                function _swap(fromfiled,tofiled){
	                    var fromtemp;
	                    var totemp;
	                    var fromindex = 0;
	                    var toindex = 0;
	                    for(var i=0; i<cc.length; i++){
	                        if (cc[i].field == fromfiled){
	                            fromindex = i;
	                            fromtemp = cc[i];
	                        }
	                        if(cc[i].field == tofiled){
	                            toindex = i;
	                            totemp = cc[i];
	                        }
	                    }
	                    cc.splice(fromindex,1,totemp);
	                    cc.splice(toindex,1,fromtemp);
	                }
	            }
	        });
	    }
});*/

// 添加easyui columens列编辑功能
$.extend($.fn.datagrid.defaults.view,{
	onAfterRender:function(target){
		var dg = $.data(target,'datagrid');
		var dc = dg.dc;
		var header = dc.header2;
		var opts = $.data(target,'datagrid').options;
		var columns = opts.columns;
		$.each(columns[0],function(i,item){
			if(item.batchUpdateable){
				col = header.find('[field="'+item.field+'"] > div');
				col.css('font-weight','bold').css('font-style','italic').attr('title','右击批量修改['+item.title+"]").unbind("contextmenu")
				.bind("contextmenu",function(){// 添加自定义右击事件
					var datagridId = (typeof(item.batchUpdateable.datagridId) == "undefined" || item.batchUpdateable.datagridId =="")? "datalist":item.batchUpdateable.datagridId;// console.log(datagridId);
					var keys = getSelectedDataGridIds(datagridId,item.batchUpdateable.pkField);
					if(keys == ''){
						$.messager.alert('提示信息','请先勾选要修改的记录!','error');
						return false;
					};

					/*
					 * 执行前置执行的函数 用来做特殊的判断业务 如果返回的是ok,则继续往下执行
					 * 如果返回的不是ok，则屏蔽批量修改功能，并提示返回信息
					 */
					if(typeof(item.batchUpdateable.preHandler) == 'function') {
						var ret = item.batchUpdateable.preHandler();
						if(ret!='ok') {
							$.messager.alert('提示信息',ret,'error');
							return false;
						}
					}
					$.post(getCtxPath()+'new/batchUpdateService/datas?type='+item.batchUpdateable.type,
							{src:item.batchUpdateable.src,right:item.batchUpdateable.right,data:item.batchUpdateable.data},
							function(result){
								if(result != '-1'){
									var options = {
											type: 1,
										    title: ["批量修改["+item.title+']', 'border:none; background:#E0ECFF; color:#0E2D5F;height:26px;'],
										    area: ['auto', 'auto'],
										    border: [1,1,'#E0ECFF'],
										    shade: [0.4,"#ccc"],
										    zIndex: 19,
										    closeBtn: [0, true],
//										    shift: 'top',
										    success: function(layero, index){
//										        console.log(layero, index);
										    	var iType = document.getElementById("sval").tagName;
										    	var $sval = $('#sval');
										    	// select
										    	if(iType == "SELECT") {
										    		$sval.click();
										    	}else if(iType == "INPUT") {
										    		$sval.focus();
										    	}
										    }
									};

									var configOptions = item.batchUpdateable.options;

									if(item.batchUpdateable.type == 'select'){// select
										var res = eval(result);
										var str = '<select id="sval" name="sval" style="width:200px;" class="ntssselect" >';

										var allowNull = false;// 默认不允许为空
										if(typeof(item.batchUpdateable.allowNull) != 'undefined'){
											allowNull = item.batchUpdateable.allowNull;
										}

										if(allowNull){
											str +='<option value="">   </option>';
										}
										$.each(res,function(i,o){
											str += "<option value='"+o.dm+"'>"+o.mc+"</option>";
										});
										str += "</select>";
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"+str
								    		+"<input type='button' value='确定' onclick=doBatchUpdate('"+opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
								    		+"</div>"};
								    	options['page']=page;
										$.layer(options);

									}else if(item.batchUpdateable.type == 'selectd'){// select + data
										var data = item.batchUpdateable.data || [];
										var str = '<select id="sval" name="sval" style="width:200px;" class="ntssselect" >';

										var allowNull = false;// 默认不允许为空
										if(typeof(item.batchUpdateable.allowNull) != 'undefined'){
											allowNull = item.batchUpdateable.allowNull;
										}

										if(allowNull){
											str +='<option value="">   </option>';
										}
										$.each(data,function(i,o){
											str += "<option value='"+o+"'>"+o+"</option>";
										});
										str += "</select>";
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"+str
												+"<input type='button' value='确定' onclick=doBatchUpdate('"+opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
												+"</div>"};
										options['page']=page;
										$.layer(options);

									}else if(item.batchUpdateable.type == 'text'){// text
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"
												+"<input type='text' name='sval' id='sval' value='' style='width:200px' >"
									    		+"<input type='button' value='确定' style='width:44px' onclick=doBatchUpdate('"+opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
									    		+"</div>"};
									    	options['page']=page;
											$.layer(options);
									}else if(item.batchUpdateable.type == 'combobox'){// combobox
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"
											+'<input id="sval" name="sval" value="" style="width:200px">'
								    		+"<input type='button' value='确定' onclick=doBatchUpdate('"+opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
								    		+"</div>"};
								    	options['page']=page;
										$.layer(options);
										$("#sval").combobox({
											valueField: 'dm',
											textField: 'mc',
											url:item.batchUpdateable.src + (item.batchUpdateable.src.indexOf('?')!=-1?'&ids=':'?ids=') + keys,
											multiple: item.batchUpdateable.multiple,
											delay:800,
											mode:'remote',
											formatter:(item.batchUpdateable.formatItem == undefined)?'':item.batchUpdateable.formatItem,
//											onSelect:function(){
//												if(item.batchUpdateable.multiple){
//													($("#sval2").combobox('getValues')=='')?'':$("#sval").val($("#sval2").combobox('getValues'));
//												}else{
//													($("#sval2").combobox('getValue')=='')?'':$("#sval").val($("#sval2").combobox('getValue'));
//												}
//											},
											onLoadSuccess: function(){
												$(this).combobox('showPanel');
											}
										});
									}else if(item.batchUpdateable.type == 'datebox'){// datebox
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"
											+'<input id="sval" name="sval" value="" style="width:200px">'
								    		+"<input type='button' value='确定' onclick=doBatchUpdate('"+	opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
								    		+"</div>"};
								    	options['page']=page;
										$.layer(options);
										$("#sval").datebox();
										$("#sval").datebox('showPanel');
									}else if(item.batchUpdateable.type == 'datetimebox'){// datetimebox
										var page ={html:"<div id='batchUpdateDiv' style='width:250px; height:30px; padding:0; border:1px solid #ccc; background-color:#eee;'>"
											+'<input id="sval" name="sval" value="" style="width:200px">'
								    		+"<input type='button' value='确定' onclick=doBatchUpdate('"+	opts.id+"','"+item.batchUpdateable.type+"','"+item.batchUpdateable.url+"','"+item.batchUpdateable.field+"','"+item.batchUpdateable.pkField+"') />"
								    		+"</div>"};
								    	options['page']=page;
										$.layer(options);
										var dateTimeFormat = 'yyyy-MM-dd hh:mm:ss';
										if(configOptions && configOptions.format) {
											dateTimeFormat = configOptions.format;
										}

										$("#sval").datetimebox({showSeconds: false,formatter:function(date){return date.format(dateTimeFormat);}});
										$("#sval").datetimebox('showPanel');
									}
								}else{
									$.messager.alert('权限错误','您没有批量修改['+item.title+']的权限!','error');
								}
					},'json');
					return false;// 屏蔽系统默认右击事件
				});
			}

			if(item.tips != undefined){
				var field = item.field;
				if(typeof(item.tips) == 'function'){
					$(dc.body2).find('td[field="'+field+'"]').each(function(){
						var rowIndex = $(this).parent().attr('datagrid-row-index');
						var contents = item.tips(dg.data.rows[rowIndex]);
						//console.log(contents)
						if(contents)tips($(this).find('div'),contents,{alignX: 'center',alignY: 'top'});
					});
				}else{
					if(item.tips){
						//var $td = $(dc.body2).find('td[field="'+field+'"]');
						$(dc.body2).find('td[field="'+field+'"]>div').each(function(){
							if($(this).html())tips($(this),$(this).html(),{alignX: 'center',alignY: 'top'});
						});
					}
				}
			}
		});
    }
});

$.extend($.fn.validatebox.defaults.rules,{
	number : {
		validator : function(value){//只接受数字
			return /^[0-9]*$/.test(value);
		},
		message : '请输入数字'
	},
	numberOrLetter : {//只接受字母或数字
		validator : function(value){
			return /^[a-zA-Z0-9_-]*$/.test(value);
		},
		message : '只接受数字或大小写字母'
	},
	disableChinese: {//不接受中文
        validator: function (value) {
        	if(/^[\Α-\￥]+$/i.test(value)){
        		return false;
        	}
        },
        message: '不按受中文输入'
    }
});
/**
 * 处理批量修改请求 type:弹出框的类型 url: 数据源(select,combobox) field:要更新字段
 * pkfield:datagrid中的checkbox主键名称
 */
function doBatchUpdate(datagrid,type,url,field,pkField){
	var keys = getSelectedDataGridIds(datagrid,pkField);
	var sval = '';
	switch (type) {
		case 'datebox' :
			sval = $("#sval").datebox('getValue');
			break;
		case 'datetimebox' :
			sval = $("#sval").datetimebox('getValue');
			break;
		case 'combobox' :
			if(!validCombobox('sval','dm', ''))return false;
			sval = $("#sval").combobox('getValues').join(',');
			break;
		default:
			sval = $("#sval").val();
			break;
	}
	// 判断是否为旧操作
	if (url.indexOf('.action') > -1) {
		$.post(url, {
						field: field,
						sval: sval,
						keys: keys
					},
				function(result){
					layer.closeAll();
					if(result>=0){
						$.messager.show({title:'系统提示',msg:'批量修改'+result+'条记录成功!',timeout:600,showType:'fade'});
					}else{
						$.messager.alert('系统提示','<b>操作失败</b></br>'+result,'warning');
					}
					$('#'+datagrid).datagrid('reload');
				},'text'
		);
	}else {
		entss.post(url, {
			field: field,
			sval: sval,
			keys: keys
		},
			function (result) {
				layer.closeAll();
				entss.dealRes({
					result: result,
					datagridId: datagrid,
					title: '系统提示',
					timeout: 2000
				});
			}, 'json'
		);
	}
}
// 合并对象方法
var extend = function(o, n, override) {
	for ( var p in n)
		if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)){
			o[p] = n[p];
			// alert(("属性:"+p+"的值是 ("+ o[p] +")"));
		}
	return o;
};

/**
 * 级联操作提示等待
 */
function showCue(){
	$("#dialog").css("opacity","0.8");
	var w = $(window).width(), h = $(window).height();
	l = (w - 400)/2+"px",t = (h - 200)/2+"px";
	$("#dialog").css({"display":"block","width":w,"height":h,"top":0,"left":0});
	$("#dback").css({"top":t,"left":l});
}

function getPostValue(v){// 需要通过AJAX传值的
	r='';
	$.each($(":text"), function (it,t) {
	if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'){r+=$(t).attr('id')+":'"+trim($(t).val())+"',";}
	});
	$.each($("textarea"), function (it,t) {
		if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'){r+=$(t).attr('id')+":'"+trim($(t).val())+"',";}
	});

	$.each($(":hidden"), function (it,t) {
	if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'){r+=$(t).attr('id')+":'"+$(t).val()+"',";}
	});
	$.each($("select"), function (it,t) {
	if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'){r+=$(t).attr('id')+":'"+($(t).val()==null?"":$(t).val())+"',";}
	});
	$.each($(":checkbox"), function (it,t) {
	if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'){r+=$(t).attr('id')+":'"+($(t).attr('checked')=='checked'?1:0)+"',";}
	});
	$.each($(":radio"), function (it,t) {
	if($(t).attr('auto')!=undefined&&$(t).attr('auto')=='yes'&&$(t).attr('checked')){r+=$(t).attr('name')+":'"+$(t).val()+"',";}
	});
	if(v==''){if(r!='')r=r.substring(0,r.length-1);}else r+=v;
	return jToObject(r);
}
function getRealLen(str){// 得到长度
	return str.replace(/[^\x00-\xFF]/g, '**').length;
}

/** *显示等待层*** */
function showMask(){
	$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height(),"z-index":10000}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候.....").appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2,"z-index":10001});
}
function closeMask(){
	$(".datagrid-mask").hide();
	$(".datagrid-mask-msg").hide();
}
function back(){// 返回
	window.location.reload();
}

// 日期格式化，用法var d =new Date().format('yyyy-MM-dd');
Date.prototype.format = function(format)
{
	var o = {
		"M+" : this.getMonth()+1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth()+3)/3), // quarter
		"S" : this.getMilliseconds() // millisecond
	};
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};

/*******************************************************************************
 * 扩展combobox，用于验证是否从下拉框中选值 para1：domid; para2：setValue target; para3:error msg
 ******************************************************************************/
function validCombobox(domId,valueTarget,msg){
	var datas;
	var right=true;
    var wrong=false;
    var textField = $('#'+domId).combobox('options').textField;
    var val = $('#'+domId).combobox('getValue');
	var text = $('#'+domId).combobox('getText');
    datas = $('#'+domId).combobox('getData');
    if(text!=''){
    	for(var obj in datas){
    		if(val == datas[obj][valueTarget]) return right;
    	}
    	for(var obj in datas){
	    	if(text == datas[obj][textField]){
	    		$('#'+domId).combobox('setValue',datas[obj][valueTarget]);
	    		return right;
	    	}
	    }
    	$.messager.alert('警告!','<br>请选择'+msg+'下拉框的值!','warning');
    	return wrong;
    }
    return right;
}

// 判断浏览器类型，以便做兼容 (留用)
function userAgent(){
    var ua = navigator.userAgent;
    ua = ua.toLowerCase();
    var match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) ||
    [];
    // match[2]判断版本号
    switch(match[1]){
     case "msie":      // ie
      if (parseInt(match[2]) == 6)    // ie6
       return "ie6";
      else if (parseInt(match[2]) == 7)    // ie7
       return "ie7";
      else if (parseInt(match[2]) == 8)    // ie8
       return "ie8";
      else if (parseInt(match[2]) == 9)    // ie9
       return "ie9";
      else if (parseInt(match[2]) == 10)    // ie10
       return "ie10";
      else if (parseInt(match[2]) == 11)    // ie11
       return "ie11";
      break;
     case "webkit":     // safari or chrome
      return "webkit";
      break;
     case "opera":      // opera
      return "opera";
      break;
     case "mozilla":    // Firefox
      return "Firefox";
      break;
     default:
      break;
    }
}
function trim(str){return str.replace(/(^\s*)|(\s*$)/g, "");}// 去除头尾空格
function getCn(str){
	return encodeURI(encodeURI(str,'utf-8'),'utf-8');
}
function encodeChineseURL(url) {
	var turl = '',
		str1 = null,
		i = 0;
	if (typeof url === 'string') {
		if (url.indexOf('?')>-1) {
			str1 = url.split('?'),str2=str1[1].split('&');
			turl += str1[0]+"?";
			// turl += 'rndcounter='+Math.random()+'&';//增加随机数参数，避免缓存
			for (; i<str2.length; i += 1) {
				var str3 = str2[i].split('=');
				if((/[^\x00-\xFF]/g).test(str3[1])) {
					str3[1]=encodeURI(encodeURI(str3[1])); // 对中文部分进行转码
				}
				turl += str3[0] + '=' + str3[1] + '&';
			}
			turl = turl.substring(0,turl.length-1);
			url = turl;
		}
		return url;
	}
	return '';
}

// EasyUI datagrid 动态导出Excel
function exporter(datagridId){
	var len= arguments.length;
	if(len == 0){
		datagridId = 'datalist';
	}
	$('<div id="printdlg"></div>').dialog({
		href:'exportservice!export.action?datagridId='+datagridId,
		title:'导出表格数据',
		width:300,height:150,
		hrefMode:"iframe",modal:true,iconCls:"icon-edit",
		onClose:function(){$(this).dialog('destroy');}
	});
}

// 仿照java加上endWith和startWith
String.prototype.endWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	return false;
	if(this.substring(this.length-s.length)==s)
	return true;
	else
	return false;
	return true;
	};

String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	return false;
	if(this.substr(0,s.length)==s)
	return true;
	else
	return false;
	return true;
	};


var index;
function popLayer(url,title){
	index = $.layer({
		    type: 2,
		    title: [title, 'border:none; background:#E0ECFF; color:#0E2D5F;'],
		    shadeClose: false,
		    move:false,
		    shade: [0.4,"#ccc"],
		    border: [1,1,'#E0ECFF'],
		    fix: false,
		    maxmin: false,
		    iframe: {src : url},
		    area: [ $(window).width()-10, $(window).height()-6]
	});
}
function closeLayer(){
	layer.close(index);
	// window.location.reload();
}

// 弹窗
function openIframeDialog(options){
	var defaults = {
// id : '',
// url : '',
		width	:	600,
		height	:	400,
		title	:	'查看',
		modal:true,
		hrefMode:"iframe",
		onClose:function(){$(this).dialog("destroy");}
	};

	options = $.extend(defaults, options);

	// 先渲染dlg，再加载
	var $dlg = $('<div id="ifmdlg"><iframe scrolling="auto" style="width:100%;height:100%;" frameborder="0"></iframe></div>');
	var ret = $dlg.dialog(options);
	$dlg.find('iframe')[0].src=options.url;
	return ret;
}

// 顶层弹窗适用于课表显示
function openWindow(options){
	var defaults = {
		url		:	'',
		width	:	600,
		height	:	400,
		title	:	'查看'
	};
	options = $.extend(defaults, options);
	var iWidth = options.width;
	var iHeight = options.height;
	var iTop = (window.screen.availHeight-30-iHeight)/2; // 获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; // 获得窗口的水平位置;
	var curwin = 'newwindow'+uniqueId();
	var newWindow = window.open(options.url, curwin,'height='+options.height+',width='+options.width+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
	return newWindow;
// options = $.extend(defaults, options);
// return parent.$('<div><iframe scrolling="auto" frameborder="0"
// src="'+options.url+'"
// style="width:100%;height:100%;"></iframe></div>').dialog({
// width:options.width,
// height:options.height,
// title:options.title,
// modal:false,
// close:true,
// draggable:true,
// animate: true,
// minimizable: false,
// onClose:function(){$(this).dialog("destroy");}
// });
}

function formatWeek(num){
	var ret = "";
	switch(num){
		case "1":ret = "一";break;
		case "2":ret = "二";break;
		case "3":ret = "三";break;
		case "4":ret = "四";break;
		case "5":ret = "五";break;
		case "6":ret = "六";break;
		case "7":ret = "日";break;
		default: ret = "";
	}
	return ret;
}

function isBefore(begin,end){
	// 将字符串转换为日期
    var begin=new Date(begin.replace(/-/g,"/"));
    var end=new Date(end.replace(/-/g,"/"));
    // js判断日期
    if(begin-end<0){
// alert("开始日期要在截止日期之前!");
       return true;
    }else {
    	return false;
    }
}


// 解析算法表达式
function exp_isOperator(value){
    var operatorString = "+-*/()";
    return operatorString.indexOf(value) > -1;
}

function exp_getPrioraty(value){
    switch(value){
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        default:
            return 0;
    }
}

function exp_prioraty(o1, o2){
    return exp_getPrioraty(o1) <= exp_getPrioraty(o2);
}

function getExpResult(exp){
    var inputStack = [];
    var outputStack = [];
    var outputQueue = [];
    var tempStr = '';
    exp = trim(exp);
    for(var i = 0, len = exp.length; i < len; i++){
        var cur = exp[i];
        if(cur != '' ){

        	if(cur!= '+' &&cur != '-' && cur != '*' && cur != '/' && cur != '(' && cur != ')') {
	        	tempStr += cur;
        	}else {
        		inputStack.push(tempStr);
        		tempStr = '';
        		inputStack.push(cur);
        	}
// inputStack.push(cur);
        }
    }

    if(tempStr!='') {
    	inputStack.push(tempStr);
    	tempStr = '';
    }

    while(inputStack.length > 0){
        var cur = inputStack.shift();
        if(exp_isOperator(cur)){
            if(cur == '('){
                outputStack.push(cur);
            }else if(cur == ')'){
                var po = outputStack.pop();
                while(po != '(' && outputStack.length > 0){
                    outputQueue.push(po);
                    po = outputStack.pop();
                }
                if(po != '('){
                    throw "error: unmatched ()";
                }
            }else{
                while(exp_prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0){
                    outputQueue.push(outputStack.pop());
                }
                outputStack.push(cur);
            }
        }else{
            outputQueue.push(new Number(cur));
        }
    }
    if(outputStack.length > 0){
        if(outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '('){
            throw "error: unmatched ()";
        }
        while(outputStack.length > 0){
            outputQueue.push(outputStack.pop());
        }
    }
    return evalExp(outputQueue);

}


function evalExp(rpnQueue){
    var outputStack = [];
    while(rpnQueue.length > 0){
        var cur = rpnQueue.shift();

        if(!exp_isOperator(cur)){
            outputStack.push(cur);
        }else{
            if(outputStack.length < 2){
                throw "unvalid stack length";
            }
            var sec = outputStack.pop();
            var fir = outputStack.pop();

            outputStack.push(exp_getResult(fir, sec, cur));
        }
    }

    if(outputStack.length != 1){
        throw "unvalid expression";
    }else{
        return outputStack[0];
    }
}

function exp_getResult(fir, sec, cur) {
	 sec = parseFloat(sec);
	 fir = parseFloat(fir);
	 switch(cur){
     case '+':
    	 return fir+sec;
    	 break;
     case '-':
         return fir-sec;
         break;
     case '*':
    	 return fir*sec;
    	 break;
     case '/':
         return fir/sec;
         break;
     default: return 0;
	 }
}

// 返回 ''表示1:1,返回其他表示按照公式进行折算
function _calculate(ksxzdm,fs,jfdm) {
	var ret = [];
	if(_zsgs.length<=0){//没有折算公式
		return ret;
	}
	var _fs1 = 0;
	var _fs2 = 0;
	fs = parseFloat(fs);
	var _flag = false;
	for(var i=0;i<_zsgs.length;i++) {
		_flag = false;
		if(ksxzdm==_zsgs[i].ksxzdm&&jfdm==_zsgs[i].zdval) {
			_fs1 = parseFloat(_zsgs[i].fs1);
			_fs2 = parseFloat(_zsgs[i].fs2);
			if(fs>=_fs1 && fs< _fs2) {
				_flag = true;
			}
		}
		if(_flag) {
			ret.push(_zsgs[i].zsgs);
			ret.push('x');
			break;
		}
	}

	if(jfdm!='') {
		for(var i=0;i<_zsgs.length;i++){// 表示启用加分，开始匹配公式，匹配加分项
			_flag = false;
			if(ksxzdm==_zsgs[i].ksxzdm&&jfdm==_zsgs[i].zdval&&_zsgs[i].xszd=='jfdm') {
				_fs1 = parseFloat(_zsgs[i].fs1);
				_fs2 = parseFloat(_zsgs[i].fs2);
				if(fs>=_fs1 && fs< _fs2) {
					_flag = true;
				}
			}
			if(_flag) {
				ret = [];// 匹配最佳的折算公式
				ret.push(_zsgs[i].zsgs);
				ret.push('x');
				break;
			}
		}
	}
	return ret;
}


/**
 * val 加密数据 style 加密数据类型，1 表示身份证 0表示其他
 */
function encrypt(val,style) {
	var ret = '';
	if(val=='') {
		return '';
	}
	switch(style) {
		case 1:
			// 身份证数据加密
			ret = val.substring(0,4)+'**********'+val.substring(val.length-4);
			break;
		case 0:
			ret = val.substring(0,val.length-4)+'****';
			break;
		default:
			ret = '';
	};
	return ret;
}

// dialog 高度最大值
function pageMaxHeight(height) {
	return ($(window).height() > height) ? height : $(window).height();
}
//dialog 宽度最大值
function pageMaxWidth(width) {
	return ($(window).width() > width) ? width : $(window).width();
}

function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g,''); // 去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); // 去除行尾空白
    // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');// 去掉&nbsp;
    return str;
}

function myEval(val) {
	return eval(val);
}

// tips
function tips(obj,html,option){
	var defaultOption = {
		className: 'tip-yellowsimple',
		alignTo: 'target',
		alignX: 'left',
		alignY: 'center',
		allowTipHover: true,
	 	offsetY: 10,
	 	offsetX: 10,
		fade: false,
		slide: false,
		content: function(updateCallback) {
				if(html)
				return html;
				else{
					return "无";
				}
		}
	};
	obj.poshytip($.extend(defaultOption,option));
}

// 销毁tips
function destroyTips(obj) {
	obj.poshytip('destroy');
}
// 更新tips内容
function updateTips(obj,html) {
	obj.poshytip('update',html);
}

function getWeekSummary(zcs){
	var arr = zcs.split(",");
	var len = arr.length;
	if(len<2) return arr;
	arr.sort(function(a,b){return a-b;});// 从小到大排序
	var retArr = new Array();
	var _startZc = arr[0];
	var z=0;
	for(var i=1;i<len;i++){
		if(parseInt(_startZc) + i -z != arr[i] ){// 不连续
			z = i;
			if(_startZc == arr[i-1])
				retArr.push(_startZc+"");
			else
				retArr.push(_startZc+"-"+arr[i-1]);
			_startZc = arr[i];
		}
		if(i==len-1){
			if(_startZc == arr[i])
				retArr.push(_startZc+"");
			else
				retArr.push(_startZc+"-"+arr[i]);
		}
	}
	return retArr;
}

// 获取basePath
function getCtxPath() {
	var m = $("meta[name=ctxPath]");

	return m.attr("content");
}
function sortByNumber(a,b){//easyui自定义排序方式
  if(a.length > b.length){
	  return 1;
  }else if(a.length < b.length){
	  return -1;
  }else if(a > b){
	  return 1;
  }else{
	  return -1;
  }
}
//下拉列表全选反选 id：为input表单的id ，list的字段名需要为 dm mc
function initCombobox(id,list){
	var id = "#"+id;
	var selectarray = ["-1"];
	var comboboxarray = [];
	$(id).append("<option id='all' value='-1' style='color:red'>全选 | 反选</option>");
	comboboxarray.push("-1");
	for(var i=0;i<list.length;i++){
		$(id).append("<option value='" + list[i].dm + "'>" + list[i].mc + "</option>");
		comboboxarray.push(list[i].dm);
   	}
	$(id).combobox({
		multiple:true,//可多选
		editable:false,//可编辑
		icons:[{
			iconCls:'icon-add'
		},{
			iconCls:'icon-cut'
		}],
		onSelect:function (record) {
			selectarray.push(record.value);
		 	if($(id).combobox('getText').split(",").length!=selectarray.length){
				selectarray=[];
				selectarray.push(record.value);
			};
			if(record.value==-1){//全选
				$(id).combobox('setValues', comboboxarray);
				selectarray = comboboxarray.concat();
			}else{
				$(id).combobox('setValues', selectarray);
			};
		},
		onUnselect:function (record) {
			if(record.value==-1){//取消全选
				$(id).combobox('setValues', "");
     			selectarray=[];
			}else{
				for(var ele in selectarray){
			 		if(selectarray[ele]==record.value){
				 		selectarray.splice(ele,1);
					}
				};
			};
		},
	});
}
//定时关闭提示框 icon：error,question,info,warning.
function alertSetTimeout(title,msg,icon,time){
	$.messager.alert(title,msg,icon);
	setTimeout(function(){
		$(".messager-body").window('close');
	},time);
}

//-----------------------------------------------------------------------------------------------------------------------
//结合键盘SHIFT,CTRL,ALT键实现DataGrid单选或多选   hjh
//用法：1、在页面的 <body> 标签中加入两个属性 onkeydown="javascript:keyPress(event);" onkeyup="javascript:keyRelease(event)"
//		2、在数据网格DataGrid加入onClickRow属性并调用MultiSelect方法
//		如：,onClickRow: function(index, row) { multiSelect(this.id,index,row); }
//------------------------------------------------------------------------------------------------------------------------
var KEY = {SHIFT: 16,CTRL: 17,ALT: 18,DOWN: 40,RIGHT: 39,UP: 38,LEFT: 37};
var selectIndexs = {firstSelectRowIndex: 0,lastSelectRowIndex: 0};
var inputFlags = {isShiftDown: false,isCtrlDown: false,isAltDown: false};
//是否禁用网页上选取的内容
function onselectstart(param){
	document.onselectstart = function(){
		event.returnValue = param;
	}
}

//响应键盘按下事件
function keyPress(event) {
	var e = event || window.event;
  	var code = e.keyCode | e.which | e.charCode;
  	switch (code) {
  	case KEY.SHIFT://按下shift按键
  		inputFlags.isShiftDown = true;
//  	$('#'+datagrid).datagrid('options').singleSelect = false;//按下shift时设置为多选
  		onselectstart(false);//禁用网页上选取内容
  		break;
  		default:
	}
}
//响应键盘按键放开的事件
function keyRelease(event) {
    var e = event || window.event;
    var code = e.keyCode | e.which | e.charCode;
    switch (code) {
    case KEY.SHIFT://释放shift按键
        inputFlags.isShiftDown = false;
//		selectIndexs.firstSelectRowIndex = 0;
//		$('#'+datagrid).datagrid('options').singleSelect = true;//释放shift时设置为单选
        event.returnValue = true;
		onselectstart(true);//释放网页上选取内容
		break;
    	default:
    }
}
//提供datagrid调用
function multiSelect(datagrid,index,row) {
	//如果选中行不等于第一行 并且 不在按住shift过程中点击
	if (index != selectIndexs.firstSelectRowIndex && !inputFlags.isShiftDown) {
		selectIndexs.firstSelectRowIndex = index;
	}
	//按住shift点击时
	if (inputFlags.isShiftDown) {
		$('#'+datagrid).datagrid('clearSelections');
		selectIndexs.lastSelectRowIndex = index;
		if (selectIndexs.firstSelectRowIndex > selectIndexs.lastSelectRowIndex) {//一选index大于二选
			for (var i = selectIndexs.lastSelectRowIndex ; i <= selectIndexs.firstSelectRowIndex ; i++) {
				$('#'+datagrid).datagrid('selectRow', i);
			}
		}else{//二选index大于一选
			for (var i = selectIndexs.firstSelectRowIndex ; i <= selectIndexs.lastSelectRowIndex ; i++) {
				$('#'+datagrid).datagrid('selectRow', i);
			}
		}
	}
}


// 审核渲染linkbutton的参数
function auditButton(shztdm, clickFun) {
	var icon;
	var text;

	switch(shztdm) {
	case '0' : icon = 'forbid'; text = '退回'; break;
	case '1' : icon = 'waittingapply'; text = '未审核'; break;
	case '2' : icon = 'shing'; text = '审核中'; break;
	case '3' : icon = 'ok'; text = '审核通过'; break;
	case '4' : icon = 'no'; text = '审核不通过'; break;
	default: icon = 'waittingapply'; text = '审核';
	}

	var button = '<a href="javascript:;" class="audit-button"'
		+' data-options="plain:true,iconCls:\'icon-'+icon+'\'" onclick="'+clickFun+'">'+text+'</a>';

	return button;
}


// 评价审核结果
function auditSummary(shztdm, shr, shyj, shsj) {
	if(!shztdm || !shr) {
		return '';
	}

	var h = shr;

	if(shztdm == '2' || shztdm == '3') {
		h += '审核通过；'
	}else if(shztdm == '4') {
		h += '审核不通过；'
	}else if(shztdm == '0') {
		h += '退回；'
	}

	h += '意见：' + shyj;
	h += '；时间：' + shsj;
	return h;
}

/**
 * 打开评论功能的对话窗口
 * @param module 模块，通常为表名，例如：k_0001；必填
 * @param article_id 文章主键，通常为 module 表下记录的主键，例如 k_0001 表中 kcrwdm 的值；如果整个 module 表共用一份评论，则填 -1,；必填
 * @param showtext 显示在评论框左下角的文本内容，同时也是 s25 的 article_title, 非必填
 * @param title 对话框的 title，非必填
 * @param readOnly 是否只读，默认为false，非必填
 * @param height 对话框的高度，非必填
 * @param width 对话框的宽度，非必填
 */
function openCommentDialog(module, article_id, showtext, title, readOnly, height, width) {
	if(!(module && article_id)){
		return;
	}
	
	if(showtext) {
		showtext = getCn(showtext);
	}
	
	openIframeDialog({
		url : getCtxPath()+"new/comment/openCommentDialog?module=" + module + "&article_id=" + article_id + "&showtext=" + showtext + "&article_title=" + showtext + "&readOnly=" + readOnly,
		width : width ? pageMaxWidth(width) : pageMaxWidth(800),
		height : height ? pageMaxHeight(height) : pageMaxHeight(1200),
		title : title ? title : '评论信息',
		iconCls : "icon-comment",
		onClose:function(){$(this).dialog('destroy');}
	});

}

function checkEnter(e) { //禁止textarea输入回车/换行
	var et = e || window.event;
	var keycode = et.charCode || et.keyCode;
	if (keycode == 13) {
		if (window.event) {
			window.event.returnValue = false;
		} else {
			e.preventDefault();
		}
	}
}

// 审核渲染linkbutton的参数（含当前审核节点）
function auditButtonShjd(shztdm, clickFun, dqshjd) {
	var icon;
	var text;
	switch (shztdm) {
		case '0': icon = 'forbid'; text = '退回'; break;
		case '3': icon = 'ok'; text = '审核通过'; break;
		case '4': icon = 'no'; text = '审核不通过'; break;
		default: {
			if (dqshjd > 0 && shztdm && shztdm == '2') {
				icon = 'shjd' + dqshjd; text = '审核中';
			} else {
				icon = 'waittingapply'; text = '未审核';
			}
		}
	}
	return '<a href="javascript:;" class="audit-button" title="' + text + '"'
		+ ' data-options="plain:true" onclick="' + clickFun + '"><img src="' + getCtxPath() + 'styles/themes/icons/' + icon + '.png"></a>';
}

/**
 * 封装查看图片插件的构造
 * 插件github文档：https://github.com/fengyuanchen/viewerjs
 * @param options 配置
 */
function parsePictureViewer(options) {
	var picturesObj = document.getElementById(options.id);
	if (picturesObj) {
		var isRotate = false
		var defaults = {
			zIndex: 9999,
			// 关闭CSS动画
			transition: false,
			toolbar: {
				oneToOne: true,
				prev: function () {
					viewer.prev(true);
				},
				play: false,
				next: function () {
					viewer.next(true);
				},
				download: function () {
					var a = document.createElement('a');
					a.href = viewer.image.dataset.path || viewer.image.src;
					a.download = viewer.image.alt;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				},
				rotateLeft: 4,
				rotateRight: 4,
			},
			viewed() {
				// All methods are available here except "show".
				// this.viewer.zoomTo(1).rotateTo(180);
			},
			rotated: function (event) {
				if (options.postRotate) {
					if(isRotate) {
						isRotate = false;
						return ;
					}
					var path;
					viewer.image.src.replace(/filename=([^&]*?)&/, function(m, $1) {
						path = $1;
					});

					showMask();
					$.post(getCtxPath() + 'new/download/rotateImage', {
						path: path,
						angle: event.detail.degree
					}, function (result) {
						if (result.code >= 0) {
							viewer.image.src = viewer.image.src.replace(/&_[\d\.]+/, '')+'&_'+Math.random();
							$(event.target).find('img').each(function(index, el){
								var sourcePath = '';
								el.src.replace(/filename=([^&]*?)&/, function(m, $1) {
									sourcePath = $1;
								});
								if(sourcePath === path) {
									$(el).attr('src', viewer.image.src);
								}
							});
							isRotate = true;
							viewer.rotateTo(0);
							viewer.update();
						}

						closeMask();
						entss.dealRes({
							result: result
						});
					}, 'json');
				}
			}
		};
		options = $.extend(defaults, options);

		var viewer = new Viewer(picturesObj, options);

		// 增加鼠标悬浮样式
		$("#" + options.id + " img").css("cursor", "zoom-in");
		return viewer;
	}
}