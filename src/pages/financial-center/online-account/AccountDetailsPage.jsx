import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import AccountDetailsComponent from '../../../components/financial-center/online-account/AccountDetailsComponent';
import { message } from 'antd';

function AccountDetailsPage({ dispatch, accountDetailsModel }){
    let {
        accountBalance,
        availableBalance,
        tableLoading,
		routeChange,
        isChecked,
        isPickOn,
        accountFlowData,
        accountFlowNewColumns,
        accountFlowNewColumns1,
        hasPhoneNum,
        showAlertModal,
        alertModalButtonLoading,
        showXuzhiModal,
        mentionStates,
        mentionWay,
        mentionPhone,
        pageIndex,
        pageSize,
        total,
        changeState,
        tixianjine,
		mentionWayList,
        mentionAcctName,
        mentionAcctNo,
        mentionBank,
        selectValue,
        mentionAlipayAccount,
        startDate,
        endDate,
        businessType,
        businessName,
        tabsKey,
        tabsKeyArr,
        tenantIds,
        orgIds,
        totalIncome ,  				//总收入
		incomeNum ,				//收入几笔
    } = accountDetailsModel;

    //表格的设置
    function accountFlowChangeColumns(accountFlowNewColumns) {
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                accountFlowNewColumns,
                accountFlowNewColumns1 : []
            }
        });
    }
     //表格的设置
    function accountFlowChangeColumns1(accountFlowNewColumns1) {
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                accountFlowNewColumns1,
                accountFlowNewColumns : []
            }
        });
    }

    //账户流水表格
	function accountFlow(){

    }

    //提现记录表格
    function withdrawalsRecord(){


    }

    //提现申请 弹框显示
    function applicationFun(){
        dispatch({
            type:'accountDetailsModel/getApplication',
            payload:{

            }
        })
    }

    //弹框取消
    function AlertModalOnCancelFun(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showAlertModal : false,
            }
        });
    }

    //提现须知 弹框显示
    function remindedFun(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showXuzhiModal : true,
            }
        });
    }

    //提现须知弹框取消
    function CancelXuzhiModal(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showXuzhiModal : false,
            }
        });
    }

    //获取验证码
    function verificationCodeFun(mobile){
//        dispatch({
//            type: 'accountDetailsModel/VerificationCode',
//            payload : {
//                ...params,
//            },
//        });
        dispatch({
            type: 'veryCodeButtonModel/sendVerifyCode',
            payload : {
                mobile,
            },
        });
    }



    //提现申请提交
    function mentionSubmitAction(params){
        dispatch({
            type: 'accountDetailsModel/submitAction',
            payload : {
                ...params,
                mentionWayList,
            },
        });

    }

    //切换点击事件
	function onSelectFun(key){
        dispatch({
           type: 'accountDetailsModel/updateCurrentValue',
            payload: {
                selectValue: key,
                mentionWayList,
            }
        });
    }

    //马上去设置
    function changeRoute(){
        if(window._init_data.roles.indexOf(11080000) < 0){
            message.error('请联系管理员在系统设置操作')
        } else {
            if( mentionStates == 10000){
                dispatch( routerRedux.push('/hq_setup_hqset') );
                dispatch({
                    type:'accountDetailsModel/updateState',
                    payload:{
                        showAlertModal : false,
                    }
                });
            }else if( mentionStates == 20000 || mentionStates == 30000 ){
                dispatch( routerRedux.push('/hq_setup_hqset') );
                dispatch({
                    type:'accountDetailsModel/updateState',
                    payload:{
                        showAlertModal : false,
                    }
                });
            }
        }

    }

    //切换分页
    function changeTabsKey(activeKey) {
        if( activeKey == 'accountWater'){
            dispatch({
                type:'accountDetailsModel/getAccountFlow',
                payload:{
                    pageSize,
                    pageIndex : 0,
                    tabsKey : activeKey,
                }
            });
        }else if( activeKey == 'paymentDetails' ){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize,
                    pageIndex : 0,
                    status : '1',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey : activeKey,
                    orgIds : '0'
                }
            });
            dispatch({
                type:'accountDetailsModel/getIncomeNums',
                payload:{
                    status : '1',
                    startTime : startDate,
                    endTime : endDate,
                    tabsKey : activeKey,
                    orgIds : '0'
                }
            });
        }else if( activeKey == 'refundDetails' ){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize,
                    pageIndex : 0,
                    status : '4',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey : activeKey,
                    orgIds : '0',
                }
            });
            dispatch({
                type:'accountDetailsModel/getIncomeNums',
                payload:{
                    status : '4',
                    startTime : startDate,
                    endTime : endDate,
                    tabsKey : activeKey,
                    orgIds : '0'
                }
            });
        }else if( activeKey == 'withdrawalsRecord' ){
            dispatch({
                type:'accountDetailsModel/getWithdrawalsRecord',
                payload:{
                    pageSize,
                    pageIndex : 0,
                    tabsKey : activeKey,
                }
            });
        }
    }
    //搜索
    function searchFun (value){
        let orgIdsStr = '';
        let tenantIdsStr = '';
        let orgIdsArr = value.orgname;
        tenantIdsStr = !!orgIdsArr ? orgIdsArr.split("-")[0] : '0';
        orgIdsStr = !!orgIdsArr ? orgIdsArr.split("-")[1] : '0';
		if(value && value.busTime)
    	{
	        if(tabsKey == tabsKeyArr[1].id){
	            dispatch({
	                type:'accountDetailsModel/getPayAndRefundDetails',
	                payload:{
	                    pageSize,
	                    pageIndex : 0,
	                    status : '1',
	                    startTime : value.busTime[0].format('YYYY-MM-DD'),
	                    endTime : value.busTime[1].format('YYYY-MM-DD'),
	                    tabsKey,
	                    businessType : value.busType,
	                    businessName : value.busName,
	                    orgIds : orgIdsStr,
	                    tenantIds :tenantIdsStr
	                }
	            });
	            dispatch({
	                type:'accountDetailsModel/getIncomeNums',
	                payload:{
	                    status : '1',
	                    startTime : value.busTime[0].format('YYYY-MM-DD'),
	                    endTime : value.busTime[1].format('YYYY-MM-DD'),
	                    tabsKey,
	                    businessType : value.busType,
	                    businessName : value.busName,
	                    orgIds : orgIdsStr,
	                    tenantIds :tenantIdsStr
	                }
	            });
	        }else if(tabsKey == tabsKeyArr[2].id){
	            dispatch({
	                type:'accountDetailsModel/getPayAndRefundDetails',
	                payload:{
	                    pageSize,
	                    pageIndex : 0,
	                    status : '4',
	                    startTime : value.busTime[0].format('YYYY-MM-DD'),
	//                    startTime : '2017-08-01',
	                    endTime : value.busTime[1].format('YYYY-MM-DD'),
	                    tabsKey,
	                    businessType : value.busType,
	                    businessName : value.busName,
	                    orgIds : orgIdsStr,
	                    tenantIds :tenantIdsStr
	
	                }
	            });
	            dispatch({
	                type:'accountDetailsModel/getIncomeNums',
	                payload:{
	                    status : '4',
	                    startTime : value.busTime[0].format('YYYY-MM-DD'),
	                    endTime : value.busTime[1].format('YYYY-MM-DD'),
	                    tabsKey,
	                    businessType : value.busType,
	                    businessName : value.busName,
	                    orgIds : orgIdsStr,
	                    tenantIds :tenantIdsStr
	
	                }
	            });
        }

        dispatch({
			type : 'accountDetailsModel/updateState',
			payload : {
				businessType : value.busType,
                businessName : value.busName,
                orgIds : orgIdsStr,
                tenantIds : tenantIdsStr,
			}
		})
		}else{
    		message.error('请选择查询日期！');
    	}
    }

        //分页
    function pageIndexChange(pageIndex,pageSize){
        if( tabsKey == tabsKeyArr[0].id ){
             dispatch({
                type:'accountDetailsModel/getAccountFlow',
                payload:{
                    pageIndex : pageIndex - 1,
                    pageSize,
                    tabsKey,
                }
            })
        }else if(tabsKey == tabsKeyArr[1].id){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize,
                    pageIndex : pageIndex - 1,
                    status : '1',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey,
                    businessType,
                    businessName,
                    orgIds,
                    tenantIds
                }
            });
        }else if(tabsKey == tabsKeyArr[2].id){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize,
                    pageIndex : pageIndex - 1,
                    status : '4',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey,
                    businessType,
                    businessName,
                    orgIds,
                    tenantIds
                }
            });
        }else if(tabsKey == tabsKeyArr[3].id){
            dispatch({
                type:'accountDetailsModel/getWithdrawalsRecord',
                payload:{
                    pageIndex : pageIndex - 1,
                    pageSize,
                    tabsKey,
                }
            })
        }
    }


    //清空
    function clearFun (value){
        if(tabsKey == tabsKeyArr[1].id){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize,
                    pageIndex : 0,
                    status : '1',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey,
                    orgIds:0,
                }
            });
            dispatch({
                type:'accountDetailsModel/getIncomeNums',
                payload:{
                    status : '1',
                    startTime : startDate,
                    endTime : endDate,
                    tabsKey,
                    orgIds:0,
                }
            });
        }else if(tabsKey == tabsKeyArr[2].id){
            dispatch({
                type:'accountDetailsModel/getPayAndRefundDetails',
                payload:{
                    pageSize : 20,
                    pageIndex : 0,
                    status : '4',
                    startTime : startDate,
//                    startTime : '2017-08-01',
                    endTime : endDate,
                    tabsKey,
                    orgIds:0,
                }
            });
            dispatch({
                type:'accountDetailsModel/getIncomeNums',
                payload:{
                    status : '4',
                    startTime : startDate,
                    endTime : endDate,
                    tabsKey,
                    orgIds:0,
                }
            });
        }

    }
    //导出
    function checkOutTable(){
        let exportSearchContent = {}
        if(tabsKey == tabsKeyArr[1].id){
            exportSearchContent.status = '1';
            exportSearchContent.businessType = businessType;
            exportSearchContent.businessName = businessName;
            exportSearchContent.startTime = startDate;
            exportSearchContent.endTime = endDate;
            exportSearchContent.orgIds = orgIds;
        }else if(tabsKey == tabsKeyArr[2].id){
            exportSearchContent.status = '4';
            exportSearchContent.businessType = businessType;
            exportSearchContent.businessName = businessName;
            exportSearchContent.startTime = startDate;
            exportSearchContent.endTime = endDate;
            exportSearchContent.orgIds = orgIds;
        }
        window.excelExport('/crm/hq/payment/exportPayOrderList',exportSearchContent)
    }

    let AccountDetailsProps = {
        accountBalance,
        availableBalance,
        tableLoading,
        routeChange,
        isChecked,
        isPickOn,
        accountFlow,
        withdrawalsRecord,
        accountFlowData,
        accountFlowNewColumns,
        accountFlowChangeColumns,
        accountFlowNewColumns1,
        accountFlowChangeColumns1,
        applicationFun,
        hasPhoneNum,
        showAlertModal,
        AlertModalOnCancelFun,
        alertModalButtonLoading,
        CancelXuzhiModal,
        showXuzhiModal,
        remindedFun,
        mentionStates,
        mentionWay,
        mentionPhone,
        mentionSubmitAction,
        verificationCodeFun,
        pageIndex,
        pageSize,
        total,
        pageIndexChange,
        changeRoute,
        tixianjine,
        mentionWayList,
        mentionAcctName,
        mentionAcctNo,
        mentionBank,
        selectValue,
        mentionAlipayAccount,
        onSelectFun,
        tabsKey,
        changeTabsKey,
        searchFun,
        clearFun,
        checkOutTable,
        startDate,
        endDate,
        tabsKeyArr,
        totalIncome,  						//总收入
		incomeNum,							//收入几笔
    };


    return (
        <AccountDetailsComponent { ...AccountDetailsProps } />
    )
};

function mapStateToProps ({ accountDetailsModel }){
	return { accountDetailsModel };
};

export default connect( mapStateToProps )( AccountDetailsPage );
