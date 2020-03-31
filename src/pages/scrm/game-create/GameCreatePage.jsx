import React, { PropTypes } from 'react';
import { connect } from 'dva';
import GameCreateComponent from '../../../components/scrm/game-create/GameCreateComponent';

function GameCreatePage({ dispatch, gameTemplateCreate,microGameMgrModel }) {

    let {

        attrShowPageModal,
        attrGameFrameUrl,
        isH5
    } = gameTemplateCreate;
    let {
        newGameLoading
    } = microGameMgrModel

    /**
     * 
     * @param {string} name    需要调起的action
     * @param {object} params  需要的参数
     */
    function dp(name, params) {
        dispatch({
            type: `gameTemplateCreate/${name}`,
            payload: {
                ...params,
            }
        })
    }

    /**
     * @param {object} params  需要更新的属性
     */
    function funcUpdateParams(params) {
        dp('updateState', params);
    }

    /**
     * 关闭最大弹框
     */
    function funcHandleClose() {
        funcUpdateParams({
            attrShowPageModal: !attrShowPageModal,
        });
    }

    /**
     * 提交最大弹框数据
     */
    function funcHandleOnSubmit(vue) {
        funcUpdateParams({
            attrShowPageModal: !attrShowPageModal
        });
    }
    let props = {
        attrShowPageModal,
        attrGameFrameUrl,
        newGameLoading,
        isH5,
        funcUpdateParams,
        funcHandleClose,
        funcHandleOnSubmit,
    }
    return (
        <GameCreateComponent {...props} />
    );
}

function mapStateToProps({ gameTemplateCreate, microGameMgrModel }) {
    return { gameTemplateCreate, microGameMgrModel };
}

export default connect(mapStateToProps)(GameCreatePage);
