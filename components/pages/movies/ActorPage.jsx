import React, { useEffect, useState } from 'react'
import Movie from '../../cards/Movie'
import cls from './movies.module.scss'
import { useTranslation } from 'i18n'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import NextLink from 'components/common/link'
import restangleImg from '../../../public/images/uzdplus secondary logo-01 (2).png'
import { motion } from 'framer-motion'
import MegaGoTag from '../../../public/vectors/MegagoTag.svg'

const ActorPage = ({ data }) => {
    const { t } = useTranslation()
    const [biographyMore, setBiographyMore] = useState(false)

    useEffect(() => {
        if (!data?.is_megogo && data?.staff?.biography?.length > 305) {
            setBiographyMore(true)
        } else {
            setBiographyMore(false)
        }
        if (data?.is_megogo && data?.description?.length > 305) {
            setBiographyMore(true)
        } else {
            setBiographyMore(false)
        }
    }, [data])

    const [biographyInfo, setBiograpyInfo] = useState()
    const [biographyActive, setBiographyActive] = useState(false)

    const openBiographyItem = () => {
        if (data?.is_megogo) {
            setBiograpyInfo(data?.description?.trim().substring(0, 305) + '. ')
        } else {
            setBiograpyInfo(
                data?.staff?.biography?.trim().substring(0, 305) + '. ',
            )
        }
        setBiographyActive(!biographyActive)
    }

    const closeBiographyItem = () => {
        if (data?.is_megogo) {
            setBiograpyInfo(data?.description)
        } else {
            setBiograpyInfo(data?.staff?.biography)
        }
        setBiographyActive(!biographyActive)
    }

    useEffect(() => {
        openBiographyItem()
    }, [data])
    return (
        <div>
            <div className={cls.bgGrading} />
            <img
                src={
                    data?.is_megogo && data?.avatar?.image_original
                        ? data?.avatar?.image_original
                        : data?.avatar?.image_original === ''
                        ? restangleImg.src
                        : data?.staff?.photo
                }
                alt="img"
                className={`${cls.bg_actor} ${
                    data?.avatar?.image_original === ''
                        ? 'object-contain'
                        : 'object-cover'
                }`}
            />
            <div className="wrapper">
                <div
                    className={`${cls.contentWrapper} flex items-start md:items-end text-center md:text-left text-white`}
                >
                    <div className="relative z-[22] mb-[180px]">
                        <div className="mb-6 md:mb-0 w-[208px] h-[246px] overflow-hidden rounded-[12px]">
                            <img
                                src={
                                    data?.is_megogo &&
                                    data?.avatar?.image_original
                                        ? data?.avatar?.image_original
                                        : data?.avatar?.image_original === ''
                                        ? restangleImg.src
                                        : data?.staff?.photo
                                }
                                className={`w-full h-full hover:scale-105 duration-300 ${
                                    data?.avatar?.image_original === ''
                                        ? 'object-contain'
                                        : 'object-cover'
                                }`}
                                alt="image"
                            />
                        </div>
                        <div className="z-[22] mt-6">
                            <h2 className="text-[34px] font-[700] text-left">
                                {data.is_megogo
                                    ? data?.name
                                    : data?.staff?.first_name}{' '}
                                {data?.staff?.last_name}
                            </h2>
                            {biographyMore ? (
                                <p className="text-left mt-[8px] md:max-w-[700px]">
                                    {biographyInfo}
                                    {!biographyActive ? (
                                        <span
                                            onClick={closeBiographyItem}
                                            className="text-[#cccc] cursor-pointer underline text-[16px]"
                                        >
                                            {t('read_more')}
                                        </span>
                                    ) : (
                                        <span
                                            onClick={openBiographyItem}
                                            className="text-[#cccc] cursor-pointer underline text-[16px]"
                                        >
                                            {t('close')}
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <p className="text-left mt-[8px] md:max-w-[700px]">
                                    {biographyInfo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h3 className="section-title mb-3 md:mb-6">{t('films')}</h3>
                    <div className="movies-grid-colums text-white">
                        {data?.movies?.map((el, ind) => (
                            <motion.div
                                key={el.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.05,
                                    delay: 0.05 * ind,
                                    ease: [0.1, 0.01, -0.01, 0.1],
                                }}
                            >
                                <Movie
                                    key={ind}
                                    el={el?.movie}
                                    layoutWidth="w-full"
                                    imgWidth="gridImagesProperties"
                                />
                            </motion.div>
                        ))}
                        {data?.is_megogo && (
                            <>
                                {data?.filmography?.map((item) => (
                                    <NextLink
                                        href={`/movie/${item?.id}?type=megogo`}
                                        key={item.id}
                                    >
                                        <a className="w-full overflow-hidden hover:scale-110 duration-300 cursor-pointer">
                                            <div className="w-full h-[204px] lg:h-[225px] relative">
                                                <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute right-2 top-2 text-white uppercase text-[13px] font-semibold flex items-center justify-center">
                                                    <MegaGoTag />
                                                </div>
                                                <LazyLoadImage
                                                    className="min-w-full min-h-full max-h-full rounded-[4px] object-cover"
                                                    src={item?.image.original}
                                                ></LazyLoadImage>
                                            </div>
                                            <p className="mt-[8px] whitespace-nowrap">
                                                {item.title}
                                            </p>
                                        </a>
                                    </NextLink>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActorPage
