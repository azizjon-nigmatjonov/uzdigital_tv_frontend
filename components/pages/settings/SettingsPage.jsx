import Breadcrumb from 'components/common/BreadCrumb'
import router from 'next/router'
import style from './Settings.module.scss'
import TabMenu from './settingsTabs/TabMenu'
import ProfileListsProfile from './settingsTabs/profilesListProfile'
import Favorites from './settingsTabs/favorites/Favorites'
import Payment from './settingsTabs/payment/Payment'

import { useIsMobile } from 'hooks/useIsMobile'
import { useTranslation, Link } from 'i18n'
import { EditIcon } from '../../svg.js'
import { numberToPrice } from 'components/libs/numberToPrice'
import { useSelector } from 'react-redux'

export default function SettingsPage({ profile, transactions, notifications }) {
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const { t } = useTranslation()
    const isMobile = useIsMobile()
    const routerFrom = router.router.query.from

    return (
        <div className={`${style.container}`}>
            <div className={style.wrapper}>
                {isMobile[0] && !routerFrom && (
                    <div className="mt-[30px] mb-[32px]">
                        <ProfileListsProfile />
                    </div>
                )}
                {!isMobile[0] && (
                    <Breadcrumb
                        list={
                            router.query.from === 'favourite' ||
                            router.query.from === 'subscription'
                                ? [
                                      { text: t('home'), link: '/' },
                                      {
                                          text: t('settings'),
                                          link: router.asPath,
                                      },
                                  ]
                                : [
                                      { text: t('home'), link: '/' },
                                      {
                                          text: t('settings'),
                                          link: router.asPath,
                                      },
                                  ]
                        }
                        additionalClasses={`${style.breadcrumb}`}
                    />
                )}
                {isMobile[0] && routerFrom && (
                    <Breadcrumb
                        list={
                            router.query.from === 'favourite' ||
                            router.query.from === 'subscription'
                                ? [
                                      { text: t('home'), link: '/' },
                                      {
                                          text: t('settings'),
                                          link: '/settings',
                                      },
                                      {
                                          text: t('settings'),
                                          link: router.asPath,
                                      },
                                  ]
                                : [
                                      { text: t('home'), link: '/' },
                                      {
                                          text: t('settings'),
                                          link: '/settings',
                                      },
                                      {
                                          text: t('settings'),
                                          link: router.asPath,
                                      },
                                  ]
                        }
                        additionalClasses={`${style.breadcrumb}`}
                    />
                )}
            </div>
            {isMobile[0] && !routerFrom && (
                <div className="flex justify-center mb-[24px]">
                    <Link href="/settings?from=profile">
                        <a className="text-white inline-flex items-center space-x-[10px]">
                            <EditIcon />
                            <span className="normal-case">
                                {t('profile_management')}
                            </span>
                        </a>
                    </Link>
                </div>
            )}
            <div className={style.settings}>
                {!isMobile[0] && (
                    <h2 className={`${style.settings_title} block`}>
                        {t(
                            router.query.from == 'myCards'
                                ? t('myCards')
                                : router.query.from
                                ? router.query.from
                                : 'settings',
                        )}
                    </h2>
                )}
                {isMobile[0] && routerFrom && (
                    <h2 className={`${style.settings_title} block`}>
                        {t('settings')}
                    </h2>
                )}
                <div className="text-white mb-8">
                    <div className="flex items-center mb-1">
                        <h2 className="font-normal text-9 text-white leading-[22px] opacity-50">
                            {t('your-id')}:
                        </h2>
                        <h3 className="font-semibold text-9 leading-[22px] ml-1.5">
                            {balance?.balance_id}
                        </h3>
                    </div>
                    <div className="flex items-center">
                        <h2 className="font-normal text-9 text-white leading-[22px] opacity-50">
                            {t('balance')}:
                        </h2>
                        <h3 className="font-semibold text-9 leading-[22px] ml-1.5">
                            {numberToPrice(balance?.balance / 100)}{' '}
                            {t('currency')}
                        </h3>
                    </div>
                </div>

                {routerFrom !== 'codeTv' &&
                    routerFrom !== 'favourite' &&
                    routerFrom !== 'subscription' && (
                        <TabMenu
                            profile={profile}
                            transactions={transactions}
                            notifications={notifications}
                            balanceId={balance?.balance_id}
                        />
                    )}
                {routerFrom === 'favourite' && <Favorites />}
                {routerFrom === 'subscription' && <Payment />}
            </div>
        </div>
    )
}
