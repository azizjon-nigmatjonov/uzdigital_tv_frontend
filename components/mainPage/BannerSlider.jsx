import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { IMDBIcon } from 'components/svg'
import NextLink from 'components/common/link'
import router from 'next/router'
import { Pagination } from 'swiper'

const BannerSlider = ({ movies }) => {
    const [sortedArr, setSortedArr] = useState([])
    const handleRedirect = (item) => {
        if (item.is_news) {
            window.open(item.link, '_blank')
        } else {
            router.push(`/preview/${item.slug}?type=uzdigital`)
        }
    }

    useEffect(() => {
        let responsiveMovies = movies
            .sort(() => Math.random() - 0.5)
            .slice(0, movies.length)
        setSortedArr(responsiveMovies)
    }, [movies])
    return (
        <>
            <div className="h-full">
                <Swiper
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    spaceBetween={30}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    loop={true}
                    // navigation={true}
                    // modules={[Navigation]}
                    className="h-full"
                >
                    {sortedArr?.map((item, ind) => {
                        return (
                            <SwiperSlide key={ind}>
                                <div className="relative h-full">
                                    <div className="h-full">
                                        <div
                                            onClick={() => handleRedirect(item)}
                                            className="after_gradient"
                                        ></div>

                                        <img
                                            className="h-full w-full object-cover"
                                            src={item && item?.file_info?.image}
                                            alt="image"
                                        />
                                    </div>
                                    <div className="absolute left-0 bottom-0 z-[5] w-full">
                                        <div className="text-center mb-10 wrapper">
                                            <span className="text-3xl font-semibold text-[#ffffff]">
                                                {item?.title}
                                            </span>
                                            <div className="text-sm font-medium text-[#D5DADD] flex items-center justify-center flex-wrap mt-2">
                                                {item?.rating_imdb
                                                    ?.rating_imdb && (
                                                    <span className="text-sm font-semibold text-white mr-2 flex">
                                                        <IMDBIcon width="30" />
                                                        <span className="ml-[7px]">
                                                            {' '}
                                                            {
                                                                item
                                                                    ?.rating_imdb
                                                                    ?.rating_imdb
                                                            }{' '}
                                                            <span className="text-[#D5DADD]">
                                                                ·
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                                {item?.is_megogo && (
                                                    <span className="text-sm font-semibold text-white mr-2.5 flex items-center">
                                                        <IMDBIcon />
                                                        <span className="ml-[7px]">
                                                            {' '}
                                                            {item?.rating}{' '}
                                                            <span className="text-[#D5DADD]">
                                                                ·
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                                {item?.country ? (
                                                    <span className="mr-2">
                                                        {item?.country} ·
                                                    </span>
                                                ) : null}
                                                {item?.release_year > 0 ? (
                                                    <span className="mr-2">
                                                        {item?.release_year} ·
                                                    </span>
                                                ) : null}
                                                {item.genres ? (
                                                    !item?.is_megogo ? (
                                                        <span>
                                                            {`${
                                                                item?.genres
                                                                    ?.length >
                                                                    0 &&
                                                                item?.genres[0]
                                                                    ?.title
                                                            }`}{' '}
                                                            <span className="ml-0.5 mr-1">
                                                                {' '}
                                                                ·
                                                            </span>
                                                        </span>
                                                    ) : filterGenres.length >
                                                      0 ? (
                                                        `${filterGenres[0]?.title}`
                                                    ) : item?.is_megogo ? (
                                                        item?.genres[0]
                                                    ) : (
                                                        ''
                                                    )
                                                ) : null}
                                                {/* {movieDuration && (
                                            <span className="mx-2">
                                                {movieDuration}{' '}
                                            </span>
                                        )} */}
                                                {item.age_restriction ? (
                                                    <span className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                                        {item?.age_restriction
                                                            ?.toString()
                                                            .charAt(
                                                                item?.age_restriction?.toString()
                                                                    .length - 1,
                                                            ) === `+`
                                                            ? item?.age_restriction
                                                            : ` ${item?.age_restriction?.toString()}+`}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </>
    )
}

export default BannerSlider
