import React, { useEffect, useState, useRef } from 'react'
import TvChannel from 'components/cards/TvChannel'
import { useTranslation } from 'i18n'
import Skeleton from '@mui/material/Skeleton'
import {
    setTvSearchValue,
    setTvSearchValueByTyping,
} from 'store/actions/application/searchAction'
import { useDispatch } from 'react-redux'
import { ClearIconDark } from 'components/svg'
import NullData from 'components/errorPopup/NullData'
import { NullDataSearchIcon } from 'components/svg'
import { Router } from 'i18n'

const ChannelsPage = ({ channels_list, channel_category, tvSearchValue }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const skeletonNumber = [1, 2, 3, 4, 5]
    const [isShimmerActive, setShimmerActive] = useState(false)
    const refClear = useRef()
    const [allTvChannelsActive, setTvAllChannelsActive] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 500)
    }, [])

    const handleTvSearch = (ID) => {
        if (ID === null) {
            dispatch(setTvSearchValue(null))
            dispatch(setTvSearchValueByTyping(''))
            refClear.current.value = ''
        } else {
            dispatch(setTvSearchValue(ID))
            dispatch(setTvSearchValueByTyping(''))
            refClear.current.value = ''
        }
    }

    useEffect(() => {
        if (refClear.current.value === '' && !tvSearchValue.length) {
            setTvAllChannelsActive(true)
        } else {
            setTvAllChannelsActive(false)
        }
    }, [refClear, tvSearchValue])
    return (
        <div className="min-h-[70vh] px-4 md:px-[56px] flex flex-col text-white mt-5 mb-8">
            <h1 className="text-2xl md:text-[40px] font-bold">
                {t('channels')}
            </h1>
            <div className="scroll mt-3 sm:mt-12 flex sm:flex-wrap gap-2 overflow-x-scroll">
                <div
                    onClick={() => handleTvSearch(null)}
                    className={`border border-[#383641] py-[6px] md:py-[9px] px-[15px] inline-block rounded-full cursor-pointer text-center ${
                        allTvChannelsActive ? 'bg-[#fff] bg-opacity-[0.1]' : ''
                    }`}
                >
                    <span className="text-[12px] sm:text-[15px] font-medium whitespace-nowrap">
                        {t('All channels')}
                    </span>
                </div>
                {channel_category &&
                    channel_category.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleTvSearch(category.id)}
                            className={`border border-[#383641] py-[6px] md:py-[9px] px-[15px] inline-block rounded-full cursor-pointer text-center ${
                                tvSearchValue === category.id
                                    ? 'bg-[#fff] bg-opacity-[0.1]'
                                    : ''
                            }`}
                        >
                            <span className="text-[12px] sm:text-[15px] font-medium whitespace-nowrap">
                                {i18n?.language === 'ru'
                                    ? category.title_ru
                                    : i18n?.language === 'en'
                                    ? category.title_en
                                    : category.title_uz}
                            </span>
                        </div>
                    ))}
            </div>
            <div className="mb-10 relative mt-6">
                <input
                    ref={refClear}
                    onChange={(e) => {
                        dispatch(setTvSearchValueByTyping(e.target.value))
                        dispatch(setTvSearchValue(null))
                    }}
                    type="text"
                    placeholder={t('search')}
                    className="bg-[#fff] bg-opacity-[0.05] py-[14px] px-[20px] w-full sm:w-[360px] rounded-[12px] focus:outline-none focus:bg-opacity-[0.1] text-[15px] font-medium searchChannel"
                />
                {refClear?.current?.value?.length > 0 && (
                    <button
                        onClick={() => {
                            dispatch(setTvSearchValue(null))
                            dispatch(setTvSearchValueByTyping(''))
                            refClear.current.value = ''
                        }}
                        className="p-3 cursor-pointer absolute top-[50%] translate-y-[-50%] translate-x-[-50%] left-[92%] sm:left-[335px]"
                    >
                        <ClearIconDark width="10" height="10" />
                    </button>
                )}
            </div>
            {channels_list && isShimmerActive ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 md:gap-y-5 gap-x-4 md:gap-x-5">
                    {channels_list?.tv_channels?.map((item) => (
                        <div key={item.id}>
                            <TvChannel
                                el={item}
                                title={item[`title_${i18n?.language}`]}
                                time="12 : 00"
                                info={item[`description_${i18n?.language}`]}
                                imgSrc={item?.image}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 md:gap-y-8 gap-x-4 md:gap-x-8">
                        {skeletonNumber?.map((i) => (
                            <div key={i}>
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        width: '100%',
                                        height: '130px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {channels_list?.tv_channels?.length === 0 && (
                <div className="my-5 flex justify-center md:my-20">
                    <NullData
                        icon={<NullDataSearchIcon />}
                        title={t('Здесь нет данные')}
                        text={t(
                            'Можете посмотреть другие разделы которые есть данные',
                        )}
                        textButton={t('back')}
                        link={() => Router.push('/')}
                    />
                </div>
            )}
        </div>
    )
}

export default ChannelsPage
