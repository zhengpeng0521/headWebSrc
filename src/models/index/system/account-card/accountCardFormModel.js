import { message } from 'antd';
import { parse } from 'qs';
import { getDictByKey , getAccountCardDetail, createAccountCard, updateAccountCard } from '../../../../services/system/account-card/accountCardService';

export default {

  namespace: 'accountCardFormModel',

  state: {
      visible: false,   //表单窗口是否显示
      loading: false,
      paymentList: [],//支付方式列表
      formData: {},  //表单的初始值
      selectValue : '',
      orgSelectVisible: false,
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {

          });
      },
  },

  effects: {

      /*初始化支付方式下拉框*/
      *initDict({ payload } , { put , call , select }){
          let { ret } = yield call(getDictByKey, parse(payload));
          if( ret && ret.errorCode == 9000 ){
            let paymentList = [];
            for(let i in ret.list){
                if(ret.list[i].key != 'pos'){
                    paymentList.push(ret.list[i])
                }
            }
            yield put({
                type : 'updateState',
                payload : {
                    paymentList,
                }
            });
          } else {
            message.error((ret && ret.errorMessage) || '没有获取到支付方式列表');
          }
      },

        /*显示首付款账号的表单*/
        *showAccountCardForm({ payload } , { put , call , select }){
            yield put({ type : 'initDict' , payload : { dictkey: 'payment' } })
            let id = payload && payload.id;
            if(id != undefined && id != '') {
                let { ret } = yield call( getAccountCardDetail, parse({id}));
                if( ret && ret.errorCode == 9000 ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            formData: {
                                id: ret.results.id,
                                organs: ret.results.organs,
                                paymentkey: ret.results.paymentkey,
                                paymentvalue: ret.results.paymentvalue,
                                rate: ret.results.rate,
                                acctNo: ret.results.acctNo,
                                name: ret.results.name,
                                ourBank : ret.results.ourBank,
                                accountName : ret.results.accountName,
                                mPayAccount : ret.results.mPayAccount,
                            },
                            visible: true,
                            loading: false,
                            selectValue : ret.results.paymentvalue,
                        }
                    });

                } else {
                    message.error((ret && ret.errorMessage) || '收付款账号不存在或者已经被删除');
                }
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        visible: true,
                        loading: false,
                        formData: {},
                    }
                });
            }
        },

        /*提交保存*/
        *onSubmit({ payload } , { put , call , select }){
            yield put({ type : 'updateState', payload : { loading : true }});
            let afterSubmit = payload.afterSubmit;
            let closeForm = payload.closeForm;
            let params = payload.params;
            let result = {};
            params.paymentvalue = params.paymentkey;
            params.rate = (params.rate != undefined && params.rate > 0) ? parseFloat(params.rate) * 1.0 / 100 : 0;
            if(params.id == undefined || params.id == '') {
                result = yield call( createAccountCard, parse(params));
            } else {
                result = yield call( updateAccountCard, parse(params));
            }
            let ret = result.ret;
            if( ret && ret.errorCode == 9000 ){
                message.success('收付款方式保存成功!');
                closeForm && closeForm();
                afterSubmit && afterSubmit();
                yield put({
                    type : 'accountCardModel/queryList'
                })
            } else {
                message.error((ret && ret.errorMessage) || '收付款方式保存失败');
            }
            yield put({ type : 'updateState', payload : { loading: false }});
        },
    },


  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      onClose(state, action) {
          return {...state, visible: false, loading: false, formData: {},}
      },

  }
}
