
import { parse } from 'qs';
import { message } from 'antd';
import {
    showAccountFlow,
    showBalance,
    showWithdrawalsRecord,
    checkApplication,
    addSetSubmit,
    getVerificationCode,
    showPayAndRefundDetails,
    showIncomeNums,
} from '../../../../services/financial-center/online-account/AccountDetailsService';
import moment from 'moment';

export default {

    namespace: 'accountDetailsModel',

    state: {
        //账户余额
        accountBalance  :'',        //账户余额
        availableBalance:'',        //可用余额

        //账户流水，提现记录表格
        tableLoading    :false,
        routeChange     :false,     //tab切换
        isChecked       :true,      //账户流水 是否被选中
        isPickOn        :false,     //提现记录 是否被中
        accountFlowData : [],       //账户流水表格数据
        accountFlowNewColumns:[],   //账户流水表格>设置
        accountFlowNewColumns1: [],
        pageIndex       : 0,
        pageSize        : 20,
        total           : '',
        changeState     : '',
        tabsKey         : '',
        tabsKeyArr      : [{id: 'accountWater',name:'账户流水'},
                           {id: 'paymentDetails',name:'支付明细'},
                           {id: 'refundDetails',name:'退款明细'},
                           {id: 'withdrawalsRecord',name:'提现记录'}],
        startDate       : moment(new Date((new Date()).getTime() - 29*24*60*60*1000)).format('YYYY-MM-DD'),
        endDate         : moment().format('YYYY-MM-DD'),
        businessType    : undefined,
        businessName    : undefined,
        orgIds          : '0',
        tenantIds       : undefined,

        //提现申请
        showAlertModal  : false,    //弹框是否显示
        alertModalButtonLoading : false, //弹框加载
        mentionStates : undefined,         //提现申请返回的状态
        mentionWay : undefined,            //提现方式
        mentionPhone : undefined,          //提现手机号
        mentionAcctName : undefined,       //提现账户名
        mentionAcctNo : undefined,			//提现卡号、账号
        mentionBank : undefined,           //开户行
        mentionAlipayAccount : undefined,    //支付宝账号名称

        mentionWayList: [],			//提现方式

        //提现须知
        showXuzhiModal  : false,    //提现须知弹框显示


        tixianjine : '',
        selectValue: '',
        totalIncome     : 0,  		//总收入
		incomeNum		: 0,		//收入几笔
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_orgser_lineaccount') {

                    dispatch({
                        type : 'getBalance',
                        payload : {

                        }
                    });

                    dispatch({
                        type : 'getAccountFlow',
                        payload : {
                            pageSize :20,
                            pageIndex:0,
                            tabsKey : 'accountWater'
                        }
                    });

                }
            });
        },
    },

    effects: {

        //账户余额
        *getBalance({ payload }, { call, put, select }) {
            let res = yield call(showBalance, parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        accountBalance      : ret.results && ret.results.balance || 0,
                        availableBalance    : ret.results && ret.results.unbalance || 0,
                    }
                })
            }else{
                message.error('查询账户信息出错啦');
            }
        },

        //账户流水
        *getAccountFlow({ payload }, { call, put, select }) {
            yield put ({ type : 'showTableLoading' });
            let accountDetailsModel = yield select(state => state.accountDetailsModel);
            let res = yield call(showAccountFlow, parse(payload));
            if (!!res && res.ret && res.ret.errorCode == '9000') {
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        accountFlowData : ret.results || [],
                        isChecked : true,
                        isPickOn : false,
                        routeChange : false,
                        pageIndex : payload.pageIndex || 0,
                        pageSize : payload.pageSize || 20,
                        total : ret.data && ret.data.resultCount || 0,
                        tabsKey : payload.tabsKey,

                    }
                })
            }else{
                message.error('查询账户流水出错啦');
            }
            yield put ({ type : 'closeTableLoading' });
        },

        //提现记录
        *getWithdrawalsRecord({ payload }, { call, put, select }) {
            yield put ({ type : 'showTableLoading' });
            let accountDetailsModel = yield select(state => state.accountDetailsModel);
            let res = yield call(showWithdrawalsRecord, parse(payload));
            if (!!res && res.ret && res.ret.errorCode == '9000') {
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        accountFlowData : ret.results || [],
                        isChecked : false,
                        isPickOn : true,
                        routeChange : false,
                        pageIndex : payload.pageIndex,
                        pageSize : payload.pageSize,
                        total : ret.data.resultCount,
                        tabsKey : payload.tabsKey,
                    }
                })
            }else{
                message.error('查询提现记录出错啦');
            }
            yield put ({ type : 'closeTableLoading' });
        },

        //支付明细 退款明细
        *getPayAndRefundDetails({ payload }, { call, put, select }) {
            yield put ({ type : 'showTableLoading' });
            console.log(payload)
            let accountDetailsModel = yield select(state => state.accountDetailsModel);
            let { ret } = yield call(showPayAndRefundDetails, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        accountFlowData : ret.results || [],
                        isChecked : false,
                        isPickOn : true,
                        routeChange : false,
                        pageIndex : ret.data && ret.data.pageIndex || 0,
                        pageSize : ret.data && ret.data.pageSize || 20,
                        total : ret.data && ret.data.resultCount || 0,
                        tabsKey : payload.tabsKey,
                        startDate : payload.startTime,
                        endDate : payload.endTime,
                        businessType : payload.businessType || undefined,
                        businessName : payload.businessName || undefined,
                        orgIds : payload.orgIds,
                    }
                })

            } else {
                ret && message.error(ret.errorMessage || '查询提现记录出错啦');
            }
            yield put ({ type : 'closeTableLoading' });
        },
        //总收入及收入几笔
        *getIncomeNums({ payload }, { call, put, select }) {
        	console.log(payload)
            let { ret } = yield call(showIncomeNums, parse(payload));
            console.log(ret)
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        totalIncome : ret.data.count,
                        incomeNum :ret.data.num,
                    }
                })
            } else {
                ret && message.error(ret.errorMessage || '查询出错啦');
            }
        },

        //提现申请
        *getApplication({ payload }, { call, put, select }) {
            let res = yield call(checkApplication, parse(payload));
            if(!!res && res.ret && res.ret.errorCode == 10000){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            }else if(!!res && res.ret && res.ret.errorCode == 20000){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            }else if (!!res && res.ret && res.ret.errorCode == 9000) {
                let { ret } = res;
            	let mentionWayList = ret.results || [];
            	let mentionWay = '', mentionPhone = '' ,mentionAcctName = '',mentionAcctNo = '',mentionBank='',mentionAlipayAccount='',mentionId='';
            	if(mentionWayList[0]){
                    mentionWay = mentionWayList[0].paymentKey;
                    mentionPhone = mentionWayList[0].tel;
                    mentionAcctName =  mentionWayList[0].accountName;
                    mentionAcctNo = mentionWayList[0].acctNo;
                    mentionBank = mentionWayList[0].ourBank;
                    mentionAlipayAccount =mentionWayList[0].mPayAccount;
                    mentionId = mentionWayList[0].id;
                }

               yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        mentionWay, mentionWayList, mentionPhone,mentionAcctName,mentionBank,mentionAcctNo,mentionAlipayAccount,mentionId,
                        selectValue : "0",
                        showAlertModal : true,
                    }
                })


            }else if(!!res && res.ret && res.ret.errorCode == 30000 ){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            } else {
                message.error('查询信息出错！');
            }
        },

        //提现申请 提交
        *submitAction({ payload }, { call, put, select }) {
            let accountDetailsModel = yield select( state => state.accountDetailsModel );
            let paymentKey = payload.mentionWayList[payload.mentionWay].paymentKey;
            let parameter = {
                amount : payload.mentionShow,
                tel : accountDetailsModel.mentionPhone,
                vCode : payload.mentionPhoneVal || payload.mentionPhone,
                paymentKey,
                id : accountDetailsModel.mentionId,
            }
           	if(paymentKey == 'bank'){
           			parameter.acctBankName = payload.accountName
           			parameter.openBankName = payload.ourBank
           			parameter.acctNo = payload.acctNo
           	}else if(paymentKey == 'alipay'){

           			parameter.accountName = payload.accountName
           			parameter.acctNo = payload.acctNo

           	}
            let res = yield call(addSetSubmit, parse(parameter));
            if (!!res && res.ret && res.ret.errorCode == 9000) {
                let { ret } = res;
               yield put({
                    type : 'updateState',
                    payload : {
                        showAlertModal : false,
                    }
                })
               //更新展示余额
               yield put({
                    type : 'getBalance',
                    payload : {
                        accountBalance      : ret.results.balance,
                        availableBalance    : ret.results.unbalance,
                    }
                });
                //更新提现记录表格
                yield put({
                    type:'getWithdrawalsRecord',
                    payload:{
                        pageSize : 20,
                        pageIndex : 0,

                    }
                });
                message.success('提现成功！');
            } else {
                message.error('查询信息出错！');
            }
        },

        //获取验证码
        *VerificationCode({ payload }, { call, put, select }) {

            let accountDetailsModel = yield select( state => state.accountDetailsModel );

            let params = {
                mobile : accountDetailsModel.mentionPhone,
            }
            let res = yield call(getVerificationCode, parse(params));
            if (!!res && res.ret && res.ret.errorCode == 9000) {

            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },
         //切换菜单状态改变
        *updateCurrentValue({payload},{put}){

            let {selectValue,mentionWayList} = payload;
            let mentionWay = '', mentionPhone = '' ,mentionAcctName = '',mentionAcctNo = '',mentionBank='',mentionAlipayAccount='', mentionId= "";
            if(mentionWayList[selectValue]){
                mentionWay = mentionWayList[selectValue].paymentKey;
                mentionPhone = mentionWayList[selectValue].tel;
                mentionAcctName =  mentionWayList[selectValue].accountName;
                mentionAcctNo = mentionWayList[selectValue].acctNo;
                mentionBank = mentionWayList[selectValue].ourBank;
                mentionAlipayAccount = mentionWayList[selectValue].mPayAccount;
                mentionId = mentionWayList[selectValue].id;
            }
            yield put({
                 type : 'updateState',
                 payload : {mentionWay, mentionPhone,mentionAcctName ,mentionAcctNo,selectValue,mentionWayList,mentionBank,mentionAlipayAccount,mentionId}
            })
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showTableLoading(state,action){
            return { ...state , tableLoading : true };
        },
        closeTableLoading(state,action){
            return { ...state , tableLoading : false };
        },

    },
};
