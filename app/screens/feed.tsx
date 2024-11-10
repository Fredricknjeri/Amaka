import VideoPost from "@/components/video-feed";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Stack } from 'expo-router';
import { View, StyleSheet, FlatList, FlatListProps, ViewToken } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppStackScreenProps } from "@/navigators"

interface FeedScreenProps extends AppStackScreenProps<"Feed"> { }

const FeedScreen: FC<FeedScreenProps> = ({ navigation }) => {
  const [activePostId, setActivePostId] = useState(dummyPosts[0].id)
  const [posts, setPosts] = useState<typeof dummyPosts>([])

  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(dummyPosts)
    }

    fetchPosts()
  }, [])

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged: ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0 && viewableItems[0].isViewable) {
          setActivePostId(viewableItems[0].item.id)
        }
      },
    },
  ])

  const onEndReached = () => {
    setPosts((currentPosts) => [...currentPosts, ...dummyPosts])
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <VideoPost post={item} activePostId={activePostId} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={3}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})

export default FeedScreen



const dummyPosts = [
  {
    id: '2',
    video:
      'https://assets.mixkit.co/videos/1261/1261-360.mp4',
    caption: 'What they mean by wet feet😅',
  },
  {
    id: '1',
    video:
      'https://assets.mixkit.co/videos/39765/39765-720.mp4',
    caption: 'My dad is awesome',
  },
  {
    id: '3',
    video:
      'https://assets.mixkit.co/videos/34423/34423-360.mp4',
    caption: 'Shoot with the best photographer @DominicJ',
  },
  {
    id: '4',
    video:
      'https://assets.mixkit.co/videos/32746/32746-360.mp4',
    caption: 'Dance practice, just because i can do it',
  },
  {
    id: '5',
    video:
      'https://cdn.pixabay.com/video/2023/03/15/154787-808530571_large.mp4',
    caption: 'Sunset!!',
  },
];

