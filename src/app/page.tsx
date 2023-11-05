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
    <main className="flex flex-col items-center justify-between lg:p-20">
      <Countdown deadline={deadline} />
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 pt-10">
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
    </div>
    </main>
  );
}
