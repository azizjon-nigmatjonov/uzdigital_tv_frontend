import { ArrowRight } from 'components/svg'
import styles from './UpBalanceItem.module.scss'

export default function UpBalanceItem({ data, onClick }) {
    return (
        <div onClick={onClick} className={styles.block}>
            <div className={styles.title}>
                <div className={styles.icon}>{data?.icon}</div>
                <div className={styles.name}>{data?.title}</div>
            </div>
            <div className={styles.arrow}>
                <ArrowRight width="30" height="30" />
            </div>
        </div>
    )
}
