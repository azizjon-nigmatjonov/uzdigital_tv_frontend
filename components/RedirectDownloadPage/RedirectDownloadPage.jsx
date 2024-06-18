import React, { useState, useEffect } from 'react'
import cls from './RedirectDownloadPage.module.scss'
import { useIsMobile } from 'hooks/useIsMobile'
import VideoPlayer from 'components/video/VideoPlayer'
import { useDispatch } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'
import DeviceDetector from 'device-detector-js'
import { useRouter } from 'next/router'
import { useTranslation } from 'i18n'

export default function RedirectDownloadPage({ movieInfo }) {
    const isMobile = useIsMobile()
    const dispatch = useDispatch()
    const [checkSubscription, setCheckSubscription] = useState({})
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const router = useRouter()
    const { t } = useTranslation()

    const handleRedirect = () => {
        if (movieInfo.is_megogo || movieInfo.is_premier) {
            router.push(
                `/movie/${movieInfo?.id}${
                    movieInfo?.is_megogo ? '?type=megogo' : '?type=premier'
                }`,
            )
        } else {
            router.push(`/movie/${movieInfo?.slug}?type=uzdigital`)
        }
    }

    useEffect(() => {
        if (
            checkSubscription?.has_access &&
            checkSubscription?.purchase_notification
        ) {
            dispatch(showAlert(t('sabscription_active_text'), 'success'))
        }
    }, [checkSubscription])

    return (
        <div className={cls.root}>
            <div className={`${!isMobile && 'mt-[-80px]'} mb-10`}>
                <VideoPlayer
                    el={movieInfo ? movieInfo : []}
                    checkSubscription={checkSubscription}
                />
            </div>
            <div
                className={`${cls.fixedBox} flex justify-center items-center flex-col`}
            >
                <div
                    className={`${cls.title} text-14 leading-17 text-center font-bold text-white mb-4`}
                >
                    {movieInfo?.title}
                </div>
                <div
                    className={`${cls.info} text-[#A9A7B4] text-10 leading-10 font-normal flex justify-center items-center`}
                >
                    {movieInfo?.release_year && (
                        <span className="flex justify-center items-center">
                            <p>{movieInfo?.release_year}</p> &nbsp; • &nbsp;{' '}
                        </span>
                    )}
                    {movieInfo?.country && (
                        <span className="flex justify-center items-center">
                            <p>{movieInfo?.country}</p>&nbsp; •&nbsp;
                        </span>
                    )}
                    {movieInfo?.genres?.length > 0 && (
                        <p>{movieInfo?.genres[0].title}</p>
                    )}{' '}
                    {movieInfo?.age_restriction && (
                        <span className="flex justify-center items-center">
                            &nbsp; •&nbsp;
                            <div className="bg-[#393939] p-[4px] rounded-sm">
                                <p>{movieInfo?.age_restriction}+</p>
                            </div>
                        </span>
                    )}
                </div>
                <div className={`${cls.watch} w-[300px]`}>
                    <h1 className="text-14 leading-17 text-white font-semibold text-center mt-4 tracking-[0.34px]">
                        {t('Watch Uzdigital on your phone or tablet')}
                    </h1>
                </div>
                <div
                    className={`${cls.buttons} flex justify-center items-center flex-col`}
                >
                    <button className="bg-mainColor text-white font-normal text-8 leading-12 py-3.5 w-[220px] rounded-[12px] mt-8">
                        {t('Download app')}
                    </button>
                    <button
                        className="bg-[#1C192C] text-white font-normal text-8 leading-12 py-3.5 w-[220px] rounded-[12px] mt-3.5"
                        onClick={handleRedirect}
                    >
                        {t('Go to website')}
                    </button>
                </div>
            </div>
        </div>
    )
}
