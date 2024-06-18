import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'i18n'
import { NextEpisodeIcon, CarouselRightArrow, CloseIcon } from 'components/svg'
import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import router from 'next/router'
import { useTranslation } from 'i18n'

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={1} square {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}))

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
    ({ theme }) => ({
        backgroundColor: '#1C192C',
        flexDirection: 'row-reverse',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04) !important',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            margin: '20px 0',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: '500',
        },
    }),
)

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    color: '#fff',
    backgroundColor: '#1C192C',
}))

export default function AllEpisodes({
    data,
    slug,
    seasonNumber,
    allData,
    seasonData,
    refHover,
    nextEpisode,
    episodeOpen,
    setEpisodeOpen,
    setNextEpisode,
    setQualityOpen,
    qualityOpen,
    episodeNumber,
    integrationSeasons,
}) {
    const [expanded, setExpanded] = useState(data?.id)
    const [seasonComponent, setSeasonComponent] = useState(false)
    const [newSeasonNumber, setNewSeasonNumber] = useState(null)
    const allEpisodes = seasonData[seasonNumber - 1]?.episodes
    let newSeason = seasonData[newSeasonNumber - 1]?.episodes
    const { t } = useTranslation()
    const refClear = useRef(null)
    const openButton = useRef(null)
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    const handleClickOutside = (e) => {
        if (
            !refClear?.current?.contains(e.target) &&
            !openButton?.current?.contains(e.target)
        ) {
            setEpisodeOpen(false)
        } else {
            if (
                openButton?.current?.contains(e.target) &&
                !refClear?.current?.contains(e.target)
            ) {
                setEpisodeOpen(!episodeOpen)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    })

    return (
        <>
            <div
                onClick={(e) => {
                    setEpisodeOpen(false)
                }}
                className={
                    episodeOpen
                        ? 'block absolute z-[99999999999999999999999999999999999999999] top-[-85vh] left-0 w-[400px] h-[100vh]'
                        : 'hidden'
                }
            />
            <div
                ref={refHover}
                onMouseLeave={() => {
                    setExpanded(data?.id)
                    setSeasonComponent(false)
                    // setNewSeasonNumber(null)
                }}
                className="containerAllEpisodesAndSeasons"
            >
                <div
                    ref={refClear}
                    className={
                        episodeOpen
                            ? `cont cont_active ${
                                  seasonComponent && seasonData.length === 1
                                      ? '!overflow-y-hidden'
                                      : ''
                              }`
                            : `cont`
                    }
                >
                    <div
                        className={
                            seasonComponent
                                ? 'all_seasons absolute fade-in-left'
                                : 'all_seasons absolute right-[-100%] z-[-8888888]'
                        }
                    >
                        <div className="all_seasons_header">
                            <span>
                                {integrationSeasons
                                    ? integrationSeasons?.title
                                    : allData?.title}
                            </span>
                        </div>
                        <ul className="seasons_list w-full">
                            {seasonData?.map((item, index, row) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setNewSeasonNumber(item.season_number)
                                        setSeasonComponent(false)
                                    }}
                                    className={`relative cursor-pointer seasons_item py-[18px] px-4 text-[15px] leading-5 font-semibold ${
                                        index + 1 === row.length
                                            ? ''
                                            : 'border-b border-opacity-[0.1] border-[#fff]'
                                    }`}
                                >
                                    <p>
                                        {t('season')}{' '}
                                        <span className="pl-1">
                                            {index + 1}
                                        </span>
                                    </p>
                                    <span className="absolute right-6">
                                        <CarouselRightArrow />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        className={
                            seasonComponent
                                ? 'absolute fade-out-right w-[400px]'
                                : 'fade-in-right'
                        }
                    >
                        <div className="header">
                            {/* <CloseIcon /> */}
                            <h2 className="lowercase">
                                {newSeasonNumber
                                    ? newSeasonNumber
                                    : seasonNumber}{' '}
                                {t('season')}{' '}
                                <span className="!text-white opacity-60">
                                    <span className="!text-white">
                                        {episodeNumber}{' '}
                                    </span>{' '}
                                    {t('episode')}
                                </span>
                            </h2>
                            <button
                                className="season_btn hover:scale-105 duration-300"
                                onClick={() => setSeasonComponent(true)}
                            >
                                {t('allSeasons')}
                            </button>
                        </div>
                        {(newSeason ? newSeason : allEpisodes)?.map(
                            (item, index) => (
                                <div key={index}>
                                    <Link
                                        href={
                                            router?.query?.type === 'megogo'
                                                ? `/video-player?id=${slug}&episodeId=${
                                                      item.id
                                                  }&trailer=${false}&ind=0&seasonNumber=${
                                                      newSeason
                                                          ? newSeasonNumber
                                                          : seasonNumber
                                                  }&episodeNumber=${
                                                      index + 1
                                                  }&type=megogo`
                                                : router?.query?.type ===
                                                  'premier'
                                                ? `/video-player?id=${slug}&episodeId=${
                                                      item.id
                                                  }&trailer=${false}&ind=0&seasonNumber=${
                                                      newSeason
                                                          ? newSeasonNumber
                                                          : seasonNumber
                                                  }&episodeNumber=${
                                                      index + 1
                                                  }&type=premier`
                                                : `/video-player?key=${slug}&ind=0&seasonNumber=${
                                                      newSeason
                                                          ? newSeasonNumber
                                                          : seasonNumber
                                                  }&episodeNumber=${index + 1}`
                                        }
                                    >
                                        <a>
                                            <div
                                                className={`body flex items-center py-2 px-4 cursor-pointer`}
                                            >
                                                <div>
                                                    <img
                                                        src={
                                                            item?.file_info
                                                                ?.image
                                                                ?.length > 0
                                                                ? item
                                                                      ?.file_info
                                                                      ?.image
                                                                : '../vectors/movie-image-vector.svg'
                                                        }
                                                        alt="image"
                                                    />
                                                </div>
                                                <div className="textpart ">
                                                    <h2>
                                                        {index + 1}{' '}
                                                        {t('series')}
                                                    </h2>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <div
                    ref={openButton}
                    onClick={() => {
                        setNextEpisode(false)
                        setQualityOpen(false)
                    }}
                    className={`buttonNextEpisode ${
                        !allEpisodes ? 'hidden' : 'block'
                    }`}
                >
                    <NextEpisodeIcon />
                </div>
            </div>
        </>
    )
}
