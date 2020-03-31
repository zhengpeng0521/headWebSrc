import React from 'react'
import styles from './IncomeTotal.less';

function IncomeTotal({
  total
}){

  let columns = [
    {label: '退费前业绩', key: 'dicmoneyBefore'},
    {label: '订金金额', key: 'deposit'},
    {label: '实收金额', key: 'payAmount'},
    {label: '退费金额', key: 'refunds'},
    {label: '业绩金额', key: 'performance'},
    {label: '到访数', key: 'visitNum'},
    {label: '签单数', key: 'signBillNum'},
    {label: '签单比', key: 'signBillRate'},
    {label: '签单课时', key: 'signBillClass'},
    {label: '课时单价', key: 'classPrice'},
  ]

  return (
    <div className = { styles.report_form_top_total }>
      <ul className = { styles.report_form_top_total_title }>
        <li>统计类型</li>
        {columns.map((item, index) => {
          return (
            <li key={'title'+index}>{item.label}</li>
          )
        })}
      </ul>
      <ul className = { styles.report_form_top_total_date }>
        <li>总计</li>
        {columns.map((item, index) => {
          return (
            <li key={'value'+index}>{total[item.key] || '0'}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default IncomeTotal
