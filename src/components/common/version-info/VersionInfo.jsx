import React from 'react';
import styles from './VersionInfo.less';
import {Modal} from 'antd';
import PageModal from '../page-modal/PageModal';

function VersionInfo ({visible, versionInfo, changeVisible}) {

    let {version,title,details} = versionInfo;

    let version_info_render = [];
    let version_info_index = 0;

    details && details.length > 0 && details.map(function(versionItem, vversionIndex) {
        let detailTitle = versionItem.title || '模块名称';
        let detailItems = versionItem.items || [];

        version_info_render.push(
            <div key={'version_info_item_' + version_info_index++} className={styles.content_item_title}>【{detailTitle}】</div>
        )

        detailItems && detailItems.map(function(dItem, dIndex) {
            version_info_render.push(
                <div key={'version_info_item_' + version_info_index++} className={styles.content_item}>
                    {(dIndex+1)}.{dItem}
                </div>
            )
        });
    });

    return (
        <PageModal
            title='更新提示'
            visible={visible}
            maskClosable={true}
            closable={true}
            onCancel={changeVisible}
            onClose={changeVisible}
            width='600px'
            footer={null}>

			<div className={styles.modal_version_info}>
				<div className={styles.content}>
					<div className={styles.title_cont}>
						<div className={styles.first_title}>{title||'新版本'}</div>
					</div>

					<div className={styles.text_content}>
						<div className={styles.content_title}>本次更新内容包括 :</div>
						{version_info_render}
					</div>
				</div>
			</div>
        </PageModal>
    );
}

export default VersionInfo;
