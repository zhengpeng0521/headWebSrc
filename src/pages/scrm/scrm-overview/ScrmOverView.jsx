import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ScrmOverviewBanner from '../../../components/scrm/scrm-overview/scrm-overview-banner/ScrmOverviewBanner';

import ScrmOverViewPageOne from '../../../components/scrm/scrm-overview/scrm-overview-page-one/ScrmOverViewPageOne';

import ScrmOverViewPageTwo from '../../../components/scrm/scrm-overview/scrm-overview-page-two/ScrmOverViewPageTwo';

import ScrmOverViewGetFreeTrailModal from '../../../components/scrm/scrm-overview/scrm-overview-page-two/ScrmOverViewGetFreeTrailModal';

import ScrmOverViewPageThree from '../../../components/scrm/scrm-overview/scrm-overview-page-three/ScrmOverViewPageThree';

import ScrmOverViewPageFour from '../../../components/scrm/scrm-overview/scrm-overview-page-four/ScrmOverViewPageFour';

function ScrmOverView ({ dispatch , scrmOverView }){
	let {
        /*banner图*/
        bannerImg,                  //banner图数组

        /*统计图*/
        rechartsLoading,            //图表加载状态
        getStuCount,                //招生总条目数
        defeatPercent,              //击败机构百分比数
        selectOrgId,                //选择校区id
        selectDay,                  //选择日期
        reportData,                 //统计数据

        /*热门招生方案*/
        hotMethod,                  //热门招生方案数组
        windowWidth,                //当前浏览器宽度
        windowWidthLevel,           //浏览器宽度等级(Lv1 1500+ / Lv2 1058+ / Lv3 666+ / Lv4 0+)

        /*免费申请试用招生方案模态框属性*/
        freeTrailModalVisible,      //免费申请试用招生方案modal是否显示
        hotMethodMessage,           //热门招生申请成功或者失败后信息提示

        /*机构使用案例*/
        orgSucPageSize,             //机构使用案例每页条数
        orgSucPageIndex,            //机构使用案例页码
        orgSucCase,                 //机构使用案例数组
        wetherSucCaseExist,         //机构案例是否有剩余未加载(true(有剩余)/false(加载完毕))

        /*营销资讯*/
        scrmMessagePageSize,        //营销咨询每页条数
        scrmMessagePageIndex,       //营销资讯页码
        scrmMessage,                //营销咨询数据
        scrmMessageHoverIndex,      //营销咨询鼠标悬浮数据索引
        wetherScrmMessageExist,     //营销咨询是否有剩余未加载(true(有剩余)/false(加载完毕))
    } = scrmOverView;

    /*报表属性*/
        /*选择日期*/
        let PageOneSelectDay = function(e){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    selectDay : e.target.value
                }
            });
            dispatch({
                type:'scrmOverView/SelectDay',
                payload:{
                    selectDay : e.target.value,
                    orgId : selectOrgId
                }
            });
        }

        /*选择校区*/
        let SelectOrg = function(value){          
            if( value == undefined || value == '' || value == null ){
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        selectOrgId : (window._init_data.firstOrg).key
                    }
                });
            }else{
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        selectOrgId : value
                    }
                });
            }
            dispatch({
                type:'scrmOverView/SelectOrg',
                payload:{
                    selectDay,
                    orgId : value
                }
            });
        }

    /*热门招生方案*/
        /*免费申请试用招生方案*/
        let GetFreeTrailMethod = function(){
            dispatch({
                type:'scrmOverView/GetFreeTrailMethod',
            });
        }

        /*免费申请试用招生方案modal是否关闭*/
        let ScrmOverViewGetFreeTrailModalCancel = function(){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    freeTrailModalVisible : false
                }
            });
        }

        /*浏览器宽度改变事件*/
        let WindowOnReSize = function(width){
            if(parseInt(width) > 1500){
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        windowWidthLevel : 'Lv1',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else if(parseInt(width) > 1058){
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        windowWidthLevel : 'Lv2',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else if(parseInt(width) > 666){
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        windowWidthLevel : 'Lv3',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }else{
                dispatch({
                    type:'scrmOverView/updateState',
                    payload:{
                        windowWidthLevel : 'Lv4',
                        windowWidth : parseInt(width),      //当前浏览器宽度
                    }
                });
            }
        }

    /*机构使用案例属性*/
        /*查看更多案例*/
        let CheckMoreCase = function(){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    orgSucPageSize : orgSucPageSize + 4,                             //机构使用案例每页条数
                    orgSucPageIndex : orgSucPageIndex,            //机构使用案例页码
                }
            });
            dispatch({
                type:'scrmOverView/GetOrgUseing',
                payload:{
                    pageSize : orgSucPageSize + 4,
                    pageIndex : orgSucPageIndex,
                }
            });
        }

    /*营销资讯*/
        /*营销咨询鼠标经过事件*/
        let ScrmMessageMouseMove = function(index){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    scrmMessageHoverIndex : index
                }
            });
        }

        /*营销咨询鼠标离开事件*/
        let ScrmMessageMouseOut = function(index){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    scrmMessageHoverIndex : undefined
                }
            });
        }
        /*查看更多营销咨询*/
        let CheckMoreScrmMessage = function(){
            dispatch({
                type:'scrmOverView/updateState',
                payload:{
                    scrmMessagePageSize : scrmMessagePageSize + 5,                            //营销咨询每页条数
                    scrmMessagePageIndex : scrmMessagePageIndex,      //营销资讯页码
                }
            });
            dispatch({
                type:'scrmOverView/GetScrmMessage',
                payload:{
                    pageSize : scrmMessagePageSize + 5,
                    pageIndex : scrmMessagePageIndex,
                }
            });
        }

    /*banner属性*/
    let scrmOverviewBannerProps = {
        bannerImg,              //banner图数组
    };

    /*报表属性*/
    let scrmOverViewPageOneProps = {
        rechartsLoading,            //图表加载状态
        reportData,                 //统计数据
        getStuCount,                //招生总条目数
        defeatPercent,              //击败机构百分比数
        selectOrgId,                //选择校区id
        selectDay,                  //选择日期
        PageOneSelectDay,           //选择日期
        SelectOrg,                  //选择校区
    };

    /*热门招生方案属性*/
    let scrmOverViewPageTwoProps = {
        hotMethod,                  //热门招生方案数组
        windowWidth,                //当前浏览器宽度
        windowWidthLevel,           //浏览器宽度等级(Lv1 1500+ / Lv2 1058+ / Lv3 666+ / Lv4 0+)
        GetFreeTrailMethod,         //免费申请试用招生方案
        WindowOnReSize,             //浏览器宽度改变事件
    };

    /*免费申请试用招生方案模态框属性*/
    let scrmOverViewGetFreeTrailModalProps = {
        freeTrailModalVisible,                  //免费申请试用招生方案modal是否显示
        hotMethodMessage,                       //热门招生申请成功或者失败后信息提示
        ScrmOverViewGetFreeTrailModalCancel,    //免费申请试用招生方案modal是否关闭
    }

    /*机构使用案例属性*/
    let scrmOverViewPageThreeProps = {
        orgSucCase,                 //机构使用案例数组
        wetherSucCaseExist,         //机构案例是否有剩余未加载(true(有剩余)/false(加载完毕))
        CheckMoreCase,              //查看更多案例
    };

    /*营销咨询属性*/
    let scrmOverViewPageFourProps = {
        scrmMessage,                //营销咨询数据
        scrmMessageHoverIndex,      //营销咨询鼠标悬浮数据索引
        ScrmMessageMouseMove,       //营销咨询鼠标经过事件
        ScrmMessageMouseOut,        //营销咨询鼠标离开事件
        CheckMoreScrmMessage,       //查看更多营销咨询
        wetherScrmMessageExist,     //营销咨询是否有剩余未加载(true(有剩余)/false(加载完毕))
    }

	return (
        <div style={{backgroundColor : '#e9e9ed', padding : 10 ,borderRadius : 10}} id='zj_scrm_overview'>
            <ScrmOverviewBanner {...scrmOverviewBannerProps} />
            <ScrmOverViewPageOne { ...scrmOverViewPageOneProps } />
            <ScrmOverViewPageTwo { ...scrmOverViewPageTwoProps } />
            <ScrmOverViewGetFreeTrailModal {...scrmOverViewGetFreeTrailModalProps} />
            <ScrmOverViewPageThree { ...scrmOverViewPageThreeProps } />
            <ScrmOverViewPageFour { ...scrmOverViewPageFourProps } />
        </div>
	)
};

function mapStateToProps ({ scrmOverView }){
	return { scrmOverView };
};

export default connect(mapStateToProps)(ScrmOverView);
