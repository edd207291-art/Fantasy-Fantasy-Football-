import Layout from "@/components/ui/Layout";
import { initializeClubs } from "@/store/clubsSlice";
import { useAppDispatch } from "@/store/hooks";
import { playFriendlyMatches } from "@/store/matchesSlice";
import { Text, TouchableOpacity } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const handleGenerateClubs = () => {
    dispatch(initializeClubs());
  };
  const handleGenerateMatches = () => {
    dispatch(playFriendlyMatches());
  };

  return (
    <Layout>
      <Text className="mb-2 text-3xl font-bold text-white">Home Page</Text>
      <TouchableOpacity onPress={handleGenerateClubs} className="items-center">
        <Text className="text-base text-slate-400">Generate Clubs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleGenerateMatches}
        className="items-center"
      >
        <Text className="text-base text-slate-400">Generate Matches</Text>
      </TouchableOpacity>
    </Layout>
  );
}
