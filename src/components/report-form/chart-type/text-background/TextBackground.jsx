import React from 'react';
import Media from 'react-media';
import { Spin , Button , Icon } from 'antd';
import styles from './TextBackground.less';

/*文字背景图*/
function TextBackground({
    loading,                    //加载状态
    data,                       //跟进记录数据

    ExportSheet,                //导出功能
}){

    return(
        <Spin spinning = { loading }>
            <div className={styles.all}>
                <Button className={styles.export_button} type = 'primary' onClick = {() => ExportSheet('follow_record')}><Icon type = 'export'/>按查询结果导出</Button>
                <div className={styles.inner}>
                    <div className={styles.inner_img}>
                        <img src='https://img.ishanshan.com/gimg/img/8181b9c89ff0f8913995c9fe72cfbc09'/>
                    </div>
                    <div className={styles.inner_text}>
                        <p>{ data || '--' }</p>
                        <p>跟进记录</p>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default TextBackground;
