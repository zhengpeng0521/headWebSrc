import moment from 'moment';

/*
 *	打印学员自助签到信息
 * @param orgName 机构名称
 * @param orgName 学员姓名
 * @param scheduleType 排课类型
 * @param courseName 课程名称
 * @param classroomName 教室名称
 * @param signType 签到类型
 * @param costNum 花费课时数
 * @param signTime 签到时间
 * @param logoUrl 机构logo
 */
export function lodopPrintStuSignSelf(orgName, stuName, courseName, parentName, signTime, logoUrl) {
    orgName = orgName||'机构名称';
    stuName = stuName||'学员姓名';
    if(signTime && signTime.length > 0) {
        try {
            signTime = moment(signTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        } catch(e) {
            signTime = '错误的时间格式';
        }
    }

    if(window.LODOP) {
        window.LODOP.SET_LICENSES("","4470F7A8FBB8933068DB2CCAF3FC5B6F","C94CEE276DB2187AE6B65D56B3FC2848","");
        window.LODOP.PRINT_INIT(stuName + "扫描自助签到");
        window.LODOP.SET_PRINT_PAGESIZE(3,630,400);
        var html = "";
        html += "<div style='margin: 0; padding: 0; font-family: \"微软雅黑\"'>";
        html += "   <div style='margin-bottom: 5px; padding: 10px 0; background-color: #000; font-size: 14px; font-weight: bold; text-align: center; color: #FFF'>" + orgName + "</div>";
        html += "   <div style='width: 100%; clear: both;'>";
        html += "       <div style='width: 30%; margin-left: 3px; text-align: center; padding-top: 5px; height: 100%; float: left;'>";
        if(!!logoUrl){
            html += "       <img src=" + logoUrl + " width='70px' height='70px' />";
        }
        html += "       </div>";
        html += "       <div style='width: 65%; height: 100%; float: right;'>";
        html += "           <div font-size: 28px; font-weight: bold; color: #000; '>" + stuName + "</div>";
        html += "           <div>";
        if(!!courseName){
            html += "           <div style='font-size: 16px; color: #999; margin-bottom: 2px;'>课程: " + courseName + "</div>";
        }
        if(!!parentName){
            html += "           <div style='font-size: 16px; color: #999; margin-bottom: 2px;'>家长: " + parentName + "</div>";
        }
        html += "               <div style='font-size: 14px; color: #999;'>" + signTime + "</div>";
        html += "           </div>"
        html += "       </div>";
        html += "   </div>";
        html += "</div>";
        window.LODOP.ADD_PRINT_HTM(0,0,"100%","100%", html);
        //window.LODOP.PREVIEW();
        window.LODOP.PRINT();
    } else {
        alert('打印服务未安装');
    }
}

/*考勤签到打印小票*/
export function lodopPrintAttendance(obj) {
    var checkedConfArray = [];        //需要打印的数据数组，每一个元素是需要打印的key值
    var content = obj.content;        //全部数据
    if(!!obj.checkedConfArray && obj.checkedConfArray.length > 0){
        for(var i in obj.checkedConfArray){
            checkedConfArray.push(obj.checkedConfArray[i].value);
        }
    }
    //若配置项中有小票底部，取出小票底部
    var recBottom = '';
    if(checkedConfArray.indexOf('recBottom') > -1){
        recBottom = obj.checkedConfArray[checkedConfArray.indexOf('recBottom')].content;
    }
    if(!window.LODOP){
        return alert('打印服务未启动或未安装');
    }
    if(window.LODOP && !!content && content.length > 0) {
        window.LODOP.SET_LICENSES("","4470F7A8FBB8933068DB2CCAF3FC5B6F","C94CEE276DB2187AE6B65D56B3FC2848","");
        window.LODOP.PRINT_INIT('考勤打印');
        window.LODOP.SET_PRINT_PAGESIZE(3,630);
        var html = '';
        for(var j in content){
            html += '<div>';
            if(content[j].orgName && checkedConfArray.indexOf('orgName') > -1){
                html += '<div style="font-size:20px;text-align:center;padding-bottom:10px;border-bottom:2px solid #000;margin-bottom:3px;">'+ content[j].orgName +'</div>';
            }
            if(content[j].stuName && checkedConfArray.indexOf('stuName') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">学员姓名：'+ content[j].stuName +'</div>';
            }
            if(content[j].courseName && checkedConfArray.indexOf('courseName') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">课程名称：'+ content[j].courseName +'</div>';
            }
            if(content[j].attendTime && checkedConfArray.indexOf('attendTime') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">上课时间：'+ content[j].attendTime +'</div>';
            }
            if(content[j].expendPeriod && checkedConfArray.indexOf('expendPeriod') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">消耗课时：'+ content[j].expendPeriod +'</div>';
            }
            if(content[j].periodLeft && checkedConfArray.indexOf('periodLeft') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">剩余课时：'+ content[j].periodLeft +'</div>';
            }
            if(content[j].mainTeacher && checkedConfArray.indexOf('mainTeacher') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">主教：'+ content[j].mainTeacher +'</div>';
            }
            if(content[j].assTeacher && checkedConfArray.indexOf('assTeacher') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">助教：'+ content[j].assTeacher +'</div>';
            }
            if(content[j].classRoom && checkedConfArray.indexOf('classRoom') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">教室：'+ content[j].classRoom +'</div>';
            }
            if(content[j].sellerName && checkedConfArray.indexOf('sellerName') > -1){
                html += '<div style="font-size:14px;margin-bottom:3px;">所属销售：'+ content[j].sellerName +'</div>';
            }
            if(checkedConfArray.indexOf('recBottom') > -1){
                html += '<div style="border-top:2px solid #000;font-size:14px;"><pre style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all;">'+ recBottom +'</pre></div><br/>';
            }
            html += '</div>';
        }
        window.LODOP.ADD_PRINT_HTM(0,0,"100%","100%", html);
        //window.LODOP.PREVIEW();
        window.LODOP.PRINT();
    }
}
