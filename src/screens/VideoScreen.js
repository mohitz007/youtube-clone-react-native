import React, { useCallback, useState,useRef, useEffect } from 'react';
import { View,StyleSheet,Alert,ActivityIndicator, Dimensions,FlatList, TouchableOpacity,Image } from 'react-native';
import { Text,Button,SearchBar, } from 'react-native-elements';
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from "react-native-vector-icons/FontAwesome";
import youtube from '../apis/youtube';

const VideoScreen = ({route,navigation}) => {


    const windowWidth = Dimensions.get('window').width;

    // const {videoId} = route.params;
    const [videoId, setvideoId] = useState(route.params.videoId);
    // console.log(videoId);
    // const videoId = "LaliHWoXWMw";
    const [playing, setPlaying] = useState(false);
    const [IsLoading, setIsLoading] = useState(true);
    const [Videos, setVideos] = useState([]);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
          Alert.alert("video has finished playing!");
        }
      }, []);

      const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
      }, []);


      const fetchSuggestions = async () => {
            const response = await youtube.get("/search",{
                params : {
                    relatedToVideoId : videoId,
                    maxResults : 10,

                }
            })
            .then((response) => {
                setVideos(response.data.items.filter((item)=> {
                    if(item.snippet) {
                        return true
                    }
                    return false
                }))
            })
      }
      useEffect(() => {
          fetchSuggestions();
          
      },[]);


    //   console.log(Videos.length,Videos);
      return (
          
        // <View>
        <>
          <YoutubePlayer
            onReady={()=>{setIsLoading(false)}}
            height={250}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
          {IsLoading && ( < ActivityIndicator animating size="large" style={styles.loadingRing} /> )}
          <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
          <Text> Suggested videos</Text>
            <FlatList style={styles.suggestedList} data={Videos} keyExtractor={(item) => item.id.videoId} renderItem={({item}) => {
                return (
                    <TouchableOpacity onPress={()=> {setvideoId(item.id.videoId)}}>
                        <>
                        <Image source={{ uri: item.snippet.thumbnails.medium.url, height: item.snippet.thumbnails.medium.height, width: windowWidth }} />
                        <Text >{item.snippet.title}</Text>
                        </>
                    </TouchableOpacity>
                )
            }} />
            </>
        // </View>
      );
}

const styles = StyleSheet.create({
    loadingRing: {
        position : "absolute",
        marginTop : 150,
        marginHorizontal : 50,
        zIndex : 2,
    },
    suggestedList : {

    }
});



export default VideoScreen;