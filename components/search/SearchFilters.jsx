import MegaGoTag from '../../public/vectors/MegagoTag.svg'
import React, { useState } from 'react'
import { useTranslation } from 'i18n'
import cls from './SearchStyle.module.scss'
import NextLink from 'components/common/link'
import { useDispatch } from 'react-redux'
import {
    setSearchAction,
    setSearchValue,
} from '../../store/actions/application/searchAction'
import { motion } from 'framer-motion'
import { PremierTag } from '../../components/svg'

export default function SearchFilters({ data }) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [marquee, setMarque] = useState({ status: false, id: 0 })
    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    return (
        <div className={cls.filter}>
            <div className={cls.filter_write}>
                <h2 className={cls.filter_title}>{t('result_search')}</h2>
            </div>

            <div className={cls.filter_box}>
                <div className={cls.filter_result}>
                    {data?.map((item, i) => (
                        <motion.div
                            key={item.id || i}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.05,
                                delay: 0.05 * i,
                                ease: [0.1, 0.01, -0.01, 0.1],
                            }}
                        >
                            <div
                                className={`${cls.filter_item} sm:w-[149px] sm:h-[264px]  md:hover:scale-105 duration-300`}
                            >
                                <NextLink
                                    href={
                                        item?.is_megogo
                                            ? window.innerWidth < 1200
                                                ? `/preview/${item?.id}?type=megogo`
                                                : `/movie/${item?.id}?type=megogo`
                                            : item?.is_premier
                                            ? window.innerWidth < 1200
                                                ? `/preview/${item?.id}?type=premier`
                                                : `/movie/${item?.id}?type=premier`
                                            : window.innerWidth < 1200
                                            ? `/preview/${
                                                  item?.is_premier ||
                                                  item?.is_megogo
                                                      ? item?.id
                                                      : item?.slug
                                              }?type=${
                                                  item?.is_premier
                                                      ? 'premier'
                                                      : item?.is_megogo
                                                      ? 'megogo'
                                                      : 'uzdigital'
                                              }`
                                            : `/movie/${item?.slug}`
                                    }
                                >
                                    <a
                                        onClick={() => {
                                            dispatch(setSearchAction(false))
                                        }}
                                        onMouseEnter={() =>
                                            setMarque({
                                                status:
                                                    item?.title?.length >
                                                    (windowWidth < 640
                                                        ? 13
                                                        : 18)
                                                        ? true
                                                        : false,
                                                id: item.id,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            setMarque({ status: false, id: 0 })
                                        }
                                    >
                                        <span className="flex-col gap-1 md:gap-2 absolute left-[0px] top-[10px] hidden md:flex">
                                            {(item?.tags
                                                ? item.tags
                                                : item?.Tags
                                            )?.map((tag, i) => (
                                                <div key={i}>
                                                    {
                                                        <span
                                                            key={i}
                                                            className={
                                                                i === 1
                                                                    ? `${cls.tag_movie} ${cls.second_tag} bg-[${tag?.color}]`
                                                                    : cls.tag_movie
                                                            }
                                                            style={{
                                                                background:
                                                                    tag?.color
                                                                        ? tag?.color
                                                                        : '#4589ff',
                                                            }}
                                                        >
                                                            {tag.title}
                                                        </span>
                                                    }
                                                </div>
                                            ))}
                                        </span>
                                        {item ? (
                                            <div className="relative">
                                                <img
                                                    className={`${cls.filter_img}`}
                                                    src={
                                                        item?.image?.big
                                                            ?.length > 0
                                                            ? item?.image?.big
                                                            : item?.image
                                                                  ?.original
                                                                  ?.length > 0
                                                            ? item?.image
                                                                  ?.original
                                                            : item?.logo_image
                                                    }
                                                    alt="alt"
                                                />
                                                {item?.is_megogo && (
                                                    <div className="bg-[#000] w-[20px] md:w-[28px] h-[14px] md:h-[28px] z-[2] rounded-[4px] absolute right-1 md:left-auto md:right-2 top-2 text-white uppercase text-[13px] font-semibold flex items-center justify-center">
                                                        <MegaGoTag />
                                                    </div>
                                                )}
                                                {item?.is_premier && (
                                                    <div className="bg-[#000] w-[20px] md:w-[28px] h-[14px] md:h-[28px] z-[2] rounded-[4px] absolute right-1 md:left-auto md:right-2 top-0 sm:top-2 text-white uppercase text-[14px] font-semibold flex items-center justify-center">
                                                        <PremierTag />
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                        {item?.is_megago && (
                                            <span className={cls.megago_tag}>
                                                <MegaGoTag />
                                            </span>
                                        )}
                                        <div className="truncate h-[40px] mt-[8px] relative flex flex-col md:mt-[8px] md:ml-0">
                                            {marquee?.status &&
                                            item.id === marquee?.id ? (
                                                <marquee scrolldelay="70">
                                                    <span
                                                        className={`text-white overflow-hidden text-[15px] leading-[20px] ${
                                                            item?.title
                                                                ?.length > 45
                                                                ? 'w-[400px]'
                                                                : item?.title
                                                                      ?.length >
                                                                  35
                                                                ? 'w-[350px]'
                                                                : item?.title
                                                                      ?.length >
                                                                  25
                                                                ? 'w-[400px] sm:w-[300px]'
                                                                : item?.title
                                                                      ?.length >
                                                                  13
                                                                ? 'w-[200px] sm:w-[250px]'
                                                                : 'w-[150px]'
                                                        }  md:text-8 md:leading-10 line-clamp-2 font-medium ${
                                                            cls.movie_title
                                                        }`}
                                                    >
                                                        {item?.title}
                                                    </span>
                                                </marquee>
                                            ) : (
                                                <span
                                                    className={`text-white overflow-hidden text-[15px] leading-[20px] w-[150px] md:text-8 md:leading-10 line-clamp-2 font-medium ${cls.movie_title}`}
                                                >
                                                    {item?.title}
                                                </span>
                                            )}

                                            {item?.payment_type === 'free' ? (
                                                <span
                                                    style={{ color: '#119C2B' }}
                                                    className="md:absolute bottom-0 text-red-500 font-400 text-7 leading-8  truncate "
                                                >
                                                    {t('watch_Free')}
                                                </span>
                                            ) : item?.payment_type === 'svod' ||
                                              item?.is_megogo ? (
                                                <span
                                                    style={{ color: '#4589FF' }}
                                                    className="md:absolute bottom-0 text-red-500 font-400 text-7 leading-8  truncate "
                                                >
                                                    {t('watch_Subscription')}
                                                </span>
                                            ) : item?.payment_type ===
                                              'tvod' ? (
                                                <span
                                                    style={{ color: '#5086EC' }}
                                                    className="md:absolute bottom-0 text-red-500 font-400 text-7 leading-8  truncate"
                                                >
                                                    {item?.pricing
                                                        ?.substracted_price /
                                                        100 +
                                                        `${t('currency')}`}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </a>
                                    {/* </ClickAwayListener> */}
                                </NextLink>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
