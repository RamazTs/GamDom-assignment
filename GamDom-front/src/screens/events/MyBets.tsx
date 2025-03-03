import React, { useEffect, useState } from 'react';
import { useJwt } from '../../providers/JwtProvider';
import axios from 'axios';

interface Bet {
  bet_id: string;
  event_id: string;
  event_name: string;
  bet_amount: string;
  odds: string;
}

const MyBets: React.FC = () => {
  const { token } = useJwt();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get("/api/events/bets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBets(response.data.bets || []);
      } catch (error) {
        import.meta.env.MODE === 'development' && console.error('Error fetching bets:', error);
      }
    };

    fetchBets();
  }, []);

  return (
    <>
      <h1 className="text-2xl mb-4 text-center text-orange-400">My Bets</h1>
      <p className="text-sm md:text-base text-white text-center mb-4">Here you can view your placed bets.</p>
      
      {bets.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <p className="text-gray-300 text-center">No bets placed yet. Start betting on sports events!</p>
        </div>
      ) : (
        <table className="min-w-full bg-gray-800 rounded-lg shadow-md text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-700 text-orange-400">
              <th className="py-1 sm:py-2 text-left px-2 sm:px-4">Event</th>
              <th className="py-1 sm:py-2 text-center px-2 sm:px-4">Amount</th>
              <th className="py-1 sm:py-2 text-center px-2 sm:px-4">Odds</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr key={bet.bet_id} className="border-b border-gray-600">
                <td className="py-1 sm:py-2 px-2 sm:px-4 text-white">{bet.event_name}</td>
                <td className="py-1 sm:py-2 px-2 sm:px-4 text-center text-white">${bet.bet_amount}</td>
                <td className="py-1 sm:py-2 px-2 sm:px-4 text-center text-orange-400">{bet.odds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default MyBets; 