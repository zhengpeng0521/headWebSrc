import React from 'react';
import styles from './HeaderMenuComponent.less';
import { Link } from 'dva/router';
import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;

import HeaderProductService from '../../../pages/common/header-product-service/HeaderProductService';
import HeaderQrcode         from '../../../pages/common/header-qrcode/HeaderQrcode';

function HeaderMenuComponent ({headMenuList, currentMenuKey, onMenuItemClick}) {
    return (
        <div className="common_header_menu_content"
             style={{
                width: 'calc(100vw - 715px)',
                paddingLeft: 20,
             }}>
          <Tabs activeKey={currentMenuKey} onTabClick={onMenuItemClick}>
              {headMenuList && headMenuList.length > 0 && headMenuList.map(function(item) {
				  if( !item.status ){
                  	return (<TabPane tab={item.name} key={item.menu_key} ></TabPane>);
				  }
            })}
          </Tabs>
        </div>
    );
}

export default HeaderMenuComponent;
