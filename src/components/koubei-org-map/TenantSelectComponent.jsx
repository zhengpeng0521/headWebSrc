/*
 *	口碑门店映射
 * 	选择要绑定的商户
 */
import React from 'react';
import { Modal, Spin, } from 'antd';
import styles from './TenantSelectComponent.less';

function TenantSelectComponent ({loading,visible,tenantList,selectTenant,closeTenantSelect,}) {

    return (
        <Modal
            title="选择要绑定的商户"
            visible={visible}
            maskClosable={false}
            closable={true}
            onClose={closeTenantSelect}
            style={{top: '20vh'}}
            width={380}
            footer={null}>

            <div className={styles.login_tenant_select_cont}>
              <Spin tip="正在绑定..." spinning={loading}>
               {tenantList && tenantList.map(function(item, index) {
                    return (
                    <div className={styles.login_tenant_select_item} key={'login_tenant_select_item_'+index}>
                        <div className={styles.tenant_select_item_name} title={item.tenantName} onClick={()=>selectTenant(item.tenantId)}>{item.tenantName}</div>
                    </div>);
                })}
                </Spin>
            </div>

        </Modal>
    );
}

export default TenantSelectComponent;
