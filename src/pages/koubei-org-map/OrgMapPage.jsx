import React from 'react';
import { connect } from 'dva';
import OrgMapComponent from '../../components/koubei-org-map/OrgMapComponent';

function OrgMapPage({dispatch, koubeiOrgMapOrgMapModel}) {

    let {
        loading,
        saasOrgList,
        koubeiShopList,
        selectOrg,
        selectShop,
        mappedList,
        mappingList,
        orgLoading,shopLoading,mapLoading,isSelectAll,
    } = koubeiOrgMapOrgMapModel;

    //选中saas机构
    function selectSaasOrg(orgId, type) {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/selectSaasOrg',
            payload: {
                orgId, type
            }
        });
    }

    //选中口碑门店
    function selectKoubeiShop(shopId, type) {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/selectKoubeiShop',
            payload: {
                shopId, type
            }
        });
    }

    //绑定选中的门店
    function bindMap(shopId, orgId) {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/bindMap',
            payload: {
                shopId, orgId
            }
        });
    }

    //清除选中的门店
    function clearSelect() {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/clearSelect',
        });
    }

    //解除绑定门店
    function unBindMap(orgId, shopId) {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/unBindMap',
            payload: {
                orgId, shopId
            }
        });
    }

    function selectAllShop() {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/selectAllShop',
        });
    }

    function selectNoneShop() {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/selectNoneShop',
        });
    }

    //更新门店绑定
    function updateOrgMap() {
        dispatch({
            type: 'koubeiOrgMapOrgMapModel/updateOrgMap',
        });
    }

    let componProps = {
        loading,
        saasOrgList,
        koubeiShopList,
        selectOrg,
        selectShop,
        mappedList,
        mappingList,
        selectSaasOrg,
        selectKoubeiShop,
        bindMap,
        clearSelect,
        unBindMap,
        orgLoading,shopLoading,mapLoading,isSelectAll,
        selectAllShop,selectNoneShop,updateOrgMap,
    };

    return (
        <div>
            <OrgMapComponent {...componProps} />
        </div>
    );
}

function mapStateToProps({ koubeiOrgMapOrgMapModel }) {
  return { koubeiOrgMapOrgMapModel };
}

export default connect(mapStateToProps)(OrgMapPage);
