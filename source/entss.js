/**
 * 自定义工具库
 * 
 */

var entss = {
	config : {
		ajax : {
			timeout : 5000
		},
		combobox : {
			delay : 1000,
			valueField : 'dm',
			textField : 'mc'
		},
		combotree : {
			valueField : 'dm',
			textField : 'mc'
		}
	},
	showMask : function(selector) { // 可以传入选择器
		if (!selector)
			selector = 'body';

		jQuery("<div class=\"datagrid-mask\"></div>").css({
			display : "block",
			width : "100%",
			height : jQuery(selector).height(),
			"z-index" : 10000
		}).appendTo(selector);
		jQuery("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候.....")
				.appendTo(selector).css({
					display : "block",
					left : (jQuery(selector).outerWidth(true) - 190) / 2,
					top : (jQuery(selector).height() - 45) / 2,
					"z-index" : 10001
				});
	},
	closeMask : function(selector) {
		if (!selector)
			selector = 'body';

		jQuery(selector).find(".datagrid-mask").remove();
		jQuery(selector).find(".datagrid-mask-msg").remove();
	},
	ajax : function(options) {
		var self = this;
		var defaults = {
			type : 'get',
			dataType : 'json',
			cache : false,
			timeout : self.ajax.timeout,
			beforeSend : function() {
				if (!jQuery("div").hasClass('datagrid-mask-msg')) {
					self.showMask();
				}
			},
			complete : function() {
				if (jQuery("div").hasClass('datagrid-mask-msg')) {
					self.closeMask();
				}
			},
			error : function() {
				jQuery.messager.alert("错误提示", '请求超时，请稍后重试', 'error');
			}

		};

		return jQuery.ajax(jQuery.extend(defaults, options));
	},
	get : function(url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return this.ajax({
			type : 'get',
			url : url,
			data : data,
			success : callback,
			dataType : type
		});
	},
	post : function(url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return this.ajax({
			type : 'post',
			url : url,
			data : data,
			success : callback,
			dataType : type
		});
	},
	dealRes : function(options) { // 处理ajax返回结果
		// result,options,success,failure
		var defaults = {
			result : {},
			dlgId : '',
			datagridId : '',
			timeout : 1000,
			title : '提示'
		};

		jQuery.extend(true,defaults,options);
		if(defaults.result.code < 0) { // 失败
			if (jQuery.isFunction(defaults.failure)) {
				defaults.failure(defaults.result.message);
			} else {
				jQuery.messager.alert(defaults.title, defaults.result.message,
						'error');
			}
		}else { // 成功
			if(jQuery.isFunction(defaults.success)) {
				defaults.success(defaults.result.data);
			}else{
				if(defaults.dlgId != ''){
					jQuery('#' + defaults.dlgId).dialog('close');
				}
				if (defaults.datagridId != '') {
					jQuery('#' + defaults.datagridId).datagrid('reload');
				}
//				console.log(defaults.result);
				jQuery.messager.show({
					title : defaults.title,
					msg : defaults.result.message,
					timeout : defaults.timeout,
					showType : 'fade'
				});
			}
		}
	},
	combobox : function(options) {
		var defaults = {
			selector : '.combobox',
			params : {
				page : true, // 是否分页
				query : '', // 如果是输入查询，查询的字段
				selectKey : '', // 默认值的字段
				selectValue : '', // 默认值
				where : '',
				guid : '', // 和select标签一样
				otherOp : '' // 可以扩展其他的数据展示 all 表示下拉内容增加 （全部） 选项
			},
			options : jQuery.extend({
				panelHeight : 'auto',
				url : 'comboboxservice!getData.action'
			}, this.config.combobox)
		};

		jQuery.extend(true, defaults, options);

		if (defaults.params) {
			defaults.options.url = defaults.options.url + '?'
					+ jQuery.param(defaults.params);
		}

		return jQuery(defaults.selector).combobox(defaults.options);
	},
	reloadCombobox : function(selector, url, queryParams) {
		if (url.indexOf('?') > -1) {
			url += "&" + jQuery.param(queryParams);
		} else {
			url += "?" + jQuery.param(queryParams);
		}

		jQuery(selector).combobox('clear').combobox('reload', url);
	},
	comboboxSelectFirst : function() { // combobox数据加载成功后选择第一条，使用方法
		// onLoadSuccess:entss.comboboxSelectFirst

		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		}
	},
	combotree : function(options) {
		var defaults = {
			selector : '.combotree',
			params : {
				selectKey : '', // 默认值的字段
				selectValue : '', // 默认值
				where : '',
				guid : '' // 和select标签一样
			},
			options : jQuery.extend({
				lines : true,
				panelHeight : 'auto',
				url : 'comboboxservice!getData.action',
				loadFilter : function(data) {
					// 把dm和mc 转换成 id 和 text
					var newData = [];
					jQuery(data).each(function(i, item) {
						newData.push({
							id : item.dm,
							text : item.mc
						});
					});
					return newData;
				}
			}, this.config.combotree)
		};

		jQuery.extend(true, defaults, options);

		if (defaults.params) {
			defaults.options.url = defaults.options.url + '?'
					+ jQuery.param(defaults.params);
		}

		return jQuery(defaults.selector).combotree(defaults.options);
	},
	reloadCombotree : function(selector, url, queryParams) {
		if (url.indexOf('?') > -1) {
			url += "&" + jQuery.param(queryParams);
		} else {
			url += "?" + jQuery.param(queryParams);
		}

		jQuery(selector).combotree('clear').combotree('reload', url);
	},
	auditOption: {},
	auditButton: function(opt) {
		var defaultOpt = {
			lcdm: '',
			pkField: '',
			pk: '',
			shztdm: '',
			dqshjd: '',
			readonly: '',
			params: ''
		}
		let options = $.extend({}, defaultOpt, opt);
		if (options['params']) {
			options['params'] += '&';
		}
		options['params'] += 'lcdm='+options.lcdm+'&pkfield='+options.pkField+'&pks='+options.pk+'&readonly='+options.readonly;
		var icon;
		var text;
		switch (options.shztdm) {
			case '0': icon = 'forbid'; text = '退回'; break;
			case '3': icon = 'ok'; text = '审核通过'; break;
			case '4': icon = 'no'; text = '审核不通过'; break;
			default: {
				if (options.dqshjd > 0 && options.shztdm && options.shztdm == '2') {
					icon = 'shjd' + options.dqshjd; text = '审核中';
				} else {
					icon = 'waittingapply'; text = '未审核';
				}
			}
		}
		let optionId = 'option_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
		entss[optionId] = options;
		return '<a href="javascript:;" class="audit-button" title="' + text + '"'
			+ ' data-options="plain:true" onclick="entss.auditDialog(\''+optionId+'\')"><img src="' + getCtxPath() + 'styles/themes/icons/' + icon + '.png"></a>';

	},
	auditDialog: function (opt) {
		var defaultOpt = {
			lcdm: '',
			pkField: '',
			pk: '',
			title: '审核',
			params: '',
			onLoad: function () {

			},
			onClose: function () {
				$(this).dialog("destroy");
				$('#datalist').datagrid('reload');
			}
		}
		let options = $.extend({}, defaultOpt, typeof opt === 'string' ? entss[opt] : opt);
		$('<div id="auditDlg">').dialog({
			href: getCtxPath() + 'new/auditing?'+options.params,
			width:pageMaxWidth(900),
			height:pageMaxHeight(600),
			title:options.title,
			modal:true,
			draggable:false,
			hrefMode:"iframe",
			onClose : options.onClose,
			onLoad: options.onLoad
		});
	},
	// 初始化
	initCharts : function(options) {
		var def_options = $.extend({}, options);
		require.config({// 路径配置
			paths : {
				'echarts' : (def_options.basePath || '/entss/')
						+ 'styles/js/echarts-2.2.7/doc/js/echarts'
			}
		});
		require(
				def_options.require || [ 'echarts', 'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
				'echarts/chart/line' // 使用柱状图就加载line模块，按需加载
				],
				function(ec) {// 基于准备好的dom，初始化echarts图表
					var myChart = ec.init(document
							.getElementById(def_options.mainId || "main"));
					option = function() {
						if (def_options.chartType === "pie") {// 默认初始化柱状或者折线图
							return {
								title : def_options.title || {
									text : '',
									subtext : '',
									x : 'center'
								},
								tooltip : def_options.tooltip || {
									trigger : 'item',
									formatter : "{a} <br/>{b} : {c} ({d}%)"
								},
								legend : def_options.legend || {
									orient : 'vertical',
									x : 'left',
									data : [ '无数据' ]
								},
								toolbox : def_options.toolbox || {
									show : true,
									feature : {
										mark : {
											show : true
										},
										dataView : {
											show : true,
											readOnly : false
										},
										restore : {
											show : true
										},
										saveAsImage : {
											show : true
										},
										magicType : {
											show : true,
											type : [ 'pie', 'funnel' ],
											option : {
												funnel : {
													x : '25%',
													width : '50%',
													funnelAlign : 'left',
													max : 1548
												}
											}
										},
									}
								},
								calculable : def_options.calculable === undefined ? true
										: def_options.calculable,
								series : def_options.series || [ {
									name : '访问来源',
									type : 'pie',
									radius : '55%',
									center : [ '50%', '60%' ],
									data : []
								} ]
							};
						} else {
							return {
								title : def_options.title || {
									text : ""
								},
								tooltip : def_options.tooltip || {
									trigger : 'axis'
								},
								legend : def_options.legend || {
									data : [ '无数据' ]
								},
								toolbox : def_options.toolbox || {
									show : true,
									feature : {
										mark : {
											show : true
										},
										dataView : {
											show : true,
											readOnly : false
										},
										magicType : {
											show : true,
											type : [ 'line', 'bar' ]
										},
										restore : {
											show : false
										},
										saveAsImage : {
											show : true
										}
									}
								},
								calculable : def_options.calculable || true,
								xAxis : def_options.xAxis
										|| [ {
											type : def_options.xAxis_type
													|| 'category',
											data : def_options.xAxis_data
													|| [ '无数据' ],
											name : def_options.xAxis_name || '',
											axisLabel : def_options.axisLabel
													|| {}
										} ],
								yAxis : def_options.yAxis || [ {
									type : def_options.yAxis_type || 'value',
									name : def_options.yAxis_yname || ''
								} ],
								series : def_options.series || [ {
									name : '无',
									type : 'bar',
									stack : '数据',
									itemStyle : {
										normal : {
											areaStyle : {
												type : 'default'
											}
										}
									},
									data : []
								} ]
							};
						}
					};
					// 为echarts对象加载数据
					myChart.setOption(option());
				});
	},
	// 弹窗
	openIframeDialog : function(options) {
		var defaults = {
			// id : '',
			// url : '',
			width : 600,
			height : 400,
			title : '查看',
			modal : true,
			hrefMode : "iframe",
			onClose : function() {
				$(this).dialog("destroy");
			}
		};

		options = $.extend(defaults, options);

		// 先渲染dlg，再加载
		var $dlg = $('<div id="ifmdlg"><iframe scrolling="auto" style="width:100%;height:100%;" frameborder="0"></iframe></div>');
		var ret = $dlg.dialog(options);
		$dlg.find('iframe')[0].src = options.url;
		return ret;
	},
	dialog : function(options, dlgId) {

		var dlg = dlgId || 'dlg';
		var defaults = {
			href : "#",
			width : $(window).width() / 2,
			height : $(window).height() / 2,
			title : "查看",
			modal : true,
			hrefMode : "iframe",
			onClose : function() {
				$(this).dialog("destroy");
			}
		};
		var $dlg = $('<div id="' + dlg + '"></div>');
		return $dlg.dialog($.extend(defaults, options));
	},
	// 运行上传文件的后缀
	isAllowUploadFile : function(filename, suffixs) { // suffixs可以为字符串或者数组
		var j = function(suffix) {
			var strRegex = '(.' + suffix + ')$'; // 用于扩展名的正则表达式
			var re = new RegExp(strRegex);
			if (!re.test(filename.toLowerCase())) {
				return false;
			} else {
				return true;
			}
		}

		if (jQuery.isArray(suffixs)) {
			
			for(var i=0;i<suffixs.length;i++){
				if(!j(suffixs[i])){
					$.messager.alert("文件格式不正确","支持上传"+suffixs.join(',')+"格式，请选择正确的文件类型");
					return false; 
				}
			}

		} else if (!j(suffixs)) {
			$.messager.alert("文件格式不正确","支持上传"+suffixs+"格式，请选择正确的文件类型");
			return false;
		}

		return true
	},
	
	// 获取选中行指定列的数据，逗号隔开
	getSelectedDataGridIds: function(dataGridId,keyName){
		var ids =[];
		var rows = $('#'+dataGridId).datagrid('getSelections');
		for(var i=0;i<rows.length;i++){
			ids.push(rows[i][keyName]);
		}
		return ids.join(',');
	},
	
	// ajax批量删除
	ajaxBatchDelWithConfirm: function(url,delwhat,dataGridId,keyName){
		var ids = this.getSelectedDataGridIds(dataGridId,keyName);
		if(ids =='') {
			$.messager.alert(delwhat,'请选择记录!','error');
			return false;
		}else{
			$.messager.confirm(delwhat,'确定要删除'+delwhat+'?',function(r){
			    if (r){
			    	entss.post(url,{ids:ids},
			    			function(result){
			    			
			    		entss.dealRes({
			    				result: result,
			    				datagridId: dataGridId,
			    				title: delwhat,
			    				timeout: 2000
			    			});
			    		
			    			},'json'
			    	);
			    }
			});
		}
	},

	
	/**
	 * 处理批量修改请求 type:弹出框的类型 url: 数据源(select,combobox) field:要更新字段
	 * pkfield:datagrid中的checkbox主键名称
	 */
	doBatchUpdate: function(datagrid,type,url,field,pkField){
		var keys = this.getSelectedDataGridIds(datagrid,pkField);
		var sval = '';
		switch (type) {
			case 'datebox' :
				sval = $("#sval").datebox('getValue');
				break;
			case 'datetimebox' :
				sval = $("#sval").datetimebox('getValue');
				break;
			case 'combobox' :
				if(!this.validCombobox('sval','dm', ''))return false;
				sval = $("#sval").combobox('getValues').join(',');
				break;
			default:
				sval = $("#sval").val();
				break;
		}
		entss.post(url, {
						field: field,
						sval: sval,
						keys: keys
					},
				function(result){
					layer.closeAll();
					entss.dealRes({
	    				result: result,
	    				datagridId: datagrid,
	    				title: '系统提示',
	    				timeout: 2000
	    			});
				},'json'
		);
	},
	
	/*******************************************************************************
	 * 扩展combobox，用于验证是否从下拉框中选值 para1：domid; para2：setValue target; para3:error msg
	 ******************************************************************************/
	validCombobox: function(domId,valueTarget,msg){
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

};

(function() {
	jQuery
			.extend(
					jQuery.fn.datagrid.defaults.editors,
					{
						combo : {
							init : function(container, options) {
								if (options.id === undefined)
									options.id = 'cc';
								var input = jQuery(
										'<select id="' + options.id
												+ '"></select>').appendTo(
										container);
								input.combo(options);
								var html = "";
								html += '<div id="sp_' + options.id + '">';
								var id = options.valueField || 'dm', name = options.textField
										|| 'mc';
								for (var i = 0; i < options.data.length; i++) {
									html += '<input type="checkbox" name="lang" value="'
											+ options.data[i][id]
											+ '"><span>'
											+ options.data[i][name]
											+ '</span><br/>';
								}
								html += '</div>';
								jQuery(html).appendTo(
										jQuery('#' + options.id).combo(
												jQuery.extend({
													panelHeight : 'auto'
												}, options.comboOp)).combo(
												'panel'));
								jQuery('#sp_' + options.id + ' input')
										.click(
												function() {
													var _value = "";
													var _text = "";
													jQuery(
															"#sp_"
																	+ options.id
																	+ " input[name=lang]:input:checked")
															.each(
																	function() {
																		_value += $(
																				this)
																				.val()
																				+ ",";
																		_text += $(
																				this)
																				.next(
																						"span")
																				.text()
																				+ ",";
																	});
													if (_value.length > 0) {
														_value = _value
																.substring(
																		0,
																		_value.length - 1);
													}
													if (_text.length > 0) {
														_text = _text
																.substring(
																		0,
																		_text.length - 1);
													}
													jQuery('#' + options.id)
															.combo('setValue',
																	_value)
															.combo('setText',
																	_text);
												});
								return input;
							},
							destroy : function(target) {
								jQuery(target).combo('destroy');
							},
							getValue : function(target) {
								return jQuery(target).combo('getValue');
							},
							setValue : function(target, value, options) {
								jQuery(target).combo('setValue');
								// 初始化checkbox选中状态
								var selectedValues = value.split(",");
								var optionsId = jQuery(jQuery(target)[0]).attr(
										"id");
								var _value = "";
								var _text = "";
								selectedValues
										.forEach(function(v2) {
											jQuery(
													"#sp_"
															+ optionsId
															+ " input[name=lang]")
													.each(
															function() {
																if (jQuery(this)
																		.val() === v2) {
																	jQuery(this)
																			.attr(
																					"checked",
																					"checked");
																	_value += jQuery(
																			this)
																			.val()
																			+ ",";
																	_text += jQuery(
																			this)
																			.next(
																					"span")
																			.text()
																			+ ",";
																}
															});
										});
								if (_value.length > 0)
									_value = _value.substring(0,
											_value.length - 1);
								if (_text.length > 0)
									_text = _text
											.substring(0, _text.length - 1);
								jQuery('#' + optionsId).combo('setValue',
										_value).combo('setText', _text);
							},
							resize : function(target, width) {
								jQuery(target).combo('resize', width);
							}
						}
					});
}());
