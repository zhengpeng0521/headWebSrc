import React from 'react';
import { ProgressBar } from '../../../../common/new-component/NewComponent';

const FourthStep = ({
  importLoading,      //导入按钮加载状态
}) => {

    return (
        <div style = {{ marginBottom : 20 }}>
            { importLoading ?
                <ProgressBar content = '公海池导入中' height = '50px'/>
                :
                <div>点击确认开始导入公海池</div>
            }
		</div>
    );
};

export default FourthStep;
