import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import LeadsDispatchComponent from '../../../components/crm/leads-follow/leads-dispatch/LeadsDispatch';

/*leads分配*/
function LeadsDispatch({ dispatch , leadsDispatch }) {

    let {
        orgId,                                      //校区id
        leadsDispatchUsefulLeadsNum,                //可分配的leads数
        leadsDispatchAlreadyDispatchLeadsNum,       //已分配的leads数

        leadsDispatchDispatchLoading,               //是否在加载状态
        leadsDispatchDispatchButtonLoading,         //提交按钮是否加载状态
        leadsDispatchWetherSubmitSuc,               //是否提交成功
        leadsDispatchDispatchType,                  //分配类型('1'自定义/'2'平均分配)

        leadsDispatchRoleSelectContent,             //角色下拉列表内容

        leadsDispatchStaffContent,                  //员工摘要信息(id,name,hasNum,dispatchNum)(平均分配专用)
        leadsDispatchStaffChooseArr,                //选中的员工ID数组

        leadsDispatchStaffMaxLeadsNum,              //每个员工最多分配leads数

        /*alert modal*/
        leadsDispatchAlertModalWetherAlert,         //员工是否超额
        leadsDispatchAlertModalStaff,               //超额员工信息
    } = leadsDispatch

    //选择校区onChange事件
    /*function LeadsDispatchOrgSelectOnChange(orgId){
        if(orgId == '' || orgId == null || orgId == undefined){
            dispatch({
                type:'leadsDispatch/updateState',
                payload:{
                    leadsDispatchStaffContent : [],
                    leadsDispatchStaffChooseArr : []
                }
            });
        }else{
            dispatch({
                type:'leadsDispatch/QueryOrgSraff',
                payload:{
                    orgId
                }
            });
            dispatch({
                type:'leadsDispatch/GetPublicAndStaffMessage',
                payload:{
                    orgId
                }
            });
        }
    }*/

    //角色下拉列表onChange事件
    function LeadsDispatchSearchStaffByRoleId(roleId){
        //清空所选所填的数据
        for(let i in leadsDispatchStaffContent){
            leadsDispatchStaffContent[i].dispatchNum = 0
        }
        dispatch({
            type:'leadsDispatch/updateState',
            payload:{
                leadsDispatchStaffChooseArr : [],
                leadsDispatchAlreadyDispatchLeadsNum : 0,
                leadsDispatchAlertModalWetherAlert : false,
                leadsDispatchAlertModalStaff : {},
                leadsDispatchStaffContent
            }
        });
        //请求员工数据(必须先从公海池接口查起)
        dispatch({
            type : 'leadsDispatch/GetPublicAndStaffMessage',
            payload : {
                orgId,
                status : '1',
                roleId
            }
        })
    }

    //分类种类onChange事件
    function LeadsDispatchTypeOnChange(e){
        //清空所选所填的数据
        for(let i in leadsDispatchStaffContent){
            leadsDispatchStaffContent[i].dispatchNum = 0
        }
        dispatch({
            type:'leadsDispatch/updateState',
            payload:{
                leadsDispatchDispatchType : e.target.value,
                leadsDispatchStaffChooseArr : [],
                leadsDispatchAlreadyDispatchLeadsNum : 0,
                leadsDispatchAlertModalWetherAlert : false,
                leadsDispatchAlertModalStaff : {},
                leadsDispatchStaffContent
            }
        });
    }

    //员工checkbox的onChange事件(如果取消checkbox，已分配数需要减去参数num；如果选中checkbox,num为0，不影响)
    function LeadsDispatchCheckBoxOnChange(e,id,num){
        console.info(e,id,num)
        let staffIdArr = leadsDispatchStaffChooseArr;
        //checkbox选中
        if(e[0] == id){
            staffIdArr.push(id);
            dispatch({
                type:'leadsDispatch/updateState',
                payload:{
                    leadsDispatchStaffChooseArr : staffIdArr,
                }
            });
            if(leadsDispatchDispatchType == '1'){
                dispatch({
                    type:'leadsDispatch/updateState',
                    payload:{
                        leadsDispatchAlreadyDispatchLeadsNum : parseInt(leadsDispatchAlreadyDispatchLeadsNum) - parseInt(num)
                    }
                });
            }else if(leadsDispatchDispatchType == '2'){
                //更新选中员工的已分配人数
                for(let i in staffIdArr){
                    for(let j in leadsDispatchStaffContent){
                        if(staffIdArr[i] == leadsDispatchStaffContent[j].id){
                            leadsDispatchStaffContent[j].dispatchNum = staffIdArr.length == 0 ? 0 :
                                                staffIdArr.indexOf(staffIdArr[i]) > -1 ?
                                                (parseInt(leadsDispatchUsefulLeadsNum)%staffIdArr.length == 0 ?
                                                    parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length :
                                                    staffIdArr.indexOf(staffIdArr[i]) < parseInt(leadsDispatchUsefulLeadsNum)%staffIdArr.length ?
                                                    parseInt(parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length) + 1 :
                                                    parseInt(parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length)
                                                ) : 0;
                        }
                    }
                }
                dispatch({
                    type:'leadsDispatch/updateState',
                    payload:{
                        leadsDispatchStaffContent,
                    }
                });
                let flag = false;
                //平均分配下遍历以选中的数组检验是否有员工超标
                if(leadsDispatchStaffMaxLeadsNum == '-1'){
                    dispatch({
                        type:'leadsDispatch/updateState',
                        payload:{
                            leadsDispatchAlertModalWetherAlert : false,
                            leadsDispatchAlertModalStaff : {},
                        }
                    });
                }else{
                    for(let i in staffIdArr){
                        for(let j in leadsDispatchStaffContent){
                            //有超标
                            if(staffIdArr[i] == leadsDispatchStaffContent[j].id && parseInt(leadsDispatchStaffContent[j].hasNum) + parseInt(leadsDispatchStaffContent[j].dispatchNum) > parseInt(leadsDispatchStaffMaxLeadsNum)){
                                flag = true;
                                dispatch({
                                    type:'leadsDispatch/updateState',
                                    payload:{
                                        leadsDispatchAlertModalWetherAlert : true,
                                        leadsDispatchAlertModalStaff : leadsDispatchStaffContent[j],
                                    }
                                });
                                break;
                            }
                        }
                        if(flag){
                            break;
                        }
                    }
                    if(!flag){
                        dispatch({
                            type:'leadsDispatch/updateState',
                            payload:{
                                leadsDispatchAlertModalWetherAlert : false,
                                leadsDispatchAlertModalStaff : {},
                            }
                        });
                    }
                }
            }
        }else{  //checkbox取消选中
            let index = staffIdArr.indexOf(id);
            staffIdArr.splice(index,1);
            dispatch({
                type:'leadsDispatch/updateState',
                payload:{
                    leadsDispatchStaffChooseArr : staffIdArr,
                }
            })
            if(leadsDispatchDispatchType == '1'){
                dispatch({
                    type:'leadsDispatch/updateState',
                    payload:{
                        leadsDispatchAlreadyDispatchLeadsNum : parseInt(leadsDispatchAlreadyDispatchLeadsNum) - parseInt(num)
                    }
                });
                //更新当前项的dispatchNum
                for(let i in leadsDispatchStaffContent){
                    if(id == leadsDispatchStaffContent[i].id){
                        leadsDispatchStaffContent[i].dispatchNum = 0;
                        dispatch({
                            type:'leadsDispatch/updateState',
                            payload:{
                                leadsDispatchStaffContent
                            }
                        });
                    }
                }
                //自由分配下取消选中的checkbox时将之前选中的再判断一遍
                if(staffIdArr && staffIdArr.length > 0){
                    if(leadsDispatchStaffMaxLeadsNum == '-1'){  //最大分配数被停用
                        dispatch({
                            type:'leadsDispatch/updateState',
                            payload:{
                                leadsDispatchAlertModalWetherAlert : false,
                                leadsDispatchAlertModalStaff : {}
                            }
                        });
                    }else{
                        let flag = false;
                        for(let i in staffIdArr){
                            for(let j in leadsDispatchStaffContent){
                                if(staffIdArr[i] == leadsDispatchStaffContent[j].id && parseInt(leadsDispatchStaffContent[j].hasNum) + parseInt(leadsDispatchStaffContent[j].dispatchNum) > parseInt(leadsDispatchStaffMaxLeadsNum)){
                                    flag = true;
                                    dispatch({
                                        type:'leadsDispatch/updateState',
                                        payload:{
                                            leadsDispatchAlertModalWetherAlert : true,
                                            leadsDispatchAlertModalStaff : leadsDispatchStaffContent[j]
                                        }
                                    });
                                }
                            }
                            if(flag){
                                break;
                            }
                        }
                        //所有人都没有超标
                        if(!flag){
                            dispatch({
                                type:'leadsDispatch/updateState',
                                payload:{
                                    leadsDispatchAlertModalWetherAlert : false,
                                    leadsDispatchAlertModalStaff : {}
                                }
                            });
                        }
                    }
                }else{
                    dispatch({
                        type:'leadsDispatch/updateState',
                        payload:{
                            leadsDispatchAlertModalWetherAlert : false,
                            leadsDispatchAlertModalStaff : {}
                        }
                    });
                }
            }else if(leadsDispatchDispatchType == '2'){
                if(staffIdArr && staffIdArr.length > 0){
                    //更新选中员工的已分配人数
                    for(let i in staffIdArr){
                        for(let j in leadsDispatchStaffContent){
                            if(staffIdArr[i] == leadsDispatchStaffContent[j].id){
                                leadsDispatchStaffContent[j].dispatchNum = staffIdArr.length == 0 ? 0 :
                                                    staffIdArr.indexOf(staffIdArr[i]) > -1 ?
                                                    (parseInt(leadsDispatchUsefulLeadsNum)%staffIdArr.length == 0 ?
                                                        parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length :
                                                        staffIdArr.indexOf(staffIdArr[i]) < parseInt(leadsDispatchUsefulLeadsNum)%staffIdArr.length ?
                                                        parseInt(parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length) + 1 :
                                                        parseInt(parseInt(leadsDispatchUsefulLeadsNum)/staffIdArr.length)
                                                    ) : 0;
                            }
                        }
                    }
                    dispatch({
                        type:'leadsDispatch/updateState',
                        payload:{
                            leadsDispatchStaffContent,
                        }
                    });
                    //将取消选中的员工已分配数归零
                    for(let i in leadsDispatchStaffContent){
                        if(id == leadsDispatchStaffContent[i].id){
                            leadsDispatchStaffContent[i].dispatchNum = 0;
                            dispatch({
                                type:'leadsDispatch/updateState',
                                payload:{
                                    leadsDispatchStaffContent,
                                }
                            });
                        }
                    }

                    if(leadsDispatchStaffMaxLeadsNum == '-1'){  //最大分配数被停用
                        dispatch({
                            type:'leadsDispatch/updateState',
                            payload:{
                                leadsDispatchAlertModalWetherAlert : false,
                                leadsDispatchAlertModalStaff : {}
                            }
                        });
                    }else{
                        let flag = false;
                        //平均分配下遍历以选中的数组检验是否有员工超标
                        for(let i in staffIdArr){
                            for(let j in leadsDispatchStaffContent){
                                //有超标
                                if(staffIdArr[i] == leadsDispatchStaffContent[j].id && parseInt(leadsDispatchStaffContent[j].hasNum) + parseInt(leadsDispatchStaffContent[j].dispatchNum) > parseInt(leadsDispatchStaffMaxLeadsNum)){
                                    flag = true;
                                    dispatch({
                                        type:'leadsDispatch/updateState',
                                        payload:{
                                            leadsDispatchAlertModalWetherAlert : true,
                                            leadsDispatchAlertModalStaff : leadsDispatchStaffContent[j],
                                        }
                                    });
                                    break;
                                }
                            }
                            if(flag){
                                break;
                            }
                        }
                        if(!flag){
                            dispatch({
                                type:'leadsDispatch/updateState',
                                payload:{
                                    leadsDispatchAlertModalWetherAlert : false,
                                    leadsDispatchAlertModalStaff : {},
                                }
                            });
                        }
                    }
                }else{
                    //如果一个都没有选中，则每个员工的dispatchNum都是0
                    for(let i in leadsDispatchStaffContent){
                        leadsDispatchStaffContent[i].dispatchNum = 0;
                    }
                    dispatch({
                        type:'updateState',
                        payload:{
                            leadsDispatchStaffContent
                        }
                    });
                    dispatch({
                        type:'leadsDispatch/updateState',
                        payload:{
                            leadsDispatchAlertModalWetherAlert : false,
                            leadsDispatchAlertModalStaff : {},
                        }
                    });
                }
            }
        }
    }

//    for(let i in leadsDispatchStaffContent){
//        console.info(leadsDispatchStaffContent[i].name,leadsDispatchStaffContent[i].dispatchNum);
//    }

    //分配数输入框onChange事件
    function LeadsDispatchInputOnChange(num,flag,staff,index,alertContent){
        leadsDispatchStaffContent[index] = staff;
        dispatch({
            type:'leadsDispatch/updateState',
            payload:{
                leadsDispatchAlreadyDispatchLeadsNum : num,
                leadsDispatchStaffContent
            }
        });
        if(leadsDispatchStaffMaxLeadsNum != '-1'){
            if(flag){
                dispatch({
                    type:'leadsDispatch/updateState',
                    payload:{
                        leadsDispatchAlertModalWetherAlert : true,
                        leadsDispatchAlertModalStaff : alertContent
                    }
                });
            }else{
                dispatch({
                    type:'leadsDispatch/updateState',
                    payload:{
                        leadsDispatchAlertModalWetherAlert : false,
                        leadsDispatchAlertModalStaff : {}
                    }
                });
            }
        }else{
            dispatch({
                type:'leadsDispatch/updateState',
                payload:{
                    leadsDispatchAlertModalWetherAlert : false,
                    leadsDispatchAlertModalStaff : {}
                }
            });
        }
    }

    //点击保存
    function LeadsDispatchInputOnSubmit(users,clear){
        dispatch({
            type:'leadsDispatch/LeadsDispatchInputOnSubmit',
            payload:{
                users,
                clear
            }
        });
    }

    //提交成功后清除表单
    function AfterSuccessChangeStatus(){
        dispatch({
            type:'leadsDispatch/updateState',
            payload:{
                leadsDispatchWetherSubmitSuc : false
            }
        });
    }


    let LeadsDispatchComponentProps = {
        leadsDispatchUsefulLeadsNum,                //可分配的leads数
        leadsDispatchAlreadyDispatchLeadsNum,       //已分配的leads数
        leadsDispatchDispatchType,                  //分配类型('1'自定义/'2'平均分配)
        leadsDispatchStaffContent,                  //员工摘要信息(id,name,hasNum,dispatchNum)(平均分配专用)
        leadsDispatchStaffChooseArr,                //选中的员工ID数组

        leadsDispatchDispatchLoading,               //是否在加载状态
        leadsDispatchDispatchButtonLoading,         //提交按钮是否加载状态
        leadsDispatchWetherSubmitSuc,               //是否提交成功
        leadsDispatchStaffMaxLeadsNum,              //每个员工最多分配leads数

        leadsDispatchRoleSelectContent,             //角色下拉列表内容

        leadsDispatchAlertModalWetherAlert,         //员工是否超额
        leadsDispatchAlertModalStaff,               //超额员工信息

        //LeadsDispatchOrgSelectOnChange,             //选择校区onChange事件
        LeadsDispatchTypeOnChange,                  //分类种类onChange事件
        LeadsDispatchSearchStaffByRoleId,           //角色下拉列表onChange事件
        LeadsDispatchCheckBoxOnChange,              //员工checkbox的onChange事件
        LeadsDispatchInputOnChange,                 //分配数输入框onChange事件
        LeadsDispatchInputOnSubmit,                 //点击保存
        AfterSuccessChangeStatus                    //提交成功后清除表单
    }

    return (
        <LeadsDispatchComponent {...LeadsDispatchComponentProps} />
    );
}

function mapStateToProps({ leadsDispatch }) {
    return { leadsDispatch };
}

export default connect(mapStateToProps)(LeadsDispatch);
