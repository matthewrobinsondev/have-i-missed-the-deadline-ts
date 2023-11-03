import { Player, PlayerTransferKey } from "../types/fpl/Players";

interface Props {
    transferredPlayers: Player[];
    column_name: string;
    field: PlayerTransferKey;
}

export const TransferTable: React.FC<Props> = ({ transferredPlayers, column_name, field }) => {

    return (
        <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
                <tr>
                    <th className="px-2 py-1 text-xs sm:px-6 sm:py-3 font-medium uppercase tracking-wider">First Name</th>
                    <th className="px-2 py-1 text-xs sm:px-6 sm:py-3 font-medium uppercase tracking-wider">Last Name</th>
                    <th className="px-2 py-1 text-xs sm:px-6 sm:py-3 font-medium uppercase tracking-wider">Team</th>
                    <th className="px-2 py-1 text-xs sm:px-6 sm:py-3 font-medium uppercase tracking-wider">{column_name}</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {transferredPlayers.map((player: Player) => (
                    <tr key={player.id}>
                        <td className="px-2 py-1 text-xs sm:px-6 sm:py-4 whitespace-nowrap">{player.first_name}</td>
                        <td className="px-2 py-1 text-xs sm:px-6 sm:py-4 whitespace-nowrap">{player.second_name}</td>
                        <td className="px-2 py-1 text-xs sm:px-6 sm:py-4 whitespace-nowrap">{player.team}</td>
                        <td className="px-2 py-1 text-xs sm:px-6 sm:py-4 whitespace-nowrap">{player[field]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};