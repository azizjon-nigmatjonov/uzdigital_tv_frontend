import { useEffect, useState } from 'react'
import ActorPage from 'components/pages/movies/ActorPage'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import { useTranslation } from 'i18n'
import axios from 'utils/axios'
import router from 'next/router'

export default function Movies() {
    const { i18n } = useTranslation()
    const [actorData, setActorData] = useState()
    useEffect(() => {
        if (i18n?.language && router?.query?.slug) {
            axios
                .get(`staff/${router?.query?.slug}`, {
                    params: {
                        lang: i18n.language,
                    },
                })
                .then((response) => {
                    setActorData(response?.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        if (router?.query?.id) {
            axios
                .get(`megogo/people?id=${router?.query?.id}`, {
                    params: {
                        lang: i18n.language,
                    },
                })
                .then((response) => {
                    setActorData({ ...response?.data?.data, is_megogo: true })
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [i18n?.language])
    return (
        <>
            <SEO />
            <ActorPage data={actorData ? actorData : {}} />
        </>
    )
}

// export async function getServerSideProps(ctx) {
//     const { query } = ctx

//     const urls = [{ endpoint: `megogo/people?id=${query.id}` }]

//     const [actor] = await fetchMultipleUrls(urls, ctx)

//     const megago_actor = {
//         staff: {
//             id: actor?.data.id || 0,
//             first_name: actor?.data.name || '',
//             biography: actor?.data?.career || '',
//             slug: actor?.data.slug || '',
//             photo: actor?.data.avatar || '',
//         },
//         movies:
//             actor?.data.filmography.map((item) => ({
//                 movie: { ...item, is_megago: true },
//             })) || [],
//         is_megago: true,
//     }

//     return {
//         props: {
//             megago_actor: megago_actor ?? [],
//         },
//     }
// }
