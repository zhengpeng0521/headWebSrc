import {
    GetStusCheckSameRule,       //获取学员查重规则
    GetLeadsCheckSameRule,      //获取名单查重规则
    Submit                      //提交保存
} from '../../../../../services/system/gong-hai-set/check-same-rule/CheckSameRule';
import { parse } from 'qs';
import { message } from 'antd';

/*查重规则*/
export default {

    namespace: 'checkSameRule',

    state: {
        //学员
        stuQuerySuc : false,                //学员查重规则是否查询成功(成功才渲染组件)
        stuSingleId : undefined,            //学员单个修改序号(传空或不传表示新增)
        stuBatchId : undefined,             //学员批量修改序号(传空或不传表示新增)
        stuSingleScope : undefined,         //学员单个查重范围
        stuBatchScope : undefined,          //学员批量查重范围
        stuSingleConfArray : [],            //学员单个查重可选项(一般是手机号，姓名)
        stuBatchConfArray : [],             //学员批量查重可选项(一般是手机号，姓名)
        stuSingleCheckedConfArray : [],     //学员单个选中的配置项
        stuBatchCheckedConfArray : [],      //学员批量选中的配置项

        //名单
        leadQuerySuc : false,               //名单查重规则是否查询成功(成功才渲染组件)
        leadSingleId : undefined,           //名单单个修改序号(传空或不传表示新增)
        leadBatchId : undefined,            //名单批量修改序号(传空或不传表示新增)
        leadSingleScope : undefined,        //名单单个查重范围
        leadBatchScope : undefined,         //名单批量查重范围
        leadSingleConfArray : [],           //名单单个查重可选项(一般是手机号，姓名)
        leadBatchConfArray : [],            //名单批量查重可选项(一般是手机号，姓名)
        leadSingleCheckedConfArray : [],    //名单单个选中的配置项
        leadBatchCheckedConfArray : [],     //名单批量选中的配置项

        loading : false,                    //整个页面加载状态
        buttonLoading : false,              //按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_sea_repetrule') {
                    //获取学员查重规则
                    dispatch({
                        type:'GetStusCheckSameRule'
                    });
                    //获取名单查重规则
                    dispatch({
                        type:'GetLeadsCheckSameRule'
                    });
                }
            });
        },
    },

    effects: {
        //获取学员查重规则
        *'GetStusCheckSameRule'({ payload },{ put , call , select }){
            yield put({ type:'showSpinning' });
            let { ret } = yield call(GetStusCheckSameRule,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let stuSingleCheckedConfArray = [];
                let stuBatchCheckedConfArray = [];
                for(let i in ret.single.checkedConfArray){
                    stuSingleCheckedConfArray.push(ret.single.checkedConfArray[i].value+'')
                }
                for(let i in ret.batch.checkedConfArray){
                    stuBatchCheckedConfArray.push(ret.batch.checkedConfArray[i].value+'')
                }
                yield put({
                    type:'updateState',
                    payload:{
                        stuSingleId : ret.single.id,
                        stuBatchId : ret.batch.id,
                        stuSingleScope : (!!ret.single.scope || ret.single.scope == 0 ) ? ret.single.scope + '' : undefined,
                        stuBatchScope : (!!ret.batch.scope || ret.batch.scope == 0 ) ? ret.batch.scope + '' : undefined,
                        stuSingleConfArray : ret.single.confArray,                  //学员单个查重可选项(一般是手机号，姓名)
                        stuBatchConfArray : ret.batch.confArray,                    //学员批量查重可选项(一般是手机号，姓名)
                        stuSingleCheckedConfArray,                                  //学员单个选中的配置项
                        stuBatchCheckedConfArray,                                   //学员批量选中的配置项
                        stuQuerySuc : true
                    }
                });
            }else{
                yield put({
                    type:'updateState',
                    payload:{
                        stuQuerySuc : false
                    }
                })
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取学员查重规则出错');
            }
            yield put({ type:'closeSpinning' })
        },

        //获取名单查重规则
        *'GetLeadsCheckSameRule'({ payload },{ put , call , select }){
            yield put({ type:'showSpinning' });
            let { ret } = yield call(GetLeadsCheckSameRule,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let leadSingleCheckedConfArray = [];
                let leadBatchCheckedConfArray = [];
                for(let i in ret.single.checkedConfArray){
                    leadSingleCheckedConfArray.push(ret.single.checkedConfArray[i].value+'')
                }
                for(let i in ret.batch.checkedConfArray){
                    leadBatchCheckedConfArray.push(ret.batch.checkedConfArray[i].value+'')
                }
                yield put({
                    type:'updateState',
                    payload:{
                        leadSingleId : ret.single.id,
                        leadBatchId : ret.batch.id,
                        leadSingleScope : (!!ret.single.scope || ret.single.scope == 0 ) ? ret.single.scope + '' : undefined,
                        leadBatchScope : (!!ret.batch.scope || ret.batch.scope == 0) ? ret.batch.scope + '' : undefined,
                        leadSingleConfArray : ret.single.confArray,                     //学员单个查重可选项(一般是手机号，姓名)
                        leadBatchConfArray : ret.batch.confArray,                       //学员批量查重可选项(一般是手机号，姓名)
                        leadSingleCheckedConfArray,                                     //学员单个选中的配置项
                        leadBatchCheckedConfArray,                                      //学员批量选中的配置项
                        leadQuerySuc : true
                    }
                });
            }else{
                yield put({
                    type:'updateState',
                    payload:{
                        leadQuerySuc : false
                    }
                })
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取名单查重规则出错');
            }
            yield put({ type:'closeSpinning' })
        },

        //提交保存
        *'Submit'({ payload },{ put , call , select }){
            yield put({ type:'showButtonLoading' });
            yield put({ type:'showSpinning' });
            let { ret } = yield call(Submit,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success('保存成功');
                yield put({
                    type:'GetStusCheckSameRule'
                });
                //获取名单查重规则
                yield put({
                    type:'GetLeadsCheckSameRule'
                });
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('保存失败');
            }
            yield put({ type:'closeButtonLoading' })
            yield put({ type:'closeSpinning' })
        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showSpinning(state, action){
            return { ...state , loading : true };
        },
        closeSpinning(state, action){
            return { ...state , loading : false };
        },
        showButtonLoading(state, action) {
            return { ...state , buttonLoading : true };
        },
        closeButtonLoading(state, action) {
            return { ...state , buttonLoading : false };
        },
    },
};
