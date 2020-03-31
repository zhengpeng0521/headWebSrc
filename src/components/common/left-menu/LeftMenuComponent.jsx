import React from 'react';
import { Menu, Icon, Tooltip, } from 'antd';
import styles from './LeftMenuComponent.less';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenuComponent ({
    currentMenu, currentSubMenu, mapMenuItems, menuLoading, menuType, subMenuOpenChange, menuOnSelect, changeLeftMenuType,
    tipVersion,tipUpdateDate, changeVersionVisible,
}) {

    let loopMenuItem = (data, p) => data.map(function(item) {

        if(item.children && item.children.length > 0) {
            let subTitle = item.icon ?
					(<span><Icon type={item.icon}/>{!!(menuType=='inline') && <span className={styles.menu_name}>{item.name}</span>}</span>) :
                   	(<span><span>{item.name}</span></span>);
            return (
                <SubMenu key={item.menu_key} title={subTitle}>
                    {loopMenuItem(item.children, true)}
                </SubMenu>
            );
        } else {
            let title = item.icon ?
					(<span><Icon type={item.icon}/>{!!(menuType=='inline' || p) && <span className={styles.menu_name}>{item.name}</span>}</span>) :
                   	(<span><span>{item.name}</span></span>);
            return (<Menu.Item key={item.menu_key} title={item.name}>{title}</Menu.Item>);
        }
    });

	let renderMenuItems = [];
    for(let renderItem in mapMenuItems) {
        let menuItemList = mapMenuItems[renderItem];
        if(renderItem == '0') {
            renderMenuItems.push(loopMenuItem(menuItemList));
        } else {
            renderMenuItems.push(
                <MenuItemGroup key={renderItem} title={<div className={styles.menu_cut_off}></div>}>
                    {loopMenuItem(menuItemList)}
                </MenuItemGroup>
            );
        }
    }

    let menuContHeight = document.body.clientHeight - 223;

    //收缩菜单时  版本信息展示块
    let common_info_vertical_tip = (
        <div className={styles.common_info_vertical_tip_cont}>
            <div className={styles.common_info_vertical_tip_item}>版本号: {tipVersion}</div>
            <div className={styles.common_info_vertical_tip_item}>更新时间: {tipUpdateDate}</div>
        </div>
    );

    return (
        <div className={styles.left_menu_cont}>
          <div className={styles.left_menu_switch_cont_border_1}>
              <div className={styles.left_menu_switch_cont_border_2}>
                 <div className={styles.left_menu_switch_cont_border_3}>
                      <div className={menuType == 'inline' ? styles.left_menu_switch_cont : styles.left_menu_switch_on_cont}>
                        <Tooltip placement="right" title={menuType == 'inline' ? '收缩导航' : '展开导航'} trigger="hover" overlayClassName="left_menu_switch_tip">
                            <Icon type={menuType == 'inline' ? 'double-left' : 'double-right'} className={styles.left_menu_switch} onClick={()=>changeLeftMenuType(menuType)}/>
                        </Tooltip>
                     </div>
                  </div>
              </div>
          </div>

          {!!(menuType=='inline') &&
            <div className="common_layout_left_menu_cont">
                <Menu
                  theme='dark'
                  mode={menuType}
                  className={styles.left_menu_content}
                  style={{
                    height: 'calc(100vh - 223px)',
                  }}
                  inlineIndent={document.body.clientWidth > 1336 ? 40 : 30}
                  openKeys={[currentSubMenu]}
                  selectedKeys={[currentMenu]}
                  onOpenChange={subMenuOpenChange}
                  onClick={menuOnSelect}
                  className={document.body.clientWidth > 1336 ? 'common_layout_left_menu_lg' : 'common_layout_left_menu_sm'}
                >
                    {renderMenuItems}
                </Menu>
            </div>
          }

          {!!(menuType=='vertical') &&
            <div className="common_layout_left_menu_shrink">
                <Menu
                  theme='dark'
                  mode={menuType}
                  className={styles.left_menu_content}
                  style={{
                    height: 'calc(100vh - 183px)',
                  }}
                  inlineIndent={0}

                  selectedKeys={[currentMenu]}
                  onClick={menuOnSelect}
                >
                    {renderMenuItems}
                </Menu>
            </div>
          }

          {!!(menuType=='inline') &&
           <div className={styles.common_info}
                style={{
                    height: 90,
                }}
                onClick={changeVersionVisible}
            >
               <Icon type='logo' className={styles.common_info_logo}/>
               <div className={styles.common_info_content}>
                   <div className={styles.common_info_text}>版本号 : {tipVersion}</div>
                   <div className={styles.common_info_text}>更新时间 : {tipUpdateDate}</div>
               </div>
           </div>
            }

            {!!(menuType=='vertical') &&
           <div className={styles.common_info_vertical}
                style={{
                    height: 50,
                }}
                onClick={changeVersionVisible}
            >
                <Tooltip placement="right" title={common_info_vertical_tip} trigger="hover" overlayClassName="left_menu_switch_tip">
                   <Icon type="info-circle-o" className={styles.warn_cont_vertical} />
                </Tooltip>
           </div>
            }
        </div>
    );
}

export default LeftMenuComponent;
