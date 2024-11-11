import {
    View,
    Text,
    StyleSheet,
    Pressable,
    useWindowDimensions,
    Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';

// Dummy comments data
const dummyComments: Comment[] = [
    {
        id: '1',
        username: '@zereee',
        comment: 'I love you grace with all my heart and brain,',
        timeAgo: '2d',
        likes: 4,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        id: '2',
        username: '@tobiRama',
        comment: 'Baba why say you dey do that',
        timeAgo: '2d',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        id: '3',
        username: '@pinkyswear',
        comment: 'Slay girl 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥',
        timeAgo: '30min',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
];
interface Comment {
    id: string;
    username: string;
    comment: string;
    timeAgo: string;
    likes?: number;
    avatar: string;
}


type VideoPost = {
    post: {
        id: string;
        video: string;
        caption: string;
    };
    activePostId: string;
};

const VideoPost = ({ post, activePostId }: VideoPost) => {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    const isPlaying = status?.isLoaded && status.isPlaying;
    const { height } = useWindowDimensions();

    // Bottom sheet callbacks
    const handleCommentsPress = useCallback(() => {
        console.log('HERE', bottomSheetRef.current?.expand())
        bottomSheetRef.current?.expand();
        setIsBottomSheetOpen(true);
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        setIsBottomSheetOpen(index > -1);
    }, []);

    // Video playback effects
    useEffect(() => {
        if (!video.current) return;
        if (activePostId !== post.id) {
            video.current.pauseAsync();
        }
        if (activePostId === post.id) {
            video.current.playAsync();
        }
    }, [activePostId, video.current]);

    const onPress = () => {
        if (!video.current) return;
        if (isPlaying) {
            video.current.pauseAsync();
        } else {
            video.current.playAsync();
        }
    };


    const Comment = ({ comment }: { comment: Comment }) => (
        <View style={styles.commentContainer}>
            <Image source={{ uri: comment.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.username}>{comment.username}</Text>
                    <Text style={styles.timeAgo}>{comment.timeAgo}</Text>
                </View>
                <View style={styles.commentTextContainer}>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                </View>
                {comment.likes && (
                    <View style={styles.commentActions}>
                        <View style={styles.likesContainer}>
                            <Ionicons name="heart" size={12} color="red" />
                            <Text style={styles.likesCount}>{comment.likes}</Text>
                        </View>
                        <Text style={styles.replyText}>Reply</Text>
                    </View>
                )}
            </View>
        </View>
    )

    return (
        <View style={[styles.container, { height }]}>
            <Video
                ref={video}
                style={[StyleSheet.absoluteFill, styles.video]}
                source={{ uri: post.video }}
                resizeMode={ResizeMode.COVER}
                onPlaybackStatusUpdate={setStatus}
                isLooping
            />

            <Pressable onPress={onPress} style={styles.content}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={[StyleSheet.absoluteFillObject, styles.overlay]}
                />
                {!isPlaying && (
                    <Ionicons
                        style={{ position: 'absolute', alignSelf: 'center', top: '50%' }}
                        name="play"
                        size={70}
                        color="rgba(255, 255, 255, 0.6)"
                    />
                )}
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.footer}>
                        <View style={styles.leftColumn}>
                            <Text style={styles.caption}>{post.caption}</Text>
                        </View>

                        <View style={styles.rightColumn}>
                            <Ionicons name="heart" size={35} color="white" />
                            <Pressable onPress={handleCommentsPress}>
                                <Ionicons name="chatbubble-outline" size={35} color="white" />
                            </Pressable>
                            <Ionicons name="share-social-sharp" size={35} color="white" />
                            <Ionicons name="bookmark" size={35} color="white" />
                        </View>
                    </View>
                </SafeAreaView>
            </Pressable>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['70%']}
                onChange={handleSheetChanges}
                enablePanDownToClose
                backgroundStyle={styles.bottomSheetBackground}
            >
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.bottomSheetTitle}>Comments</Text>
                    <Pressable onPress={() => bottomSheetRef.current?.close()}>
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable>
                </View>
                <ScrollView style={styles.commentsList}>
                    {dummyComments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                </ScrollView>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    video: {},
    content: {
        flex: 1,
        padding: 10,
    },
    overlay: {
        top: '50%',
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    leftColumn: {
        flex: 1,
    },
    caption: {
        color: 'white',
        fontFamily: 'Inter',
        fontSize: 18,
    },
    rightColumn: {
        gap: 10,
    },
    bottomSheetBackground: {
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    // bottomSheetHeader: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     padding: 16,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#eee',
    // },
    // bottomSheetTitle: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    commentsList: {
        padding: 16,
    },
    // commentContainer: {
    //     flexDirection: 'row',
    //     marginBottom: 20,
    // },
    // avatar: {
    //     width: 40,
    //     height: 40,
    //     borderRadius: 20,
    //     marginRight: 12,
    // },
    // commentContent: {
    //     flex: 1,
    // },
    // commentHeader: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 4,
    // },
    // username: {
    //     fontWeight: 'bold',
    //     marginRight: 8,
    // },
    // timeAgo: {
    //     color: '#666',
    //     fontSize: 12,
    // },
    // commentText: {
    //     fontSize: 14,
    //     lineHeight: 20,
    // },
    // likesContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginTop: 4,
    // },
    // likesCount: {
    //     fontSize: 12,
    //     color: '#666',
    //     marginLeft: 4,
    // },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingHorizontal: 16,
      },
      avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
      },
      commentContent: {
        flex: 1,
      },
      commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      username: {
        fontWeight: '600',
        fontSize: 14,
        marginRight: 8,
        color: '#000',
      },
      timeAgo: {
        color: '#666',
        fontSize: 14,
      },
      commentTextContainer: {
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
      },
      commentText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000',
      },
      commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 16,
      },
      likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      likesCount: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
      },
      replyText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
      },
      bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      bottomSheetTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
      },
      closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F2F5',
        alignItems: 'center',
        justifyContent: 'center',
      },
    
});

export default VideoPost;