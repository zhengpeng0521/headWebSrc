import { message } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import { stuQuickSign , querySignSelf } from '../../../../services/erp/stu-sign/studentSignService';
import { lodopPrintStuSignSelf } from '../../../../utils/lodopPrintUtils';

/*学员自主签到*/
export default {

  namespace: 'stuSignBySelfModel',

  state: {
      visible: false, //是否显示弹窗
      stepFlg: true, //是否安装了lodoop控件
      qrcode: '',

      qrcodeUrl: '',
      stuSignList: [],//学员签到数据
      lodopResourceDownloadUrl: 'http://saas.ishanshan.com/saas3.0/lodop_pring_resource.rar',
  },

  effects: {

      //显示和打开自助扫描签到窗口
      *showSwitch({ payload }, { call, put, select }) {
          if (!window.LODOP) {
              yield put({
                type : 'initLodopConfing',
              });
          }

          var sleep = function(ms) {
            return new Promise(function(resolve, reject){
                    setTimeout(function(){
                        resolve()
                    }, ms);
                });
            }
          yield sleep(500);
          yield put({
            type : 'validateLodopConfig',
          });
          yield put({
            type : 'updateState',
            payload: {
                visible: true,qrcode: '',
            }
          });
      },

      *closeShow({ payload }, { call, put, select }) {
        yield put({
            type : 'updateState',
            payload: {
                visible: false,stuSignList: [],
            }
          });
          window._init_data.query_sign_self = false;//关闭自助扫码签到扫描
      },

      //校验lodop的配置是否正确
      *validateLodopConfig({ payload }, { call, put, select }) {
          try{
			if (window.LODOP && window.LODOP.VERSION) {
			     yield put({
                    type : 'updateState',
                    payload : {
                        stepFlg: true,
                    }
                });
                yield put({
                    type : 'querySignSelf',
                });
			} else {
                yield put({
                    type : 'updateState',
                    payload : {
                        stepFlg: false,
                    }
                });
            }
		 }catch(err){
             console.info('err', err);
 		 }
      },

      //扫码签到记录
      *querySignSelf({ payload }, { call, put, select }) {
          window._init_data.query_sign_self = true;//打开自助扫码签到扫描
          let params = {
              pageIndex: 0,
              pageSize: 5,
              status: '2',
              isOnlyToday: true,
          };
          var sleep = function(ms) {
                return new Promise(function(resolve, reject){
                    setTimeout(function(){
                        resolve()
                    }, ms);
                });
            }
          while(window._init_data.query_sign_self) {
              let {ret} = yield call(querySignSelf,parse(params));
              if( ret && ret.errorCode == 9000 ){
                  yield put({
                    type : 'updateState',
                    payload : {
                        stuSignList: ret.results,
                        qrcodeUrl: ret.linkUrl,
                    }
                  });
              } else {
                  message.error((ret && ret.errorMessage) || '查询扫码签到记录出错啦!');
              }
              yield sleep(1000);
          }
      },

      //扫码签到
    *signByQrcode({ payload }, { call, put, select }) {
        let { qrcodeStr } = payload;

        let arr = qrcodeStr.split('@@');
        let cont = arr[1].split('#');

        let tenantId = cont[0];
        let orgId = cont[1];
        let stuId = cont[2];
        let qrcodeId = cont[3];
        let key = orgId + '_' + stuId + '_' + qrcodeId;

        let dayStr = moment().format('YYYY-MM-DD HH:mm');
        let signBySelf = window._init_data.signBySelf || {};
        let signBySelfDayObj = signBySelf[dayStr] || {};
        let signBySelfValue = signBySelfDayObj[key];

        if(signBySelfValue == undefined || signBySelfValue == '') {
            signBySelfDayObj[key] = '1';
            signBySelf[dayStr] = signBySelfDayObj;
            window._init_data.signBySelf = signBySelf;//用来控制当天签到过得不会重复签到

            //打印签到情况 orgName, stuName, scheduleType, courseName, classroomName, signType, costNum, signTime
            //LODOP_PrintStuSignSelf('杭州美吉姆早教中心滨江店', '王大海', '班课', '音乐课二届', '玉兰山', '补课', 4, '2017-04-23 13:33:22');

            //自主 快速签到
            let { ret } = yield call( stuQuickSign, parse({ id : qrcodeId , status : '2' }) );
            if(ret && ret.errorCode == 9000 ){
                if(!!ret.courseName && ret.courseName.length > 0){
                    if(!!ret.courseNamePrint){
                        for(let i in ret.courseName){
                            lodopPrintStuSignSelf(ret.orgName || '', ret.stuName || '', ret.courseName[i] || '' , ret.parentName || '', ret.signTimeStr || '', ret.logoUrl || '');
                        }
                    }else{
                        lodopPrintStuSignSelf(ret.orgName || '', ret.stuName || '', '' , ret.parentName || '', ret.signTimeStr || '', ret.logoUrl || '');
                    }
                }else{
                    message.warn(`${ret.stuName}本日无排课信息`);
                    lodopPrintStuSignSelf(ret.orgName || '', ret.stuName || '', '' , ret.parentName || '', ret.signTimeStr || '', ret.logoUrl || '');
                }
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '签到失败')
                window._init_data.signBySelf[dayStr][key] = '';
            }
        }
        yield put({
            type : 'updateState',
            payload : {
                qrcode: '',
            }
        });
    },

      //初始化lodop打印配置
      *initLodopConfing({ payload }, { call, put, select }) {
//            let {ret} = yield call(getLodopConfig);
            let ret = {
                errorCode: 9000,
                host: '127.0.0.1',
                port: '18000',
            };
            if(ret && ret.errorCode == 9000) {
                let {host,port} = ret;
                yield put({
                    type: 'updateState',
                    payload : {
                        host,
                        port,
                    }
                });

                let head= document.getElementsByTagName('body')[0];

                let lodopjs_script= document.createElement('script');
                lodopjs_script.type= 'text/javascript';
                lodopjs_script.name= 'lodopjs';
                lodopjs_script.src= 'http://' + host + ':' + port + '/CLodopfuncs.js';

                lodopjs_script.onreadystatechange= function () {
                    if (this.readyState == 'complete')  {
                        initGetCLodopFunc();
                    }
                }
                lodopjs_script.onload= function(){
                    initGetCLodopFunc();
                }
                head.appendChild(lodopjs_script);

                function initGetCLodopFunc() {
                    window.LODOP = getCLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'));
                }

            }
        },
  },

  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      showSwitchReduce(state, action) {
          let {visible} = state;
          return {...state, visible: !visible, loading: false, qrcode: '', signInfo: {}, };
      },
  },
}
