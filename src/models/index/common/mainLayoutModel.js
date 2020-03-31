import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {listToTree, listToGroup, objListSort} from '../../../utils/arrayUtils';
import {loadAllMenuList, getOrgPermissionList, getMySubordinates, getOrgIdList } from '../../../services/index/common/mainLayoutService';
// 全局布局model
export default {

  namespace: 'mainLayoutModel',

  state: {
      headMenuKey: '',
      allMenuList: [],

      currentUserId: '',        //当前登陆用户的编号
      permissionList: [],       //当前用户拥有的所有权限
      orgPermissionList: [],       //当前用户拥有的机构权限
      subordinates: [],         //当前用户拥有的下属
      selectSubordinate: 'my',    //选中的下属
      SubordinateType : '',       //当前页面类型
      versionInfoVisible: false, //版本更新提示框
      hasInitMenu: false,//是否加载完菜单
      versionInfo: {                //版本信息
          version: '4.0.0',             //版本更新信息-版本号
          title: '闪闪全新版本4.0震撼来袭！',
          updateDate: '2017-11-08', //版本更新信息-更新时间
          details: [
              {
                title: '全局',
                items: [
                    '更加大气美观的视觉效果',
                    '系统和菜单全部移到页面左侧，操作更便捷',
                ]
              },{
                title: 'CRM',
                items: [
                    '创建合同时候允许用户自主填写合同编号了',
										'新增专用课时模块，可指定课时的适用范围',
										'允许手动扣减会员卡里的课时',
										'教材信息升级成物资信息，不仅可录入各类教材、教具，也能添加各类礼品了',
										'其他功能优化'
                ]
              },{
                title: '教学',
                items: [
                    '新增老师工资模块，并可在报表模块查看数据',
										'批量预约班级时会把所有学员可用课时罗列出来，批量操作更便捷了',
										'排课允许标记进度，并在课程表中有所体现',
										'其他功能优化'
                ]
              },{
                title: '报表',
                items: [
                    '销售业绩表优化，销售数据可以总览了',
										'其他功能优化'
                ]
              }, {
                title: '家校通',
                items: [
                    '扫码签到可以扣减课时了',
										'其他功能优化'
                ]
              }, {
                title: '设置',
                items: [
                    '可申请个性化域名了，并且可设置专属登录首页'
                ]
              }
          ],
      },
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(window.currentKernel != '-webkit-'){
                  closeLoadingPageShow && closeLoadingPageShow();
                  closeformal && closeformal();
                  showErrorKernel && showErrorKernel();
              }else if(!hasInitMenu) {
                  window.hasInitMenu = true;                  
                /*加载校区列表(zsb使用)*/
                dispatch({
                   type : 'getOrgIdList',
                });

                  //加载机构权限(zsb使用)
                 dispatch({
                   type: 'initOrgPermissionList',
                 });

                  //加载菜单
                  dispatch({
                    type: 'initMenuList',
                  });

                  //加载拥有的下属
//                  dispatch({
//                    type: 'initSubordinates',
//                  });

                  //获取顶部机构图片
                  dispatch({
                        type : 'headerOrgInfoModel/GetTenantPic',
                  });

                  //获取顶部用户头像
                  dispatch({
                        type : 'headerLoginUserInfoModel/queryUserImg',
                  });

				  //判断是否打开新手引导
				  dispatch({
					  type : 'initGuideModel/openGuideFunc'
				  })
                  //初始化lodop打印配置
//                  dispatch({
//                    type: 'lodopPrintModel/initLodopConfing',
//                  });

                  window.changeHeadMenu = function(headMenu) {
                      dispatch({
                        type: 'changeHeadMenu',
                        payload : {
                            headMenu,
                        }
                      });
                  }
                  window.changeLeftMenu = function(menuKey) {
                      dispatch({
                        type: 'leftMenuModel/changeCurrentMenu',
                        payload : {
                            menuKey,
                        }
                      });
                  }
              }
          });
      },
  },

  effects: {

	  /*得到机构列表用来判断是否需要选择校区*/
	  *getOrgIdList({ payload },{ call, put, select }){
          let { ret } = yield call( getOrgIdList );
		  if( ret && ret.errorCode == 9000 ){
              ret.results.map((item, index) => {
                  item.orgId = String(item.orgId);
                  item.tenantId = String(item.tenantId)
              })
			  window._init_data.orgIdList = ret.results;
		  }
	  },

      /*加载所有菜单*/
      *initMenuList({ payload }, { call, put, select }) {
          let {ret} = yield call(loadAllMenuList);
          if(ret && ret.errorCode == 9000) {
              let roles = []
              ret.results && ret.results.forEach(item => {
                roles.push(item.id)
              })
              window._init_data.roles = roles
              let menuList = listToTree(objListSort(ret.results, 'seq_no'), 0);
//			  yield put({
//				  type : 'indexMainLayoutModel/getSystemType'
//			  })
              yield put({
                  type: 'siderMenuModel/initSiderMenu',
                  payload: {
                      menuTreeList: menuList,
                  }
              });

              if(menuList && menuList.length > 0) {
                  let allMenuList = [];
                  let headMenuList = [];
                  for(let i = 0; i < menuList.length; i++) {
                      let {menu_key, name, seq_no, children} = menuList[i];
					  if( menu_key == 'cerp' || menu_key == 'erp' ){
                      	headMenuList.push({menu_key, name, seq_no, status : true });
					  }else{
					  	headMenuList.push({menu_key, name, seq_no});
					  }
					  allMenuList.push({menu_key, name, seq_no, children: listToGroup(children)});
                  }
				  /*添加虚拟菜单*/
				  let index = undefined;
				  let seq_no = undefined;
				  if( !!headMenuList && headMenuList.length > 0 ){
					 for( let i = 0; i < headMenuList.length; i++ ){
					 	 let item = headMenuList[i];
					  	 if( item.menu_key == 'erp' || item.menu_key == 'cerp' ){
						 	index = i;
							seq_no = item.seq_no;
							break;
						 }
				     }
				  }
				  if( !!index || index == 0 ){
					  headMenuList.splice( index, 0, {
						  menu_key : "erp_main",
						  name : "教学",
						  seq_no : seq_no,
						  status : false
					  })
				  }
				  /*添加虚拟菜单*/
                  yield put({
                    type: 'updateState',
                    payload : {
                        allMenuList,
                    }
                  });
                  yield put({
                    type: 'headerMenuModel/updateState',
                    payload : {
                        headMenuList,
                    }
                  });

                  if(headMenuList && headMenuList.length > 0) {
                      //菜单加载完后 跳转到第一个主菜单
                      let firstHeadMenu = headMenuList[0];
					  let firstHeadMenu1 = undefined;
					  if( firstHeadMenu.menu_key == 'erp_main' ){
						  if( window._init_data.orgIdList.length > 1 ){

						  }else{
						  }
					  }

                  }
              } else {
                  message.error('当前操作没有菜单');
              }
              window.hasInitMenu = true;
              yield put({
                type: 'updateState',
                payload : {
                    hasInitMenu: true,
                }
              });


              //判断是否打开过最新版的版本提示
              yield put({
                type: 'checkVersionInfo'
              });
          } else {
              message.error(ret && ret.errorMessage || '查询菜单出错啦');
          }
      },

      /*判断是否打开过最新版的版本提示*/
      *checkVersionInfo({ payload }, { call, put, select }) {
          let mainLayoutModel = yield select(state => state.mainLayoutModel);
          let {versionInfo} = mainLayoutModel;
          let localVersion = (versionInfo && versionInfo.version) || '0.0.0';
          let localVersionKey = 'saas_local_version_' + localVersion;
          //读取本地的localstorage
          let localVersionValue = localStorage.getItem(localVersionKey);

          if(localVersionValue == undefined || localVersionValue == '') {
              //延时显示版本提示
              let sleep = function(ms) {
                return new Promise(function(resolve, reject){
                        setTimeout(function(){
                            resolve()
                        }, ms);
                    });
                }
              yield sleep(2000);
              yield put({
                type: 'changeVersionInfoVisible'
              });
              localStorage.setItem(localVersionKey, "true");
          }

      },

      /*变更顶部一级菜单*/
      *changeHeadMenu({ payload }, { call, put, select }) {
          let mainLayoutModel = yield select(state => state.mainLayoutModel);
          let {allMenuList} = mainLayoutModel;

          if(!hasInitMenu) {
              let {ret} = yield call(loadAllMenuList);
              mainLayoutModel = yield select(state => state.mainLayoutModel);
              allMenuList = mainLayoutModel.allMenuList;
          }
          let headMenu = payload.headMenu;
          yield put({
            type: 'updateState',
            payload : {
                headMenuKey: headMenu,
            }
          });

          yield put({
            type: 'headerMenuModel/updateState',
            payload : {
                currentMenuKey: headMenu,
            }
          });
          let mapMenuItems = {};
          for(let i = 0; i < allMenuList.length; i++) {
              let {menu_key, children} = allMenuList[i];
              if(menu_key == headMenu) {
                  mapMenuItems = children;
                  break;
              }
          }

          yield put({
            type: 'leftMenuModel/updateState',
            payload : {
                mapMenuItems,
            }
          });

          //获取第一项可点击的菜单项
          function getFirstMenuItem(menuList) {
              let keys = Object.keys(menuList);
              if(keys && keys.length > 0) {
                  let firstKey = keys[0];
                  let firstGroup = menuList[firstKey];

                  if(firstGroup && firstGroup.length > 0) {
                      let firstMenu = firstGroup[0];

                      if(firstMenu.children && firstMenu.children.length > 0) {
                          return firstMenu.children[0];
                      } else {
                          return firstMenu;
                      }
                  }
              }
          }
          let firstMenuItem = getFirstMenuItem(mapMenuItems);

          if(firstMenuItem && firstMenuItem.menu_key != undefined && firstMenuItem.menu_key != '') {
              yield put(routerRedux.push({
                pathname: firstMenuItem.menu_key,
              }));
          }
      },

      /*加载拥有的机构权限*/
      *initOrgPermissionList({ payload }, { call, put, select }) {
          let {ret} = yield call(getOrgPermissionList);
          if( ret && ret.errorCode == 9000 ){
              yield put({
                type: 'updateState',
                payload : {
                    orgPermissionList: ret.results,
                }
              });
              //缓存用户有管辖权限的机构
              window._init_data.orgPermissionList = ret.results;
              //缓存用户有管辖权限的第一家机构
              if(ret.results && ret.results.length > 0) {
                    let orglist = ret.results[0].children;
                    let firstOrg = {};
                    if(orglist && orglist.length > 0) {
                        firstOrg = orglist[0];
                        if(firstOrg && firstOrg.pid == '0') {
                            //第一家校区是总部时跳过
                            if(orglist.length > 1) {
                                firstOrg = orglist[1];
                            } else {
                                orglist = ret.results.length > 1 && ret.results[1].children;
                                firstOrg = orglist && orglist.length > 0 && orglist[0];
                            }
                        }
                    }
                    window._init_data.firstOrg = firstOrg;
                }
          } else {
              message.error((ret && ret.errorMessage) || '没有获取到机构权限信息');
          }
      },

      /*加载拥有的下属*/
      *initSubordinates({ payload }, { call, put, select }) {
          let {ret} = yield call(getMySubordinates);
          if( ret && ret.errorCode == 9000 ){
              yield put({
                type: 'updateState',
                payload : {
                    currentUserId: ret.userId,
                    subordinates: ret.results,
                }
              });
          } else {
              message.error((ret && ret.errorMessage) || '没有获取到下属信息');
          }
      },
  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      changeVersionInfoVisible(state, action) {
            let {versionInfoVisible} = state;
            return {...state, versionInfoVisible: !versionInfoVisible, }
      },
      closeVersionInfoVisible(state, action) {
            return {...state, versionInfoVisible: false, }
      },
  },

}
