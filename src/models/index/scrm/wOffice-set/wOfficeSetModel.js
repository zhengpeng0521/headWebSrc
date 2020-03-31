import {
    getWOfficeInfo,            //获取微官网设置信息

	initWOfficeInfo,           //初始化微官网信息

	showAndHideItem,           //显示隐藏显示项

	confirmChangeTitle,        //确认更改显示项

} from '../../../../services/scrm/wOffice-set/wOfficeSetService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {

	namespace : 'wOfficeSetModel',

	state : {
        orgId               : '',             //机构Id
		id                  : '',             //设置id
		wOfficeTab          : 'wOffice_set',  //tab页

		//显示项设置
		dataSource          : [],
		selectedRows        : [],
		selectedRowKeys     : [],
		name                : '',             //tab字段
		title               : '',             //tab名称
		linkUrl             : '',             //外链地址
		changeTitleModal    : false,          //更改名称模态框

		//url
		orgSelect           : '',             //聚合页
		orgHome             : '',             //校区主页
		orgAudition         : '',             //预约试听



	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if( pathname === '/scrm_woffice_set' ) {
                    dispatch({
                        type    : 'initWOfficeSet',
                        payload : {

                        }
                    })
                }
            });
        },
    },

	effects : {

        //进入页面选中第一个校区
        *initWOfficeSet({ payload },{ call, put, select }){
            /*取到第一个校区(默认校区)ID*/
            if( !!window._init_data.firstOrg ){
                let orgId = window._init_data.firstOrg.key;
                let { ret } = yield call( getWOfficeInfo, ({ orgId : orgId }));
                if( ret && ret.errorCode == '9000' ){
					if( ret.results.id == 0 ){
						let initWOffice = yield call( initWOfficeInfo, ({ orgId : orgId }));
						if( initWOffice && initWOffice.ret && initWOffice.ret.errorCode == '9000' ){
							yield put({
								type : 'updateState',
								payload : {
									id : initWOffice.ret.results.id || ''
								}
							})
						}
					} else {
						yield put({
							type : 'updateState',
							payload : {
								id       : ret.results.id
							}
						})
					}
                    yield put({
                        type : 'updateState',
                        payload : {
                            orgId        : orgId,
							dataSource   : ret.results.menuConfig,

                            orgSelect    : ret.results.orgSelect,
							orgHome      : ret.results.orgHome,
							orgAudition  : ret.results.orgAudition,
                        }
                    });
                }
            }
        },
        //改变机构Id
        *TenantSelectOnSelect({ payload },{ call, put, select }){
            let { value } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    orgId : value,
                }
            })
            let { ret } = yield call( getWOfficeInfo, ({ orgId : value }));
            if( ret && ret.errorCode == '9000' ){
				if( ret.results.id == 0 ){
					let initWOffice = yield call( initWOfficeInfo, ({ orgId : value }));
					if( initWOffice && initWOffice.ret && initWOffice.ret.errorCode == '9000' ){
						yield put({
							type : 'updateState',
							payload : {
								id : initWOffice.ret.results.id || ''
							}
						})
					}
				} else {
					yield put({
						type : 'updateState',
						payload : {
							id       : ret.results.id || ''
						}
					})
				}
				yield put({
                    type : 'updateState',
                    payload : {
                        orgId        : value,
						dataSource   : ret.results.menuConfig,

                        orgSelect    : ret.results.orgSelect,
						orgHome      : ret.results.orgHome,
						orgAudition  : ret.results.orgAudition,

						selectedRows    : [],
						selectedRowKeys : [],
                    }
                })
            }else{
                message.error( ret && ret.errorMessage || '获取微官网设置信息失败' )
            };
        },

		//显示或隐藏显示项
		*showAndHideItem({ payload },{ call, put, select }){
			let wOfficeSetModel = yield select( state => state.wOfficeSetModel );
			let orgId = wOfficeSetModel.orgId;
			let id = wOfficeSetModel.id;
			let { selectedRows, show } = payload;
			let selectedNames = [];
			selectedRows && selectedRows.map(function(item, index){
				selectedNames.push( item.name );
			});
			let params = {
				tabs  : selectedNames.join(','),
				status: show,
				id    : id,
				orgId : orgId,
			}
			let { ret } = yield call( showAndHideItem, ( params ));
			if( ret && ret.errorCode == '9000' ){
				let wOfficeInfo = yield call( getWOfficeInfo, ({ orgId : orgId }) );
				if( wOfficeInfo && wOfficeInfo.ret && wOfficeInfo.ret.errorCode == '9000' ){
					yield put({
						type : 'updateState',
						payload : {
							dataSource      : wOfficeInfo.ret.results.menuConfig,

							orgSelect       : wOfficeInfo.ret.results.orgSelect,
							orgHome         : wOfficeInfo.ret.results.orgHome,
							orgAudition     : wOfficeInfo.ret.results.orgAudition,

							selectedRows    : [],
							selectedRowKeys : [],
						}
					})
				}
			}
		},

		//编辑显示项名称
		*editItem({ payload },{ call, put, select }){
			let { changeTitleModal, selectedRows } = payload;
			if( !!selectedRows && selectedRows.length > 0 ){
				let { id, name, title, url } = selectedRows[0];
				yield put({
					type : 'updateState',
					payload : {
						changeTitleModal : true,
						title            : title,
						linkUrl          : url,
						name             : name,
					}
				})
			};
		},

		//确认更改显示名称
		*confirmChangeTitle({ payload },{ call, put, select }){
			let { changeTitleModal, value } = payload;
			let wOfficeSetModel = yield select( state => state.wOfficeSetModel );
			let orgId = wOfficeSetModel.orgId;
			let id = wOfficeSetModel.id;
			let name = wOfficeSetModel.name;
			let title = value.title;
			let url = value.url || '';
			let { ret } = yield call( confirmChangeTitle, ({ id : id, tab : name, title : title, url : url }));
			if( ret && ret.errorCode == '9000' ){
				let wOfficeInfo = yield call( getWOfficeInfo, ({ orgId : orgId }));
				if( wOfficeInfo && wOfficeInfo.ret && wOfficeInfo.ret.errorCode == '9000' ){
					yield put({
						type : 'updateState',
						payload : {
							dataSource       : wOfficeInfo.ret.results.menuConfig,
							id               : wOfficeInfo.ret.results.id || '',

							orgSelect        : wOfficeInfo.ret.results.orgSelect,
							orgHome          : wOfficeInfo.ret.results.orgHome,
							orgAudition      : wOfficeInfo.ret.results.orgAudition,

							changeTitleModal : false,
							selectedRows     : [],
							selectedRowKeys  : [],
							name             : '',
							title            : '',
							linkUrl          : '',
						}
					});
				}
			}
		},
	},

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	},

}
