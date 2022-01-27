import React from 'react';
import { FlatList, ScrollView, StyleSheet, Image, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';


const VideoList = ({ videos, updateVideoList }) => {

    const navigation = useNavigation();

    const windowWidth = Dimensions.get('window').width;
    // (videos);


    return (

        <FlatList
            data={videos}
            onEndReached={() => updateVideoList()}
            onEndReachedThreshold={0.5}
            keyExtractor={(item) => item.id.videoId} renderItem={
                ({ item }) => {
                    // console.log(item.id);
                    return (
                        <TouchableOpacity onPress={() => { navigation.navigate("Video", { videoId: item.id.videoId }) }} >
                            <View style={{ marginBottom: 10 }}>
                                <Image source={{ uri: item.snippet.thumbnails.medium.url, height: item.snippet.thumbnails.medium.height, width: windowWidth }} />
                                <Text style={styles.videoTitle}>{item.snippet.title}</Text>
                                <Text style={styles.channelTitle}>{item.snippet.channelTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            }
        />
    )
}

const styles = StyleSheet.create({
    videoList: {
        flex: 1,
    },
    channelTitle: {
        fontSize: 13,
        color: "#949087",
    },
    videoTitle: {
        fontWeight: "bold"
    }
})

export default VideoList;