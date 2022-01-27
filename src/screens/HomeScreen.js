import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, SearchBar } from 'react-native-elements';
import youtube from '../apis/youtube';
import VideoList from '../components/VideoList'

const HomeScreen = () => {

    const [Search, setSearch] = useState("");
    const [Videos, setVideos] = useState(null);
    const [Quota, setQuota] = useState(true);
    const [IsLoading, setIsLoading] = useState(false);


    const onSearchSubmit = async () => {
        // console.log(Search);
        if(IsLoading)
            return;
        setIsLoading(true);
        const response = await youtube.get("/search", {
            params: {
                q: Search
            }
        })
            .then((response) => { setVideos(response.data); })
            .catch(() => {
                setQuota(false)
                return;
            })
            .finally(() => { setIsLoading(false)});
        // console.log(response.data);


    }

    useEffect(() => {
        onSearchSubmit();

    }, [])

    const updateVideoList = async () => {
        if(IsLoading)
            return;
        setIsLoading(true);
        const response = await youtube.get("/search", {
            params: {
                q: Search,
                pageToken: Videos.nextPageToken
            }
        })
            .then((response) => {
                const temp = { ...response.data, items: [...Videos.items, ...response.data.items] };
                setVideos(temp);
            })
            .catch(() => {
                setQuota(false)
                return;
            })
            .finally(() => { setIsLoading(false)});

        // response.data.items.push(Videos.items);

        // console.log(Videos.items.length());
        // console.log(Videos);
    }

    return (
        <View style={{ marginTop: 0, flex: 1 }}>
            <SearchBar placeholder="Search Video" value={Search} onChangeText={(text) => setSearch(text)} onSubmitEditing={onSearchSubmit} />
            {Quota ? null : <Text >Hi the youtube quota is finished. check tomorrow</Text>}
            <VideoList videos={Videos ? Videos.items : []} updateVideoList={updateVideoList} />
        </View>
    )
}


export default HomeScreen;