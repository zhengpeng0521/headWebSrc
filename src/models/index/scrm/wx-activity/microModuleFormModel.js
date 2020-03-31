import { message } from 'antd';
import { parse } from 'qs';
import { moduleFormDetail, moduleFormSubmit, } from '../../../../services/scrm/micro-module/microModuleService';
import { objListSort, getFirstOrgsetItem, } from '../../../../utils/arrayUtils';
/*
 * 自定义模板的基本属性表单
 */
export default {

    namespace: 'microModuleFormModel',

    state: {

        showSelectOrgModal: false,   //显隐校区选择
        moduleSelectOrgs : [],  //选中的机构
        moduleOpenOrgs: '',           //模板开通机构，上一界面传入（因为数据在模板列表的单个模板中）
        moduleCampusForm : '',         //获取已经选择的校区（在修改数据的时候）
        moduleAllDataSource : {},       //整个模板的所有数据

        visible: false,//控制是否显隐
        loading: false,//控制是否加载中

        orgId: '',//机构编号
        orgName: '',//机构名称
        moduleId: '',
        moduleCode: '',//微模板的code
        moduleInstId: '',

        moduleConfigData: {},//整个模板的配置项
        moduleConfigDataInit: {},//整个模板的配置项 初始配置

        moduleMusicInit: {},//模板背景音乐的初始值
        moduleShareInit: {},//模板分享的初始值

        currentPageKey: '',//当前操作的页面键
        currentPageConfig: {},//当前操作的页面配置
        activeItemKey: '',//当前正在编辑的元素

        afterFormSubmit: undefined,//表单提交后事件
        activityBarKey: 'base',//设置标签栏当前显示的标签页

        formPageKey: '',//带表单的页面key
        renderShowType: 'page',//实时预览界面显示内容类型  page: 模板页面; share: 分享设置预览

        prevDraging: false,
        moduleInstUrl: '',//实例访问的H5链接
        moduleSavedVisible: false,

        payProps: {			//支付属性
            enablePay: 0,		//否开启支付
            payAmount: 0,		//支付金额
        },
    },

    effects: {
        *handleShow({ payload }, { call, put }) {            
            let orgId = payload && payload.orgId;
            let orgName = payload && payload.orgName;
            let moduleId = payload && payload.moduleId;
            let moduleInstId = payload && payload.moduleInstId;
            let afterFormSubmit = payload && payload.afterFormSubmit;
            let moduleOpenOrgs = payload && payload.moduleOpenOrgs || undefined;
            let moduleSelectOrgs = undefined;
            let moduleCampusForm = undefined;
            let moduleAllDataSource = undefined;
			let __orgIds = [];

            let payProps = { enablePay: 0, payAmount: 0 }, moduleConfigData = {}, currentPageKey = '', currentPageConfig = {}, activeItemKey = '', moduleCode = '', moduleMusicInit = {}, moduleShareInit = {};
            if (moduleId != undefined && moduleId != '') {
                //查询模板详情
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: true,
                    }
                });
                let params = { moduleId, moduleInstId, };
                let { ret } = yield call(moduleFormDetail, parse(params));

                if (ret && ret.errorCode == 9000) {
                	__orgIds = ret &&ret.data &&ret.data.orgIds || [];
                    let mainCfg = ret.data && ret.data.mainCfg;
                    let detailData = ret.data && ret.data.detailData;
                    moduleCode = ret.data && ret.data.moduleCode;
                    
                    moduleCampusForm = ret.data && ret.data.campusForm;
                    moduleAllDataSource = ret.data && ret.data;

                    //初始化支付设置
                    let enablePay = ret.data && ret.data.enablePay;
                    let payAmount = ret.data && ret.data.payAmount;

                    let openOrgIdsArr = [];
                    if (ret.data && ret.data.campusForm) {
                        let openCampus = JSON.parse(ret.data.campusForm) || [];
                        openCampus && openCampus.map((item, index) => {
                            openOrgIdsArr.push(item.orgId || '');
                        })
                    }
                    //处理已经选中的校区
                    moduleSelectOrgs = openOrgIdsArr.join(',') || [];

                    if (enablePay != undefined) {
                        payProps.enablePay = parseInt(enablePay + '');
                    }
                    if (payAmount != undefined) {
                        payProps.payAmount = payAmount;
                    }

                    let mainCfgObj = {}, detailDataObj = [];
                    if (mainCfg && mainCfg.length > 0) {
                        mainCfgObj = JSON.parse(mainCfg);
                    }
                    if (detailData && detailData.length > 0) {
                        detailDataObj = JSON.parse(detailData);
                        detailDataObj = objListSort(detailDataObj, 'seq_no');

                        detailDataObj && detailDataObj.map(function (item, index) {
                            item.index = index;
                            item.page_key = '' + index;
                            item.seq_no = index;
                        });
                    }

                    moduleConfigData = { ...mainCfgObj, pages: detailDataObj };
                    if (detailDataObj && detailDataObj.length > 0) {
                        let firstPageItem = detailDataObj[0];
                        currentPageKey = firstPageItem.page_key;
                        currentPageConfig = firstPageItem;

                        let first_page_items = firstPageItem.items || [];
                        if (first_page_items && first_page_items.length > 0) {
                            let first_item = getFirstOrgsetItem(first_page_items);
                            activeItemKey = first_item.item_key || '';
                        }
                    }

                    //设置模板初始值
                    let module_props = moduleConfigData.props || {};
                    let music_props = module_props.music || {};
                    let share_props = module_props.share || {};

                    moduleMusicInit = JSON.parse(JSON.stringify(music_props));
                    moduleShareInit = { ...share_props };
                } else {
                    message.error((ret && ret.errorMessage) || '模板不存在或者已经被删除');
                    return false;
                }
            } else {
                message.error('模板不存在或者已经被删除');
                return false;
            }

            yield put({
                type: 'updateState',
                payload: {
                    visible: true,
                    loading: false,
                    moduleSelectOrgs: moduleSelectOrgs,
                    moduleOpenOrgs: __orgIds || moduleOpenOrgs,
                    moduleCampusForm: moduleCampusForm,
                    moduleAllDataSource: moduleAllDataSource,
                    orgId, orgName, moduleId, moduleInstId, moduleCode, payProps,
                    moduleConfigData, moduleConfigDataInit: { ...moduleConfigData }, currentPageKey, currentPageConfig, activeItemKey,
                    afterFormSubmit, moduleMusicInit, moduleShareInit,
                    moduleSavedVisible: false, moduleInstUrl: '',
                }
            });
            window._init_music_list = undefined;
            //修改菜单的收缩方式  为收缩
        },

        /*保存基本属性*/
        *handleSubmit({ payload }, { call, put, select }) {

            yield put({
                type: 'updateState',
                payload: {
                    loading: true,
                }
            });

            let microModuleFormModel = yield select(state => state.microModuleFormModel);

            let moduleInstId = microModuleFormModel.moduleInstId;

            let moduleConfigData = microModuleFormModel.moduleConfigData || {};

            let payProps = microModuleFormModel.payProps || {};

            let pages = moduleConfigData.pages || [];
            let detailData = JSON.stringify(pages);
            let mainDataObj = {
                ...moduleConfigData,
                pages: undefined,
            }

            let mainData = JSON.stringify(mainDataObj);

            let params = {
                organId: microModuleFormModel.orgId,
                activityId: microModuleFormModel.moduleId,
                code: microModuleFormModel.moduleCode,
                name: moduleConfigData.name,
                mainData, detailData,
                enablePay: payProps.enablePay,
                payAmount: payProps.payAmount,

                //保存了选择的校区json数据到后台
                campusForm: payload && payload.campusForm,
                orgIds: payload && payload.orgIds,
            };
            if (moduleInstId != undefined && moduleInstId != '') {
                params.moduleInstId = moduleInstId;
            }

            //设置支付配置

            let { ret } = yield call(moduleFormSubmit, parse(params));

            if (ret && ret.errorCode == 9000) {

                let moduleInstUrl = ret.data && ret.data.shareUrl || '';
                let moduleInstId = ret.data && ret.data.instId || '';

                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false, moduleSavedVisible: true,
                        moduleInstUrl, moduleInstId,
                        moduleSelectOrgs : [],
                    }
                });

            } else {
                message.error((ret && ret.errorMessage) || '模板保存失败');
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                    }
                });
            }
        },

        /*保存成功窗口关闭事件*/
        *handleOnSavedClose({ payload }, { call, put, select }) {
            let microModuleFormModel = yield select(state => state.microModuleFormModel);
            let { afterFormSubmit } = microModuleFormModel;
            yield put({
                type: 'updateState',
                payload: {
                    loading: false,
                    visible: false,
                    moduleSavedVisible: false,
                }
            });

            afterFormSubmit && afterFormSubmit();
        },

        /*保存成功窗口- 再次编辑事件*/
        *handleOnSavedEiditAgain({ payload }, { call, put, select }) {

            let microModuleFormModel = yield select(state => state.microModuleFormModel);
            let {
                orgId, orgName, moduleId, moduleCode, moduleInstId, afterFormSubmit,
            } = microModuleFormModel;

            yield put({
                type: 'handleShow',
                payload: {
                    orgId, orgName, moduleId, moduleInstId, afterFormSubmit,
                }
            });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },

        handleClose(state, action) {
            state.afterFormSubmit && state.afterFormSubmit();
            return {
                ...state,
                visible: false,
                loading: false,
                formData: {},
                activityBarKey: 'base',
                orgId: '', orgName: '',
                moduleSelectOrgs : [],
            };
        },

        /*切换当前编辑页面*/
        changeActivePage(state, action) {
            let { pageKey } = action.payload;
            let { moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, } = state;

            let pages = moduleConfigData.pages;
            if (pages && pages.length > 0) {
                pages.map(function (pageItem, pageIndex) {
                    if (pageItem.page_key == pageKey) {
                        currentPageConfig = pageItem;
                        currentPageKey = pageKey;

                        let items = pageItem.items || [];
                        if (items && items.length > 0) {
                            let first_item = getFirstOrgsetItem(items);
                            activeItemKey = first_item.item_key || '';
                        }
                    }
                });
            }

            return { ...state, currentPageKey, currentPageConfig, activeItemKey, activityBarKey: 'page', renderShowType: 'page' };
        },

        toPrevPage(state, action) {
            let { moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, } = state;

            let pages = moduleConfigData.pages;
            let targetPageKey = '';
            if (pages && pages.length > 0) {
                let flg_targetKey = '';
                pages.map(function (pageItem, pageIndex) {
                    if (pageItem.page_key == currentPageKey) {
                        targetPageKey = flg_targetKey;
                    } else {
                        flg_targetKey = pageItem.page_key;
                    }
                });
            }

            if (targetPageKey == '') {
                message.warn('当前已经是最前一页');
            } else {
                pages.map(function (pageItem, pageIndex) {
                    if (pageItem.page_key == targetPageKey) {
                        currentPageKey = targetPageKey;
                        currentPageConfig = pageItem;

                        let items = pageItem.items || [];
                        if (items && items.length > 0) {
                            let first_item = getFirstOrgsetItem(items);
                            activeItemKey = first_item.item_key || '';
                        }
                    }
                });
            }

            return { ...state, currentPageKey, currentPageConfig, activeItemKey, activityBarKey: 'page', renderShowType: 'page' };
        },

        toNextPage(state, action) {
            let { moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, } = state;

            let pages = moduleConfigData.pages;
            let targetPageKey = '';
            if (pages && pages.length > 0) {
                let flg_targetKey = '';
                pages.map(function (pageItem, pageIndex) {
                    if (flg_targetKey != '' && targetPageKey == '') {
                        targetPageKey = pageItem.page_key;
                    } else if (pageItem.page_key == currentPageKey) {
                        flg_targetKey = 'flg';
                    }
                });
            }

            if (targetPageKey == '') {
                message.warn('当前已经是最后一页');
            } else {
                pages.map(function (pageItem, pageIndex) {
                    if (pageItem.page_key == targetPageKey) {
                        currentPageKey = targetPageKey;
                        currentPageConfig = pageItem;

                        let items = pageItem.items || [];
                        if (items && items.length > 0) {
                            let first_item = getFirstOrgsetItem(items);
                            activeItemKey = first_item.item_key || '';
                        }
                    }
                });
            }

            return { ...state, currentPageKey, currentPageConfig, activeItemKey, activityBarKey: 'page', renderShowType: 'page' };
        },

        updateShareConfig(state, action) {
            let { moduleConfigData } = state;
            let { shareConfig } = action.payload;
            let module_props = (moduleConfigData && moduleConfigData.props) || {};
            let share_props = module_props.share || {};
            let newShare = {
                ...share_props, ...shareConfig,
            }
            module_props.share = newShare;
            moduleConfigData.props = module_props;
            return { ...state, moduleConfigData };
        },

        //编辑元素内容
        updateItem(state, action) {
            let { moduleConfigData, currentPageKey, currentPageConfig, } = state;
            let { pageKey, itemKey, itemConfig } = action.payload;

            let pages = (moduleConfigData && moduleConfigData.pages) || [];
            for (let i = 0; i < pages.length; i++) {
                let pageItem = pages[i];
                if (pageItem && pageItem.page_key == pageKey) {
                    currentPageKey = pageKey;
                    let items = pageItem.items || [];
                    for (let j = 0; j < items.length; j++) {
                        let iitem = items[j];
                        if (iitem && iitem.item_key == itemKey) {
                            items[j] = {
                                ...iitem,
                                ...itemConfig,
                            };
                            break;
                        }
                    }
                    pageItem.items = items;
                    pages[i] = pageItem;
                    break;
                }
            }

            return { ...state, moduleConfigData, currentPageKey, currentPageConfig, activeItemKey: itemKey };
        },

        changeActiveItem(state, action) {
            let { itemkey } = action.payload;
            return { ...state, activeItemKey: itemkey, activityBarKey: 'page' };
        },

        changeModuleName(state, action) {
            let { moduleConfigData } = state;
            let { name } = action.payload;
            moduleConfigData.name = name;
            return { ...state, moduleConfigData };
        },

        changeRenderType(state, action) {
            let { moduleConfigData } = state;
            let { renderMode } = action.payload;
            moduleConfigData.renderMode = renderMode;
            return { ...state, moduleConfigData };
        },

        changeModuleMusic(state, action) {
            let { moduleConfigData } = state;
            let { musicUrl, musicName } = action.payload;

            let module_props = moduleConfigData.props || {};
            let musci_props = module_props.music || {};
            musci_props.url = musicUrl;
            musci_props.name = musicName;

            module_props.music = musci_props;
            moduleConfigData.props = module_props;

            return { ...state, moduleConfigData };
        },

        //更改支付配置内容
        changePayProps(state, action) {
            let { payProps } = state;
            let { key, value } = action.payload;

            payProps[key] = value;

            return { ...state, payProps };
        },

        resetModuleMusic(state, action) {
            let { moduleConfigData, moduleMusicInit, } = state;
            let module_props = moduleConfigData.props || {};
            moduleConfigData.props = {
                ...module_props, music: moduleMusicInit,
            };
            return { ...state, moduleConfigData };
        },

        resetShareImage(state, action) {
            let { moduleConfigData, moduleShareInit, } = state;
            let shareImgInit = moduleShareInit && moduleShareInit.img_url;

            let module_props = moduleConfigData.props || {};
            let module_share = module_props.share || {};
            moduleConfigData.props = {
                ...module_props, share: {
                    ...module_share, img_url: shareImgInit,
                },
            };
            return { ...state, moduleConfigData };
        },

        copyPage(state, action) {
            let { moduleConfigData } = state;
            let { pageKey } = action.payload;

            let pages = moduleConfigData.pages || [];

            let current_seqno = 0;
            let current_item = {};
            pages && pages.length > 0 && pages.map(function (item, index) {
                if (item.page_key == pageKey) {
                    current_seqno = item.seq_no;
                    current_item = JSON.parse(JSON.stringify(item));//利用json实现深拷贝
                }
            });

            pages && pages.length > 0 && pages.map(function (item, index) {
                if (item.seq_no > current_seqno) {
                    item.seq_no = item.seq_no + 1;
                }
            });

            if (current_item) {
                let lastItem = pages[pages.length - 1];
                let newindex = lastItem.index + 1;

                current_item.index = newindex;
                current_item.page_key = '' + newindex;
                current_item.seq_no = current_item.seq_no + 1;
                pages.push(current_item);
            }

            moduleConfigData.pages = pages;

            return { ...state, moduleConfigData };
        },

        deletePage(state, action) {
            let { moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, } = state;
            let { pageKey } = action.payload;

            let pages = moduleConfigData.pages || [];

            if (pages.length < 2) {
                message.error('请至少保留一页');
                return { ...state };
            }

            let newPages = [];
            let newCurrentPageKey = '';
            let newCurrentPage = {};
            let newActivityItemKey = '';

            //判断是否删除当前页
            if (pageKey == currentPageKey) {

                let sortPages = [];

                pages && pages.map(function (item, index) {
                    sortPages.push({
                        page_key: item.page_key,
                        seq_no: item.seq_no,
                    });
                });
                sortPages = objListSort(sortPages, 'seq_no');
                let flg = false;

                for (let i = 0; i < sortPages.length; i++) {
                    let pItem = sortPages[i];

                    if (pageKey == pItem.page_key) {
                        flg = true;
                    }
                    pItem.seq_no = i;
                    if (!flg) {
                        newCurrentPageKey = pItem.page_key;
                    }
                }

                //要删除的页是第一页时  选中下一页
                if (newCurrentPageKey == '') {
                    newCurrentPageKey = sortPages[1].page_key;
                }
            } else {
                newCurrentPageKey = currentPageKey;
            }

            pages && pages.length > 0 && pages.map(function (item, index) {
                if (item.page_key != pageKey) {
                    let oitem = JSON.parse(JSON.stringify(item));
                    newPages.push(oitem);//利用json实现深拷贝

                    if (oitem.page_key == newCurrentPageKey) {
                        newCurrentPage = oitem;

                        let first_page_items = oitem.items || [];
                        if (first_page_items && first_page_items.length > 0) {
                            let first_item = getFirstOrgsetItem(first_page_items);
                            newActivityItemKey = first_item.item_key || '';
                        }
                    }
                }
            });

            moduleConfigData.pages = newPages;

            return { ...state, moduleConfigData, currentPageKey: newCurrentPageKey, currentPageConfig: newCurrentPage, activeItemKey: newActivityItemKey };
        },

        updatePagesSort(state, action) {
            let { moduleConfigData } = state;
            let { pages } = action.payload;
            moduleConfigData.pages = pages;
            return { ...state, moduleConfigData };
        },
    },

};
