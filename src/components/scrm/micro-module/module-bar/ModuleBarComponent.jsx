import React from 'react';
import styles from './ModuleBarComponent.less';
import {Button,Tabs,} from 'antd';
import BaseInfoBar from './BaseInfoBar';
import ShareInfoBar from './ShareInfoBar';
import PageItemBar from './PageItemBar';

let TabPane = Tabs.TabPane;

function ModuleBarComponent ({
    orgId, orgName, moduleConfigData, currentPageKey, pageConfig, activeItemKey, moduleMusicInit, campusProps,
    activityBarKey,changeBarKey, formPageKey,
    updateItem, resetModuleMusic, resetShareImage, payProps,
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

    let form_handles = {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        getFieldError,
        setFields,
        validateFieldsAndScroll,
    }

    let moduleName = moduleConfigData && moduleConfigData.name;
    let moduleType = moduleConfigData && moduleConfigData.type;

    let module_props = (moduleConfigData && moduleConfigData.props) || {};
    let music_props = module_props.music || {};
    let musicUrl = music_props.url || '';
    let musicName = music_props.name || '默认音乐';

    let infoBarProps = {
        form: {...form_handles},
        formData: {
            moduleType,
            orgName,
            moduleName,
            musicUrl,musicName,
        },
        moduleMusicInit,
        resetModuleMusic,
        payProps,
        campusProps,
        moduleConfigData
    };

    //分享设置相关
    let share_config = (module_props && module_props.share) || {};
    let share_title = share_config.title || '';
    let share_intro = share_config.intro || '';
    let share_img_url = share_config.img_url || '';
    let share_max_title_word = share_config.max_title_word || 10;
    let share_max_intro_word = share_config.max_intro_word || 50;

    let shareBarProps = {
        form: {...form_handles},
        formData: {
            title: share_title,
            intro: share_intro,
            share_img : share_img_url,
            share_max_title_word,share_max_intro_word,
        },
        resetShareImage,
    };

    let itemBarProps = {
        form: {...form_handles},
        currentPageKey,
        pageConfig,
        activeItemKey,
        updateItem,
    };

    return (
        <div className={styles.module_bar_cont}>
            <Tabs activeKey={activityBarKey || 'base'} onChange={changeBarKey}>
                <TabPane tab="基础设置" key="base"><BaseInfoBar {...infoBarProps}/></TabPane>
                <TabPane tab="页面设置" key="page"><PageItemBar {...itemBarProps}/></TabPane>
                <TabPane tab="分享设置" key="share"><ShareInfoBar {...shareBarProps}/></TabPane>
            </Tabs>
        </div>
    );
}

export default ModuleBarComponent;
