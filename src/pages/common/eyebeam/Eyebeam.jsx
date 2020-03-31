import React from 'react';
import { connect } from 'dva';
import {beganEyebeamScoket} from '../../../utils/eyebeamUtil.js';
import EyebeamComponent from '../../../components/common/eyebeam/EyebeamComponent';

function Eyebeam({dispatch, eyebeamModel}) {

    let {phoneNumber,phoneState,lineTime,recordVisible,} = eyebeamModel;

    function phoneNumberChange(e) {
        let {target} = e;
        dispatch({
            type: 'eyebeamModel/updateState',
            payload: {
                phoneNumber: target.value
            }
        });
    }

    function onCallClick() {
        makeCall(phoneNumber);
    }

    function eyebeamLogin() {
        if(window.agent_socket == '1') {
            agentLogin();
        } else {
            beganEyebeamScoket({
                eventNotOnline:     (data)=>dispatch({type: 'eyebeamModel/eventNotOnline'}),
                eventAgentLogin:    (data)=>dispatch({type: 'eyebeamModel/eventAgentLogin'}),
                eventAgentLogout:   (data)=>dispatch({type: 'eyebeamModel/eventAgentLogout'}),
                eventAgentReady:    (data)=>dispatch({type: 'eyebeamModel/eventAgentReady'}),
                eventDialing:       (data)=>dispatch({type: 'eyebeamModel/eventDialing', payload: {data}}),
                eventEstablished:   (data)=>dispatch({type: 'eyebeamModel/eventEstablished'}),
                eventReleased:      (data)=>dispatch({type: 'eyebeamModel/eventReleased'}),
            });
        }
    }

    function closeRecordModal() {
        dispatch({
            type: 'eyebeamModel/updateState',
            payload: {
                recordVisible: false
            }
        });
    }

    let comProps = {
        phoneNumber,phoneState,lineTime,recordVisible,closeRecordModal,
        phoneNumberChange,
        onCallClick,
        eyebeamLogin,
    };

    return (
        <EyebeamComponent {...comProps} />
    );
}

function mapStateToProps({eyebeamModel}) {
  return {eyebeamModel};
}

export default connect(mapStateToProps)(Eyebeam);

