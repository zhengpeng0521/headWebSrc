import {
    GetCheckBoxAndChoose,       //获取checkbox并且获取选中了哪些
    SaveSmallTicketSet          //保存设置选项
} from '../../../../services/system/small-ticket-set/AttendancePrint';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'attendancePrint',

    state: {
        loading : false,                //是否加载状态
        id : '',                        //id
        checkOptions : [],              //可以选择的checkbox
        initCheckedBox : [],            //初始选中的数组
        initTicketBottomContent : '',   //初始小票底部内容
        ticketBottomContent : '',       //小票底部内容
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_rece_kq_list') {
                    //获取checkbox并且获取选中了哪些
                    dispatch({
                        type:'GetCheckBoxAndChoose',
                        payload:{
                            type:0
                        }
                    });
                }
            });
        },
    },

    effects: {
        //获取checkbox并且获取选中了哪些
        *'GetCheckBoxAndChoose'({ payload },{ put , call , select }){
            const { ret } = yield call(GetCheckBoxAndChoose,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                //取出选中项的value
                let initArray = [];
                for(let i in ret.checkedConfArray){
                    initArray.push(ret.checkedConfArray[i].value);
                }
                let initBottomContent = '';
                //判断选中项是否包含小票底部，若包含则赋值
                if(initArray.indexOf('recBottom') > -1){
                    initBottomContent = ret.checkedConfArray[initArray.indexOf('recBottom')].content;
                }
                yield put({
                    type:'updateState',
                    payload:{
                        checkOptions : ret.confArray,
                        initCheckedBox : initArray,
                        ticketBottomContent : initBottomContent,
                        initTicketBottomContent : ret.defaultContent,
                        id : ret.id
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
        },

        //保存设置选项
        *'SaveSmallTicketSet'({ payload },{ put , call , select }){
            yield put({type:'showLoading'});
            const { ret } = yield call(SaveSmallTicketSet,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success('保存成功');
                yield put({
                    type:'GetCheckBoxAndChoose',
                    payload:{
                        type : payload.type
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('保存配置信息出错');
            }
            yield put({type:'closeLoading'});
        },
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLoading(state, action) {
            return { ...state, loading : true};
        },
        closeLoading(state, action) {
            return { ...state, loading : false};
        },
    },
};
