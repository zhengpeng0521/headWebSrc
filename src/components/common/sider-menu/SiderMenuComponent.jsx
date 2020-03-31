import React from 'react';
import { Icon, Tooltip } from 'antd';
import SiderMenuItem from './SiderMenuItem';
import OrgSelectModalPage from '../../../pages/common/org-select/OrgSelectModalPage';
import stylesNormal from './SiderMenuComponent.less';
import stylesTms from './SiderMenuComponentTms.less';
//是否是番茄田系统
let isTomato = window.runAs=='tomato' ? true : false;
let styles = !isTomato ? stylesNormal : stylesTms;

function SiderMenuComponent ({
    menuLoading,currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,tipVersion,tipUpdateDate,updateMenuRenderInit,
    subMenuOpenChange,menuOnSelect,changeLeftMenuType,changeVersionVisible,

    menuOpenChange,   //切换模块菜单
	menuSelectChange, //点击子菜单
}) {

    let top_header_height = !isTomato?'50px':'0px';

    //收缩菜单时  版本信息展示块
    let common_info_vertical_tip = (
        <div className={styles.common_info_vertical_tip_cont}>
            <div className={styles.sider_menu_version_text}>版本号: {tipVersion}</div>
            <div className={styles.sider_menu_version_text}>更新时间: {tipUpdateDate}</div>
        </div>
    );

    let siderMenuItemProps = {
        currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,updateMenuRenderInit,
        menuOpenChange, menuSelectChange
    };

    return (
        <div className={styles.sider_menu_cont}>

            <div className={styles.sider_menu_trigger_cont} >
                总部系统
            </div>

            <div className={styles.sider_menu_content} style={{height: 'calc(100vh - 100px - ' + top_header_height + ')'}}>
                <SiderMenuItem {...siderMenuItemProps} />
            </div>

            {menuType == 'inline' ?
                <div className={styles.sider_menu_version_cont} onClick={changeVersionVisible} >
                    <div className={styles.sider_menu_version_text}>版本号: {tipVersion}</div>
                    <div className={styles.sider_menu_version_text}>更新时间: {tipUpdateDate}</div>
                </div>
                :
                <div className={styles.sider_menu_version_cont} >
                    <Tooltip placement="right" title={common_info_vertical_tip} trigger="hover" overlayClassName="left_menu_switch_tip">
                        <Icon type="info-circle-o" className={styles.sider_menu_version_icon_vertical} onClick={changeVersionVisible} />
                    </Tooltip>
                </div>
            }
			<OrgSelectModalPage />
        </div>
    );
}

export default SiderMenuComponent;
