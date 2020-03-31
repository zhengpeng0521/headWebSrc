import React from 'react';
import QueueAnim from 'rc-queue-anim';
import HeadOrgInfo          from '../../../pages/common/header-org-info/HeadOrgInfo';
import HeaderVersionInfo    from '../../../pages/common/header-version-info/HeaderVersionInfo';
import HeaderMenu           from '../../../pages/common/header-menu/HeaderMenu';

import HeaderQrcode         from '../../../pages/common/header-qrcode/HeaderQrcode';
import HeaderLoginUserInfo  from '../../../pages/common/header-login-user-info/HeaderLoginUserInfo';

import VersionInfo from '../version-info/VersionInfo';

import OrgSelectPage from '../../../pages/common/org-select/OrgSelectModalPage';

import styles               from './MainLayout.less';

import WaitPage from './WaitPage';

function MainLayoutComponent ({children, versionInfoVisible, versionInfo, changeVersionInfoVisible, hasInitMenu, }) {
    //顶部导航 高度
    let topLayoutheight = 70;

    return (
        <div className={styles.main_layout}>
           {!hasInitMenu ?
           <WaitPage />
           :
           <div className={styles.main_layout_content}>
                <div className={styles.top_layout}
                   style={{
                        height: topLayoutheight,
                    }}
                >
                  <div className={styles.top_layout_content}>
                      <div className={styles.header_infos}>
                       <HeadOrgInfo />
                        <HeaderMenu />
                   </div>

                    <div className={styles.header_bars}>
                        <div className={styles.handle_bar_cont}>
							<a target = "_blank" href = 'http://saas.ishanshan.com/koubei/systemController/alipay/biz/comm/201607150128330011' className = { styles.to_koubei } >前往口碑插件</a>
							<div className = { styles.to_koubei_icon }></div>
							<div className = { styles.line }>|</div>
                            <HeaderQrcode />
                        </div>
                        <HeaderLoginUserInfo />
                    </div>
                  </div>

                </div>

                <div className={styles.center_layout}
                    style={{
                        height: 'calc(100vh - ' + topLayoutheight +'px)'
                    }}
                >
                    {children}
                </div>

                <VersionInfo visible={versionInfoVisible} versionInfo={versionInfo} changeVisible={changeVersionInfoVisible} />
            </div>
           }
			<OrgSelectPage />
        </div>
    );
}

export default MainLayoutComponent;
