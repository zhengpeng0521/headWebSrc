import React from "react"
import styles from "./TmkSheetTotal.less"

function TmkSheetTotal({ total }) {
  let columns = [
    { label: "Leads数", key: "leadsNum" },
    { label: "已跟进", key: "yetFollow" },
    { label: "未跟进", key: "notFollow" },
    { label: "待跟进", key: "toFollow" },
    { label: "预约到访", key: "appointVisit" },
    { label: "预约试听", key: "appointAudition" },
    { label: "到访数", key: "visitNum" },
    { label: "到访比", key: "visitRat" },
    { label: "签单数", key: "purNum" },
    { label: "到访签单比", key: "purVisitRat" },
    { label: "签单金额", key: "purMoney" }
  ]

  return (
    <div className={styles.report_form_top_total}>
      <ul className={styles.report_form_top_total_title}>
        <li>统计类型</li>
        {columns.map((item, index) => {
          return <li key={"title" + index}>{item.label}</li>
        })}
      </ul>
      <ul className={styles.report_form_top_total_date}>
        <li>总计</li>
        {columns.map((item, index) => {
          return <li key={"value" + index}>{total[item.key] || "0"}</li>
        })}
      </ul>
    </div>
  )
}

export default TmkSheetTotal
