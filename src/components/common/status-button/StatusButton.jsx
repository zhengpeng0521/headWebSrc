import React from 'react';
import styles from './StatusButton.less';

/*状态标志项*/
function StatusButton({
    children,           //modal_content内容
    type,
}) {

    return(
        <div className={styles.status_button} style={ type == 'red' ? { backgroundColor : '#ff7f75' } :
                                                      type == 'gray' ? { backgroundColor : '#a9b4bc' } :
                                                      type == 'yellow' ? { backgroundColor : '#fcc047' } : { backgroundColor : '#5d9cec' } }>
            { children }
        </div>
    );
}

export default StatusButton;
