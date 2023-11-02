import { Player, PlayerTransferKey } from "../types/fpl/Players";

interface Props {
    transferredPlayers: Player[];
    column_name: string;
    field: PlayerTransferKey;
}

export const TransferTable: React.FC<Props> = ({ transferredPlayers, column_name, field }) => {

    return (
        <table className="table-auto border-collapse border border-gray-400">
            <thead>
                <tr>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Team</th>
                    <th className="px-4 py-2">{column_name}</th>
                </tr>
            </thead>
            <tbody>
                {transferredPlayers.map((player: Player) => (
                    <tr key={player.id}>
                        <td className="border px-4 py-2">{player.first_name}</td>
                        <td className="border px-4 py-2">{player.second_name}</td>
                        <td className="border px-4 py-2">{player.team}</td>
                        <td className="border px-4 py-2">{player[field]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};