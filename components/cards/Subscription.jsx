import MainButton from 'components/button/MainButton'
import { useEffect, useState } from 'react'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import router from 'next/router'
import cls from './Story.module.scss'
import { makeStyles } from '@mui/styles'
// import Select from 'react-select'

import { DeviceIcon, DeviceIconTv } from 'components/svg'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { SubTrueIcon, Multfilm } from '../../components/svg'

import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { useSelector, useDispatch } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'

const Subscription = ({
    title,
    text,
    el,
    cost,
    text_btn,
    checkSubscription,
    setBuyFreeTrail,
    additionalClasses,
    isSessionLimit = false,
}) => {
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const [price, setPrice] = useState(cost ? cost.reverse()[0] : '')
    const { t, i18n } = useTranslation()
    const { user_id, session_id, access_token } = parseCookies()
    const dispatch = useDispatch()
    const IN_AKTIVE =
        cost &&
        cost.find((item) =>
            item.id === checkSubscription?.subscription_id
                ? checkSubscription?.subscription_id
                : router?.query?.subscriptionId,
        )
    const getSubscriptionTv = (subscription) => {
        if (router?.query?.message === 'INACTIVE') {
            for (let j = 0; j < subscription.subscriptions?.length; j++) {
                if (subscription.subscriptions[j].id === price.id) {
                    axios
                        .post(`user-subscription`, {
                            subscription_id: price.id,
                            user_id: user_id,
                        })
                        .then((res) => {
                            if (
                                price?.free_trial === 0 ||
                                checkSubscription.is_watched_free_trial === true
                            ) {
                                axios
                                    .post(`payme-link/svod`, {
                                        amount:
                                            checkSubscription?.message ===
                                                'INACTIVE' ||
                                            checkSubscription?.message ===
                                                'CANCELLED' ||
                                            checkSubscription?.message ===
                                                'FREE_TRIAL_EXPIRED'
                                                ? IN_AKTIVE?.price
                                                : price.price,
                                        lang: i18n?.language,
                                        movie_key: router.query.movie,
                                        path_key: router.asPath,
                                        purchase_id: res.data.id,
                                        url: router?.query?.tvPlay
                                            ? process.env.BASE_URL_REDIRECT
                                            : checkSubscription.is_watched_free_trial
                                            ? `${process.env.BASE_URL_REDIRECT}${router.asPath}`
                                            : process.env.BASE_URL_REDIRECT,
                                    })
                                    .then((res) => {
                                        window.location.replace(res.data.link)
                                    })
                            } else {
                                setBuyFreeTrail(true)
                            }
                        })
                }
            }
        }
    }
    const buySubscription = () => {
        const subscriptionAmount =
            checkSubscription?.message === 'INACTIVE' ||
            checkSubscription?.message === 'CANCELLED' ||
            checkSubscription?.message === 'FREE_TRIAL_EXPIRED'
                ? IN_AKTIVE?.price
                : price?.price

        if (balance?.balance >= subscriptionAmount) {
            axios
                .post(`user-subscription`, {
                    subscription_id:
                        checkSubscription?.message === 'INACTIVE' ||
                        checkSubscription?.message === 'CANCELLED' ||
                        checkSubscription?.message === 'FREE_TRIAL_EXPIRED'
                            ? IN_AKTIVE?.id
                            : IN_AKTIVE?.id
                            ? price?.id
                            : price?.id,
                    sessionId: session_id,
                })
                .then((res) => {
                    if (res.data.id) {
                        axios
                            .get('buy-subscription-svod', {
                                params: {
                                    SessionId: session_id,
                                    balance_id: balance?.balance_id,
                                    amount: subscriptionAmount,
                                    user_subscription_id: res.data.id,
                                },
                            })
                            .then((res) => {
                                if (res) {
                                    window.location.reload()
                                }
                            })
                            .catch((err) => console.log('err', err))
                    }
                    // if (
                    //     price.free_trial === 0 ||
                    //     checkSubscription.is_watched_free_trial === true
                    // ) {
                    //     axios
                    //         .post(`payme-link/svod`, {
                    //             amount:
                    //                 checkSubscription?.message === 'INACTIVE' ||
                    //                 checkSubscription?.message === 'CANCELLED' ||
                    //                 checkSubscription?.message ===
                    //                     'FREE_TRIAL_EXPIRED'
                    //                     ? IN_AKTIVE?.price
                    //                     : price.price,
                    //             lang: i18n?.language,
                    //             movie_key: router.query.movie,
                    //             path_key: router.asPath,
                    //             purchase_id: res.data.id,
                    //             url: router?.query?.tvPlay
                    //                 ? `${process.env.BASE_DOMAIN}/tv`
                    //                 : checkSubscription.is_watched_free_trial
                    //                 ? `${process.env.BASE_DOMAIN}${router.asPath}`
                    //                 : router.query.type === 'session_limit'
                    //                 ? `${process.env.BASE_DOMAIN}`
                    //                 : `${process.env.BASE_DOMAIN}${router.asPath}`,
                    //         })
                    //         .then((res) => {
                    //             // window.location.replace(res.data.link)
                    //         })
                    // } else {
                    //     setBuyFreeTrail(true)
                    // }
                })
        } else {
            dispatch(showAlert(t('enoughFunds'), 'error'))
        }
    }

    const SelectInput = styled(InputBase)(({ theme }) => ({
        width: '100%',
        borderRadius: '8px',
        minHeight: 'auto',
        padding: '0',
        '& .MuiInputBase-input': {
            backgroundColor: '#333044',
            borderRadius: '8px',
            minHeight: 'auto',
            width: '100%',
            padding: '10px 25px 10px 16px !important',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        '& .MuiSvgIcon-root': {
            fill: 'white',
        },
    }))

    useEffect(() => {
        if (
            checkSubscription.is_watched_free_trial === false &&
            checkSubscription.message === ''
        ) {
            for (let j = 0; j < el.subscriptions.length; j++) {
                if (el.subscriptions[j].free_trial > 0) {
                    setPrice(el.subscriptions[j])
                }
            }
        } else if (
            checkSubscription.is_watched_free_trial === true &&
            checkSubscription.message === 'INACTIVE'
        ) {
            setPrice(el.subscriptions[0])
        } else if (
            checkSubscription?.subscription_id &&
            checkSubscription.message === 'FREE_TRIAL_EXPIRED'
        ) {
            for (let j = 0; j < el.subscriptions?.length; j++) {
                if (
                    el.subscriptions[j].id ===
                    checkSubscription?.subscription_id
                ) {
                    setPrice(el.subscriptions[j])
                } else {
                    setPrice(el.subscriptions[0])
                }
            }
        }
    }, [checkSubscription, price, el, i18n?.language])

    return (
        <div
            className={`rounded-[12px] overflow-hidden text-white toTopAnimation`}
        >
            <div className="overflow-hidden h-[197px] sm:h-[180px] 2xl:h-[200px] relative w-full subscriptionImageBackgroundColor">
                {el?.category_image && (
                    <img
                        src={el?.category_image}
                        alt="img"
                        className="w-full h-full object-cover z-[99]"
                    />
                )}
                <h2 className="text-[18px] md:text-[22px] font-semibold absolute bottom-4 left-5 md:leading-13 z-[2]">
                    {title ? title : el[`title_${i18n.language}`]}
                </h2>
            </div>
            <div className="p-3 bg-[#1D1A2C]">
                <div className="min-h-[150px]">
                    <div
                        className={`w-full grid grid-flow-row-dence grid-cols-2 mb-3 gap-2`}
                    >
                        {el?.number_of_channels !== 0 ? (
                            <div className="flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[11px] px-[12px]">
                                <DeviceIconTv width={'20'} />
                                <div className="text-[#E9E9E9] ml-[5px]">
                                    <p className="text-[15px] font-semibold">
                                        {el?.number_of_channels}
                                    </p>
                                    <p className="text-[9px] font-normal leading-3 whitespace-nowrap">
                                        {t('tvChannels')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        {el?.number_of_mas !== 0 ? (
                            <div
                                className={`flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[15px] px-[12px]`}
                            >
                                <div className="w-[20px] mr-[7px]">
                                    <DeviceIcon width="20" height="20" />
                                </div>
                                <div className="text-[#E9E9E9] ml-[6px]">
                                    <p className="text-[15px] font-semibold">
                                        {el?.number_of_mas}
                                    </p>
                                    <p className="text-[9px] font-normal leading-3 whitespace-nowrap">
                                        {t('filmAndSerials')}
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        {el?.number_of_cartoons !== 0 ? (
                            <div className="flex items-center bg-[#fff] bg-opacity-[0.04] rounded-[10px] py-[15px] px-[12px]">
                                <div className="w-[20px] mr-[7px]">
                                    <Multfilm width="20" height="20" />
                                </div>
                                <div className="text-[#E9E9E9] ml-[6px]">
                                    <p className="text-[15px] font-semibold">
                                        {el?.number_of_cartoons}
                                    </p>
                                    <p className="text-[9px] font-normal leading-3 whitespace-nowrap">
                                        {t('cartoons')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="min-h-[95px] 2xl:min-h-[80px] max-h-[93px] text-[15px] text-[#D9D8E0] font-light overflow-hidden">
                    {text ? text : el[`description_${i18n.language}`]}
                </div>
                <div className="w-[150%] h-[1px] bg-[#333044] my-3 ml-[-10px]"></div>
                {/* {title === 'Megogo' ||
                    title === 'Premier' ||
                    title === 'megogo sub123'} */}
                {title === 'Megogo' || title === 'Premier' ? (
                    <div>
                        <FormControl sx={{ width: '100%' }}>
                            <Select
                                input={<SelectInput />}
                                displayEmpty
                                defaultValue={price}
                                inputProps={{
                                    'aria-label': 'Without label',
                                }}
                            >
                                {el.subscriptions &&
                                    el.subscriptions
                                        .sort((a, b) => {
                                            return (
                                                a.title_en.slice(0, 3) -
                                                b.title_en.slice(0, 3)
                                            )
                                        })
                                        .map((subscription, index) => {
                                            return (
                                                <MenuItem
                                                    onClick={() =>
                                                        setPrice(subscription)
                                                    }
                                                    key={index}
                                                    value={subscription}
                                                >
                                                    <div className="flex justify-between w-full font-medium">
                                                        {
                                                            subscription[
                                                                `title_${i18n.language}`
                                                            ]
                                                        }{' '}
                                                        {t('for')}{' '}
                                                        {subscription?.price /
                                                            100}{' '}
                                                        {t('sum')}
                                                    </div>
                                                </MenuItem>
                                            )
                                        })}
                            </Select>
                        </FormControl>
                    </div>
                ) : (
                    <div className="h-[45px]"></div>
                )}
                {title === 'Megogo' || title === 'Premier' ? (
                    router?.query?.message === 'INACTIVE' ? (
                        <MainButton
                            onClick={() => {
                                getSubscriptionTv(el)
                            }}
                            text={
                                price.free_trial === 0 ||
                                checkSubscription.is_watched_free_trial === true
                                    ? t('buy_subscription')
                                    : t('start_free')
                            }
                            additionalClasses="w-full bg-[#5086EC] my-[14px] rounded-[8px] mt-3 bgHoverBlue duration-300"
                        />
                    ) : (
                        <MainButton
                            onClick={() => {
                                buySubscription()
                            }}
                            text={
                                price?.free_trial === 0 ||
                                checkSubscription.is_watched_free_trial === true
                                    ? t('buy_subscription')
                                    : t('start_free')
                            }
                            additionalClasses="w-full bg-[#5086EC] rounded-[8px] mt-3 bgHoverBlue duration-300"
                        />
                    )
                ) : (
                    <div className="h-[66px] flex items-end">Cкоро...</div>
                )}
            </div>
        </div>
    )
}

export default Subscription
