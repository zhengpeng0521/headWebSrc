import {
    GetRoleSelectContent,           //搜索栏获取角色下拉列表内容,之后查询列表
    QueryList,                      //列表查询(列表无删除操作，无需进行查询后零数据判断)
    GetCourseSummary,               //打开工资设置modal时获取课程下拉列表内容
    GetTeacherDetail,               //获取老师工资设置的详情信息
    SetSalaryModalSubmit            //工资设置modal提交
} from '../../../../services/system/salary-set/SalarySet';
import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'salarySet',

	state: {
        /*common*/
        courseSelectContent : [],   //课程下拉列表内容

        /*table*/
        newColumns : [],            //table显示项数组
        loading : false,            //table加载状态
        pageIndex : 0,              //table页码
        pageSize : 20,              //table每页条数
        total : 0,                  //table数据总条数
        dataSource : [],            //table数据
        selectedRowKeys : [],       //table复选框选中项的key数组
        selectedRows : [],          //table复选框选中项的数组

        /*快捷搜索*/
        roleSelectContent : [],     //角色下拉列表搜索框内容
        fastSearchContent : {},     //快捷搜索搜索内容

        /*设置工资modal*/
        setSalaryModalVisible : false,          //modal是否显示
        setSalaryModalLoading : false,          //modal加载状态
        setSalaryModalButtonLoading : false,    //modal按钮加载状态
        setSalaryModalData : {},                //编辑时回填数据
        setSalaryCourseCommission : [],         //课时提成渲染数组
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_scfg_salary_set') {
                    //搜索栏获取角色下拉列表内容,之后查询列表
                    dispatch({
                        type : 'GetRoleSelectContent'
                    });
				}
			});
		},
	},

	effects: {
        //搜索栏获取角色下拉列表内容,之后查询列表
        *'GetRoleSelectContent'({payload}, {put, call, select}){
            let { ret } = yield call(GetRoleSelectContent,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        roleSelectContent : ret.results
                    }
                })
                yield put({
                    type : 'QueryList',
                    payload : {
                        pageIndex : 0,
                        pageSize : 20
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取角色信息失败')
            }
        },

        //列表查询(列表无删除操作，无需进行查询后零数据判断)
        *'QueryList'({payload}, {put, call, select}){
            yield put({ type : 'showLoading' });
            let fastSearchContent = !!payload && !!payload.fastSearchContent ? payload.fastSearchContent : {};
            delete payload.fastSearchContent;
            let params = { ...payload , ...fastSearchContent };
            let { ret } = yield call(QueryList,parse(params));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        pageIndex : ret.data.pageIndex,
                        pageSize : ret.data.pageSize,
                        total : ret.data.resultCount,
                        dataSource : ret.results,
                        selectedRowKeys : [],
                        selectedRows : [],
                        fastSearchContent
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取工资设置列表失败')
            }
            yield put({ type : 'closeLoading' });
        },

        //打开工资设置modal时获取课程下拉列表内容
        *'GetCourseSummary'({payload}, {put, call, select}){
            yield put({ type : 'updateState' , payload : { setSalaryModalVisible : true } });
            yield put({ type : 'showSetSalaryModalLoading' })
            let { ret } = yield call(GetCourseSummary,parse(payload));
            if(ret && ret.errorCode == '9000'){
                for(let i in ret.results){
                    ret.results[i].display = true;
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSelectContent : ret.results,
                    }
                })
                //获取老师工资设置的详情信息
                yield put({
                    type : 'GetTeacherDetail',
                    payload : {
                        ...payload
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取课程信息失败');
                yield put({ type : 'updateState' , payload : { setSalaryModalVisible : false } });
            }
            yield put({ type : 'closeSetSalaryModalLoading' })
        },

        //获取老师工资设置的详情信息
        *'GetTeacherDetail'({payload}, {put, call, select}){
            let { ret } = yield call(GetTeacherDetail,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let salarySet = yield select(state => state.salarySet);
                let courseSelectContent = salarySet.courseSelectContent;
                let courseChooseContent = [];       //初始化已选中课程数组
                let setSalaryModalData = ret.dataInfo;          //表单值
                let setSalaryCourseCommission = [];             //初始化工资设置modal中的课时提成数组
                //格式化梯度数据
                function formatGradientCommission(array,parentIndex){
                    for(let i in array){
                        array[i].zj_parent_index = parentIndex;  //zj_parent_index(唯一)
                        array[i].zj_son_index = i;               //zj_son_index(唯一)
                    }
                    return array;
                }
                function formatGradient(type,father,index,sonName,royaltyMethod,payMethod){
                    if(type == 'gradient'){
                        if(father[index][sonName] && JSON.parse(father[index][sonName]).length > 0 && father[index].royaltyMethod == royaltyMethod && father[index].payMethod == payMethod){
                            father[index][sonName] = formatGradientCommission(JSON.parse(father[index][sonName]),index)
                        }else{
                            father[index][sonName] = [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }];
                        }
                    }else if(type == 'fix'){
                        if(father[index][sonName] && (JSON.parse(father[index][sonName]).length > 0) && father[index].royaltyMethod == royaltyMethod && father[index].payMethod == payMethod){
                            father[index][sonName] = JSON.parse(father[index][sonName]);
                        }else{
                            father[index][sonName] = [{ money : undefined }];
                        }
                    }
                }
                if(setSalaryModalData && setSalaryModalData.commission && setSalaryModalData.commission.length > 0){
                    let Commission = setSalaryModalData.commission;
                    for(let i in Commission){
                        courseChooseContent.push(Commission[i].courseId);        //添加已选中课程数组
                        Commission[i].zj_parent_index = i;                       //为课程增加zj_parent_index(唯一,'0','1'...)
                        Commission[i].showErrorBorder = false;                   //梯度报错信息初始化
                        //按到课人次梯度格式化
                        formatGradient('gradient',Commission,i,'gradientOne','1','2');

                        //按授课节数梯度格式化
                        formatGradient('gradient',Commission,i,'gradientTwo','2','2');

                        //按消课金额梯度格式化
                        formatGradient('gradient',Commission,i,'gradientThree','3','2');

                        //固定金额人次/元格式化
                        formatGradient('fix',Commission,i,'personMoney','1','1');

                        //固定金额课次/元格式化
                        formatGradient('fix',Commission,i,'courseMoney','2','1');

                        //固定金额比例格式化
                        formatGradient('fix',Commission,i,'rate','3','1');
                    }
                    for(let i in courseSelectContent){
                        //从已选中的课程数组中找出相应课程置灰下拉列表选项
                        if(courseChooseContent.indexOf(courseSelectContent[i].id) > -1){
                            courseSelectContent[i].display = false;
                        }
                    }
                    setSalaryCourseCommission = Commission;                      //格式化课程提成数组
                }else{
                    //当前老师未设置过工资
                    setSalaryCourseCommission = [{
                        zj_parent_index : '0',
                        courseId : courseSelectContent && courseSelectContent.length > 0 ? courseSelectContent[0].id : undefined,  //如果有课程默认选中课程第一个
                        royaltyMethod : '1' ,                               //提成方式默认选中第一个
                        payMethod : '1',                                    //计算方式默认选中第一个
                        gradientOne : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                        gradientTwo : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                        gradientThree : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                        personMoney : [{ money : undefined }],
                        courseMoney : [{ money : undefined }],
                        rate : [{ money : undefined }],
                        showErrorBorder : false
                    }];
                    //若默认选中第一项则置灰第一项
                    if(courseSelectContent && courseSelectContent.length > 0){
                        courseSelectContent[0].display = false;
                    }
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        setSalaryModalData,
                        courseSelectContent,
                        setSalaryCourseCommission
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取老师设置信息失败');
                yield put({ type : 'updateState' , payload : { setSalaryModalVisible : false } });
            }
        },

        //工资设置modal提交
        *'SetSalaryModalSubmit'({payload}, {put, call, select}){
            yield put({ type : 'showSetSalaryModalLoading' });
            yield put({ type : 'showSetSalaryModalButtonLoading' });
            let { ret } = yield call(SetSalaryModalSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let salarySet = yield select(state => state.salarySet);
                let pageIndex = salarySet.pageIndex;
                let pageSize = salarySet.pageSize;
                let fastSearchContent = salarySet.fastSearchContent;
                message.success('工资设置成功');
                yield put({ type : 'updateState' , payload : { setSalaryModalVisible : false } });
                yield put({
                    type : 'QueryList',
                    payload : {
                        pageIndex,
                        pageSize,
                        fastSearchContent
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '工资设置失败');
            }
            yield put({ type : 'closeSetSalaryModalLoading' });
            yield put({ type : 'closeSetSalaryModalButtonLoading' });
        },
	},

	reducers: {
		updateState( state, action ) {
			return { ...state, ...action.payload };
		},
        showLoading( state, action ) {
			return { ...state, loading : true };
		},
        closeLoading( state, action ) {
			return { ...state, loading : false };
		},
        showSetSalaryModalLoading( state, action ) {
			return { ...state, setSalaryModalLoading : true };
		},
        closeSetSalaryModalLoading( state, action ) {
			return { ...state, setSalaryModalLoading : false };
		},
        showSetSalaryModalButtonLoading( state, action ) {
			return { ...state, setSalaryModalButtonLoading : true };
		},
        closeSetSalaryModalButtonLoading( state, action ) {
			return { ...state, setSalaryModalButtonLoading : false };
		},
        //使课程下拉列表项可选或置灰
        courseSelectOperation( state, action ) {
            let courseSelectContent = state.courseSelectContent;
            let courseId = action.payload.courseId;
            let display = action.payload.display;
            //将选中课程修改为相应状态
            for(let i in courseSelectContent){
                if(courseId == courseSelectContent[i].id){
                    courseSelectContent[i].display = display;
                    break;
                }
            }
			return { ...state, courseSelectContent };
		},
        //在数组中将选中项的courseId替换
        courseSelectSetCourse(state, action){
            let setSalaryCourseCommission = state.setSalaryCourseCommission;
            let courseId = action.payload.courseId;
            let zj_parent_index = action.payload.zj_parent_index;
            for(let i in setSalaryCourseCommission){
                if(zj_parent_index == setSalaryCourseCommission[i].zj_parent_index){
                    setSalaryCourseCommission[i].courseId = courseId;
                    break;
                }
            }
            return { ...state , setSalaryCourseCommission };
        },
        //commission数组操作事件
        courseCommissionOperation( state, action ) {
            let setSalaryCourseCommission = state.setSalaryCourseCommission;
            let payload = action.payload;
            if(payload.type == 'add'){
                setSalaryCourseCommission.push({
                    zj_parent_index : (parseInt(payload.zj_parent_index) + 1) + '',
                    courseId : undefined,
                    royaltyMethod : '1',
                    payMethod : '1',
                    gradientOne : [{ time : '0' , money : undefined , zj_parent_index : (parseInt(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                    gradientTwo : [{ time : '0' , money : undefined , zj_parent_index : (parseInt(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                    gradientThree : [{ time : '0' , money : undefined , zj_parent_index : (parseInt(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                    personMoney : [{ money : undefined }],
                    courseMoney : [{ money : undefined }],
                    rate : [{ money : undefined }],
                    showErrorBorder : false
                })
            }else{
                for(let i in setSalaryCourseCommission){
                    if(setSalaryCourseCommission[i].zj_parent_index == payload.zj_parent_index){
                        switch(payload.type){
                            case 'delete' : setSalaryCourseCommission.splice(i,1) ; break ;
                            case 'RoyaltyMethodOnChange' : setSalaryCourseCommission[i].royaltyMethod = payload.key ; break ;
                            case 'PayMethodOnChange' : setSalaryCourseCommission[i].payMethod = payload.key ; break ;
                            case '1-1_fix' : setSalaryCourseCommission[i].personMoney = [{ money : payload.value  }]; break ;
                            case '2-1_fix' : setSalaryCourseCommission[i].courseMoney = [{ money : payload.value  }] ; break ;
                            case '3-1_fix' : setSalaryCourseCommission[i].rate = [{ money : payload.value  }] ; break ;
                        }
                        break;
                    }
                }
            }
			return { ...state, setSalaryCourseCommission };
		},
        gradientOperation( state, action ) {
            let setSalaryCourseCommission = state.setSalaryCourseCommission;
            let payload = action.payload;
            let type = action.payload.type;
            for(let i in setSalaryCourseCommission){
                if(setSalaryCourseCommission[i].zj_parent_index == payload.zj_parent_index){
                    if(type == 'add'){
                        /*gradient数组的长度始终大于等于1*/
                        let son_index = setSalaryCourseCommission[i][payload.groupName][setSalaryCourseCommission[i][payload.groupName].length - 1].zj_son_index;
                        setSalaryCourseCommission[i][payload.groupName].push({
                            time : undefined ,
                            money : undefined ,
                            zj_parent_index : payload.zj_parent_index,
                            zj_son_index : (parseInt(son_index) + 1) + ''
                        });
                    }else{
                        for(let j in setSalaryCourseCommission[i][payload.groupName]){
                            if(setSalaryCourseCommission[i][payload.groupName][j].zj_son_index == payload.zj_son_index){
                                if(type == 'delete'){
                                    setSalaryCourseCommission[i][payload.groupName].splice(j,1);
                                }else if(type == 'time' || type == 'money'){
                                    setSalaryCourseCommission[i][payload.groupName][j][type] = payload.value;
                                    //梯度是否递增校验方法
                                    function GradientValidate(array){
                                        let flag = true;
                                        for(let i in array){
                                            if(i < (array.length - 1) && (parseFloat(array[i].time) >= parseFloat(array[parseInt(i)+1].time) || parseFloat(array[i].money) >= parseFloat(array[parseInt(i)+1].money))){
                                                flag = false;
                                                break;
                                            }
                                        }
                                        return flag;
                                    }
                                    for(let i in setSalaryCourseCommission){
                                        let flag = true;                //如果是梯度条件下判断是否梯度填写方式错误
                                        setSalaryCourseCommission[i].showErrorBorder = false;
                                        if(setSalaryCourseCommission[i].royaltyMethod == '1' && setSalaryCourseCommission[i].payMethod == '2'){
                                            flag = GradientValidate(setSalaryCourseCommission[i].gradientOne)
                                        }else if(setSalaryCourseCommission[i].royaltyMethod == '2' && setSalaryCourseCommission[i].payMethod == '2'){
                                            flag = GradientValidate(setSalaryCourseCommission[i].gradientTwo)
                                        }else if(setSalaryCourseCommission[i].royaltyMethod == '3' && setSalaryCourseCommission[i].payMethod == '2'){
                                            flag = GradientValidate(setSalaryCourseCommission[i].gradientThree)
                                        }
                                        setSalaryCourseCommission[i].showErrorBorder = !flag;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            return { ...state, setSalaryCourseCommission };
        }
	},
}
