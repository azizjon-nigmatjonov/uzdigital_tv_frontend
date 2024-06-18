import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import style from './Modal.module.scss'
import MainButton from 'components/button/MainButton'
import { useTranslation } from 'i18n'

export default function InfoModal({
    icon = '',
    open,
    setOpen,
    onClick,
    title,
    text,
    mainButton,
    bgColorCencel = 'bg-[#C6C6C6]',
    bgColorMain = 'bg-[#383641]',
    textColorMain = 'text-[#fff]',
}) {
    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }
    const { t } = useTranslation()

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div className={`${style.info_modal}`}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(16, 16, 16, 0.5)',
                    },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1C192C !important',
                        color: '#fff !important',
                        textAlign: 'center',
                        boxShadow:
                            '0 0 20px 10px rgba(16, 16, 16, 0.2) !important',
                        padding: '20px',
                        borderRadius: '12px !important',
                    },
                }}
            >
                <div
                    className={`${
                        windowWidth[0] > 576 ? 'w-[426px] h-[292]' : ''
                    }`}
                >
                    <span className="w-full flex justify-center mb-2">
                        {icon ? icon : ''}
                    </span>
                    <DialogTitle
                        sx={{
                            fontSize: '22px',
                            lineHeight: '40px',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            padding: '0',
                            marginTop: '25px',
                            width: '90%',
                            marginX: 'auto',
                            '@media only screen and (max-width: 527px)': {
                                fontSize: '22px',
                                lineHeight: '28px',
                            },
                        }}
                        id="alert-dialog-title"
                    >
                        {title}
                    </DialogTitle>
                    <DialogContent sx={{ padding: '0px' }}>
                        <DialogContentText
                            sx={{
                                color: '#fff !important',
                                textAlign: 'center',
                                fontSize: '20px',
                                lineHeight: '32px',
                                marginBottom: '24px',
                                padding: '0',
                                '@media only screen and (max-width: 527px)': {
                                    fontSize: '15px',
                                    lineHeight: '20px',
                                },
                            }}
                            id="alert-dialog-description"
                        >
                            {text}
                        </DialogContentText>
                    </DialogContent>
                    <div className="flex items-center">
                        <MainButton
                            onClick={handleClose}
                            text={t('cancel')}
                            additionalClasses={`mr-3 lg:mr-4 flex text-white bg-[#5086EC] bgHoverBlue font-semibold rounded-[8px]`}
                        />
                        <MainButton
                            onClick={() => {
                                onClick()
                                handleClose()
                            }}
                            text={
                                mainButton?.length > 0
                                    ? mainButton
                                    : t('delete')
                            }
                            additionalClasses={`flex ${textColorMain} ${bgColorMain} font-semibold rounded-[8px] hover:bg-[#565463]`}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
