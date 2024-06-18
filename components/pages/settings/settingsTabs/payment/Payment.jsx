import Subscription from 'components/cards/Subscription'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'
import router from 'next/router'
import ErrorPopup from 'components/errorPopup/Popup'
import { parseCookies } from 'nookies'
import { SuccessSybscriptionIcon } from 'components/svg'
import SubscriptionUnpurchased from 'components/cards/SubscriptionUnpurchases'
import { useIsMobile } from 'hooks/useIsMobile'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function Payment() {
    const { t, i18n } = useTranslation()
    const [subscription, setSubscription] = useState(null)
    const [subscriptionTv, setSubscriptionTv] = useState(null)
    const [checkSubscription, setCheckSubscription] = useState({})
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)
    const [freeTrialExpired, setFreeTrailExpired] = useState(null)
    const [expired, setExpired] = useState(true)
    const isMobile = useIsMobile()

    useEffect(() => {
        if (router?.query?.key === 'tv') {
            axios.get(`subscription/category?key=tv`).then((res) => {
                setSubscriptionTv(res?.data?.categories)
            })
        } else {
            axios.get(`get-all-categories`).then((res) => {
                setSubscription(res.data.result)
            })
        }
    }, [i18n?.language])

    useEffect(() => {
        if (router?.query?.key === 'tv' && router?.query?.subscriptionId) {
            setCheckSubscription({
                message: 'FREE_TRIAL_EXPIRED',
                is_watched_free_trial: true,
            })
            function getTvSingleCategoryBySubscriptionId(
                category,
                subscription_id,
            ) {
                if (Array.isArray(category) && category?.length > 0) {
                    for (let i = 0; i < category?.length; i++) {
                        for (
                            let j = 0;
                            j < category[i].subscriptions?.length;
                            j++
                        ) {
                            if (
                                category[i].subscriptions[j].id ===
                                subscription_id
                            ) {
                                let res = {
                                    category_image: category[i].category_image,
                                    id: category[i].id,
                                    title_ru: category[i].title_ru,
                                    title_en: category[i].title_en,
                                    title_uz: category[i].title_uz,
                                    description_ru: category[i].description_ru,
                                    description_en: category[i].description_en,
                                    description_uz: category[i].description_uz,
                                    status: category[i].status,
                                    number_of_channels:
                                        category[i].number_of_channels,
                                    number_of_movies:
                                        category[i].number_of_movies,
                                    subscriptions: [],
                                }
                                res.subscriptions.push(
                                    category[i].subscriptions[j],
                                )
                                return res
                            }
                        }
                    }
                }
            }
            setFreeTrailExpired(
                getTvSingleCategoryBySubscriptionId(
                    subscriptionTv,
                    router?.query?.subscriptionId,
                ),
            )
        } else if (
            router?.query?.key === 'tv' &&
            router?.query?.freeTrial === 'false'
        ) {
            setCheckSubscription({
                message: '',
                is_watched_free_trial: false,
            })
        } else if (router?.query?.key === 'tv') {
            setCheckSubscription({
                message: 'INACTIVE',
                is_watched_free_trial: true,
            })
        }
    }, [subscriptionTv, i18n?.language])

    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const tabStyles = {
        width: '100%',
        display: 'inline-flex',
        textColor: '#fff',
        borderBottom: 1,
        borderColor: '#ffffff55',
    }
    const customTheme = createTheme({
        palette: {
            primary: {
                main: '#ffffff55',
            },
            secondary: {
                main: '#fff',
            },
        },
    })
    return (
        <div
            className={`w-full ${
                subscription !== null && subscriptionTv !== null
                    ? 'min-h-[100vh]'
                    : 'min-h-[30vh]'
            }`}
        >
            {router?.query?.key === 'tv' ? (
                <div className="mt-8 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 2xl:gap-x-5 gap-y-8">
                    {!router?.query?.subscriptionId &&
                        subscriptionTv?.map((item, index) => (
                            <div key={index}>
                                <Subscription
                                    el={item}
                                    cost={item.subscriptions}
                                    checkSubscription={checkSubscription}
                                    setBuyFreeTrail={setBuyFreeTrail}
                                />
                            </div>
                        ))}
                    {router?.query?.subscriptionId && freeTrialExpired && (
                        <div>
                            <Subscription
                                el={freeTrialExpired}
                                cost={freeTrialExpired.subscriptions}
                                checkSubscription={checkSubscription}
                                setBuyFreeTrail={setBuyFreeTrail}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {!isMobile[0] ? (
                        <div>
                            {subscription?.purchased &&
                                subscription.purchased.length > 0 && (
                                    <div className="mt-16">
                                        <div className="text-xl md:text-[34px] font-semibold">
                                            {t('purchased_subscriptions')}
                                        </div>
                                        <div className="mt-8 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-8">
                                            {subscription?.purchased?.map(
                                                (item) => (
                                                    <div key={item}>
                                                        <SubscriptionUnpurchased
                                                            checkSubscription={
                                                                checkSubscription
                                                            }
                                                            setBuyFreeTrail={
                                                                setBuyFreeTrail
                                                            }
                                                            el={item}
                                                            cost={
                                                                item.subscriptions
                                                            }
                                                            title={
                                                                item[
                                                                    `title_${i18n?.language}`
                                                                ]
                                                            }
                                                            text={
                                                                item[
                                                                    `description_${i18n?.language}`
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            {subscription?.unpurchased &&
                                subscription.unpurchased.length > 0 && (
                                    <div className="mt-16">
                                        {subscription.purchased.length > 0 && (
                                            <div className="mb-7 text-xl md:text-[34px] font-semibold">
                                                {t('other_subscriptions')}
                                            </div>
                                        )}
                                        <div className="mt-8 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 2xl:gap-x-5 gap-y-8">
                                            {subscription?.unpurchased?.map(
                                                (item, index) => (
                                                    <div key={index}>
                                                        <Subscription
                                                            checkSubscription={
                                                                checkSubscription
                                                            }
                                                            setBuyFreeTrail={
                                                                setBuyFreeTrail
                                                            }
                                                            text_btn={t('buy')}
                                                            el={item}
                                                            cost={
                                                                item.subscriptions
                                                            }
                                                            title={
                                                                item[
                                                                    `title_${i18n.language}`
                                                                ]
                                                            }
                                                            text={
                                                                item[
                                                                    `description_${i18n.language}`
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div id="paymentPage" className="text-white">
                            <div>
                                <ThemeProvider theme={customTheme}>
                                    <Tabs
                                        sx={tabStyles}
                                        value={value}
                                        onChange={handleChange}
                                        indicatorColor="secondary"
                                        textColor="secondary"
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile
                                        aria-label="scrollable force tabs example"
                                    >
                                        <Tab
                                            sx={{
                                                color: '#ffffff77',
                                                fontSize: '15px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                            }}
                                            label={t('subscription')}
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            sx={{
                                                color: '#ffffff77',
                                                fontSize: '15px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                            }}
                                            label={t('purchased_subscriptions')}
                                            {...a11yProps(1)}
                                        />
                                    </Tabs>

                                    <TabPanel
                                        sx={{ padding: 0 }}
                                        value={value}
                                        index={0}
                                    >
                                        <Box sx={{ flexGrow: 1 }}>
                                            <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                                                {subscription?.unpurchased?.map(
                                                    (item, index) => (
                                                        <div key={index}>
                                                            <Subscription
                                                                checkSubscription={
                                                                    checkSubscription
                                                                }
                                                                setBuyFreeTrail={
                                                                    setBuyFreeTrail
                                                                }
                                                                text_btn={t(
                                                                    'buy',
                                                                )}
                                                                el={item}
                                                                cost={
                                                                    item.subscriptions
                                                                }
                                                                title={
                                                                    item[
                                                                        `title_${i18n.language}`
                                                                    ]
                                                                }
                                                                text={
                                                                    item[
                                                                        `description_${i18n.language}`
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </Box>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 gap-5  mt-8">
                                                {subscription?.purchased?.map(
                                                    (item) => (
                                                        <div key={item}>
                                                            <SubscriptionUnpurchased
                                                                checkSubscription={
                                                                    checkSubscription
                                                                }
                                                                setBuyFreeTrail={
                                                                    setBuyFreeTrail
                                                                }
                                                                el={item}
                                                                cost={
                                                                    item.subscriptions
                                                                }
                                                                title={
                                                                    item[
                                                                        `title_${i18n.language}`
                                                                    ]
                                                                }
                                                                text={
                                                                    item[
                                                                        `description_${i18n.language}`
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </Box>
                                    </TabPanel>
                                </ThemeProvider>
                            </div>
                        </div>
                    )}

                    {subscription && subscription?.unpurchased?.length === 0 && (
                        <div>
                            <span className="block mb-3 text-2xl font-medium">
                                {t('other_subscriptions')}
                            </span>
                            <div className="text-center text-xl my-16 font-semibold w-full">
                                {t('no_data_subscriptions')}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {buyFreeTrail && router?.query?.tvPlay && (
                <ErrorPopup
                    openModal={expired}
                    setOpenModal={setExpired}
                    link={() => {
                        router.push(`/tv/tv-video?key=${router?.query?.tvPlay}`)
                    }}
                    title={t('Congratulations')}
                    textButton={t('start_watch')}
                    text={t('active_free_trail')}
                    icon={<SuccessSybscriptionIcon />}
                />
            )}
        </div>
    )
}
