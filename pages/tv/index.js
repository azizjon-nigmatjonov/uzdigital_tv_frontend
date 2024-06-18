import { useEffect, useState } from 'react'
import ChannelsPage from 'components/pages/tv/ChannelsPage'
import SEO from 'components/SEO'
import axios from '../../utils/axios'
import { useSelector } from 'react-redux'
import { useDebounce } from 'hooks/useDebounce'
export default function Movies() {
    const [channel_category, setChannelCategory] = useState(null)
    const tvSearchValue = useSelector(
        (state) => state.searchReducer.tv_search_value,
    )
    const tvSearchValueTyping = useSelector(
        (state) => state.searchReducer.tv_search_value_typing,
    )
    const [channels_list, SetChannelsList] = useState([])
    const debouncedSearchTerm = useDebounce(tvSearchValueTyping, 500)
    useEffect(() => {
        axios
            .get('tv/category')
            .then((response) => {
                setChannelCategory(response?.data?.categories)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])
    useEffect(() => {
        axios
            .get(
                `tv/channel${
                    tvSearchValue ? `?category=${tvSearchValue}` : ''
                }${`${
                    debouncedSearchTerm ? `?search=${debouncedSearchTerm}` : ''
                }`}`,
            )
            .then((response) => {
                SetChannelsList(response?.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [tvSearchValue, debouncedSearchTerm])

    return (
        <>
            <SEO />

            <ChannelsPage
                channel_category={channel_category ? channel_category : []}
                channels_list={channels_list ? channels_list : []}
                tvSearchValue={tvSearchValue ? tvSearchValue : []}
            />
        </>
    )
}
