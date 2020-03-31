import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import WxActivityComponent from '../../../components/common/manager-list/ManagerListMgr';
import WxReservationSetComponent from '../../../components/scrm/wx-reservation-set/WxReservationSetComponent';

function WxReservationSetPage({ dispatch, wxReservationSetModel }){
    let {
        orgId,
        orgChoice,
        addr,
        babyName,
        babySex,
        babyBirthday,
        tel,
        gift,
        giftContent,
        orgAddr,

    } = wxReservationSetModel;

    //保存预约设置
    function saveWxReservation( values ){
        dispatch({
            type : 'wxReservationSetModel/saveWxReservation',
            payload : {
                values
            }
        })
    };

    //更改校区得到预约设置信息
    function TenantSelectOnSelect( value ){
        dispatch({
            type : 'wxReservationSetModel/TenantSelectOnSelect',
            payload : {
                value,
            }
        })
    };

    function changeOrgChoice( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                orgChoice : ( value && 1 ) || 0
            }
        })
    }
    function changeOrgAddr( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                orgAddr : ( value && 1 ) || 0
            }
        })
    }
    function changeBabyName( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                babyName : ( value && 1 ) || 0
            }
        })
    }
    function changeBabySex( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                babySex : ( value && 1 ) || 0
            }
        })
    }
    function changeBabyBirthday( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                babyBirthday : ( value && 1 ) || 0
            }
        })
    }
    function changeTel( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                tel : ( value && 1 ) || 0
            }
        })
    }
    function changeAddr( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                addr : ( value && 1 ) || 0
            }
        })
    }
    function changeGift( value ){
        dispatch({
            type : 'wxReservationSetModel/updateState',
            payload : {
                gift : ( value && 1 ) || 0
            }
        })
    }

    let WxReservationSetComponentProps = {
        orgId,
        orgChoice,
        addr,
        babyName,
        babySex,
        babyBirthday,
        tel,
        gift,
        giftContent,
        orgAddr,

        TenantSelectOnSelect,    //更改校区
        saveWxReservation,

        changeOrgChoice,
        changeOrgAddr,
        changeBabyName,
        changeBabySex,
        changeBabyBirthday,
        changeTel,
        changeAddr,
        changeGift,


    }
    return (
        <WxReservationSetComponent { ...WxReservationSetComponentProps } />
    )
};

function mapStateToProps ({ wxReservationSetModel }){
	return { wxReservationSetModel };
};

export default connect( mapStateToProps )( WxReservationSetPage );
