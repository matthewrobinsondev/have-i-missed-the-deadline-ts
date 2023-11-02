import Countdown from "./components/countdown";
import { FplService } from "./fpl/FplService";
import FplApi from "./third-party/FplApi";

export default async function Home() {
  const fplApi = new FplApi();
  const fplService = new FplService(fplApi);
  const deadline = await fplService.getDeadline();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Countdown deadline={deadline} />
    </main>
  );
}
