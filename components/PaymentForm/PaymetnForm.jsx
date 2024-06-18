import { Box, Button } from '@material-ui/core'
import CurrencyInput from 'components/libs/currencyInput'
import { TableCloseIcon } from 'components/svg'
import React from 'react'
import { useTranslation } from '../../i18n'
import style from './PaymetnForm.module.scss'

const styleMui = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1C192C',
    borderRadius: '12px',
    p: 4,
}
export default function PaymentForm({
    value,
    setValue,
    handleClose,
    handleSubmit,
}) {
    const { t, i18n } = useTranslation()

    return (
        <Box sx={styleMui} style={{ width: 446, height: 360 }}>
            <div>
                <div
                    className="absolute right-[37px] top-[37px] cursor-pointer"
                    onClick={handleClose}
                >
                    <TableCloseIcon />
                </div>
                <div className="mt-7">
                    <h1 className="text-[28px] text-white  font-semibold leading-18 mb-8">
                        {i18n.language !== 'uz' ? t('payment_via') : null} "
                        {i18n.language === 'uz' ? t('payment_via') : null}
                    </h1>
                    <form
                        className="flex item-center justify-center flex-col"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex item-center justify-center flex-col">
                            <label className={style.formLabel}>
                                {t('enterCost')}
                            </label>
                            <CurrencyInput
                                type="text"
                                placeholder={t('enterCostAmount')}
                                className={style.tableInput}
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                            />
                        </div>
                        <div className={style.tableSubmitButton}>
                            <Button type="submit" variant="contained">
                                {t('pay')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Box>
    )
}
