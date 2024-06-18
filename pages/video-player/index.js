import PlayerForVideo from 'components/PlayerForVideo/PlayerForVideo'
import React, { useState, useEffect } from 'react'
import { parseCookies } from 'nookies'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import router from 'next/router'
import axios from 'utils/axios'
import { useTranslation } from 'i18n'

export default function VideoPlayerPage({
    movies,
    isTrailer,
    indNumber,
    currentTime,
    seasonNumber,
    episodeNumber,
    track,
}) {
    const { i18n } = useTranslation()
    const { user_id } = parseCookies()
    const [integrationSeasons, setIntegrationSeasons] = useState(null)
    const [integrationMovieCame, setIntegrationMovieCame] = useState(false)
    const [stream_video, setStreamVideo] = useState(null)
    useEffect(() => {
        if (router?.query?.id && router?.query?.type === 'megogo') {
            if (user_id) {
                axios
                    .get(`megogo/auth?platform=${''}&isdn=${user_id}`)
                    .then((res) => {
                        getMegogoMovie(res?.data?.tokens?.access_token)
                    })
            }
        }
    }, [user_id])

    const getMegogoMovie = (evt) => {
        if (router?.query?.episodeId) {
            axios
                .get(
                    `megogo/stream?video_id=${router.query.episodeId}&access_token=${evt}&lang=${i18n?.language}`,
                )
                .then((res) => {
                    const megogo_stream = res?.data
                        ? {
                              file_info: {
                                  videos: res?.data?.data?.bitrates?.map(
                                      (item) => ({
                                          quality: item.bitrate + 'p',
                                          file_name: item.src,
                                      }),
                                  ),
                                  is_megogo: true,
                                  title: res?.data?.data?.title,
                                  is_serial: true,
                                  default: res?.data?.data?.src,
                              },
                          }
                        : []
                    setStreamVideo(megogo_stream)
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setIntegrationMovieCame(true)
                })

            axios
                .get(
                    `megogo/movie/info?id=${router?.query?.id}&lang=${i18n?.language}`,
                )
                .then((res) => {
                    setIntegrationSeasons(res?.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            axios
                .get(
                    `megogo/stream?video_id=${router.query.id}&access_token=${evt}`,
                    {
                        params: {
                            lang: i18n?.language,
                        },
                    },
                )
                .then((res) => {
                    const megogo_stream = res?.data?.data
                        ? {
                              file_info: {
                                  videos: res?.data?.data?.bitrates?.map(
                                      (item) => ({
                                          quality: item.bitrate + 'p',
                                          file_name: item.src,
                                      }),
                                  ),
                                  is_megogo: true,
                                  title: res?.data?.data?.title,
                                  default: res?.data?.data?.src,
                              },
                          }
                        : []
                    setStreamVideo(megogo_stream)
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setIntegrationMovieCame(true)
                })
        }
    }

    useEffect(() => {
        if (router?.query?.id && router?.query?.type === 'premier') {
            if (router?.query?.episodeId) {
                axios
                    .get(
                        `/premier/videos/${router.query.id}/episodes/${router.query.episodeId}/stream`,
                    )
                    .then((res) => {
                        const stream_video = res?.data
                            ? {
                                  file_info: {
                                      videos: res?.data?.file_info?.map(
                                          (item) => ({
                                              quality: item?.quality,
                                              file_name: item?.file_name,
                                          }),
                                      ),
                                      is_premier: true,
                                      is_serial: true,
                                  },
                              }
                            : []
                        setStreamVideo(stream_video)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                    .finally(() => {
                        setIntegrationMovieCame(true)
                    })

                axios
                    .get(`premier/videos/${router?.query?.id}`)
                    .then((res) => {
                        setIntegrationSeasons(res?.data)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            } else {
                axios
                    .get(`/premier/videos/${router.query.id}/stream`)
                    .then((res) => {
                        const stream_video = res?.data
                            ? {
                                  file_info: {
                                      videos: res?.data?.file_info?.map(
                                          (item) => ({
                                              quality: item?.quality,
                                              file_name: item?.file_name,
                                          }),
                                      ),
                                      // title: res?.data?.title,
                                      is_premier: true,
                                  },
                              }
                            : []
                        setStreamVideo(stream_video)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                    .finally(() => {
                        setIntegrationMovieCame(true)
                    })
            }
        }
    }, [])

    return (
        <>
            <SEO />
            {isTrailer === false && (
                <div>
                    {!integrationMovieCame ? (
                        <PlayerForVideo
                            currentTime={currentTime}
                            indNumber={indNumber}
                            isTrailer={isTrailer}
                            data={movies}
                            track={
                                router?.query?.lastTime
                                    ? router?.query?.lastTime
                                    : track
                            }
                            seasonNumber={seasonNumber}
                            episodeNumber={episodeNumber}
                        />
                    ) : (
                        ''
                    )}

                    {integrationMovieCame && (
                        <PlayerForVideo
                            currentTime={currentTime}
                            indNumber={indNumber}
                            isTrailer={isTrailer}
                            data={
                                (isTrailer === false &&
                                    stream_video?.file_info?.is_premier) ||
                                stream_video?.file_info?.is_megogo
                                    ? stream_video
                                    : movies
                            }
                            track={
                                router?.query?.lastTime
                                    ? router?.query?.lastTime
                                    : track
                            }
                            seasonNumber={seasonNumber}
                            episodeNumber={episodeNumber}
                            integrationSeasons={
                                integrationSeasons ? integrationSeasons : {}
                            }
                        />
                    )}
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx
    const isTrailer = false
    const { user_id } = parseCookies(ctx)

    const urls = [
        {
            endpoint: `movies/${query.key}?profile_id=${query.profile_id}`,
        },
        {
            endpoint: `episode-track?movie_key=${query.key}&user_id=${user_id}${
                query.seasonNumber ? `&season_key=${query.seasonNumber}` : ''
            }${
                query.episodeNumber ? `&episode_key=${query.episodeNumber}` : ''
            }`,
        },
    ]

    const [movies, track] = await fetchMultipleUrls(urls, ctx)

    const indNumber = query?.ind
    const currentTime = query.currentTime ? query?.currentTime : 0

    return {
        props: {
            movies: movies ?? [],
            isTrailer,
            indNumber,
            currentTime,
            seasonNumber: query.seasonNumber ? query?.seasonNumber : 0,
            episodeNumber: query.episodeNumber ? query?.episodeNumber : 0,
            track,
        },
    }
}
