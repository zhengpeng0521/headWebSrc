import { routerRedux } from 'dva/router';

//顶部导航-一级菜单
export default {

  namespace: 'headerMenuModel',

  state: {
      currentMenuKey: '/',
      headMenuList: [],
  },

  effects: {

      *changeCurrentMenu({ payload }, { call, put, select }) {
          let {menuKey, headMenuList} = payload;
		  if( menuKey == 'erp_main' ){
			  if( window._init_data.orgIdList.length > 1 ){
				  let orgIdList = window._init_data.orgIdList;
				  yield put({
					  type : 'orgSelectModel/openOrgSelectModal',
					  payload : {
						  orgIdList,
						  headMenuList
					  }
				  })
				  return;
			  }else{
				  let orgKind = !!window._init_data && !!window._init_data.orgIdList && window._init_data.orgIdList[0].orgKind;
				  window._init_data.cerp_orgId = !!window._init_data && !!window._init_data.orgIdList && window._init_data.orgIdList[0].orgId;
				  !!headMenuList && headMenuList.map(function( item, index ){
					  if( item.menu_key == 'erp_main' ){
						  item.status = true;
					  }
					  if( orgKind == '1' ){
						  if( item.menu_key == 'cerp' ){
							  item.status = false
						  }
					  }else{
						  if( item.menu_key == 'erp' ){
							  item.status = false
						  }
					  }
				  })
				  yield put({
				  	type: 'updateState',
					payload : {
						headMenuList,
					}
				  });
				  if( orgKind == '1' ){
					  menuKey = 'cerp'
				  }else {
					  menuKey = 'erp'
				  }
			  }
		  }else{
			  !!headMenuList && headMenuList.map(function( item, index ){
				  if( item.menu_key == 'erp_main' ){
					  item.status = false;
				  }
				  if( item.menu_key == 'cerp' ){
					  item.status = true
				  }
				  if( item.menu_key == 'erp' ){
					  item.status = true
				  }
			  })
		  }
          yield put({
              type: 'mainLayoutModel/changeHeadMenu',
              payload: {
                 headMenu: menuKey,
              }
          });
      },
  },

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },
  },

}
