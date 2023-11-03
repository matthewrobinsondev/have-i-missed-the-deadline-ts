import { SignInButton, SignOutButton, UserButton, auth, currentUser } from "@clerk/nextjs";
import Countdown from "./components/Countdown";
import { TransferTable } from "./components/TransferTable";
import { FplService } from "./fpl/FplService";
import FplApi from "./third-party/FplApi";
import { log } from "next-axiom";

export default async function Home() {
  const fplApi = new FplApi();
  const fplService = new FplService(fplApi);
  const deadline = await fplService.getDeadline();
  const topTransferredIn = await fplService.getTopTransferredIn();
  const topTransferredOut = await fplService.getTopTransferredOut();
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to logged in users
  }

  // Get the User object when you need access to the user's information
  const user = await currentUser();
  
  // Use `user` to render user details or create UI elements
  
  log.info(`User ID is: ${userId}`);
  log.info(`User is: ${user}`);

  return (
    <main className="flex flex-col items-center justify-between lg:p-20">
      {!user ? (
        <SignInButton/>) : (
          <SignOutButton/>
        )}
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
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
