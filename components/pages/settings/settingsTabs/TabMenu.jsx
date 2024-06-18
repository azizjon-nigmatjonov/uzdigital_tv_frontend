import React, { useState } from 'react'
import style from '../Settings.module.scss'
import { Link } from 'i18n'
import ProfilePage from './profilePage/ProfilePage'
import ProfilesList from './profilesListProfile'
import Favorites from './favorites/Favorites'
import router from 'next/router'
import Payment from './payment/Payment'
import Devices from './devices/Devices'
import BoughtMovies from './boughtMovies/Bought'
import WatchedHistory from './watchedHistory/WatchedHistory'
import { useIsMobile } from 'hooks/useIsMobile'
import {
    FavoritesIcon,
    ProfileIcon,
    PaymentIcon,
    DevicesIcon,
    BoughtFilmsIcon,
    HistoryIcon,
    LockIcon,
    OrderTableIcon,
    TopUpBalance,
    PromoCodeIcon,
    MyCardsIcon,
} from '../menuIcons'
import { useTranslation } from 'i18n'
import { CarouselRightArrow } from 'components/svg'
import NotificationsPage from './notifications/NotificationsPage'
import OrderTable from './orderTable/OrderTable'
import TopUpBalanceSettings from './topUpBalance/TopUpBalanceSettings'
import PromoCodes from './promoCodes/PromoCodes'
import MyCards from './myCards/MyCards'

export default function TabFixed({ profile, notifications, balanceId }) {
    const routerFrom = router.router.query.from
    const { t } = useTranslation()
    const isMobile = useIsMobile()
    const [activeUserDialog, setActiveUserDialog] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className={`${style.menu}`}>
            {
                <div
                    className={
                        router.query.from
                            ? `${style.setting_tabs} ${style.mobile_tabs}`
                            : style.setting_tabs
                    }
                >
                    <div
                        className={`${style.setting_tab} w-full md:w-[300px] scroll`}
                    >
                        <div className="bg-[#1C192C] rounded-[12px] p-4">
                            {isMobile[0] && (
                                <Link href="/settings?from=subscription">
                                    <a
                                        className={
                                            routerFrom === 'subscription'
                                                ? `${style.settings_link} ${style.active}`
                                                : `${style.settings_link}`
                                        }
                                    >
                                        <span
                                            className={`mr-3 ${
                                                isMobile[0]
                                                    ? 'bg-[#fff] bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                    : ''
                                            }`}
                                        >
                                            <PaymentIcon />
                                        </span>
                                        <span>{t('subscription')}</span>
                                        <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                            <CarouselRightArrow
                                                width={32}
                                                height={32}
                                            />
                                        </span>
                                    </a>
                                </Link>
                            )}
                            {!isMobile[0] && (
                                <Link href="/settings?from=profile">
                                    <a
                                        className={
                                            routerFrom === 'profile'
                                                ? `${style.settings_link} ${style.active}`
                                                : `${style.settings_link}`
                                        }
                                    >
                                        <span className="block mr-1">
                                            <ProfileIcon />
                                        </span>
                                        <span>{t('profile')}</span>
                                        <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                            <CarouselRightArrow
                                                width={32}
                                                height={32}
                                            />
                                        </span>
                                    </a>
                                </Link>
                            )}
                            {isMobile[0] && (
                                <span>
                                    <div className="w-[85%] md:hidden h-[1px] bg-[#fff] bg-opacity-[0.16] ml-auto"></div>
                                    <Link href="/settings?from=favourite">
                                        <a
                                            className={
                                                routerFrom === 'favourite'
                                                    ? `${style.settings_link} ${style.active}`
                                                    : `${style.settings_link}`
                                            }
                                        >
                                            <span
                                                className={`mr-3 ${
                                                    isMobile[0]
                                                        ? 'bg-[#fff] bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                        : ''
                                                }`}
                                            >
                                                <FavoritesIcon />
                                            </span>
                                            <span>{t('favourite')}</span>
                                            <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                                <CarouselRightArrow
                                                    width={32}
                                                    height={32}
                                                />
                                            </span>
                                        </a>
                                    </Link>
                                    <div className="w-[85%] md:hidden h-[1px] bg-[#fff] bg-opacity-[0.16] ml-auto"></div>
                                </span>
                            )}
                            <Link href="/settings?from=topUpBalance">
                                <a
                                    className={
                                        routerFrom === 'topUpBalance'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <TopUpBalance />
                                    </span>
                                    <span>{t('topUpBalance')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <Link href="/settings?from=myCards">
                                <a
                                    className={
                                        routerFrom === 'myCards'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <MyCardsIcon />
                                    </span>
                                    {/* <span>{t('topUpBalance')}</span> */}
                                    <span>Мои карты</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <Link href="/settings?from=devices">
                                <a
                                    className={
                                        routerFrom === 'devices'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <DevicesIcon />
                                    </span>
                                    <span>{t('devices')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <div className="w-[85%] md:hidden h-[1px] bg-[#fff] bg-opacity-[0.16] ml-auto"></div>
                            <Link href="/settings?from=bought">
                                <a
                                    className={
                                        routerFrom === 'bought'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <BoughtFilmsIcon />
                                    </span>
                                    <span>{t('bought')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <div className="w-[85%] md:hidden h-[1px] bg-[#fff] bg-opacity-[0.16] ml-auto"></div>
                            <Link href="/settings?from=watched-history">
                                <a
                                    className={
                                        routerFrom === 'watched-history'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <HistoryIcon />
                                    </span>
                                    <span>{t('watched-history')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <Link href="/settings?from=promo-codes">
                                <a
                                    className={
                                        routerFrom === 'promo-codes'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <PromoCodeIcon />
                                    </span>
                                    <span>{t('promo-codes')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                            <div className="w-[85%] md:hidden h-[1px] bg-[#fff] bg-opacity-[0.16] ml-auto"></div>
                            <Link href="/registration?from=codeTv">
                                <a className={style.settings_link}>
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <LockIcon />
                                    </span>
                                    <span>{t('enterWithCode')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>

                            <Link href="/settings?from=order-table">
                                <a
                                    className={
                                        routerFrom === 'order-table'
                                            ? `${style.settings_link} ${style.active}`
                                            : `${style.settings_link}`
                                    }
                                >
                                    <span
                                        className={` ${
                                            isMobile[0]
                                                ? 'bg-[#fff] mr-3 bg-opacity-[0.08] w-[40px] h-[40px] rounded-[10px] flex items-center justify-center'
                                                : 'mr-1'
                                        }`}
                                    >
                                        <OrderTableIcon />
                                    </span>
                                    <span>{t('order-table')}</span>
                                    <span className="block sm:hidden w-8 h-8 absolute -right-2 transform translate-y-[-50%] top-[50%]">
                                        <CarouselRightArrow
                                            width={32}
                                            height={32}
                                        />
                                    </span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            }
            {routerFrom === 'profile' && (
                <ProfilePage
                    profile={profile}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    activeUserDialog={activeUserDialog ? activeUserDialog : []}
                />
            )}
            {routerFrom === 'profile' && (
                <ProfilesList
                    from={'desktop'}
                    setDialogOpen={setDialogOpen}
                    setActiveUserDialog={setActiveUserDialog}
                />
            )}
            {routerFrom === 'topUpBalance' && (
                <TopUpBalanceSettings balanceId={balanceId} />
            )}
            {routerFrom === 'myCards' && <MyCards />}
            {routerFrom === 'watched-history' && <WatchedHistory />}
            {routerFrom === 'promo-codes' && <PromoCodes />}
            {routerFrom === 'subscription' && <Payment />}
            {routerFrom === 'bought' && <BoughtMovies />}
            {routerFrom === 'devices' && <Devices />}
            {routerFrom === 'notifications' && (
                <NotificationsPage notifications={notifications} />
            )}
            {routerFrom === 'order-table' && <OrderTable />}
        </div>
    )
}
