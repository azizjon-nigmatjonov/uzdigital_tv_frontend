import SEO from 'components/SEO'
import nookies from 'nookies'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import MoviePageMobile from 'components/pages/movies/MoviePageMobile'
import { useRouter } from 'next/router'
import { useTranslation } from 'i18n'
import RedirectDownloadPage from 'components/RedirectDownloadPage/RedirectDownloadPage'
import { useState, useEffect } from 'react'
import axios from 'utils/axios'
import { useSelector } from 'react-redux'
import { parseCookies } from 'nookies'

export default function PreviewMovies() {
    const [moviesSinglepage, setMoviesSinglepage] = useState([])
    const router = useRouter()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id } = parseCookies()
    const { i18n } = useTranslation()

    useEffect(() => {
        if (router.query.type == 'uzdigital') {
            axios
                .get(
                    `movies/${router.query.movie}?lang=${
                        i18n.language
                    }&profile_id=${
                        CurrentUserData?.id
                            ? CurrentUserData?.id
                            : profile_id
                            ? profile_id
                            : ''
                    }`,
                )
                .then((res) => {
                    setMoviesSinglepage(res.data)
                })
                .catch((err) => {})
        }
    }, [])

    useEffect(() => {
        if (router.query.type === 'megogo') {
            axios
                .get(
                    `megogo/movie/info?id=${router?.query?.movie}&lang=${
                        i18n?.language
                    }&profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }`,
                )
                .then((response) => {
                    setMoviesSinglepage(response.data)
                })
                .catch((error) => {
                    console.log('error', error)
                })
        }
        if (router.query.type === 'premier') {
            axios
                .get(
                    `premier/videos/${router?.query?.movie}?profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }`,
                )
                .then((response) => {
                    setMoviesSinglepage(response.data)
                })
                .catch((err) => {
                    console.log('err', err)
                })
        }
    }, [router?.query, i18n?.language])

    return (
        <>
            <SEO />
            <RedirectDownloadPage
                movieInfo={moviesSinglepage ? moviesSinglepage : []}
            />
        </>
    )
}
