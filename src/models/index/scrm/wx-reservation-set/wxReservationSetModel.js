import {
    getReservationInfo,               //获取预约设置信息
    saveWxReservation,                //保存预约设置
} from '../../../../services/scrm/wx-reservation-set/wxReservationSetService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'wxReservationSetModel',
	state : {
        reservationInfo          : {},                //预约设置信息
        orgId                    : '',
        orgChoice                : 1,
        addr                     : 1,
        babyName                 : 1,
        babySex                  : 1,
        babyBirthday             : 1,
        tel                      : 1,
        gift                     : 1,
        giftContent              : '',
        orgAddr                  : 1,
	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if( pathname === '/scrm_wx_maa_set' ) {
                    dispatch({
                        type : 'getWxReservationSetParams',
                        payload : {

                        }
                    });
                }
            });
        },
    },

	effects : {

        //进入页面得到初始设置值
        *getWxReservationSetParams({ payload },{ call, put, select }){
            if( !!window._init_data.firstOrg ){
                let orgId = window._init_data.firstOrg.key;
                let { ret } = yield call( getReservationInfo, ({ orgId : orgId }));
                if( ret && ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            orgId        : orgId,

                            orgChoice    : ret.orgChoice,
                            addr         : ret.addr,
                            babyName     : ret.babyName,
                            babySex      : ret.babySex,
                            babyBirthday : ret.babyBirthday,
                            tel          : ret.tel,
                            gift         : ret.gift,
                            orgAddr      : ret.orgAddr,
                            giftContent  : ret.giftContent,
                        }
                    })
                }
            }
        },
        //获取预约设置信息
        *TenantSelectOnSelect({ payload },{ call, put, select }){
            let { value, refreshFormData } = payload;
            let { ret } = yield call( getReservationInfo, ({ orgId : value }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        orgId        : value,

                        orgChoice    : ret.orgChoice,
                        addr         : ret.addr,
                        babyName     : ret.babyName,
                        babySex      : ret.babySex,
                        babyBirthday : ret.babyBirthday,
                        tel          : ret.tel,
                        gift         : ret.gift,
                        orgAddr      : ret.orgAddr,
                        giftContent  : ret.giftContent,
                    }
                });
            } else{
                message.error( ret && ret.errorMessage || '获取预约设置信息失败' )
            }

        },
        //保存预约设置
        *saveWxReservation({ payload },{ call, put, select }){
            let { values } = payload;
            let wxReservationSetModel = yield select( state => state.wxReservationSetModel );
            let params = {
                orgId        : wxReservationSetModel.orgId,
                orgChoice    : wxReservationSetModel.orgChoice,
                addr         : wxReservationSetModel.addr,
                babyName     : wxReservationSetModel.babyName,
                babySex      : wxReservationSetModel.babySex,
                babyBirthday : wxReservationSetModel.babyBirthday,
                tel          : wxReservationSetModel.tel,
                gift         : wxReservationSetModel.gift,
                orgAddr      : wxReservationSetModel.orgAddr,
                ...values,
            };
            let { ret } = yield call( saveWxReservation, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                message.success( '预约设置成功' );
            }
        },
	},

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
