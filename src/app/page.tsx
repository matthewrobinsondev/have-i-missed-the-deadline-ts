import Countdown from "./components/Countdown";
import { TransferTable } from "./components/TransferTable";
import { FplService } from "./fpl/FplService";
import FplApi from "./third-party/FplApi";

export default async function Home() {
  const fplApi = new FplApi();
  const fplService = new FplService(fplApi);
  const deadline = await fplService.getDeadline();
  const topTransferredIn = await fplService.getTopTransferredIn();
  const topTransferredOut = await fplService.getTopTransferredOut();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Countdown deadline={deadline} />
      <TransferTable
        transferredPlayers={topTransferredIn}
        column_name="Transfers In"
        field="transfers_in_event"
      />
      <TransferTable
        transferredPlayers={topTransferredOut}
        column_name="Transfers Out"
        field="transfers_out_event"
      />
    </main>
  );
}
