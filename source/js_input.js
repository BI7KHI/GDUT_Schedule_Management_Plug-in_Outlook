TagInput = (function(){
    var elInput,tempData,inp,inpWrap,inpTime,isDel;
    var bindEvent = function(inputBox){
        //始始化各个元素
        elInput = inputBox;
        tempData = inputBox.find("div.enter-temp");
        inp = inputBox.find("input.enter-inp");
        inpWrap = inputBox.find("div.inp-wrap");        
        elInput.bind("click",function(e){            
            bindInput();
            var target = e.srcElement || e.target;
            if(target.tagName == "I" || target.tagName == "EM"){
                var selItem = $(target).parent();
                selItem.hasClass("selected") ? selItem.removeClass("selected") : selItem.addClass("selected");
            }
            else{
                inp.focus();
            }
        });
    };
    //监听 input 值的变化
    var listenInp = function(){
        var oldVal;
        if(inp.val() != oldVal){
            oldVal = inp.val();
            tempData.html(oldVal);
            inpWrap.width(tempData.width()+15);
        }
    };
    // 要求经过的样式
    var itemHover = function(){
        elInput.find(".addr-item").hover(
            function(){
                $(this).addClass("hover");
            },
            function(){
                $(this).removeClass("hover");
            }
        );
    }; 
    //删除一个联系人
    var deleteOne = function(){
        if(inpTime){
            clearInterval(inpTime);
        }
        inpWrap.prev().remove();
        inp.focus();
    };
    //删除一个联系人[点击]
    var delOne = function(){
        elInput.find(".addr-item a").click(function(){
            $(this).parent().remove();
        });
    }; 
    //添加一个联系人
    var addOne = function(id,val){
        var exist = false;
        var added = elInput.find(".addr-item i");
        var inArr = [];
        //var val = val.replace(";","");
        if(added.length > 0){
            added.each(function(){
                inArr.push($(this).attr("addr"));
            });
        }        
        for(var i = 0;i<inArr.length;i++){
            if(inArr[i] == id){
                exist = true;
                break;
            }
            else{
                exist = false;
            }
        }
        if(!exist){
           if(inpTime){
                clearInterval(inpTime);
            }
            if(val != "" && val != ";"){
            	if(isDel){
            		inpWrap.before('<div class="addr-item"><i addr="'+id+'">'+val+'</i><a href="javascript:;"></a></div>');
            	}else{
            		inpWrap.before('<div class="addr-item"><i addr="'+id+'">'+val+'</i></div>');
            	}
            }
            inp.val("");
            delOne();
            itemHover();
        }
        else{
            inp.val("");
            elInput.find('i[addr="'+id+'"]').parent().addClass("selected");
            window.setTimeout(function(){
                elInput.find('i[addr="'+id+'"]').parent().removeClass("selected");
            },180)
        }
    };
    //绑定输入框的事件
    var bindInput = function(){
        if(inpTime){
            clearInterval(inpTime);
        }
        inp.unbind("focus").unbind("blur").unbind("keyup");
        inp.bind("focus",function(){
            inpTime = setInterval(listenInp,50);
        }).bind("blur",function(){
            addOne($(this).attr("dm"),$(this).val());
        }).bind("keyup",function(e){//监听输入框的事件
            if($(this).val() === ""){
                deleteOne();
            }else if(e.keyCode === 13 || e.keyCode === 59 || e.keyCode === 186){
                inp.blur().focus();
            }
        });
    };   
    //从外部添加
    var addFormSelect = function(id,val){
        if(val != ""){
            bindInput();            
            //inp.attr("dm",id);
            //alert(inp.attr("dm"));
            inp.attr("dm",id).val(val).blur().focus();
        }
    };
    return {
        init:function(inputBox){
            bindEvent(inputBox);
        },
        add:function(id,val,canDel){
        	isDel = canDel;
            addFormSelect(id,val);
        }
    }; 
})();

function getJsInputIds(obj_id){
	var added = $("#"+obj_id).find(".addr-item i");
	var idArray = [];
    //var val = val.replace(";","");
    if(added.length > 0){
        added.each(function(){
        	idArray.push($(this).attr("addr"));
        });
    }
    
    var ids = idArray.join(",");
    //alert(ids);
    return ids;
}

function getJsInputvalues(obj_id){
	var added = $("#"+obj_id).find(".addr-item i");
	var valueArray = [];
    //var val = val.replace(";","");
    if(added.length > 0){
        added.each(function(){
        	valueArray.push($(this).text());
        });
    }
    
    var values = valueArray.join(",");
    //alert(values);
    return values;
}