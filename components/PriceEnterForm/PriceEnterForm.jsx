import styles from './PriceEnterForm.module.scss'
import InputMask from 'react-input-mask'
import { useTranslation } from '../../i18n'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { TableCloseIcon } from 'components/svg'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const styleMui = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '446px',
    height: '360px',
    bgcolor: '#1C192C',
    borderRadius: '12px',
    p: 4,
    outline: 'none',
    padding: 0,
}

export default function PriceEnterForm({
    setPriceModal = () => {},
    setSavedCardsModal = () => {},
    setAddModal = () => {},
    value,
    onChange,
}) {
    const { t, i18n } = useTranslation()
    const storeCards = useSelector((state) => state?.myCardsReducer?.cards)

    const submitPrice = () => {
        if (value.length < 4) return true
        if (value.startsWith('0')) return true

        if (storeCards?.length > 0) {
            console.clear()
            console.log(storeCards.length)
            setPriceModal(false)
            setSavedCardsModal(true)
        } else {
            setPriceModal(false)
            setAddModal(true)
        }
    }

    return (
        <Box sx={styleMui}>
            <div className={styles.container}>
                {/* <button
                    className={styles.headerButton}
                    onClick={() => setPriceModal(false)}
                >
                    <TableCloseIcon />
                </button> */}
                <p className={styles.header}>Оплата через "Uzcard/ Humo"</p>
                {/* form tag */}
                <div className={styles.form}>
                    <div className={styles.label}>{t('enterCost')}</div>
                    <InputMask
                        required
                        maskChar=""
                        mask="99999999"
                        placeholder={t('enterCostAmount')}
                        onChange={onChange}
                        value={value}
                    >
                        {() => (
                            <input
                                type="text"
                                name="cardNumber"
                                onKeyUp={(event) => {
                                    if (
                                        event.code == 'Enter' ||
                                        event.code === 'NumpadEnter'
                                    ) {
                                        submitPrice()
                                    }
                                }}
                                className={styles.input}
                            />
                        )}
                    </InputMask>
                    <Button
                        className={styles.submitButton}
                        onClick={() => submitPrice()}
                        variant="contained"
                    >
                        {t('pay')}
                    </Button>
                </div>
            </div>
        </Box>
    )
}
