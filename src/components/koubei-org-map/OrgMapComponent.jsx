/*
 *	口碑门店映射
 * 	门店映射
 */
import React from 'react';
import { Form, Button, Checkbox, Icon, Spin, Select, Popconfirm,} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './OrgMapComponent.less';

let FormItem = Form.FormItem;
let Option = Select.Option;

function OrgMapComponent ({
	loading,
    saasOrgList,
    koubeiShopList,

    mappedList,
    mappingList,

    bindMap,
    clearSelect,
    unBindMap,
    updateOrgMap,
    orgLoading,shopLoading,mapLoading,isSelectAll,
    selectAllShop,selectNoneShop,
}) {

    let shopListRender = [];
    koubeiShopList && koubeiShopList.length > 0 && koubeiShopList.map(function(shopItem, shopItemIndex) {
        let {shopId,shopName} = shopItem;

        let flg = mappedList.find(function(x) {
            return x.shopId == shopId;
        });

        let hasMapped = (flg != undefined);
        let mappedOrgId = flg ? (flg.orgId+'') : '';

        if(!hasMapped) {
            let flg2 = mappingList.find(function(y) {
                return y.shopId == shopId;
            });
            mappedOrgId = flg2 ? (flg2.orgId+'') : '';
        }

        shopListRender.push(
            <div className={styles.mapping_handle_item} key={'mapping_handle_item_'+shopItemIndex}>

                <div className={styles.shop_info}>
                    <div className={styles.shop_name} title={shopItem.shopName}>{shopItem.shopName}</div>
                    <div className={styles.shop_address}>{shopItem.address}</div>
                </div>

                <div className={styles.map_org_select}>
                    <Select
                       placeholder="请选择要关联的闪闪门店"
                       showSearch
                       optionFilterProp="children"
                       notFoundContent="没有闪闪门店"
                       value={mappedOrgId}
                       onChange={(value)=>bindMap(shopId, value)}
                       disabled={hasMapped}
                       style={{width: '95%', position: 'relative', top: '18%'}}>
                           <Option key='' value=''>无关联门店 (新增门店)</Option>
                        {saasOrgList && saasOrgList.map(function(item) {
                            let flg3 = mappedList.findIndex(function(t) {
                                return t.orgId == item.orgId;
                            });
                            let flg4 = mappingList.findIndex(function(z) {
                                return z.orgId == item.orgId;
                            });
                            let optDis = !(flg3 == -1 && flg4 == -1);
                            return (<Option key={item.orgId+''} value={item.orgId+''} disabled={optDis} >{item.orgName}</Option>);
                        })}
                    </Select>
                </div>

            </div>
        );
    });

    let saasOrgListRender = [];
    saasOrgList && saasOrgList.length > 0 && saasOrgList.map(function(orgItem, orgItemIndex) {
        let {orgId,orgName} = orgItem;

        let flg1 = mappedList.findIndex(function(x) {
            return x.orgId == orgId;
        });
        let flg2 = mappingList.findIndex(function(y) {
            return y.orgId == orgId;
        });

        if(flg1 == -1 && flg2 == -1) {
            saasOrgListRender.push(
                <div
                   className={styles.mapping_org_item}
                   key={'mapping_org_item_' + orgItemIndex}
                >
                    <div className={styles.mapping_org_item_orgname}>{orgItem.orgName}</div>
                    <div className={styles.mapping_org_item_address}>{orgItem.address}</div>
                </div>
            );
        }
    });

	return (
		<div className={styles.tenant_login_cont}>
			<div className={styles.top_logo_cont}>
			    <div className={styles.top_logo_content}>
			        <img className={styles.top_logo} src="https://img.ishanshan.com/gimg/img/ffdcdca8c5c1f6810a315be9a1b236ec"/>
			        <div className={styles.top_logo_text_cont}>
			            <div className={styles.top_logo_text_title}>闪闪SAAS系统</div>
			            <div className={styles.top_logo_text_desc}>一站式早教服务云平台</div>
			        </div>
			    </div>
			</div>
			<div className={styles.login_cont}>

			    <div className={styles.login_title}>
			        绑定门店
			    </div>

			    <div className={styles.bind_content}>

			        <div className={styles.bind_content_desc}>
                        <div className={styles.bind_content_desc_item}>口碑和闪闪的门店如果有相同的门店,请关联后点击[确定]进入SAAS系统</div>
                        <div className={styles.bind_content_desc_item}>口碑和闪闪的门店如果都是不同的门店,直接点击[确定]进入SAAS系统</div>
			        </div>

			        <div className={styles.mapping_cont}>

			            <div className={styles.mapping_handle_cont}>
                            <div className={styles.mapping_handle_title}>
                                <div className={styles.mapping_item_title} style={{width: '50%'}}>口碑门店</div>
                                <div className={styles.mapping_item_title}>闪闪关联的门店</div>
                            </div>
			                <Spin tip="数据加载中..." spinning={shopLoading || mapLoading}>
			                    <div className={styles.mapping_handle_content}>
			                        {shopListRender}
			                    </div>
                            </Spin>
			            </div>

			            <div className={styles.mapping_item}>
			                <div className={styles.mapping_item_title}>闪闪机构</div>
			                <Spin tip="数据加载中..." spinning={orgLoading}>
			                <div className={styles.mapping_item_content}>
                                <QueueAnim type="left" key="mapping_item_content_anim">
			                    {saasOrgListRender}
                                </QueueAnim>
			                </div>
                            </Spin>
			            </div>

			        </div>

			        <div className={styles.submit_btn_cont}>
                         <Popconfirm title="确定按当前关联关系绑定门店吗? (未关联的门店会在SAAS系统新增)" onConfirm={updateOrgMap}  okText="确定" cancelText="取消">
			                <Button type='primary' disabled={loading} loading={loading}>确定</Button>
                        </Popconfirm>
			        </div>
			    </div>
			</div>
		</div>
	)
}

export default OrgMapComponent;
