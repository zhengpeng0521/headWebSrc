import React from 'react';
import { connect } from 'dva';
import TenantLoginComponent from '../../components/koubei-org-map/TenantLoginComponent';
import TenantSelectComponent from '../../components/koubei-org-map/TenantSelectComponent';

function TenantLoginPage({dispatch, koubeiOrgMapTenantLoginModel}) {

    let {
        loading,tenantList,tenantSelectVisible,tenantSelectLoading,
    } = koubeiOrgMapTenantLoginModel;

    //绑定租户
    function bindTenant(params) {
        dispatch({
            type: 'koubeiOrgMapTenantLoginModel/bindTenant',
            payload: {
                ...params
            }
        });
    }

    //没有租户-创建租户
    function createTenant() {
        window.location = BASE_URL + '/tenantMappingController/createNewTenantMapping';
    }

    //选择租户
    function selectTenant(tenantId) {
        dispatch({
            type: 'koubeiOrgMapTenantLoginModel/bindTenant',
            payload: {
                tenantId,
            }
        });
    }

    function closeTenantSelect() {
        dispatch({
            type: 'koubeiOrgMapTenantLoginModel/closeTenantSelect',
        });
    }

    let componProps = {
        loading,tenantList,bindTenant,createTenant,
    };

    let selectProps = {
        tenantList,visible: tenantSelectVisible,loading: tenantSelectLoading,selectTenant,closeTenantSelect,
    };

    return (
        <div>
            <TenantLoginComponent {...componProps} />
            <TenantSelectComponent {...selectProps} />
        </div>
    );
}


function mapStateToProps({ koubeiOrgMapTenantLoginModel }) {
  return { koubeiOrgMapTenantLoginModel };
}

export default connect(mapStateToProps)(TenantLoginPage);
