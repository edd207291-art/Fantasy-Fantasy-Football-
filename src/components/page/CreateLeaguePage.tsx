import { MutedText, PageHeading } from "@/components/ui/Typography";
import { initializeLeague } from "@/scripts/initzlizeLeague";
import { useAppDispatch } from "@/store/hooks";
import { TouchableOpacity } from "react-native";

export default function CreateLeaguePage() {
  const dispatch = useAppDispatch();

  return (
    <>
      <PageHeading className="mb-2">Create Your League</PageHeading>
      <TouchableOpacity
        onPress={() => dispatch(initializeLeague())}
        className="items-center rounded bg-blue-600 px-5 py-3"
      >
        <MutedText className="font-semibold text-white">
          Create League
        </MutedText>
      </TouchableOpacity>
    </>
  );
}
