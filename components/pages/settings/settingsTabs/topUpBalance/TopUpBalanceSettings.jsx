import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import axios from 'utils/axios'

import PaymentForm from 'components/PaymentForm/PaymetnForm'
import AddCardsForm from 'components/AddCardForm/AddCardForm'
import PaySavedCards from 'components/paySavedCards/PaySavedCards'
import SuccesPayment from 'components/SuccesPayment/SuccesPayment'
import PriceEnterForm from 'components/PriceEnterForm/PriceEnterForm'
import UpBalanceItem from 'components/UpBalanceItem/UpBalanceItem'
import UzcardOrHumo from 'components/UzcardOrHumo/UzcardOrHumo'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'
import { getAllPaymentCards } from 'service/paymentService'
import { useTranslation } from '../../../../../i18n'
import { PaymeIcon } from '../../../../svg'

const styleMui = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '432px',
    maxWidth: '85%',
    minHeight: '329px',
    bgcolor: '#1C192C',
    borderRadius: '12px',
    p: 4,
    outline: 'none',
}

const baseUrl = process.env.BASE_DOMAIN

const TopUpBalanceSettings = ({ balanceId }) => {
    const Router = useRouter()
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [paymeModal, setPaymeModal] = useState(false)
    const [cost, setCost] = useState('')
    const [value, setValue] = useState(0)
    // uzcard modal
    const [priceModal, setPriceModal] = React.useState(false)
    const [addModal, setAddModal] = React.useState(false)
    const [responseModal, setResponseModal] = React.useState(false)
    const [savedCardsModal, setSavedCardsModal] = React.useState(false)
    const handleCostChange = (e) => {
        setCost(e.target.value.replace(/\s/g, ''))
    }
    // payme logic
    const handlePaymentFormSubmit = (e) => {
        e.preventDefault()
        const amount = Number(value.toString().replace(/\D/g, '')) * 100
        axios
            .post('payme-link-v2', {
                amount: amount,
                balance_id: balanceId,
                name: CurrentUserData?.name ? CurrentUserData?.name : '',
                url: baseUrl + Router.asPath,
            })
            .then((res) => {
                if (res) {
                    window.location.replace(res?.data?.link)
                }
            })
            .catch((err) => console.log('err', err))
    }
    const PayArr = [
        {
            id: 1,
            icon: <PaymeIcon />,
            title: 'Payme',
            operation: function () {
                setPaymeModal(true)
            },
        },
        {
            id: 198,
            icon: <UzcardOrHumo />,
            title: 'Uzcard / Humo',
            operation: function () {
                setPriceModal(true)
            },
        },
    ]

    useEffect(() => {
        dispatch(getAllPaymentCards())
    }, [])

    return (
        <div className="w-full">
            {PayArr.map((item) => {
                return (
                    <UpBalanceItem
                        key={item.id}
                        onClick={() => item.operation()}
                        data={item}
                    />
                )
            })}
            <div>
                {/* payme */}
                <Modal
                    open={paymeModal}
                    onClose={() => setPaymeModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaymentForm
                        value={value}
                        setValue={setValue}
                        handleClose={setPaymeModal}
                        handleSubmit={handlePaymentFormSubmit}
                    />
                </Modal>

                {/* uzcard humo */}
                {/* price modal */}
                <Modal
                    open={priceModal}
                    onClose={() => setPriceModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleMui}>
                        <PriceEnterForm
                            setPriceModal={setPriceModal}
                            setSavedCardsModal={setSavedCardsModal}
                            setAddModal={setAddModal}
                            value={cost}
                            onChange={handleCostChange}
                            // handleSubmit={handleCostSubmit}
                        />
                    </Box>
                </Modal>

                {/* saved cards modal */}
                <Modal
                    open={savedCardsModal}
                    onClose={() => setSavedCardsModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <PaySavedCards
                        setAddModal={setAddModal}
                        setSavedCardsModal={() => setSavedCardsModal()}
                        cost={cost}
                    />
                </Modal>

                {/* add card modal */}
                <Modal
                    open={addModal}
                    onClose={() => setAddModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleMui}>
                        <AddCardsForm
                            cost={cost}
                            // handleSubmit={handleAddcardSubmit}
                            onCancel={setAddModal}
                        />
                    </Box>
                </Modal>

                {/* response modal success or failure */}
                <Modal
                    open={responseModal}
                    onClose={() => setResponseModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleMui}>
                        <SuccesPayment
                            cost={cost}
                            // goBack={handleSuccessGoBack}
                        />
                    </Box>
                </Modal>
            </div>
        </div>
    )
}

export default TopUpBalanceSettings
