import Card from "@/components/ui/Card/Card";
import { BodyText, MutedText } from "@/components/ui/Typography";
import type { Club } from "@/types/club";
import type { Match } from "@/types/match";

type NextMatchCardProps = {
  match?: Match;
  clubs: Club[];
  managerClubId?: string;
};

export default function NextMatchCard({
  match,
  clubs,
  managerClubId,
}: NextMatchCardProps) {
  if (!match) {
    return (
      <Card>
        <MutedText>No upcoming matches this season.</MutedText>
      </Card>
    );
  }

  const homeClub = clubs.find((club) => club.id === match.homeClubId);
  const awayClub = clubs.find((club) => club.id === match.awayClubId);
  const managerIsHome = match.homeClubId === managerClubId;

  return (
    <Card>
      <BodyText className="font-semibold text-white">
        {homeClub?.name ?? "Unknown club"} vs {awayClub?.name ?? "Unknown club"}
      </BodyText>
      <MutedText className="mt-1">{managerIsHome ? "Home" : "Away"}</MutedText>
    </Card>
  );
}
