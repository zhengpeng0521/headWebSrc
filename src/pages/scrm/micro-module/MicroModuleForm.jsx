import React, { PropTypes } from 'react';
import { connect } from 'dva';
import MicroModuleFormComponent from '../../../components/scrm/micro-module/MicroModuleFormComponent';
import { message } from 'antd';

function MicroModuleForm({ dispatch, microModuleFormModel, }) {

    let {
        visible, loading, orgId, orgName, formPageKey, moduleInstUrl, moduleOpenOrgs, moduleSelectOrgs, moduleCampusForm, moduleInstId, moduleAllDataSource,
        moduleConfigData, currentPageKey, currentPageConfig, activeItemKey,
        activityBarKey,
        renderShowType,
        showSelectOrgModal,
        moduleSavedVisible, prevDraging,
        moduleMusicInit,
        payProps,
    } = microModuleFormModel;

    function onClose() {
        dispatch({
            type: 'microModuleFormModel/handleClose',
        });
    }

    function onSubmit(values, afterSubmit) {       
        let orgsArr = moduleSelectOrgs && moduleSelectOrgs.length > 0 ? moduleSelectOrgs.split(',') : [];
        let orgForm = [];

        if (orgsArr && orgsArr.length) {

            let allOrgList = window._init_data.orgIdList && window._init_data.orgIdList;
            if (orgsArr && orgsArr.length > 0) {
                allOrgList && allOrgList.map((i, index) => {                
                    orgsArr && orgsArr.map((j, jIdx) => {
                        if(String(i.orgId) === j) {
                            orgForm.push(i);
                        }
                    })
                })
            }

            if (orgForm && orgForm.length) {
                dispatch({
                    type: 'microModuleFormModel/handleSubmit',
                    payload: {
                        values, afterSubmit,
                        campusForm: JSON.stringify(orgForm),
                        orgIds: moduleSelectOrgs,
                    }
                });
            } else {
                message.error('请选择校区');
            }
        } else {
            dispatch({
                type: 'microModuleFormModel/handleSubmit',
                payload: {
                    values, afterSubmit,
                    campusForm:'',
                }
            });
        }
    }

    /*切换当前编辑页面*/
    function changeActivePage(pageKey) {
        dispatch({
            type: 'microModuleFormModel/changeActivePage',
            payload: {
                pageKey
            }
        });
    }

    /*改变当前显示的设置标签栏*/
    function changeBarKey(activityBarKey) {
        dispatch({
            type: 'microModuleFormModel/updateState',
            payload: {
                activityBarKey,
                renderShowType: activityBarKey == 'share' ? 'share' : 'page',
            }
        });

    }

    function changeShareConfig(shareConfig) {
        dispatch({
            type: 'microModuleFormModel/updateShareConfig',
            payload: {
                shareConfig,
            }
        });
    }

    function toPrevPage() {
        dispatch({
            type: 'microModuleFormModel/toPrevPage',
        });
    }

    function toNextPage() {
        dispatch({
            type: 'microModuleFormModel/toNextPage',
        });
    }

    //改变当前编辑的元素对象
    function changeActiveItem(pagekey, itemkey) {
        dispatch({
            type: 'microModuleFormModel/changeActiveItem',
            payload: {
                pagekey, itemkey,
            }
        });
    }

    //编辑元素
    function updateItem(pageKey, itemKey, itemConfig) {
        dispatch({
            type: 'microModuleFormModel/updateItem',
            payload: {
                pageKey, itemKey, itemConfig
            }
        });
    }

    function handleOnSavedClose() {
        dispatch({
            type: 'microModuleFormModel/handleOnSavedClose',
        });
    }

    function handleOnSavedEiditAgain() {
        dispatch({
            type: 'microModuleFormModel/handleOnSavedEiditAgain',
        });
    }

    //改变模板的名称
    function changeModuleName(name) {
        dispatch({
            type: 'microModuleFormModel/changeModuleName',
            payload: {
                name,
            }
        });
    }

    //改变模板的名称
    function changeModuleMusic(musicUrl, musicName) {
        dispatch({
            type: 'microModuleFormModel/changeModuleMusic',
            payload: {
                musicUrl, musicName,
            }
        });
    }

    /*模板的背景音乐-还原默认*/
    function resetModuleMusic() {
        dispatch({
            type: 'microModuleFormModel/resetModuleMusic',
        });
    }

    /*模板的分享图片-还原默认*/
    function resetShareImage() {
        dispatch({
            type: 'microModuleFormModel/resetShareImage',
        });
    }

    /*复制页*/
    function copyPage(pageKey) {
        dispatch({
            type: 'microModuleFormModel/copyPage',
            payload: {
                pageKey
            }
        });
    }

    /*删除页*/
    function deletePage(pageKey) {
        dispatch({
            type: 'microModuleFormModel/deletePage',
            payload: {
                pageKey
            }
        });
    }

    /**
     * 更改页面顺序
     * @params dragPageKey 拖拽的元素下标
     * @params hoverPageKey 目标的元素下标
     */
    function updatePagesSort(pages) {
        dispatch({
            type: 'microModuleFormModel/updatePagesSort',
            payload: {
                pages
            }
        });
    }

    function prevBeginDrag() {
        dispatch({
            type: 'microModuleFormModel/updateState',
            payload: {
                prevDraging: true
            }
        });
    }

    function changeRenderType(vue) {
        dispatch({
            type: 'microModuleFormModel/changeRenderType',
            payload: {
                renderMode: vue
            }
        });
    }

    function prevEndDrag() {
        dispatch({
            type: 'microModuleFormModel/updateState',
            payload: {
                prevDraging: false
            }
        });
    }

    function changePayProps(key, value) {
        dispatch({
            type: 'microModuleFormModel/changePayProps',
            payload: {
                key, value
            }
        });
    }

    let orgsArr = [];

    if (moduleCampusForm && moduleCampusForm != undefined) {
        let campusFormArr = JSON.parse(moduleCampusForm);
        campusFormArr && campusFormArr.map((item, index) => {
            orgsArr.push(String(item.orgId));
        })
    } else {
        orgsArr = moduleOpenOrgs && moduleOpenOrgs.length > 0 && moduleOpenOrgs.split(',');
    }

    //构造校区数据
    let todealOpenOrgIds = [], newCampusList = [], allOrgList = [];
    if (window._init_data && window._init_data.orgPermissionList && window._init_data.orgPermissionList.length) {
        allOrgList = JSON.parse(JSON.stringify(window._init_data.orgPermissionList));
    }
    
    allOrgList && allOrgList.map((newItem, index) => {
        if (newItem.children && newItem.children.length > 0) {
            newItem.children.map(function (item) {       
                return orgsArr&&orgsArr.findIndex(function (orgItem) {
                    if (String(orgItem) == String(item.key)) {
                        item.disabled = false;
                        newItem.disabled = false;
                        return true;
                    }
                }) > -1;
            })
            newCampusList.push(newItem);
        }
    })
    
    let campusProps = {

        checkStrictly: true,
        selectOrgs: moduleSelectOrgs && moduleSelectOrgs.length > 0 ? moduleSelectOrgs.split(',') : [],
        useThisDataSource: newCampusList,
        showSelectOrgModal: showSelectOrgModal,
        onSelectOrgModalClose: function () {
            dispatch({
                type: 'microModuleFormModel/updateState',
                payload: {
                    showSelectOrgModal: !showSelectOrgModal
                }
            });
        },
        afterSelectOrgModalSubmit: function (vue) {            
            dispatch({
                type: 'microModuleFormModel/updateState',
                payload: {
                    moduleSelectOrgs: vue.join(','),
                }
            });
        },
        modifyActivity: !!moduleInstId || false,
        source : 'microActivity',
    }

    let componentProps = {
        visible, loading, orgId, orgName, moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, moduleInstUrl, moduleMusicInit,
        onSubmit, onClose, moduleAllDataSource, moduleInstId,
        changeActivePage,
        activityBarKey, changeBarKey, formPageKey,
        renderShowType, changeShareConfig,
        toPrevPage, toNextPage, changeActiveItem, updateItem,
        moduleSavedVisible, handleOnSavedClose, handleOnSavedEiditAgain,
        changeModuleName, changeModuleMusic, resetModuleMusic, resetShareImage,
        copyPage, deletePage, updatePagesSort,
        prevDraging, prevBeginDrag, prevEndDrag,
        payProps, changePayProps, changeRenderType,
        campusProps,
    };

    return (
        <MicroModuleFormComponent {...componentProps} />
    );
}

MicroModuleForm.propTypes = {
    dispatch: PropTypes.func,
    microModuleFormModel: PropTypes.object,
};

function mapStateToProps({ microModuleFormModel }) {
    return { microModuleFormModel };
}

export default connect(mapStateToProps)(MicroModuleForm);
