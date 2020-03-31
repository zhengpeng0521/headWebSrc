/*
 *	软电话开启web socket链接
 * @param orgName 机构名称
 * @param orgName 学员姓名
 * @param scheduleType 排课类型
 * @param courseName 课程名称
 * @param classroomName 教室名称
 * @param signType 签到类型
 * @param costNum 花费课时数
 * @param signTime 签到时间
 */
export function beganEyebeamScoket(handleMethod) {

    var MessageID = {
        EventAgentLogin: 580,                   //坐席登入
        EventAgentLogout: 581,                  //坐席签出
        EventAgentNotReady: 582,                //坐席示忙
        EventAgentReady: 583,                   //坐席就绪
        EventRinging: 503,                      //坐席来电
        EventAbandoned: 504,                    //呼叫取回
        EventDialing: 505,                      //坐席拨号
        EventEstablished: 506,                  //呼叫建立
        EventAttachedDataChanged: 507,
        EventDtmfSent: 508,
        EventHeld: 509,
        EventPartyAdded: 510,
        EventPartyChanged: 511,
        EventPartyDeleted: 512,
        EventRetrieved: 513,
        EventReleased: 515,
        EventAgentInfo: 588,
        EventRegistered: 572,
        EventUnregistered: 574,
        EventLinkConnected: 590,
        EventLinkDisconnected: 4500,
        EventError: 9999,
        EventAgentDailyStatistics:2500,
        EventCampaignLoaded:1500,

        EventCampaignStopped:1501,
        EventDialingStarted:1502,
        EventDialingPause:1503,

        EventUpdateTenantIP:1504,
        EventCampaignRatio:1507,
        EventOutboundInfo:1509,
        EventCampaignLoadByFileName:1510,
        EventRetrieveCampaign:1511,
        EventCallLoss:1512,
        EventCallLossDownCSV:1513,
        EventCampaignContactDownCSV:1514,
        EventDownRecord:3501,
        EventRecordList:3502,
        EVENT_RECORD_STOP:2344,
        EventPartyAdded:510
    };

     var agentDN='10012_1001',exten='1001',queue=['10012_8000'],msg_host="101.37.151.228",msg_sport="8080";
    open(agentDN,exten,queue,msg_host,msg_sport,callback);//入口函数,建立websocket连接
    window.agent_socket = '1';

    function callback(data){/*事件处理，data为事件返回的数据*/
      if(data == null)return;
      if (data.deviceState==2) {
          //alert("软电话未能成功加载，请检查是否开启软电话或者软电话注册号码是否与登录坐席一致。");
          handleMethod.eventNotOnline &&　handleMethod.eventNotOnline(data);
          return;
      }
      if(data.messageId == MessageID.EventAgentLogin){//坐席登入
          //console.log("收到EventAgentLogin事件:====:坐席号："+data.thisDN+"班组号："+data.thisQueues[0]+"对应终端状态(0:未知，1:可用，2:不可用)："+data.deviceState);
          handleMethod.eventAgentLogin &&　handleMethod.eventAgentLogin(data);
          agentReady();
      }else if (data.messageId == MessageID.EventAgentReady) {//坐席就绪
          //console.log("收到EventAgentReady事件:===:坐席号："+data.thisDN+"班组号："+data.queue+"坐席状态(0:登出，1:就绪，2:忙碌)："+data.agentState+"对应终端状态(0:未知，1:可用，2:不可用)："+data.deviceState);
          handleMethod.eventAgentReady &&　handleMethod.eventAgentReady(data);
      }else if (data.messageId == MessageID.EventAgentLogout) {//坐席签出
          //console.log("收到EventAgentLogout事件:===:坐席号："+data.thisDN+"班组号："+data.queue);
          handleMethod.eventAgentLogout &&　handleMethod.eventAgentLogout(data);
      }else if (data.messageId == MessageID.EventAgentNotReady) {//坐席示忙
          //console.log("收到EventAgentNotReady事件:===:坐席号："+data.thisDN+"班组号："+data.queue+"坐席状态(0:登出，1:就绪，2:忙碌)："+data.agentState+"对应终端状态(0:未知，1:可用，2:不可用)："+data.deviceState);
          handleMethod.eventAgentNotReady &&　handleMethod.eventAgentNotReady(data);
      }else if (data.messageId == MessageID.EventRinging) {//坐席来电
          //console.log("收到EventRinging事件:===:坐席号："+data.thisDN+"主叫号码："+data.callerDN+"班组号："+data.queue+"callId："+data.callID);
          handleMethod.eventRinging &&　handleMethod.eventRinging(data);
          agentNotReady(3);
      }else if (data.messageId == MessageID.EventRetrieved) {//呼叫取回
          //console.log("收到EventRetrieved事件:===:坐席号："+data.thisDN+"对端号码："+data.otherDN+"班组号："+data.queue+"callId："+data.callID);
          handleMethod.eventRetrieved &&　handleMethod.eventRetrieved(data);
      }else if (data.messageId == MessageID.EventDialing) {//坐席拨号
          //console.log("收到EventDialing事件:===:坐席号："+data.thisDN+"被叫号码："+data.otherDN+"班组号："+data.queue+"callId："+data.callID+"呼叫类型(0:未知；1:内部呼叫；2:呼入；3:呼出)："+data.callType);
          handleMethod.eventDialing &&　handleMethod.eventDialing(data);
      }else if (data.messageId == MessageID.EventEstablished) {//呼叫建立
          //console.log("收到EventEstablished事件:===:坐席号："+data.thisDN+"对端号码："+data.otherDN+"班组号："+data.queue+"callId："+data.callID);
          handleMethod.eventEstablished &&　handleMethod.eventEstablished(data);
      }else if (data.messageId == MessageID.EventHeld) {//呼叫保持
          //console.log("收到EventHeld事件:===:坐席号："+data.thisDN+"对端号码："+data.otherDN+"班组号："+data.queue+"callId："+data.callID);
          handleMethod.eventHeld &&　handleMethod.eventHeld(data);
      }else if (data.messageId ==  MessageID.EventReleased) {//呼叫释放
          //console.log("收到EventReleased事件:===:坐席号："+data.thisDN+"对端号码："+data.otherDN+"班组号："+data.queue+"callId："+data.callID);
          handleMethod.eventReleased &&　handleMethod.eventReleased(data);
          agentReady();
      }

    };
}
