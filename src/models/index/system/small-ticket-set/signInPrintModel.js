import {
    GetCheckBoxAndChoose,       //获取checkbox并且获取选中了哪些
    SaveSmallTicketSet          //保存设置选项
} from '../../../../services/system/sign-in-print/signInPrint';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'signInPrint',

    state: {
        loading : false,                //是否加载状态
        id : '',                        //id
        checkOptions : [],              //打印小票可以选择的checkbox
        radioOptions : [],              //单选框
        initCheckedBox : [],            //需要渲染的数组
        usedCheckedBox : [],            //初始选中的数组(初始化'都不打印'状态)
        nameCardCheckBox : [],          //打印名帖选中数组
        initTicketBottomContent : '',   //初始小票底部内容
        ticketBottomContent : '',       //小票底部内容
        nameCardLogo : [],              //名帖logo
        initRadio : '',
        showModel : false,              //提示框是否显示
        checkedstatus : '1',            //默认打印
        defaultCheckStatus : '1',       //当前保存的类型
        defaultImgUrl : 'https://img.ishanshan.com/gimg/img/cafd679bb3afeaa7f0095c96f1661afd',   //默认图片的url
        wetherSaveSuc : false,          //是否保存成功
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_ticket_sign') {
                    //获取checkbox并且获取选中了哪些
                    dispatch({
                        type:'GetCheckBoxAndChoose',
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
                let selectType = '';
                let initBottomContent = '';//判断选中项是否包含小票底部，若包含则赋值
                let printType = undefined;
                let logo = [];
                for(let i in ret.checkedConfArray){
                    if(ret.checkedConfArray[i].value!='printType'){
                        initArray.push(ret.checkedConfArray[i].value);
                    }
                    if(ret.checkedConfArray[i].value=='printType'){
                        selectType = ret.checkedConfArray[i].content;
                    }
                    if(ret.checkedConfArray[i].value=='recBottom'){
                        initBottomContent = ret.checkedConfArray[i].content;
                    }
                    if(ret.checkedConfArray[i].value=='logo' && !!ret.checkedConfArray[i].content){
                        logo = [{
                            url : ret.checkedConfArray[i].content,
                            uid : -1,
                            name : '机构LOGO图',
                            thumbUrl : ret.checkedConfArray[i].content,
                        }]
                    }
                }

                let showArray = [];
                let defaultContent = ''; //小票底部内容
                for(let i in ret.confArray){     //去除掉小票类型
                    if(ret.confArray[i].value!='printType'){
                        showArray.push(ret.confArray[i]);
                    }
                    if(ret.confArray[i].value=='recBottom'){
                        defaultContent = ret.confArray[i].content
                    }
                }


                //小票打印类型
                let radioType = [];
                for(let i in ret.printTypeArray){
                    radioType.push(ret.printTypeArray[i]);
                }
                if(selectType == '0'){
                    yield put({
                        type:'updateState',
                        payload:{
                            initCheckedBox : []
                        }
                    })
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            initCheckedBox : initArray
                        }
                    })
                }
                yield put({
                    type:'updateState',
                    payload:{
                        checkOptions : showArray,
                        usedCheckedBox : initArray,
                        ticketBottomContent : initBottomContent,
                        initTicketBottomContent : defaultContent,
                        id : ret.id,
                        radioOptions : radioType,
                        checkedstatus : selectType,
                        defaultCheckStatus : selectType,
                        nameCardLogo : logo,
                        wetherSaveSuc : true
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
            return { ...state, ...action.payload , loading : true};
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
    },
};
