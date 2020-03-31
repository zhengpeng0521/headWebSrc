import React, { PropTypes } from 'react';
import { connect } from 'dva';
import StuSignBySelfComponent from '../../../components/erp/stu-sign/StuSignBySelfComponent';

/*
 * 学员签到
 * 排课列表
 */
function StuSignBySelfPage({dispatch, stuSignBySelfModel}) {
    let {
        visible,
        stepFlg,
        qrcode,
        stuSignList,
        qrcodeUrl,
        lodopResourceDownloadUrl,
    } = stuSignBySelfModel;

    function showSwitch() {
        dispatch({
            type: 'stuSignBySelfModel/showSwitch',
        });
    }

    function onCloseClick() {
        dispatch({
            type: 'stuSignBySelfModel/closeShow',
        });
    }

    function signByQrcode(e) {
        let {value} = e.target;
        if((/^@@[0-9]*#[0-9]*#[0-9]*#[0-9]*@@$/.test(value))){
            dispatch({
                type: 'stuSignBySelfModel/signByQrcode',
                payload: {
                    qrcodeStr: value
                }
            });
        } else {
            dispatch({
                type: 'stuSignBySelfModel/updateState',
                payload: {
                    qrcode: value
                }
            });
        }

    }

    let componProps = {
        visible,
        stepFlg,
        qrcode,
        stuSignList,
        qrcodeUrl,

        showSwitch,
        signByQrcode,
        onCloseClick,
        lodopResourceDownloadUrl,
    };

    return (
        <StuSignBySelfComponent {...componProps} />

    );
}

StuSignBySelfPage.propTypes = {
  dispatch: PropTypes.func,
  stuSignBySelfModel: PropTypes.object,
};

function mapStateToProps({stuSignBySelfModel}) {
  return {stuSignBySelfModel};
}

export default connect(mapStateToProps)(StuSignBySelfPage);
