import React from 'react';
import {Icon, Button} from 'antd';
import styles from './MobileContent.less';

function MobileContent ({
    children,
    current_page_index, all_page_count,
    toPrevPage, toNextPage,
}) {

    let h5_mobile_show_style = {};
    h5_mobile_show_style.background = 'url(//img.ishanshan.com/gimg/img/9bc7e6602309821fa2ca5614c2882bd7) no-repeat';
    h5_mobile_show_style.backgroundSize = 'cover';
    h5_mobile_show_style.width = '400px';
    h5_mobile_show_style.height = '704px';
    h5_mobile_show_style.display = 'inline-block';
    h5_mobile_show_style.position = 'relative';
    h5_mobile_show_style.marginTop = '50px';

    return (
        <div
           style={h5_mobile_show_style}
           >

           <div className={styles.mobile_content}>
               {children}
           </div>

           <div className={styles.page_state}>
               <div>预览器 {current_page_index}/{all_page_count}</div>
          </div>

           <div className={styles.show_cont_bar}>
                <div className={styles.prev_page_bar} onClick={toPrevPage} >
                    <Icon type="left" className={styles.show_cont_bar_icon} title="上一页" />
                </div>

                <div className={styles.next_page_bar} onClick={toNextPage}>
                    <Icon type="right" className={styles.show_cont_bar_icon} title="下一页" />
                </div>
            </div>
        </div>
    );
}

export default MobileContent;
