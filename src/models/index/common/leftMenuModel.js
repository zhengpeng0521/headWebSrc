import { routerRedux } from 'dva/router';
//侧边栏菜单
export default {

  namespace: 'leftMenuModel',

  state: {
      currentMenu: '',
      currentSubMenu: '',
      mapMenuItems: {},//按分组的菜单对象
      menuLoading: false,

      menuType: 'inline',  //vertical  /   inline

      tipVersion: '3.2.0',            //版本更新信息-版本
      tipUpdateDate: '2017-07-20',      //版本更新信息-更新时间
  },

    effects: {

        *changeCurrentMenu({ payload }, { call, put, select }) {
            let leftMenuModel = yield select(state => state.leftMenuModel);
            let {currentMenu, currentSubMenu, mapMenuItems, } = leftMenuModel;

            let newSubMenu = currentSubMenu;
            let newMenu = payload.menuKey;

            let groupIds = Object.keys(mapMenuItems);
            for(let groupId in groupIds) {
              let menuList = mapMenuItems[groupId];
              if(menuList && menuList.length > 0) {
                for(let i = 0; i < menuList.length; i++) {
                    let item = menuList[i];
                    let children = item.children;
                    if(children && children.length > 0) {
                        for(let j = 0; j < children.length; j++) {
                            if(children[j].menu_key == newMenu) {
                                newSubMenu = item.menu_key;
                            }
                        }
                    }
                }
              }
            }

            yield put({
            type: 'updateState',
            payload : {
                currentMenu: newMenu,
                currentSubMenu: newSubMenu,
            }
            });
        },

        *changeMenuType({ payload }, { call, put, select }) {
            let leftMenuModel   = yield select(state => state.leftMenuModel);
            let {menuType} = leftMenuModel;
            let newMenuType = menuType == 'inline' ? 'vertical' : 'inline';

            yield put({
                type: 'updateState',
                payload: {
                    menuType: newMenuType,
                }
            });

            yield put({
                type: 'commonLayoutModel/updateState',
                payload: {
                    collapsed: newMenuType == 'inline' ? false : true,
                }
            });
        },

        /*菜单收缩时修改宽度*/
        *'changeOffsetWidth'({ payload }, { call, put, select }){
            if(document.getElementById("zj_scrm_overview") != null){
                let width = document.getElementById("zj_scrm_overview").offsetWidth;
                let widthLevel;
                if(payload.type == 'inline'){
                    if(parseInt(width) + 200 > 1500){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv1',
                                windowWidth : parseInt(width) + 200,      //当前浏览器宽度
                            }
                        });
                    }else if(parseInt(width) + 200 > 1058){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv2',
                                windowWidth : parseInt(width) + 200,      //当前浏览器宽度
                            }
                        });
                    }else if(parseInt(width) + 200 > 666){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv3',
                                windowWidth : parseInt(width) + 200,      //当前浏览器宽度
                            }
                        });
                    }else{
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv4',
                                windowWidth : parseInt(width) + 200,      //当前浏览器宽度
                            }
                        });
                    }
                }else{
                    if(parseInt(width) - 200 > 1500){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv1',
                                windowWidth : parseInt(width) - 200,      //当前浏览器宽度
                            }
                        });
                    }else if(parseInt(width) - 200 > 1058){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv2',
                                windowWidth : parseInt(width) - 200,      //当前浏览器宽度
                            }
                        });
                    }else if(parseInt(width) - 200 > 666){
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv3',
                                windowWidth : parseInt(width) - 200,      //当前浏览器宽度
                            }
                        });
                    }else{
                        yield put({
                            type:'scrmOverView/updateState',
                            payload:{
                                windowWidthLevel : 'Lv4',
                                windowWidth : parseInt(width) - 200,      //当前浏览器宽度
                            }
                        });
                    }
                }
            }
        },
    },

  reducers: {

      /*
       * 开始加载菜单
       */
      beginLoadMenu(state, action) {
          return { ...state, menuLoading: true };
      },

      updateMenuList(state, action) {
          return { ...state, menuLoading: false, ...action.payload, };
      },

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
