import { View, Text, TouchableOpacity, Image } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

import { images } from "@/constants/images";

type TrendingCardProps = {
  movie: {
    $id: string;
    movie_id: number;
    title: string;
    poster_url: string;
    count?: number;
  };
  index: number;
};

const TrendingCard = ({ movie: { movie_id, title, poster_url, count }, index }: TrendingCardProps) => {
  return (
    <TouchableOpacity className="w-32 relative pl-5" onPress={() => console.log(`Clicked movie_id: ${movie_id}`)}>
      {/* Movie Poster */}
      <Image
        source={{ uri: poster_url }}
        className="w-32 h-48 rounded-lg"
        resizeMode="cover"
      />

      {/* Ranking Badge */}
      <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
        <MaskedView
          maskElement={
            <Text className="font-bold text-white text-6xl">{index + 1}</Text>
          }
        >
          <Image
            source={images.rankingGradient}
            className="w-14 h-14"
            resizeMode="cover"
          />
        </MaskedView>
      </View>

      {/* Movie Title */}
      <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>
        {title}
      </Text>

      {/* Optional Search Count */}
      {count !== undefined && (
        <Text className="text-xs text-gray-300 mt-1">{count} searches</Text>
      )}
    </TouchableOpacity>
  );
};

export default TrendingCard;
