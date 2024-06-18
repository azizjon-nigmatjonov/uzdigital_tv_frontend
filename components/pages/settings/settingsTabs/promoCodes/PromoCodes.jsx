import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import style from '../orderTable/orderTable.module.scss'
import { TableCloseIcon, NullDataIconTable } from '../../../../svg'
import Modal from '@mui/material/Modal'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'i18n'
import NullData from 'components/errorPopup/NullData'
import { PromoCodeIcon } from '../../menuIcons'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'
import { format } from 'date-fns'

const SignupSchema = Yup.object().shape({
    promoCode: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
})

const styleMui = (windowWidth) => ({
    position: 'absolute',
    top: windowWidth[0] > 1150 ? '50%' : '',
    left: '50%',
    bottom: windowWidth[0] > 1150 ? '' : '0',
    transform:
        windowWidth[0] > 1150 ? 'translate(-50%, -50%)' : 'translate(-50%, 0%)',
    boxShadow: 24,
    p: 4,
    width: windowWidth[0] > 576 ? '432px' : '100%',
    height: windowWidth[0] > 576 ? '329px' : '82%',
    padding: windowWidth[0] > 576 ? '32px' : '40px 16px 16px 16px',
    background: windowWidth[0] > 1150 ? '#1c192c' : '#100E19',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
})

const PromoCodes = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [error, serError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [promoCodes, setPromoCodes] = useState([])
    const { t } = useTranslation()
    const { user_id } = parseCookies()

    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    useEffect(() => {
        if (!open) {
            serError(false)
        }
    }, [open])

    const getPromoCode = (id) => {
        axios
            .get(`get-user-promo-code/${id}`)
            .then((res) => {
                console.log('res', res)
                setPromoCodes(res.data.result)
            })
            .catch((err) => console.log('err', err))
    }

    useEffect(() => {
        if (user_id) {
            getPromoCode(user_id)
        }
    }, [])

    return (
        <>
            <div className="w-full relative">
                {promoCodes?.length > 0 ? (
                    windowWidth[0] > 1150 ? (
                        <div>
                            <div className="absolute right-0 top-0 -translate-y-full pb-[100px]">
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                    sx={{
                                        textTransform: 'capitalize',
                                        backgroundColor: '#5086EC',
                                        borderRadius: '12px',
                                        width: '249px',
                                        height: '48px',
                                    }}
                                >
                                    <div className="mr-2">
                                        <PromoCodeIcon />
                                    </div>
                                    {t('activate-promo_code')}
                                </Button>
                            </div>
                            <div className={style.wrapperOrderTable}>
                                <div className="flex items-center px-9 py-[12px] border-b-[0.5px] border-[#a8b5c5]">
                                    <div className="w-[6%] font-semibold text-[15px] leading-[20px]">
                                        №
                                    </div>
                                    <div className="w-[22%] font-semibold text-[15px] leading-[20px]">
                                        <h5>{t('promo-code_login')}</h5>
                                    </div>
                                    <div className="w-[20%] font-semibold text-[15px] leading-[20px]">
                                        <h5 className="w-[60%]">
                                            {t('included_susbcription')}
                                        </h5>
                                    </div>
                                    <div className="w-[20%] font-normal text-[17px] leading-[22px]">
                                        {t('descriptionPromo')}
                                    </div>
                                    <div className="w-[20%] font-semibold text-[15px] leading-[20px]">
                                        <h5>{t('activation_date')}</h5>
                                    </div>
                                    <div className="w-[20%] font-semibold text-[15px] leading-[20px]">
                                        <h5>{t('shutdown_date')}</h5>
                                    </div>
                                    <div className="w-[9%] font-semibold text-[15px] leading-[20px]">
                                        <h5>{t('status')}</h5>
                                    </div>
                                </div>
                                <div>
                                    {promoCodes?.length > 0
                                        ? promoCodes?.map((item, ind) => {
                                              let started_time = format(
                                                  new Date(
                                                      item?.started_time
                                                          ? item?.started_time
                                                          : null,
                                                  ),
                                                  'dd.MM.yyyy',
                                              )
                                              let ended_time = format(
                                                  new Date(
                                                      item?.end_time
                                                          ? item?.end_time
                                                          : null,
                                                  ),
                                                  'dd.MM.yyyy',
                                              )
                                              console.log('item', item)
                                              return (
                                                  <div
                                                      className={`flex items-center px-9 py-[17px] ${
                                                          item.promo_code_id !==
                                                          [...promoCodes].pop()
                                                              ?.promo_code_id
                                                              ? 'border-b-[0.5px] border-gray-500'
                                                              : ''
                                                      }`}
                                                      key={item.title}
                                                  >
                                                      <div className="w-[6%] font-normal text-[17px] leading-[22px]">
                                                          {ind + 1}
                                                      </div>
                                                      <div className="w-[22%] font-normal text-[17px] leading-[22px]">
                                                          <h5>{item.title}</h5>
                                                      </div>
                                                      <div className="w-[20%] font-normal text-[17px] leading-[22px]">
                                                          <h5 className="w-[60%]">
                                                              {item.promoType ===
                                                              'PERCENT'
                                                                  ? t('percent')
                                                                  : item.promoType ===
                                                                    'SUBSCRIPTION'
                                                                  ? t(
                                                                        'subscriptionFor',
                                                                    )
                                                                  : ''}
                                                          </h5>
                                                      </div>
                                                      <div className="w-[20%] font-normal text-[17px] leading-[22px]">
                                                          {item.description ||
                                                              ''}
                                                      </div>
                                                      <div className="w-[20%] font-normal text-[17px] leading-[22px]">
                                                          <h5>
                                                              {started_time ||
                                                                  ''}
                                                          </h5>
                                                      </div>
                                                      <div className="w-[20%] font-normal text-[17px] leading-[22px]">
                                                          <h5>
                                                              {ended_time || ''}
                                                          </h5>
                                                      </div>
                                                      <div className="w-[9%] font-normal text-[14px] leading-[20px]">
                                                          <h5>
                                                              {item.status ===
                                                              'INACTIVE' ? (
                                                                  <span className="text-[#F2271C]">
                                                                      {t(
                                                                          'inactive',
                                                                      )}
                                                                  </span>
                                                              ) : item.status ===
                                                                'ACTIVE' ? (
                                                                  <span className="text-[#1BA129]">
                                                                      {t(
                                                                          'active',
                                                                      )}
                                                                  </span>
                                                              ) : (
                                                                  ''
                                                              )}
                                                          </h5>
                                                      </div>
                                                  </div>
                                              )
                                          })
                                        : null}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className={style.tableMobileButton}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                >
                                    <div className="mr-[10px]">
                                        <PromoCodeIcon />
                                    </div>
                                    {t('activate-promo_code')}
                                </Button>
                            </div>
                            {promoCodes.map((item) => {
                                let started_time = format(
                                    new Date(
                                        item?.started_time
                                            ? item?.started_time
                                            : null,
                                    ),
                                    'dd.MM.yyyy',
                                )
                                let ended_time = format(
                                    new Date(
                                        item?.end_time ? item?.end_time : null,
                                    ),
                                    'dd.MM.yyyy',
                                )
                                return (
                                    <div
                                        className={style.mobileWrapperTable}
                                        key={item.id}
                                    >
                                        <div className={style.mobileTableAll}>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>{t('login-order')}</h5>
                                                </div>
                                                <div>
                                                    <h5>{item.title}</h5>
                                                </div>
                                            </div>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>{t('status')}</h5>
                                                </div>
                                                <div>
                                                    <h5>
                                                        {item.status ===
                                                        'Неактивный' ? (
                                                            <span className="text-[#F2271C]">
                                                                {t('inactive')}
                                                            </span>
                                                        ) : item.status ===
                                                          'ACTIVE' ? (
                                                            <span className="text-[#1BA129]">
                                                                {t('active')}
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>
                                                        {t(
                                                            'included_susbcription',
                                                        )}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h5>{item.promo_type}</h5>
                                                </div>
                                            </div>
                                            <div
                                                className={`${style.mobileTable} border-b-[0.5px] border-gray-500`}
                                            >
                                                <div>
                                                    <h5>
                                                        {t('activation_date')}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h5>{started_time}</h5>
                                                </div>
                                            </div>
                                            <div
                                                className={`${style.mobileTable}`}
                                            >
                                                <div>
                                                    <h5>
                                                        {t('shutdown_date')}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h5>{ended_time}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                ) : (
                    <div className="my-5 flex justify-center md:my-10 w-[70%] mx-auto">
                        <NullData
                            icon={<NullDataIconTable />}
                            title={t('oops')}
                            text={t('list-promo')}
                            textButton={t('activate-promo')}
                            link={handleOpen}
                        />
                    </div>
                )}
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    keepMounted
                >
                    <div style={styleMui(windowWidth)}>
                        <div className={style.tableModal}>
                            {windowWidth[0] > 1150 ? (
                                <div
                                    className="absolute right-[37px] top-[37px] cursor-pointer"
                                    onClick={handleClose}
                                >
                                    <TableCloseIcon />
                                </div>
                            ) : null}

                            <div
                                className={`${
                                    windowWidth[0] > 1150 ? 'mt-7' : 'mt-1'
                                }`}
                            >
                                <h1 className="leading-[35px] text-[28px] font-[600] text-white mb-[32px]">
                                    {t('activate-promo2')}
                                </h1>
                                <Formik
                                    initialValues={{
                                        promoCode: '',
                                    }}
                                    validationSchema={SignupSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        if (user_id) {
                                            axios
                                                .post(
                                                    `create-user-promo-code/${user_id}`,
                                                    {
                                                        title: values.promoCode,
                                                    },
                                                )
                                                .then((res) => {
                                                    if (res.data) {
                                                        getPromoCode(user_id)
                                                        setOpen(false)
                                                    }
                                                })
                                                .catch((err) => {
                                                    serError(true)
                                                    setErrorMessage(
                                                        err.data.data,
                                                    )
                                                })
                                        }
                                        resetForm({ values: '' })
                                    }}
                                >
                                    {({ errors, touched, values }) => {
                                        return (
                                            <Form className="flex item-center justify-center flex-col">
                                                <div className="flex item-center justify-center flex-col relative">
                                                    <label
                                                        className={
                                                            style.formLabel
                                                        }
                                                    >
                                                        {t('enter-promo')}
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="promoCode"
                                                        placeholder={t(
                                                            'enter-promo',
                                                        )}
                                                        value={values.promoCode}
                                                        className={
                                                            style.tableInput
                                                        }
                                                        style={{
                                                            border:
                                                                (errors.promoCode &&
                                                                    touched.promoCode) ||
                                                                error
                                                                    ? '1px solid #D31919'
                                                                    : '',
                                                        }}
                                                    />
                                                    {error &&
                                                    errorMessage ===
                                                        ' PromoCode not found' ? (
                                                        <span className="text-[#D31919] absolute top-20">
                                                            {t(
                                                                'promoCodeNotFound',
                                                            )}
                                                        </span>
                                                    ) : error &&
                                                      errorMessage ===
                                                          ' Promcode is already exists' ? (
                                                        <span className="text-[#D31919] absolute top-20">
                                                            {t(
                                                                'promoCodeAlreadyUse',
                                                            )}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <div
                                                    className={
                                                        style.tableSubmitButton
                                                    }
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        onClick={() =>
                                                            windowWidth[0] >
                                                            1150
                                                                ? null
                                                                : handleClose()
                                                        }
                                                    >
                                                        {t('activate')}
                                                    </Button>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default PromoCodes
