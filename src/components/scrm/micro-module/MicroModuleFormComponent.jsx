import React from 'react';
import styles from './MicroModuleFormComponent.less';
import PageModal from './page-modal/PageModal';
import ModuleShowComponent from './module-show/ModuleShowComponent';
import ModuleBarComponent from './module-bar/ModuleBarComponent';
import ModulePagePrev from './module-prev/ModulePagePrev';
import ModuleSaved from './module-save/ModuleSaved';
import {Button,Form,Popconfirm,} from 'antd';


/**
 * 自定义模板-基本属性表单
 * 表单组件
 */
function MicroModuleFormComponent ({
    visible, loading, orgId, orgName, moduleConfigData, currentPageKey, currentPageConfig, activeItemKey, moduleInstUrl, moduleMusicInit,
    onSubmit, onClose, form, moduleAllDataSource, moduleInstId,
    changeActivePage, changeActiveItem, toPrevPage, toNextPage,
    activityBarKey,changeBarKey, formPageKey,
    renderShowType,
    updateItem,
    changeShareConfig,
    changeModuleName, changeModuleMusic,changePayProps, payProps,
    moduleSavedVisible, handleOnSavedClose, handleOnSavedEiditAgain, resetModuleMusic, resetShareImage,
    copyPage, deletePage, updatePagesSort,
    prevDraging, prevBeginDrag, prevEndDrag,
    campusProps,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        setFields,
        getFieldError,
        validateFieldsAndScroll,
    }
}) {
    
    function handleClose() {
        resetFields();
        onClose && onClose();
        window._init_music_list = undefined;
    }

    function handleOnSubmit() {

        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                for(let key in err) {
                    //对各个表单错误显示不同的界面
                    if(key == 'name' || key == 'payAmount' || 'orgIds') {
                        changeBarKey && changeBarKey('base');
                    } else if(key == 'share_title' || key == 'share_intro' || key == 'shareImgList') {
                        changeBarKey && changeBarKey('share');
                    } else {
                        changeBarKey && changeBarKey('page');
                    }
                    return;
                }
            }
            onSubmit && onSubmit();
        });
    }

    let {name} = moduleConfigData;
    let prev_width = 130,bar_width = 580;
    let width_leave = prev_width + bar_width;

    let pageConfig = {
        moduleConfigData, currentPageKey, pageConfig: currentPageConfig, activeItemKey, renderShowType,
    };

    let prev_props = {
        changeActivePage,
        updatePagesSort,
        copyPage, deletePage,
        prevDraging, prevBeginDrag, prevEndDrag,
    };

    let bar_props = {
        campusProps,
        activityBarKey,changeBarKey, orgId, orgName, formPageKey, updateItem, resetModuleMusic, resetShareImage, moduleMusicInit,payProps,
    }

    let moduleSavedProps = {
        visible: moduleSavedVisible,
        moduleName: name,
        moduleInstUrl,
        onClose: ()=> {
            resetFields && resetFields();
            handleOnSavedClose && handleOnSavedClose();
            window._init_music_list = undefined;
        },//保存成功窗口点击关闭
        onEditAgain: handleOnSavedEiditAgain,//保存成功窗口点击再次编辑
    };

    let _disabled = moduleAllDataSource && (moduleAllDataSource.isHq === 0 || moduleAllDataSource.isHq === false) && moduleInstId;

    return (
        <PageModal
           visible={visible}
           maskClosable={false}
           title={name}
           width="calc(100vw - 150px)"
           onClose={handleClose}
           footer={[
                <Popconfirm title="确定要保存吗?" onConfirm={handleOnSubmit} placement="bottomRight" >
                   <Button type="primary" disabled={_disabled} loading={loading} >提交</Button>
                </Popconfirm>,
                <Popconfirm title="确定要关闭窗口吗?" onConfirm={handleClose} placement="bottomRight" >
                    <Button type="ghost">关闭</Button>
                </Popconfirm>
            ]}
        >
            <div className={styles.module_form_page}>

                <div className={styles.module_prev_cont} style={{width: prev_width}}>
                    <ModulePagePrev {...pageConfig} {...prev_props}/>
                </div>

                <div className={styles.module_show_cont} style={{width: bar_width}} >
                    <div className={styles.module_show_content}>
                        <ModuleShowComponent {...pageConfig}  toPrevPage={toPrevPage} toNextPage={toNextPage} changeActiveItem={changeActiveItem} />
                    </div>
                </div>

                <div className={styles.module_bar_cont} style={{width: 'calc(100% - ' + width_leave + 'px)'}}>
                    <ModuleBarComponent form={{...form}} {...pageConfig} {...bar_props} />
                </div>
            </div>

            {!!moduleSavedVisible && <ModuleSaved {...moduleSavedProps} />}

        </PageModal>
    );

}

function onFieldsChange(props, fields) {

    /*分享相关设置表单值改变时  改变model里的值*/
    let share_title = fields && fields.share_title;
    let share_intro = fields && fields.share_intro;
    let shareImgList = fields && fields.shareImgList;

    let name = fields && fields.name;
    let musicList = fields && fields.musicList;
    
    let enablePay = fields && fields.enablePay;//支付开关
    let payAmount = fields && fields.payAmount;//支付金额

    let renderType = fields && fields.renderType;//渲染类型

    let shareConfig = undefined;

    if(share_title != undefined) {
        shareConfig = shareConfig || {};
        shareConfig.title = share_title.value || '';
    }

    if(share_intro != undefined) {
        shareConfig = shareConfig || {};
        shareConfig.intro = share_intro.value || '';
    }

    if(shareImgList != undefined) {
        shareConfig = shareConfig || {};
        let img_url = '';

        if(shareImgList.value && shareImgList.value.length > 0) {
            let firstImg = shareImgList.value[0];
            img_url = firstImg && firstImg.url;
        }
        shareConfig.img_url = img_url || '';
    }

    if(name != undefined) {
        props.changeModuleName && props.changeModuleName(name.value);
    }
    
    if(enablePay != undefined) {
        props.changePayProps && props.changePayProps('enablePay', enablePay.value);
    }
    
    if(payAmount != undefined) {
        props.changePayProps && props.changePayProps('payAmount', payAmount.value);
    }

    if (renderType != undefined) {
        props.changeRenderType && props.changeRenderType(renderType.value);
    }

    if(musicList != undefined) {
        let music_url = '', music_name = '';

        if(musicList.value && musicList.value.length > 0) {
            let firstFile = musicList.value[0];
            music_url = firstFile && firstFile.url || '';
            music_name = firstFile && firstFile.name || '';
        }
        props.changeModuleMusic && props.changeModuleMusic(music_url, music_name);
    }

    shareConfig && props.changeShareConfig && props.changeShareConfig (shareConfig);
}


export default Form.create({
    onFieldsChange,
})(MicroModuleFormComponent);
